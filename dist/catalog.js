// 新练习在此登记；路径相对于 dist/index.html。
window.EXERCISES = [
  {
    id: 'semantic-blocks', storage: {currentKey: 'semantic-blocks-v4', schemaVersion: 4, bankVersion: 4, legacyPrefixes: ['semantic-blocks-v']}, grade: 2, semester: 1, subject: 'chinese',
    title: '语义积木', subtitle: '拆出骨干，拼懂一个故事',
    description: '阅读短文，完成缩句、事件排序和标题选择。',
    tags: ['缩句', '事件排序', '选择标题'],
    path: 'exercises/grade-2/semester-1/chinese/semantic-blocks.html'
  },
  {
    id: 'punctuation',
    storage: {
      currentKey: 'brison-tutor:progress:punctuation:v3', schemaVersion: 3, bankVersion: '2.1', legacyPrefixes: [],
      auxiliaryKeys: ['brison-tutor:progress:punctuation:migration:v2-v3'],
      validate: record => record.exerciseId === 'punctuation' && window.PunctuationTraining.validData(record.data)
    },
    grade: 2, semester: 1, subject: 'chinese',
    title: '标点应用', progressTitle: '标点应用 · 随机闯关', subtitle: '拖标点填空，在句子里找位置',
    description: '按题型练习七类标点用法，也可参加随机闯关。',
    tags: ['拖拽填空', '直接插入'],
    path: 'exercises/grade-2/semester-1/chinese/punctuation.html',
    shelfPath: 'exercises/grade-2/semester-1/chinese/punctuation.html?mode=classified'
  },
  {
    id: 'punctuation-classified', parentId: 'punctuation',
    storage: {
      currentKey: 'brison-tutor:progress:punctuation-classified:v2', schemaVersion: 2,
      bankVersion: '2.1', legacyPrefixes: [], auxiliaryKeys: ['brison-tutor:progress:punctuation-classified:migration:v1-v2'],
      validate: record => record.exerciseId === 'punctuation-classified' && window.PunctuationTraining.validClassifiedData(record.data)
    },
    title: '标点应用 · 分类练习',
    path: 'exercises/grade-2/semester-1/chinese/punctuation.html?mode=classified'
  },
  {
    id: 'reading-quest', storage: {
      currentKey: 'brison-tutor:progress:reading-quest:v1', schemaVersion: 1, bankVersion: '1.0',
      legacyPrefixes: ['brison-tutor:progress:reading-quest:']
    },
    grade: 2, semester: 1, subject: 'chinese',
    title: '中文阅读专项', progressTitle: '中文阅读专项 · 随机闯关',
    description: '按阅读技能自主选题，也可参加中文阅读闯关。',
    tags: ['指代', '时间顺序', '条件', '人物关系'],
    path: 'exercises/grade-2/semester-1/chinese/reading-quest.html',
    shelfPath: 'exercises/grade-2/semester-1/chinese/reading-quest.html?mode=classified'
  },
  {
    id: 'reading-quest-classified', parentId: 'reading-quest',
    storage: {
      currentKey: 'brison-tutor:progress:reading-quest-classified:v1', schemaVersion: 1,
      bankVersion: '1.0', legacyPrefixes: [], auxiliaryKeys: []
    },
    title: '中文阅读专项 · 分类练习',
    path: 'exercises/grade-2/semester-1/chinese/reading-quest.html?mode=classified'
  },
  {
    id: 'arithmetic-foundations',
    storage: {
      currentKey: 'brison-tutor:progress:arithmetic-foundations:v3', schemaVersion: 3, bankVersion: '1.1', legacyPrefixes: [],
      auxiliaryKeys: ['brison-tutor:progress:arithmetic-foundations:migration:v3', 'brison-tutor:progress:arithmetic-foundations:migration:v1-v2'],
      validate: record => record.exerciseId === 'arithmetic-foundations' && window.ArithmeticTraining.validData(record.data)
    },
    grade: 2, semester: 1, subject: 'math',
    title: '乘除意义与运算顺序', progressTitle: '乘除意义与运算顺序 · 随机闯关',
    description: '按题型练习选算式、用除法编题和判断运算顺序，也可参加随机闯关。',
    tags: ['用除法编题', '混合运算'],
    path: 'exercises/grade-2/semester-1/math/arithmetic.html',
    shelfPath: 'exercises/grade-2/semester-1/math/arithmetic.html?mode=classified'
  },
  {
    id: 'arithmetic-foundations-classified', parentId: 'arithmetic-foundations',
    storage: {
      currentKey: 'brison-tutor:progress:arithmetic-foundations-classified:v1', schemaVersion: 1,
      bankVersion: '1.1', legacyPrefixes: [], auxiliaryKeys: [],
      validate: record => record.exerciseId === 'arithmetic-foundations-classified' && window.ArithmeticTraining.validClassifiedData(record.data)
    },
    title: '乘除意义与运算顺序 · 分类练习',
    path: 'exercises/grade-2/semester-1/math/arithmetic.html?mode=classified'
  },
  {
    id: 'math-focus', storage: {currentKey: 'brison-tutor:progress:math-focus:v1', schemaVersion: 1, bankVersion: '2026-11-21.1', legacyPrefixes: ['brison-tutor:progress:math-focus:']}, grade: 2, semester: 1, subject: 'math',
    title: '应用题分类练习', subtitle: '',
    description: '按题型练习最少与最多、倒推、多条件筛选等应用题，也可参加应用题随机闯关或练习阶段卷错题。',
    tags: ['应用题', '数量关系', '审题', '计算检查', '随机抽题'],
    path: 'exercises/grade-2/semester-1/math/math-focus.html'
  },
  {
    id: 'math-streak', parentId: 'math-focus',
    storage: {
      currentKey: 'brison-tutor:progress:math-streak:v1', schemaVersion: 1, bankVersion: '2026-11-21.1', legacyPrefixes: [],
      validate: record => record.exerciseId === 'math-streak' && typeof record.updatedAt === 'string' &&
        Number.isFinite(Date.parse(record.updatedAt)) && window.MathStreak.validData(record.data)
    },
    grade: 2, semester: 1, subject: 'math',
    title: '应用题随机闯关',
    description: '混合练习十类应用题。每类连对两道不同的题目即达标。',
    tags: ['应用题', '随机抽题'],
    path: 'exercises/grade-2/semester-1/math/math-streak.html'
  }
];
