const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const root = `${__dirname}/..`;

test('factory reset return is black before the first paint, then fades away', () => {
  const classes = new Set();
  const stored = new Map([['tile-reset-reveal', '1']]);
  vm.runInNewContext(readFileSync(`${root}/tour-boot.js`, 'utf8'), {
    document: { documentElement: { classList: { add(name) { classes.add(name); } } } },
    localStorage: { getItem: () => 'yes' },
    sessionStorage: {
      getItem: key => stored.get(key),
      removeItem: key => stored.delete(key),
    },
  });
  assert.equal(classes.has('tile-reset-returning'), true);
  assert.equal(stored.has('tile-reset-reveal'), false);
  const css = readFileSync(`${root}/style.css`, 'utf8');
  assert.match(css, /html\.tile-reset-returning \.tile-reset-blackout\s*\{[^}]*animation: tileResetReveal 1050ms[^}]*1050ms both/s);
  assert.match(css, /@keyframes tileResetReveal\s*\{\s*from \{ opacity: 1; \}\s*to \{ opacity: 0; \}/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*html\.tile-reset-returning \.tile-reset-blackout\s*\{\s*animation: tileResetReveal 150ms/s);
});

test('reset blackout reaches full black before reload continues', async () => {
  const source = readFileSync(`${root}/script.js`, 'utf8');
  const start = source.indexOf('async function playTileResetBlackout()');
  const end = source.indexOf('\n}\n', start) + 2;
  assert.ok(start >= 0 && end > start);
  let finish;
  let duration;
  const blackout = {
    style: { opacity: '0' },
    classList: { add(name) { assert.equal(name, 'is-blanking'); } },
    animate(frames, options) {
      assert.equal(frames.at(-1).opacity, 1);
      duration = options.duration;
      return { finished: new Promise(resolve => { finish = resolve; }) };
    },
  };
  const run = vm.runInNewContext(`(${source.slice(start, end)})()`, {
    tileResetBlackout: blackout,
    document: { hidden: false },
    dialogReduceMotion: { matches: false },
  });
  assert.equal(duration, 800);
  assert.equal(blackout.style.opacity, '0');
  finish();
  await run;
  assert.equal(blackout.style.opacity, '1');
  assert.match(source, /sessionStorage\.setItem\("tile-reset-reveal", "1"\);\s*await playTileResetBlackout\(\);\s*window\.location\.reload\(\)/);
});

test('reset confirmation input shares the styled settings field states', () => {
  const css = readFileSync(`${root}/style.css`, 'utf8');
  assert.match(css, /#schoolInput,\s*#tileResetConfirmation,\s*#gradeInput,[\s\S]*?min-height: 46px;/);
  assert.match(css, /#schoolInput:hover,\s*#tileResetConfirmation:hover,/);
  assert.match(css, /#schoolInput:focus,\s*#tileResetConfirmation:focus,/);
});
