const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createModel, createClassifiedModel } = require('../dist/exercises/grade-2/semester-1/chinese/reading-quest-model.js');

function fixture(count = 2) {
  const groups = Array.from({ length: count }, (_, index) => ({
    id: `g${index}`,
    category: index % 2 ? 'facts' : 'pronouns',
    variants: Array.from({ length: 4 }, (_, variant) => ({
      id: `g${index}-v${variant}`,
      choices: ['对', '错'],
      answer: '对',
    })),
  }));
  return { version: '1.0', groups, categories: [{ id: 'pronouns', name: '指代' }, { id: 'facts', name: '事实追踪' }] };
}

function setup(count = 2) {
  return createModel(fixture(count));
}

const random = () => 0.999;
function answer(model, state, choice, at = 2000) {
  return model.submit(model.choose(state, choice), at);
}
function memory(raw) {
  const values = new Map();
  if (raw !== undefined) values.set('brison-tutor:progress:reading-quest:v1', raw);
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
}

test('同组连对、答错清零和跨组独立，已消除组退出', () => {
  const model = setup();
  let state = model.start(model.initial(), 1000, random);
  assert.equal(state.round.current.groupId, 'g0');
  state = answer(model, state, 0);
  assert.equal(model.stats(state.round).streaks.get('g0'), 1);
  const firstVariant = state.round.current.variantId;
  assert.equal(model.submit(state, 2500), state);
  state = model.next(state, random);
  assert.equal(state.round.current.groupId, 'g1');
  state = model.next(answer(model, state, 0), random);
  assert.equal(state.round.current.groupId, 'g0');
  assert.notEqual(state.round.current.variantId, firstVariant);
  state = answer(model, state, 1);
  assert.equal(model.stats(state.round).streaks.get('g0'), 0);
  assert.equal(model.stats(state.round).streaks.get('g1'), 1);
  state = model.next(state, random);
  state = model.next(answer(model, state, 0), random);
  assert.equal(state.round.current.groupId, 'g0');
  state = answer(model, state, 0);
  assert.equal(model.stats(state.round).streaks.get('g0'), 1);
  state = model.next(state, random);
  assert.equal(state.round.current.groupId, 'g0');
  state = answer(model, state, 0, 7900);
  assert.equal(model.stats(state.round).cleared, 2);
  assert.equal(state.round.completedAt - state.round.startedAt, 6900);
  assert.equal(model.next(state, random).round.current, null);
});

test('每轮从一百组中抽取十组，第 20 次全对通关，重练重新抽样', () => {
  const model = setup(100);
  const storage = memory();
  const progress = model.persistence(storage);
  let state = model.start(model.initial(), 1000, random);
  const selected = new Set([state.round.current.groupId, ...state.round.queue]);
  assert.equal(selected.size, 10);
  for (let i = 0; i < 20; i++) {
    assert.equal(state.round.completedAt, null);
    assert(selected.has(state.round.current.groupId));
    state = answer(model, state, 0, 2000 + i);
    state = model.next(state, random);
    if (i === 9) {
      assert.equal(progress.save(state, 2010), true);
      const restored = model.persistence(storage).load();
      assert.deepEqual(restored, state);
      state = restored;
    }
  }
  assert.equal(state.round.completedAt, 2019);
  assert.equal(model.stats(state.round).cleared, 10);
  const previous = state.round;
  state = model.start(state, 9000, () => 0);
  assert.deepEqual(state.history, [previous]);
  assert.equal(state.round.startedAt, 9000);
  assert.equal(model.stats(state.round).cleared, 0);
  assert.notDeepEqual(new Set([state.round.current.groupId, ...state.round.queue]), selected);
  assert.equal(progress.save(state, 9100), true);
  const restored = progress.load();
  assert.deepEqual(restored.history[0], previous);
  assert.equal(restored.round.startedAt, 9000);
});

test('旧版一百组轮次可以续练通关并保留在历史中', () => {
  const model = setup(100);
  const legacy = { history: [], round: {
    startedAt: 1000, completedAt: null,
    queue: Array.from({ length: 99 }, (_, index) => `g${index + 1}`), answers: [],
    current: { groupId: 'g0', variantId: 'g0-v3', order: [0, 1], choice: 0, submitted: false },
  } };
  const storage = memory(JSON.stringify({ exerciseId: model.ID, schemaVersion: 1, bankVersion: '1.0',
    updatedAt: new Date(1100).toISOString(), data: legacy }));
  const progress = model.persistence(storage);
  let state = progress.load();
  assert.deepEqual(state, legacy);
  for (let i = 0; i < 200; i++) {
    assert.equal(state.round.completedAt, null);
    state = model.next(answer(model, state, 0, 2000 + i), random);
  }
  assert.equal(state.round.completedAt, 2199);
  assert.equal(model.stats(state.round).cleared, 100);
  const restarted = model.start(state, 9000, random);
  assert.equal(progress.save(restarted, 9100), true);
  assert.deepEqual(progress.load(), restarted);
  assert.deepEqual(restarted.history, [state.round]);
});

test('同组用完四道题后可继续，且不会紧接着重复上一道', () => {
  const model = setup(1);
  let state = model.start(model.initial(), 1000, random);
  const variants = [];
  for (let i = 0; i < 9; i++) {
    variants.push(state.round.current.variantId);
    state = model.next(answer(model, state, 1), random);
  }
  assert.equal(new Set(variants.slice(0, 4)).size, 4);
  assert(variants.slice(1).every((variant, index) => variant !== variants[index]));
});

test('刷新恢复题目、选项、草稿、反馈和开始时间，拒绝覆盖别处清理的进度', () => {
  const model = setup();
  const storage = memory();
  const first = model.persistence(storage);
  first.load();
  let state = model.start(model.initial(), 1000, () => 0);
  state = model.choose(state, 0);
  assert.equal(first.save(state, 1100), true);
  const restored = model.persistence(storage);
  assert.deepEqual(restored.load(), state);
  assert.equal(restored.save(model.submit(state, 2000), 2000), true);
  const afterSubmit = model.persistence(storage);
  const committed = afterSubmit.load();
  assert.equal(committed.round.current.submitted, true);
  assert.equal(committed.round.startedAt, 1000);
  assert.equal(committed.round.answers.length, 1);
  storage.removeItem(model.KEY);
  assert.equal(afterSubmit.save(model.next(committed, random), 2100), false);
  assert.equal(storage.getItem(model.KEY), null);
});

test('保留损坏或版本不兼容记录，写入受阻时提供明确提示', () => {
  const model = setup();
  for (const raw of ['{!', JSON.stringify({ exerciseId: model.ID, schemaVersion: 1, bankVersion: '9' })]) {
    const storage = memory(raw);
    const errors = [];
    const progress = model.persistence(storage, {}, message => errors.push(message));
    assert.deepEqual(progress.load(), model.initial());
    assert.equal(progress.save(model.start(model.initial(), 1000, random), 1100), false);
    assert.match(errors[0], /无法恢复/);
    assert.equal(storage.getItem(model.KEY), raw);
  }
  const errors = [];
  const noWrites = model.persistence({ getItem: () => null, setItem() { throw Error('denied'); } }, {}, message => errors.push(message));
  noWrites.load();
  assert.equal(noWrites.save(model.start(model.initial(), 1000, random), 1100), false);
  assert.match(errors[0], /保存失败/);
});

test('书架、题库和离线页面使用同一练习 ID、题库版本和本地入口', () => {
  const { execFileSync } = require('node:child_process');
  const fs = require('node:fs');
  const path = require('node:path');
  const vm = require('node:vm');
  const root = path.resolve(__dirname, '..');
  execFileSync(process.execPath, ['tools/build-reading-quest-bank.cjs', '--check'], { cwd: root });
  const catalog = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'dist/catalog.js'), 'utf8'), catalog);
  const entry = catalog.window.EXERCISES.find(exercise => exercise.id === 'reading-quest');
  assert.equal(entry.subject, 'chinese');
  const htmlPath = path.join(root, 'dist', entry.path);
  const bank = require(path.join(path.dirname(htmlPath), 'reading-quest-bank.js'));
  const model = createModel(bank);
  assert.equal(entry.storage.currentKey, model.KEY);
  assert.equal(entry.storage.bankVersion, bank.version);
  assert.equal(entry.storage.schemaVersion, model.SCHEMA);
  const classifiedEntry = catalog.window.EXERCISES.find(exercise => exercise.id === 'reading-quest-classified');
  const classified = createClassifiedModel(bank);
  assert.equal(classifiedEntry.parentId, entry.id);
  assert.equal(classifiedEntry.path, `${entry.path}?mode=classified`);
  assert.equal(classifiedEntry.storage.currentKey, classified.KEY);
  assert.equal(classifiedEntry.storage.schemaVersion, classified.SCHEMA);
  assert.equal(classifiedEntry.storage.bankVersion, bank.version);
  assert.equal(bank.categories.length, 8);
  assert.equal(classified.profiles.reduce((total, category) => total + category.count, 0), 400);
  const html = fs.readFileSync(htmlPath, 'utf8');
  for (const [, location] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    assert(fs.existsSync(path.resolve(path.dirname(htmlPath), location.split('?')[0])), location);
  }
});

test('进度管理先取得本练习的写入锁，再清理该练习的记录', async () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const vm = require('node:vm');
  const dist = path.resolve(__dirname, '..', 'dist');
  const { KEY } = setup();
  const values = new Map([[KEY, '{}'], ['brison-tutor:progress:math-focus:v1', 'math']]);
  const localStorage = {
    get length() { return values.size; },
    key: index => [...values.keys()][index],
    getItem: key => values.get(key) ?? null,
    removeItem: key => values.delete(key),
  };
  const parent = { postMessage: message => replies.push(message) };
  const replies = [];
  const waiting = [];
  const events = new Map();
  const window = {
    ReadingQuestBank: { groups: [], version: '1.0' },
    addEventListener: (name, handler) => events.set(name, handler),
    navigator: { locks: { request: (name, callback) => {
      assert.equal(name, KEY);
      return new Promise(resolve => waiting.push(() => resolve(callback())));
    } } },
  };
  const context = vm.createContext({ window, parent, localStorage, TextEncoder,
    document: { currentScript: { dataset: { exercise: 'reading-quest' } }, documentElement: {} },
    location: { hash: '#brison-progress=nonce', protocol: 'http:', origin: 'http://localhost' },
  });
  for (const file of ['catalog.js', 'progress-store.js', 'progress-bridge.js', 'exercises/grade-2/semester-1/chinese/reading-quest-model.js']) {
    vm.runInContext(fs.readFileSync(path.join(dist, file), 'utf8'), context);
  }
  events.get('message')({ source: parent, origin: 'http://localhost', data: {
    channel: 'brison-progress', token: 'nonce', action: 'clear', requestId: 1, keys: [KEY],
  } });
  assert.equal(waiting.length, 1);
  assert.equal(values.has(KEY), true);
  waiting[0]();
  assert.equal(values.has(KEY), false);
  assert.equal(values.get('brison-tutor:progress:math-focus:v1'), 'math');
  assert.equal(replies[0].rows.length, 0);
});

test('两份待保存的作答按锁排队，旧页不能覆盖先写入的进度', async () => {
  const model = setup();
  const storage = memory();
  let tail = Promise.resolve();
  const bridge = { withWriteLock: task => (tail = tail.then(task)) };
  const first = model.persistence(storage, bridge);
  const second = model.persistence(storage, bridge);
  const firstRound = model.start(first.load(), 1000, random);
  const secondRound = model.start(second.load(), 2000, random);
  assert.deepEqual(await Promise.all([first.save(firstRound, 1000), second.save(secondRound, 2000)]), [true, false]);
  assert.deepEqual(model.persistence(storage).load(), firstRound);
});

test('分类列出全部变种，可跳题并各自恢复草稿和成绩', () => {
  const bank = fixture(4);
  const randomMode = createModel(bank);
  const classified = createClassifiedModel(bank);
  const storage = memory();
  const randomState = randomMode.start(randomMode.initial(), 1000, random);
  assert.equal(randomMode.persistence(storage).save(randomState, 1000), true);
  assert.equal(classified.profiles.flatMap(profile => profile.questions).length, 16);
  const a = 'g3-v2', b = 'g0-v0';
  let state = classified.choose(classified.initial(), a, 0);
  state = classified.submit(classified.choose(state, b, 1), b);
  assert.equal(classified.submit(state, b), state);
  assert.equal(classified.persistence(storage).save(state, 3100), true);
  assert.equal(classified.KEY, 'brison-tutor:progress:reading-quest-classified:v1');
  assert.equal(randomMode.isValidRecord(storage.getItem(classified.KEY)), false);
  assert.equal(classified.isValidRecord(storage.getItem(randomMode.KEY)), false);
  assert.deepEqual(randomMode.persistence(storage).load(), randomState);
  const restored = classified.persistence(storage).load();
  assert.deepEqual(classified.current(restored, a), { order: [0, 1], choice: 0, submitted: false, attempts: [] });
  assert.deepEqual(classified.current(restored, b), { order: [0, 1], choice: 1, submitted: true, attempts: [1] });
  const retried = classified.reset(restored, b);
  assert.equal(classified.current(retried, b).choice, null);
  assert.deepEqual(classified.current(retried, b).attempts, [1]);
});

test('同键兼容旧分类进度，迁移草稿、历次成绩与当前选项顺序并先备份', () => {
  const bank = fixture(4);
  const classified = createClassifiedModel(bank);
  const facts = createModel({ version: bank.version, groups: bank.groups.filter(group => group.category === 'facts') });
  const started = facts.start(facts.initial(), 2000, random);
  const finished = answer(facts, started, 1, 2100);
  const draft = facts.choose(facts.next(finished, () => 0), 0);
  const stored = { exerciseId: classified.ID, schemaVersion: 1, bankVersion: '1.0', updatedAt: new Date(2300).toISOString(), data: {
    activeCategoryId: 'facts', categories: { facts: draft },
  } };
  const raw = JSON.stringify(stored);
  const storage = memory();
  storage.setItem(classified.KEY, raw);
  const progress = classified.persistence(storage);
  const state = progress.load();
  const scoredId = finished.round.current.variantId;
  const draftId = draft.round.current.variantId;
  assert.equal(classified.current(state, scoredId).submitted, true);
  assert.deepEqual(classified.current(state, scoredId).attempts, [1]);
  assert.deepEqual(classified.current(state, draftId), { order: draft.round.current.order, choice: 0, submitted: false, attempts: [] });
  assert.equal(storage.getItem(classified.KEY), raw);
  const noBackup = classified.persistence({
    ...storage,
    setItem(key, value) {
      if (key.endsWith(':backup:rounds')) throw Error('quota');
      storage.setItem(key, value);
    },
  });
  assert.equal(noBackup.save(noBackup.load(), 3100), false);
  assert.equal(storage.getItem(classified.KEY), raw);
  assert.equal(progress.save(state, 3200), true);
  assert.equal(storage.getItem(classified.KEY + ':backup:rounds'), raw);
  assert.deepEqual(classified.persistence(storage).load(), state);
});
