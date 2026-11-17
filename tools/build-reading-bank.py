"""从原题和逐题审定的短材料重建内嵌题库；不修改题干、选项和答案。"""
import copy
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "materials/read-before-answer"
PAGE = ROOT / "dist/exercises/grade-2/semester-1/math/read-before-answer.html"

# 每项依次为：名称、所在句号、代词、所在句号。按新材料重新定位字符范围。
REFERENCES = {
    "T02": [("小宁", 1, "她", 2), ("画册", 1, "它", 3)],
    "T11": [("伞", 1, "它", 2), ("小安", 1, "我", 1)],
    "T22": [("纸盒", 2, "它", 2), ("布袋", 3, "它", 3)],
    "T31": [("小木", 1, "我", 1), ("小禾", 2, "我", 2)],
    "T42": [("小晴及时提醒同学并处理积水", 2, "这件事", 2), ("小晴", 3, "她", 3)],
    "T51": [("两个人", 1, "他们", 2), ("小林", 3, "他", 3)],
    "V07": [("写着“胶棒”的盒子", 1, "它", 2)],
    "V12": [("小桥", 1, "我", 1), ("小桥", 1, "我们", 1), ("小湾", 1, "我们", 1)],
    "X03": [("小山", 1, "你", 1), ("小河", 2, "你", 2)],
}


def annotate(q, original):
    if not original["tokens"]:
        q["tokens"], q["referenceEdges"] = [], []
        return
    spans = {}

    def add(text, number, kind):
        sentence = q["passage"][number - 1]
        start = sentence["text"].index(text)
        key = (sentence["id"], start, start + len(text))
        spans[key] = {"sid": key[0], "start": key[1], "end": key[2], "text": text, "kind": kind}
        return key

    edges = [(add(noun, n, "noun"), add(pronoun, p, "pronoun"))
             for noun, n, pronoun, p in REFERENCES[q["id"]]]
    # 保留仍在短材料中的其他名称和代词；优先保留长词，避免“我”遮住“我们”。
    lexemes = sorted({(t["text"], t["kind"]) for t in original["tokens"]}, key=lambda t: (-len(t[0]), t))
    for text, kind in lexemes:
        for sentence in q["passage"]:
            for match in re.finditer(re.escape(text), sentence["text"]):
                start, end = match.span()
                if any(sid == sentence["id"] and start < right and end > left for sid, left, right in spans):
                    continue
                key = (sentence["id"], start, end)
                spans[key] = {"sid": key[0], "start": start, "end": end, "text": text, "kind": kind}
    q["tokens"] = []
    identifiers = {}
    for i, (key, token) in enumerate(sorted(spans.items()), 1):
        token["id"] = identifiers[key] = f"w{i}"
        q["tokens"].append(token)
    q["referenceEdges"] = [[identifiers[a], identifiers[b]] for a, b in edges]


def main():
    original = json.loads((SOURCE / "bank-1.0.json").read_text())
    changes = json.loads((SOURCE / "short-passages.json").read_text())
    assert set(changes) == {q["id"] for q in original}
    categories = json.loads((SOURCE / 'categories.json').read_text())
    selected = [(qid, category) for category in categories for qid in category['questions']]
    assert len(selected) == 25 and len({qid for qid, _ in selected}) == 25
    before_by_id = {q['id']: q for q in original}
    bank = []
    for qid, category in selected:
        q = copy.deepcopy(before_by_id[qid])
        q.update(mode='train', sourceMode=q['mode'], blockId=category['id'], categoryTitle=category['title'])
        q.pop('round', None)
        q.pop('level', None)
        bank.append(q)
    for q in bank:
        before = before_by_id[q['id']]
        entry = changes[q["id"]]
        texts, required = entry[:2]
        allowed = entry[2] if len(entry) > 2 else required
        assert texts and all(texts) and set(required) <= set(allowed) <= set(range(1, len(texts) + 1))
        q["passage"] = [{"id": f"s{i}", "text": text} for i, text in enumerate(texts, 1)]
        q["evidence"] = {
            "prompt": before["evidence"]["prompt"],
            "answers": [[f"s{i}" for i in required]],
            "allowed": [f"s{i}" for i in allowed],
            "explanation": "直接依据需要选全；补充条件可以选，无关信息不选。",
        }
        annotate(q, before)
    text = PAGE.read_text()
    payload = json.dumps(bank, ensure_ascii=False, separators=(",", ":"))
    text, count = re.subn(r'(<script id="bank-data" type="application/json">).*?(</script>)',
                         lambda match: match[1] + payload + match[2], text, count=1, flags=re.S)
    assert count == 1
    PAGE.write_text(text)
    old_size = sum(len(s["text"]) for q in original for s in q["passage"])
    new_size = sum(len(s["text"]) for q in bank for s in q["passage"])
    print(f"已生成{len(categories)}类、{len(bank)}题；阅读材料共{new_size}字符。")


if __name__ == "__main__":
    main()
