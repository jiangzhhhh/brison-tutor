const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const bank=require('../dist/exercises/grade-2/semester-1/math/math-focus-bank.js');
const model=require('../dist/exercises/grade-2/semester-1/math/math-focus-model.js');
function memory(raw){
  const values=new Map(raw?[[model.KEY,raw]]:[]);
  return {values,get length(){return values.size;},key(i){return [...values.keys()][i]??null;},getItem(k){return values.get(k)??null;},setItem(k,v){values.set(k,v);}};
}
// Event-boundary integration harness; layout and native keyboard behavior still require a browser.
function page(storage){
  const nodes={};
  const node=id=>nodes[id]??={innerHTML:'',textContent:'',hidden:true,disabled:false,events:{},setAttribute(){},focus(){},addEventListener(type,fn){this.events[type]=fn;}};
  const document={getElementById:node,querySelector(){return node('heading');}};
  const window={localStorage:storage,MathFocusBank:bank,MathFocusModel:model,ProgressBridge:{invalidated:false}};
  vm.runInNewContext(fs.readFileSync('dist/exercises/grade-2/semester-1/math/math-focus.js','utf8'),{window,document,Date});
  return {nodes,click(action,question){node('app').events.click({target:{closest(){return {dataset:{action,question},disabled:false};}}});},choose(value){node('app').events.change({target:{name:'answer',value}});}};
}
test('分类练习可任选题，刷新恢复草稿，提交后留在原题',()=>{
  const storage=memory();let p=page(storage);
  const answer=bank.questions.find(q=>q.id==='wp-maximum-1').answer;
  assert.equal(p.nodes.app.innerHTML.match(/data-question=/g).length,30);
  assert.doesNotMatch(p.nodes.app.innerHTML,/阶段卷错题练习|方向短练/);
  p.click('open','wp-maximum-1');p.choose(answer);
  p.click('home');p.click('open','wp-minimum-1');p.choose('A');
  p.click('home');p.click('open','wp-maximum-1');
  p=page(storage);
  assert.match(p.nodes.app.innerHTML,new RegExp(`value="${answer}" checked`));
  assert.doesNotMatch(p.nodes.app.innerHTML,/正确答案|回答正确|回答错误/);
  p.click('submit');
  assert.match(p.nodes.app.innerHTML,/回答正确/);
  assert.match(p.nodes.app.innerHTML,/返回题目列表/);
  const recorded=JSON.parse(storage.values.get(model.KEY)).data.practice.questions;
  assert.equal(recorded['wp-minimum-1'].draft,'A');
  assert.equal(recorded['wp-maximum-1'].attempts.length,1);
  p.click('retry');
  assert.doesNotMatch(p.nodes.app.innerHTML,/回答正确/);
  assert.equal(JSON.parse(storage.values.get(model.KEY)).data.practice.questions['wp-maximum-1'].attempts.length,1);
});
test('a corrupt record stays untouched and its preservation warning survives starting practice',()=>{
  const storage=memory('broken'),p=page(storage);
  assert.match(p.nodes['storage-error'].innerHTML,/无法恢复上次进度/);
  p.click('open','wp-minimum-1');p.choose('B');
  assert.match(p.nodes['storage-error'].innerHTML,/无法恢复上次进度/);
  assert.equal(p.nodes.saved.textContent,'');
  assert.equal(storage.values.get(model.KEY),'broken');
});
test('分类列表按题型展示题目',()=>{
  const p=page(memory());
  const topics=['最少需求','最多可买','倒推原数','错算还原','多条件约束','周期定位','状态追踪','对象筛选','嵌套数量','问题焦点'];
  for(const topic of topics)assert.match(p.nodes.app.innerHTML,new RegExp(topic));
});
test('旧阶段卷错题不会自动开题或计入进度，后续作答保留旧记录',()=>{
  const stamp='2026-11-21T08:00:00.000Z';
  let old=model.openRound(model.initial(),'unit-price',stamp);
  old=model.submitCurrent(model.choose(old,'q-001','B'),stamp);
  old=model.chooseQuestion(model.selectQuestion(old,'wp-minimum-1'),'B');
  old=model.selectQuestion(model.submitQuestion(old,stamp),'q-025');
  old=model.chooseQuestion(old,'A');
  const raw=JSON.stringify({exerciseId:model.ID,schemaVersion:model.SCHEMA,bankVersion:bank.version,updatedAt:stamp,data:old});
  const storage=memory(raw);
  const p=page(storage);
  assert.match(p.nodes.app.innerHTML,/题目列表/);
  assert.equal(p.nodes.overall.textContent,'已提交 1 / 30 题');
  assert.equal(storage.values.get(model.KEY),raw);
  p.click('open','q-025');
  assert.match(p.nodes.app.innerHTML,/题目列表/);
  p.click('open','wp-minimum-1');
  assert.match(p.nodes.app.innerHTML,/回答正确/);
  const saved=JSON.parse(storage.values.get(model.KEY)).data;
  assert.deepEqual(saved.rounds,old.rounds);
  assert.deepEqual(saved.practice.questions,old.practice.questions);
});
test('HTML bank keeps archived questions, answer choices, explanations and local assets',()=>{
  const path=require('node:path');
  const folder='dist/exercises/grade-2/semester-1/math';
  const paper=fs.readFileSync('materials/grade-2/semester-1/math/2026-11-16-midterm-review/answers.md','utf8');
  const expected=new Map([...paper.matchAll(/^\| (\d+|方\d) \| ([ABC]) \| (.+) \|$/gm)].map(m=>[m[1],{answer:m[2],explanation:m[3]}]));
  assert.equal(bank.questions.length,64);assert.equal(new Set(bank.questions.map(q=>q.id)).size,64);
  assert.deepEqual(bank.rounds.slice(0,6).map(r=>r.questionIds.length),[6,6,6,6,6,4]);
  for(const q of bank.questions.filter(q=>q.sourceNumber)){assert.equal(q.answer,expected.get(q.sourceNumber).answer);assert.equal(q.explanation,expected.get(q.sourceNumber).explanation);assert(q.choices.some(c=>c.id===q.answer));}
  const html=fs.readFileSync(folder+'/math-focus.html','utf8');
  for(const m of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g))assert(fs.existsSync(path.resolve(folder,m[1].replaceAll('&amp;','&'))),m[1]);
});

test('书架通过主入口打开分类练习，搜索子练习仍找到主入口',()=>{
  const window={};
  vm.runInNewContext(fs.readFileSync('dist/catalog.js','utf8'),{window});
  const index=fs.readFileSync('dist/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
  function results(query='',subject='math'){
    const nodes={};
    const document={addEventListener(){},getElementById(id){return nodes[id]??={innerHTML:'',textContent:'',addEventListener(){}};}};
    const hash='#grade=2&semester=1&subject='+subject+'&q='+encodeURIComponent(query);
    vm.runInNewContext(index,{window,document,location:{hash},URLSearchParams});
    return nodes.results.innerHTML;
  }
  const links=results();
  assert.doesNotMatch(links,/阶段卷错题/);
  assert.match(links,/href="exercises\/grade-2\/semester-1\/math\/math-focus.html"/);
  assert.match(links,/href="exercises\/grade-2\/semester-1\/math\/arithmetic.html\?mode=classified"/);
  assert.doesNotMatch(links,/href="[^"]*math-streak.html"/);
  assert.match(results('应用题随机闯关'),/打开练习：应用题分类练习/);
  assert(window.EXERCISES.some(item=>item.id==='math-streak'));
  const semantic=window.EXERCISES.find(item=>item.id==='semantic-blocks');
  assert.equal(semantic.storage.currentKey,'semantic-blocks-v4');
  assert.match(results('','chinese'),/打开练习：中文阅读专项/);
  assert.match(results('','chinese'),/打开练习：语义积木/);
  assert.match(results('语义积木','chinese'),/href="[^"]*semantic-blocks.html"/);
  assert.doesNotMatch(results('语义积木','chinese'),/打开练习：中文阅读专项/);
  assert.match(results('中文阅读闯关','chinese'),/href="[^"]*reading-quest.html\?mode=classified"/);
});
