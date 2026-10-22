const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const source = readFileSync(`${__dirname}/../share.js`, 'utf8');
function helper(name, globals = {}) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1);
  const end = source.indexOf('\n  }', start) + 4;
  const prefix = source.slice(start - 6, start) === 'async ' ? 'async ' : '';
  return vm.runInNewContext(`(${prefix}${source.slice(start, end)})`, globals);
}

test('closing a shared preview restores the Tile URL and refreshes its timeline', () => {
  let currentUrl = 'https://tile.example/?theme=dark&share=abc';
  let refreshed = 0;
  let focused = 0;
  const close = helper('closeModal', {
    URL, URLSearchParams, PORTABLE_SHARE_HASH_KEY: 'showcase',
    nodes: { modal: {} }, lastTrigger: { focus: () => { focused += 1; } },
    document: { body: { classList: { remove() {} } } },
    window: {
      location: { get href() { return currentUrl; } },
      history: { replaceState(_state, _title, url) { currentUrl = url; } },
      TileApp: { setDialogVisible() {}, updateCurrentStatus() { refreshed += 1; } },
    },
  });
  close();
  assert.equal(currentUrl, 'https://tile.example/?theme=dark');
  assert.equal(refreshed, 1);
  assert.equal(focused, 1);
});

test('publishing an anonymous share keeps the current Tile address', async () => {
  const published = [];
  const create = helper('createShare', {
    nodes: { title: { value: '시간표' }, description: { value: '' }, create: {} },
    window: {
      TileAuth: { getClient: () => null, getSession: () => null },
      history: { replaceState() { throw new Error('app URL changed'); } },
    },
    safeText: (value) => String(value || ''), setBusy() {}, getScopes: () => ({}),
    buildPayload: () => ({}), shareUrl: (id) => `https://tile.example/?share=${id}`,
    clearComposerState() {}, renderShare: (share) => published.push(share), notify() {},
    fetch: async () => ({ ok: true, json: async () => ({ share: { id: 'abc' } }) }),
  });
  await create();
  assert.equal(published[0].url, 'https://tile.example/?share=abc');
});
