const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('dist/exercises/grade-2/semester-1/math/read-before-answer.html','utf8');
const scripts=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
const bank=JSON.parse(scripts.find(s=>s[1].includes('bank-data'))[2]);
const moduleObject={exports:{}};
vm.runInNewContext(scripts.find(s=>s[2].includes('function scoreQuestion'))[2],{module:moduleObject});
const core=moduleObject.exports;
const key='brison-tutor:progress:read-before-answer:v2';

function app(entries={},options={}){
  const values=new Map(Object.entries(entries)),events={},modalEvents={},confirmations=[];
  const element={innerHTML:'',addEventListener(name,fn){events[name]=fn;},querySelector(){return null;}};
  const modal={innerHTML:'',addEventListener(name,fn){modalEvents[name]=fn;},querySelector(){return null;}};
  const document={body:{style:{}},getElementById(id){return id==='bank-data'?{textContent:JSON.stringify(bank)}:id==='app'?element:id==='modal-root'?modal:{classList:{add(){},remove(){}},addEventListener(){}};},querySelector(){return null;},addEventListener(){}};
  const localStorage={getItem(k){return values.get(k)??null;},setItem(k,v){values.set(k,v);},removeItem(k){values.delete(k);}};
  const window={ReadingCore:core,innerWidth:1000,addEventListener(){},scrollTo(){},confirm(message){confirmations.push(message);return options.confirm??true;}};
  vm.runInNewContext(scripts.find(s=>s[2].includes('/* 读懂再答:'))[2],{window,document,localStorage,requestAnimationFrame(){},setTimeout(){return 0;},clearTimeout(){}});
  const click=(action,data={})=>events.click({target:{closest(selector){return selector==='[data-action]'?{dataset:{action,...data}}:null;}}});
  const importBackup=async data=>{modalEvents.change({target:{id:'import-file',files:[{size:100,text:async()=>JSON.stringify(data)}]}});await new Promise(resolve=>setImmediate(resolve));};
  return {values,click,state:()=>JSON.parse(values.get(key)),element,confirmations,importBackup};
}

test('25题按8类唯一归属，全部为可自由选择的训练题',()=>{
  assert.equal(bank.length,25);
  const categories=core.makePlan(bank);
  assert.equal(categories.length,8);assert.equal(categories.reduce((n,c)=>n+c.size,0),25);
  assert(bank.every(q=>q.mode==='train'&&!Object.hasOwn(q,'round')));
  assert.equal(new Set(bank.map(q=>q.id)).size,25);
});

test('可以直接选后面的题，跨题型切换后两份草稿都保留',()=>{
  const e=app();
  e.click('open-question',{qid:'T55'});e.click('count',{value:'1'});e.click('count-next');
  e.click('open-question',{qid:'X03'});e.click('count',{value:'2'});
  e.click('open-question',{qid:'T55'});
  const s=e.state();assert.equal(s.draft.qid,'T55');assert.equal(s.draft.stage,'evidence');
  assert.equal(s.drafts.X03.countChoice,2);assert.equal(Object.keys(s.drafts).length,2);
  assert.equal(s.records.length,0);
});

test('重练另外留存结果，不覆盖首次记录',()=>{
  const e=app();
  function submit(count){e.click('count',{value:String(count)});e.click('count-next');e.click('evidence-next');e.click('more-no');e.click('submit');}
  e.click('open-question',{qid:'T01'});submit(2);
  const first=JSON.stringify(e.state().records[0]);
  e.click('replay',{qid:'T01'});submit(1);
  const s=e.state();assert.equal(s.records.length,1);assert.equal(s.attempts.length,1);
  assert.equal(JSON.stringify(s.records[0]),first);assert.equal(s.attempts[0].initialCount,1);
  assert.equal(Object.keys(s.drafts).length,0);
});

test('旧90题只迁移仍保留的有效训练记录，原数据不变',()=>{
  assert.equal(typeof core.migrateLegacy,'function');
  const oldBank=JSON.parse(fs.readFileSync('materials/read-before-answer/bank-2.0.json','utf8'));
  const records=['T01','T60'].map(qid=>{const q=oldBank.find(q=>q.id===qid),n=q.targets.filter(t=>t.needed).length;return {id:qid,qid,mode:q.mode,blockId:q.blockId,initialCount:n,finalCount:n,evidence:q.evidence.answers[0],responses:{}};});
  const old={version:1,bankVersion:'2.0',records,closedBlocks:[],draft:null},raw=JSON.stringify(old);
  const migrated=core.migrateLegacy(old,bank);
  assert.deepEqual(Array.from(migrated.records,r=>r.qid),['T01']);
  assert.equal(migrated.bankVersion,'3.0');assert.equal(migrated.records[0].blockId,'complete');
  assert.equal(JSON.stringify(old),raw);
  const e=app({'brison-tutor:progress:read-before-answer:v1':raw});e.click('home');
  assert.equal(e.values.get('brison-tutor:progress:read-before-answer:v1'),raw);
  assert.equal(e.state().records[0].qid,'T01');
});

test('清理当前版本后不会再次迁移已经清理的成绩',()=>{
  const q=bank.find(q=>q.id==='T01'),n=q.targets.filter(t=>t.needed).length;
  const raw=JSON.stringify({version:1,bankVersion:'2.0',records:[{id:'first',qid:q.id,mode:'train',blockId:'r1b1',initialCount:n,finalCount:n,evidence:q.evidence.answers[0],responses:{}}]});
  const e=app({'brison-tutor:progress:read-before-answer:v1':raw});e.click('home');
  assert.equal(e.state().records.length,1);e.values.delete(key);
  const reopened=app(Object.fromEntries(e.values));reopened.click('home');
  assert.equal(reopened.state().records.length,0);
  assert.equal(reopened.values.get('brison-tutor:progress:read-before-answer:v1'),raw);
});

test('空字符串损坏记录也会保留，不能被初始化覆盖',()=>{
  const e=app({[key]:''});e.click('home');
  assert.equal(e.values.get(key),'');assert(e.element.innerHTML.includes('暂停保存'));
});

test('导入备份覆盖损坏记录前必须确认，取消保留原数据',async()=>{
  const raw=JSON.stringify({version:2,bankVersion:'3.0',records:'damaged'});
  const e=app({[key]:raw},{confirm:false});
  await e.importBackup({version:2,bankVersion:'3.0',records:[]});
  assert.equal(e.confirmations.length,1);assert.equal(e.values.get(key),raw);
});

test('旧训练草稿保留已填答案，旧验证题记录不会变成训练成绩',()=>{
  const draft={qid:'T01',stage:'answer',countChoice:2,initialCount:2,finalCount:2,evidence:['s1','s2'],responses:{t1:{p1:'o1'}},buffers:{t1:{p1:'o1'}},currentTarget:'t1',currentValues:{p1:'o1'},toolsUsed:[],links:[],checkHistory:[],assistOpen:false};
  const old={version:1,bankVersion:'2.0',records:[{id:'v',qid:'V15',mode:'validation',blockId:'r3b4',responses:{}}],draft};
  const migrated=core.migrateLegacy(old,bank);
  assert.equal(migrated.records.length,0);assert.equal(migrated.drafts.T01.responses.t1.p1,'o1');
  assert.equal(migrated.draft.qid,'T01');assert.equal(migrated.selectedCategory,'complete');
});
