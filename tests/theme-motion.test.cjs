const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

test('lit spotlight inverts and fades in place only after dark-to-light transition finishes', async () => {
  const source = readFileSync(`${__dirname}/../script.js`, 'utf8');
  const start = source.indexOf('async function switchTheme(');
  const end = source.indexOf('\n}\n', start) + 2;
  assert.ok(start >= 0 && end > start);
  const events = [];
  let finish;
  const completed = new Promise(resolve => { finish = resolve; });
  let light = false;
  const body = { classList: {
    contains: () => light,
    add: () => events.push('switching'),
    remove: () => events.push('settled'),
  } };
  const context = {
    document: { body, startViewTransition(callback) { callback(); return { finished: completed }; } },
    themeTransitionReducedMotion: { matches: false },
    startupSpotlight: { classList: { add() {} }, style: { opacity: '', transform: '', setProperty(name, value) { this[name] = value; }, removeProperty(name) { this[name] = ''; } } },
    stopThemeSpotlightAnimation() {},
    moveThemeSpotlight: async ({ darken, enter, stationary }) => events.push(darken && !enter && stationary ? 'black fades in place' : 'unexpected spotlight'),
    commitTheme: next => { light = next; events.push('light committed'); },
  };
  const run = vm.runInNewContext(`let themeSequence = 0, requestedThemeIsLight = false, activeThemeTransition = null, activeThemeSpotlightAnimation = null;\n(${source.slice(start, end)})(true)`, context);
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(events.slice(0, 2), ['switching', 'light committed']);
  assert.equal(events.includes('black fades in place'), false);
  assert.equal(context.startupSpotlight.style['--spotlight-rgb'], '0, 0, 0');
  const css = readFileSync(`${__dirname}/../style.css`, 'utf8');
  assert.match(css, /rgba\(var\(--spotlight-rgb\), 0\.88\) 0%,\s*transparent 34%/);
  assert.equal(context.startupSpotlight.style.opacity, '1');
  finish();
  await run;
  assert.deepEqual(events.slice(-2), ['settled', 'black fades in place']);
  assert.equal(source.slice(start, end).includes('replayWelcomeTitle'), false);
});

test('light-to-dark reveals the white beam only after the dark screen settles', async () => {
  const source = readFileSync(`${__dirname}/../script.js`, 'utf8');
  const start = source.indexOf('async function switchTheme(');
  const end = source.indexOf('\n}\n', start) + 2;
  const events = [];
  let finish;
  const completed = new Promise(resolve => { finish = resolve; });
  let light = true;
  const context = {
    document: { body: { classList: { contains: () => light, add() {}, remove() {} } },
      startViewTransition(callback) { callback(); return { finished: completed }; } },
    themeTransitionReducedMotion: { matches: false },
    startupSpotlight: { classList: { add() {} }, style: { opacity: '', transform: '', setProperty(name, value) { this[name] = value; }, removeProperty(name) { this[name] = ''; } } },
    stopThemeSpotlightAnimation() {},
    moveThemeSpotlight: async ({ enter }) => events.push(enter ? 'white descends' : 'unexpected spotlight'),
    commitTheme: next => { light = next; },
  };
  const run = vm.runInNewContext(`let themeSequence = 0, requestedThemeIsLight = true, activeThemeTransition = null, activeThemeSpotlightAnimation = null;\n(${source.slice(start, end)})(false)`, context);
  assert.equal(light, false);
  assert.equal(context.startupSpotlight.style.opacity, '0');
  assert.deepEqual(events, []);
  finish();
  await run;
  assert.deepEqual(events, ['white descends']);
});

test('inverted beam loses opacity without translating', async () => {
  const source = readFileSync(`${__dirname}/../script.js`, 'utf8');
  const start = source.indexOf('async function moveThemeSpotlight(');
  const end = source.indexOf('\n}\n', start) + 2;
  let frames;
  const style = { opacity: '1', transform: 'translate3d(0, 0, 0)', setProperty(name, value) { this[name] = value; }, removeProperty(name) { this[name] = ''; } };
  const spotlight = { style, classList: { add() {} }, animate(nextFrames) {
    frames = nextFrames;
    return { finished: Promise.resolve(), cancel() {} };
  } };
  const context = {
    startupSpotlight: spotlight, getComputedStyle: () => ({ opacity: '1', transform: 'translate3d(0, 0, 0)' }),
    document: { body: { classList: { remove() {} } } }, themeTransitionReducedMotion: { matches: false },
    stopThemeSpotlightAnimation() {},
  };
  await vm.runInNewContext(`let activeThemeSpotlightAnimation = null;\n(${source.slice(start, end)})({ darken: true, stationary: true, duration: 650 })`, context);
  assert.equal(frames[0].transform, frames[1].transform);
  assert.equal(frames[0].opacity, '1');
  assert.equal(frames[1].opacity, '0');
});

test('canceled light-mode fade cannot erase the spotlight after returning to dark', async () => {
  const source = readFileSync(`${__dirname}/../script.js`, 'utf8');
  const extract = name => {
    const asyncStart = source.indexOf(`async function ${name}(`);
    const start = asyncStart >= 0 ? asyncStart : source.indexOf(`function ${name}(`);
    return source.slice(start, source.indexOf('\n}\n', start) + 2);
  };
  let light = true;
  let rejectFade;
  let animationCount = 0;
  const style = { opacity: '1', transform: 'translate3d(0, 0, 0)', setProperty(name, value) { this[name] = value; }, removeProperty(name) { this[name] = ''; } };
  const spotlight = { style, classList: { add() {} }, animate() {
    animationCount += 1;
    if (animationCount === 1) return { finished: new Promise((_, reject) => { rejectFade = reject; }), cancel() { rejectFade(new Error('canceled')); } };
    return { finished: Promise.resolve(), cancel() {} };
  } };
  const context = {
    startupSpotlight: spotlight,
    getComputedStyle: () => ({ opacity: style.opacity, transform: style.transform }),
    themeTransitionReducedMotion: { matches: false },
    document: { body: { classList: { contains: () => light, add() {}, remove() {} } },
      startViewTransition(callback) { callback(); return { finished: Promise.resolve() }; } },
    commitTheme: next => { light = next; },
  };
  const runtime = vm.runInNewContext(`let activeThemeSpotlightAnimation = null, themeSequence = 0, requestedThemeIsLight = true, activeThemeTransition = null;\n${extract('stopThemeSpotlightAnimation')}\n${extract('moveThemeSpotlight')}\n${extract('switchTheme')}\n({ moveThemeSpotlight, switchTheme })`, context);
  const oldFade = runtime.moveThemeSpotlight({ darken: true, stationary: true });
  await runtime.switchTheme(false);
  await oldFade;
  assert.equal(light, false);
  assert.equal(style.opacity, '1');
  assert.equal(style['--spotlight-rgb'], '');
});
