(() => {
  'use strict';

  const tracks = [
    { id: 'meaning', title: '选对运算' },
    { id: 'order', title: '先算哪一步' }
  ];
  const categories = [
    { id: 'total', track: 'meaning', title: '每份一样多，求总数', distinctFeatures: true },
    { id: 'each', track: 'meaning', title: '已知份数，求每份', distinctFeatures: true },
    { id: 'groups', track: 'meaning', title: '已知每份，求份数', distinctFeatures: true },
    { id: 'add-sub', track: 'meaning', title: '用加减求合计或相差', distinctFeatures: true },
    { id: 'compose', track: 'meaning', title: '用除法编题', distinctFeatures: true },
    { id: 'mul-first', track: 'order', title: '乘法优先', distinctFeatures: true },
    { id: 'div-first', track: 'order', title: '除法优先', distinctFeatures: true },
    { id: 'add-sub-order', track: 'order', title: '同级加减从左往右' },
    { id: 'mul-div-order', track: 'order', title: '同级乘除从左往右' },
    { id: 'parentheses', track: 'order', title: '小括号优先' }
  ];

  const original = '原创';
  const shop = '改编自 Brison 练习卷第 21 题';
  const drinks = '改编自 Brison 练习卷第 19 题';
  const huadu16 = '2019–2020 学年广州花都区二年级上册期末卷第 16 题';
  const yuexiu2 = '2019–2020 学年广州越秀区二年级上册期末卷第 2 题';
  const yuexiu3 = '2019–2020 学年广州越秀区二年级上册期末卷第 3 题';
  const parentExample = '改编自家长提供的算式';

  function field(id, label, options, correct = ['correct']) {
    return { id, label, options: Object.entries(options).map(([id, label]) => ({ id, label })), correct };
  }

  function selection(id, category, feature, prompt, choices, explanation, source = original) {
    const label = feature === 'story' ? '选对应的算式' : '选对应的问题';
    return { id, category, feature, title: label, prompt, fields: [field('choice', label, choices)], explanation, source };
  }

  function story(id, category, text, choices, explanation, source) {
    return selection(id, category, 'story', text, choices, explanation, source);
  }

  function reverse(id, category, expression, choices, explanation, source) {
    return selection(id, category, 'reverse', expression, choices, explanation, source);
  }

  function sameGroups(items, unit, container, groups, each) {
    const total = groups * each;
    const sum = `${groups}×${each}`;
    const perGroup = `${total}÷${groups}`;
    const groupCount = `${total}÷${each}`;
    return {
      total: `有 ${groups} ${container}${items}，每${container}有 ${each} ${unit}，一共有多少${unit}？`,
      each: `把 ${total} ${unit}${items}平均分到 ${groups} ${container}里，每${container}有多少${unit}？`,
      groups: `有 ${total} ${unit}${items}，每${container}放 ${each} ${unit}，能装几${container}？`,
      sum, perGroup, groupCount, totalValue: total, groupsValue: groups, eachValue: each, items, unit, container
    };
  }

  const cookies = sameGroups('饼干', '块', '袋', 6, 4);
  const cards = sameGroups('卡片', '张', '盒', 5, 7);
  const beads = sameGroups('珠子', '颗', '袋', 7, 3);
  const books = sameGroups('故事书', '本', '箱', 4, 8);
  const fruits = sameGroups('橘子', '个', '篮', 4, 6);
  const paper = sameGroups('彩纸', '张', '包', 3, 9);
  const pens = sameGroups('铅笔', '支', '盒', 8, 4);
  const balls = sameGroups('乒乓球', '个', '袋', 7, 4);

  function groupStory(id, category, problem) {
    const { sum, perGroup, groupCount, totalValue: total, eachValue: each, groupsValue: groups, unit, container } = problem;
    const equations = { total: sum, each: perGroup, groups: groupCount };
    const explanations = {
      total: `已知有 ${groups} ${container}，每${container}有 ${each} ${unit}。求总数，用 ${sum}＝${total}（${unit}）。`,
      each: `把 ${total} ${unit}平均分成 ${groups} 份。求每份多少，用 ${perGroup}＝${each}（${unit}）。`,
      groups: `有 ${total} ${unit}，每 ${each} ${unit}一份。求分成几份，用 ${groupCount}＝${groups}（${container}）。`
    };
    const known = category === 'each' ? groups : each;
    const choices = category === 'total'
      ? { correct: sum, add: `${groups}＋${each}`, subtract: `${Math.max(groups, each)}−${Math.min(groups, each)}` }
      : { correct: equations[category], product: `${total}×${known}`, subtract: `${total}−${known}` };
    return story(id, category, problem[category], choices, explanations[category]);
  }

  function groupReverse(id, category, problem) {
    const equations = { total: problem.sum, each: problem.perGroup, groups: problem.groupCount };
    const reasons = { total: '知道份数和每份个数，就能用乘法求总数。', each: '把总数按已知份数平均分，就能用除法求每份多少。', groups: '从总数里按每份的个数来分，就能用除法求分成几份。' };
    const { totalValue: total, groupsValue: groups, eachValue: each, items, unit } = problem;
    const known = category === 'each' ? groups : each;
    const choices = {
      correct: problem[category],
      additive: category === 'total'
        ? `小安有 ${groups} ${unit}${items}，小乐有 ${each} ${unit}，他们一共有多少${unit}？`
        : `小安原来有 ${total} ${unit}${items}，送出 ${known} ${unit}，还剩多少${unit}？`
    };
    for (const role of Object.keys(equations)) {
      if (role !== category) choices[role] = problem[role];
    }
    return reverse(id, category, equations[category], choices, reasons[category]);
  }

  function compose(id, feature, items, unit, container, groups, each, extra, source = original) {
    const total = groups * each;
    const asksGroups = feature === 'groups';
    const totalFact = `有 ${total} ${unit}${items}。`;
    const knownFact = asksGroups ? `每${container}放 ${each} ${unit}。` : `平均装成 ${groups} ${container}。`;
    const unknowns = { groups: `能装几${container}？`, each: `每${container}装多少${unit}？`, total: `一共有多少${unit}？` };
    const eachEquation = `${total}÷${groups}＝${each}（${unit}）`;
    const groupsEquation = `${total}÷${each}＝${groups}（${container}）`;
    const correct = asksGroups ? groupsEquation : eachEquation;
    return {
      id, category: 'compose', feature, title: '编一道除法题',
      prompt: `${totalFact}${knownFact}${extra}`,
      fields: [
        field('facts', '选两条要用的条件。', { total: totalFact, known: knownFact, extra }, ['total', 'known']),
        field('unknown', '选你要问的问题。', unknowns, [feature]),
        field('equation', '选能解答这个问题的算式。', {
          correct,
          other: asksGroups ? eachEquation : groupsEquation,
          product: `${groups}×${each}＝${total}（${unit}）`
        })
      ],
      explanation: `${totalFact}${knownFact}${unknowns[feature]} ${correct}。`, source
    };
  }

  const example = {
    id: 'compose-example', category: null, feature: 'example', title: '先试一题',
    prompt: '尺子一套 3 元，蜡笔一盒 6 元，笔记本一本 4 元。哪一个问题可以用除法解决？',
    fields: [field('choice', '选一个问题。', {
      correct: '用 24 元可以买几套尺子？',
      product: '买 3 盒蜡笔需要多少钱？',
      add: '买一本笔记本和一盒蜡笔需要多少钱？'
    })],
    explanation: '知道一共有 24 元、每套尺子 3 元，问可以买几套，用 24÷3＝8（套）。', source: shop
  };

  const orderInstructions = {
    'mul-first': '乘法和加减混合，先算乘法。',
    'div-first': '除法和加减混合，先算除法。',
    'add-sub-order': '加法和减法同级，从左往右算。',
    'mul-div-order': '乘法和除法同级，从左往右算。',
    parentheses: '有小括号，先算括号里面。'
  };

  function calculate(left, symbol, right) {
    switch (symbol) {
      case '＋': return left + right;
      case '−': return left - right;
      case '×': return left * right;
      case '÷': return left / right;
    }
  }

  function order(category, index, expression, first, wrongResults, source = original) {
    const [, a, op1, b, op2, c] = expression.replace(/[（）]/g, '').match(/^(\d+)([＋−×÷])(\d+)([＋−×÷])(\d+)$/);
    const left = `${a}${op1}${b}`;
    const right = `${b}${op2}${c}`;
    const leftFirst = first === 'left';
    const intermediate = leftFirst ? calculate(+a, op1, +b) : calculate(+b, op2, +c);
    const result = leftFirst ? calculate(intermediate, op2, +c) : calculate(+a, op1, intermediate);
    const firstPart = leftFirst ? left : right;
    const segment = category === 'parentheses' ? `（${firstPart}）` : firstPart;
    const start = leftFirst ? 0 : expression.length - segment.length;
    const work = { before: expression.slice(0, start), segment, after: expression.slice(start + segment.length), replacement: String(intermediate) };
    const rest = work.before + work.replacement + work.after;
    const [x, symbol, y] = leftFirst ? [+a, op1, +b] : [+b, op2, +c];
    const alternate = symbol === '＋' || symbol === '÷' ? Math.abs(x - y) : x + y;
    const candidates = [...new Set([intermediate, alternate, Math.max(0, intermediate - 1), intermediate + 2])].slice(0, 3);
    const intermediateOptions = Object.fromEntries(candidates.map(value => [String(value), String(value)]));
    const resultOptions = Object.fromEntries([result, ...wrongResults].map(value => [String(value), String(value)]));
    return {
      id: `${category}-${index}`, category, feature: first, title: '先算哪一步？', prompt: expression, expression, work,
      fields: [
        field('first', '在算式里选先算的运算符。', { left, right }, [first]),
        field('intermediate', '画线部分等于多少？', intermediateOptions, [String(intermediate)]),
        field('result', '算出新算式的结果。', resultOptions, [String(result)])
      ],
      explanation: `${orderInstructions[category]} 先算 ${firstPart}＝${intermediate}，再算 ${rest}＝${result}。`, source
    };
  }

  const questions = [
    story('total-1', 'total', '蜡笔一盒 6 元。买 3 盒蜡笔，需要多少钱？',
      { correct: '3×6', add: '3＋6', divide: '6÷3' }, '每盒 6 元，买 3 盒就是求 3 个 6 的和。3×6＝18（元）。', shop),
    groupStory('total-2', 'total', cookies),
    groupStory('total-3', 'total', cards),
    groupReverse('total-4', 'total', books),
    groupReverse('total-5', 'total', beads),
    groupReverse('total-6', 'total', fruits),

    story('each-1', 'each', '一提饮料有 6 瓶，一共 24 元。每瓶多少钱？',
      { correct: '24÷6', product: '24×6', subtract: '24−6' }, '把 24 元按 6 瓶平均分，求每瓶的价格。24÷6＝4（元）。', drinks),
    groupStory('each-2', 'each', books),
    groupStory('each-3', 'each', beads),
    groupReverse('each-4', 'each', cards),
    groupReverse('each-5', 'each', paper),
    groupReverse('each-6', 'each', balls),

    story('groups-1', 'groups', '尺子一套 3 元。用 24 元可以买几套尺子？',
      { correct: '24÷3', product: '24×3', subtract: '24−3' }, '一共有 24 元，每套用 3 元。求 24 里有几个 3，24÷3＝8（套）。', shop),
    groupStory('groups-2', 'groups', cookies),
    groupStory('groups-3', 'groups', fruits),
    groupReverse('groups-4', 'groups', pens),
    groupReverse('groups-5', 'groups', paper),
    groupReverse('groups-6', 'groups', beads),

    story('add-sub-1', 'add-sub', '妈妈买了 4 个苹果和 6 个梨，一共买了几个水果？',
      { correct: '4＋6', product: '4×6', subtract: '6−4' }, '把苹果和梨的个数合起来，用 4＋6＝10（个）。'),
    story('add-sub-2', 'add-sub', '小安有 24 张贴纸，小乐有 6 张。小安比小乐多几张？',
      { correct: '24−6', divide: '24÷6', add: '24＋6' }, '求两人相差几张，用 24−6＝18（张）。'),
    story('add-sub-3', 'add-sub', '一盒彩笔 6 元，一本笔记本 4 元。各买一件，一共多少钱？',
      { correct: '6＋4', product: '6×4', subtract: '6−4' }, '两件商品的价格分别是 6 元和 4 元，合起来是 6＋4＝10（元）。', shop),
    reverse('add-sub-4', 'add-sub', '8＋5', {
      correct: '小雨上午折了 8 只纸船，下午折了 5 只。一共折了几只？',
      product: '小雨每天折 8 只纸船，折了 5 天。一共折了几只？',
      subtract: '小雨折了 8 只纸船，送走 5 只。还剩几只？'
    }, '问上午和下午合起来有多少只，用 8＋5＝13（只）。'),
    reverse('add-sub-5', 'add-sub', '28−7', {
      correct: '小齐读了 28 页，小迎读了 7 页。小齐比小迎多读了几页？',
      divide: '一本 28 页的故事书，平均用 7 天读完。每天读几页？',
      add: '小齐周六读了 28 页，周日读了 7 页。周末一共读了几页？'
    }, '问两人读的页数相差多少，用 28−7＝21（页）。'),
    reverse('add-sub-6', 'add-sub', '20−4', {
      correct: '原有 20 个气球，飞走了 4 个。还剩几个？',
      divide: '把 20 个气球平均分给 4 个小朋友，每人有几个？',
      add: '原有 20 个气球，又拿来 4 个。现在有几个？'
    }, '从原来的 20 个里去掉飞走的 4 个，用 20−4＝16（个）。'),

    compose('compose-1', 'groups', '饼干', '块', '袋', 6, 4, '另有 6 张贴纸。'),
    compose('compose-2', 'each', '卡片', '张', '盒', 5, 7, '桌上还放着 4 支笔。'),
    compose('compose-3', 'groups', '彩纸', '张', '包', 3, 9, '旁边还有 2 把剪刀。'),
    compose('compose-4', 'each', '橘子', '个', '篮', 4, 6, '篮子旁边有 8 个苹果。'),
    compose('compose-5', 'groups', '铅笔', '支', '盒', 8, 4, '桌上还放着 3 块橡皮。'),
    compose('compose-6', 'each', '蜡笔', '支', '盒', 3, 8, '旁边有 4 本画册。', shop),

    order('mul-first', 1, '2＋3×7', 'right', [35, 21], huadu16),
    order('mul-first', 2, '7＋3×5', 'right', [50, 15], parentExample),
    order('mul-first', 3, '30−4×6', 'right', [156, 24]),
    order('mul-first', 4, '4×3＋3', 'left', [24, 12], `${yuexiu2}第（1）小题`),
    order('mul-first', 5, '6×4−18', 'left', [24, 12], huadu16),
    order('mul-first', 6, '5×7−8', 'left', [35, 28], `${yuexiu2}第（3）小题`),

    order('div-first', 1, '7＋24÷6', 'right', [4, 13]),
    order('div-first', 2, '32−18÷3', 'right', [6, 14]),
    order('div-first', 3, '5＋36÷4', 'right', [9, 13]),
    order('div-first', 4, '24÷6＋7', 'left', [4, 13]),
    order('div-first', 5, '28÷4−5', 'left', [7, 3]),
    order('div-first', 6, '48÷8＋9', 'left', [6, 14]),

    order('add-sub-order', 1, '40−13＋66', 'left', [79, 27], `${yuexiu3}第（6）小题`),
    order('add-sub-order', 2, '32−8＋5', 'left', [19, 24]),
    order('add-sub-order', 3, '42−18−6', 'left', [30, 24]),
    order('add-sub-order', 4, '24＋8−7', 'left', [32, 23]),
    order('add-sub-order', 5, '56−18＋9', 'left', [29, 38]),
    order('add-sub-order', 6, '63−15−8', 'left', [56, 48]),

    order('mul-div-order', 1, '24÷3×2', 'left', [4, 8]),
    order('mul-div-order', 2, '36÷6÷2', 'left', [12, 6]),
    order('mul-div-order', 3, '48÷4×2', 'left', [6, 12]),
    order('mul-div-order', 4, '6×8÷4', 'left', [48, 14]),
    order('mul-div-order', 5, '9×4÷6', 'left', [36, 7]),
    order('mul-div-order', 6, '54÷9×3', 'left', [2, 6]),

    order('parentheses', 1, '（7＋3）×5', 'left', [22, 10], parentExample),
    order('parentheses', 2, '4×（9−3）', 'right', [33, 6]),
    order('parentheses', 3, '（24−6）÷3', 'left', [22, 18]),
    order('parentheses', 4, '42÷（4＋3）', 'right', [7, 14]),
    order('parentheses', 5, '（18＋6）÷4', 'left', [24, 7]),
    order('parentheses', 6, '30−（8＋7）', 'right', [29, 22])
  ];

  window.ArithmeticBank = { tracks, categories, questions, example };
})();
