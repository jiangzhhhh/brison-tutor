const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const bank = require('../dist/exercises/grade-2/semester-1/math/math-focus-bank.js');

function setup() {
  const window = {MathFocusBank: bank};
  const context = vm.createContext({window, TextEncoder});
  for (const file of ['catalog.js', 'progress-store.js', 'exercises/grade-2/semester-1/math/math-streak-model.js']) {
    vm.runInContext(fs.readFileSync('dist/' + file, 'utf8'), context);
  }
  const exercise = window.EXERCISES.find(item => item.id === 'math-streak');
  return {core: window.MathStreak, exercise, store: window.ProgressStore};
}

const first = () => 0;
const last = () => 0.999;
const categorySecond = () => 0.11;
const empty = () => ({round: null, history: []});
const snapshot = value => JSON.parse(JSON.stringify(value));

function answer(core, round, correct, now) {
  const question = core.question(round);
  const choice = question.choices.find(option => (option.id === question.answer) === correct).id;
  const submitted = core.submit(core.choose(round, choice), now);
  assert(submitted);
  return submitted;
}

function finish(core, round, at) {
  while (round.completedAt === null) {
    round = answer(core, round, true, at);
    if (round.completedAt === null) round = core.advance(round, first);
  }
  return round;
}

function memory(entries = {}) {
  const values = new Map(Object.entries(entries));
  return {
    values, get length() { return values.size; },
    key(index) { return [...values.keys()][index] ?? null; },
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
    removeItem(key) { values.delete(key); }
  };
}

test('开局从十类分别固定抽两题，答错只清该类，复抽仍在候选内', () => {
  const {core} = setup();
  let {round} = core.start(empty(), 1000, first);
  assert.equal(Object.keys(round.candidates).length, 10);
  for (const pool of Object.values(round.candidates)) assert.equal(new Set(pool.map(q => q.id)).size, 2);
  const samples = snapshot(round.candidates);
  assert.equal(round.currentQuestionId, 'wp-minimum-1');
  round = answer(core, round, true, 2000);
  assert.equal(core.submit(round, 2001), null);
  round = core.advance(round, categorySecond);
  assert.equal(round.currentQuestionId, 'wp-maximum-1');
  round = answer(core, round, true, 3000);
  assert.equal(core.streaks(round)['wp-maximum'], 1);
  round = core.advance(round, categorySecond);
  assert.equal(round.currentQuestionId, 'wp-maximum-2');
  round = answer(core, round, false, 4000);
  assert.equal(core.streaks(round)['wp-minimum'], 1);
  assert.equal(core.streaks(round)['wp-maximum'], 0);
  round = core.advance(round, categorySecond);
  assert.equal(round.currentQuestionId, 'wp-maximum-1');
  round = answer(core, round, true, 5000);
  round = core.advance(round, categorySecond);
  assert.equal(round.currentQuestionId, 'wp-maximum-2');
  round = answer(core, round, true, 6000);
  assert.equal(core.streaks(round)['wp-maximum'], 2);
  round = core.advance(round, first);
  assert.equal(round.currentQuestionId, 'wp-minimum-2');
  round = answer(core, round, true, 7000);
  assert.equal(core.streaks(round)['wp-minimum'], 2);
  round = core.advance(round, first);
  assert.equal(round.currentQuestionId, 'wp-reverse-1');
  assert.deepEqual(snapshot(round.candidates), samples);
});

test('最后一类提交即通关，重练重新计时和抽样并保留旧成绩', () => {
  const {core} = setup();
  const data = core.start(empty(), 1000, first);
  assert.equal(core.start(data, 1500, last), null);
  const complete = finish(core, data.round, 199000);
  assert.equal(complete.attempts.length, 20);
  assert.equal(complete.completedAt, 199000);
  assert.equal(core.advance(complete, first), null);
  const next = core.start({...data, round: complete}, 220000, last);
  assert.equal(next.round.startedAt, 220000);
  assert.equal(next.round.completedAt, null);
  assert.equal(next.round.attempts.length, 0);
  assert.notDeepEqual(snapshot(next.round.candidates), snapshot(complete.candidates));
  assert.equal(next.history[0].completedAt - next.history[0].startedAt, 198000);
  assert(core.validData(next));
});

test('刷新延续候选、时间、草稿和已提交题，通关后刷新显示相同用时', () => {
  const {core, exercise, store} = setup();
  const storage = memory();
  const open = () => core.persistence(() => storage, exercise, {}, () => {});
  let page = open();
  const initial = core.start(page.restore(), 1000, first);
  assert(page.save(initial));
  const draft = {...initial, round: core.choose(initial.round, 'B')};
  assert(page.save(draft));
  page = open();
  const restored = page.restore();
  assert.deepEqual(snapshot(restored), snapshot(draft));
  const submitted = {...restored, round: core.submit(restored.round, 4000)};
  assert(page.save(submitted));
  page = open();
  const afterSubmit = page.restore();
  assert.equal(core.currentResult(afterSubmit.round).answer, 'B');
  const complete = {...afterSubmit, round: finish(core, core.advance(afterSubmit.round, first), 199000)};
  assert(page.save(complete));
  assert.equal(open().restore().round.completedAt - initial.round.startedAt, 198000);
  assert.equal(store.list(storage, exercise)[0].status, 'current');
});

test('候选被改写、历史版本、存储失败和跨页变更不会被静默覆盖', () => {
  const {core, exercise, store} = setup();
  const key = exercise.storage.currentKey;
  const oldKey = 'brison-tutor:progress:math-streak:v2';
  const notices = [];
  const open = (getStorage, bridge = {}) => core.persistence(getStorage, exercise, bridge, message => notices.push(message));
  const initial = core.start(empty(), 1000, first);
  const storage = memory({[oldKey]: 'future', 'brison-tutor:progress:math-focus:v1': 'other'});
  let page = open(() => storage);
  assert.equal(page.restore().round, null);
  assert(page.save(initial));
  assert.equal(storage.getItem(oldKey), 'future');
  const broken = JSON.parse(storage.getItem(key));
  broken.data.round.candidates['wp-minimum'][0].revision = 'changed';
  storage.setItem(key, JSON.stringify(broken));
  page = open(() => storage);
  assert.equal(store.list(storage, exercise).find(row => row.key === key).status, 'damaged');
  assert.equal(page.restore().round, null);
  assert.equal(page.save(initial), false);
  assert.deepEqual(JSON.parse(storage.getItem(key)), broken);

  const incompatible = JSON.stringify({...broken, bankVersion: '2099-11-21.1'});
  storage.setItem(key, incompatible);
  page = open(() => storage);
  assert.equal(store.list(storage, exercise).find(row => row.key === key).status, 'incompatible');
  assert.equal(page.restore().round, null);
  assert.equal(page.save(initial), false);
  assert.equal(storage.getItem(key), incompatible);

  store.clear(storage, exercise);
  assert.deepEqual([...storage.values.keys()], ['brison-tutor:progress:math-focus:v1']);
  page = open(() => storage);
  page.restore();
  assert(page.save(initial));
  storage.removeItem(key);
  assert.equal(page.save(initial), false);
  assert.equal(storage.getItem(key), null);
  assert.match(notices.at(-1), /其他页面/);

  page = open(() => { throw Error('denied'); });
  assert.equal(page.restore().round, null);
  assert.equal(page.save(initial), false);
  assert.match(notices.at(-1), /无法读取/);
  page = open(() => ({getItem: () => null, setItem() { throw Error('quota'); }}));
  page.restore();
  assert.equal(page.save(initial), false);
  assert.match(notices.at(-1), /无法保存/);
});
