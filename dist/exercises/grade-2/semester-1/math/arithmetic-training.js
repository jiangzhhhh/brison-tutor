(() => {
  'use strict';

  const { tracks, categories, questions, example } = window.ArithmeticBank;
  const v1Key = 'brison-tutor:progress:arithmetic-foundations:v1';
  const v2Key = 'brison-tutor:progress:arithmetic-foundations:v2';
  const mixed = 'mixed';
  const byId = new Map([...questions, example].map(question => [question.id, question]));
  const byCategory = new Map(categories.map(category => [category.id, category]));
  const trackCategories = new Map(tracks.map(track => [track.id, categories.filter(category => category.track === track.id)]));
  trackCategories.set(mixed, categories);
  const categoryQuestions = new Map(categories.map(category => [category.id, questions.filter(question => question.category === category.id)]));
  const target = 2;

  function emptyData() {
    return { round: null, history: [] };
  }

  function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function fieldsFor(question, legacy) {
    return legacy && question.expression ? question.fields.filter(field => field.id !== 'intermediate') : question.fields;
  }

  function validAnswer(question, answer, legacy) {
    const fields = fieldsFor(question, legacy);
    return isObject(answer) && Object.entries(answer).every(([id, selected]) => {
      const field = fields.find(item => item.id === id);
      return field && Array.isArray(selected) && selected.length <= field.correct.length
        && new Set(selected).size === selected.length && selected.every(value => field.options.some(option => option.id === value));
    });
  }

  function complete(question, answer, legacy) {
    return validAnswer(question, answer, legacy) && fieldsFor(question, legacy).every(field => answer[field.id]?.length === field.correct.length);
  }

  function grade(question, answer, legacy) {
    const fields = Object.fromEntries(fieldsFor(question, legacy).map(field => {
      const selected = answer?.[field.id];
      const correct = Array.isArray(selected) && selected.length === field.correct.length
        && field.correct.every(id => selected.includes(id));
      return [field.id, correct];
    }));
    return { correct: Object.values(fields).every(Boolean), fields };
  }

  function newProgress(trackId) {
    return Object.fromEntries(trackCategories.get(trackId).map(({ id }) => [id, { streak: 0, last: null, attempts: 0 }]));
  }

  function applyAttempt(progress, question, answer, legacy) {
    const item = progress[question.category];
    item.streak = grade(question, answer, legacy).correct ? item.streak + 1 : 0;
    item.last = question;
    item.attempts++;
  }

  function getProgress(round) {
    const progress = newProgress(round.trackId);
    for (const { questionId, answer } of round.attempts) {
      const question = byId.get(questionId);
      if (question !== example) applyAttempt(progress, question, answer);
    }
    return progress;
  }

  function streaks(round) {
    return Object.fromEntries(Object.entries(getProgress(round)).map(([id, item]) => [id, item.streak]));
  }

  function mastered(round) {
    return Object.values(getProgress(round)).filter(item => item.streak >= target).length;
  }

  function canDraw(question, progress) {
    const item = progress[question.category];
    return item && item.streak < target && item.last?.id !== question.id
      && (item.streak === 0 || !byCategory.get(question.category).distinctFeatures || item.last.feature !== question.feature);
  }

  function pick(values, random) {
    return values[Math.floor(random() * values.length)];
  }

  function questionTrack(question) {
    return question === example ? 'meaning' : byCategory.get(question?.category)?.track;
  }

  function draw(round, random) {
    const progress = getProgress(round);
    const previousId = round.attempts.at(-1)?.questionId;
    const eligible = trackCategories.get(round.trackId).filter(({ id }) => progress[id].streak < target);
    const fewest = Math.min(...eligible.map(({ id }) => progress[id].attempts));
    const even = eligible.filter(({ id }) => progress[id].attempts === fewest);
    const otherCategory = even.filter(({ id }) => id !== byId.get(previousId)?.category);
    const otherTrack = even.filter(({ track }) => track !== questionTrack(byId.get(previousId)));
    const pool = otherTrack.length ? otherTrack : otherCategory.length ? otherCategory : even;
    const category = previousId === example.id ? 'compose' : pick(pool, random).id;
    if (category === 'compose' && !round.attempts.some(item => item.questionId === example.id)) return example;

    const exposures = new Map();
    for (const { questionId } of round.attempts) exposures.set(questionId, (exposures.get(questionId) ?? 0) + 1);
    const choices = categoryQuestions.get(category).filter(question => canDraw(question, progress));
    const timesSeen = question => exposures.get(question.id) ?? 0;
    const leastSeen = Math.min(...choices.map(timesSeen));
    return pick(choices.filter(question => timesSeen(question) === leastSeen), random);
  }

  function shuffled(ids, random) {
    for (let index = ids.length - 1; index > 0; index--) {
      const other = Math.floor(random() * (index + 1));
      [ids[index], ids[other]] = [ids[other], ids[index]];
    }
    return ids;
  }

  function setQuestion(round, question, random) {
    round.questionId = question.id;
    round.draft = null;
    delete round.step;
    round.optionOrder = Object.fromEntries(question.fields.map(field => {
      const ids = field.options.map(({ id }) => id);
      return [field.id, field.id === 'first' ? ids : shuffled(ids, random)];
    }));
  }

  function current(round) {
    return byId.get(round.questionId);
  }

  function currentResult(round) {
    const latest = round.attempts.at(-1);
    return latest?.questionId === round.questionId ? latest.answer : null;
  }

  function stepIndex(round) {
    return round.step ?? 0;
  }

  function confirmStep(round) {
    const question = current(round);
    const step = stepIndex(round);
    if (!question.expression || currentResult(round) || step >= question.fields.length - 1
      || !validQuestionState(round) || !round.draft?.[question.fields[step].id]?.length) return false;
    round.step = step + 1;
    return true;
  }

  function start(record, now = Date.now(), random = Math.random) {
    if (record.round?.completedAt === null) return false;
    if (record.round) record.history.push(record.round);
    const round = { trackId: mixed, startedAt: now, completedAt: null, questionId: null, draft: null, attempts: [], optionOrder: {} };
    setQuestion(round, draw(round, random), random);
    record.round = round;
    return true;
  }

  function resumePending(round) {
    const { questionId, optionOrder, draft } = round.pending;
    Object.assign(round, { questionId, optionOrder, draft });
    delete round.pending;
  }

  function advance(round, random = Math.random) {
    if (round.completedAt !== null || !currentResult(round)) return false;
    if (round.pending && round.questionId !== example.id) {
      resumePending(round);
    } else {
      setQuestion(round, draw(round, random), random);
    }
    return true;
  }

  function submit(round, answer, now = Date.now()) {
    const question = current(round);
    if (round.completedAt !== null || currentResult(round) || !complete(question, answer)) return false;
    if (question.expression && (stepIndex(round) !== question.fields.length - 1
      || question.fields.slice(0, -1).some(field => answer[field.id][0] !== round.draft?.[field.id]?.[0]))) return false;
    round.attempts.push({ questionId: round.questionId, answer: Object.fromEntries(question.fields.map(({ id }) => [id, [...answer[id]]])) });
    round.draft = null;
    delete round.step;
    if (mastered(round) === trackCategories.get(round.trackId).length) round.completedAt = Math.max(round.startedAt, now);
    return true;
  }

  function summarize(round) {
    const rows = trackCategories.get(round.trackId).map(({ id, title, track }) => ({
      id, title, track, answered: 0, wrong: 0, firstWrong: 0, intermediateWrong: 0, resultOnlyWrong: 0,
      factsWrong: 0, unknownWrong: 0, equationWrong: 0
    }));
    const byCategory = new Map(rows.map(row => [row.id, row]));
    for (const { questionId, answer } of round.attempts) {
      const question = byId.get(questionId);
      if (question === example) continue;
      const row = byCategory.get(question.category);
      const { correct, fields } = grade(question, answer, round.legacy);
      row.answered++;
      if (!correct) row.wrong++;
      if (fields.first === false) row.firstWrong++;
      if (fields.intermediate === false) row.intermediateWrong++;
      if (fields.first && (round.legacy || fields.intermediate) && !fields.result) row.resultOnlyWrong++;
      if (fields.facts === false) row.factsWrong++;
      if (fields.unknown === false) row.unknownWrong++;
      if (fields.equation === false) row.equationWrong++;
    }
    return rows;
  }

  function validOptionOrder(question, ordering, legacy) {
    const fields = fieldsFor(question, legacy);
    return isObject(ordering) && Object.keys(ordering).length === fields.length && fields.every(field => {
      const ids = ordering[field.id];
      return Array.isArray(ids) && ids.length === field.options.length && new Set(ids).size === ids.length
        && field.options.every(option => ids.includes(option.id))
        && (field.id !== 'first' || ids.every((id, index) => id === field.options[index].id));
    });
  }

  function validTime(value) {
    return Number.isSafeInteger(value) && value >= 0 && value <= 8.64e15;
  }

  function validQuestionState(state, legacy) {
    const question = byId.get(state?.questionId);
    if (!question || !validOptionOrder(question, state.optionOrder, legacy)
      || (state.draft !== null && !validAnswer(question, state.draft, legacy))) return false;
    if (legacy || !question.expression) return state.step === undefined;
    const step = stepIndex(state);
    return Number.isInteger(step) && step >= 0 && step < question.fields.length
      && question.fields.every((field, index) => {
        if (index < step) return state.draft?.[field.id]?.length === field.correct.length;
        return index === step || state.draft?.[field.id] === undefined;
      });
  }

  function available(question, progress, exampleDone) {
    if (question === example) return Object.hasOwn(progress, 'compose') && !exampleDone;
    return canDraw(question, progress) && (question.category !== 'compose' || exampleDone);
  }

  function validRound(round, trackId, legacy) {
    if (!validQuestionState(round, legacy) || round.trackId !== trackId
      || !validTime(round.startedAt) || !Array.isArray(round.attempts)) return false;

    const question = current(round);
    const progress = newProgress(trackId);
    let exampleDone = false;
    let composeNext = false;
    for (const attempt of round.attempts) {
      const answered = byId.get(attempt?.questionId);
      if (!answered || !complete(answered, attempt.answer, legacy) || !available(answered, progress, exampleDone)
        || (composeNext && answered.category !== 'compose')) return false;
      if (answered === example) {
        exampleDone = true;
        // 旧轮次中示例之后紧接编题。合并后的记录可以在两者之间含有另一组作答。
        composeNext = trackId === 'meaning';
      } else {
        applyAttempt(progress, answered, attempt.answer, legacy);
        composeNext = false;
      }
    }

    const finished = Object.values(progress).every(item => item.streak === target);
    const submitted = currentResult(round) !== null;
    if (Object.hasOwn(round, 'pending')) {
      if (trackId !== mixed || finished || !validQuestionState(round.pending, legacy) || round.pending.step !== undefined) return false;
      const pending = current(round.pending);
      if (questionTrack(pending) === questionTrack(question) || !available(pending, progress, exampleDone)) return false;
    }
    if (finished) return submitted && round.draft === null && validTime(round.completedAt) && round.completedAt >= round.startedAt;
    if (round.completedAt !== null) return false;
    if (submitted) return round.draft === null;
    if (composeNext && question.category !== 'compose') return false;
    return available(question, progress, exampleDone);
  }

  function validLegacy(data) {
    return isObject(data) && tracks.some(({ id }) => id === data.trackId) && isObject(data.tracks)
      && tracks.every(({ id }) => {
        const record = data.tracks[id];
        return isObject(record) && Array.isArray(record.history)
          && record.history.every(round => validRound(round, id, true) && round.completedAt !== null)
          && (record.round === null || validRound(record.round, id, true));
      });
  }

  function validData(data, legacy = false) {
    return isObject(data) && (!Object.hasOwn(data, 'migratedFrom') || [v1Key, v2Key].includes(data.migratedFrom))
      && Array.isArray(data.history) && data.history.every(round => trackCategories.has(round?.trackId)
        && (round.legacy === undefined || round.legacy === true)
        && validRound(round, round.trackId, legacy || round.legacy) && round.completedAt !== null)
      && (data.round === null || (data.round?.legacy === undefined && validRound(data.round, mixed, legacy)));
  }

  function migrateV1(record, key) {
    if (record.schemaVersion !== 1 || !validLegacy(record.data)) return null;
    const old = JSON.parse(JSON.stringify(record.data));
    const records = tracks.map(({ id }) => old.tracks[id]);
    const data = {
      round: null,
      history: records.flatMap(item => item.history).sort((a, b) => a.completedAt - b.completedAt),
      migratedFrom: key
    };
    const rounds = records.flatMap(item => item.round ? [item.round] : []);
    if (rounds.length) {
      const selected = old.tracks[old.trackId].round;
      const primary = selected?.completedAt === null ? selected
        : rounds.find(round => round.completedAt === null) ?? rounds.reduce((a, b) => a.completedAt >= b.completedAt ? a : b);
      const other = rounds.find(round => round !== primary);
      data.round = {
        ...primary, trackId: mixed,
        startedAt: Math.min(...rounds.map(round => round.startedAt)),
        completedAt: rounds.length === tracks.length && rounds.every(round => round.completedAt !== null) ? primary.completedAt : null,
        attempts: [...(other?.attempts ?? []), ...primary.attempts]
      };
      if (other?.completedAt === null && !currentResult(other)) {
        const { questionId, draft, optionOrder } = other;
        data.round.pending = { questionId, draft, optionOrder };
      }
    }
    return validData(data, true) ? data : null;
  }

  function upgradeQuestionState(state, random) {
    const question = current(state);
    if (!question.expression) return;
    const interim = question.fields.find(field => field.id === 'intermediate');
    state.optionOrder.intermediate = shuffled(interim.options.map(({ id }) => id), random);
    state.draft = state.draft?.first ? { first: state.draft.first } : null;
  }

  function migrate(record, key, random = Math.random) {
    if (record?.exerciseId !== 'arithmetic-foundations' || record.bankVersion !== '1.0') return null;
    const previous = key === v1Key ? migrateV1(record, key)
      : key === v2Key && record.schemaVersion === 2 && validData(record.data, true) ? JSON.parse(JSON.stringify(record.data)) : null;
    if (!previous) return null;

    const { round } = previous;
    const history = previous.history.map(item => ({ ...item, legacy: true }));
    const data = { round, history, migratedFrom: key };
    if (round?.completedAt != null) {
      history.push({ ...round, legacy: true });
      data.round = null;
    } else if (round) {
      const submittedOrder = current(round).expression && currentResult(round);
      // 旧顺序题只有两步成绩。历史沿用原判分，进行中只续计评分方式相同的题。
      round.attempts = round.attempts.filter(attempt => !byId.get(attempt.questionId).expression);
      if (submittedOrder && !round.pending) {
        setQuestion(round, draw(round, random), random);
      } else {
        if (submittedOrder) resumePending(round);
        upgradeQuestionState(round, random);
      }
      if (round.pending) upgradeQuestionState(round.pending, random);
    }
    return validData(data) ? data : null;
  }

  window.ArithmeticTraining = {
    emptyData, complete, grade, streaks, mastered, current, currentResult, start, advance, submit, summarize, validData,
    stepIndex, confirmStep, v1Key, v2Key, migrate
  };
})();
