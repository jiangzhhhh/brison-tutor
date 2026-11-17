# 二年级上册离线试卷语料

采集日期：2026-11-17。共 12 套：语文 6 套、数学 6 套，其中广州 11 套、成都 1 套。来源标题主要标注 2020—2021 年，附件学年如下；均为第三方转载地区卷，未获命题单位独立认证。

## 试卷索引

页数指解包原 PDF 的页数（含所附答案），Word 图像卷按来源公开题图计页。文字页指至少提取到20个字符的内嵌文字页，不表示该页题干完整。

| 学科 | 地区与说明 | 附件学年 | 版本 | 原件页数 | 来源答案 | 内嵌文字页 | 原卷 |
| --- | --- | --- | --- | ---: | --- | ---: | --- |
| 语文 | [广州市天河区](chinese/2020-广州市天河区-chinese/README.md) | 2019-2020 | 部编版 | 7 | 有 | 7/7 | [打开](chinese/2020-广州市天河区-chinese/raw/original.pdf) |
| 语文 | [广州市花都区](chinese/2020-广州市花都区-chinese/README.md) | 2019-2020 | 部编版 | 8 | 有 | 8/8 | [打开](chinese/2020-广州市花都区-chinese/raw/original.pdf) |
| 语文 | [广州市荔湾区](chinese/2020-广州市荔湾区-chinese/README.md) | 2020-2021 | 未明确 | 2 | 无 | 0/2 | [打开](chinese/2020-广州市荔湾区-chinese/raw/original.pdf) |
| 语文 | [广州市黄埔区](chinese/2020-广州市黄浦区-chinese/README.md) | 2019-2020 | 部编版 | 9 | 有 | 8/9 | [打开](chinese/2020-广州市黄浦区-chinese/raw/original.pdf) |
| 语文 | [广州市黄埔区](chinese/2021-广州市黄埔区-chinese/README.md) | 2020-2021 | 部编版 | 4 | 无 | 0/4 | [打开](chinese/2021-广州市黄埔区-chinese/raw/original.docx) |
| 语文 | [成都市金牛区](chinese/2021-成都市金牛区-chinese/README.md) | 2020-2021 | 部编版 | 5 | 有 | 1/5 | [打开](chinese/2021-成都市金牛区-chinese/raw/original.pdf) |
| 数学 | [广州市天河区](math/2020-广州市天河区-math/README.md) | 2019-2020 | 人教版 | 8 | 有 | 7/8 | [打开](math/2020-广州市天河区-math/raw/original.pdf) |
| 数学 | [广州市白云区](math/2020-广州市白云区-math/README.md) | 2019-2020 | 人教版 | 5 | 有 | 0/5 | [打开](math/2020-广州市白云区-math/raw/original.pdf) |
| 数学 | [广州市花都区](math/2020-广州市花都区-math/README.md) | 2019~2020 | 人教版 | 11 | 有 | 11/11 | [打开](math/2020-广州市花都区-math/raw/original.pdf) |
| 数学 | [广州市荔湾区](math/2020-广州市荔湾区-math/README.md) | 2019-2020 | 人教版 | 7 | 有 | 6/7 | [打开](math/2020-广州市荔湾区-math/raw/original.pdf) |
| 数学 | [广州市越秀区](math/2020-广州市越秀区-math/README.md) | 2019~2020 | 北师大版 | 11 | 有 | 11/11 | [打开](math/2020-广州市越秀区-math/raw/original.pdf) |
| 数学 | [广州市黄埔区](math/2020-广州市黄埔区-math/README.md) | 2019~2020 | 北师大版 | 11 | 有 | 11/11 | [打开](math/2020-广州市黄埔区-math/raw/original.pdf) |

## 离线使用

1. 从表格打开原卷。图题、阅读材料及选项须以原件为准。
2. [catalog.json](catalog.json) 记录学科、版本、学年、答案与路径；[pages.jsonl](pages.jsonl) 提供逐页记录及可提取的文字，适合程序读取。
3. 全部材料本地可用。9套含部分原生 PDF 文字，3套为纯图像材料；扫描页未生成可用 OCR，不伪造文字或补填答案。
4. 每套 `metadata.json` 保存来源URL、原始文件名、抓取日期、文件大小及SHA-256；网页快照为 `raw/*.html.txt`，题图与答案图也已下载。
5. 10套带来源答案，2套语文无答案：广州荔湾区、2021广州黄埔区。所有来源答案尚未逐题审核。

搜索示例（在仓库根目录）：

```sh
rg -n '读一读|短文|多少|一共|还剩' corpus/grade-2/semester-1 --glob 'pdf-text.txt'
python3 corpus/tools/verify.py
```

## 选题约束

- 数学含人教版和北师大版，不能混用教学范围。语文部编版历史卷也需对照当前教材。
- 图片/文字页可能包含答案；未把题目与答案自动切分成独立题库，防止图文丢失及答案误配。
- 来源标题“2020广州荔湾语文”与附件“2020-2021学年”并列保留；“黄浦区”来源拼写与卷头“黄埔区”的差异已记录。
- 这些材料用于个人离线学习与选题参考；未附可公开再发布的授权证明。

## 校验和维护

[verification.json](verification.json) 保存本次本地校验结果。校验覆盖文件哈希、ZIP完整性、图片可解码性、原件去重和索引引用；不代表试卷真伪或答案正确性审定。

在仓库根目录重新索引：`python3 corpus/tools/build_index.py`。提取PDF原有文字层可运行 `swift -module-cache-path "${TMPDIR:?}/brison-pdf-cache" corpus/tools/extract_pdf.swift 输入.pdf 输出.txt`（macOS，缓存使用系统提供的 `TMPDIR` 临时目录）。
