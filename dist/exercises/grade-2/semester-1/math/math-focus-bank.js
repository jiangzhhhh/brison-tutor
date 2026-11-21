(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.MathFocusBank=factory();})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  return {
  "version": "2026-11-21.1",
  "rounds": [
    {
      "id": "unit-price",
      "title": "第1轮 · 比较价格",
      "questionIds": [
        "q-001",
        "q-002",
        "q-003",
        "q-004",
        "q-005",
        "q-006"
      ],
      "immediateCount": 2
    },
    {
      "id": "groups",
      "title": "第2轮 · 一组与一个",
      "questionIds": [
        "q-007",
        "q-008",
        "q-009",
        "q-010",
        "q-011",
        "q-012"
      ],
      "immediateCount": 2
    },
    {
      "id": "requirements",
      "title": "第3轮 · 条件与要求",
      "questionIds": [
        "q-013",
        "q-014",
        "q-015",
        "q-016",
        "q-017",
        "q-018"
      ],
      "immediateCount": 2
    },
    {
      "id": "calculation",
      "title": "第4轮 · 计算与检查",
      "questionIds": [
        "q-019",
        "q-020",
        "q-021",
        "q-022",
        "q-023",
        "q-024"
      ],
      "immediateCount": 2
    },
    {
      "id": "mixed",
      "title": "第5轮 · 综合练习",
      "questionIds": [
        "q-025",
        "q-026",
        "q-027",
        "q-028",
        "q-029",
        "q-030"
      ],
      "immediateCount": 0
    },
    {
      "id": "directions",
      "title": "方向短练",
      "questionIds": [
        "direction-1",
        "direction-2",
        "direction-3",
        "direction-4"
      ],
      "immediateCount": 4
    },
    {
      "id": "wp-minimum",
      "title": "最少需求",
      "questionIds": [
        "wp-minimum-1",
        "wp-minimum-2",
        "wp-minimum-3"
      ],
      "immediateCount": 3,
      "section": "word-problems"
    },
    {
      "id": "wp-maximum",
      "title": "最多可买",
      "questionIds": [
        "wp-maximum-1",
        "wp-maximum-2",
        "wp-maximum-3"
      ],
      "immediateCount": 3,
      "section": "word-problems"
    },
    {
      "id": "wp-reverse",
      "title": "倒推原数",
      "questionIds": [
        "wp-reverse-1",
        "wp-reverse-2",
        "wp-reverse-3"
      ],
      "immediateCount": 3,
      "section": "word-problems"
    },
    {
      "id": "wp-recovery",
      "title": "错算还原",
      "questionIds": [
        "wp-recovery-1",
        "wp-recovery-2",
        "wp-recovery-3"
      ],
      "immediateCount": 3,
      "section": "word-problems"
    },
    {
      "id": "wp-constraints",
      "title": "多条件约束",
      "questionIds": [
        "wp-constraints-1",
        "wp-constraints-2",
        "wp-constraints-3"
      ],
      "immediateCount": 3,
      "section": "word-problems"
    },
    {
      "id": "wp-cycle",
      "title": "周期定位",
      "questionIds": [
        "wp-cycle-1",
        "wp-cycle-2",
        "wp-cycle-3"
      ],
      "immediateCount": 3,
      "section": "word-problems"
    },
    {
      "id": "wp-state",
      "title": "状态追踪",
      "questionIds": [
        "wp-state-1",
        "wp-state-2",
        "wp-state-3"
      ],
      "immediateCount": 3,
      "section": "word-problems"
    },
    {
      "id": "wp-selection",
      "title": "对象筛选",
      "questionIds": [
        "wp-selection-1",
        "wp-selection-2",
        "wp-selection-3"
      ],
      "immediateCount": 3,
      "section": "word-problems"
    },
    {
      "id": "wp-nested",
      "title": "嵌套数量",
      "questionIds": [
        "wp-nested-1",
        "wp-nested-2",
        "wp-nested-3"
      ],
      "immediateCount": 3,
      "section": "word-problems"
    },
    {
      "id": "wp-focus",
      "title": "问题焦点",
      "questionIds": [
        "wp-focus-1",
        "wp-focus-2",
        "wp-focus-3"
      ],
      "immediateCount": 3,
      "section": "word-problems"
    }
  ],
  "questions": [
    {
      "id": "q-001",
      "sourceNumber": "1",
      "prompt": "甲包6瓶饮料24元，乙包3瓶饮料18元。每瓶哪种便宜？",
      "choices": [
        {
          "id": "A",
          "text": "乙包，因为18＜24。"
        },
        {
          "id": "B",
          "text": "甲包，因为每瓶4元，乙包每瓶6元。"
        },
        {
          "id": "C",
          "text": "两种一样。"
        }
      ],
      "answer": "B",
      "explanation": "24÷6＝4元/瓶，18÷3＝6元/瓶，甲包每瓶便宜。",
      "revision": "520d294cd30e"
    },
    {
      "id": "q-002",
      "sourceNumber": "2",
      "context": "甲包6瓶饮料24元，乙包3瓶饮料18元。",
      "prompt": "还是这两种饮料。现在只比较买“一整包”要付多少钱，哪包付的钱少？",
      "choices": [
        {
          "id": "A",
          "text": "乙包。"
        },
        {
          "id": "B",
          "text": "甲包。"
        },
        {
          "id": "C",
          "text": "两包一样。"
        }
      ],
      "answer": "A",
      "explanation": "问一整包付的钱，只比较总价，18＜24，乙包少。",
      "revision": "fea5798edc1d"
    },
    {
      "id": "q-003",
      "sourceNumber": "3",
      "prompt": "甲包4支铅笔12元，乙包6支铅笔18元。每支哪种便宜？",
      "choices": [
        {
          "id": "A",
          "text": "甲包。"
        },
        {
          "id": "B",
          "text": "乙包。"
        },
        {
          "id": "C",
          "text": "两种每支都是3元。"
        }
      ],
      "answer": "C",
      "explanation": "12÷4＝3，18÷6＝3，每支一样贵。",
      "revision": "47126d49366d"
    },
    {
      "id": "q-004",
      "sourceNumber": "4",
      "prompt": "红盒8块饼干24元，蓝盒4块饼干16元。哪种每块贵？",
      "choices": [
        {
          "id": "A",
          "text": "红盒。"
        },
        {
          "id": "B",
          "text": "蓝盒。"
        },
        {
          "id": "C",
          "text": "一样贵。"
        }
      ],
      "answer": "B",
      "explanation": "红盒24÷8＝3元/块，蓝盒16÷4＝4元/块，蓝盒每块贵。",
      "revision": "404a21e254bf"
    },
    {
      "id": "q-005",
      "sourceNumber": "5",
      "prompt": "甲袋5个面包20元，乙袋4个面包20元。哪种每个便宜？",
      "choices": [
        {
          "id": "A",
          "text": "甲袋。"
        },
        {
          "id": "B",
          "text": "乙袋。"
        },
        {
          "id": "C",
          "text": "两种一样。"
        }
      ],
      "answer": "A",
      "explanation": "甲袋20÷5＝4元/个，乙袋20÷4＝5元/个。总价相同时，也可比较每袋个数。",
      "revision": "7d524245755c"
    },
    {
      "id": "q-006",
      "sourceNumber": "6",
      "prompt": "甲盒3块橡皮12元，乙盒6块橡皮18元。小明说：“12元比18元少，所以甲盒每块便宜。”你选哪句话？",
      "choices": [
        {
          "id": "A",
          "text": "小明说得对。"
        },
        {
          "id": "B",
          "text": "两种每块一样贵。"
        },
        {
          "id": "C",
          "text": "应比12÷3和18÷6，乙盒每块便宜。"
        }
      ],
      "answer": "C",
      "explanation": "甲盒12÷3＝4元/块，乙盒18÷6＝3元/块。",
      "revision": "e4936bd5e737"
    },
    {
      "id": "q-007",
      "sourceNumber": "7",
      "prompt": "已知3盘梨，每盘5个，共15个。再加一盘同样的梨，一共有多少个？",
      "choices": [
        {
          "id": "A",
          "text": "16个。"
        },
        {
          "id": "B",
          "text": "20个。"
        },
        {
          "id": "C",
          "text": "18个。"
        }
      ],
      "answer": "B",
      "explanation": "多一盘就是多5个，15＋5＝20。",
      "revision": "1206af8eb504"
    },
    {
      "id": "q-008",
      "sourceNumber": "8",
      "prompt": "已知3盘梨，每盘5个，共15个。再加一个梨，一共有多少个？",
      "choices": [
        {
          "id": "A",
          "text": "20个。"
        },
        {
          "id": "B",
          "text": "18个。"
        },
        {
          "id": "C",
          "text": "16个。"
        }
      ],
      "answer": "C",
      "explanation": "多一个，15＋1＝16。与第7题对照。",
      "revision": "571edcd49cd9"
    },
    {
      "id": "q-009",
      "sourceNumber": "9",
      "prompt": "计算4×5，已经知道3×5＝15。还要加多少？",
      "choices": [
        {
          "id": "A",
          "text": "5。"
        },
        {
          "id": "B",
          "text": "1。"
        },
        {
          "id": "C",
          "text": "4。"
        }
      ],
      "answer": "A",
      "explanation": "从3组5变成4组5，增加1组5，应加5。",
      "revision": "8b9ec0fb7d16"
    },
    {
      "id": "q-010",
      "sourceNumber": "10",
      "prompt": "有5盒同样的积木，每盒6块，又添了一盒。小红算6×5＋6，小军算6×6。谁的方法正确？",
      "choices": [
        {
          "id": "A",
          "text": "只有小红。"
        },
        {
          "id": "B",
          "text": "两人都正确。"
        },
        {
          "id": "C",
          "text": "只有小军。"
        }
      ],
      "answer": "B",
      "explanation": "原来5组6，再加1组6，共6组6；两种算法均得36。",
      "revision": "156fc68c69d0"
    },
    {
      "id": "q-011",
      "sourceNumber": "11",
      "prompt": "4盒饼干，每盒3块，又添了一块饼干。哪个算式正确？",
      "choices": [
        {
          "id": "A",
          "text": "4×3＋3。"
        },
        {
          "id": "B",
          "text": "5×3。"
        },
        {
          "id": "C",
          "text": "4×3＋1。"
        }
      ],
      "answer": "C",
      "explanation": "只添一块，12＋1＝13，不是添一盒。",
      "revision": "8f2af00d7d52"
    },
    {
      "id": "q-012",
      "sourceNumber": "12",
      "prompt": "有6袋糖，每袋4颗，拿走一整袋后还剩多少颗？",
      "choices": [
        {
          "id": "A",
          "text": "20颗。"
        },
        {
          "id": "B",
          "text": "23颗。"
        },
        {
          "id": "C",
          "text": "18颗。"
        }
      ],
      "answer": "A",
      "explanation": "拿走1组4，剩5组4，5×4＝20；也可24－4＝20。",
      "revision": "71d34a441330"
    },
    {
      "id": "q-013",
      "sourceNumber": "13",
      "prompt": "一堆糖比30颗多、比40颗少，平均分完后，份数和每份的颗数相同。一共有多少颗？",
      "choices": [
        {
          "id": "A",
          "text": "35颗。"
        },
        {
          "id": "B",
          "text": "36颗。"
        },
        {
          "id": "C",
          "text": "32颗。"
        }
      ],
      "answer": "B",
      "explanation": "36＝6×6，范围和“份数＝每份颗数”同时满足。35可分成5×7，但5≠7。",
      "revision": "b9c2574410ab"
    },
    {
      "id": "q-014",
      "sourceNumber": "14",
      "prompt": "一堆棋子比10颗多、比20颗少，平均分完后，份数和每份的颗数相同。一共有多少颗？",
      "choices": [
        {
          "id": "A",
          "text": "12颗。"
        },
        {
          "id": "B",
          "text": "18颗。"
        },
        {
          "id": "C",
          "text": "16颗。"
        }
      ],
      "answer": "C",
      "explanation": "16＝4×4；12＝3×4、18＝3×6，均不是份数与每份数相同。",
      "revision": "5ee61a2aeded"
    },
    {
      "id": "q-015",
      "sourceNumber": "15",
      "prompt": "每本练习本4元，买了3本。问题是“买了多少本”，答案应选哪一个？",
      "choices": [
        {
          "id": "A",
          "text": "3本。"
        },
        {
          "id": "B",
          "text": "12元。"
        },
        {
          "id": "C",
          "text": "4元。"
        }
      ],
      "answer": "A",
      "explanation": "问本数，题干已给出3本；12元是总价，4元是单价。",
      "revision": "dcf589d41559"
    },
    {
      "id": "q-016",
      "sourceNumber": "16",
      "prompt": "蜡笔每盒6元。下面哪个问题要用除法解决？",
      "choices": [
        {
          "id": "A",
          "text": "买4盒要多少钱？"
        },
        {
          "id": "B",
          "text": "24元可以买几盒？"
        },
        {
          "id": "C",
          "text": "一盒蜡笔和一本4元的本子一共多少钱？"
        }
      ],
      "answer": "B",
      "explanation": "24÷6＝4盒；A求总价用乘法，C求合计用加法。",
      "revision": "04e73fcb5981"
    },
    {
      "id": "q-017",
      "sourceNumber": "17",
      "prompt": "尺子每套3元，蜡笔每盒6元。题目要求“提出一个用除法解决的问题”。哪位同学符合要求？",
      "choices": [
        {
          "id": "A",
          "text": "小青：两套尺子共多少钱？"
        },
        {
          "id": "B",
          "text": "小白：一套尺子和一盒蜡笔共多少钱？"
        },
        {
          "id": "C",
          "text": "小明：18元可以买几套尺子？"
        }
      ],
      "answer": "C",
      "explanation": "18÷3＝6套，符合指定用除法；其他两个问题分别用乘法、加法。",
      "revision": "6d33b149d6c0"
    },
    {
      "id": "q-018",
      "sourceNumber": "18",
      "prompt": "礼物情况如下。选出“红色、圆形，而且编号大于3”的礼物。",
      "choices": [
        {
          "id": "A",
          "text": "6号。"
        },
        {
          "id": "B",
          "text": "4号。"
        },
        {
          "id": "C",
          "text": "2号。"
        }
      ],
      "answer": "A",
      "explanation": "6号满足三个条件；2号不大于3，4号不是圆形。",
      "table": {
        "headers": [
          "编号",
          "颜色",
          "形状"
        ],
        "rows": [
          [
            "2",
            "红色",
            "圆形"
          ],
          [
            "4",
            "红色",
            "正方形"
          ],
          [
            "6",
            "红色",
            "圆形"
          ]
        ]
      },
      "revision": "e746d365e0cc"
    },
    {
      "id": "q-019",
      "sourceNumber": "19",
      "prompt": "7＋3×5＝？",
      "choices": [
        {
          "id": "A",
          "text": "50。"
        },
        {
          "id": "B",
          "text": "22。"
        },
        {
          "id": "C",
          "text": "35。"
        }
      ],
      "answer": "B",
      "explanation": "先乘后加，7＋15＝22。",
      "revision": "5df6e2dd3ce9"
    },
    {
      "id": "q-020",
      "sourceNumber": "20",
      "prompt": "7×3＋5＝？",
      "choices": [
        {
          "id": "A",
          "text": "56。"
        },
        {
          "id": "B",
          "text": "50。"
        },
        {
          "id": "C",
          "text": "26。"
        }
      ],
      "answer": "C",
      "explanation": "先乘后加，21＋5＝26。此题从左到右恰好也对，须与第19题合看。",
      "revision": "fd65a91d7e4a"
    },
    {
      "id": "q-021",
      "sourceNumber": "21",
      "prompt": "24÷3＝？",
      "choices": [
        {
          "id": "A",
          "text": "8。"
        },
        {
          "id": "B",
          "text": "9。"
        },
        {
          "id": "C",
          "text": "7。"
        }
      ],
      "answer": "A",
      "explanation": "24÷3＝8，8×3＝24。",
      "revision": "2b822b177b46"
    },
    {
      "id": "q-022",
      "sourceNumber": "22",
      "prompt": "一套尺子3元，用24元买尺子。小明说可以买9套。哪种检查能判断他的答案不对？",
      "choices": [
        {
          "id": "A",
          "text": "9＋3＝12。"
        },
        {
          "id": "B",
          "text": "24－3＝21。"
        },
        {
          "id": "C",
          "text": "9×3＝27，已经超过24元。"
        }
      ],
      "answer": "C",
      "explanation": "若9套，每套3元，需27元，不是24元。",
      "revision": "68b325c17b1d"
    },
    {
      "id": "q-023",
      "sourceNumber": "23",
      "prompt": "小红把5＋4×3算成27。下面哪种修改正确？",
      "choices": [
        {
          "id": "A",
          "text": "只把答案改成28。"
        },
        {
          "id": "B",
          "text": "先算4×3＝12，再算5＋12＝17。"
        },
        {
          "id": "C",
          "text": "先算5＋4＝9，再算9×3＝27。"
        }
      ],
      "answer": "B",
      "explanation": "先算4×3，再加5，结果17。",
      "revision": "29513f8683b6"
    },
    {
      "id": "q-024",
      "sourceNumber": "24",
      "prompt": "小军写了“18÷3＝5，所以5盒每盒3元的蜡笔正好花18元”。下面哪句话正确？",
      "choices": [
        {
          "id": "A",
          "text": "应该买6盒，因为6×3＝18。"
        },
        {
          "id": "B",
          "text": "应该买5盒，因为5＋3＝8。"
        },
        {
          "id": "C",
          "text": "应该买5盒，因为18－3＝15。"
        }
      ],
      "answer": "A",
      "explanation": "18÷3＝6；5盒只需15元，不能正好花18元。",
      "revision": "8fd48d65c0bf"
    },
    {
      "id": "q-025",
      "sourceNumber": "25",
      "prompt": "甲袋4个苹果12元，乙袋6个苹果24元。每个苹果哪种便宜？",
      "choices": [
        {
          "id": "A",
          "text": "乙袋。"
        },
        {
          "id": "B",
          "text": "甲袋。"
        },
        {
          "id": "C",
          "text": "一样便宜。"
        }
      ],
      "answer": "B",
      "explanation": "甲袋12÷4＝3元/个，乙袋24÷6＝4元/个。",
      "revision": "77eef8155e83"
    },
    {
      "id": "q-026",
      "sourceNumber": "26",
      "prompt": "3盒卡片，每盒4张，又放进一张卡片。共有多少张？",
      "choices": [
        {
          "id": "A",
          "text": "16张。"
        },
        {
          "id": "B",
          "text": "15张。"
        },
        {
          "id": "C",
          "text": "13张。"
        }
      ],
      "answer": "C",
      "explanation": "3×4＋1＝13张。",
      "revision": "a29a1ac54b43"
    },
    {
      "id": "q-027",
      "sourceNumber": "27",
      "prompt": "一堆珠子比20颗多、比30颗少，平均分完后，份数和每份的颗数相同。共有多少颗？",
      "choices": [
        {
          "id": "A",
          "text": "25颗。"
        },
        {
          "id": "B",
          "text": "24颗。"
        },
        {
          "id": "C",
          "text": "28颗。"
        }
      ],
      "answer": "A",
      "explanation": "25＝5×5，且20＜25＜30。",
      "revision": "5ee1c1cea62b"
    },
    {
      "id": "q-028",
      "sourceNumber": "28",
      "prompt": "9＋2×6＝？",
      "choices": [
        {
          "id": "A",
          "text": "66。"
        },
        {
          "id": "B",
          "text": "21。"
        },
        {
          "id": "C",
          "text": "54。"
        }
      ],
      "answer": "B",
      "explanation": "先2×6＝12，再9＋12＝21。",
      "revision": "a781f3d8697d"
    },
    {
      "id": "q-029",
      "sourceNumber": "29",
      "prompt": "每个皮球8元。老师要求选出一个用除法解决的问题。应该选哪个？",
      "choices": [
        {
          "id": "A",
          "text": "买3个皮球要多少钱？"
        },
        {
          "id": "B",
          "text": "一个皮球和一根5元的跳绳一共多少钱？"
        },
        {
          "id": "C",
          "text": "24元可以买几个皮球？"
        }
      ],
      "answer": "C",
      "explanation": "24÷8＝3个；A、B不符合指定运算。",
      "revision": "881a6a3d6ad0"
    },
    {
      "id": "q-030",
      "sourceNumber": "30",
      "prompt": "甲袋6支铅笔18元，乙袋4支铅笔12元。每支铅笔哪种便宜？",
      "choices": [
        {
          "id": "A",
          "text": "两种一样。"
        },
        {
          "id": "B",
          "text": "甲袋。"
        },
        {
          "id": "C",
          "text": "乙袋。"
        }
      ],
      "answer": "A",
      "explanation": "18÷6＝3，12÷4＝3，每支一样贵。",
      "revision": "d43303b0b9ef"
    },
    {
      "id": "direction-1",
      "sourceNumber": "方1",
      "prompt": "顺着时钟指针，从12走到3，再到6，再到9，是哪个方向？",
      "choices": [
        {
          "id": "A",
          "text": "顺时针。"
        },
        {
          "id": "B",
          "text": "逆时针。"
        }
      ],
      "answer": "A",
      "explanation": "钟面12→3→6→9，是顺时针。",
      "revision": "1c0f5fc2b58a"
    },
    {
      "id": "direction-2",
      "sourceNumber": "方2",
      "prompt": "东→南→西→北，是哪个方向？",
      "choices": [
        {
          "id": "A",
          "text": "逆时针。"
        },
        {
          "id": "B",
          "text": "顺时针。"
        }
      ],
      "answer": "B",
      "explanation": "标准方位图东→南→西→北，沿右→下→左→上，为顺时针。",
      "revision": "6bf8f2ea9910"
    },
    {
      "id": "direction-3",
      "sourceNumber": "方3",
      "prompt": "东→北→西→南，是哪个方向？",
      "choices": [
        {
          "id": "A",
          "text": "顺时针。"
        },
        {
          "id": "B",
          "text": "逆时针。"
        }
      ],
      "answer": "B",
      "explanation": "东→北→西→南，为逆时针。",
      "revision": "289ebecc1afd"
    },
    {
      "id": "direction-4",
      "sourceNumber": "方4",
      "prompt": "面向北，向右转一次后面向哪个方向？",
      "choices": [
        {
          "id": "A",
          "text": "西。"
        },
        {
          "id": "B",
          "text": "南。"
        },
        {
          "id": "C",
          "text": "东。"
        }
      ],
      "answer": "C",
      "explanation": "面向北右转，面向东。",
      "revision": "289f638a3bd6"
    },
    {
      "id": "wp-minimum-1",
      "prompt": "53个玉米，每次最多运8个，全部运完至少需要运多少次？",
      "choices": [
        {
          "id": "A",
          "text": "6次"
        },
        {
          "id": "B",
          "text": "7次"
        },
        {
          "id": "C",
          "text": "8次"
        }
      ],
      "answer": "B",
      "explanation": "6次最多运48个，还剩5个。剩下的5个也要运，至少6＋1＝7次。",
      "revision": "018f179dc2f4"
    },
    {
      "id": "wp-minimum-2",
      "prompt": "29名同学坐车，每辆车最多坐6名同学。所有同学都要有座位，至少需要几辆车？",
      "choices": [
        {
          "id": "A",
          "text": "4辆"
        },
        {
          "id": "B",
          "text": "6辆"
        },
        {
          "id": "C",
          "text": "5辆"
        }
      ],
      "answer": "C",
      "explanation": "4辆最多坐24人，还剩5人，再安排1辆就够，一共5辆。",
      "revision": "91b59aaef8f0"
    },
    {
      "id": "wp-minimum-3",
      "prompt": "24本书都要装箱，每箱最多装6本。至少需要几个箱子？",
      "choices": [
        {
          "id": "A",
          "text": "3个"
        },
        {
          "id": "B",
          "text": "4个"
        },
        {
          "id": "C",
          "text": "5个"
        }
      ],
      "answer": "B",
      "explanation": "4×6＝24，正好装完。没有剩下的书，4个箱子就够。",
      "revision": "1b71efc857e7"
    },
    {
      "id": "wp-maximum-1",
      "prompt": "一支笔6元，带34元，最多能买几支？",
      "choices": [
        {
          "id": "A",
          "text": "5支"
        },
        {
          "id": "B",
          "text": "6支"
        },
        {
          "id": "C",
          "text": "4支"
        }
      ],
      "answer": "A",
      "explanation": "5支要30元，剩4元买不了第6支。6支要36元，超过34元。",
      "revision": "83949f02e18e"
    },
    {
      "id": "wp-maximum-2",
      "prompt": "一本本子8元，带45元，最多能买几本？",
      "choices": [
        {
          "id": "A",
          "text": "6本"
        },
        {
          "id": "B",
          "text": "5本"
        },
        {
          "id": "C",
          "text": "7本"
        }
      ],
      "answer": "B",
      "explanation": "5本要40元，6本要48元，45元最多买5本。",
      "revision": "9660a5e86390"
    },
    {
      "id": "wp-maximum-3",
      "prompt": "有27个苹果，每盒装5个。只数装满的盒子，最多能装满几盒？",
      "choices": [
        {
          "id": "A",
          "text": "4盒"
        },
        {
          "id": "B",
          "text": "6盒"
        },
        {
          "id": "C",
          "text": "5盒"
        }
      ],
      "answer": "C",
      "explanation": "5盒用去25个，剩2个。剩下的苹果不够装满下一盒，所以只数5盒。",
      "revision": "ffae770061f1"
    },
    {
      "id": "wp-reverse-1",
      "prompt": "小禾送给朋友7支铅笔，还剩18支。她原来有多少支铅笔？",
      "choices": [
        {
          "id": "A",
          "text": "11支"
        },
        {
          "id": "B",
          "text": "18支"
        },
        {
          "id": "C",
          "text": "25支"
        }
      ],
      "answer": "C",
      "explanation": "送出后少了7支，倒推时把7支加回来。18＋7＝25支。",
      "revision": "b3a19d19ca38"
    },
    {
      "id": "wp-reverse-2",
      "prompt": "小宁又收到9张贴纸，现在有24张。收到这9张之前，她有多少张？",
      "choices": [
        {
          "id": "A",
          "text": "15张"
        },
        {
          "id": "B",
          "text": "24张"
        },
        {
          "id": "C",
          "text": "33张"
        }
      ],
      "answer": "A",
      "explanation": "现在的24张里包括新收到的9张。去掉这9张，24－9＝15张。",
      "revision": "d5e981663da3"
    },
    {
      "id": "wp-reverse-3",
      "prompt": "往桌上放了8本书，后来又拿走5本，最后有19本。桌上原来有多少本？",
      "choices": [
        {
          "id": "A",
          "text": "22本"
        },
        {
          "id": "B",
          "text": "16本"
        },
        {
          "id": "C",
          "text": "14本"
        }
      ],
      "answer": "B",
      "explanation": "先加回拿走的5本，19＋5＝24，再去掉放来的8本，24－8＝16本。",
      "revision": "b7a09d38a16f"
    },
    {
      "id": "wp-recovery-1",
      "prompt": "一个数本来要减8，小宇看成了加8，算出32。正确结果是多少？",
      "choices": [
        {
          "id": "A",
          "text": "24"
        },
        {
          "id": "B",
          "text": "40"
        },
        {
          "id": "C",
          "text": "16"
        }
      ],
      "answer": "C",
      "explanation": "错算是原数＋8＝32，原数是24。按正确的要求算，24－8＝16。",
      "revision": "11f6b4078987"
    },
    {
      "id": "wp-recovery-2",
      "prompt": "一个数本来要加7，小雨错算成减7，结果是18。正确结果是多少？",
      "choices": [
        {
          "id": "A",
          "text": "32"
        },
        {
          "id": "B",
          "text": "25"
        },
        {
          "id": "C",
          "text": "11"
        }
      ],
      "answer": "A",
      "explanation": "18是减去7后的结果，原数是18＋7＝25。正确结果是25＋7＝32。",
      "revision": "764e9204c9a4"
    },
    {
      "id": "wp-recovery-3",
      "prompt": "一个数本来要加9，小南错加了6，算出24。正确结果是多少？",
      "choices": [
        {
          "id": "A",
          "text": "33"
        },
        {
          "id": "B",
          "text": "27"
        },
        {
          "id": "C",
          "text": "18"
        }
      ],
      "answer": "B",
      "explanation": "先算出原数24－6＝18，再算18＋9＝27。也可以在错算结果上补加少加的3。",
      "revision": "d4970c49be88"
    },
    {
      "id": "wp-constraints-1",
      "prompt": "带20元买笔，至少买4支，花的钱不能超过20元。哪种买法符合要求？",
      "choices": [
        {
          "id": "A",
          "text": "买3支，共15元"
        },
        {
          "id": "B",
          "text": "买4支，共20元"
        },
        {
          "id": "C",
          "text": "买5支，共25元"
        }
      ],
      "answer": "B",
      "explanation": "3支没有达到数量要求，25元超过预算。4支共20元，同时满足两条要求。",
      "revision": "95c0fec959e8"
    },
    {
      "id": "wp-constraints-2",
      "prompt": "24人排队，每排人数相同，每排至少5人、最多7人。哪种排法符合要求？",
      "choices": [
        {
          "id": "A",
          "text": "3排，每排8人"
        },
        {
          "id": "B",
          "text": "6排，每排4人"
        },
        {
          "id": "C",
          "text": "4排，每排6人"
        }
      ],
      "answer": "C",
      "explanation": "每排8人太多，4人太少。每排6人在5到7之间，4×6＝24，正好排下所有人。",
      "revision": "467a8d050188"
    },
    {
      "id": "wp-constraints-3",
      "prompt": "买两本不同的书，其中一本必须是科学书，两本合计不能超过10元。哪种买法符合要求？",
      "choices": [
        {
          "id": "A",
          "text": "科学书6元和故事书4元"
        },
        {
          "id": "B",
          "text": "故事书4元和绘本3元"
        },
        {
          "id": "C",
          "text": "科学书6元和手工书5元"
        }
      ],
      "answer": "A",
      "explanation": "科学书和故事书合计10元，也包含科学书。第二种缺科学书，第三种要11元。",
      "revision": "e87235c1490f"
    },
    {
      "id": "wp-cycle-1",
      "prompt": "彩旗按“红、黄、蓝”从左往右重复排列。第14面是什么颜色？",
      "choices": [
        {
          "id": "A",
          "text": "红色"
        },
        {
          "id": "B",
          "text": "黄色"
        },
        {
          "id": "C",
          "text": "蓝色"
        }
      ],
      "answer": "B",
      "explanation": "4组排到第12面，第14面是下一组的第2面，所以是黄色。",
      "revision": "8eb8ac37d791"
    },
    {
      "id": "wp-cycle-2",
      "prompt": "小灯按“亮、灭、灭”从左往右重复排列。第13盏是亮的还是灭的？",
      "choices": [
        {
          "id": "A",
          "text": "亮的"
        },
        {
          "id": "B",
          "text": "灭的"
        },
        {
          "id": "C",
          "text": "无法判断"
        }
      ],
      "answer": "A",
      "explanation": "前12盏正好排4组，第13盏是下一组的第1盏，所以是亮的。",
      "revision": "c64ac5fc1095"
    },
    {
      "id": "wp-cycle-3",
      "prompt": "珠子按“红、蓝、蓝、白”从左往右重复排列。第16颗是什么颜色？",
      "choices": [
        {
          "id": "A",
          "text": "红色"
        },
        {
          "id": "B",
          "text": "蓝色"
        },
        {
          "id": "C",
          "text": "白色"
        }
      ],
      "answer": "C",
      "explanation": "16颗正好是4组，第16颗是第4组的最后一颗，所以是白色。",
      "revision": "d2e6ad901f5a"
    },
    {
      "id": "wp-state-1",
      "prompt": "甲盒有18个球，乙盒有9个。先从甲盒拿5个放进乙盒，再从乙盒拿3个放回甲盒。甲盒现在有几个？",
      "choices": [
        {
          "id": "A",
          "text": "10个"
        },
        {
          "id": "B",
          "text": "13个"
        },
        {
          "id": "C",
          "text": "16个"
        }
      ],
      "answer": "C",
      "explanation": "只跟踪甲盒。先少5个，再多3个，18－5＋3＝16个。",
      "revision": "26ffa915ca7d"
    },
    {
      "id": "wp-state-2",
      "prompt": "车上有16人。第一站下去7人、上来4人，第二站又上来5人。车上现在有多少人？",
      "choices": [
        {
          "id": "A",
          "text": "18人"
        },
        {
          "id": "B",
          "text": "13人"
        },
        {
          "id": "C",
          "text": "24人"
        }
      ],
      "answer": "A",
      "explanation": "第一站后是16－7＋4＝13人，第二站再上5人，13＋5＝18人。",
      "revision": "421eed693989"
    },
    {
      "id": "wp-state-3",
      "prompt": "水桶里有20升水，先倒出6升，再加进9升，最后又倒出4升。桶里还剩多少升？",
      "choices": [
        {
          "id": "A",
          "text": "23升"
        },
        {
          "id": "B",
          "text": "19升"
        },
        {
          "id": "C",
          "text": "11升"
        }
      ],
      "answer": "B",
      "explanation": "每一步都记下来，20－6＝14，14＋9＝23，23－4＝19升。",
      "revision": "f2f48046ece6"
    },
    {
      "id": "wp-selection-1",
      "prompt": "甲组借了7本故事书和3本科普书，乙组借了5本故事书和4本科普书。两组一共借了多少本故事书？",
      "choices": [
        {
          "id": "A",
          "text": "19本"
        },
        {
          "id": "B",
          "text": "12本"
        },
        {
          "id": "C",
          "text": "7本"
        }
      ],
      "answer": "B",
      "explanation": "只数故事书。甲组7本、乙组5本，7＋5＝12本。两组的科普书都不计入。",
      "revision": "c540e4f2e4e5"
    },
    {
      "id": "wp-selection-2",
      "prompt": "篮子里有红苹果8个、绿苹果6个、红桃5个。红色的水果里，苹果有几个？",
      "choices": [
        {
          "id": "A",
          "text": "13个"
        },
        {
          "id": "B",
          "text": "14个"
        },
        {
          "id": "C",
          "text": "8个"
        }
      ],
      "answer": "C",
      "explanation": "要同时是红色、是苹果。红苹果有8个，绿苹果和红桃都不符合所问。",
      "revision": "93c58b53593e"
    },
    {
      "id": "wp-selection-3",
      "prompt": "储物柜上层有铅笔9支和水笔4支，下层有铅笔6支和水笔7支。下层两种笔一共多少支？",
      "choices": [
        {
          "id": "A",
          "text": "13支"
        },
        {
          "id": "B",
          "text": "15支"
        },
        {
          "id": "C",
          "text": "26支"
        }
      ],
      "answer": "A",
      "explanation": "只看下层，铅笔6支和水笔7支都要数，6＋7＝13支。",
      "revision": "8f85df26ac0c"
    },
    {
      "id": "wp-nested-1",
      "prompt": "有3排筐，每排4个筐，每个筐里有2个球。一共有多少个球？",
      "choices": [
        {
          "id": "A",
          "text": "12个"
        },
        {
          "id": "B",
          "text": "8个"
        },
        {
          "id": "C",
          "text": "24个"
        }
      ],
      "answer": "C",
      "explanation": "先算筐的总数，3×4＝12个筐。每筐2个球，所以一共有12×2＝24个球。",
      "revision": "e60a5bb7db7f"
    },
    {
      "id": "wp-nested-2",
      "prompt": "书柜有2层，每层放3盒彩笔，每盒有4支。每层有几支彩笔？",
      "choices": [
        {
          "id": "A",
          "text": "12支"
        },
        {
          "id": "B",
          "text": "24支"
        },
        {
          "id": "C",
          "text": "8支"
        }
      ],
      "answer": "A",
      "explanation": "每层有3盒，每盒4支，一层就是3×4＝12支。题目问的是每层，不用算两层。",
      "revision": "4c420fdd1788"
    },
    {
      "id": "wp-nested-3",
      "prompt": "有2个书架，每个书架有3层。30本书平均放在所有层上，每层放几本？",
      "choices": [
        {
          "id": "A",
          "text": "10本"
        },
        {
          "id": "B",
          "text": "5本"
        },
        {
          "id": "C",
          "text": "15本"
        }
      ],
      "answer": "B",
      "explanation": "2个书架一共有2×3＝6层。30本平均放6层，每层30÷6＝5本。",
      "revision": "14aa3c321847"
    },
    {
      "id": "wp-focus-1",
      "prompt": "做了4盒饼干，每盒6块，送出9块。现在还剩多少块？",
      "choices": [
        {
          "id": "A",
          "text": "24块"
        },
        {
          "id": "B",
          "text": "15块"
        },
        {
          "id": "C",
          "text": "9块"
        }
      ],
      "answer": "B",
      "explanation": "4×6＝24块是原来做的数量。题目问剩下多少，还要算24－9＝15块。",
      "revision": "afea60e4603f"
    },
    {
      "id": "wp-focus-2",
      "prompt": "篮球有3筐，每筐5个。足球有9个。篮球比足球多多少个？",
      "choices": [
        {
          "id": "A",
          "text": "15个"
        },
        {
          "id": "B",
          "text": "24个"
        },
        {
          "id": "C",
          "text": "6个"
        }
      ],
      "answer": "C",
      "explanation": "3×5＝15个是篮球的总数。问“多多少”，要用15－9＝6个。",
      "revision": "244395950c99"
    },
    {
      "id": "wp-focus-3",
      "prompt": "一个班有29人，要分成每组5人。分好尽可能多的完整小组后，还有几人没有分进完整小组？",
      "choices": [
        {
          "id": "A",
          "text": "4人"
        },
        {
          "id": "B",
          "text": "5人"
        },
        {
          "id": "C",
          "text": "6人"
        }
      ],
      "answer": "A",
      "explanation": "完整的5组有25人。题目问没有分进去的人，29－25＝4人。",
      "revision": "890082296264"
    }
  ]
};
});
