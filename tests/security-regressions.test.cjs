const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { webcrypto } = require('node:crypto');

function productionFunction(file, name, globals) {
  const source = readFileSync(`${__dirname}/../${file}`, 'utf8');
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1);
  const end = source.indexOf('\n  }', start) + 4;
  return vm.runInNewContext(`(${source.slice(start, end)})`, globals);
}

test('shared draft does not publish hidden school, teacher or memo storage', () => {
  const stored = {
    'tile-cell-edits': JSON.stringify({ '1교시_4': 'hidden' }),
    'tile-cell-info-edits': JSON.stringify({ '1교시_4': { teacher: 'hidden teacher' } }),
    'tile-subject-info-edits': JSON.stringify({ math: { teacher: 'hidden teacher' } }),
    'tile-custom-json': JSON.stringify({ teachers: { math: 'hidden teacher' }, classrooms: { math: 'hidden room' }, scheduleRanges: [{ name: '종례', start: '15:40', end: '16:00', secret: 'hidden' }] }),
    'tile-neis-sync-scope': 'hidden school code',
    tile_user: JSON.stringify({ school: { name: 'hidden school' } }),
    'tile-subject-memos': JSON.stringify({ '1교시_4': 'hidden memo' }),
    'tile-after-school': JSON.stringify({ items: [{ name: '방과후 A', start: '16:30', end: '17:20', teacher: 'hidden teacher' }], nextId: 3 }),
    'tile-schedule-edits': JSON.stringify({ '1교시': { start: '08:20', end: '09:10', days: {}, secret: 'hidden' } }),
  };
  const globals = {
    IMPORT_KEYS: ['tile-after-school', 'tile-schedule-edits', 'tile-cell-edits', 'tile-cell-info-edits', 'tile-subject-info-edits', 'tile-custom-json',
      'tile-neis-sync-scope', 'tile_user', 'tile-subject-memos', 'tile-memo-content', 'tile-period-info-edits'],
    localStorage: { getItem: key => stored[key] ?? null },
    readJson: key => JSON.parse(stored[key] || '{}'),
    safeText: (value, limit) => String(value || '').trim().slice(0, limit),
    draft: { rows: [{ period: '1교시', spanning: false, cells: [{ subject: 'math', room: 'shown room', teacher: 'shown teacher', memo: 'shown memo' }] }] },
  };
  const makeImportValues = productionFunction('share.js', 'makeImportValues', globals);
  const privateValues = makeImportValues({ school: false, details: false, subjectMemos: false, tileMemo: false });
  const serialized = JSON.stringify(privateValues);
  for (const secret of ['hidden school', 'hidden school code', 'hidden teacher', 'hidden room', 'hidden memo', 'shown teacher', 'shown room', 'shown memo', 'hidden']) {
    assert.equal(serialized.includes(secret), false, secret);
  }
  assert.equal(JSON.parse(privateValues['tile-cell-edits'])['1교시_0'], 'math');
  const detailed = makeImportValues({ school: true, details: true, subjectMemos: true, tileMemo: false });
  assert.equal(JSON.parse(detailed['tile-cell-info-edits'])['1교시_0'].teacher, 'shown teacher');
  assert.equal(JSON.parse(detailed['tile-subject-memos'])['1교시_0'], 'shown memo');
  assert.equal(JSON.stringify(detailed).includes('hidden teacher'), false);
});

test('shared preview and imported time settings use the same effective schedule', () => {
  const stored = { 'tile-schedule-edits': JSON.stringify({ '6교시': { start: '09:00', end: '09:50' } }) };
  const effective = { '6교시': { start: '14:00', end: '14:50', days: { 4: { start: '14:10', end: '15:00' } } } };
  const makeImportValues = productionFunction('share.js', 'makeImportValues', {
    IMPORT_KEYS: ['tile-schedule-edits'],
    localStorage: { getItem: key => stored[key] ?? null },
    readJson: () => ({}), safeText: value => String(value || ''),
    draft: { rows: [{ period: '6교시', spanning: true, cells: [] }] },
    window: { TileApp: { getShareableScheduleEdits: () => effective } },
  });
  const values = makeImportValues({ school: false, details: false, subjectMemos: false, tileMemo: false });
  assert.equal(JSON.stringify(JSON.parse(values['tile-schedule-edits'])), JSON.stringify(effective));
});

test('failed shared import restores every prior setting instead of leaving a partial timetable', () => {
  const values = new Map([['first', 'old first'], ['second', 'old second'], ['tile-last-undo', 'older undo']]);
  const localStorage = {
    getItem: key => values.get(key) ?? null,
    removeItem: key => values.delete(key),
    setItem(key, value) {
      if (key === 'second' && value === 'new second') throw new Error('Quota exceeded');
      values.set(key, value);
    },
  };
  const notices = [];
  const save = productionFunction('share.js', 'saveSharedTimetable', {
    validatedImportValues: () => ({ first: 'new first', second: 'new second' }),
    currentShare: { payload: {} }, USER_SNAPSHOT_KEYS: ['first', 'second'], IMPORT_KEYS: ['first', 'second'],
    localStorage, sessionStorage: { setItem() { throw new Error('Should not continue'); } },
    notify: (...args) => notices.push(args), console,
  });
  save();
  assert.deepEqual(Object.fromEntries(values), { first: 'old first', second: 'old second', 'tile-last-undo': 'older undo' });
  assert.equal(notices.length, 1);
});

test('custom timetable ignores malicious times but accepts valid day overrides', () => {
  const source = readFileSync(`${__dirname}/../script.js`, 'utf8');
  const start = source.indexOf('function loadCustomConfig()');
  const end = source.indexOf('\n}\n', start) + 2;
  const parseStart = source.indexOf('function parseTimeRange(');
  const parseEnd = source.indexOf('\n}\n', parseStart) + 2;
  const ranges = [{ name: '종례', start: '15:50', end: '16:30' }];
  const config = { scheduleRanges: [
    { name: '종례', start: '15:<img src=x onerror=void(0)>', end: '16:30' },
    { name: '종례', start: '15:40', end: '16:10', dayRanges: { 1: { start: '15:30', end: '16:00' }, 2: { start: '15:<img>', end: '16:00' } } },
  ] };
  const globals = {
    localStorage: { getItem: () => JSON.stringify(config) }, resetInfoMapsToDefault() {}, applyRoomBadges() {},
    teacherMap: {}, classroomMap: {}, scheduleRanges: ranges, console,
  };
  globals.parseTimeRange = vm.runInNewContext(`(${source.slice(parseStart, parseEnd)})`);
  vm.runInNewContext(`(${source.slice(start, end)})()`, globals);
  assert.equal(ranges[0].start, '15:40');
  assert.equal(ranges[0].dayRanges['1'].start, '15:30');
  assert.equal(ranges[0].dayRanges['2'], undefined);
  assert.equal(source.includes('content.innerHTML = `<strong>종례'), false);
});

test('anonymous share uses one quota-enforcing RPC and maps its limit to 429', async () => {
  const source = readFileSync(`${__dirname}/../api/share.ts`, 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const calls = [];
  let limited = false;
  const context = {
    exports: {}, process: { env: { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SECRET_KEY: 'server-only' } },
    crypto: webcrypto, TextEncoder, URLSearchParams, Date, console,
    fetch: async (url, options = {}) => {
      calls.push({ url, options });
      if (options.method === 'DELETE') return { ok: true };
      if (limited) return { ok: false, status: 400, json: async () => ({ code: 'P0001', message: 'anonymous_share_rate_limit' }) };
      return { ok: true, json: async () => ({ id: 'created' }) };
    },
  };
  vm.runInNewContext(js, context);
  const request = { method: 'POST', headers: { origin: 'https://tile0.vercel.app', 'x-real-ip': '203.0.113.1' },
    query: {}, body: { title: 'Class', description: '', payload: { version: 1 }, scopes: {} } };
  const response = () => ({ setHeader() {}, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });
  assert.equal((await context.exports.default(request, response())).code, 201);
  assert.equal(calls.filter(call => call.url.endsWith('/rest/v1/rpc/create_anonymous_tile_share')).length, 1);
  assert.equal(calls.some(call => call.url.includes('created_at=') || call.url.endsWith('/rest/v1/tile_timetable_shares')), false);
  limited = true;
  assert.equal((await context.exports.default(request, response())).code, 429);
});
