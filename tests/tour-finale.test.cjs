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
  const classes = new Set(['is-open']);
  const context = {
    tileDemoTimer: 0, tileTourFrame: 0,
    window: { clearTimeout() {} }, cancelAnimationFrame() {},
    tileDemo: { classList: { add: name => classes.add(name), contains: name => classes.has(name) } },
    document: { getElementById: () => begin },
  };
  const finale = vm.runInNewContext(`(${source.slice(start, end)})`, { ...context, tileTourNeedsSchoolSetup: true });
  finale();
  assert.equal(label.textContent, 'Tile 시작하기');
  assert.equal(hint.textContent, '다음으로 학교와 학급을 연결해요');
  assert.equal(begin.hidden, false);
  assert.equal(begin.focusCalled, true);
  assert.equal(classes.has('is-finale'), true);
  finale();
  assert.equal(classes.size, 2, 'the finale cannot restart once it is visible');
});

test('skipping the guide leads to Tile 시작하기 instead of closing the tour', () => {
  const skipStart = source.indexOf('function skipTileTour()');
  const skipEnd = source.indexOf('\n}\n', skipStart) + 2;
  let finaleCount = 0;
  const skip = vm.runInNewContext(`(${source.slice(skipStart, skipEnd)})`, {
    showTileTourFinale: () => { finaleCount++; },
  });
  skip();
  assert.equal(finaleCount, 1);
  assert.match(source, /tileDemoClose\?\.addEventListener\("click", skipTileTour\)/);
  assert.match(source, /event\.key === "Escape"[\s\S]*?skipTileTour\(\)/);
});

test('finale focus trap ignores hidden tutorial controls', () => {
  const focusStart = source.indexOf('function getTileTourFocusableButtons()');
  const focusEnd = source.indexOf('\n}\n', focusStart) + 2;
  const begin = { hidden: false, disabled: false, getClientRects: () => [1] };
  const oldNext = { hidden: false, disabled: false, getClientRects: () => [1] };
  const focusable = vm.runInNewContext(`(${source.slice(focusStart, focusEnd)})`, {
    tileDemo: { querySelectorAll: () => [begin, oldNext] },
    getComputedStyle: button => ({ visibility: button === begin ? 'visible' : 'hidden' }),
  });
  assert.equal(focusable().length, 1);
  assert.equal(focusable()[0], begin);
});
