const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const directory = 'dist/exercises/grade-2/semester-1/chinese/';
const window = {};
for (const file of ['dist/catalog.js', directory + 'punctuation-bank.js']) {
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window });
}
const { questions, blank, sentence, place, remove, boundaries, complete, correct, answerMarks, changedMarks, validProgress } = window.Punctuation;
const byId = id => questions.find(question => question.id === id);

test('书架、进度管理和随机训练使用同一个入口，两种拖拽形式共用一个题面', () => {
  const entry = window.EXERCISES.find(exercise => exercise.id === 'punctuation');
  const html = fs.readFileSync('dist/' + entry.path, 'utf8');
  assert.match(html, /progress-bridge\.js" data-exercise="punctuation"/);
  assert.match(html, /punctuation-training\.js/);
  assert.doesNotMatch(html, /data-mode=/);
  assert.doesNotMatch(html, /查看解析|旧版逐题记录/);
  assert.equal(entry.storage.currentKey, 'brison-tutor:progress:punctuation:v3');
});

test('原位提示区分错放、多放与漏放，并保留相邻的正确标点', () => {
  assert.deepEqual([...answerMarks(byId('q08'))], ['，', '。']);
  const answer = answerMarks(byId('q12'));
  assert.equal(answer[3], '：“');
  assert.equal(answer.at(-1), '？”');
  assert.deepEqual([...changedMarks('：', '：“')], ['：', '', '“', '']);
  assert.deepEqual([...changedMarks('”', '？”')], ['', '', '？', '”']);
  assert.deepEqual([...changedMarks('！？', '？')], ['', '！', '', '？']);
  assert.deepEqual([...changedMarks('！', '？')], ['', '！', '？', '']);
});

test('留空题只能填入方框，空缺时不能提交，允许更换标点', () => {
  const question = byId('q07');
  const empty = blank(question);
  assert.equal(sentence(question, empty), '放学以后□我和姐姐一起回家□');
  assert.equal(place(question, empty, { index: 2 }, '？'), null);
  const partial = place(question, empty, { index: 0 }, '。');
  assert.equal(complete(question, partial), false);
  const revised = place(question, partial, { index: 0 }, '，');
  const answer = place(question, revised, { index: 1 }, '。');
  assert.equal(complete(question, answer), true);
  assert.equal(correct(question, answer), true);
  assert.equal(sentence(question, remove(question, answer, { index: 0 })), '放学以后□我和姐姐一起回家。');
});

test('无空位题允许在任意字符边界作答，位置错或漏填均不能判对', () => {
  const question = byId('q09');
  const empty = blank(question);
  assert.equal(sentence(question, empty), '雨停了我们可以出去踢球吗');
  const wrong = place(question, empty, { index: 2, offset: 0 }, '。');
  const partial = place(question, empty, { index: 3, offset: 0 }, '。');
  assert.equal(sentence(question, wrong), '雨停。了我们可以出去踢球吗');
  assert.equal(complete(question, partial), true);
  assert.equal(correct(question, partial), false);
  assert.equal(correct(question, place(question, wrong, boundaries(wrong).at(-1), '？')), false);
  assert.equal(correct(question, place(question, partial, boundaries(partial).at(-1), '？')), true);
});

test('连续的冒号和引号可以在同一个文字间隙内按顺序插入', () => {
  const question = byId('q12');
  let marks = blank(question);
  marks = place(question, marks, { index: 3, offset: 0 }, '“');
  marks = place(question, marks, { index: 3, offset: 0 }, '：');
  const end = marks.length - 1;
  marks = place(question, marks, { index: end, offset: 0 }, '”');
  marks = place(question, marks, { index: end, offset: 0 }, '？');
  assert.equal(sentence(question, marks), '妈妈问：“你的水壶带了吗？”');
  assert.equal(correct(question, marks), true);
});

test('恢复后的草稿可以删除一处已插入的标点，保留同处的其他标点', () => {
  const question = byId('q12');
  const gap = { index: 3, offset: 0 };
  const quote = place(question, blank(question), gap, '“');
  const saved = JSON.parse(JSON.stringify(place(question, quote, gap, '？')));
  const revised = remove(question, saved, gap);
  assert.equal(sentence(question, revised), '妈妈问“你的水壶带了吗');
  assert.equal(sentence(question, saved), '妈妈问？“你的水壶带了吗');
});

test('进度校验接受草稿和重练记录，拒绝损坏的作答数据', () => {
  const question = byId('q01');
  const record = { draft: ['！'], first: ['。'], latest: ['？'] };
  const data = { currentQuestionId: question.id, records: { [question.id]: record } };
  assert.equal(validProgress(data), true);
  assert.equal(validProgress({ ...data, currentQuestionId: 'missing' }), false);
  assert.equal(validProgress({ ...data, records: { q01: { ...record, draft: ['非法'] } } }), false);
  assert.equal(validProgress({ ...data, records: { q01: { ...record, first: [''] } } }), false);
});
