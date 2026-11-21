# 中文阅读闯关题库

[打开离线练习](../../../../../dist/exercises/grade-2/semester-1/chinese/reading-quest.html)

二年级用。精选 100 道英文原题，每组第一道是中文改写，另有三道改变线索、角色或语序的变种。400 道中文题的正文、选项、答案和解析保存在下列三个文件。题目的中文表述和答案已逐题核对，状态统一为 **待人工审校**，可玩版可从书架打开。

| 来源 | 题库和答案 | 组数 | 许可 |
| --- | --- | ---: | --- |
| Winograd Schema Challenge | [指代与常识](winograd.json) | 30 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| bAbI QA v1.2 | [事实、否定、指代、时间、条件与位置](babi.json) | 50 | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| CLUTRR v1 | [家庭关系与干扰信息](clutrr.json) | 20 | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) |

## 出处与定位

- **Winograd** 的 `source_id` 形如 `xml-003`，表示从 1 开始计数的第 3 个 `<schema>`。`original_question` 保留原题需消解的片段。各组保留原作者姓名，原文空白统一处理。 [Ernest Davis 原题集及许可](https://cs.nyu.edu/~davise/papers/WinogradSchemas/WS.html) · [原始 XML](https://cs.nyu.edu/~davise/papers/WinogradSchemas/WSCollection.xml)
- **bAbI** 使用 v1.2 的英文测试集。组内 `source_url` 指向可复查的固定快照和行号，依据句与原答案来自原始数据。九个英文测试文件已与 Keras 所列 v1.2 归档逐字节比对。该归档的 SHA-256 为 `84f5296ab9a1ad0dc9464e08c491d65cd08830fca3acae9ab86f75e0fb81573c`。 [原数据集与许可](https://huggingface.co/datasets/facebook/babi_qa/blob/main/README.md) · [论文](https://arxiv.org/abs/1502.05698) · [v1.2 数据归档](https://s3.amazonaws.com/text-datasets/babi_tasks_1-20_v1-2.tar.gz)
- **CLUTRR** 的 `source_id` 是原始数据中的 UUID，来源为 `gen_train234_test2to10` 的 `train` 分集。`original_question` 保留原 `query` 的人物顺序，`original_answer` 保留 `target_text`。所选记录以发布者的浏览器数据和 CSV 两处交叉核对。许可按项目作者声明执行。 [作者项目及许可](https://github.com/facebookresearch/clutrr#license) · [数据集](https://huggingface.co/datasets/CLUTRR/v1) · [数据浏览器](https://huggingface.co/datasets/CLUTRR/v1/viewer/gen_train234_test2to10/train)

## 作答规则

「分类练习」在八个可展开的列表里列出全部 400 道题，可自由点选。每道题保存自己的草稿和作答记录，提交后可以返回列表或重练这一题。分类与随机各自保存进度。

「随机闯关」每轮从 100 个题组中随机抽取 10 个，每遍打乱本轮尚未消除的题组，每组出一道。再次遇到同组时优先出没做过的版本，四道都出过后，可抽上一道以外的版本。连续答对两次就消除本组，答错清零本组的连对次数。组与组的连对记录各自累计。消除本轮全部 10 组后通关，显示从开练到最后一次正确提交的实际用时，离开期间也计入用时。续练沿用原题组，再次练习会重新抽取并保留已完成的记录。

## 家长抽查

按下表在题库里找组号，阅读 `-v1` 中文原题和一则变种。先遮住答案独立作答，再检查题目是否能读懂、是否只有一个答案、解析有没有引用题干线索。查看原题时，对照 `original_text`、`original_answer` 与中文首题的关系。记下需要调整的题号，确认无歧义后再更新该题的 `verification_status`。

| 来源 | 组号 | 变种 | 核对重点 |
| --- | --- | --- | --- |
| Winograd | `wsc-01` | `-v2` | 大小线索改变“它”的指代 |
| Winograd | `wsc-07` | `-v2` | 跑得一样快时，谁一开始落后 |
| Winograd | `wsc-24` | `-v3` | 对话里谁回家取书 |
| bAbI | `babi-01` | `-v3` | 物品跟着接手的人移动 |
| bAbI | `babi-07` | `-v3` | 到达前的最后一个地点 |
| bAbI | `babi-12` | `-v2` | 否定说的是哪一个人 |
| bAbI | `babi-18` | `-v2` | 单人代词指代 |
| bAbI | `babi-24` | `-v4` | 多人代词指代 |
| bAbI | `babi-29` | `-v2` | 分清叙述顺序和实际时间 |
| bAbI | `babi-35` | `-v4` | 用两条规则推断结果 |
| bAbI | `babi-41` | `-v3` | 按线索推出左右位置 |
| bAbI | `babi-46` | `-v3` | 物品的大小和内外层 |
| CLUTRR | `clutrr-03` | `-v4` | 从谁的角度判断舅舅与外甥女 |
| CLUTRR | `clutrr-07` | `-v2` | 区分妈妈和爸爸那一边的称呼 |
| CLUTRR | `clutrr-19` | `-v4` | 排除无关人物，找出家庭关系 |

## 题库更新

归档题组和版本 ID 用于恢复进度，修订内容时遵循[进度与版本规则](../../../../../docs/progress.md)。修改归档后从仓库根目录运行：

```sh
node tools/build-reading-quest-bank.cjs
node --test tests/*.test.cjs
```

生成脚本核对配额、原题标识、题面去重、版本 ID、选项、答案与审校信息，并为离线网页生成浏览器题库。
