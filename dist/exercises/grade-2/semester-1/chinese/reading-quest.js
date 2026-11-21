(() => {
  'use strict';

  const bridge = window.ProgressBridge;
  if (bridge?.isManagementFrame) return;
  const { ReadingQuestBank: bank, ReadingQuestModel: randomModel, ReadingQuestClassified: classified } = window;
  const exercise = classified || randomModel;
  const mount = document.getElementById('quest');
  const errorBox = document.getElementById('storage-error');
  const errorText = document.getElementById('storage-message');
  const progress = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const groups = new Map(bank.groups.map(group => [group.id, group]));

  function reportError(message) {
    if (bridge?.invalidated) return;
    errorText.textContent = message;
    errorBox.hidden = false;
  }

  const storage = {
    getItem: key => window.localStorage.getItem(key),
    setItem: (key, value) => window.localStorage.setItem(key, value),
  };
  const persistence = exercise.persistence(storage, bridge, reportError);
  let state = persistence.load();
  let selectedId = null;
  let lastQuestionId = null;

  if (classified) {
    document.getElementById('classified-mode').setAttribute('aria-current', 'page');
    document.getElementById('random-mode').removeAttribute('aria-current');
  }

  const escape = text => String(text).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);

  function questionView(current, variant, groupId, completed = false) {
    const options = current.order.map(index => `<label class="option">
      <input type="radio" name="answer" value="${index}" ${current.choice === index ? 'checked' : ''} ${current.submitted ? 'disabled' : ''}>
      <span data-pinyin>${escape(variant.choices[index])}</span>
    </label>`).join('');
    const fieldset = `<fieldset class="options"><legend>选一个答案</legend>${options}</fieldset>`;
    const paper = `<p class="passage" id="quest-passage" data-pinyin>${escape(variant.chinese_text)}</p>
      <h2 id="quest-heading" tabindex="-1" aria-describedby="quest-passage" data-pinyin>${escape(variant.question)}</h2>`;
    const back = '<button class="secondary" type="button" data-action="question-list">返回题目列表</button>';
    if (!current.submitted) {
      return `<section class="card" aria-labelledby="quest-heading">${paper}<form id="answer-form">${fieldset}
        <button class="primary" type="submit" ${current.choice === null ? 'disabled' : ''}>提交答案</button>
      </form>${classified ? back : ''}</section>`;
    }
    const correct = variant.choices[current.choice] === variant.answer;
    const group = groups.get(groupId);
    const buttons = classified
      ? `<div class="question-actions">${back}<button class="secondary" type="button" data-action="retry-question">再练一次</button></div>`
      : `<button class="primary" type="button" data-action="next">${completed ? '查看结果' : '下一题'}</button>`;
    const license = bank.sources[group.source];
    return `<section class="card" aria-labelledby="quest-heading">${paper}${fieldset}
      <div class="feedback" role="status" tabindex="-1" data-correct="${correct}">
        <strong>${correct ? '答对了' : '答错了'}</strong>
        <p>正确答案：<span data-pinyin>${escape(variant.answer)}</span></p>
        <p data-pinyin>${escape(variant.explanation)}</p>
      </div>
      ${buttons}
      <p class="source">改编自 <a href="${escape(license.url)}" target="_blank" rel="noopener noreferrer">${escape(license.name)}</a> · ${escape(group.source_author)} · ${escape(license.license)}</p>
    </section>`;
  }

  function duration(round) {
    const seconds = Math.floor((round.completedAt - round.startedAt) / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60) % 60;
    return `${hours ? `${hours} 小时 ` : ''}${minutes ? `${minutes} 分 ` : ''}${seconds % 60} 秒`;
  }

  function resultView(saved, model) {
    const { round, history } = saved;
    const score = model.stats(round);
    const first = history[0];
    return `<section class="card" aria-labelledby="quest-heading">
      <h2 id="quest-heading" tabindex="-1">通关</h2>
      <p>用时 ${duration(round)}，答对 ${score.correct} 次，答错 ${score.incorrect} 次。</p>
      ${first ? `<p>首次通关用时 ${duration(first)}。</p>` : ''}
      <button class="secondary" type="button" data-action="start">再练一次</button>
    </section>`;
  }

  function questionsView() {
    const categoryLists = classified.profiles.map(({ name, questions }) => {
      const answered = questions.filter(variant => state.records[variant.id]?.attempts.length).length;
      const items = questions.map((variant, index) => {
        const { id, chinese_text, question } = variant;
        const record = state.records[id];
        const lastAnswer = record?.attempts.at(-1);
        let status = '';
        if (record?.choice != null && !record.submitted) status = '草稿';
        else if (lastAnswer !== undefined) status = variant.choices[lastAnswer] === variant.answer ? '答对' : '答错';
        const preview = chinese_text.length > 20 ? `${chinese_text.slice(0, 20)}…` : chinese_text;
        return `<li><button type="button" data-action="question" data-question="${escape(id)}">
          <span><span class="question-number">第 ${index + 1} 题</span> <span data-pinyin>${escape(preview)} ${escape(question)}</span></span>
          ${status ? `<span class="practice-question-status">${status}</span>` : ''}
        </button></li>`;
      }).join('');
      const open = questions.some(variant => variant.id === lastQuestionId);
      return `<details class="practice-question-group" ${open ? 'open' : ''}>
        <summary>${escape(name)} <span class="practice-question-status">已答 ${answered} / ${questions.length} 题</span></summary>
        <ul>${items}</ul>
      </details>`;
    }).join('');
    return `<section class="practice-question-list" aria-label="题目列表">${categoryLists}</section>`;
  }

  function render(focus = false) {
    if (classified) {
      progress.parentElement.hidden = true;
      if (selectedId === null) {
        mount.innerHTML = questionsView();
        for (const detail of mount.querySelectorAll('details[open]')) window.PinyinAid?.annotate(detail);
        if (focus && lastQuestionId) mount.querySelector(`[data-question="${CSS.escape(lastQuestionId)}"]`).focus();
        return;
      }
      const { variant, groupId } = classified.entry(selectedId);
      mount.innerHTML = questionView(classified.current(state, selectedId), variant, groupId);
    } else {
      const { round } = state;
      const cleared = round ? randomModel.stats(round).cleared : 0;
      progress.max = randomModel.total;
      progress.value = cleared;
      const label = `已消除 ${cleared} / ${randomModel.total} 组`;
      if (progressText.textContent !== label) progressText.textContent = label;
      if (!round) {
        mount.innerHTML = `<section class="card" aria-label="开始练习">
          <p>同组连续答对两次，就能消除这一组。</p>
          <button class="primary" type="button" data-action="start">开始练习</button>
        </section>`;
      } else {
        mount.innerHTML = round.current
          ? questionView(round.current, randomModel.question(round.current), round.current.groupId, round.completedAt !== null)
          : resultView(state, randomModel);
      }
    }
    window.PinyinAid?.annotate(mount);
    if (focus) (mount.querySelector('.feedback') || mount.querySelector('#quest-heading'))?.focus();
  }

  function update(next, refresh = true) {
    if (next === state) return;
    state = next;
    Promise.resolve(persistence.save(next)).then(saved => {
      if (saved && next === state) errorBox.hidden = true;
    });
    if (refresh) render(true);
  }

  mount.addEventListener('toggle', event => {
    if (event.target.matches('details.practice-question-group[open]')) window.PinyinAid?.annotate(event.target);
  }, true);

  mount.addEventListener('change', event => {
    if (event.target.name !== 'answer' || event.target.disabled) return;
    const choice = Number(event.target.value);
    const next = classified ? classified.choose(state, selectedId, choice) : randomModel.choose(state, choice);
    update(next, false);
    const current = classified ? classified.current(state, selectedId) : state.round?.current;
    const submit = mount.querySelector('button[type="submit"]');
    if (submit) submit.disabled = current?.choice == null;
  });
  mount.addEventListener('submit', event => {
    if (event.target.id !== 'answer-form') return;
    event.preventDefault();
    update(classified ? classified.submit(state, selectedId) : randomModel.submit(state));
  });
  mount.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action, question } = button.dataset;
    if (action === 'question' && classified?.entry(question)) {
      selectedId = lastQuestionId = question;
      render(true);
    }
    if (action === 'question-list') {
      selectedId = null;
      render(true);
    }
    if (action === 'retry-question') update(classified.reset(state, selectedId));
    if (action === 'start') update(randomModel.start(state));
    if (action === 'next') update(randomModel.next(state));
  });
  render();
})();
