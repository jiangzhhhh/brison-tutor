const {test}=require('node:test');
const assert=require('node:assert/strict');
const model=require('../dist/exercises/grade-2/semester-1/math/math-focus-model.js');
const bank=require('../dist/exercises/grade-2/semester-1/math/math-focus-bank.js');
const stamp='2026-11-17T01:00:00.000Z';
function storage(raw=null){
  const values=new Map(raw===null?[]:[[model.KEY,raw]]);
  return {values,get length(){return values.size;},key(i){return [...values.keys()][i]??null;},getItem(k){return values.get(k)??null;},setItem(k,v){values.set(k,v);}};
}
function open(id='unit-price'){return model.openRound(model.initial(),id,stamp);}
function choose(state,qid,choice){return model.choose(state,qid,choice);}
function complete(state){
  const round=bank.rounds.find(r=>r.id===state.roundId);
  for(const qid of round.questionIds){
    state=model.goTo(state,qid);
    state=choose(state,qid,bank.questions.find(q=>q.id===qid).answer);
    if(model.isImmediate(round.id,qid))state=model.submitCurrent(state,stamp);
  }
  return model.submitRound(state,stamp);
}
test('draft choice and current question survive persistence without grading',()=>{
  let state=choose(open(),'q-001','B');state=model.goTo(state,'q-002');
  const s=storage(),p=model.persistence(s,{invalidated:false});p.load();
  assert.equal(p.save(state,stamp),true);
  const restored=model.persistence(s,{}).load();
  assert.equal(restored.state.currentQuestionId,'q-002');
  assert.equal(model.attempt(restored.state).answers['q-001'],'B');
  assert.equal(Object.keys(model.attempt(restored.state).results).length,0);
});
test('mixed round withholds grading until group submission and requires every answer',()=>{
  let state=choose(open('mixed'),'q-025','B');
  assert.equal(model.isImmediate('mixed','q-025'),false);
  assert.throws(()=>model.submitCurrent(state,stamp));
  assert.throws(()=>model.submitRound(state,stamp));
  assert.equal(Object.keys(model.attempt(state).results).length,0);
  state=complete(state);
  assert.equal(state.route,'summary');
  assert.equal(model.score(model.attempt(state)).correct,6);
});
test('first two guided answers lock on submit; the rest wait for group submission',()=>{
  let state=model.submitCurrent(choose(open(),'q-001','A'),stamp);
  assert.equal(model.attempt(state).results['q-001'].correct,false);
  assert.throws(()=>choose(state,'q-001','B'));
  assert.equal(model.isImmediate('unit-price','q-003'),false);
  assert.throws(()=>model.goTo(state,'q-025'));
});
test('retry retains first result, old completed attempt and other rounds',()=>{
  let state=model.submitCurrent(choose(open(),'q-001','A'),stamp);
  // Preserve the submitted incorrect answer while completing the remaining questions.
  for(const qid of bank.rounds[0].questionIds.slice(1)){
    state=model.goTo(state,qid);state=choose(state,qid,bank.questions.find(q=>q.id===qid).answer);
    if(model.isImmediate('unit-price',qid))state=model.submitCurrent(state,stamp);
  }
  state=model.submitRound(state,stamp);
  const old=JSON.stringify(model.attempt(state));
  state=model.openRound(state,'unit-price',stamp,true);
  assert.equal(state.rounds['unit-price'].attempts.length,2);
  assert.equal(JSON.stringify(state.rounds['unit-price'].attempts[0]),old);
  assert.equal(model.firstResults(state)['q-001'].correct,false);
  assert.equal(Object.keys(model.attempt(state).answers).length,0);
});
test('damaged, incompatible and semantically invalid records remain untouched',()=>{
  const good={exerciseId:'math-focus',schemaVersion:1,bankVersion:bank.version,updatedAt:stamp,data:open()};
  const wrong=JSON.parse(JSON.stringify(good));wrong.data.currentQuestionId='q-025';
  const badResult=JSON.parse(JSON.stringify(good));badResult.data.rounds['unit-price'].attempts[0].answers['q-001']='A';
  badResult.data.rounds['unit-price'].attempts[0].results['q-001']={choice:'A',correct:true,submittedAt:stamp};
  for(const raw of ['broken',JSON.stringify({...good,schemaVersion:99}),JSON.stringify({...good,exerciseId:'other'}),JSON.stringify(wrong),JSON.stringify(badResult)]){
    const s=storage(raw),p=model.persistence(s,{}),loaded=p.load();
    assert.match(loaded.error,/无法恢复上次进度/);
    assert.equal(p.save(model.initial(),stamp),false);
    assert.equal(s.values.get(model.KEY),raw);
  }
});
test('a compatible older bank is backed up and validated before upgrading',()=>{
  const state=open();
  const old={exerciseId:'math-focus',schemaVersion:1,bankVersion:'2026-11-16.1',updatedAt:stamp,data:state};
  const raw=JSON.stringify(old),s=storage(raw),p=model.persistence(s,{}),loaded=p.load();
  assert.equal(loaded.error,'');assert.equal(loaded.migrated,true);
  assert.equal(s.values.get(model.KEY+':backup:2026-11-16.1'),raw);
  assert.equal(JSON.parse(s.values.get(model.KEY)).bankVersion,bank.version);
  assert.equal(model.attempt(loaded.state).id,model.attempt(state).id);
});
test('the 34-question edition keeps submitted answers and drafts when the application topics are added',()=>{
  let state=model.submitCurrent(choose(open(),'q-001','B'),stamp);
  state=choose(model.goTo(state,'q-002'),'q-002','A');
  state.revisions=Object.fromEntries(Object.entries(state.revisions).filter(([id])=>!id.startsWith('wp-')));
  const raw=JSON.stringify({exerciseId:model.ID,schemaVersion:1,bankVersion:'2026-11-17.1',updatedAt:stamp,data:state});
  const s=storage(raw),loaded=model.persistence(s).load();
  assert.equal(loaded.migrated,true);
  assert.equal(s.values.get(model.KEY+':backup:2026-11-17.1'),raw);
  assert.equal(loaded.state.currentQuestionId,'q-002');
  assert.equal(model.attempt(loaded.state).results['q-001'].correct,true);
  assert.equal(model.attempt(loaded.state).answers['q-002'],'A');
  const next=model.openRound(loaded.state,'wp-minimum',stamp);
  assert.equal(model.validate(next),true);
  assert.equal(model.firstResults(next)['q-001'].correct,true);
});
test('content revision mismatch and future bank block overwrite, additive old progress remains usable',()=>{
  const state=open();state.revisions['q-001']='changed';
  const envelope={exerciseId:'math-focus',schemaVersion:1,bankVersion:bank.version,updatedAt:stamp,data:state};
  for(const payload of [envelope,{...envelope,data:open(),bankVersion:'2099.1'}]){
    const raw=JSON.stringify(payload),s=storage(raw),p=model.persistence(s,{});
    assert.match(p.load().error,/无法恢复上次进度/);assert.equal(p.save(open(),stamp),false);assert.equal(s.values.get(model.KEY),raw);
  }
});
test('failed read, failed write and external invalidation never report success',()=>{
  const errors=[];
  const denied=model.persistence({getItem(){throw Error('denied');}},{},e=>errors.push(e));
  assert.match(denied.load().error,/无法读取/);assert.equal(denied.save(open(),stamp),false);
  const s=storage();s.setItem=()=>{throw Error('quota');};
  const p=model.persistence(s,{},e=>errors.push(e));p.load();
  assert.equal(p.save(open(),stamp),false);assert.equal(s.values.size,0);assert.match(errors.at(-1),/保存失败/);
  const normal=storage(),bridge={invalidated:false},p2=model.persistence(normal,bridge,e=>errors.push(e));p2.load();bridge.invalidated=true;
  assert.equal(p2.save(open(),stamp),false);assert.equal(normal.values.size,0);
});
test('a concurrently changed record is never overwritten by stale memory',()=>{
  const s=storage(),p=model.persistence(s,{});p.load();s.values.set(model.KEY,'external');
  assert.equal(p.save(open(),stamp),false);assert.equal(s.values.get(model.KEY),'external');
});
test('old schema keys are preserved and do not silently become an empty current record',()=>{
  const s=storage();s.values.set('brison-tutor:progress:math-focus:v99','future');
  const p=model.persistence(s,{});assert.match(p.load().error,/无法恢复上次进度/);
  assert.equal(p.save(open(),stamp),false);assert.equal(s.values.size,1);
});
test('management mode exits before loading storage or rendering questions',()=>{
  const fs=require('node:fs'),vm=require('node:vm');
  vm.runInNewContext(fs.readFileSync('dist/exercises/grade-2/semester-1/math/math-focus.js','utf8'),{window:{ProgressBridge:{isManagementFrame:true}}});
});
test('returning to a round resumes the current draft question',()=>{
  let state=model.goTo(open(),'q-005');state=choose(state,'q-005','A');state.route='home';
  state=model.openRound(state,'unit-price',stamp);
  assert.equal(state.currentQuestionId,'q-005');
  assert.equal(model.attempt(state).answers['q-005'],'A');
});
test('switching rounds preserves each rounds current position',()=>{
  let state=open();
  for(const qid of ['q-001','q-002']){
    state=model.goTo(state,qid);state=choose(state,qid,'A');state=model.submitCurrent(state,stamp);
  }
  for(const qid of ['q-003','q-004']){state=model.goTo(state,qid);state=choose(state,qid,'A');}
  state=model.goTo(state,'q-005');
  state=model.openRound(state,'groups',stamp);state=model.goTo(state,'q-008');
  state=model.openRound(state,'unit-price',stamp);
  assert.equal(state.currentQuestionId,'q-005');
  state=model.openRound(state,'groups',stamp);assert.equal(state.currentQuestionId,'q-008');
});
test('missing answer choices and partial group grading are damaged rather than submitted results',()=>{
  const noAnswer=open('mixed');
  model.attempt(noAnswer).results['q-025']={correct:false,submittedAt:stamp};
  const partial=choose(open('mixed'),'q-025','A');
  model.attempt(partial).results['q-025']={choice:'A',correct:false,submittedAt:stamp};
  for(const state of [noAnswer,partial]){
    const raw=JSON.stringify({exerciseId:'math-focus',schemaVersion:1,bankVersion:bank.version,updatedAt:stamp,data:state});
    assert.equal(model.isValidRecord(raw),false);
    const s=storage(raw),p=model.persistence(s,{});assert.match(p.load().error,/无法恢复上次进度/);assert.equal(p.save(open(),stamp),false);assert.equal(s.values.get(model.KEY),raw);
  }
});
