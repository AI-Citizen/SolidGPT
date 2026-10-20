"""Real research router and HTTP MCP transport; model inference is scripted."""
import asyncio
import json
import os
import threading
import time
import unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from types import SimpleNamespace
from unittest.mock import patch
from uuid import uuid4

import aiohttp
from fastapi import FastAPI
from fastapi.testclient import TestClient

from solidgpt.src.api import webresearch
from solidgpt.src.tools.web import parallel_search


class ResearchCallerTests(unittest.TestCase):
    def setUp(self):
        self.requests = []
        self.model_requests = []
        self.mode = "json"
        self.delay = 0
        self.tool_started = threading.Event()
        owner = self

        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *args):
                pass

            def do_POST(self):
                data = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
                owner.requests.append((self.path, dict(self.headers), data))
                method = data["method"]
                if method == "tools/call":
                    owner.tool_started.set()
                    time.sleep(owner.delay)
                    if owner.mode == "quota":
                        self.send_response(429)
                        self.send_header("Retry-After", "120")
                        self.end_headers()
                        return
                if method == "notifications/initialized":
                    self.send_response(202)
                    self.end_headers()
                    return
                if method == "initialize":
                    result = {"protocolVersion": "2025-03-26", "capabilities": {"tools": {}}}
                elif method == "tools/list":
                    result = {"tools": [{"name": "web_search"}, {"name": "web_fetch"}]}
                    if owner.mode == "missing_tool":
                        result = {"tools": []}
                else:
                    result = {"content": [{"type": "text", "text": (
                        'Title: Python docs\nURL: https://docs.python.org/3/\n'
                        'Excerpts: asyncio TaskGroup manages concurrent tasks.')} ]}
                    if owner.mode == "tool_error":
                        result["isError"] = True
                event = {"jsonrpc": "2.0", "id": data["id"], "result": result}
                self.send_response(200)
                self.send_header("Content-Type", "text/event-stream" if owner.mode == "sse" else "application/json")
                if method == "initialize":
                    self.send_header("Mcp-Session-Id", "transport-session")
                self.end_headers()
                raw = json.dumps(event)
                if owner.mode == "malformed":
                    raw = "not JSON"
                elif owner.mode == "sse":
                    raw = 'event: message\ndata: ' + raw + '\n\n'
                try:
                    middle = len(raw) // 2
                    self.wfile.write(raw[:middle].encode())
                    self.wfile.flush()
                    self.wfile.write(raw[middle:].encode())
                except (BrokenPipeError, ConnectionResetError):
                    pass

        self.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, kwargs={"poll_interval": .01}, daemon=True)
        self.thread.start()
        self.addCleanup(self.server.server_close)
        self.addCleanup(self.server.shutdown)
        self.endpoint = f"http://127.0.0.1:{self.server.server_port}/mcp"
        self.start_patch(patch.object(parallel_search, "ENDPOINT", self.endpoint))
        self.start_patch(patch.dict(os.environ, {}, clear=True))

        async def model(**kwargs):
            self.model_requests.append(kwargs)
            return SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(
                content="TaskGroup manages tasks. [Python docs](https://docs.python.org/3/)"))])

        self.start_patch(patch.object(webresearch.openai.ChatCompletion, "acreate", model))
        app = FastAPI()
        app.include_router(webresearch.router)
        self.client = TestClient(app)
        self.addCleanup(self.client.close)
        self.session = str(uuid4())

    def start_patch(self, item):
        value = item.start()
        self.addCleanup(item.stop)
        return value

    def query(self, command="/web asyncio TaskGroup docs", session=None, key="request-key"):
        return self.client.post("/webresearch", json={
            "command": command, "session_id": session or self.session, "openai_key": key})

    def calls(self):
        return [data["params"] for _, _, data in self.requests if data["method"] == "tools/call"]

    def test_anonymous_default_through_router_model_and_response(self):
        response = self.query()
        self.assertEqual(response.status_code, 200, response.text)
        self.assertIn("https://docs.python.org/3/", response.json()["result"])
        self.assertEqual(self.calls()[0]["arguments"], {
            "objective": "asyncio TaskGroup docs", "search_queries": ["asyncio TaskGroup docs"],
            "session_id": self.session})
        self.assertEqual([r[2]["method"] for r in self.requests],
                         ["initialize", "notifications/initialized", "tools/list", "tools/call"])
        for path, headers, data in self.requests:
            normalized = {k.lower(): v for k, v in headers.items()}
            self.assertEqual(path, "/mcp")
            self.assertEqual(normalized["user-agent"], parallel_search.USER_AGENT)
            self.assertNotIn("authorization", normalized)
            self.assertNotIn("request-key", json.dumps(data))
            if data["method"] != "initialize":
                self.assertEqual(normalized["mcp-session-id"], "transport-session")
                self.assertEqual(normalized["mcp-protocol-version"], "2025-03-26")
        model = self.model_requests[0]
        self.assertEqual(model["api_key"], "request-key")
        self.assertEqual(model["model"], webresearch.ConfigReader().get_property("openai_model"))
        self.assertIn("asyncio TaskGroup manages", model["messages"][1]["content"])

    def test_sse_fetch_and_interleaved_conversation_identity(self):
        self.mode = "sse"
        other = str(uuid4())
        for command, session in [("/web asyncio docs", self.session),
                                 ("/web pathlib docs", other),
                                 ("/fetch https://docs.python.org/3/", self.session),
                                 ("/fetch https://example.org/", other),
                                 ("/web asyncio followup", self.session)]:
            self.assertEqual(self.query(command, session).status_code, 200)
        self.assertEqual([call["arguments"]["session_id"] for call in self.calls()],
                         [self.session, other, self.session, other, self.session])
        self.assertEqual(self.calls()[2]["arguments"]["urls"], ["https://docs.python.org/3/"])

    def test_disabled_and_explicit_provider_never_fall_back(self):
        for provider, status in [("disabled", 403), ("unknown", 400)]:
            with patch.dict(os.environ, {"SOLIDGPT_WEB_SEARCH_PROVIDER": provider}):
                self.assertEqual(self.query().status_code, status)
        self.assertEqual(self.requests, [])
        self.assertEqual(self.model_requests, [])

    def test_invalid_commands_urls_keys_and_identity_do_not_call_network(self):
        for command in ("   ", "\t\n", "/web", "/fetch", "/other query", "/fetch file:///private", "/fetch https://user:pass@example.org",
                        "/fetch https://example.org/ https://other.org/", "/fetch https://example.org:bad"):
            self.assertEqual(self.query(command).status_code, 400, command)
        self.assertEqual(self.query(key="").status_code, 400)
        self.assertEqual(self.query(session="not-a-uuid").status_code, 422)
        self.assertEqual(self.requests, [])

    def test_quota_retry_keeps_identity_and_never_calls_model_on_error(self):
        self.mode = "quota"
        response = self.query()
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.headers["retry-after"], "120")
        self.assertEqual(self.model_requests, [])
        self.mode = "json"
        self.assertEqual(self.query().status_code, 200)
        self.assertEqual([call["arguments"]["session_id"] for call in self.calls()], [self.session] * 2)

    def test_protocol_and_tool_errors_are_visible(self):
        for mode in ("malformed", "missing_tool", "tool_error"):
            self.mode = mode
            self.assertEqual(self.query().status_code, 502, mode)
        self.assertEqual(self.model_requests, [])

    def test_real_http_timeout_is_reported(self):
        self.delay = .15
        timeout = aiohttp.ClientTimeout(total=.03)
        with patch.object(parallel_search.aiohttp, "ClientTimeout", return_value=timeout):
            self.assertEqual(self.query().status_code, 504)
        self.assertEqual(self.model_requests, [])

    def test_cancellation_propagates_from_router_and_retry_keeps_identity(self):
        self.delay = .15

        async def cancel_request():
            body = webresearch.ResearchRequest(command="/web asyncio docs", session_id=self.session,
                                              openai_key="request-key")
            task = asyncio.create_task(webresearch.web_research(body))
            for _ in range(100):
                if self.tool_started.is_set():
                    break
                await asyncio.sleep(.01)
            self.assertTrue(self.tool_started.is_set())
            task.cancel()
            with self.assertRaises(asyncio.CancelledError):
                await task

        asyncio.run(cancel_request())
        self.assertEqual(self.model_requests, [])
        self.delay = 0
        self.assertEqual(self.query().status_code, 200)
        self.assertEqual([call["arguments"]["session_id"] for call in self.calls()], [self.session] * 2)

    def test_model_credentials_are_request_scoped(self):
        original = webresearch.openai.api_key
        self.query(key="first-key")
        self.query(key="second-key")
        self.assertEqual([r["api_key"] for r in self.model_requests], ["first-key", "second-key"])
        self.assertEqual(webresearch.openai.api_key, original)

    def test_http_disconnect_cancels_actual_router_work(self):
        self.delay = .4

        async def disconnect_http():
            app = FastAPI()
            app.include_router(webresearch.router)
            incoming = asyncio.Queue()
            await incoming.put({"type": "http.request", "body": json.dumps({
                "command": "/web docs", "session_id": self.session,
                "openai_key": "request-key"}).encode(), "more_body": False})
            messages = []

            async def send(message):
                messages.append(message)

            scope = {"type": "http", "http_version": "1.1", "method": "POST",
                     "path": "/webresearch", "raw_path": b"/webresearch", "query_string": b"",
                     "scheme": "http", "server": ("testserver", 80), "client": ("127.0.0.1", 1),
                     "headers": [(b"content-type", b"application/json")]}
            task = asyncio.create_task(app(scope, incoming.get, send))
            for _ in range(100):
                if self.tool_started.is_set():
                    break
                await asyncio.sleep(.01)
            self.assertTrue(self.tool_started.is_set())
            await incoming.put({"type": "http.disconnect"})
            await asyncio.wait_for(task, 1)
            self.assertEqual(messages[0]["status"], 499)

        asyncio.run(disconnect_http())
        self.assertEqual(self.model_requests, [])


if __name__ == "__main__":
    unittest.main()
