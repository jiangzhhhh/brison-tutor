(() => {
  'use strict';
  const bridge = window.ProgressBridge;
  if (bridge.isManagementFrame) return;

  const bank = window.Punctuation;
  const training = window.PunctuationTraining;
  const { categories, questions, names } = bank;
  const { id: exerciseId, storage: { currentKey, schemaVersion, bankVersion, validate, auxiliaryKeys: [migrationKey] } } = window.EXERCISES.find(item => item.id === 'punctuation');
  const previousKey = 'brison-tutor:progress:punctuation:v2';
  const $ = id => document.getElementById(id);
  const sentence = $('sentence');
  const palette = $('palette');
  const caret = $('insertion-caret');
  const ghost = $('drag-mark');
  const practice = sentence.closest('.card');
  const preview = document.createElement('span');
  preview.className = 'insertion-preview';
  preview.setAttribute('aria-hidden', 'true');

  let data = { round: null, history: [] };
  let needsMigration = false;
  if (!bridge.invalidated) {
    try {
      const raw = localStorage.getItem(currentKey);
      if (raw !== null) {
        const saved = JSON.parse(raw);
        if (saved?.schemaVersion !== schemaVersion || String(saved.bankVersion) !== bankVersion || !validate(saved)) {
          bridge.invalidated = true;
          storageNotice('此页无法恢复练习进度，已暂停保存。请前往进度管理。');
        } else data = saved.data;
      } else if (localStorage.getItem(migrationKey) === null) {
        const previous = localStorage.getItem(previousKey);
        if (previous !== null) {
          const migrated = restorePrevious(previous);
          if (migrated) {
            data = migrated;
            needsMigration = true;
          } else storageNotice('无法恢复之前的练习进度，可以开始一轮新练习。');
        }
      }
    } catch {
      bridge.invalidated = true;
      storageNotice('无法读取浏览器进度，本次练习可能无法保存。');
    }
  }

  let question = null;
  let selected = '';
  let cursor = 0;
  let drag = null;
  let undoStack = [];
  let glyphs = [];
  let positions = [];
  let boxTarget = null;
  let previewTarget = null;

  function storageNotice(message) {
    $('storage-notice').textContent = message;
    $('storage-notice').hidden = false;
  }

  function restorePrevious(raw) {
    try {
      return training.migrateV2(JSON.parse(raw), previousKey);
    } catch {
      return null;
    }
  }

  function save() {
    if (bridge.invalidated) return;
    try {
      const raw = JSON.stringify({ exerciseId, schemaVersion, bankVersion, updatedAt: new Date().toISOString(), data });
      const markMigration = data.migratedFrom === previousKey && localStorage.getItem(migrationKey) === null;
      if (markMigration) localStorage.setItem(migrationKey, '1');
      try {
        localStorage.setItem(currentKey, raw);
      } catch (error) {
        if (markMigration) localStorage.removeItem(migrationKey);
        throw error;
      }
      $('storage-notice').hidden = true;
    } catch {
      storageNotice('无法保存进度。关闭或刷新页面可能丢失本次作答。');
    }
  }

  function editing() {
    return !training.currentResult(data.round);
  }

  function marks() {
    return data.round.draft ?? training.currentResult(data.round) ?? bank.blank(question);
  }

  function button(label, className = 'secondary') {
    const element = document.createElement('button');
    element.type = 'button';
    element.className = className;
    element.textContent = label;
    return element;
  }

  function renderQuestion() {
    question = questions.find(item => item.id === data.round.currentQuestionId);
    const number = data.round.attempts.length + Number(editing());
    $('question-title').textContent = `第 ${number} 题`;
    $('context').textContent = question.hint;
    palette.replaceChildren(...Array.from(question.palette, mark => {
      const choice = button('', 'secondary');
      choice.dataset.mark = mark;
      const symbol = document.createElement('span');
      symbol.className = 'mark';
      symbol.textContent = mark;
      symbol.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.className = 'mark-name';
      label.textContent = names[mark];
      choice.append(symbol, label);
      return choice;
    }));
    PinyinAid.annotate($('context'));
    renderAnswer();
  }

  function appendCorrection(parent, wrong, expected) {
    const change = document.createElement('span');
    change.className = 'correction';
    for (const [value, tag, className] of [[wrong, 'del', 'incorrect-mark'], [expected, 'ins', 'expected-mark']]) {
      if (!value) continue;
      const element = document.createElement(tag);
      element.className = className;
      element.textContent = value;
      change.append(element);
    }
    parent.append(change);
  }

  function renderInsertCorrections(current, expected) {
    const content = document.createElement('span');
    current.forEach((marks, index) => {
      const [prefix, wrong, replacement, suffix] = bank.changedMarks(marks, expected[index]);
      content.append(prefix);
      if (wrong || replacement) appendCorrection(content, wrong, replacement);
      content.append(suffix, question.parts[index] ?? '');
    });
    sentence.append(content);
    PinyinAid.annotate(sentence, { selector: '#sentence' });
    content.setAttribute('aria-hidden', 'true');
  }

  function renderAnswer(focusBox) {
    cancelDrag();
    const current = marks();
    const canEdit = editing();
    const correct = !canEdit && bank.correct(question, current);
    const expected = !canEdit && !correct ? bank.answerMarks(question) : null;
    sentence.replaceChildren();
    sentence.tabIndex = question.mode === 'insert' && canEdit ? 0 : -1;
    sentence.classList.toggle('can-edit', canEdit);
    if (question.mode === 'boxes') {
      sentence.setAttribute('aria-label', '要补标点的句子');
      if (canEdit) sentence.setAttribute('aria-describedby', 'keyboard-help-boxes');
      else sentence.removeAttribute('aria-describedby');
      question.parts.forEach((part, index) => {
        sentence.append(part);
        if (index === current.length) return;
        const mark = current[index];
        const slot = button(mark, `secondary box${mark ? ' filled' : ''}`);
        slot.dataset.slot = index;
        const correction = expected && mark !== expected[index] ? expected[index] : '';
        if (correction) {
          slot.classList.add('has-correction');
          slot.replaceChildren();
          appendCorrection(slot, mark, correction);
        }
        slot.setAttribute('aria-label', `第 ${index + 1} 个方框，${mark ? names[mark] : '空白'}${correction ? `，应填${names[correction]}` : ''}`);
        slot.disabled = !canEdit;
        sentence.append(slot);
      });
      PinyinAid.annotate(sentence, { selector: '#sentence' });
      if (focusBox !== undefined) sentence.querySelector(`[data-slot="${focusBox}"]`)?.focus({ preventScroll: true });
    } else if (expected) {
      sentence.removeAttribute('aria-describedby');
      sentence.setAttribute('aria-label', `你的作答，${bank.sentence(question, current)} 正确写法，${question.answer}`);
      renderInsertCorrections(current, expected);
    } else {
      const text = bank.sentence(question, current);
      sentence.setAttribute('aria-label', text);
      if (canEdit) sentence.setAttribute('aria-describedby', 'keyboard-help');
      else sentence.removeAttribute('aria-describedby');
      positions = bank.boundaries(current);
      glyphs = PinyinAid.segments(text).map(({ text: char, reading }, index) => {
        const glyph = document.createElement('span');
        const before = positions[index];
        const after = positions[index + 1];
        glyph.className = before.index === after.index ? 'glyph placed' : 'glyph';
        glyph.setAttribute('aria-hidden', 'true');
        if (reading) {
          const ruby = document.createElement('ruby');
          ruby.className = 'pinyin-ruby';
          const rt = document.createElement('rt');
          rt.textContent = reading;
          ruby.append(char, rt);
          glyph.append(ruby);
        } else glyph.textContent = char;
        return glyph;
      });
      sentence.append(...glyphs);
      cursor = Math.min(cursor, positions.length - 1);
    }

    syncSelection();
    const done = !canEdit;
    $('instructions').hidden = done;
    palette.hidden = done;
    $('undo').hidden = done;
    $('undo').disabled = !undoStack.length;
    $('submit').hidden = done;
    $('submit').disabled = !bank.complete(question, current);
    $('navigation').hidden = !done || data.round.completedAt !== null;
    const feedback = done ? (correct ? '答对了。' : '还有标点需要调整。') : '';
    if ($('feedback').textContent !== feedback) $('feedback').textContent = feedback;
    $('feedback').toggleAttribute('data-incorrect', done && !correct);

    $('progress-count').textContent = `已达标 ${training.mastered(data.round)} / ${data.round.requiredCategories.length} 类`;
  }

  const completedTimeFormat = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'medium', hourCycle: 'h23' });

  function showTime(element, value) {
    const date = new Date(value);
    element.dateTime = date.toISOString();
    element.textContent = completedTimeFormat.format(date);
  }

  function durationText(round) {
    const seconds = Math.floor((round.completedAt - round.startedAt) / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60) % 60;
    return [hours && `${hours} 小时`, minutes && `${minutes} 分钟`, `${seconds % 60} 秒`].filter(Boolean).join(' ');
  }

  function appendStatsRow(table, title, answered, wrong) {
    const row = table.tBodies[0].insertRow();
    const heading = document.createElement('th');
    heading.scope = 'row';
    heading.textContent = title;
    row.append(heading);
    row.insertCell().textContent = answered;
    const count = row.insertCell();
    count.textContent = wrong;
    count.classList.toggle('has-errors', wrong > 0);
  }

  function roundStats(round) {
    const content = $('round-stats').content.cloneNode(true);
    const stats = training.summarize(round);
    const categories = content.querySelector('[data-category-stats]');
    for (const row of stats.byCategory) appendStatsRow(categories, row.title, row.answered, row.wrong);

    const confusions = content.querySelector('[data-confusion-stats]');
    const { enumerationAsComma, commaAsEnumeration } = stats;
    confusions.hidden = enumerationAsComma.opportunities + commaAsEnumeration.opportunities === 0;
    appendStatsRow(confusions, '顿号填成逗号', enumerationAsComma.opportunities, enumerationAsComma.wrong);
    appendStatsRow(confusions, '逗号填成顿号', commaAsEnumeration.opportunities, commaAsEnumeration.wrong);
    return content;
  }

  function renderCompletion() {
    const round = data.round;
    $('completion').hidden = !round || round.completedAt === null;
    if ($('completion').hidden) return;
    showTime($('finished-at'), round.completedAt);
    $('duration').textContent = durationText(round);
    $('total-answered').textContent = `${round.attempts.length} 题`;
    $('completion-stats').replaceChildren(roundStats(round));
  }

  function renderHistory() {
    $('history').hidden = data.history.length === 0;
    $('history-list').replaceChildren(...data.history.slice().reverse().map(round => {
      const item = document.createElement('li');
      const details = document.createElement('details');
      const label = document.createElement('summary');
      const time = document.createElement('time');
      showTime(time, round.completedAt);
      label.append(time, ` · 用时 ${durationText(round)} · ${round.attempts.length} 题`);
      details.append(label, roundStats(round));
      item.append(details);
      return item;
    }));
  }

  function renderPage() {
    $('intro').hidden = data.round !== null;
    practice.hidden = data.round === null;
    if (data.round) renderQuestion();
    renderCompletion();
    renderHistory();
  }

  function resetQuestion() {
    cancelDrag();
    selected = '';
    cursor = 0;
    undoStack = [];
    $('selection-status').textContent = '';
  }

  function syncSelection() {
    for (const choice of palette.children) choice.setAttribute('aria-pressed', String(choice.dataset.mark === selected));
    sentence.classList.toggle('is-placing', Boolean(selected));
  }

  function clearTarget() {
    caret.hidden = true;
    boxTarget?.classList.remove('is-target');
    boxTarget = null;
    preview.remove();
    previewTarget = null;
    palette.classList.remove('is-return-target');
  }

  function showTarget(target, mark) {
    if (previewTarget && target && mark && previewTarget.cursor === target.cursor && preview.textContent === mark) return;
    clearTarget();
    if (!target) return;
    if (target.box) {
      boxTarget = target.box;
      boxTarget.classList.add('is-target');
      return;
    }
    if (mark) {
      preview.textContent = mark;
      sentence.insertBefore(preview, glyphs[target.cursor] ?? null);
      previewTarget = target;
      return;
    }
    const rect = target.glyph.getBoundingClientRect();
    const writing = $('writing').getBoundingClientRect();
    caret.style.left = `${(target.side === 'left' ? rect.left : rect.right) - writing.left}px`;
    caret.style.top = `${rect.top - writing.top}px`;
    caret.style.height = `${rect.height}px`;
    caret.hidden = false;
  }

  function cursorTarget(position) {
    const atEnd = position === glyphs.length;
    return { ...positions[position], cursor: position, glyph: glyphs[atEnd ? position - 1 : position], side: atEnd ? 'right' : 'left' };
  }

  function containsPoint(rect, x, y) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  function targetAt(x, y, gesture) {
    const bounds = sentence.getBoundingClientRect();
    if (!containsPoint(bounds, x, y)) return null;
    if (question.mode === 'boxes') {
      const box = document.elementFromPoint(x, y)?.closest('button[data-slot]');
      return box && sentence.contains(box) ? { index: Number(box.dataset.slot), box } : null;
    }
    // 预览让文字移位甚至换行。用未撑开时的位置确定新落点，避免落点跟着预览跳动。
    gesture.geometry ??= { bounds, glyphs: glyphs.map(glyph => glyph.getBoundingClientRect()) };
    const geometry = gesture.geometry.glyphs;
    x += gesture.geometry.bounds.left - bounds.left;
    y += gesture.geometry.bounds.top - bounds.top;
    const distanceY = rect => Math.abs(y - (rect.top + rect.bottom) / 2);
    const distanceX = rect => Math.max(rect.left - x, x - rect.right, 0);
    const closestLine = Math.min(...geometry.map(distanceY));
    let nearest = -1;
    geometry.forEach((rect, index) => {
      if (distanceY(rect) > closestLine + 8) return;
      if (nearest === -1 || distanceX(rect) < distanceX(geometry[nearest])) nearest = index;
    });
    const rect = geometry[nearest];
    const after = x >= (rect.left + rect.right) / 2;
    const position = nearest + Number(after);
    return { ...positions[position], cursor: position, glyph: glyphs[nearest], side: after ? 'right' : 'left' };
  }

  function updateDraft(draft) {
    undoStack.push(marks());
    data.round.draft = draft;
    save();
  }

  function placeMark(target, mark, keyboard = false) {
    if (!editing()) return;
    const draft = bank.place(question, marks(), target, mark);
    if (!draft) return;
    updateDraft(draft);
    selected = '';
    cursor = (target.cursor ?? 0) + 1;
    renderAnswer(keyboard && question.mode === 'boxes' ? target.index : undefined);
    if (keyboard && question.mode === 'insert') showTarget(cursorTarget(cursor));
    $('selection-status').textContent = `已放入${names[mark]}。`;
  }

  function removeMark(origin, keyboard = false) {
    const current = marks();
    const boxed = question.mode === 'boxes';
    const position = boxed ? { index: origin } : positions[origin];
    if (!editing() || (boxed ? !current[origin] : !glyphs[origin]?.classList.contains('placed'))) return;
    const mark = boxed ? current[origin] : current[position.index][position.offset];
    updateDraft(bank.remove(question, current, position));
    cursor = origin;
    renderAnswer(keyboard && boxed ? origin : undefined);
    if (keyboard && !boxed) showTarget(cursorTarget(cursor), selected);
    $('selection-status').textContent = `已删除${names[mark]}。`;
  }

  function selectMark(mark) {
    selected = selected === mark ? '' : mark;
    syncSelection();
    clearTarget();
    $('selection-status').textContent = selected ? `已选中${names[selected]}。` : '已取消选择。';
    if (!selected) return;
    if (question.mode === 'insert') {
      sentence.focus();
      showTarget(cursorTarget(cursor), selected);
    }
    else (sentence.querySelector('.box:not(.filled)') ?? sentence.querySelector('.box')).focus();
  }

  function start() {
    if (!training.start(data)) return;
    resetQuestion();
    save();
    renderPage();
    $('question-title').focus();
  }

  $('start').addEventListener('click', start);
  $('restart').addEventListener('click', start);
  $('next').addEventListener('click', () => {
    if (!training.advance(data.round)) return;
    resetQuestion();
    save();
    renderQuestion();
    $('question-title').focus();
  });

  palette.addEventListener('click', event => {
    const choice = event.target.closest('button[data-mark]');
    if (choice && editing() && event.detail === 0) selectMark(choice.dataset.mark);
  });

  function cancelDrag() {
    const gesture = drag;
    drag = null;
    if (gesture?.source.hasPointerCapture(gesture.id)) gesture.source.releasePointerCapture(gesture.id);
    ghost.hidden = true;
    clearTarget();
  }

  practice.addEventListener('pointerdown', event => {
    if (drag || !editing() || !event.isPrimary || event.button !== 0) return;
    const source = event.target.closest('[data-mark], .box.filled, .glyph.placed');
    if (!source) return;
    let origin = null;
    let mark = source.dataset.mark;
    if (!mark) {
      origin = question.mode === 'boxes' ? Number(source.dataset.slot) : glyphs.indexOf(source);
      mark = source.textContent;
    }
    selected = '';
    syncSelection();
    clearTarget();
    drag = { source, origin, mark, id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    source.setPointerCapture(event.pointerId);
  });
  practice.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    const { clientX: x, clientY: y } = event;
    if (!drag.moved && Math.hypot(x - drag.x, y - drag.y) < 6) return;
    drag.moved = true;
    ghost.textContent = drag.mark;
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
    if (drag.origin === null) {
      const target = targetAt(x, y, drag);
      showTarget(target, drag.mark);
      ghost.hidden = Boolean(target && !target.box);
    } else {
      palette.classList.toggle('is-return-target', containsPoint(palette.getBoundingClientRect(), x, y));
      ghost.hidden = false;
    }
  });
  practice.addEventListener('pointerup', event => {
    if (drag?.id !== event.pointerId) return;
    const { origin, mark, moved } = drag;
    const { clientX: x, clientY: y } = event;
    const target = moved && origin === null ? targetAt(x, y, drag) : null;
    const returned = moved && origin !== null && containsPoint(palette.getBoundingClientRect(), x, y);
    cancelDrag();
    if (!moved) return;
    if (returned) removeMark(origin);
    else if (target) placeMark(target, mark);
  });
  for (const eventName of ['pointercancel', 'lostpointercapture']) {
    practice.addEventListener(eventName, event => {
      if (drag?.id === event.pointerId) cancelDrag();
    });
  }
  window.addEventListener('resize', () => { if (drag) cancelDrag(); });

  sentence.addEventListener('click', event => {
    if (event.detail !== 0 || !selected || !editing()) return;
    const box = event.target.closest('[data-slot]');
    if (box) placeMark({ index: Number(box.dataset.slot) }, selected, true);
  });
  sentence.addEventListener('focus', () => {
    if (question.mode === 'insert' && editing() && !drag && sentence.matches(':focus-visible')) showTarget(cursorTarget(cursor), selected);
  });
  sentence.addEventListener('blur', () => { if (!drag) clearTarget(); });
  sentence.addEventListener('keydown', event => {
    if (event.key === 'Escape' && selected) {
      selected = '';
      syncSelection();
      clearTarget();
      return;
    }
    if (!editing()) return;
    if (question.mode === 'boxes') {
      const box = event.target.closest('[data-slot]');
      if (box && ['Backspace', 'Delete'].includes(event.key)) {
        event.preventDefault();
        removeMark(Number(box.dataset.slot), true);
      }
      return;
    }
    const last = positions.length - 1;
    switch (event.key) {
      case 'ArrowLeft': cursor = Math.max(0, cursor - 1); break;
      case 'ArrowRight': cursor = Math.min(last, cursor + 1); break;
      case 'Home': cursor = 0; break;
      case 'End': cursor = last; break;
      case 'Backspace':
      case 'Delete':
        event.preventDefault();
        removeMark(cursor - Number(event.key === 'Backspace'), true);
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (selected) placeMark(cursorTarget(cursor), selected, true);
        return;
      default: return;
    }
    event.preventDefault();
    showTarget(cursorTarget(cursor), selected);
    const previous = glyphs[cursor - 1]?.childNodes[0];
    $('selection-status').textContent = cursor === 0 ? '句首。' : cursor === last ? '句末。' : `在${previous.textContent[0]}后面。`;
  });

  $('undo').addEventListener('click', () => {
    if (!undoStack.length) return;
    data.round.draft = undoStack.pop();
    save();
    renderAnswer();
  });
  $('submit').addEventListener('click', () => {
    if (!training.submit(data.round, marks())) return;
    undoStack = [];
    selected = '';
    save();
    renderAnswer();
    renderCompletion();
    if ($('feedback').hasAttribute('data-incorrect')) sentence.focus();
    else $(data.round.completedAt === null ? 'next' : 'completion-title').focus();
  });

  $('goal').textContent = `共 ${categories.length} 类标点用法，每类连续答对两题后达标。`;
  if (needsMigration) save();
  renderPage();
})();
