(() => {
  'use strict';
  if (window.ProgressBridge?.isManagementFrame) return;

  const bank = window.MathFocusBank;
  const model = window.MathFocusModel;
  const $ = id => document.getElementById(id);
  const questions = new Map(bank.questions.map(question => [question.id, question]));
  const groupByQuestion = new Map(bank.rounds.flatMap(group => group.questionIds.map(id => [id, group])));
  const applicationGroups = bank.rounds.filter(group => group.section === 'word-problems');
  const reviewGroups = bank.rounds.filter(group => group.section !== 'word-problems');
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  function storageError(message) {
    $('storage-error').hidden = false;
    $('storage-error').innerHTML = `${escape(message)} <a href="../../../../progress.html">进度管理</a>`;
    $('saved').textContent = '';
  }

  let storage;
  try { storage = window.localStorage; }
  catch { storage = {getItem() { throw Error('denied'); }}; }
  const persistence = model.persistence(storage, window.ProgressBridge, storageError);
  const loaded = persistence.load();
  let state = loaded.state;
  if (loaded.updatedAt && !loaded.error) $('saved').textContent = '已恢复上次进度';

  function save() {
    if (loaded.error) { storageError(loaded.error); return; }
    if (persistence.save(state, new Date().toISOString())) {
      $('storage-error').hidden = true;
      $('saved').textContent = '进度已保存';
    }
  }

  function table(question) {
    if (!question.table) return '';
    const headers = question.table.headers.map(text => `<th scope="col" data-pinyin>${escape(text)}</th>`).join('');
    const rows = question.table.rows.map(row => `<tr>${row.map(cell => `<td data-pinyin>${escape(cell)}</td>`).join('')}</tr>`).join('');
    return `<table class="question-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  }

  function feedback(question, result) {
    const answer = question.choices.find(choice => choice.id === question.answer);
    return `<div class="feedback${result.correct ? '' : ' incorrect'}" role="status">
      <div class="result-title">${result.correct ? '✓ 回答正确' : '× 回答错误'}</div>
      <p data-pinyin>正确答案：${escape(answer.id)}．${escape(answer.text)}</p><p data-pinyin>${escape(question.explanation)}</p>
    </div>`;
  }

  function renderGroups(groups, returnId) {
    return groups.map(group => {
      const rows = group.questionIds.map((id, index) => {
        const question = questions.get(id);
        const progress = model.questionProgress(state, id);
        const status = progress.draft !== null ? '有草稿' : progress.attempts.length ? '已作答' : '';
        return `<li><button type="button" id="practice-${id}" data-action="open" data-question="${id}">
          <span data-pinyin>${index + 1}. ${escape(question.prompt)}</span><small class="practice-question-status">${status}</small>
        </button></li>`;
      }).join('');
      return `<details class="practice-question-group" ${group.questionIds.includes(returnId) ? 'open' : ''}>
        <summary>${escape(group.title)} · ${group.questionIds.length} 题</summary><ul>${rows}</ul>
      </details>`;
    }).join('');
  }

  function home(returnId) {
    return `<section class="practice-question-list" aria-labelledby="list-heading">
      <h2 id="list-heading" tabindex="-1">题目列表</h2>
      <h3>应用题</h3>${renderGroups(applicationGroups, returnId)}
      <h3>阶段卷错题练习</h3>${renderGroups(reviewGroups, returnId)}
    </section>`;
  }

  function renderQuestion(id) {
    const group = groupByQuestion.get(id);
    const question = questions.get(id);
    const progress = model.questionProgress(state, id);
    const result = progress.submitted ? progress.attempts.at(-1) : null;
    const selected = result?.choice ?? progress.draft;
    const options = question.choices.map(choice => `<label class="option">
      <input type="radio" name="answer" value="${choice.id}" ${selected === choice.id ? 'checked' : ''} ${result ? 'disabled' : ''}>
      <span class="option-text"><span class="letter">${choice.id}</span><span data-pinyin>${escape(choice.text)}</span></span>
    </label>`).join('');
    const index = group.questionIds.indexOf(id) + 1;
    return `<button class="secondary back" type="button" data-action="home">返回题目列表</button>
      <section class="card" aria-labelledby="question-title">
        <div class="question-meta"><span class="meta">${escape(group.title)}</span><span class="meta">第 ${index} / ${group.questionIds.length} 题</span></div>
        ${group.id === 'directions' ? '<p class="meta" data-pinyin>标准方位图：上北、下南、左西、右东。</p>' : ''}
        ${question.context ? `<p data-pinyin>${escape(question.context)}</p>` : ''}
        <h2 id="question-title" class="question-title" tabindex="-1" data-pinyin>${escape(question.prompt)}</h2>${table(question)}
        <fieldset class="options"><legend class="sr-only">选择一个答案</legend>${options}</fieldset>
        ${result ? feedback(question, result) : ''}
        <div class="actions">${result
          ? '<button class="secondary" type="button" data-action="retry">再练一次</button>'
          : `<button class="primary" id="submit" type="button" data-action="submit" ${selected === null ? 'disabled' : ''}>提交答案</button>`}
        </div>
      </section>`;
  }

  function render(focus = false, returnId = null) {
    $('action-error').textContent = '';
    const id = state.practice?.questionId;
    $('overall').textContent = `已提交 ${Object.keys(model.firstResults(state)).length} / ${bank.questions.length} 题`;
    const app = $('app');
    app.innerHTML = id ? renderQuestion(id) : home(returnId);
    if (id) window.PinyinAid?.annotate(app);
    else if (returnId) window.PinyinAid?.annotate($('practice-' + returnId).closest('details'));
    if (focus) $(id ? 'question-title' : returnId ? 'practice-' + returnId : 'list-heading').focus();
  }

  $('app').addEventListener('toggle', event => {
    if (event.target.matches('details.practice-question-group[open]')) window.PinyinAid?.annotate(event.target);
  }, true);

  $('app').addEventListener('change', event => {
    if (event.target.name !== 'answer') return;
    try {
      state = model.chooseQuestion(state, event.target.value);
      save();
      $('submit').disabled = false;
    } catch (error) {
      $('action-error').textContent = error.message;
    }
  });

  $('app').addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button || button.disabled) return;
    const {action, question} = button.dataset;
    const returnId = action === 'home' ? state.practice?.questionId : null;
    try {
      if (action === 'home' || action === 'open') state = model.selectQuestion(state, question ?? null);
      else if (action === 'submit') state = model.submitQuestion(state, new Date().toISOString());
      else if (action === 'retry') state = model.retryQuestion(state);
      save();
      render(true, returnId);
    } catch (error) {
      $('action-error').textContent = error.message;
    }
  });
  render();
})();
