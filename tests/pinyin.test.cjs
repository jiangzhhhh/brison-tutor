const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const aid=fs.existsSync('dist/pinyin.js')?require('../dist/pinyin.js'):{};

test('二年级默认只给选定生字注音，常用字保持原样',()=>{
  assert.equal(typeof aid.segments,'function');
  const segments=aid.segments('小鸟啄米，大家看着。');
  assert.deepEqual(segments.filter(s=>s.reading).map(s=>[s.text,s.reading]),[['啄','zhuó']]);
  assert.equal(segments.map(s=>s.text).join(''),'小鸟啄米，大家看着。');
});

test('结合完整语境区分多音字，调用者可补充生字',()=>{
  assert.equal(typeof aid.segments,'function');
  const segments=aid.segments('长颈鹿长大了，银行旁的人行走回家。',{extraChars:'长行'});
  assert.deepEqual(segments.filter(s=>s.text==='长').map(s=>s.reading),['cháng','zhǎng']);
  assert.deepEqual(segments.filter(s=>s.text==='行').map(s=>s.reading),['háng','xíng']);
});

test('保留标点、数字、英文及表情的原文和字符位置',()=>{
  assert.equal(typeof aid.segments,'function');
  const text='🐸A<啄> 12 & 鹰！';
  const segments=aid.segments(text);
  assert.equal(segments.map(s=>s.text).join(''),text);
  for(const s of segments)assert.equal(text.slice(s.start,s.end),s.text);
  assert(segments.filter(s=>!/[\p{Script=Han}]/u.test(s.text)).every(s=>!s.reading));
});

test('已掌握字可以取消注音，词语读音覆盖不会影响其他调用',()=>{
  assert.equal(typeof aid.segments,'function');
  const first=aid.segments('啄木鸟与转轴。',{knownChars:'啄',extraChars:'轴',readings:{转轴:'zhuàn zhóu'}});
  assert.equal(first.find(s=>s.text==='啄').reading,'');
  assert.equal(first.find(s=>s.text==='轴').reading,'zhóu');
  assert.equal(aid.segments('啄木鸟。').find(s=>s.text==='啄').reading,'zhuó');
});

test('从未出现在现有题库中的生字自动注音，不依赖逐题词表',()=>{
  const novel='鹈鹕踌躇，学生看书。';
  const items=aid.segments(novel);
  assert.deepEqual(items.filter(s=>s.reading).map(s=>[s.text,s.reading]),[
    ['鹈','tí'],['鹕','hú'],['踌','chóu'],['躇','chú']
  ]);
  assert.equal(items.map(s=>s.text).join(''),novel);
});

test('现有材料中的狐狸和铃铛统一使用轻声',()=>{
  const html=fs.readFileSync('dist/exercises/grade-2/semester-1/chinese/semantic-blocks.html','utf8');
  const bank=JSON.parse(html.match(/<script id="question-bank"[^>]*>([\s\S]*?)<\/script>/)[1]);
  for(const story of bank)for(const text of story.paragraphs){
    const checked=aid.segments(text,{extraChars:'狸铛'});
    for(const item of checked)if(item.text==='狸')assert.equal(item.reading,'li',story.id+' '+text);
    for(const item of checked)if(item.text==='铛')assert.equal(item.reading,'dang',story.id+' '+text);
  }
});

test('应用题中表示应该的“应”按语境标注 yīng',()=>{
  const {questions}=require('../dist/exercises/grade-2/semester-1/math/math-focus-bank.js');
  const text=[
    questions.find(question=>question.id==='q-006').choices[2].text,
    questions.find(question=>question.id==='q-009').explanation,
    questions.find(question=>question.id==='q-015').prompt,
    '从容应对。'
  ];
  assert.deepEqual(text.map(value=>aid.segments(value).find(item=>item.text==='应')?.reading),
    ['yīng','yīng','yīng','yìng']);
});
