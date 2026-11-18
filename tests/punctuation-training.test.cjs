const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const path = 'dist/exercises/grade-2/semester-1/chinese/';
const window = {};
for (const file of ['dist/catalog.js', 'dist/progress-store.js', path + 'punctuation-bank.js', path + 'punctuation-training.js']) {
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window, TextEncoder });
}
const bank = window.Punctuation;
const training = window.PunctuationTraining;
const zero = () => 0;
const high = () => 0.99;

function solution(question) {
  let offset = 0;
  const marks = bank.blank(question);
  if (question.mode === 'boxes') {
    return marks.map((_, index) => {
      offset += question.parts[index].length;
      return question.answer[offset++];
    });
  }
  return marks.map((_, index) => {
    let missing = '';
    while (offset < question.answer.length && question.answer[offset] !== question.parts[index]) {
      missing += question.answer[offset++];
    }
    offset++;
    return missing;
  });
}

function wrongAnswer(question) {
  const marks = solution(question);
  const index = marks.findIndex(Boolean);
  marks[index] = Array.from(question.palette).find(mark => mark !== marks[index]);
  return marks;
}

function started(random = zero) {
  const data = { round: null, history: [] };
  assert.equal(training.start(data, 100, random), true);
  return data;
}

function current(round) {
  return bank.questions.find(question => question.id === round.currentQuestionId);
}

test('题库有七类共六十六题，每类能以两种方式作答，每题答案能从题面填写', () => {
  assert.equal(bank.categories.length, 7);
  assert.equal(bank.questions.length, 66);
  assert.equal(new Set(bank.questions.map(question => question.id)).size, 66);
  for (const category of bank.categories) {
    const questions = bank.questions.filter(question => question.category === category.id);
    assert.equal(questions.length, category.id === 'enumeration' ? 12 : 9);
    if (category.id === 'enumeration') {
      assert.equal(category.weight, 2);
      assert(questions.every(question => question.answer.includes('、') && question.palette.includes('、')));
      assert(questions.some(question => question.answer.includes('，')));
    }
    assert.equal(new Set(questions.map(question => question.mode)).size, 2);
  }
  for (const question of bank.questions) {
    const marks = solution(question);
    assert(bank.validMarks(question, marks), question.id);
    assert(bank.complete(question, marks), question.id);
    assert(bank.correct(question, marks), question.id);
  }
});

test('连续答对两道不同的同类题后停止抽取该类，最后一次提交记录完成时间', () => {
  const data = started();
  const round = data.round;
  const minimum = bank.categories.length * 2;
  for (let index = 0; index < minimum; index++) {
    const question = current(round);
    const previous = round.attempts.at(-1);
    const streaks = training.streaks(round);
    assert(streaks[question.category] < 2);
    const lastOfCategory = round.attempts.findLast(attempt => current({ currentQuestionId: attempt.questionId }).category === question.category);
    assert.notEqual(lastOfCategory?.questionId, question.id);
    if (previous) assert.notEqual(current({ currentQuestionId: previous.questionId }).mode, question.mode);
    assert.equal(training.submit(round, solution(question), 1000 + index), true);
    assert.equal(training.submit(round, solution(question), 9999), false);
    assert.equal(training.advance(round, zero), index < minimum - 1);
  }
  assert.equal(round.completedAt, 1000 + minimum - 1);
  assert(Object.values(training.streaks(round)).every(count => count === 2));
  const saved = JSON.parse(JSON.stringify(data));
  assert(training.validData(saved));
  assert.equal(training.start(saved, 2500, high), true);
  assert.equal(saved.history[0].completedAt, 1000 + minimum - 1);
  assert.equal(saved.round.startedAt, 2500);
  assert.equal(saved.round.completedAt, null);
  assert(Object.values(training.streaks(saved.round)).every(count => count === 0));
});

test('答错只重置该类，中途刷新可保留连对次数、当前题和未提交的标点', () => {
  const data = started();
  const round = data.round;
  const category = current(round).category;
  training.submit(round, solution(current(round)), 200);
  assert(training.advance(round, zero));
  for (let index = 0; index < 12 && current(round).category !== category; index++) {
    training.submit(round, solution(current(round)), 200);
    training.advance(round, zero);
  }
  const question = current(round);
  assert.equal(question.category, category);
  const streaks = { ...training.streaks(round) };
  assert.equal(streaks[category], 1);
  assert(Object.entries(streaks).some(([other, count]) => other !== category && count > 0));
  round.draft = wrongAnswer(question);
  const saved = JSON.parse(JSON.stringify(data));
  assert(training.validData(saved));
  assert.equal(saved.round.currentQuestionId, question.id);
  assert.deepEqual([...saved.round.draft], [...round.draft]);
  assert.equal(training.submit(saved.round, saved.round.draft, 400), true);
  assert.deepEqual({ ...training.streaks(saved.round) }, { ...streaks, [category]: 0 });
  assert.equal(saved.round.completedAt, null);
  const malformed = JSON.parse(JSON.stringify(saved));
  malformed.round.completedAt = 400;
  assert.equal(training.validData(malformed), false);
});

test('随机数影响选题，持续未达标时顿号按两倍题量出现，同类先用完未练题再循环', () => {
  assert.notEqual(started(zero).round.currentQuestionId, started(high).round.currentQuestionId);
  const round = started().round;
  const seen = new Map();
  let recycled = false;
  for (let attempt = 0; attempt < 96; attempt++) {
    const question = current(round);
    const ids = seen.get(question.category) ?? [];
    if (ids.includes(question.id)) {
      assert.equal(new Set(ids).size, question.category === 'enumeration' ? 12 : 9);
      recycled = true;
    }
    assert.notEqual(ids.at(-1), question.id);
    ids.push(question.id);
    seen.set(question.category, ids);
    assert(training.submit(round, wrongAnswer(question), 200 + attempt));
    assert(training.advance(round, zero));
  }
  assert(recycled);
  for (const category of bank.categories) {
    assert.equal(seen.get(category.id).length, category.id === 'enumeration' ? 24 : 12);
  }
  assert.equal(round.completedAt, null);
});

test('进度管理把外层版本正确但训练内容损坏的记录标为损坏', () => {
  const exercise = window.EXERCISES.find(item => item.id === 'punctuation');
  const key = exercise.storage.currentKey;
  const rows = data => window.ProgressStore.list({
    length: 1,
    key: () => key,
    getItem: () => JSON.stringify({ exerciseId: 'punctuation', schemaVersion: exercise.storage.schemaVersion, bankVersion: exercise.storage.bankVersion, data })
  }, exercise);
  assert.equal(rows(started())[0].status, 'current');
  assert.equal(rows({ round: null, history: [null] })[0].status, 'damaged');
});

test('旧六类的完成时间保持原样，未完成的一轮保留当前题和草稿并纳入顿号', () => {
  const oldIds = bank.categories.filter(({ id }) => id !== 'enumeration').map(({ id }) => id);
  const attempts = oldIds.flatMap(category => bank.questions.filter(question => question.category === category).slice(0, 2))
    .map(question => ({ questionId: question.id, marks: solution(question) }));
  const completed = { startedAt: 100, completedAt: 800, currentQuestionId: attempts.at(-1).questionId, draft: null, attempts };
  const draft = attempts.at(-1).marks;
  const active = { startedAt: 900, completedAt: null, currentQuestionId: attempts.at(-1).questionId, draft, attempts: attempts.slice(0, -1) };
  const previousKey = 'brison-tutor:progress:punctuation:v2';
  const old = { exerciseId: 'punctuation', schemaVersion: 2, bankVersion: '2.0', data: { round: active, history: [completed] } };
  const result = training.migrateV2(old, previousKey);
  assert(training.validData(result));
  assert.equal(result.migratedFrom, previousKey);
  assert.equal(result.round.currentQuestionId, active.currentQuestionId);
  assert.deepEqual([...result.round.draft], [...draft]);
  assert(result.round.requiredCategories.includes('enumeration'));
  assert.equal(result.history[0].completedAt, 800);
  assert.deepEqual([...result.history[0].requiredCategories], [...oldIds]);
  assert(training.submit(result.round, draft, 1000));
  assert.equal(result.round.completedAt, null);
  assert(training.advance(result.round, zero));
  assert.equal(current(result.round).category, 'enumeration');
  const finished = training.migrateV2({ ...old, data: { round: completed, history: [] } }, previousKey);
  assert(training.validData(finished));
  assert.equal(finished.round.completedAt, completed.completedAt);
  assert.deepEqual([...finished.round.requiredCategories], [...oldIds]);
  assert.equal(training.migrateV2({ ...old, data: { ...old.data, round: { ...active, draft: ['坏'] } } }, previousKey), null);
  assert.equal(old.data.round.requiredCategories, undefined);
});

test('完成统计按提交次数汇总类别，并按题区分顿号和逗号的双向错填', () => {
  const questions = ['q58', 'q64', 'q55', 'q07', 'q63'].map(id => bank.questions.find(item => item.id === id));
  const [both, missing, enumeration, pause, extra] = questions;
  const missingMarks = solution(missing);
  missingMarks[missingMarks.indexOf('、')] = '';
  const extraMarks = solution(extra);
  extraMarks[extraMarks.indexOf('、')] = '、，';
  const round = {
    requiredCategories: bank.categories.map(({ id }) => id),
    attempts: [
      { questionId: both.id, marks: ['，', '，', '、', '。'] },
      { questionId: missing.id, marks: missingMarks },
      { questionId: enumeration.id, marks: solution(enumeration) },
      { questionId: pause.id, marks: wrongAnswer(pause) },
      { questionId: extra.id, marks: extraMarks },
      { questionId: enumeration.id, marks: solution(enumeration) }
    ]
  };
  const summary = training.summarize(round);
  assert.equal(summary.byCategory.length, 7);
  assert.deepEqual({ ...summary.byCategory.find(item => item.id === 'enumeration') }, { id: 'enumeration', title: '并列词语的顿号', answered: 5, wrong: 3 });
  assert.equal(summary.byCategory.find(item => item.id === 'pause').wrong, 1);
  assert.deepEqual({ ...summary.enumerationAsComma }, { opportunities: 5, wrong: 1 });
  assert.deepEqual({ ...summary.commaAsEnumeration }, { opportunities: 3, wrong: 1 });

  const previous = training.summarize({ requiredCategories: ['pause'], attempts: [{ questionId: pause.id, marks: solution(pause) }] });
  assert.equal(previous.byCategory.length, 1);
  assert.equal(previous.commaAsEnumeration.opportunities, 0);
});
