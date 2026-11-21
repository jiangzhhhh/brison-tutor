const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const semanticKey='semantic-blocks-v4';
function environment({frame=true,raw='{"version":4,"bankVersion":4}',exercise='semantic-blocks',validateProgress,classifiedExercise,search='',entries}={}) {
  const key=exercise==='math-focus'?'brison-tutor:progress:math-focus:v1':semanticKey;
  const handlers={},responses=[],values=new Map(entries??(raw===null?[]:[[key,raw]]));
  const storage={get length(){return values.size;},key(i){return [...values.keys()][i]??null;},getItem(k){return values.get(k)??null;},removeItem(k){values.delete(k);}};
  const document={currentScript:{dataset:{exercise,validateProgress,classifiedExercise}},documentElement:{},getElementById(){return null;}};
  const window={addEventListener(name,fn){(handlers[name]??=[]).push(fn);}};
  const parent=frame?{postMessage(message){responses.push(message);}}:window;
  const context={window,parent,document,localStorage:storage,location:{hash:frame?'#brison-progress=nonce':'',origin:'null',search},TextEncoder,URLSearchParams};
  vm.createContext(context);
  for(const name of ['catalog.js','progress-store.js','progress-bridge.js'])vm.runInContext(fs.readFileSync('dist/'+name,'utf8'),context);
  return {context,window,parent,handlers,responses,values};
}
test('management request lists and clears in exercise storage without rewriting progress',()=>{
  const e=environment();assert.equal(e.window.ProgressBridge.isManagementFrame,true);assert.equal(e.values.size,1);
  const receive=e.handlers.message[0];const data={channel:'brison-progress',token:'nonce',requestId:7,action:'list'};
  receive({source:e.parent,origin:'null',data});assert.equal(e.responses[0].rows.length,1);assert.equal(e.values.size,1);
  receive({source:e.parent,origin:'null',data:{...data,action:'clear'}});assert.equal(e.values.size,0);assert.equal(e.responses[1].rows.length,0);
});
test('forged source, origin and token cannot delete progress',()=>{
  const e=environment(),receive=e.handlers.message[0];const data={channel:'brison-progress',token:'nonce',action:'clear'};
  receive({source:{},origin:'null',data});receive({source:e.parent,origin:'https://other.example',data});receive({source:e.parent,origin:'null',data:{...data,token:'wrong'}});
  assert.equal(e.values.size,1);assert.equal(e.responses.length,0);
});
test('corrupt and incompatible progress blocks writes without deleting the old value',()=>{
  for(const raw of ['broken','{"version":999,"bankVersion":4}','{"version":4,"bankVersion":3}']){
    const e=environment({frame:false,raw});assert.equal(e.window.ProgressBridge.invalidated,true);assert.equal(e.values.get(semanticKey),raw);
  }
  assert.equal(environment({frame:false}).window.ProgressBridge.invalidated,false);
  assert.equal(environment({frame:false,raw:null}).window.ProgressBridge.invalidated,false);
});
test('semantic blocks exits management mode before touching question data or saving',()=>{
  const html=fs.readFileSync('dist/exercises/grade-2/semester-1/chinese/semantic-blocks.html','utf8');
  const app=html.match(/<script id="app">([\s\S]*?)<\/script>/);
  assert(app);vm.runInNewContext(app[1],{window:{ProgressBridge:{isManagementFrame:true}}});
  assert.match(app[1],/function save\(\)\{\s*if\(window\.ProgressBridge\?\.invalidated/);
});
test('new exercise opts in to its own strict bank validation without weakening legacy protection',()=>{
  const raw=JSON.stringify({exerciseId:'math-focus',schemaVersion:1,bankVersion:'2026-11-16.1',data:{}});
  const e=environment({frame:false,raw,exercise:'math-focus',validateProgress:'app'});
  assert.equal(e.window.ProgressBridge.invalidated,false);
  assert.equal(e.values.get('brison-tutor:progress:math-focus:v1'),raw);
  const strict=environment({frame:false,raw,exercise:'math-focus'});
  assert.equal(strict.window.ProgressBridge.invalidated,true);
});
test('management lists semantically damaged progress using the exercise validator without writing',()=>{
  const e=environment();e.window.ProgressBridge.validateCurrent=()=>false;
  const before=JSON.stringify([...e.values]);
  e.handlers.message[0]({source:e.parent,origin:'null',data:{channel:'brison-progress',token:'nonce',requestId:8,action:'list'}});
  assert.equal(e.responses[0].rows[0].status,'damaged');
  assert.equal(JSON.stringify([...e.values]),before);
});

test('a classified management frame only manages its own records',()=>{
  const randomKey='brison-tutor:progress:punctuation:v3';
  const classKey='brison-tutor:progress:punctuation-classified:v2';
  const e=environment({exercise:'punctuation',classifiedExercise:'punctuation-classified',search:'?mode=classified',
    entries:[[randomKey,'{}'],[classKey,'{}']]});
  assert.equal(e.window.ProgressBridge.exerciseId,'punctuation-classified');
  const receive=e.handlers.message[0];
  const data={channel:'brison-progress',token:'nonce',requestId:9,action:'list'};
  receive({source:e.parent,origin:'null',data});
  assert.deepEqual(Array.from(e.responses[0].rows,row=>row.key),[classKey]);
  receive({source:e.parent,origin:'null',data:{...data,action:'clear'}});
  assert.deepEqual([...e.values.keys()],[randomKey]);
});
