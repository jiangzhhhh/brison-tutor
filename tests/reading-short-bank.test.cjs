const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('dist/exercises/grade-2/semester-1/math/read-before-answer.html','utf8');
const scripts=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
const bank=JSON.parse(scripts.find(s=>s[1].includes('bank-data'))[2]);
const oldBank=JSON.parse(fs.readFileSync('materials/read-before-answer/bank-1.0.json','utf8'));
const passages=JSON.parse(fs.readFileSync('materials/read-before-answer/short-passages.json','utf8'));
const moduleObject={exports:{}};
vm.runInNewContext(scripts.find(s=>s[2].includes('function scoreQuestion'))[2],{module:moduleObject});
const core=moduleObject.exports;
const currentKey='brison-tutor:progress:read-before-answer:v2';

test('selected 25 passages retain their short text, questions and answer keys',()=>{
  assert.equal(bank.length,25);
  assert.equal(Object.keys(passages).length,90);
  for(const q of bank){
    const before=oldBank.find(x=>x.id===q.id);
    assert.deepEqual(q.passage.map(s=>s.text),passages[q.id][0],q.id);
    assert(sumLength(q)<=90,q.id+' 篇幅过长');
    for(const key of ['question','targets','skills','taskSpans'])
      assert.deepEqual(q[key],before[key],q.id+' '+key);
  }
  assert(bank.reduce((n,q)=>n+sumLength(q),0)<oldBank.filter(q=>bank.some(selected=>selected.id===q.id)).reduce((n,q)=>n+sumLength(q),0)*0.35);
});
function sumLength(q){return q.passage.reduce((n,s)=>n+[...s.text].length,0);}

test('evidence references and pronoun annotations point into the rewritten text',()=>{
  for(const q of bank){
    const sentences=new Map(q.passage.map(s=>[s.id,s.text]));
    assert.deepEqual(q.evidence.answers[0],passages[q.id][1].map(i=>'s'+i),q.id);
    for(const variant of q.evidence.answers)for(const id of variant)assert(sentences.has(id),q.id+' '+id);
    for(const t of q.tokens)assert.equal(sentences.get(t.sid)?.slice(t.start,t.end),t.text,q.id+' '+t.id);
    for(const t of q.tokens)for(const other of q.tokens)if(t.id!==other.id&&t.sid===other.sid)
      assert(t.start>=other.end||t.end<=other.start,q.id+' 标注互相遮挡');
    const ids=new Set(q.tokens.map(t=>t.id));
    for(const edge of q.referenceEdges)for(const id of edge)assert(ids.has(id),q.id+' '+id);
    if(oldBank.find(x=>x.id===q.id).tokens.length)assert(q.referenceEdges.length>0,q.id+' 丢失指代工具');
  }
  assert(bank.find(q=>q.id==='T02').passage[0].text.includes('小宁接过后翻看'));
  const archive=JSON.parse(fs.readFileSync('materials/read-before-answer/bank-2.0.json','utf8'));
  assert.equal(archive.length,90);
  assert(archive.find(q=>q.id==='T51').passage.some(s=>s.text.includes('他们检查完书页后')));
  assert.equal(archive.find(q=>q.id==='X10').passage.map(s=>s.text).join('').match(/露脚趾的凉鞋/g).length,2);
});

test('the short edition accepts its own records and rejects older or unknown banks',()=>{
  assert.equal(core.validateImportedState({version:2,bankVersion:'3.0',records:[]},bank).bankVersion,'3.0');
  for(const bankVersion of ['1.0','2.0','99.0',undefined])
    assert.throws(()=>core.validateImportedState({version:2,bankVersion,records:[]},bank),/题库版本/);
  for(const q of bank){
    const count=q.targets.filter(t=>t.needed).length;
    const record={qid:q.id,mode:q.mode,blockId:q.blockId,initialCount:count,finalCount:count,
      evidence:q.evidence.answers[0],responses:Object.fromEntries(q.targets.filter(t=>t.needed).map(t=>
        [t.id,Object.fromEntries(t.steps.map(s=>[s.id,s.answer]))]))};
    assert(core.scoreQuestion(q,record).allCorrect,q.id);
    if(q.mode==='train'){
      assert(core.scoreQuestion(q,{...record,evidence:q.evidence.allowed}).allCorrect,q.id+' 允许补充条件');
      assert.equal(core.scoreQuestion(q,{...record,evidence:record.evidence.slice(1)}).evidenceCorrect,false,q.id+' 漏选核心依据');
      const unrelated=q.passage.find(s=>!q.evidence.allowed.includes(s.id));
      if(unrelated)assert.equal(core.scoreQuestion(q,{...record,evidence:[...record.evidence,unrelated.id]}).evidenceCorrect,false,q.id+' 误选背景');
    }
  }
});

test('progress management keeps the long edition separate from the short edition',()=>{
  const window={};
  for(const f of ['catalog.js','progress-store.js'])vm.runInNewContext(fs.readFileSync('dist/'+f,'utf8'),{window,TextEncoder});
  const config=window.EXERCISES.find(x=>x.id==='read-before-answer');
  assert.equal(config.storage.currentKey,currentKey);
  const entries=new Map([['reading-lab-v1','{"version":1,"bankVersion":"1.0","records":[]}'],
    [currentKey,'{"version":2,"bankVersion":"3.0","records":[]}'],['semantic-blocks-v4','keep']]);
  const storage={get length(){return entries.size;},key(i){return [...entries.keys()][i]},getItem(k){return entries.get(k)??null;},removeItem(k){entries.delete(k);}};
  const rows=window.ProgressStore.list(storage,config);
  assert.equal(rows.find(r=>r.key==='reading-lab-v1').status,'legacy');
  assert.equal(rows.find(r=>r.key===currentKey).status,'current');
  window.ProgressStore.clear(storage,config,[currentKey]);
  assert(entries.has('reading-lab-v1'));assert(entries.has('semantic-blocks-v4'));
});

test('opening the short edition preserves old progress and never resumes an old draft',()=>{
  const raw=JSON.stringify({version:1,bankVersion:'1.0',records:[],closedBlocks:[],draft:{qid:'T01',stage:'evidence'}});
  const values=new Map([['reading-lab-v1',raw]]),listeners={};
  const app={innerHTML:'',addEventListener(name,fn){listeners[name]=fn;}};
  const document={getElementById(id){return id==='bank-data'?{textContent:JSON.stringify(bank)}:id==='app'?app:{addEventListener(){}};},addEventListener(){}};
  const localStorage={getItem(k){return values.get(k)??null;},setItem(k,v){values.set(k,v);},removeItem(k){values.delete(k);}};
  const window={ReadingCore:core,addEventListener(){},scrollTo(){}};
  vm.runInNewContext(scripts.find(s=>s[2].includes('/* 读懂再答:'))[2],{window,document,localStorage});
  assert.equal(values.get('reading-lab-v1'),raw);
  listeners.click({target:{closest(selector){return selector==='[data-action]'?{dataset:{action:'home'}}:null;}}});
  assert(values.has(currentKey));
  const fresh=JSON.parse(values.get(currentKey));
  assert.equal(fresh.bankVersion,'3.0');assert.equal(fresh.records.length,0);assert.equal(fresh.draft,null);
  assert.equal(values.get('reading-lab-v1'),raw);
});
