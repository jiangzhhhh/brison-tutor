(() => {
  'use strict';

  const bank = window.MathFocusBank;
  const categories = bank.rounds.filter(round => round.section === 'word-problems');
  const categoryByQuestion = new Map(categories.flatMap(category => category.questionIds.map(id => [id, category.id])));
  const questions = new Map(bank.questions.map(question => [question.id, question]));
  const target = 2;
  const sampleSize = 2;
  const empty = () => ({round: null, history: []});
  const question = round => questions.get(round.currentQuestionId);
  const hasChoice = (item, answer) => item.choices.some(choice => choice.id === answer);
  const validTime = value => Number.isSafeInteger(value) && value >= 0 && value <= 8.64e15;

  function available(pool, progress) {
    if (progress.streak >= target) return [];
    const choices = pool.filter(({id}) => id !== progress.lastId);
    const unseen = choices.filter(({id}) => !progress.seen.has(id));
    return unseen.length ? unseen : choices;
  }

  function replay(round) {
    const progress = Object.fromEntries(categories.map(({id}) => [id, {streak: 0, lastId: null, seen: new Set()}]));
    let time = round.startedAt;
    for (const attempt of round.attempts) {
      const categoryId = categoryByQuestion.get(attempt?.questionId);
      if (!categoryId || !validTime(attempt.submittedAt) || attempt.submittedAt < time) return null;
      const category = progress[categoryId];
      if (!available(round.candidates[categoryId], category).some(({id}) => id === attempt.questionId)) return null;
      const item = questions.get(attempt.questionId);
      if (!hasChoice(item, attempt.answer)) return null;
      category.streak = attempt.answer === item.answer ? category.streak + 1 : 0;
      category.lastId = item.id;
      category.seen.add(item.id);
      time = attempt.submittedAt;
    }
    return progress;
  }

  function streaks(round) {
    return Object.fromEntries(Object.entries(replay(round)).map(([id, category]) => [id, category.streak]));
  }

  function draw(round, random) {
    const progress = replay(round);
    const pools = categories.map(({id}) => available(round.candidates[id], progress[id])).filter(pool => pool.length);
    const pool = pools[Math.floor(random() * pools.length)];
    return pool[Math.floor(random() * pool.length)].id;
  }

  function sample(category, random) {
    const remaining = category.questionIds.slice();
    return Array.from({length: sampleSize}, () => {
      const [id] = remaining.splice(Math.floor(random() * remaining.length), 1);
      return {id, revision: questions.get(id).revision};
    });
  }

  function start(data, now = Date.now(), random = Math.random) {
    if (data.round && data.round.completedAt === null) return null;
    const round = {
      candidates: Object.fromEntries(categories.map(category => [category.id, sample(category, random)])),
      startedAt: now, completedAt: null, currentQuestionId: null, draft: null, attempts: []
    };
    round.currentQuestionId = draw(round, random);
    return {round, history: data.round ? [...data.history, data.round] : data.history};
  }

  function currentResult(round) {
    const last = round.attempts.at(-1);
    return last?.questionId === round.currentQuestionId ? last : null;
  }

  function choose(round, answer) {
    if (round.completedAt !== null || currentResult(round) || !hasChoice(question(round), answer)) return null;
    return {...round, draft: answer};
  }

  function submit(round, now = Date.now()) {
    if (round.completedAt !== null || currentResult(round) || round.draft === null) return null;
    const submittedAt = Math.max(now, round.attempts.at(-1)?.submittedAt ?? round.startedAt);
    const attempt = {questionId: round.currentQuestionId, answer: round.draft, submittedAt};
    const next = {...round, draft: null, attempts: [...round.attempts, attempt]};
    if (Object.values(streaks(next)).every(value => value >= target)) next.completedAt = submittedAt;
    return next;
  }

  function advance(round, random = Math.random) {
    if (round.completedAt !== null || !currentResult(round)) return null;
    return {...round, currentQuestionId: draw(round, random)};
  }

  function validCandidates(candidates) {
    if (!candidates || Object.keys(candidates).length !== categories.length) return false;
    return categories.every(category => {
      const pool = candidates[category.id];
      return Array.isArray(pool) && pool.length === sampleSize &&
        pool.every(entry => entry && category.questionIds.includes(entry.id) && questions.get(entry.id).revision === entry.revision) &&
        new Set(pool.map(({id}) => id)).size === sampleSize;
    });
  }

  function validRound(round) {
    if (!validTime(round?.startedAt) || !Array.isArray(round.attempts) || !validCandidates(round.candidates)) return false;
    const item = question(round);
    const categoryId = categoryByQuestion.get(item?.id);
    if (!categoryId || !round.candidates[categoryId].some(({id}) => id === item.id)) return false;
    if (round.draft !== null && !hasChoice(item, round.draft)) return false;
    const progress = replay(round);
    if (!progress) return false;
    const result = currentResult(round);
    if (result && round.draft !== null) return false;
    const finished = Object.values(progress).every(category => category.streak >= target);
    if (finished) return !!result && round.completedAt === result.submittedAt;
    if (round.completedAt !== null) return false;
    return !!result || available(round.candidates[categoryId], progress[categoryId]).some(({id}) => id === item.id);
  }

  function validData(data) {
    if (!Array.isArray(data?.history) || !data.history.every(round => validRound(round) && round.completedAt !== null)) return false;
    return data.round === null ? data.history.length === 0 : validRound(data.round);
  }

  function persistence(getStorage, exercise, bridge, notice) {
    const {id: exerciseId, storage: {currentKey, schemaVersion, bankVersion, validate}} = exercise;
    let storage;
    let lastRaw = null;
    let blocked = false;

    function restore() {
      if (bridge.invalidated) return empty();
      try {
        storage = getStorage();
        lastRaw = storage.getItem(currentKey);
      } catch {
        blocked = true;
        notice('无法读取进度，本次作答无法保存。');
        return empty();
      }
      if (lastRaw === null) return empty();
      try {
        const record = JSON.parse(lastRaw);
        if (record?.schemaVersion === schemaVersion && record.bankVersion === bankVersion && validate(record)) return record.data;
      } catch { /* Keep unreadable records in their original key. */ }
      blocked = true;
      notice('无法恢复练习进度，本次作答无法保存。');
      return empty();
    }

    function save(data) {
      if (blocked || bridge.invalidated) return false;
      try {
        if (storage.getItem(currentKey) !== lastRaw) {
          blocked = true;
          notice('进度已在其他页面更改。请刷新后继续。');
          return false;
        }
        const raw = JSON.stringify({exerciseId, schemaVersion, bankVersion, updatedAt: new Date().toISOString(), data});
        storage.setItem(currentKey, raw);
        lastRaw = raw;
        notice('');
        return true;
      } catch {
        notice('无法保存进度。关闭或刷新页面可能丢失本次作答。');
        return false;
      }
    }

    return {restore, save};
  }

  window.MathStreak = {categories, question, streaks, currentResult, start, choose, submit, advance, validData, persistence};
})();
