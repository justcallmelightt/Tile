const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const authSource = readFileSync(`${__dirname}/../auth.js`, 'utf8');
const scriptSource = readFileSync(`${__dirname}/../script.js`, 'utf8');
const html = readFileSync(`${__dirname}/../index.html`, 'utf8');

function helper(name, context) {
  const start = authSource.search(new RegExp(`(?:async )?function ${name}\\(`));
  assert.notEqual(start, -1);
  const end = authSource.indexOf('\n  }\n', start) + 4;
  return vm.runInNewContext(`(${authSource.slice(start, end)})`, context);
}

test('start flow has one original Lightframe sign-in entry beside local setup', () => {
  assert.match(html, /id="setupChooseSchool"/);
  assert.match(html, /id="setupChooseManual"/);
  assert.match(html, /id="setupAccountSignIn" class="account-lightframe-toggle setup-choice-login"[\s\S]*?로그인하여 시작하기/);
  assert.doesNotMatch(html, /id="setupChooseAccount"|id="setupChooseSignIn"/);
  assert.match(scriptSource, /getElementById\("setupAccountSignIn"\)[\s\S]*TileAuth\?\.openAccountSettings\?\.\(\)/);
  assert.doesNotMatch(authSource, /AUTH_RESTORE_KEY|AUTH_START_KEY|openAccountRestore|openAccountStart/);
});

test('completed sign-in does not automatically restore data', async () => {
  let restoreRequests = 0;
  const context = {
    sessionStorage: { getItem: () => null, removeItem() {} },
    currentSession: null, pendingRestore: null,
    nodes: { restorePanel: {}, deletePanel: {}, signedOut: {}, signedIn: {}, avatar: {}, displayName: {}, email: {} },
    setHidden() {}, setMessage() {}, setMethodsMessage() {},
    sessionSubscribers: new Set(), getInitial: () => 'T',
    window: { TileMetrics: { track() {} } },
    openAccountSettings() {}, prepareRestore: async () => { restoreRequests += 1; },
    renderLoginMethods: async () => {}, refreshBackupStatus: async () => {},
  };
  await helper('renderSession', context)({ user: { id: 'user-1', email: 'test@example.com' } });
  assert.equal(restoreRequests, 0);
});

test('account backup actions are manual and collapsed by default', () => {
  assert.match(html, /<details class="account-manual-backup">/);
  assert.match(html, /로그인만으로 클라우드에 저장되거나 다른 기기로 옮겨지지 않습니다/);
  assert.match(html, /id="backupCloudData"[^>]*>지금 백업하기/);
  assert.match(html, /id="restoreCloudData"[^>]*>백업 불러오기/);
  const sessionStart = authSource.indexOf('async function renderSession(');
  const sessionEnd = authSource.indexOf('\n  }\n', sessionStart) + 4;
  assert.doesNotMatch(authSource.slice(sessionStart, sessionEnd), /backupCurrentData\(/);
  assert.doesNotMatch(authSource.slice(sessionStart, sessionEnd), /prepareRestore\(/);
});

test('manual restore shows a preview and waits for confirmation', async () => {
  const backup = { version: 1, values: { school: 'saved' } };
  const context = {
    client: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { payload: backup, updated_at: '2026-11-12' }, error: null }) }) }) }) },
    currentSession: { user: { id: 'user-1' } }, pendingRestore: null,
    nodes: { manualBackup: { open: false }, restorePanel: { hidden: true }, restore: {}, restoreDescription: {} },
    setHidden: (node, hidden) => { node.hidden = hidden; },
    setBusy: () => {}, setMessage: () => {}, formatDate: () => '11월 12일',
  };
  await helper('prepareRestore', context)();
  assert.equal(context.nodes.manualBackup.open, true);
  assert.equal(context.nodes.restorePanel.hidden, false);
  assert.match(context.nodes.restoreDescription.textContent, /현재 데이터는 되돌리기용으로 보관합니다/);
});

test('last regular period travels with backups and shares without rejecting older data', () => {
  assert.match(scriptSource, /const TIMETABLE_SHARE_STORAGE_KEYS = \[[\s\S]*?"tile-last-regular-period"/);
  assert.match(scriptSource, /const USER_DATA_STORAGE_KEYS = \[[\s\S]*?"tile-last-regular-period"/);
  assert.match(scriptSource, /Object\.prototype\.hasOwnProperty\.call\(backup\.values, key\) \? backup\.values\[key\] : null/);
  assert.match(scriptSource, /\.filter\(row => !row\.classList\.contains\("is-beyond-last-period"\)\)/);
});

test('failed account restore leaves local data and undo history intact', () => {
  const start = scriptSource.indexOf('function restoreAccountBackup(');
  const end = scriptSource.indexOf('\n}\n', start) + 2;
  const stored = new Map([['tile-start-mode', 'manual'], ['tile-last-regular-period', '7'], ['tile-last-undo', 'previous undo']]);
  let failsOnce = true;
  const localStorage = {
    getItem: key => stored.get(key) ?? null,
    removeItem: key => stored.delete(key),
    setItem(key, value) {
      if (key === 'tile-start-mode' && value === 'school' && failsOnce) {
        failsOnce = false;
        throw new Error('Storage full');
      }
      stored.set(key, value);
    },
  };
  const restore = vm.runInNewContext(`(${scriptSource.slice(start, end)})`, {
    USER_DATA_STORAGE_KEYS: ['tile-start-mode', 'tile-last-regular-period'],
    LAST_PERIOD_STORAGE_KEY: 'tile-last-regular-period', UNDO_STORAGE_KEY: 'tile-last-undo',
    localStorage, captureUserDataSnapshot: () => ({ values: { 'tile-start-mode': 'manual', 'tile-last-regular-period': '7' } }),
    applySnapshotValues(values) {
      for (const [key, value] of Object.entries(values)) {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      }
      return true;
    },
    window: { location: { reload: () => assert.fail('must not reload after failed restore') } },
  });
  assert.throws(() => restore({ version: 1, values: { 'tile-start-mode': 'school', 'tile-last-regular-period': '4' } }), /Storage full/);
  assert.equal(stored.get('tile-start-mode'), 'manual');
  assert.equal(stored.get('tile-last-regular-period'), '7');
  assert.equal(stored.get('tile-last-undo'), 'previous undo');
});

test('older account backup clears local fields absent from that backup', () => {
  const start = scriptSource.indexOf('function restoreAccountBackup(');
  const end = scriptSource.indexOf('\n}\n', start) + 2;
  const stored = new Map([['tile-start-mode', 'manual'], ['tile-last-regular-period', '7']]);
  let reloaded = false;
  const localStorage = {
    getItem: key => stored.get(key) ?? null,
    removeItem: key => stored.delete(key),
    setItem: (key, value) => stored.set(key, value),
  };
  const restore = vm.runInNewContext(`(${scriptSource.slice(start, end)})`, {
    USER_DATA_STORAGE_KEYS: ['tile-start-mode', 'tile-last-regular-period'],
    LAST_PERIOD_STORAGE_KEY: 'tile-last-regular-period', UNDO_STORAGE_KEY: 'tile-last-undo',
    localStorage, captureUserDataSnapshot: () => ({ values: { 'tile-start-mode': 'manual', 'tile-last-regular-period': '7' } }),
    applySnapshotValues(values) {
      for (const [key, value] of Object.entries(values)) {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      }
      return true;
    },
    window: { location: { reload: () => { reloaded = true; } } },
  });
  restore({ version: 1, values: { 'tile-start-mode': 'school' } });
  assert.equal(stored.get('tile-start-mode'), 'school');
  assert.equal(stored.has('tile-last-regular-period'), false);
  assert.equal(reloaded, true);
});
