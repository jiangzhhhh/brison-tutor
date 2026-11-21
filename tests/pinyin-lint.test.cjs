const assert = require('node:assert/strict');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { dirname, join, resolve } = require('node:path');
const { test } = require('node:test');
const { lintPinyin } = require('../tools/lint-pinyin.cjs');

const setup = `
  <script defer src="../vendor/pinyin-pro-3.29.5.js"></script>
  <script src='../pinyin-data.js' defer></script>
  <script src="../pinyin.js" defer></script>
  <script src="exercise.js" defer></script>
`;

function fixture(t, { entry = setup, script = 'window.PinyinAid?.annotate(document);', shelf } = {}) {
  const dist = mkdtempSync(join(tmpdir(), 'brison-pinyin-lint-'));
  t.after(() => rmSync(dist, {recursive: true, force: true}));
  const write = (file, text) => {
    const path = join(dist, file);
    mkdirSync(dirname(path), {recursive: true});
    writeFileSync(path, text);
  };
  const catalog = [{ path: 'exercises/main.html?mode=streak', shelfPath: shelf && 'exercises/shelf.html#questions' }];
  write('catalog.js', 'window.EXERCISES = ' + JSON.stringify(catalog));
  for (const file of ['vendor/pinyin-pro-3.29.5.js', 'pinyin-data.js', 'pinyin.js']) write(file, '');
  write('exercises/main.html', entry);
  write('exercises/exercise.js', script);
  if (shelf) write('exercises/shelf.html', shelf);
  return lintPinyin(dist);
}

test('书架当前登记的练习全部通过注音 lint', () => {
  const { pages, errors } = lintPinyin(resolve(__dirname, '../dist'));
  assert(pages > 0);
  assert.deepEqual(errors, []);
});

test('发现独立书架入口漏接组件，即使默认入口已接入', t => {
  const { pages, errors } = fixture(t, {shelf: '<script src="exercise.js" defer></script>'});
  assert.equal(pages, 2);
  assert.match(errors.join('\n'), /exercises\/shelf\.html.*pinyin\.js/);
  assert.doesNotMatch(errors.join('\n'), /exercises\/main\.html/);
});

test('识别脚本实际运行顺序，拦截抢在延迟加载组件前运行的内联调用', t => {
  const entry = setup.replace('<script src="exercise.js" defer></script>',
    '<script>PinyinAid.annotate(document);</script>');
  assert.match(fixture(t, {entry}).errors.join('\n'), /exercises\/main\.html.*加载.*PinyinAid\.annotate/);
});

test('跳过注释中的调用，拦截只加载组件而没有调用的页面', t => {
  const script = 'const example = "PinyinAid.annotate(document)"; // PinyinAid.annotate(document);';
  const { errors } = fixture(t, {script});
  assert.match(errors.join('\n'), /exercises\/main\.html.*缺少.*PinyinAid\.annotate/);
});

test('带 src 的脚本标签里写的内联文字不会执行', t => {
  const entry = setup.replace('<script src="exercise.js" defer></script>',
    '<script src="missing.js" defer>PinyinAid.annotate(document);</script>');
  assert.match(fixture(t, {entry}).errors.join('\n'), /exercises\/main\.html.*缺少.*PinyinAid\.annotate/);
});

test('拦截练习用原生 DOM 或 HTML 模板自行生成注音', t => {
  const entry = setup + '<ruby>啄<rt>zhuó</rt></ruby>';
  const script = "PinyinAid.annotate(document); document.createElement('rt');";
  const { errors } = fixture(t, {entry, script});
  assert.match(errors.join('\n'), /exercises\/main\.html.*自行生成注音/);
  assert.match(errors.join('\n'), /exercises\/exercise\.js.*自行生成注音/);
});
