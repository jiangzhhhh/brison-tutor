# 本地进度与版本迭代

## 必须遵守

1. 练习进度一律持久化到 `localStorage`，包括已答题、当前题/阶段、草稿、首次结果、提示使用和重练状态。关键交互后及时保存，不能只依赖 `beforeunload`。读取和写入均捕获异常；写入失败必须提示当前进度可能丢失。
2. 每个练习使用稳定的 `exerciseId`，不能因标题、目录或样式变化而更换。新练习的键为 `brison-tutor:progress:<exerciseId>:v<schemaVersion>`；不能使用裸 `progress` 或 `state`，不能调用 `localStorage.clear()`。
3. 数据结构版本 `schemaVersion`、题库版本 `bankVersion` 与页面/样式发布版本分开维护。样式、文字说明等兼容变更不得清空进度。新增题目按稳定题目 ID 补入，不用数组下标关联成绩。
4. 可迁移的数据先验证旧记录，保留原键备份，在内存中迁移、验证，再写入新键；写入成功前不删除旧数据。迁移必须幂等，记录迁移来源。同题内容或评分标准发生不兼容变化时，隔离受影响题目的成绩，不能当作新题成绩。
5. 不兼容或损坏的数据保留原样并暂停覆盖保存，显示“旧进度已保留”的说明及进度管理入口。不能仅因读取失败、版本变化就静默写入空白初始状态。
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
| 读懂再答 | `brison-tutor:progress:read-before-answer:v2` | `version: 2` | `3.0` | `reading-lab-v`，以及本练习命名空间 |
| 语义积木 | `semantic-blocks-v4` | `version: 4` | `4` | `semantic-blocks-v` |

语义积木继续读取现有格式。读懂再答现为25题自由分类练习，保留题目的有效旧训练记录与草稿可迁移；两个旧键`reading-lab-v1`及`brison-tutor:progress:read-before-answer:v1`原样保留。迁移成功后用`storage.auxiliaryKeys`登记的隐藏标记防止清理后再次恢复旧成绩；全练习清理包含此标记，详见[分类练习说明](read-before-answer-categories.md)。两套练习通过 `progress-bridge.js` 接入管理页；管理模式跳过训练初始化和自动保存，只允许列举和清理归属键。记录无时间戳时不伪造更新时间。管理页不把初始化记录等同于已经答过题。

新增练习在 head 中依次加载 `catalog.js`、`progress-store.js`、`progress-bridge.js`，后者通过 `data-exercise` 指定稳定 ID。训练脚本入口必须检查 `ProgressBridge.isManagementFrame` 并退出；每次保存前检查 `ProgressBridge.invalidated`，为真时停止保存。只有管理页向练习文档发消息，响应必须核对来源窗口、随机令牌和请求 ID。

## 浏览器边界

`localStorage` 随浏览器和来源隔离。直接通过 `file://` 打开时，各文件是否隔离存储由浏览器决定；管理页在原练习文档的 iframe 内读取，尽量保持原文件位置，读取受限时明确报告失败。移动文件或改名后不会保证找到旧记录；不得把失败误报成“无进度”。不同地址、不同浏览器的记录不自动互通。

验证命令：`node --test tests/*.test.cjs`。修改版本/清理逻辑需覆盖旧版、损坏数据、存储拒绝访问、误删隔离和跨标签页失效通知。
