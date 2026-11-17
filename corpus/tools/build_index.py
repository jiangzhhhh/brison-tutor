"""Rebuild the offline corpus index from archived metadata; no network access."""
from pathlib import Path
import hashlib
import json
import re

root = Path(__file__).resolve().parents[1] / 'grade-2/semester-1'
catalog, pages = [], []
for path in sorted(root.rglob('metadata.json')):
    item = json.loads(path.read_text())
    directory = path.parent
    original = next(f for f in item['files'] if f['role'] == 'extracted_original')
    original_name = original['originalFilename']
    years = re.search(r'20\d{2}[-~]20\d{2}', original_name)
    item['schoolYearAsLabeledInAttachment'] = years[0] if years else '未标明'
    item['textbookEdition'] = next((x for x in ['北师大版', '人教版', '部编版'] if x in original_name), '未明确')
    item['editionEvidence'] = '附件原始文件名，未与当前教材逐题对照'
    item['regionNormalized'] = item['regionAsLabeled'].replace('黄浦区', '黄埔区')
    item['notes'] = []
    if item['regionNormalized'] != item['regionAsLabeled']:
        item['notes'].append('来源标题及附件名写“黄浦区”；PDF卷头写“黄埔区”，原始标注保留。')
    if item['id'] == '2020-广州市荔湾区-chinese':
        item['notes'].append('来源标题标2020，附件名标2020-2021学年；不能仅按目录ID判断考试年份。')
    text_path = directory / 'pdf-text.txt'
    native = text_path.read_text() if text_path.exists() else ''
    parts = re.split(r'\n\n--- PDF page (\d+) ---\n', native)
    texts = {int(parts[n]): parts[n+1].strip() for n in range(1, len(parts), 2)}
    jobs_path = directory / 'render-jobs.json'
    if jobs_path.exists():
        item['sourcePageReferences'] = [x['source'] for x in json.loads(jobs_path.read_text())]
    references = item['sourcePageReferences']
    item['originalPageCount'] = len(references)
    item['pagesWithEmbeddedText'] = sum(len(t) >= 20 for t in texts.values())
    item['transcriptionStatus'] = 'native_pdf_text_partial_unreviewed' if item['pagesWithEmbeddedText'] else 'image_only_no_transcript'
    item['ocrStatus'] = 'not_available'
    item['completeness'] = '公开图片版全部可见分页及附件已保存；不保证转载件等同命题方完整原稿'
    item['derivedFiles'] = []
    if item['pagesWithEmbeddedText']:
        data = text_path.read_bytes()
        item['derivedFiles'].append({'path': 'pdf-text.txt', 'role': 'native_pdf_text_unreviewed', 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
    elif text_path.exists():
        text_path.unlink()
    for n, reference in enumerate(references, 1):
        text = texts.get(n, '')
        pages.append({'schemaVersion': 1, 'documentId': item['id'], 'subject': item['subject'],
                      'grade': 2, 'semester': 1, 'page': n,
                      'source': str(directory.relative_to(root) / reference),
                      'textStatus': 'native_pdf_text_unreviewed' if len(text) >= 20 else 'image_only',
                      'text': text, 'answerReviewStatus': 'unreviewed',
                      'requiresOriginalForQuestionDesign': True})
    path.write_text(json.dumps(item, ensure_ascii=False, indent=2) + '\n')
    answer = '有，未校对' if item['answerImageCount'] else '无'
    rel = directory.relative_to(root).as_posix()
    brief = {k: item[k] for k in ['id', 'title', 'subject', 'grade', 'semester', 'yearAsLabeled',
             'schoolYearAsLabeledInAttachment', 'regionNormalized', 'textbookEdition', 'answerStatus',
             'originalPageCount', 'pagesWithEmbeddedText', 'transcriptionStatus', 'notes']}
    brief.update({'directory': rel, 'original': rel + '/' + original['path'], 'metadata': rel + '/metadata.json'})
    catalog.append(brief)
    source_links = '\n'.join('- [' + s['title'] + '](' + s['url'] + ')' for s in item['sources'])
    note_text = '\n'.join('- ' + note for note in item['notes']) or '- 暂未发现标题标注差异。'
    (directory / 'README.md').write_text(f'''# {item['title']}

- 教材版本：{item['textbookEdition']}（证据为附件原始文件名）
- 附件标注学年：{item['schoolYearAsLabeledInAttachment']}
- 参考答案：{answer}；不代表答案已经核验正确。
- 原文件页数：{item['originalPageCount']}；有可提取内嵌文字的页数：{item['pagesWithEmbeddedText']}。
- [原卷]({original['path']}) / [来源、文件清单及 SHA-256](metadata.json)
- 原附件文件名：{original_name}

## 来源

采集日期：2026-11-17。奥数网转载；未向命题方独立认证。

{source_links}

## 已知差异

{note_text}

## 离线使用

`raw/questions-*` 是来源图片版的题图，`raw/answers-*` 是来源答案栏目图；推广二维码已排除。`raw/original-1.zip` 保留原下载包，`raw/original.*` 是不改内容的解包文件。`raw/*.html.txt` 是原页面字节快照，使用文本扩展名保存。

若有 `pdf-text.txt`，仅是 PDF 的原有文字层，不是经过校对的完整题库；数值、图形、拼音与标注可能缺失。生成训练题前须打开原卷核对，缺答案的卷不能据此假定答案。未提供可用 OCR 转写。
''')
    if jobs_path.exists():
        jobs_path.unlink()

(root / 'catalog.json').write_text(json.dumps({'schemaVersion': 1, 'retrievedDate': '2026-11-17', 'documents': catalog}, ensure_ascii=False, indent=2) + '\n')
(root / 'pages.jsonl').write_text(''.join(json.dumps(p, ensure_ascii=False) + '\n' for p in pages))
rows = []
for item in catalog:
    rows.append('| ' + ' | '.join([
        '语文' if item['subject'] == 'chinese' else '数学',
        '[' + item['regionNormalized'] + '](' + item['directory'] + '/README.md)',
        item['schoolYearAsLabeledInAttachment'], item['textbookEdition'],
        str(item['originalPageCount']), '有' if item['answerStatus'] != 'not_available' else '无',
        str(item['pagesWithEmbeddedText']) + '/' + str(item['originalPageCount']),
        '[打开](' + item['original'] + ')']) + ' |')
(root / 'README.md').write_text('''# 二年级上册离线试卷语料

采集日期：2026-11-17。共 12 套：语文 6 套、数学 6 套，其中广州 11 套、成都 1 套。来源标题主要标注 2020—2021 年，附件学年如下；均为第三方转载地区卷，未获命题单位独立认证。

## 试卷索引

页数指解包原 PDF 的页数（含所附答案），Word 图像卷按来源公开题图计页。文字页指至少提取到20个字符的内嵌文字页，不表示该页题干完整。

| 学科 | 地区与说明 | 附件学年 | 版本 | 原件页数 | 来源答案 | 内嵌文字页 | 原卷 |
| --- | --- | --- | --- | ---: | --- | ---: | --- |
''' + '\n'.join(rows) + '''

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
''')
print(json.dumps({'documents': len(catalog), 'pages': len(pages), 'nativeTextDocuments': sum(d['pagesWithEmbeddedText'] > 0 for d in catalog)}, ensure_ascii=False))
