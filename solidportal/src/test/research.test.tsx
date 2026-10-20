import assert from 'node:assert/strict';
import {test} from 'node:test';
import React from 'react';
import {act, create} from 'react-test-renderer';
import Home from '../view/components/Home';
import Constants from '../view/utils/Constants';

test('Home dispatches research, consumes results and owns isolated resettable conversation IDs', async () => {
    const saved = new Map<string, string>();
    const timers = new Map<number, () => Promise<void>>();
    let timerId = 0;
    const original = {setInterval: globalThis.setInterval, clearInterval: globalThis.clearInterval};
    (globalThis as any).localStorage = {
        getItem: key => saved.get(key) ?? null,
        setItem: (key, value) => saved.set(key, value),
    };
    (globalThis as any).document = {querySelector: () => null};
    (globalThis as any).window = {addEventListener: () => {}, postMessage: () => {}};
    (globalThis as any).setInterval = callback => {timers.set(++timerId, callback); return timerId;};
    (globalThis as any).clearInterval = id => timers.delete(id);
    const http = (globalThis as any).researchHttp = {calls: [], error: null};
    const key = Constants.settingConstants;
    saved.set(key.CodebaseChecked, 'false');
    saved.set(key.NotionChecked, 'true');
    const mounted = [];
    async function mount() {
        let view;
        await act(async () => {view = create(<Home />);});
        mounted.push(view);
        await act(async () => {
            for (const callback of [...timers.values()]) {await callback();}
        });
        return view;
    }
    async function send(view, text) {
        const input = view.root.findByProps({placeholder: '@ files, /web public query, or /fetch public URL'});
        await act(async () => input.props.onChange(text));
        await act(async () => view.root.findByProps({'aria-label': 'Send message'}).props.onClick());
    }
    const research = () => http.calls.filter(call => call.url.endsWith('/webresearch'));
    try {
        const first = await mount();
        // Saved source choices survive initialization and /web bypasses both
        // Notion routing and missing codebase lists on a fresh installation.
        assert.equal(saved.get(key.NotionChecked), 'true');
        assert.equal(saved.get(key.CodebaseChecked), 'false');
        await act(async () => first.root.findByProps({placeholder: 'OpenAI API Token'})
            .props.onChange({target: {value: 'saved-model-key'}}));
        await send(first, '/web asyncio TaskGroup docs');
        assert.equal(research()[0].url, 'http://127.0.0.1:8000/webresearch');
        assert.equal(research()[0].body.openai_key, 'saved-model-key');
        assert.deepEqual(Object.keys(research()[0].body).sort(), ['command', 'openai_key', 'session_id']);
        assert.equal(first.root.findAllByType('a')[0].props.href, 'https://docs.python.org/3/');
        const id = research()[0].body.session_id;
        assert.match(id, /^[a-f0-9-]{36}$/);
        await send(first, '/fetch https://docs.python.org/3/');
        const second = await mount();
        await send(second, '/web pathlib docs');
        const other = research()[2].body.session_id;
        assert.notEqual(id, other);
        await send(first, '/web asyncio followup');
        await send(second, '/fetch https://example.org/');
        assert.deepEqual(research().map(call => call.body.session_id), [id, id, other, id, other]);
        http.error = 'Public research is disabled by the server.';
        await send(first, '/web another query');
        assert.ok(first.root.findAllByType('p').some(node => node.children.includes(http.error)));
        http.error = null;
        await send(first, '/web retry');
        assert.equal(research().at(-1).body.session_id, id);
        await act(async () => first.root.findByProps({'aria-label': 'New chat'}).props.onClick());
        await send(first, '/web fresh conversation');
        assert.notEqual(research().at(-1).body.session_id, id);
        assert.equal(saved.get(key.NotionChecked), 'true');
        // Ordinary messages still use the selected Notion workflow.
        saved.set(Constants.onBoardProject.NotionFileList, JSON.stringify(JSON.stringify([])));
        await send(first, 'explain my project');
        assert.ok(http.calls.at(-1).url.endsWith('/notionchatapi'));
        // Reset cancels a pending research request and ignores its stale answer.
        await act(async () => first.root.findByProps({'aria-label': 'New chat'}).props.onClick());
        const input = first.root.findByProps({placeholder: '@ files, /web public query, or /fetch public URL'});
        await act(async () => input.props.onChange('/web slow query'));
        http.hold = true;
        let pending;
        await act(async () => {
            pending = first.root.findByProps({'aria-label': 'Send message'}).props.onClick();
        });
        const activeSignal = research().at(-1).options.signal;
        await act(async () => first.root.findByProps({'aria-label': 'New chat'}).props.onClick());
        await act(async () => pending);
        assert.equal(activeSignal.aborted, true);
        assert.equal(first.root.findByProps({'aria-label': 'Send message'}).props.disabled, false);
        assert.ok(!first.root.findAllByType('p').some(node => node.children.includes('stale answer')));
    } finally {
        await act(async () => mounted.forEach(view => view.unmount()));
        globalThis.setInterval = original.setInterval;
        globalThis.clearInterval = original.clearInterval;
    }
});
