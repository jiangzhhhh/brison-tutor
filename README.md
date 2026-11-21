# Brison 的练习书架

在线访问：[GitHub Pages 练习书架](https://jiangzhhhh.github.io/brison-tutor/)。

打开 `dist/index.html` 即可使用，无需安装依赖。支持一年级至六年级、上下册、学科筛选和关键词搜索；默认展示二年级上册。顶部“进度管理”进入统一记录管理页。

## 离线试卷语料

[打开二年级上册语料目录](corpus/grade-2/semester-1/README.md)：语文、数学各6套地区期末卷，以广州卷为主。原卷、来源答案、题图、页面快照及来源元数据已一并保存，供后续离线设计训练；版本、年份差异和无答案材料在目录中单独标明。

## 练习索引

| 年级 | 册别 | 学科 | 训练 | 归档入口 |
| --- | --- | --- | --- | --- |
| 二年级 | 上册 | 语文 | 语义积木 | [打开](dist/exercises/grade-2/semester-1/chinese/semantic-blocks.html) |
| 二年级 | 上册 | 语文 | 标点应用 | [互动练习](dist/exercises/grade-2/semester-1/chinese/punctuation.html?mode=classified) · [纸笔练习](materials/grade-2/semester-1/chinese/punctuation/practice.md) · [纸笔版答案与解析](materials/grade-2/semester-1/chinese/punctuation/answers.md) |
| 二年级 | 上册 | 语文 | 中文阅读专项 | [互动练习](dist/exercises/grade-2/semester-1/chinese/reading-quest.html?mode=classified) · [题库、答案及抽查清单](materials/grade-2/semester-1/chinese/reading-quest/README.md) |
| 二年级 | 上册 | 数学 | 乘除意义与运算顺序 | [互动练习](dist/exercises/grade-2/semester-1/math/arithmetic.html?mode=classified) · [题库与出处](docs/arithmetic-foundations.md) |
| 二年级 | 上册 | 数学 | 应用题分类练习 | [互动练习](dist/exercises/grade-2/semester-1/math/math-focus.html) · [10 类应用题纸笔练习](materials/grade-2/semester-1/math/word-problems/practice.md) · [参考答案与解析](materials/grade-2/semester-1/math/word-problems/answers.md) |

应用题分类练习、乘除意义与运算顺序、标点应用和中文阅读专项可从「分类练习」的题目列表自主选题，也可切换到「随机闯关」。

## 添加练习

纸面与口头训练：

- 二年级上册数学：[30题针对性训练及4题方向短练](materials/grade-2/semester-1/math/2026-11-16-midterm-review/training.md)、[参考答案与解析](materials/grade-2/semester-1/math/2026-11-16-midterm-review/answers.md)。

1. 将页面及依赖保存到 `dist/exercises/grade-N/semester-N/学科/`。
2. 在 `dist/catalog.js` 的数组中添加记录，填写年级、册别、学科、标题、介绍、标签和相对入口路径。学科值：`chinese`、`math`、`english`。新增学科时同步扩展首页的学科映射。
   子入口设置 `parentId`，进度管理仍按其独立记录管理。如书架默认打开分类页，在主入口设置 `shelfPath`。
3. 依照 [项目风格指导](DESIGN.md) 接入共享样式及公共导航，依照 [进度与版本规则](docs/progress.md) 接入统一进度管理。
4. 按 [生字注音组件](docs/pinyin.md) 接入拼音，在本页索引登记，打开首页验证分类和跳转，运行 `node tools/lint-pinyin.cjs` 和 `node --test tests/*.test.cjs`。

筛选状态保存在 URL 的 hash 中，可收藏分类。主页不记录答题进度；各练习使用自己的浏览器记录。所有练习均使用仓库内的本地入口。

## 归档来源

2026-11-17 从两个已完成项目的发布产物复制单文件 HTML，未改动训练内容。以下路径相对于各自的原项目根目录，原项目不随本仓库分发：

- 《读懂再答》：原项目 `reading-trainer` 的 `dist/index.html`。
- 《语义积木》：原项目 `semantic-blocks` 的 `dist/index.html`。

构建源码及审查资料保留在各自的原项目中。归档时曾校验与原文件一致；此后本仓库版本已接入共享样式、公共导航和进度管理桥接，不再与原发布快照逐字一致。分发时应保留整个 `dist/` 目录及相对路径，不能仅复制单个练习 HTML。初次归档及公共能力接入未改变题目和判分规则；后续内容修订见下文。

《读懂再答》已下架。原题、答案、解析和版本说明见[分类练习归档](docs/read-before-answer-categories.md)及[90题短材料版归档](docs/read-before-answer-short-texts.md)。

《标点应用》的互动题库含七类共 66 题，其中 12 道练顿号。每轮随机抽取尚未达标类别的题目，顿号按两倍权重参与抽题。每类连续答对两道不同的题后停止抽取该类。完成后显示时间、用时、各类做题数和错题数，并按题统计同一位置上顿号和逗号的双向错填。刷新可恢复草稿与本轮进度。题目、参考答案和解析一并收录在[互动题库](dist/exercises/grade-2/semester-1/chinese/punctuation-bank.js)。

## 验证与发布状态

- 首页与目录脚本语法检查通过；默认分类、数学/语文归属、搜索、重置和全部 48 种分类组合的逻辑检查通过。
- 初次归档时，两份 HTML 与来源文件的 SHA-256 校验一致；随后已接入上述公共能力。
- 《乘除意义与运算顺序》已通过 Chrome 的离线入口、320px 窄屏、键盘作答、刷新恢复和进度清理检查。
- 支持 GitHub Pages 在线访问及本地离线使用，后续不再发布到 Sites。原有 Sites 删除确认尚未获得，尚未执行删除。
