const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const script = readFileSync(`${__dirname}/../script.js`, 'utf8');
const css = readFileSync(`${__dirname}/../style.css`, 'utf8');

function extract(name) {
  const start = script.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `${name} exists`);
  const end = script.indexOf('\n}\n', start) + 2;
  assert.ok(end > start, `${name} closes`);
  return script.slice(start, end);
}

function makeClockRuntime(reducedMotion = false) {
  let now = 0;
  let nextFrame = 1;
  const frames = new Map();
  class Span {
    constructor() {
      this.children = [];
      this.dataset = {};
      this.style = {};
      this.parentNode = null;
      this.className = '';
      this.textContent = '';
    }
    appendChild(child) {
      this.children.push(child);
      child.parentNode = this;
    }
    querySelector(selector) {
      return this.children.find(child => selector === '.clock-second-value' && child.className === 'clock-second-value') || null;
    }
    remove() {
      if (!this.parentNode) return;
      this.parentNode.children = this.parentNode.children.filter(child => child !== this);
      this.parentNode = null;
    }
  }
  const context = {
    document: { hidden: false, createElement: () => new Span() },
    window: { matchMedia: () => ({ matches: reducedMotion }) },
    performance: { now: () => now },
    requestAnimationFrame: callback => { const id = nextFrame++; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
  };
  const runtime = vm.runInNewContext(`
    const clockSecondAnimations = new WeakMap();
    ${extract('sampleClockSpring')}
    ${extract('sampleClockSecondMotion')}
    ${extract('applyClockSecondMotion')}
    ${extract('renderClockSeconds')}
    ${extract('renderClockSecondDigits')}
    ({ sampleClockSpring, sampleClockSecondMotion, renderClockSeconds, renderClockSecondDigits, clockSecondAnimations })
  `, context);
  return {
    ...runtime,
    window: new Span(),
    advance(ms) {
      now += ms;
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach(callback => callback(now));
    },
  };
}

test('thinking-clock spring reaches its target without bounce', () => {
  const clock = makeClockRuntime();
  const samples = [0, 0.05, 0.1, 0.2, 0.4, 0.65].map(time => clock.sampleClockSpring(1, 0, 0, time).value);
  assert.equal(samples[0], 1);
  assert.ok(samples.every((value, index) => value >= 0 && (index === 0 || value <= samples[index - 1])));
  assert.ok(samples.at(-1) < 0.001);
});

test('37 → 38 rolls only the ones digit; 39 → 40 rolls both', () => {
  const clock = makeClockRuntime();
  const tens = clock.window;
  const ones = new (clock.window.constructor)();
  const windows = [tens, ones];
  clock.renderClockSecondDigits(windows, '37');
  const oldTens = tens.children[0];
  clock.renderClockSecondDigits(windows, '38');
  assert.equal(tens.children.length, 1);
  assert.equal(tens.children[0], oldTens);
  assert.equal(ones.children.length, 2);
  clock.advance(700);
  clock.renderClockSecondDigits(windows, '39');
  clock.advance(700);
  clock.renderClockSecondDigits(windows, '40');
  assert.equal(tens.children.length, 2);
  assert.equal(ones.children.length, 2);
  assert.equal(tens.children.at(-1).textContent, '4');
  assert.equal(ones.children.at(-1).textContent, '0');
});

test('single-digit clipping viewport preserves presentation on interruption', () => {
  const clock = makeClockRuntime();
  clock.renderClockSeconds(clock.window, '9');
  assert.equal(clock.window.children.length, 1);
  clock.renderClockSeconds(clock.window, '0');
  clock.advance(70);
  const inFlight = clock.window.children.at(-1);
  const presentation = inFlight.style.transform;
  assert.notEqual(presentation, 'translate3d(0, 0, 0)');
  clock.renderClockSeconds(clock.window, '1');
  assert.equal(clock.window.children.length, 2);
  assert.equal(clock.window.children[0], inFlight);
  assert.equal(clock.window.children[0].style.transform, presentation);
  clock.advance(700);
  assert.equal(clock.window.children.length, 1);
  assert.equal(clock.window.children[0].textContent, '1');
  assert.equal(clock.window.children[0].style.transform, 'translate3d(0, 0, 0)');
  assert.match(css, /\.clock-seconds-window\s*\{[^}]*overflow:\s*hidden/s);
});

test('reduced motion uses a 150ms opacity crossfade without vertical movement', () => {
  const clock = makeClockRuntime(true);
  clock.renderClockSeconds(clock.window, '9');
  clock.renderClockSeconds(clock.window, '0');
  clock.advance(75);
  assert.ok(clock.window.children.every(child => child.style.transform === 'translate3d(0, 0%, 0)'));
  clock.advance(75);
  assert.equal(clock.window.children.length, 1);
  assert.equal(clock.window.children[0].textContent, '0');
});

test('setup login glow uses the account glow strength', () => {
  assert.match(css, /\.account-lightframe-action::before\s*\{[^}]*filter:\s*blur\(12px\) saturate\(1\.22\) brightness\(1\.08\)/s);
  assert.doesNotMatch(css, /\.setup-account-action::before\s*\{/);
  assert.match(css, /\.account-lightframe-action:focus-within::before,\s*\.account-lightframe-action:active::before\s*\{[^}]*opacity:\s*0\.88/s);
});
