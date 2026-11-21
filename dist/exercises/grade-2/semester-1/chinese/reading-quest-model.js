(function (root) {
  'use strict';

  const RANDOM_ID = 'reading-quest';
  const CLASSIFIED_ID = 'reading-quest-classified';
  const SCHEMA = 1;
  const validTime = value => Number.isSafeInteger(value) && value >= 0 && value <= 8640000000000000;

  function validChoice(variant, choice) {
    return Number.isInteger(choice) && choice >= 0 && choice < variant.choices.length;
  }

  function shuffled(items, random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
      const swap = Math.floor(random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  function createModel(bank) {
    const groups = new Map(bank.groups.map(group => [group.id, group]));
    const groupIds = [...groups.keys()];
    const roundSize = Math.min(10, groupIds.length);
    const initial = () => ({ round: null, history: [] });
    // Rounds saved before sampling used the full bank and have no groupIds.
    const selectedGroups = ({ groupIds: selected = groupIds }) => selected;

    function question({ groupId, variantId }) {
      return groups.get(groupId)?.variants.find(variant => variant.id === variantId);
    }

    function stats(round) {
      const streaks = new Map();
      let correct = 0;
      for (const entry of round.answers) {
        const streak = entry.correct ? (streaks.get(entry.groupId) || 0) + 1 : 0;
        streaks.set(entry.groupId, streak);
        if (entry.correct) correct++;
      }
      const cleared = [...streaks.values()].filter(streak => streak === 2).length;
      return { streaks, cleared, total: selectedGroups(round).length, correct, incorrect: round.answers.length - correct };
    }

    function eligibleVariants(groupId, answers) {
      const variants = groups.get(groupId).variants;
      const previous = answers.filter(entry => entry.groupId === groupId);
      const used = new Set(previous.map(entry => entry.variantId));
      if (used.size < variants.length) return variants.filter(variant => !used.has(variant.id));
      return variants.filter(variant => variant.id !== previous.at(-1).variantId);
    }

    function draw(round, random) {
      const streaks = stats(round).streaks;
      const queue = round.queue.length ? round.queue : shuffled(selectedGroups(round).filter(id => streaks.get(id) !== 2), random);
      const [groupId, ...remaining] = queue;
      const variants = eligibleVariants(groupId, round.answers);
      const variant = variants[Math.floor(random() * variants.length)];
      const order = shuffled(variant.choices.map((_, index) => index), random);
      return { ...round, queue: remaining, current: { groupId, variantId: variant.id, order, choice: null, submitted: false } };
    }

    function start(state, now = Date.now(), random = Math.random) {
      if (state.round && (state.round.completedAt === null || state.round.current)) return state;
      const history = state.round ? [...state.history, state.round] : state.history;
      const selected = shuffled(groupIds, random).slice(0, roundSize);
      const round = draw({ startedAt: now, completedAt: null, groupIds: selected, queue: selected, answers: [], current: null }, random);
      return { round, history };
    }

    function choose(state, choice) {
      const current = state.round?.current;
      if (!current || current.submitted || !validChoice(question(current), choice)) return state;
      return { ...state, round: { ...state.round, current: { ...current, choice } } };
    }

    function submit(state, now = Date.now()) {
      const current = state.round?.current;
      if (!current || current.submitted || current.choice === null) return state;
      const { groupId, variantId, choice } = current;
      const variant = question(current);
      const correct = variant.choices[choice] === variant.answer;
      const answers = [...state.round.answers, { groupId, variantId, choice, correct }];
      const round = { ...state.round, answers, current: { ...current, submitted: true } };
      const { cleared, total } = stats(round);
      if (cleared === total) round.completedAt = Math.max(now, round.startedAt);
      return { ...state, round };
    }

    function next(state, random = Math.random) {
      if (!state.round?.current?.submitted) return state;
      const round = state.round.completedAt === null ? draw(state.round, random) : { ...state.round, current: null };
      return { ...state, round };
    }

    function validRound(round) {
      if (!round || !Array.isArray(round.queue) || !Array.isArray(round.answers) || !validTime(round.startedAt)) return false;
      const selected = selectedGroups(round);
      if (!Array.isArray(selected) || (round.groupIds !== undefined &&
          (selected.length !== roundSize || new Set(selected).size !== roundSize || [...selected].some(id => !groups.has(id))))) return false;
      const streaks = new Map(selected.map(id => [id, 0]));
      const played = new Map(selected.map(id => [id, new Set()]));
      const latestVariant = new Map();
      let pending = new Set();

      function take(groupId, variantId) {
        if (!pending.size) pending = new Set(selected.filter(id => streaks.get(id) !== 2));
        if (!pending.delete(groupId)) return false;
        const used = played.get(groupId);
        const variantCount = groups.get(groupId).variants.length;
        if (used.size < variantCount ? used.has(variantId) : latestVariant.get(groupId) === variantId) return false;
        used.add(variantId);
        latestVariant.set(groupId, variantId);
        return true;
      }

      for (const entry of round.answers) {
        const variant = entry && question(entry);
        if (!variant || !validChoice(variant, entry.choice) || entry.correct !== (variant.choices[entry.choice] === variant.answer)) return false;
        if (!take(entry.groupId, entry.variantId)) return false;
        streaks.set(entry.groupId, entry.correct ? streaks.get(entry.groupId) + 1 : 0);
      }
      const done = [...streaks.values()].every(streak => streak === 2);
      if (done ? !validTime(round.completedAt) || round.completedAt < round.startedAt : round.completedAt !== null) return false;
      const current = round.current;
      if (current === null) return done && round.queue.length === 0;
      const variant = current && question(current);
      if (!variant || !Array.isArray(current.order) || current.order.length !== variant.choices.length ||
          new Set(current.order).size !== current.order.length || ![...current.order].every(index => validChoice(variant, index)) ||
          typeof current.submitted !== 'boolean') return false;
      if (current.submitted) {
        const latest = round.answers.at(-1);
        if (!latest || current.groupId !== latest.groupId || current.variantId !== latest.variantId || current.choice !== latest.choice) return false;
      } else if (done || (current.choice !== null && !validChoice(variant, current.choice)) || !take(current.groupId, current.variantId)) {
        return false;
      }
      return round.queue.length === pending.size && new Set(round.queue).size === pending.size && round.queue.every(id => pending.has(id));
    }

    function validData(data) {
      return Boolean(data && Array.isArray(data.history) &&
        data.history.every(round => validRound(round) && round.current === null && round.completedAt !== null) &&
        (data.round === null ? data.history.length === 0 : validRound(data.round)));
    }

    const storage = progress(RANDOM_ID, bank.version, initial, validData);
    return Object.freeze({ ...storage, initial, total: roundSize, question, stats, start, choose, submit, next, validData });
  }

  function createClassifiedModel(bank) {
    const legacyModels = new Map();
    const entries = new Map();
    const profiles = bank.categories.map(({ id, name }) => {
      const groups = bank.groups.filter(group => group.category === id);
      legacyModels.set(id, createModel({ version: bank.version, groups }));
      const questions = groups.flatMap(group => group.variants.map(variant => {
        entries.set(variant.id, { groupId: group.id, variant });
        return variant;
      }));
      return { id, name, questions, count: questions.length };
    });
    const format = 'question-list';
    const initial = () => ({ format, records: {} });
    const entry = id => entries.get(id);
    const newAnswer = variant => ({ order: variant.choices.map((_, index) => index), choice: null, submitted: false, attempts: [] });
    const current = (state, id) => entry(id) && (state.records[id] || newAnswer(entry(id).variant));
    const store = (state, id, result) => ({ ...state, records: { ...state.records, [id]: result } });

    function choose(state, id, choice) {
      const result = current(state, id);
      if (!result || result.submitted || choice === result.choice || !validChoice(entry(id).variant, choice)) return state;
      return store(state, id, { ...result, choice });
    }

    function submit(state, id) {
      const result = current(state, id);
      if (!result || result.submitted || result.choice === null) return state;
      return store(state, id, { ...result, submitted: true, attempts: [...result.attempts, result.choice] });
    }

    function reset(state, id) {
      const result = current(state, id);
      return result?.submitted ? store(state, id, { ...result, choice: null, submitted: false }) : state;
    }

    function validData(data) {
      if (data?.format !== format || !data.records || typeof data.records !== 'object' || Array.isArray(data.records)) return false;
      return Object.entries(data.records).every(([id, result]) => {
        const variant = entry(id)?.variant;
        return variant && result && Array.isArray(result.order) && result.order.length === variant.choices.length &&
          new Set(result.order).size === result.order.length && [...result.order].every(index => validChoice(variant, index)) &&
          (result.choice === null || validChoice(variant, result.choice)) && typeof result.submitted === 'boolean' &&
          Array.isArray(result.attempts) && [...result.attempts].every(choice => validChoice(variant, choice)) &&
          (!result.submitted || result.choice === result.attempts.at(-1));
      });
    }

    function migrateRounds(data) {
      if (!data?.categories || data.format !== undefined || typeof data.categories !== 'object' || Array.isArray(data.categories) ||
          (data.activeCategoryId !== null && !Object.hasOwn(data.categories, data.activeCategoryId))) return null;
      const categories = Object.entries(data.categories);
      if (!categories.every(([id, saved]) => saved?.round && legacyModels.get(id)?.validData(saved))) return null;
      const state = initial();
      for (const [, { history, round }] of categories) {
        for (const saved of [...history, round]) {
          for (const { variantId, choice } of saved.answers) {
            const previous = current(state, variantId);
            state.records[variantId] = { ...previous, choice, submitted: true, attempts: [...previous.attempts, choice] };
          }
        }
        const last = round.current;
        if (last && (last.choice !== null || state.records[last.variantId])) {
          state.records[last.variantId] = { ...current(state, last.variantId), order: last.order, choice: last.choice, submitted: last.submitted };
        }
      }
      return state;
    }

    const storage = progress(CLASSIFIED_ID, bank.version, initial, validData, migrateRounds);
    return Object.freeze({ ...storage, initial, profiles, entry, current, choose, submit, reset });
  }

  function progress(ID, bankVersion, initial, validData, migrate) {
    const KEY = `brison-tutor:progress:${ID}:v${SCHEMA}`;

    function parseRecord(raw) {
      const record = JSON.parse(raw);
      if (record?.exerciseId !== ID || record.schemaVersion !== SCHEMA || record.bankVersion !== bankVersion ||
          typeof record.updatedAt !== 'string' || !Number.isFinite(Date.parse(record.updatedAt))) {
        throw new Error('Invalid reading quest progress');
      }
      if (validData(record.data)) return { data: record.data, migrated: false };
      const data = migrate?.(record.data);
      if (!validData(data)) throw new Error('Invalid reading quest data');
      return { data, migrated: true };
    }

    function isValidRecord(raw) {
      try { return Boolean(parseRecord(raw)); }
      catch { return false; }
    }

    function persistence(storage, bridge = {}, onError = () => {}) {
      let lastRaw = null;
      let blocked = false;
      let needsBackup = false;

      function load() {
        try {
          lastRaw = storage.getItem(KEY);
          if (lastRaw === null) return initial();
          const loaded = parseRecord(lastRaw);
          needsBackup = loaded.migrated;
          return loaded.data;
        } catch {
          blocked = true;
          onError(lastRaw === null ? '无法读取浏览器存储，本次作答不会保存。' : '无法恢复上次进度，本次作答不会保存。');
          return initial();
        }
      }

      function write(state, now) {
        if (blocked) return false;
        try {
          if (bridge.invalidated || storage.getItem(KEY) !== lastRaw) {
            blocked = true;
            onError('进度已在其他页面更改，请刷新后继续。本页已暂停保存。');
            return false;
          }
          if (needsBackup) {
            const backupKey = `${KEY}:backup:rounds`;
            const previousBackup = storage.getItem(backupKey);
            if (previousBackup === null) storage.setItem(backupKey, lastRaw);
            if (storage.getItem(backupKey) !== lastRaw || !validData(state)) throw new Error('Unable to back up reading quest progress');
          }
          const raw = JSON.stringify({ exerciseId: ID, schemaVersion: SCHEMA, bankVersion, updatedAt: new Date(now).toISOString(), data: state });
          storage.setItem(KEY, raw);
          lastRaw = raw;
          needsBackup = false;
          return true;
        } catch {
          onError('进度保存失败，刷新或关闭页面可能丢失进度。');
          return false;
        }
      }

      function save(state, now = Date.now()) {
        if (blocked) return false;
        if (!bridge.withWriteLock) return write(state, now);
        return bridge.withWriteLock(() => write(state, now)).catch(() => {
          onError('进度保存失败，刷新或关闭页面可能丢失进度。');
          return false;
        });
      }
      return { load, save };
    }

    return { ID, KEY, SCHEMA, isValidRecord, persistence };
  }

  if (typeof module === 'object' && module.exports) module.exports = { createModel, createClassifiedModel };
  else {
    const bank = root.ReadingQuestBank;
    const bridge = root.ProgressBridge;
    root.ReadingQuestModel = createModel(bank);
    if (bridge?.exerciseId === CLASSIFIED_ID) root.ReadingQuestClassified = createClassifiedModel(bank);
    const exercise = root.ReadingQuestClassified || root.ReadingQuestModel;
    if (bridge) {
      bridge.validateCurrent = exercise.isValidRecord;
      if (root.navigator?.locks) bridge.withWriteLock = operation => root.navigator.locks.request(exercise.KEY, operation);
    }
  }
})(typeof window === 'object' ? window : globalThis);
