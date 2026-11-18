(() => {
  'use strict';

  const bank = window.Punctuation;
  const { categories, questions } = bank;
  const byId = new Map(questions.map(question => [question.id, question]));
  const byCategory = new Map(categories.map(({ id }) => [id, questions.filter(question => question.category === id)]));
  const weights = new Map(categories.map(({ id, weight }) => [id, weight ?? 1]));
  const currentCategories = categories.map(({ id }) => id);
  const previousCategories = ['statement', 'question', 'exclamation', 'pause', 'sentences', 'dialogue'];
  const target = 2;

  function emptyStreaks(categoryIds) {
    return Object.fromEntries(categoryIds.map(id => [id, 0]));
  }

  function updateStreak(counts, question, marks) {
    counts[question.category] = bank.correct(question, marks) ? counts[question.category] + 1 : 0;
  }

  function streaks(round) {
    const counts = emptyStreaks(round.requiredCategories);
    for (const attempt of round.attempts) updateStreak(counts, byId.get(attempt.questionId), attempt.marks);
    return counts;
  }

  function mastered(round) {
    return Object.values(streaks(round)).filter(count => count >= target).length;
  }

  function countSubstitution(total, expected, marks, wanted, substitute) {
    if (!expected.some(group => group.includes(wanted))) return;
    total.opportunities++;
    // 同一题有多处同向替换时只计一题。漏填和额外插入不算错填成另一种标点。
    if (expected.some((group, index) => group.includes(wanted) && !marks[index].includes(wanted) && marks[index].includes(substitute))) total.wrong++;
  }

  function summarize(round) {
    const byIdInRound = new Map(categories.filter(({ id }) => round.requiredCategories.includes(id))
      .map(({ id, title }) => [id, { id, title, answered: 0, wrong: 0 }]));
    const enumerationAsComma = { opportunities: 0, wrong: 0 };
    const commaAsEnumeration = { opportunities: 0, wrong: 0 };
    for (const { questionId, marks } of round.attempts) {
      const question = byId.get(questionId);
      const totals = byIdInRound.get(question.category);
      totals.answered++;
      if (!bank.correct(question, marks)) totals.wrong++;
      if (!question.palette.includes('、') || !question.palette.includes('，')) continue;
      const expected = bank.answerMarks(question);
      countSubstitution(enumerationAsComma, expected, marks, '、', '，');
      countSubstitution(commaAsEnumeration, expected, marks, '，', '、');
    }
    return { byCategory: Array.from(byIdInRound.values()), enumerationAsComma, commaAsEnumeration };
  }

  function draw(round, random) {
    const counts = streaks(round);
    const exposures = new Map();
    const categoryExposures = new Map();
    const lastByCategory = new Map();
    for (const { questionId } of round.attempts) {
      exposures.set(questionId, (exposures.get(questionId) ?? 0) + 1);
      const category = byId.get(questionId).category;
      categoryExposures.set(category, (categoryExposures.get(category) ?? 0) + 1);
      lastByCategory.set(category, questionId);
    }
    const timesSeen = question => exposures.get(question.id) ?? 0;
    const eligible = round.requiredCategories.filter(id => counts[id] < target);
    // 比较折合后的出题量，以权重增加尚未达标类别的出现次数。
    const load = id => (categoryExposures.get(id) ?? 0) / weights.get(id);
    const leastDrawn = Math.min(...eligible.map(load));
    let pools = eligible.filter(id => load(id) === leastDrawn).map(id => {
      const available = byCategory.get(id).filter(question => question.id !== lastByCategory.get(id));
      const fewest = Math.min(...available.map(timesSeen));
      return available.filter(question => timesSeen(question) === fewest);
    });
    const previous = byId.get(round.attempts.at(-1)?.questionId);
    if (previous) {
      // 优先换一种拖拽形式，再尽量换一类。所有条件都允许在只剩少量题时继续训练。
      const otherMode = pools.map(pool => pool.filter(question => question.mode !== previous.mode)).filter(pool => pool.length);
      if (otherMode.length) pools = otherMode;
      const otherCategory = pools.filter(pool => pool[0].category !== previous.category);
      if (otherCategory.length) pools = otherCategory;
    }
    const poolWeight = pool => weights.get(pool[0].category);
    let ticket = random() * pools.reduce((total, pool) => total + poolWeight(pool), 0);
    const pool = pools.find(candidate => (ticket -= poolWeight(candidate)) < 0);
    return pool[Math.floor(random() * pool.length)].id;
  }

  function currentResult(round) {
    const latest = round.attempts.at(-1);
    return latest?.questionId === round.currentQuestionId ? latest.marks : null;
  }

  function start(data, now = Date.now(), random = Math.random) {
    if (data.round && data.round.completedAt === null) return false;
    if (data.round) data.history.push(data.round);
    const round = { startedAt: now, completedAt: null, currentQuestionId: null, draft: null, attempts: [], requiredCategories: currentCategories.slice() };
    round.currentQuestionId = draw(round, random);
    data.round = round;
    return true;
  }

  function advance(round, random = Math.random) {
    if (round.completedAt !== null || !currentResult(round)) return false;
    round.currentQuestionId = draw(round, random);
    return true;
  }

  function submit(round, marks, now = Date.now()) {
    const question = byId.get(round.currentQuestionId);
    if (round.completedAt !== null || currentResult(round) || !bank.validMarks(question, marks) || !bank.complete(question, marks)) return false;
    round.attempts.push({ questionId: question.id, marks: marks.slice() });
    round.draft = null;
    if (mastered(round) === round.requiredCategories.length) round.completedAt = Math.max(round.startedAt, now);
    return true;
  }

  function validTime(value) {
    return Number.isSafeInteger(value) && value >= 0 && value <= 8.64e15;
  }

  function validRound(round, categoryIds) {
    const question = byId.get(round?.currentQuestionId);
    if (!question || !categoryIds.includes(question.category) || !validTime(round.startedAt) || !Array.isArray(round.attempts)) return false;
    if (round.draft !== null && !bank.validMarks(question, round.draft)) return false;

    const counts = emptyStreaks(categoryIds);
    const lastByCategory = new Map();
    for (const attempt of round.attempts) {
      const answered = byId.get(attempt?.questionId);
      if (!answered || !Object.hasOwn(counts, answered.category) || counts[answered.category] >= target || lastByCategory.get(answered.category) === answered.id) return false;
      if (!bank.validMarks(answered, attempt.marks) || !bank.complete(answered, attempt.marks)) return false;
      updateStreak(counts, answered, attempt.marks);
      lastByCategory.set(answered.category, answered.id);
    }

    const submitted = Boolean(currentResult(round));
    if (submitted && round.draft !== null) return false;
    const finished = Object.values(counts).every(count => count >= target);
    if (finished) return submitted && validTime(round.completedAt) && round.completedAt >= round.startedAt;
    if (round.completedAt !== null) return false;
    return submitted || (counts[question.category] < target && lastByCategory.get(question.category) !== question.id);
  }

  function sameCategories(actual, expected) {
    return Array.isArray(actual) && actual.length === expected.length && actual.every((id, index) => id === expected[index]);
  }

  function validStoredRound(round) {
    const ids = round?.requiredCategories;
    if (!sameCategories(ids, currentCategories) && !(round?.completedAt !== null && sameCategories(ids, previousCategories))) return false;
    return validRound(round, ids);
  }

  function validData(data) {
    return Array.isArray(data?.history) && data.history.every(round => validStoredRound(round) && round.completedAt !== null) &&
      (data.round === null || validStoredRound(data.round));
  }

  function migrateV2(saved, sourceKey) {
    if (saved?.exerciseId !== 'punctuation' || saved.schemaVersion !== 2 || saved.bankVersion !== '2.0') return null;
    const data = saved.data;
    if (!Array.isArray(data?.history) || !data.history.every(round => validRound(round, previousCategories) && round.completedAt !== null)) return null;
    if (data.round !== null && !validRound(data.round, previousCategories)) return null;
    const upgrade = round => ({
      ...round,
      requiredCategories: (round.completedAt === null ? currentCategories : previousCategories).slice()
    });
    const upgraded = { round: data.round && upgrade(data.round), history: data.history.map(upgrade), migratedFrom: sourceKey };
    return validData(upgraded) ? upgraded : null;
  }

  window.PunctuationTraining = { streaks, mastered, summarize, currentResult, start, advance, submit, validData, migrateV2 };
})();
