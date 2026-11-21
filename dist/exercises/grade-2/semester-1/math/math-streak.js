(() => {
  'use strict';

  const bridge = window.ProgressBridge;
  if (bridge.isManagementFrame) return;

  const training = window.MathStreak;
  const exercise = window.EXERCISES.find(item => item.id === 'math-streak');
  const $ = id => document.getElementById(id);

  function element(tag, text) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function notice(message) {
    $('storage-notice').hidden = !message;
    $('storage-message').textContent = message;
  }

  const persistence = training.persistence(() => window.localStorage, exercise, bridge, notice);
  let data = persistence.restore();

  function duration(round) {
    const seconds = Math.floor((round.completedAt - round.startedAt) / 1000);
    const minutes = Math.floor(seconds / 60);
    return `用时 ${minutes ? minutes + ' 分 ' : ''}${seconds % 60} 秒`;
  }

  function showFeedback(node, question, result) {
    const correct = result.answer === question.answer;
    const answer = question.choices.find(choice => choice.id === question.answer);
    node.dataset.correct = String(correct);
    node.replaceChildren(
      element('p', correct ? '回答正确' : '回答错误'),
      element('p', `正确答案：${answer.id}．${answer.text}`),
      element('p', question.explanation)
    );
  }

  function renderPractice(round, question, result, focus) {
    const mastered = Object.values(training.streaks(round)).filter(value => value >= 2).length;
    $('mastered').textContent = `已达标 ${mastered} / ${training.categories.length} 类`;
    $('question').textContent = question.prompt;
    $('answer-form').hidden = !!result;
    $('feedback').hidden = !result;
    $('next').hidden = !result;
    if (result) {
      showFeedback($('feedback'), question, result);
      if (focus) $('feedback').focus();
      return;
    }
    $('options').replaceChildren(...question.choices.map(choice => {
      const input = element('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = choice.id;
      input.checked = round.draft === choice.id;
      const label = element('label');
      label.className = 'option';
      label.append(input, element('span', `${choice.id}．${choice.text}`));
      return label;
    }));
    $('submit').disabled = round.draft === null;
    if (focus) $('question').focus();
  }

  function render(focus = false) {
    const {round, history} = data;
    const done = !!round && round.completedAt !== null;
    $('intro').hidden = !!round;
    $('practice').hidden = !round || done;
    $('completion').hidden = !done;
    $('history').hidden = !done || !history.length;
    if (!round) return;
    const question = training.question(round);
    const result = training.currentResult(round);
    if (!done) {
      renderPractice(round, question, result, focus);
      return;
    }
    $('completion-time').textContent = duration(round);
    showFeedback($('final-feedback'), question, result);
    $('history-list').replaceChildren(...history.map(item => element('li', duration(item))));
    if (focus) $('completion-title').focus();
  }

  function changeRound(round) {
    if (!round) return;
    data = {...data, round};
    persistence.save(data);
    render(true);
  }

  function start() {
    const started = training.start(data);
    if (!started) return;
    data = started;
    persistence.save(data);
    render(true);
  }

  $('start').onclick = start;
  $('retry').onclick = start;
  $('answer-form').addEventListener('change', event => {
    if (event.target.name !== 'answer') return;
    const round = training.choose(data.round, event.target.value);
    if (!round) return;
    data = {...data, round};
    persistence.save(data);
    $('submit').disabled = false;
  });
  $('answer-form').addEventListener('submit', event => {
    event.preventDefault();
    changeRound(training.submit(data.round));
  });
  $('next').onclick = () => changeRound(training.advance(data.round));
  render();
})();
