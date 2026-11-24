const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'metrics.js'), 'utf8');
const apiSource = fs.readFileSync(path.join(root, 'api/metrics.ts'), 'utf8');
const apiJs = ts.transpileModule(apiSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
}

function browser(hostname, local = storage(), session = storage()) {
  const calls = [];
  const context = { window: {}, location: { hostname }, localStorage: local,
    sessionStorage: session, crypto: { randomUUID: () => '123e4567-e89b-42d3-a456-426614174000' },
    fetch: (url, options) => { calls.push({ url, options }); return Promise.resolve({ ok: true }); } };
  vm.runInNewContext(script, context);
  return { calls, context, local, session };
}

function api() {
  const module = { exports: {} };
  const calls = [];
  const context = { module, exports: module.exports, console,
    process: { env: { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SECRET_KEY: 'server-only' } },
    fetch: async (url, options) => { calls.push({ url, options }); return { ok: true, status: 201 }; } };
  vm.runInNewContext(apiJs, context);
  return { handler: module.exports.default, calls };
}

function response() {
  return { code: 200, headers: {}, setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; }, end() { return this; } };
}

test('production records one visit per tab session and sends only approved fields', () => {
  const first = browser('tile0.vercel.app');
  first.context.window.TileMetrics.track('school_selected', { school: 'private school name' });
  first.context.window.TileMetrics.track('made_up_event');
  assert.equal(first.calls.length, 2);
  const payload = JSON.parse(first.calls[1].options.body);
  assert.deepEqual(Object.keys(payload).sort(), ['event', 'session_id', 'visitor_id']);
  assert.equal(first.calls[1].url, '/api/metrics');
  const reload = browser('tile0.vercel.app', first.local, first.session);
  assert.equal(reload.calls.length, 0);
});

test('local previews do not send usage events', () => {
  const preview = browser('');
  preview.context.window.TileMetrics.track('visit');
  assert.equal(preview.calls.length, 0);
});

test('API rejects foreign origins and unknown events before writing', async () => {
  const { handler, calls } = api();
  const goodBody = { visitor_id: '123e4567-e89b-42d3-a456-426614174000',
    session_id: '123e4567-e89b-42d3-a456-426614174000', event: 'visit' };
  const foreign = await handler({ method: 'POST', headers: { origin: 'https://example.com' }, body: goodBody }, response());
  const invalid = await handler({ method: 'POST', headers: { origin: 'https://tile0.vercel.app' }, body: { ...goodBody, event: 'secret' } }, response());
  assert.equal(foreign.code, 403);
  assert.equal(invalid.code, 400);
  assert.equal(calls.length, 0);
});

test('API stores a sanitized event without client supplied content', async () => {
  const { handler, calls } = api();
  const result = await handler({ method: 'POST', headers: { origin: 'https://tile0.vercel.app' },
    body: { visitor_id: '123e4567-e89b-42d3-a456-426614174000',
      session_id: '123e4567-e89b-42d3-a456-426614174000', event: 'school_selected',
      school: 'private school name' } }, response());
  assert.equal(result.code, 204);
  const saved = JSON.parse(calls[0].options.body);
  assert.deepEqual(Object.keys(saved).sort(), ['event_name', 'failure_reason', 'session_id', 'visitor_id']);
  assert.equal(saved.event_name, 'school_selected');
});
