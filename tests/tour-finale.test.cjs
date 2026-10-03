const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const source = readFileSync(`${__dirname}/../script.js`, 'utf8');
const start = source.indexOf('function showTileTourFinale()');
const end = source.indexOf('\n}\n', start) + 2;

test('tour finale says Tile 시작하기 even when school setup follows', () => {
  const label = { textContent: '' };
  const hint = { textContent: '' };
  const begin = { hidden: true, focusCalled: false, querySelector: selector => selector === 'span' ? label : hint,
    focus() { this.focusCalled = true; } };
  const classes = [];
  const context = {
    tileDemoTimer: 0, tileTourFrame: 0,
    window: { clearTimeout() {} }, cancelAnimationFrame() {},
    tileDemo: { classList: { add: name => classes.push(name) } },
    document: { getElementById: () => begin },
  };
  const finale = vm.runInNewContext(`(${source.slice(start, end)})`, { ...context, tileTourNeedsSchoolSetup: true });
  finale();
  assert.equal(label.textContent, 'Tile 시작하기');
  assert.equal(hint.textContent, '다음으로 학교와 학급을 연결해요');
  assert.equal(begin.hidden, false);
  assert.equal(begin.focusCalled, true);
  assert.deepEqual(classes, ['is-finale']);
});
