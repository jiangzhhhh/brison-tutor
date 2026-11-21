const { existsSync, readFileSync } = require('node:fs');
const { join, posix, resolve } = require('node:path');
const { runInNewContext } = require('node:vm');

const shared = ['vendor/pinyin-pro-3.29.5.js', 'pinyin-data.js', 'pinyin.js'];
const classicTypes = new Set(['', 'text/javascript', 'application/javascript']);
const scriptTag = /<script\b((?:"[^"]*"|'[^']*'|[^"'<>])*)>([\s\S]*?)<\/script\s*>/gi;
const rubyMarkup = /<\/?(?:ruby|rt|rp)(?=[\s/>])/i;
const rubyElement = /\bcreateElement(?:NS)?\s*\(\s*(?:['"][^'"]+['"]\s*,\s*)?['"](?:ruby|rt|rp)['"]/i;
const annotation = /\bPinyinAid\s*(?:\?\.|\.)\s*annotate\s*\(/;
const stringsAndComments = /"(?:\\[\s\S]|[^"\\\r\n])*"|'(?:\\[\s\S]|[^'\\\r\n])*'|\x60(?:\\[\s\S]|[^\x60\\])*\x60|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g;

function localPath(value, from = '') {
  const ref = value?.trim().split(/[?#]/, 1)[0];
  if (!ref || /^(?:[a-z][a-z\d+.-]*:|[/\\])/i.test(ref)) return null;
  const file = posix.join(posix.dirname(from), ref);
  return file === '..' || file.startsWith('../') ? null : file;
}

function scriptsIn(html, page) {
  return [...html.matchAll(scriptTag)].flatMap(([, attributes, body]) => {
    const attrs = new Map([...attributes.matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g)]
      .map(([, name, double, single, bare]) => [name.toLowerCase(), double ?? single ?? bare ?? '']));
    const type = (attrs.get('type') ?? '').trim().toLowerCase();
    const classic = classicTypes.has(type);
    if (attrs.has('nomodule') || (!classic && type !== 'module')) return [];
    return [{
      file: localPath(attrs.get('src'), page), body: attrs.has('src') ? '' : body,
      classic, async: attrs.has('async'),
      deferred: type === 'module' || (attrs.has('src') && attrs.has('defer'))
    }];
  }).sort((a, b) => Number(a.deferred) - Number(b.deferred));
}

function lintPage(dist, page, errors) {
  const html = readFileSync(join(dist, page), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const scripts = scriptsIn(html, page);
  const add = (message, file = page) => errors.push(file + ': ' + message);
  const locations = shared.map(file => {
    const matches = scripts.filter(script => script.file === file);
    if (matches.length !== 1 || !matches[0].classic || matches[0].async || !existsSync(join(dist, file))) {
      add('必须恰好加载一次本地 ' + file + '，并使用非 async 的经典脚本。');
      return -1;
    }
    return scripts.indexOf(matches[0]);
  });
  const hasShared = locations.every(index => index >= 0);
  if (hasShared && locations.some((index, i) => i > 0 && index < locations[i - 1])) {
    add('拼音脚本须依次加载拼音库、pinyin-data.js 和 pinyin.js。');
  }
  if (rubyMarkup.test(html.replace(scriptTag, ''))) add('页面自行生成注音，请改用 PinyinAid.annotate。');

  let calls = 0;
  scripts.forEach((script, index) => {
    if (shared.includes(script.file)) return;
    const file = script.file && join(dist, script.file);
    const source = file && existsSync(file) ? readFileSync(file, 'utf8') : script.body;
    if (!/(?:PinyinAid|ruby|createElement|<\/?(?:rp|rt)\b)/i.test(source)) return;
    const uncommented = source.replace(stringsAndComments, token => token.startsWith('/') ? ' ' : token);
    if (rubyMarkup.test(uncommented) || rubyElement.test(uncommented)) {
      add('脚本自行生成注音，请改用 PinyinAid.annotate。', script.file ?? page);
    }
    if (!annotation.test(uncommented.replace(stringsAndComments, ' '))) return;
    calls++;
    if (hasShared && (script.async || index <= locations.at(-1))) {
      add('先加载公共拼音组件，再运行 PinyinAid.annotate 所在的脚本。');
    }
  });
  if (calls === 0) add('缺少 PinyinAid.annotate 调用，请在渲染题目后接入公共组件。');
}

function lintPinyin(dist) {
  const window = {};
  runInNewContext(readFileSync(join(dist, 'catalog.js'), 'utf8'), { window }, { filename: 'dist/catalog.js' });
  const pages = new Set();
  const errors = [];
  for (const { id, path, shelfPath } of window.EXERCISES) {
    for (const ref of [path, shelfPath].filter(Boolean)) {
      const page = localPath(ref);
      if (page && page.endsWith('.html') && existsSync(join(dist, page))) pages.add(page);
      else errors.push('catalog.js: ' + id + ' 的练习入口无效（' + ref + '）。');
    }
  }
  if (!pages.size && !errors.length) errors.push('catalog.js: 未找到可检查的练习入口。');
  for (const page of pages) lintPage(dist, page, errors);
  return { pages: pages.size, errors: [...new Set(errors)] };
}

if (require.main === module) {
  const { pages, errors } = lintPinyin(resolve(__dirname, '../dist'));
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('拼音 lint 通过，已检查 ' + pages + ' 个练习页面。');
  }
}

module.exports = { lintPinyin };
