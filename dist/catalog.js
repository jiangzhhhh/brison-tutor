// 新练习在此登记；路径相对于 dist/index.html。
window.EXERCISES = [
  {
    id: 'read-before-answer', storage: {currentKey: 'brison-tutor:progress:read-before-answer:v2', schemaVersion: 2, bankVersion: '3.0', legacyPrefixes: ['reading-lab-v'], auxiliaryKeys: ['brison-tutor:progress:read-before-answer:migration:v1-v2']}, grade: 2, semester: 1, subject: 'chinese',
    title: '读懂再答', subtitle: '读清题意，想完整再回答',
    description: '阅读审题、信息筛选和完整作答训练。',
    tags: ['审题训练', '信息筛选', '完整作答'],
    path: 'exercises/grade-2/semester-1/math/read-before-answer.html'
  },
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
    title: '标点应用', subtitle: '拖标点填空，在句子里找位置',
    description: '随机练习七类标点用法，每类连续答对两题后达标。',
    tags: ['拖拽填空', '直接插入'],
    path: 'exercises/grade-2/semester-1/chinese/punctuation.html'
  },
  {
    id: 'arithmetic-foundations',
    storage: {
      currentKey: 'brison-tutor:progress:arithmetic-foundations:v3', schemaVersion: 3, bankVersion: '1.1', legacyPrefixes: [],
      auxiliaryKeys: ['brison-tutor:progress:arithmetic-foundations:migration:v3', 'brison-tutor:progress:arithmetic-foundations:migration:v1-v2'],
      validate: record => record.exerciseId === 'arithmetic-foundations' && window.ArithmeticTraining.validData(record.data)
    },
    grade: 2, semester: 1, subject: 'math',
    title: '乘除意义与运算顺序',
    description: '练习选算式、用除法编题和判断先算哪一步。',
    tags: ['用除法编题', '混合运算'],
    path: 'exercises/grade-2/semester-1/math/arithmetic.html'
  }
];
