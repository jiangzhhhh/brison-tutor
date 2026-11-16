const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function environment({frame=true,raw='{"version":1,"bankVersion":"1.0"}'}={}) {
  const handlers={},responses=[],values=new Map(raw===null?[]:[['reading-lab-v1',raw]]);
  const storage={get length(){return values.size;},key(i){return [...values.keys()][i]??null;},getItem(k){return values.get(k)??null;},removeItem(k){values.delete(k);}};
  const document={currentScript:{dataset:{exercise:'read-before-answer'}},documentElement:{},getElementById(){return null;}};
  const window={addEventListener(name,fn){(handlers[name]??=[]).push(fn);}};
  const parent=frame?{postMessage(message){responses.push(message);}}:window;
  const context={window,parent,document,localStorage:storage,location:{hash:frame?'#brison-progress=nonce':'',origin:'null'},TextEncoder};
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
  for(const raw of ['broken','{"version":999,"bankVersion":"1.0"}']){
    const e=environment({frame:false,raw});assert.equal(e.window.ProgressBridge.invalidated,true);assert.equal(e.values.get('reading-lab-v1'),raw);
  }
  assert.equal(environment({frame:false}).window.ProgressBridge.invalidated,false);
  assert.equal(environment({frame:false,raw:null}).window.ProgressBridge.invalidated,false);
});
test('both training apps exit management mode before touching question data or saving',()=>{
  const files=['dist/exercises/grade-2/semester-1/math/read-before-answer.html','dist/exercises/grade-2/semester-1/chinese/semantic-blocks.html'];
  for(const file of files){
    const html=fs.readFileSync(file,'utf8');const app=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].find(m=>m[1].includes('id="app"')||m[2].includes('/* 读懂再答:'));
    assert(app);vm.runInNewContext(app[2],{window:{ProgressBridge:{isManagementFrame:true}}});
    assert.match(app[2],/function save\(\)\{\s*if\(window\.ProgressBridge\?\.invalidated/);
  }
});
