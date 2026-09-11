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
  const end = helper('getDayScheduleEnd', {
    scheduleRanges: [{ name: '종례', end: '16:30' }, { name: '석식', end: '18:20' }, { name: '방과후 3', end: '20:50' }],
    document: { querySelectorAll: selector => selector.startsWith('thead')
      ? Array.from({ length: 5 }, (_, i) => ({ dataset: { day: i + 1 } })) : rows },
  });
  assert.equal(end(1), '20:50');
  rows.pop();
  assert.equal(end(1), '16:30');
  assert.equal(end(0), null);
});
