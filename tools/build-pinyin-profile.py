"""从有来源记录的年级识字表和校订读音，生成离线注音配置。"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'materials/pinyin'
profile = json.loads((SOURCE / 'recognition-profile.json').read_text())
readings = json.loads((SOURCE / 'readings.json').read_text())
known = ''.join(dict.fromkeys(''.join(book['characters'] for book in profile['books'])))
chunks = [known[i:i + 80] for i in range(0, len(known), 80)]
text = '''// 年级识字参考范围；表外汉字自动注音，不按现有题目维护生字白名单。
// 由tools/build-pinyin-profile.py生成，来源及读音校订保存在materials/pinyin/。
(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.PinyinData=data;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  return Object.freeze({
'''
text += '    version:' + json.dumps(profile['id'] + '-' + profile['version']) + ',\n'
text += '    knownChars:[\n' + ',\n'.join('      ' + json.dumps(chunk, ensure_ascii=False) for chunk in chunks) + "\n    ].join(''),\n"
text += '    readings:Object.freeze(' + json.dumps(readings, ensure_ascii=False, indent=6) + ')\n'
text += '  });\n});\n'
(ROOT / 'dist/pinyin-data.js').write_text(text)
print(f'已生成年级识字参考表，共{len(known)}个不重复汉字。')
