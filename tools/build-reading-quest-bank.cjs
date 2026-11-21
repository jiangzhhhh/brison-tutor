const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const materials = path.join(root, 'materials/grade-2/semester-1/chinese/reading-quest');
const output = path.join(root, 'dist/exercises/grade-2/semester-1/chinese/reading-quest-bank.js');
const version = '1.0';
const quotas = { winograd: 30, babi: 50, clutrr: 20 };
const sources = {
  winograd: { name: 'Winograd Schema Challenge', url: 'https://cs.nyu.edu/~davise/papers/WinogradSchemas/WS.html', license: 'CC BY 4.0' },
  babi: { name: 'bAbI QA v1.2', url: 'https://huggingface.co/datasets/facebook/babi_qa/blob/main/README.md', license: 'CC BY 3.0' },
  clutrr: { name: 'CLUTRR', url: 'https://github.com/facebookresearch/clutrr#license', license: 'CC BY-NC 4.0' },
};
const categories = [
  { id: 'pronouns', name: '指代与常识' },
  { id: 'facts', name: '追踪人物和物品' },
  { id: 'negation', name: '读懂否定' },
  { id: 'time', name: '时间顺序' },
  { id: 'conditions', name: '按条件推断' },
  { id: 'position', name: '判断位置' },
  { id: 'size', name: '比较大小' },
  { id: 'relationships', name: '家庭关系' },
];
const babiCategories = { 2: 'facts', 3: 'facts', 9: 'negation', 11: 'pronouns', 13: 'pronouns', 14: 'time', 15: 'conditions', 17: 'position', 18: 'size' };
const nonempty = value => typeof value === 'string' && value.trim() === value && value.length > 0;
const groupIds = new Set();
const sourceIds = new Set();
const prompts = new Set();
const groups = [];

for (const [source, quota] of Object.entries(quotas)) {
  const records = JSON.parse(fs.readFileSync(path.join(materials, `${source}.json`), 'utf8'));
  assert(Array.isArray(records) && records.length === quota, `${source} 应有 ${quota} 组`);
  for (const record of records) {
    const { id, source_id, source_url, source_author, variants } = record;
    for (const field of ['id', 'source_id', 'source_url', 'source_author', 'original_text', 'original_question', 'original_answer']) {
      assert(nonempty(record[field]), `${id} 缺少 ${field}`);
    }
    assert(record.source === source && /^https:\/\//.test(source_url), id);
    assert(!groupIds.has(id), `题组 ID 重复：${id}`);
    assert(!sourceIds.has(`${source}:${source_id}`), `来源题号重复：${source_id}`);
    groupIds.add(id);
    sourceIds.add(`${source}:${source_id}`);
    assert(Array.isArray(variants) && variants.length === 4, `${id} 应有 4 道`);
    const texts = new Set();
    const questions = variants.map((variant, index) => {
      const { id: variantId, chinese_text, question, choices, answer, explanation, skill_tags, distractor_type, difficulty, verification_status } = variant;
      assert.equal(variantId, `${id}-v${index + 1}`);
      assert([chinese_text, question, answer, explanation, distractor_type].every(nonempty), variantId);
      assert(Array.isArray(choices) && [2, 3].includes(choices.length) && choices.every(nonempty), variantId);
      assert(new Set(choices).size === choices.length && choices.includes(answer), variantId);
      assert(Array.isArray(skill_tags) && skill_tags.length && skill_tags.every(nonempty), variantId);
      assert(['基础', '进阶'].includes(difficulty) && ['待人工审校', '已人工审校'].includes(verification_status), variantId);
      const prompt = JSON.stringify([chinese_text, question]);
      assert(!texts.has(chinese_text) && !prompts.has(prompt), `题面重复：${variantId}`);
      texts.add(chinese_text);
      prompts.add(prompt);
      return { id: variantId, chinese_text, question, choices, answer, explanation };
    });
    const task = /\/qa(\d+)_/.exec(source_id)?.[1];
    const category = source === 'babi' ? babiCategories[task] : source === 'winograd' ? 'pronouns' : 'relationships';
    assert(categories.some(item => item.id === category), `无法确定题组分类：${id}`);
    groups.push({ id, source, source_author, category, variants: questions });
  }
}

assert(categories.every(item => groups.some(group => group.category === item.id)), '每个分类至少需要一组题');
const lines = groups.map(group => `    { id: ${JSON.stringify(group.id)}, source: ${JSON.stringify(group.source)}, source_author: ${JSON.stringify(group.source_author)}, category: ${JSON.stringify(group.category)}, variants: [\n${group.variants.map(variant => `      ${JSON.stringify(variant)}`).join(',\n')}\n    ] }`);
const pretty = value => JSON.stringify(value, null, 2).replaceAll('\n', '\n  ');
const content = `// 由 tools/build-reading-quest-bank.cjs 根据题库归档生成。来源署名和许可见归档。\n(function (root) {\n  'use strict';\n  const version = ${JSON.stringify(version)};\n  const sources = ${pretty(sources)};\n  const categories = ${pretty(categories)};\n  const groups = [\n${lines.join(',\n')}\n  ];\n  const bank = { version, sources, categories, groups };\n  if (typeof module === 'object' && module.exports) module.exports = bank;\n  else root.ReadingQuestBank = bank;\n})(typeof window === 'object' ? window : globalThis);\n`;
if (process.argv.includes('--check')) {
  assert(fs.existsSync(output) && fs.readFileSync(output, 'utf8') === content, '请运行 node tools/build-reading-quest-bank.cjs 更新离线题库');
} else {
  fs.writeFileSync(output, content);
}
console.log(`中文阅读闯关题库：${groups.length} 组，${prompts.size} 道。`);
