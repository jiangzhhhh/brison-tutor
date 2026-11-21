# 本地进度与版本迭代

## 必须遵守

1. 练习进度一律持久化到 `localStorage`，包括已答题、当前题/阶段、草稿、首次结果、提示使用和重练状态。关键交互后及时保存，不能只依赖 `beforeunload`。读取和写入均捕获异常；写入失败必须提示当前进度可能丢失。
2. 每个练习使用稳定的 `exerciseId`，不能因标题、目录或样式变化而更换。新练习的键为 `brison-tutor:progress:<exerciseId>:v<schemaVersion>`；不能使用裸 `progress` 或 `state`，不能调用 `localStorage.clear()`。
3. 数据结构版本 `schemaVersion`、题库版本 `bankVersion` 与页面/样式发布版本分开维护。样式、文字说明等兼容变更不得清空进度。新增题目按稳定题目 ID 补入，不用数组下标关联成绩。
4. 可迁移的数据先验证旧记录，保留原键备份，在内存中迁移、验证，再写入新键；写入成功前不删除旧数据。迁移必须幂等，记录迁移来源。同题内容或评分标准发生不兼容变化时，隔离受影响题目的成绩，不能当作新题成绩。
5. 不兼容或损坏的数据保留原样并暂停覆盖保存。练习页只提示无法恢复、暂停保存等实际影响及进度管理入口。不能仅因读取失败、版本变化就静默写入空白初始状态。
6. 在 `dist/catalog.js` 登记 `storage.currentKey`、`schemaVersion`、`bankVersion`、受本练习拥有的历史键前缀。统一管理页必须能够列出当前版、旧版、不兼容和损坏记录，并只删除明确属于该练习的键。
7. 清理必须确认范围；取消不改变任何数据；全部清理失败时逐项反馈。其他已打开的练习接收到其记录被清理/更改的事件后，暂停保存并要求刷新，防止旧内存记录回写。

## 新记录格式

```json
{
  "exerciseId": "example-exercise",
  "schemaVersion": 1,
  "bankVersion": "2026-11-17",
  "updatedAt": "2026-11-17T00:00:00.000Z",
  "data": {"currentQuestionId": "q-001", "draft": {}, "records": {}}
}
```

新增题目必须使用稳定 ID。更新 `updatedAt` 表示成功保存的时间。迁移或备份数据也要放在本练习命名空间中，便于统一管理。

## 现有格式的兼容

| 练习 | 当前键 | 结构版本 | 题库版本 | 历史前缀 |
| --- | --- | --- | --- | --- |
| 语义积木 | `semantic-blocks-v4` | `version: 4` | `4` | `semantic-blocks-v` |
| 标点应用 | `brison-tutor:progress:punctuation:v3` | `schemaVersion: 3` | `2.1` | 本练习命名空间 |
| 标点应用 · 分类练习 | `brison-tutor:progress:punctuation-classified:v2` | `schemaVersion: 2` | `2.1` | `brison-tutor:progress:punctuation-classified:` |
| 中文阅读专项 · 随机闯关 | `brison-tutor:progress:reading-quest:v1` | `schemaVersion: 1` | `1.0` | `brison-tutor:progress:reading-quest:` |
| 中文阅读专项 · 分类练习 | `brison-tutor:progress:reading-quest-classified:v1` | `schemaVersion: 1` | `1.0` | `brison-tutor:progress:reading-quest-classified:` |
| 乘除意义与运算顺序 | `brison-tutor:progress:arithmetic-foundations:v3` | `schemaVersion: 3` | `1.1` | 本练习命名空间 |
| 乘除意义与运算顺序 · 分类练习 | `brison-tutor:progress:arithmetic-foundations-classified:v1` | `schemaVersion: 1` | `1.1` | `brison-tutor:progress:arithmetic-foundations-classified:` |
| 应用题分类练习 | `brison-tutor:progress:math-focus:v1` | `schemaVersion: 1` | `2026-11-21.1` | `brison-tutor:progress:math-focus:` |
| 应用题随机闯关 | `brison-tutor:progress:math-streak:v1` | `schemaVersion: 1` | `2026-11-21.1` | `brison-tutor:progress:math-streak:` |

应用题分类练习按稳定题目 ID保存选择、题目修订号、分组尝试和每次提交结果。重练新增尝试，不覆盖首次结果；未提交草稿不会计为正确或错误。相同结构的旧题库通过校验后先备份到当前键加 `:backup:<bankVersion>`，验证备份后升级；未来题库、修改过的题目、损坏数据或未知结构保留并暂停保存。页面为此在桥接脚本上声明 `data-validate-progress="app"`，由本练习严格校验完整格式；其他旧练习保持原有行为。保存时同时比较已读取的原始值，防止旧标签页覆盖外部更改。

`2026-11-21.1` 增加十类应用题共30题，每组逐题提交。原34题的题目 ID、修订号及评分规则沿用旧版。升级时保留原有草稿、提交结果、重练和当前题位置。

应用题随机闯关和应用题分类练习共用[十类题库](../dist/exercises/grade-2/semester-1/math/math-focus-bank.js)，各自保存进度。每轮从每类抽取两题，保存候选题 ID 和修订号、开始时间、当前题、草稿及正式作答顺序。续练以该轮候选和作答顺序恢复连对状态。完成时间取最后一类达标时的提交时间；重练把已完成轮次存入历史，从新抽取的候选开始。

标点应用保存本轮的达标类别、开始时间、当前题、草稿、依序提交的答案和最后一题提交时的完成时间。用时为开始到完成的实际经过时间，包含中途关闭或离开页面的时间。选择“再练一次”后，本轮进入历次完成记录。v3 记录增加顿号类别，v2 进行中的轮次保留题目、草稿和答题记录，并纳入顿号。v2 已完成的轮次保留六类达标及原有时间。迁移保留原键并登记来源，使用隐藏标记防止单条清理后的数据恢复。v1 的逐题记录无法还原作答顺序和每轮用时，保留在原键并在进度管理中列为旧版记录。

乘除意义与运算顺序在 v2 将十类题放在同一轮，v3 将运算顺序题拆成三个步骤，并保存已确认的答复、当前阶段和草稿。迁移时保留已完成轮次及其原判分，进行中的情境题、编题和示例可继续累计。旧版顺序题的成绩保留在原键，当前轮按三步重新验收；未提交的顺序题保留已选运算符，从第一步接续。迁移标记防止单独清理新版后重新恢复旧记录，全练习清理覆盖该练习各版本和迁移标记。

语义积木继续读取现有格式。各练习通过 `progress-bridge.js` 接入管理页；管理模式跳过训练初始化和自动保存，只允许列举和清理归属键。记录无时间戳时不伪造更新时间。管理页不把初始化记录等同于已经答过题。

《读懂再答》下架后，浏览器中的历史记录保留在原键。进度管理及其全部清理操作仅涵盖目录中登记的练习。旧版进度键见[分类练习归档](read-before-answer-categories.md)。

新增练习在 head 中依次加载 `catalog.js`、`progress-store.js`、`progress-bridge.js`，后者通过 `data-exercise` 指定稳定 ID。训练脚本入口必须检查 `ProgressBridge.isManagementFrame` 并退出；每次保存前检查 `ProgressBridge.invalidated`，为真时停止保存。只有管理页向练习文档发消息，响应必须核对来源窗口、随机令牌和请求 ID。

中文阅读闯关按稳定题组和变种 ID 保存余下抽题顺序、当前题的选项顺序和草稿，以及已提交答案。开局保存开始时间，最后一组消除时保存通关时间。重练把已完成轮次写入同一条记录的 `data.history`，与新一轮一次写入。浏览器恢复时检查每次提交、抽题顺序和达标状态。损坏和不兼容的记录原样保留并暂停保存。支持 Web Locks 的浏览器会对本练习的保存与清理串行处理。缺少写入锁时，保存前仍核对原值并监听跨页变更，两页恰好同时写入时仍可能覆盖。

同一练习可在目录中登记独立的子模式。包含 `parentId` 的记录由进度管理照常读取和清理。标点应用、中文阅读专项和乘除意义与运算顺序的分类模式以 `?mode=classified` 打开，在桥接脚本用 `data-classified-exercise` 指向分类 ID；直接打开原地址仍可恢复随机进度。

分类题目列表按稳定题目 ID 保存草稿与提交记录。应用题分类练习和乘除分类保留原有分组记录，按题目 ID 读取旧草稿和成绩。中文阅读分类首次写入新列表记录前，把旧轮次原样备份到分类键的 `:backup:rounds`；标点分类从 v1 迁到 v2 时保留原键，并用隐藏标记防止清理后重新恢复已清记录。

## 浏览器边界

`localStorage` 随浏览器和来源隔离。直接通过 `file://` 打开时，各文件是否隔离存储由浏览器决定；管理页在原练习文档的 iframe 内读取，尽量保持原文件位置，读取受限时明确报告失败。移动文件或改名后不会保证找到旧记录；不得把失败误报成“无进度”。不同地址、不同浏览器的记录不自动互通。

验证命令：`node --test tests/*.test.cjs`。修改版本/清理逻辑需覆盖旧版、损坏数据、存储拒绝访问、误删隔离和跨标签页失效通知。
