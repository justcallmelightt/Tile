const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

test('saved weekly row order restores and moving a lesson keeps its cells attached', () => {
  const source = readFileSync(`${__dirname}/../period-order.js`, 'utf8');
  const saved = ['조회', '1교시', '중식', '6교시', '2교시'];
  const makeRow = (name, top) => {
    const header = {
      button: null,
      querySelector() { return this.button; },
      append(button) { this.button = button; button.row = row; },
    };
    const row = {
      dataset: { period: name }, style: {}, header, subject: { value: `${name} 과목` },
      classList: { add() {}, remove() {} },
      querySelector(selector) { return selector === 'th' ? header : null; },
      getBoundingClientRect() { return { top, height: 60 }; },
    };
    return row;
  };
  const body = {
    rows: [makeRow('조회', 0), makeRow('1교시', 60), makeRow('2교시', 120), makeRow('6교시', 180), makeRow('중식', 240)],
    events: {},
    addEventListener(type, callback) { this.events[type] = callback; },
    setPointerCapture() {}, hasPointerCapture() { return true; }, releasePointerCapture() {},
    append(row) { this.rows = this.rows.filter(item => item !== row); this.rows.push(row); },
    insertBefore(row, target) {
      this.rows = this.rows.filter(item => item !== row);
      const index = target ? this.rows.indexOf(target) : -1;
      this.rows.splice(index < 0 ? this.rows.length : index, 0, row);
    },
  };
  const saveCalls = [];
  const context = {
    window: {
      matchMedia: () => ({ matches: false }),
      TileApp: { savePeriodOrder(order) { saveCalls.push(order); return true; }, updateCurrentStatus() {} },
    },
    document: {
      querySelector: () => body,
      createElement: () => ({
        setAttribute() {}, addEventListener(type, callback) { this[type] = callback; },
        closest() { return this.row; }, focus() {},
      }),
    },
    localStorage: { getItem: () => JSON.stringify(saved) },
    cancelAnimationFrame() {}, requestAnimationFrame() {}, performance: { now: () => 0 },
  };
  vm.runInNewContext(source, context);
  assert.deepEqual(body.rows.map(row => row.dataset.period), saved);
  const row = body.rows.find(item => item.dataset.period === '6교시');
  const originalCell = row.subject;
  row.header.button.keydown({
    key: 'ArrowUp', currentTarget: row.header.button,
    preventDefault() {}, stopPropagation() {},
  });
  assert.deepEqual(body.rows.map(item => item.dataset.period), ['조회', '1교시', '6교시', '중식', '2교시']);
  assert.equal(row.subject, originalCell);
  assert.deepEqual([...saveCalls[0]], body.rows.map(item => item.dataset.period));
  row.header.button.pointerdown({
    button: 0, pointerId: 9, clientY: 180, currentTarget: row.header.button,
    preventDefault() {}, stopPropagation() {},
  });
  body.events.pointermove({ pointerId: 9, clientY: 190, preventDefault() {} });
  assert.equal(row.style.transform, 'translate3d(0, 10px, 0)');
  const normalized = context.window.TilePeriodOrder.normalizePeriodOrder(['6교시', '6교시', '없는 교시'], body.rows);
  assert.deepEqual([...normalized], ['6교시', '조회', '1교시', '중식', '2교시']);
});
