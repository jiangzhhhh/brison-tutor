const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const folder = 'dist/exercises/grade-2/semester-1/math/';
function load() {
  const window = {};
  const files = ['dist/catalog.js', 'dist/progress-store.js', folder + 'arithmetic-bank.js', folder + 'arithmetic-training.js'];
  for (const file of files) {
    assert(fs.existsSync(file), `练习缺少 ${file}`);
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window, TextEncoder });
  }
  return { bank: window.ArithmeticBank, training: window.ArithmeticTraining, window };
}

const random = () => 0;
const copy = value => JSON.parse(JSON.stringify(value));
const solution = question => Object.fromEntries(question.fields.map(field => [field.id, [...field.correct]]));

function page(values, exerciseId, isManagementFrame = false) {
  const { window } = load();
  const nodes = new Map();
  const element = () => ({
    hidden: false, attrs: {}, children: [], dataset: {}, classList: { add() {}, toggle() {} },
    setAttribute(name, value) { this.attrs[name] = value; },
    append(...children) { this.children.push(...children); },
    replaceChildren(...children) { this.children = children; },
    focus() {}
  });
  const document = {
    createElement: element,
    getElementById(id) {
      if (!nodes.has(id)) nodes.set(id, element());
      return nodes.get(id);
    }
  };
  window.ProgressBridge = { exerciseId, isManagementFrame, invalidated: false };
  window.PinyinAid = { annotate() {} };
  const localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, raw) => values.set(key, raw)
  };
  vm.runInNewContext(fs.readFileSync(folder + 'arithmetic.js', 'utf8'), { window, document, localStorage });
  return { get: document.getElementById, nodes, bridge: window.ProgressBridge };
}

function submit(training, round, answer, now) {
  if (training.current(round).expression) {
    round.draft = { first: answer.first };
    assert(training.confirmStep(round));
    round.draft.intermediate = answer.intermediate;
    assert(training.confirmStep(round));
  }
  return training.submit(round, answer, now);
}

test('题库每类有六道题；范题和计分题都有可提交的唯一答案', () => {
  const { bank, training } = load();
  assert.equal(bank.categories.length, 10);
  assert.equal(bank.questions.length, 60);
  const all = [...bank.questions, bank.example];
  assert.equal(new Set(all.map(q => q.id)).size, 61);
  assert.equal(bank.questions.filter(q => q.category === 'compose' && q.feature === 'each').length, 3);
  assert.equal(bank.questions.filter(q => q.category === 'compose' && q.feature === 'groups').length, 3);
  for (const category of bank.categories) {
    assert.equal(bank.questions.filter(q => q.category === category.id).length, 6, category.id);
  }
  for (const question of all) {
    assert(question.prompt && question.explanation && question.source, question.id);
    const answer = solution(question);
    assert(training.complete(question, answer), question.id);
    assert(training.grade(question, answer).correct, question.id);
    for (const field of question.fields) {
      assert.equal(new Set(field.options.map(option => option.label)).size, field.options.length, question.id);
      const wrong = field.options.find(option => !field.correct.includes(option.id)).id;
      assert(!training.grade(question, { ...answer, [field.id]: [wrong, ...field.correct.slice(1)] }).correct, question.id);
    }
  }
});

test('编题要求正确的两条条件、所求量和带单位的算式；条件顺序可以交换', () => {
  const { bank, training } = load();
  const q = bank.questions.find(question => question.id === 'compose-1');
  assert.match(q.prompt, /24 块饼干/);
  const answer = { facts: ['total', 'known'], unknown: ['groups'], equation: ['correct'] };
  assert(training.grade(q, answer).correct);
  assert(training.grade(q, { ...answer, facts: ['known', 'total'] }).correct);
  assert(!training.complete(q, { ...answer, facts: ['total'] }));
  assert(!training.complete(q, { ...answer, facts: ['total', 'total'] }));
  assert.deepEqual(copy(training.grade(q, { ...answer, unknown: ['each'] }).fields), { facts: true, unknown: false, equation: true });
  assert(!training.grade(q, { ...answer, facts: ['total', 'extra'] }).correct);
  assert(!training.grade(q, { ...answer, equation: ['product'] }).correct);
});

test('情境题的干扰算式沿用题中给出的两个数，不能靠匹配数字排除', () => {
  const { bank } = load();
  for (const q of bank.questions.filter(item => item.feature === 'story')) {
    const given = q.prompt.match(/\d+/g).sort();
    for (const option of q.fields[0].options) {
      assert.deepEqual(option.label.match(/\d+/g).sort(), given, q.id);
    }
  }
});

test('顺序、中间值和最终结果分别判分，替换只移除先算的部分', () => {
  const { bank, training } = load();
  const cases = [
    ['mul-first-1', '2＋3×7', 'right', '21', '23', '3×7', '2＋21'],
    ['parentheses-1', '（7＋3）×5', 'left', '10', '50', '（7＋3）', '10×5'],
    ['parentheses-2', '4×（9−3）', 'right', '6', '24', '（9−3）', '4×6'],
    ['mul-div-order-1', '24÷3×2', 'left', '8', '16', '24÷3', '8×2']
  ];
  for (const [id, expression, first, intermediate, value, segment, simplified] of cases) {
    const q = bank.questions.find(question => question.id === id);
    assert.equal(q.expression, expression);
    assert.equal(q.work.segment, segment);
    assert.equal(q.work.before + q.work.replacement + q.work.after, simplified);
    assert.equal(q.work.before + q.work.segment + q.work.after, expression);
    const answer = { first: [first], intermediate: [intermediate], result: [value] };
    assert.deepEqual(copy(training.grade(q, answer)), { correct: true, fields: { first: true, intermediate: true, result: true } });
    const other = first === 'left' ? 'right' : 'left';
    assert.deepEqual(copy(training.grade(q, { ...answer, first: [other] })), { correct: false, fields: { first: false, intermediate: true, result: true } });
  }
});

test('中间值必须单独确认，刷新接续当前阶段，算错中间值不能计为连对', () => {
  const { training } = load();
  const data = training.emptyData();
  training.start(data, 10, random);
  assert(submit(training, data.round, solution(training.current(data.round)), 11));
  assert(training.advance(data.round, random));
  const q = training.current(data.round);
  assert.equal(q.id, 'mul-first-1');
  const correct = solution(q);
  assert(!training.submit(data.round, correct, 12));
  data.round.draft = { first: ['right'] };
  assert(training.confirmStep(data.round));
  assert.equal(data.round.step, 1);
  assert(!training.confirmStep(data.round));
  const wrong = q.fields.find(field => field.id === 'intermediate').options.find(option => option.id !== '21').id;
  data.round.draft.intermediate = [wrong];
  const resumed = copy(data);
  assert(training.validData(resumed));
  assert(training.confirmStep(resumed.round));
  assert.equal(resumed.round.step, 2);
  assert(!training.submit(resumed.round, correct, 13));
  assert(training.submit(resumed.round, { ...correct, intermediate: [wrong] }, 13));
  assert.equal(training.streaks(resumed.round)['mul-first'], 0);
  assert.equal(training.summarize(resumed.round).find(row => row.id === 'mul-first').intermediateWrong, 1);
});

test('十类在同一轮交错出题，编题示例不计分且两种除法问法都必须覆盖', () => {
  const { bank, training } = load();
  const data = training.emptyData();
  assert(training.start(data, 100, random));
  const round = data.round;
  const seen = new Map();
  const groups = [];
  let examples = 0;
  for (let index = 0; round.completedAt === null && index < 22; index++) {
    const q = training.current(round);
    if (q === bank.example) {
      examples++;
    } else {
      groups.push(bank.categories.find(category => category.id === q.category).track);
      const previous = seen.get(q.category) ?? [];
      assert(previous.length < 2);
      assert(!previous.some(item => item.id === q.id));
      previous.push(q);
      seen.set(q.category, previous);
    }
    assert(submit(training, round, solution(q), 200 + index));
    assert(!training.submit(round, solution(q), 250));
    assert.equal(training.advance(round, random), round.completedAt === null);
  }
  assert.deepEqual(groups.slice(0, 4), ['meaning', 'order', 'meaning', 'order']);
  assert.equal(examples, 1);
  assert.equal(round.completedAt, 220);
  assert.equal(training.summarize(round).reduce((sum, row) => sum + row.answered, 0), 20);
  for (const category of bank.categories) {
    assert.equal(seen.get(category.id).length, 2);
    if (category.distinctFeatures) assert.notEqual(seen.get(category.id)[0].feature, seen.get(category.id)[1].feature);
  }
  assert(training.start(data, 300, random));
  assert.equal(data.history.length, 1);
  assert.equal(data.round.completedAt, null);
  assert(training.validData(copy(data)));
});

test('分类按题号点选，提交只结算当前题，重练保留历史和其他题的草稿', () => {
  const { bank, training } = load();
  const data = training.emptyClassifiedData();
  assert(training.validClassifiedData(data));
  assert(!training.openClassifiedQuestion(data, 'mixed'));
  assert(training.openClassifiedQuestion(data, 'mul-first-4'));
  const order = training.classifiedQuestion(data, 'mul-first-4');
  assert.equal(training.current(order).id, 'mul-first-4');
  const answer = solution(training.current(order));
  order.draft = { first: answer.first };
  assert(training.confirmStep(order));
  order.draft.intermediate = answer.intermediate;
  assert(training.closeClassifiedQuestion(data));
  assert.equal(data.practice.questionId, null);
  assert(training.openClassifiedQuestion(data, 'total-6'));
  const total = training.classifiedQuestion(data, 'total-6');
  const chosen = bank.questions.find(question => question.id === 'total-6');
  assert.equal(training.current(total), chosen);
  assert.deepEqual(copy(total.optionOrder.choice), Array.from(chosen.fields[0].options, option => option.id));
  assert(training.submitClassified(total, solution(chosen)));
  assert(!training.submitClassified(total, solution(chosen)));
  assert.equal(data.practice.questionId, 'total-6');
  assert(training.retryClassifiedQuestion(data));
  assert.equal(data.practice.questionId, 'total-6');
  assert.deepEqual(copy(total.history), [copy(solution(chosen))]);
  assert.equal(training.currentResult(total), null);
  const restored = copy(data);
  assert(training.validClassifiedData(restored));
  assert(!training.validData(restored));
  assert.equal(training.stepIndex(restored.practice.questions['mul-first-4']), 1);
  assert.deepEqual(restored.practice.questions['mul-first-4'].draft, copy(order.draft));
  const invalidSelection = copy(restored);
  invalidSelection.practice.questionId = ['total-6'];
  assert(!training.validClassifiedData(invalidSelection));
  restored.practice.questions['total-6'].questionId = 'mul-first-4';
  assert(!training.validClassifiedData(restored));
});

test('分类可直接选择编题正式题和独立示例，按原规则判分', () => {
  const { bank, training } = load();
  const data = training.emptyClassifiedData();
  assert(training.openClassifiedQuestion(data, 'compose-6'));
  const session = training.classifiedQuestion(data, 'compose-6');
  const q = training.current(session);
  assert.equal(q.id, 'compose-6');
  assert(!training.submitClassified(session, { facts: ['known'] }));
  assert(training.submitClassified(session, { ...solution(q), unknown: ['total'] }));
  assert.equal(training.grade(q, training.currentResult(session)).fields.unknown, false);
  assert(training.openClassifiedQuestion(data, bank.example.id));
  assert.equal(training.current(training.classifiedQuestion(data, bank.example.id)), bank.example);
  assert(training.validClassifiedData(copy(data)));
});

test('旧分类轮次保留原数据并按题号恢复分步草稿及完成答案', () => {
  const { bank, training } = load();
  const prior = bank.questions.find(question => question.id === 'mul-first-1');
  const current = bank.questions.find(question => question.id === 'mul-first-4');
  const oldRound = {
    trackId: 'mul-first', startedAt: 10, completedAt: null, questionId: current.id,
    attempts: [{ questionId: prior.id, answer: solution(prior) }],
    draft: { first: current.fields[0].correct }, step: 1,
    optionOrder: Object.fromEntries(current.fields.map(field => [field.id, field.options.map(({ id }) => id)]))
  };
  const data = copy({ categoryId: 'mul-first', categories: { 'mul-first': { round: oldRound, history: [] } } });
  const originalCategories = copy(data.categories);
  assert(training.validClassifiedData(data));
  assert(training.openClassifiedQuestion(data, current.id));
  assert.equal(training.stepIndex(training.classifiedQuestion(data, current.id)), 1);
  assert.deepEqual(copy(training.classifiedQuestion(data, current.id).optionOrder), copy(oldRound.optionOrder));
  assert(training.openClassifiedQuestion(data, prior.id));
  assert.deepEqual(copy(training.currentResult(training.classifiedQuestion(data, prior.id))), copy(solution(prior)));
  assert.deepEqual(data.categories, originalCategories);
  assert(training.validClassifiedData(copy(data)));
});

function questionControl(view, id) {
  return view.get('category-options').children
    .flatMap(group => group.children[1].children)
    .map(item => item.children[0]).find(control => control.dataset.questionId === id);
}

test('分类页面列出全部正式题和示例，点选原题后可返回并恢复分步草稿', () => {
  const classified = 'arithmetic-foundations-classified';
  const random = 'arithmetic-foundations';
  const classifiedKey = `brison-tutor:progress:${classified}:v1`;
  const randomKey = `brison-tutor:progress:${random}:v3`;
  const values = new Map();
  const randomPage = page(values, random);
  randomPage.get('start').onclick();
  const previousRandom = values.get(randomKey);
  assert(previousRandom);
  const p = page(values, classified);
  assert.equal(p.get('classified-mode').attrs['aria-current'], 'page');
  assert(p.get('intro').hidden);
  assert(!p.get('categories').hidden);
  assert.equal(p.get('category-options').children.length, 10);
  assert.equal(p.get('category-options').children.flatMap(group => group.children[1].children).length, 61);
  assert(questionControl(p, 'compose-example'));
  assert(!values.has(classifiedKey));
  questionControl(p, 'mul-first-4').onclick();
  assert(p.get('categories').hidden);
  const choice = p.get('fields').children[0].children[1].children.find(node => node.onclick);
  choice.onclick();
  p.get('answer-form').onsubmit({ preventDefault() {} });
  const savedDraft = JSON.parse(values.get(classifiedKey)).data.practice.questions['mul-first-4'];
  assert.equal(savedDraft.step, 1);
  p.get('question-list-return').onclick();
  assert(!p.get('categories').hidden);
  questionControl(p, 'total-6').onclick();
  const totalChoice = p.get('fields').children[0].children[1].children[0];
  totalChoice.onclick();
  p.get('answer-form').onsubmit({ preventDefault() {} });
  assert(!p.get('feedback').hidden);
  assert.equal(JSON.parse(values.get(classifiedKey)).data.practice.questionId, 'total-6');
  assert(p.get('next-actions').hidden);
  p.get('question-list-return').onclick();
  questionControl(p, 'mul-first-4').onclick();
  const restored = page(values, classified);
  assert.equal(restored.get('question-title').textContent, '算出中间数');
  assert.deepEqual(JSON.parse(values.get(classifiedKey)).data.practice.questions['mul-first-4'], savedDraft);
  assert.equal(values.get(randomKey), previousRandom);

  const managed = page(values, classified, true);
  assert.equal(managed.nodes.size, 0);
  values.delete(classifiedKey);
  restored.get('question-list-return').onclick();
  assert(restored.bridge.invalidated);
  assert.match(restored.get('storage-notice').textContent, /刷新/);
  assert(!values.has(classifiedKey));
});

test('分类进度损坏时原样保留，写入被拒绝时明确提示', () => {
  const id = 'arithmetic-foundations-classified';
  const key = `brison-tutor:progress:${id}:v1`;
  const raw = JSON.stringify({ exerciseId: id, schemaVersion: 1, bankVersion: '1.1', data: { categoryId: 'unknown', categories: {} } });
  const corrupted = new Map([[key, raw]]);
  const restored = page(corrupted, id);
  questionControl(restored, 'total-1').onclick();
  assert.match(restored.get('storage-notice').textContent, /无法恢复.*暂停保存/);
  assert.equal(corrupted.get(key), raw);

  const readOnly = Object.assign(new Map(), { set() { throw new Error('storage is read-only'); } });
  const practice = page(readOnly, id);
  questionControl(practice, 'total-1').onclick();
  assert.match(practice.get('storage-notice').textContent, /无法保存进度/);
  assert(!practice.get('practice').hidden);
  assert(!readOnly.has(key));
});

test('错一道只中断该类连对，恢复时保留草稿和选项顺序；损坏数据由管理页识别', () => {
  const { window, training } = load();
  const data = training.emptyData();
  training.start(data, 10, random);
  const round = data.round;
  const first = training.current(round);
  training.submit(round, solution(first), 20);
  training.advance(round, random);
  for (let index = 0; training.current(round).category !== first.category && index < 12; index++) {
    submit(training, round, solution(training.current(round)), 20);
    training.advance(round, random);
  }
  const question = training.current(round);
  assert.equal(question.category, first.category);
  const field = question.fields[0];
  const wrong = field.options.find(option => !field.correct.includes(option.id)).id;
  round.draft = { [field.id]: [wrong] };
  const restored = copy(data);
  assert(training.validData(restored));
  const resumed = restored.round;
  assert.deepEqual(resumed.optionOrder, copy(round.optionOrder));
  const streaks = copy(training.streaks(resumed));
  assert.equal(streaks[first.category], 1);
  assert(Object.entries(streaks).some(([id, count]) => id !== first.category && count > 0));
  assert(training.submit(resumed, resumed.draft, 25));
  assert.deepEqual(copy(training.streaks(resumed)), { ...streaks, [first.category]: 0 });

  const exercise = window.EXERCISES.find(item => item.id === 'arithmetic-foundations');
  const { currentKey, schemaVersion, bankVersion } = exercise.storage;
  const list = state => window.ProgressStore.list({
    length: 1,
    key: () => currentKey,
    getItem: () => JSON.stringify({ exerciseId: exercise.id, schemaVersion, bankVersion, data: state })
  }, exercise);
  assert.equal(list(restored)[0].status, 'current');
  resumed.completedAt = 25;
  assert.equal(list(restored)[0].status, 'damaged');
});

function legacyRound(bank, track, ids, currentId, draft = null, completedAt = null) {
  const byId = new Map([...bank.questions, bank.example].map(question => [question.id, question]));
  const fields = id => byId.get(id).fields.filter(field => field.id !== 'intermediate');
  return {
    trackId: track, startedAt: 10, completedAt, questionId: currentId, draft,
    attempts: ids.map(questionId => ({ questionId, answer: Object.fromEntries(fields(questionId).map(field => [field.id, [...field.correct]])) })),
    optionOrder: Object.fromEntries(fields(currentId).map(field => [field.id, field.options.map(({ id }) => id)]))
  };
}

test('旧版双入口迁移保留两份草稿和情境题连对，顺序题按新步骤验收', () => {
  const { bank, training } = load();
  const meaning = legacyRound(bank, 'meaning', ['total-1', 'compose-example'], 'compose-1', { facts: ['known'] });
  const order = legacyRound(bank, 'order', ['mul-first-1'], 'div-first-1', { first: ['right'] });
  const key = 'brison-tutor:progress:arithmetic-foundations:v1';
  const old = { exerciseId: 'arithmetic-foundations', schemaVersion: 1, bankVersion: '1.0',
    data: { trackId: 'order', tracks: { meaning: { round: meaning, history: [] }, order: { round: order, history: [] } } } };
  const original = copy(old);
  const data = training.migrate(old, key, random);
  assert(training.validData(copy(data)));
  assert.equal(data.migratedFrom, key);
  assert.deepEqual(copy(old), original);
  const { round } = data;
  assert.equal(round.questionId, order.questionId);
  assert.deepEqual(copy(round.draft), order.draft);
  assert.equal(training.streaks(round).total, 1);
  assert.equal(training.streaks(round)['mul-first'], 0);
  assert(submit(training, round, solution(training.current(round)), 30));
  assert(training.advance(round, random));
  assert.equal(round.questionId, meaning.questionId);
  assert.deepEqual(copy(round.draft), meaning.draft);
  assert.deepEqual(copy(round.optionOrder), copy(meaning.optionOrder));
  assert(training.validData(copy(data)));
  assert.equal(training.migrate({ ...old, data: null }, key), null);
});

test('旧版历史按两步评分保留成绩，当前轮的顺序题按三步评分', () => {
  const { bank, training } = load();
  const ids = ['mul-first-1', 'mul-first-4', 'div-first-1', 'div-first-4', 'add-sub-order-1',
    'add-sub-order-2', 'mul-div-order-1', 'mul-div-order-2', 'parentheses-1', 'parentheses-2'];
  const order = legacyRound(bank, 'order', ids, ids.at(-1), null, 100);
  const key = 'brison-tutor:progress:arithmetic-foundations:v1';
  const old = { exerciseId: 'arithmetic-foundations', schemaVersion: 1, bankVersion: '1.0',
    data: { trackId: 'order', tracks: { meaning: { round: null, history: [] }, order: { round: order, history: [order] } } } };
  const data = training.migrate(old, key, random);
  assert(training.validData(data));
  assert.equal(data.round.completedAt, null);
  assert.equal(training.mastered(data.round), 0);
  assert.equal(training.summarize(data.history[0]).length, 5);
  assert(training.summarize(data.history[0]).every(row => row.wrong === 0 && row.answered === 2));
  assert.equal(training.current(data.round).category, 'total');
});

test('混合轮旧草稿保留先选的运算符，引入中间值后重新得出最后结果', () => {
  const { bank, training } = load();
  const round = legacyRound(bank, 'mixed', ['total-1', 'mul-first-1'], 'div-first-1', { first: ['right'], result: ['11'] });
  const old = { exerciseId: 'arithmetic-foundations', schemaVersion: 2, bankVersion: '1.0', data: { round, history: [] } };
  const data = training.migrate(old, training.v2Key, random);
  assert(training.validData(data));
  assert.deepEqual(copy(data.round.draft), { first: ['right'] });
  assert.deepEqual(copy(data.round.attempts).map(item => item.questionId), ['total-1']);
  assert.equal(training.stepIndex(data.round), 0);
  assert(training.confirmStep(data.round));
  assert.equal(training.stepIndex(data.round), 1);
});
