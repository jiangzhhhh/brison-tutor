(() => {
  'use strict';

  const bridge = window.ProgressBridge;
  if (bridge.isManagementFrame) return;

  const bank = window.ArithmeticBank;
  const training = window.ArithmeticTraining;
  const { id: exerciseId, storage } = window.EXERCISES.find(item => item.id === 'arithmetic-foundations');
  const { currentKey, schemaVersion, bankVersion, validate, auxiliaryKeys: [migrationKey, v2MigrationKey] } = storage;
  const $ = id => document.getElementById(id);
  const labelByField = { facts: '已知条件', unknown: '要问的问题', equation: '算式', first: '运算顺序', intermediate: '中间数', result: '最后结果' };
  const dateFormat = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'short', timeStyle: 'short' });

  function element(tag, content) {
    const node = document.createElement(tag);
    if (content !== undefined) node.textContent = content;
    return node;
  }

  function button(content, className) {
    const node = element('button', content);
    node.type = 'button';
    node.className = className;
    return node;
  }

  function notice(message) {
    $('storage-notice').hidden = !message;
    $('storage-notice').textContent = message;
  }

  let needsMigration = false;
  function restore() {
    if (bridge.invalidated) return training.emptyData();
    try {
      const raw = localStorage.getItem(currentKey);
      if (raw !== null) {
        const saved = JSON.parse(raw);
        if (saved?.schemaVersion === schemaVersion && saved.bankVersion === bankVersion && validate(saved)) return saved.data;
      } else {
        if (localStorage.getItem(migrationKey) !== null) return training.emptyData();
        let key = training.v2Key;
        let previous = localStorage.getItem(key);
        if (previous === null && localStorage.getItem(v2MigrationKey) === null) {
          key = training.v1Key;
          previous = localStorage.getItem(key);
        }
        if (previous === null) return training.emptyData();
        const migrated = training.migrate(JSON.parse(previous), key);
        if (migrated) {
          needsMigration = true;
          return migrated;
        }
      }
      notice('无法恢复练习进度，已暂停保存。请前往进度管理。');
    } catch {
      notice('无法读取进度，本次作答无法保存。');
    }
    bridge.invalidated = true;
    return training.emptyData();
  }

  const data = restore();
  let fieldViews = [];

  function save() {
    if (bridge.invalidated) return;
    try {
      const raw = JSON.stringify({ exerciseId, schemaVersion, bankVersion, updatedAt: new Date().toISOString(), data });
      const markMigration = needsMigration && localStorage.getItem(migrationKey) === null;
      if (markMigration) localStorage.setItem(migrationKey, '1');
      try {
        localStorage.setItem(currentKey, raw);
      } catch (error) {
        if (markMigration) localStorage.removeItem(migrationKey);
        throw error;
      }
      needsMigration = false;
      notice('');
    } catch {
      notice('无法保存进度。关闭或刷新页面可能丢失本次作答。');
    }
  }

  function choose(field, optionId) {
    const { round } = data;
    if (training.currentResult(round)) return;
    const draft = round.draft ?? {};
    const selected = draft[field.id] ?? [];
    if (selected.includes(optionId)) {
      draft[field.id] = selected.filter(id => id !== optionId);
    } else if (field.correct.length === 1) {
      draft[field.id] = [optionId];
    } else {
      if (selected.length === field.correct.length) return;
      draft[field.id] = [...selected, optionId];
    }
    round.draft = draft;
    save();
    updateFields(round);
  }

  function fieldView(question, field, optionOrder) {
    const root = element('fieldset');
    const legend = element('legend', field.label);
    if (field.label === question.title) legend.className = 'visually-hidden';
    if (field.id === 'intermediate') {
      const part = element('span', ` ${question.work.segment}`);
      part.className = 'visually-hidden';
      legend.append(part);
    }
    root.append(legend);
    const options = new Map();
    const choices = element('div');
    root.append(choices);
    if (field.id === 'first') {
      choices.className = 'operator-row';
      let optionIndex = 0;
      for (const part of question.expression.match(/[＋−×÷]|[^＋−×÷]+/g)) {
        if (part.length === 1 && '＋−×÷'.includes(part)) {
          const option = field.options[optionIndex++];
          const control = button(part, 'option operator');
          control.setAttribute('aria-label', `先算 ${option.label}`);
          control.onclick = () => choose(field, option.id);
          options.set(option.id, { control });
          choices.append(control);
        } else choices.append(element('span', part));
      }
    } else {
      choices.className = 'options';
      if (field.options.some(({ label }) => label.length > 12)) choices.classList.add('stack');
      for (const id of optionOrder) {
        const { label } = field.options.find(option => option.id === id);
        const control = button(undefined, 'option');
        const mark = element('span', '✓');
        mark.className = 'choice-mark';
        mark.setAttribute('aria-hidden', 'true');
        mark.hidden = true;
        const text = element('span', label);
        text.dataset.pinyin = '';
        control.append(mark, text);
        control.onclick = () => choose(field, id);
        options.set(id, { control, mark });
        choices.append(control);
      }
    }
    return { root, field, options };
  }

  function updateFields(round) {
    const result = training.currentResult(round);
    const answer = result ?? round.draft ?? {};
    const question = training.current(round);
    const currentStep = question.expression ? (result ? question.fields.length - 1 : training.stepIndex(round)) : null;
    let visible = true;
    for (const [index, { root, field, options }] of fieldViews.entries()) {
      const selected = answer[field.id] ?? [];
      root.hidden = currentStep === null ? !visible : index !== currentStep;
      root.disabled = Boolean(result);
      for (const [id, { control, mark }] of options) {
        const isSelected = selected.includes(id);
        control.setAttribute('aria-pressed', String(isSelected));
        if (mark) mark.hidden = !isSelected;
      }
      visible = visible && selected.length === field.correct.length;
    }
    const moveStep = currentStep !== null && currentStep < question.fields.length - 1;
    $('submit').textContent = moveStep ? '下一步' : '提交答案';
    $('submit').disabled = moveStep ? !answer[question.fields[currentStep].id]?.length : !training.complete(question, answer);
    $('submit').hidden = Boolean(result);
    $('next-actions').hidden = !result;
  }

  function renderFeedback(node, question, answer) {
    const { correct, fields } = training.grade(question, answer);
    const summary = element('p', correct ? '答对了。' : '这题答错了。');
    summary.dataset.correct = String(correct);
    node.replaceChildren(summary);
    if (question.fields.length > 1) {
      const details = element('ul');
      for (const { id } of question.fields) {
        const item = element('li', `${labelByField[id]}：${fields[id] ? '正确' : '错误'}`);
        item.dataset.correct = String(fields[id]);
        details.append(item);
      }
      node.append(details);
    }
    const explanation = element('p', question.explanation);
    explanation.dataset.pinyin = '';
    node.append(explanation);
  }

  function renderOrderWork(question, round, answer) {
    const step = answer ? question.fields.length - 1 : training.stepIndex(round);
    const visible = Boolean(question.expression && step > 0);
    $('order-work').hidden = !visible;
    const feedback = $('step-feedback');
    feedback.hidden = true;
    if (!visible) return;

    const { before, segment, after, replacement } = question.work;
    $('original-expression').replaceChildren(before, element('u', segment), after);
    const simplified = $('new-expression');
    simplified.hidden = step === 1;
    if (step > 1) {
      const value = element('span', replacement);
      value.className = 'replacement';
      simplified.replaceChildren('＝', before, value, after);
    }
    if (answer) return;
    const { fields } = training.grade(question, round.draft);
    if (step === 1 && !fields.first) {
      feedback.textContent = `这一步应先算 ${segment}。`;
      feedback.hidden = false;
    } else if (step === 2 && !fields.intermediate) {
      feedback.textContent = `画线部分算错了，应等于 ${replacement}。`;
      feedback.hidden = false;
    }
  }

  function renderQuestion(round) {
    const question = training.current(round);
    const answer = training.currentResult(round);
    const step = answer && question.expression ? question.fields.length - 1 : training.stepIndex(round);
    $('question-title').textContent = question.expression
      ? [question.title, '算出中间数', '算最后一步'][step] : question.title;
    $('mastered').textContent = `已达标 ${training.mastered(round)} / ${bank.categories.length} 类`;
    const prompt = $('prompt');
    prompt.hidden = Boolean(question.expression);
    prompt.textContent = question.expression ? '' : question.prompt;
    prompt.classList.toggle('expression', question.feature === 'reverse');
    fieldViews = question.fields.map(field => fieldView(question, field, round.optionOrder[field.id]));
    $('fields').replaceChildren(...fieldViews.map(({ root }) => root));
    renderOrderWork(question, round, answer);
    $('feedback').hidden = !answer;
    if (answer) renderFeedback($('feedback'), question, answer);
    updateFields(round);
    window.PinyinAid.annotate($('practice'));
  }

  function substats(row, legacy) {
    if (row.track === 'order') {
      const intermediate = legacy ? '' : `中间数算错 ${row.intermediateWrong} 道，`;
      return `顺序选错 ${row.firstWrong} 道，${intermediate}只算错最后结果 ${row.resultOnlyWrong} 道。`;
    }
    if (row.id === 'compose') return `条件错 ${row.factsWrong} 道，所求量错 ${row.unknownWrong} 道，算式错 ${row.equationWrong} 道。`;
    return '';
  }

  function stats(round) {
    const panel = element('div');
    const table = element('table');
    table.className = 'stats';
    const head = table.createTHead().insertRow();
    for (const label of ['类别', '做题数', '错题数']) {
      const heading = element('th', label);
      heading.scope = 'col';
      head.append(heading);
    }
    const body = table.createTBody();
    for (const row of training.summarize(round)) {
      const entry = body.insertRow();
      const title = element('th', row.title);
      title.scope = 'row';
      const details = substats(row, round.legacy);
      if (details) title.append(element('small', details));
      entry.append(title);
      entry.insertCell().textContent = row.answered;
      entry.insertCell().textContent = row.wrong;
    }
    panel.append(table);
    const sample = round.attempts.find(({ questionId }) => questionId === bank.example.id);
    if (sample) {
      const result = training.grade(bank.example, sample.answer).correct ? '答对' : '答错';
      const note = element('p', `编题前的示例：${result}。`);
      note.className = 'stats-note';
      panel.append(note);
    }
    return panel;
  }

  function render() {
    const { round, history } = data;
    const finished = Boolean(round && round.completedAt !== null);
    $('intro').hidden = Boolean(round);
    $('practice').hidden = !round || finished;
    $('completion').hidden = !finished;
    $('history').hidden = history.length === 0;
    if (finished) {
      renderFeedback($('final-feedback'), training.current(round), training.currentResult(round));
      $('completion-stats').replaceChildren(stats(round));
      window.PinyinAid.annotate($('final-feedback'));
    } else if (round) renderQuestion(round);
    $('history-list').replaceChildren(...history.slice().reverse().map(item => {
      const details = element('details');
      const date = dateFormat.format(item.completedAt);
      const track = bank.tracks.find(({ id }) => id === item.trackId);
      details.append(element('summary', track ? `${date} · ${track.title}` : date), stats(item));
      return details;
    }));
  }

  function begin() {
    if (!training.start(data)) return;
    save();
    render();
    $('question-title').focus();
  }

  $('start').onclick = begin;
  $('restart').onclick = begin;
  $('answer-form').onsubmit = event => {
    event.preventDefault();
    const { round } = data;
    if (training.confirmStep(round)) {
      save();
      renderQuestion(round);
      $('question-title').focus();
      return;
    }
    if (!training.submit(round, round.draft)) return;
    save();
    render();
    $(round.completedAt === null ? 'feedback' : 'completion-title').focus();
  };
  $('next').onclick = () => {
    const { round } = data;
    if (!training.advance(round)) return;
    save();
    render();
    $('question-title').focus();
  };
  if (needsMigration) save();
  render();
})();
