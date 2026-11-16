"""Verify archived bytes and offline references without network access."""
from collections import Counter
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import zipfile
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'grade-2/semester-1'
catalog = json.loads((root / 'catalog.json').read_text())['documents']
errors, original_hashes = [], []
counts = Counter()
for document in catalog:
    directory = root / document['directory']
    metadata = json.loads((directory / 'metadata.json').read_text())
    for f in metadata['files'] + metadata['derivedFiles']:
        path = directory / f['path']
        if not path.is_file():
            errors.append('Missing ' + str(path))
            continue
        data = path.read_bytes()
        if len(data) != f['bytes'] or hashlib.sha256(data).hexdigest() != f['sha256']:
            errors.append('Size/hash mismatch ' + str(path))
        counts['hashedFiles'] += 1
        if path.suffix in ['.zip', '.docx']:
            with zipfile.ZipFile(path) as archive:
                if archive.testzip():
                    errors.append('Bad archive ' + str(path))
            counts['validatedArchives'] += 1
        if f['role'] in ['questions', 'answers']:
            with Image.open(path) as image:
                image.verify()
            counts['validatedImages'] += 1
        if f['role'] == 'extracted_original':
            original_hashes.append(f['sha256'])
    for ref in metadata['sourcePageReferences']:
        if not (directory / ref.split('#', 1)[0]).is_file():
            errors.append('Missing page source ' + ref)
    if metadata['errors']:
        errors.append('Download errors in ' + document['id'])
    counts[document['subject']] += 1
    counts['documentsWithAnswers'] += metadata['answerStatus'] != 'not_available'
    counts['documentsWithNativeText'] += metadata['pagesWithEmbeddedText'] > 0
    counts['sourcePages'] += metadata['originalPageCount']
if len(original_hashes) != len(set(original_hashes)):
    errors.append('Duplicate original documents')
page_records = [json.loads(line) for line in (root / 'pages.jsonl').read_text().splitlines()]
if len(page_records) != counts['sourcePages']:
    errors.append('Page index count mismatch')
for page in page_records:
    if not (root / page['source'].split('#', 1)[0]).is_file():
        errors.append('Missing page index target ' + page['source'])
counts['pageRecordsWithNativeText'] = sum(p['textStatus'] == 'native_pdf_text_unreviewed' for p in page_records)
report = {'schemaVersion': 1, 'verifiedAt': datetime.now(timezone.utc).isoformat(),
          'status': 'passed' if not errors else 'failed', 'documents': len(catalog),
          'counts': dict(counts), 'errors': errors,
          'scope': '本地字节完整性和引用校验；不核定命题真实性、转载卷完整性及答案正确性。'}
(root / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(bool(errors))
