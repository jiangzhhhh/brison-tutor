# 生字注音公共组件

## 默认范围

默认采用二年级上册的生字辅助，不给所有汉字注音。全局规则是：先查年级识字参考表，表内字默认不注音，表外汉字自动结合语境注音。新增题目只要进入页面已有的注音区域，就自动适用，不需要逐题列出生字，也不依赖当前题库里是否出现过这个字。例如未在当前材料中出现的“鹈鹕、踌躇”，同样会自动注音。

默认参考[一年级上](https://www.hanyuguoxue.com/zidian/yuwen-shizi-yinianji-shang)、[一年级下](https://www.hanyuguoxue.com/zidian/yuwen-shizi-yinianji-xia)、[二年级上](https://www.hanyuguoxue.com/zidian/yuwen-shizi-ernianji-shang)公开整理的统编教材识字表，累计去重1150字。逐册字符、来源、抓取时间和来源页面校验值保存在[识字参考表源数据](../materials/pinyin/recognition-profile.json)，独立于所有练习题库。

这是默认的年级参考范围，不是 Brison 的识字测评结果，也不将二年级上册全部字视为他已实际掌握。该参考表与2024年起修订教材的字种和字序可能不同；[人教社对修订的说明](https://www.pep.com.cn/bks/xxyw/jzjd/202505/W020250531413572751916.pdf)指出识字分布有所调整。后续可替换全局参考表，或根据实际掌握情况补充、排除字符；不能只按笔画数判断难度。通用字音库暂不支持的极生僻字仍保留原字，新增材料的多音词也需抽查，不能把自动处理等同于所有读音均正确。

题目、答案、判分与原文数据保持原样。注音只增强显示，不算作使用解题提示，也不写入练习进度；无需更换题库版本或迁移已有记录。

## 文件

- [pinyin.js](../dist/pinyin.js)：通用注音和页面增强，提供`PinyinAid.segments`与`PinyinAid.annotate`。
- [pinyin-data.js](../dist/pinyin-data.js)：生成年级识字参考范围及词语读音，书架上的练习共用。
- [识字参考表](../materials/pinyin/recognition-profile.json)与[校订读音](../materials/pinyin/readings.json)：独立维护的源数据；通过[生成工具](../tools/build-pinyin-profile.py)更新分发配置。
- [project.css](../dist/project.css)：`.pinyin-ruby`样式，拼音通过`ruby`、`rt`显示在汉字上方。
- [pinyin-pro 3.29.5](../dist/vendor/pinyin-pro-3.29.5.js)：本地拼音转换依赖，固定版本，离线可用；[MIT许可证](../dist/vendor/pinyin-pro-LICENSE)。

依赖下载自`https://registry.npmjs.org/pinyin-pro/-/pinyin-pro-3.29.5.tgz`中的`package/dist/index.js`。文件SHA-256为`a488173470768ace074c3c4fffbb880e83523b3aa9598a8147c930e7f2d5c7dc`。转换选项参考[pinyin-pro文档](https://pinyin-pro.cn/use/pinyin.html)。

## 新练习接入

以下示例用于位于`dist/`根目录的页面；更深目录使用相应的相对路径。脚本应在练习首次渲染之前，按依赖顺序加载：

```html
<link rel="stylesheet" href="project.css">
<script src="vendor/pinyin-pro-3.29.5.js"></script>
<script src="pinyin-data.js"></script>
<script src="pinyin.js"></script>

<p data-pinyin>长颈鹿低下头喝水，小鸟啄着树干。</p>
<script>
  PinyinAid.annotate(document);
</script>
```

动态页面在每次替换内容之后调用`annotate`，包括局部更新与弹窗。重复调用不会嵌套生成注音，不使用持续观察整个页面的后台监听。

接入时检查选题预览、题干、选项、题目表格和提交后的解析。折叠的题目列表可以在展开时注音。表格按单元格注音，保留各单元格自己的语境。

现有元素也可以通过选择器接入：

```js
PinyinAid.annotate(document.getElementById('exercise'), {
  selector: '.passage p, .question-text, .choice',
  extraChars: '绊',
  knownChars: '鹰',
  readings: { '转轴': 'zhuàn zhóu' }
});
```

- `selector`：本次注音的文本范围，默认`[data-pinyin]`。
- `extraChars`：即使在年级识字表中，也需要额外注音的字。
- `knownChars`：补充已掌握、不再需要注音的字，优先于年级参考范围和额外注音配置。
- `readings`：词语读音覆盖，按空格分隔，与汉字逐字对应；长词优先，不影响其他调用。
- `data-pinyin="off"`或`data-pinyin-skip`：在范围内排除某个元素及其内容。

同一句中分散于词块按钮或高亮元素的文字，应由一个共同范围包住，才能结合完整上下文判断读音，例如给整个`.words`调用注音，而不是分别给每个词块判断。

只需读取结果时：

```js
const items = PinyinAid.segments('小鸟啄米。');
// 每项含text、reading、start、end，偏移使用JavaScript字符串索引。
// 非生字的reading为空，原文字、标点、数字均保留。
```

原生下拉框、输入框、代码块、SVG、已有ruby、隐藏内容及标记排除的内容不注音。组件只替换文本节点，保留按钮、链接、词块和句子的属性与事件；不把题目中的字符当成HTML执行。屏幕阅读器读取汉字，避免重复朗读拼音。

## 验证

```sh
python3 tools/build-pinyin-profile.py
node --test tests/*.test.cjs
```

新增材料的生字由全局规则自动识别，无需补入候选字白名单；抽查多音词，需要时补充校订读音。浏览器可打开[检查页面](../tests/pinyin.browser.html)，验证上下文、原文保留、排除范围、点击、重复增强、HTML安全及flex排版。再检查练习内的手机换行、词块选择、指代连线、切题和弹窗。自动注音不等于所有新增语料的读音均已人工校订。
