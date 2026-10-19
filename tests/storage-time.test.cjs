const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

// Exercise the production helpers without booting the DOM-driven application.
const source = readFileSync(`${__dirname}/../script.js`, 'utf8');
function helper(name, globals = {}) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1);
  const end = source.indexOf('\n}\n', start) + 2;
  return vm.runInNewContext(`(${source.slice(start, end)})`, globals);
}

test('time ranges reject reversed, equal, malformed and out-of-range times', () => {
  const parse = helper('parseTimeRange');
  for (const value of ['', '09:10 - 08:20', '08:20 - 08:20', '24:00 - 25:00', '08:60 - 09:10', 'invalid']) {
    assert.equal(parse(value), null, value);
  }
  assert.equal(JSON.stringify(parse('8:20 - 9:10')), '{"start":"08:20","end":"09:10"}');
});

test('object storage tolerates malformed JSON and unexpected shapes', () => {
  for (const stored of ['{', 'null', '[]', '42', '"text"', null]) {
    const read = helper('readJsonStorage', {
      localStorage: { getItem: () => stored }, console: { error() {} },
    });
    assert.equal(JSON.stringify(read('edits')), '{}');
  }
  const read = helper('readJsonStorage', {
    localStorage: { getItem: () => '{"1교시_0":"수학"}' },
  });
  assert.equal(read('edits')['1교시_0'], '수학');
});

test('blocked storage falls back without throwing', () => {
  const read = helper('readJsonStorage', {
    localStorage: { getItem() { throw new Error('Storage blocked'); } },
    console: { error() {} },
  });
  assert.equal(JSON.stringify(read('edits')), '{}');
  assert.equal(read('undo', null), null);
});

test('explicit empty cell survives loading while malformed subjects are ignored', () => {
  const cell = { dataset: {} };
  const rendered = [];
  const load = helper('loadCellEdits', {
    CELL_EDIT_STORAGE_KEY: 'cells',
    localStorage: { getItem: () => JSON.stringify({ '방과후 A_0': '', '방과후 A_1': {} }) },
    document: { querySelector: () => ({ querySelectorAll: () => [cell, cell] }) },
    renderSubjectCell: (target, subject) => rendered.push(subject),
    console,
  });
  load();
  assert.deepEqual(rendered, ['']);
  assert.equal(cell.dataset.source, 'local');
});

test('Monday end follows actual lessons, not the former 16:30 constant', () => {
  const row = (name, subject, spanning = false) => ({
    dataset: { period: name },
    querySelectorAll: () => spanning
      ? [{ hasAttribute: () => true }]
      : Array.from({ length: 5 }, () => ({ dataset: { subject }, hasAttribute: () => false })),
  });
  const rows = [row('종례', '', true), row('석식', '', true), row('방과후 3', '수학')];
  const getScheduleItemForDay = (item, day) => ({ ...item, ...(item?.dayRanges?.[String(day)] || {}) });
  const end = helper('getDayScheduleEnd', {
    scheduleRanges: [{ name: '종례', end: '16:30', dayRanges: { 1: { start: '15:40', end: '16:10' } } }, { name: '석식', end: '18:20' }, { name: '방과후 3', end: '20:50' }],
    getScheduleItemForDay,
    document: { querySelectorAll: selector => selector.startsWith('thead')
      ? Array.from({ length: 5 }, (_, i) => ({ dataset: { day: i + 1 } })) : rows },
  });
  assert.equal(end(1), '20:50');
  rows.pop();
  assert.equal(end(1), '16:10');
  assert.equal(end(2), '16:30');
  assert.equal(end(0), null);
});

test('current-time overlay stays outside the table and follows its scrolled geometry', () => {
  const appended = [];
  const rect = (left, top, width, height) => ({ left, top, width, height, right: left + width });
  const lastCell = { getBoundingClientRect: () => rect(500, 210, 100, 60) };
  const row = {
    getBoundingClientRect: () => rect(120, 210, 480, 60),
    querySelector: () => ({ getBoundingClientRect: () => rect(120, 210, 100, 60) }),
    querySelectorAll: () => [lastCell],
  };
  const table = { getBoundingClientRect: () => rect(120, 100, 480, 700) };
  const shell = {
    scrollLeft: 40, scrollTop: 0,
    getBoundingClientRect: () => rect(100, 80, 400, 700),
    querySelector: () => table,
    querySelectorAll: () => [{ dataset: { period: '6교시' }, ...row }],
    appendChild: (node) => appended.push(node),
  };
  const document = {
    getElementById: () => shell,
    querySelector: () => row,
    createElement: () => ({ style: {}, offsetWidth: 84 }),
  };
  const render = helper('renderFloatingTimeline', {
    document, currentTimeEl: { dataset: { timeText: '오후 2:41:00' } },
    renderRollingStyleText() {}, getComputedStyle: () => ({ width: '84px' }),
  });
  render({ type: 'schedule' }, { name: '6교시' }, 4, 50);
  assert.equal(appended.length, 2);
  assert.equal(appended[0].style.top, '158.5px');
  assert.equal(appended[0].style.left, '64px');
  assert.equal(appended[1].style.width, '386px');
});

test('share exports the effective visible period times, including weekday overrides', () => {
  const exportTimes = helper('getShareableScheduleEdits', {
    scheduleRanges: [
      { name: '6교시', start: '14:00', end: '14:50', dayRanges: { 4: { start: '14:10', end: '15:00' } } },
      { name: '방과후 A', start: '16:30', end: '17:20' },
    ],
    document: { querySelectorAll: () => [{ dataset: { period: '6교시' } }] },
  });
  assert.equal(JSON.stringify(exportTimes()), JSON.stringify({
    '6교시': { start: '14:00', end: '14:50', days: { 4: { start: '14:10', end: '15:00' } } },
  }));
});

test('dialog motion reverses a pending close and reduced motion uses opacity only', async () => {
  const frames = [];
  const dialog = {
    open: false,
    addEventListener() {},
    showModal() { this.open = true; },
    close() { this.open = false; },
    animate(keyframes, options) {
      frames.push({ keyframes, options });
      return { finished: Promise.resolve(), cancel() {} };
    },
  };
  const move = helper('setNativeDialogVisible', {
    nativeDialogCancelBound: new WeakSet(), nativeDialogMotionState: new WeakMap(),
    dialogReduceMotion: { matches: true },
    getComputedStyle: () => ({ opacity: '0.5', transform: 'matrix(1, 0, 0, 1, 0, 4)', filter: 'blur(2px)' }),
  });
  move(dialog, true);
  move(dialog, false);
  move(dialog, true);
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(dialog.open, true);
  assert.equal(frames[2].keyframes[0].opacity, '0.5');
  assert.equal(frames[2].keyframes[0].transform, 'none');
  assert.equal(frames[2].options.duration, 150);
});

test('setup dialog finishes its exit before the next screen opens', async () => {
  const classes = new Set(['hidden']);
  const frames = [];
  const animate = (keyframes, options) => {
    frames.push({ keyframes, options });
    return { finished: Promise.resolve(), cancel() {} };
  };
  const card = { animate };
  const dialog = {
    classList: {
      contains: name => classes.has(name),
      add: name => classes.add(name),
      remove: name => classes.delete(name),
      toggle: (name, on) => on ? classes.add(name) : classes.delete(name),
    },
    querySelector: () => card, setAttribute() {}, animate,
  };
  const move = helper('setSetupDialogVisible', {
    dialogMotionState: new WeakMap(), dialogReduceMotion: { matches: false },
    getComputedStyle: () => ({ opacity: '1', transform: 'none', filter: 'none' }),
  });
  assert.equal(await move(dialog, true), true);
  assert.equal(classes.has('hidden'), false);
  assert.equal(frames[1].keyframes[0].opacity, 0);
  assert.equal(await move(dialog, false), true);
  assert.equal(classes.has('hidden'), true);
  assert.equal(frames[3].keyframes[1].opacity, 0);
});

test('inline panel can reopen during its closing animation', async () => {
  const classes = new Set();
  const panel = {
    dataset: {},
    classList: { contains: name => classes.has(name), add: name => classes.add(name), remove: name => classes.delete(name), toggle: (name, on) => on ? classes.add(name) : classes.delete(name) },
    setAttribute() {},
    animate: () => ({ finished: Promise.resolve(), cancel() {} }),
  };
  const show = helper('setInlinePanelVisible', {
    inlinePanelMotionState: new WeakMap(), dialogReduceMotion: { matches: false },
    getComputedStyle: () => ({ opacity: '0.6', transform: 'matrix(1, 0, 0, 1, 0, 3)' }),
  });
  show(panel, true);
  show(panel, false);
  show(panel, true);
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(classes.has('is-open'), true);
  assert.equal(panel.dataset.motionTarget, undefined);
});
