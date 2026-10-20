"""Anonymous Parallel Search MCP over Streamable HTTP."""
import asyncio
import json
from urllib.parse import urlsplit
from urllib.request import getproxies, proxy_bypass

import aiohttp


ENDPOINT = "https://search.parallel.ai/mcp"
USER_AGENT = "SolidGPT/ParallelSearch (https://github.com/AI-Citizen/SolidGPT)"


class ResearchError(Exception):
    def __init__(self, message, status=502, retry_after=None):
        super().__init__(message)
        self.status = status
        self.retry_after = retry_after


async def call_tool(name, arguments):
    """Keep MCP connection state local; conversation identity comes from the caller."""
    headers = {"User-Agent": USER_AGENT,
               "Accept": "application/json, text/event-stream"}
    timeout = aiohttp.ClientTimeout(total=30)
    url = urlsplit(ENDPOINT)
    # Honor configured network proxies without loading ambient .netrc credentials.
    proxy = None if proxy_bypass(url.hostname) else getproxies().get(url.scheme)
    async with aiohttp.ClientSession(headers=headers, timeout=timeout) as client:
        async def request(method, params=None, request_id=None):
            payload = {"jsonrpc": "2.0", "method": method}
            if params is not None:
                payload["params"] = params
            if request_id is not None:
                payload["id"] = request_id
            async with client.post(ENDPOINT, json=payload, proxy=proxy, allow_redirects=False) as response:
                if response.status == 429:
                    raise ResearchError("Public research is rate limited. Try again later.",
                                        429, response.headers.get("Retry-After"))
                if response.status >= 300:
                    raise ResearchError("The public research service is unavailable.")
                if method == "initialize":
                    session = response.headers.get("Mcp-Session-Id")
                    if session:
                        client.headers["Mcp-Session-Id"] = session
                if request_id is None:
                    return None
                # The server may reply with JSON or SSE for the same HTTP transport.
                content_type = response.headers.get("Content-Type", "").split(";")[0]
                if content_type == "application/json":
                    chunks, size = [], 0
                    async for chunk in response.content.iter_chunked(16_384):
                        size += len(chunk)
                        if size > 1_000_000:
                            raise ResearchError("The research response is too large.")
                        chunks.append(chunk)
                    result = json.loads(b"".join(chunks))
                elif content_type == "text/event-stream":
                    data, size, result = [], 0, None
                    async for raw in response.content:
                        size += len(raw)
                        if size > 1_000_000:
                            raise ResearchError("The research response is too large.")
                        line = raw.decode("utf-8").rstrip("\r\n")
                        if line.startswith("data:"):
                            data.append(line[5:].lstrip(" "))
                        elif not line and data:
                            event = json.loads("\n".join(data))
                            data = []
                            if event.get("id") == request_id:
                                result = event
                                break
                else:
                    raise ResearchError("The research service returned an unsupported response.")
                if not isinstance(result, dict) or result.get("id") != request_id:
                    raise ResearchError("The research service returned an invalid response.")
                if "error" in result or not isinstance(result.get("result"), dict):
                    raise ResearchError("The research service could not complete the request.")
                return result["result"]

        try:
            initialized = await request("initialize", {
                "protocolVersion": "2025-03-26", "capabilities": {},
                "clientInfo": {"name": "SolidGPT", "version": "1.0"}}, 1)
            version = initialized.get("protocolVersion")
            if version not in ("2024-11-05", "2025-03-26", "2025-06-18"):
                raise ResearchError("The research service uses an unsupported MCP version.")
            client.headers["MCP-Protocol-Version"] = version
            await request("notifications/initialized")
            tools = await request("tools/list", {}, 2)
            if name not in [tool.get("name") for tool in tools.get("tools", [])]:
                raise ResearchError("The requested research tool is unavailable.")
            result = await request("tools/call", {"name": name, "arguments": arguments}, 3)
            if result.get("isError"):
                raise ResearchError("The research service could not complete the request.")
            text = "\n".join(block["text"] for block in result.get("content", [])
                             if block.get("type") == "text" and isinstance(block.get("text"), str))
            if not text.strip():
                raise ResearchError("The research service returned no readable sources.")
            return text[:25_000]
        except asyncio.TimeoutError:
            raise
        except aiohttp.ClientConnectionError:
            raise ResearchError("The public research service could not be reached.") from None
        except (aiohttp.ClientError, ValueError, TypeError, KeyError, AttributeError):
            raise ResearchError("The public research service returned an invalid response.") from None
