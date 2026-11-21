const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
async function setup(failClear=false){
  const nodes={},listeners=new Set(),requests=[];
  const node=id=>nodes[id]??={innerHTML:'',textContent:'',disabled:false,events:{},setAttribute(){},addEventListener(name,fn){this.events[name]=fn;},showModal(){this.open=true;},close(){this.open=false;},focus(){}};
  const document={getElementById:node,createElement(){const frame={contentWindow:{postMessage(data){
    requests.push({src:frame.src,...data});
    queueMicrotask(()=>{const exercise=window.EXERCISES.find(item=>frame.src.startsWith(`${item.path}#`));
      const key=exercise.storage.currentKey;
      const response={channel:data.channel,token:data.token,requestId:data.requestId,rows:data.action==='clear'?[]:[{key,status:'current',schemaVersion:1,bankVersion:1,bytes:100}]};
      if(failClear&&data.action==='clear'&&exercise.id==='semantic-blocks')response.error='blocked';
      for(const listener of [...listeners])listener({source:frame.contentWindow,origin:'https://local.example',data:response});});
  }}};return frame;},body:{append(frame){setImmediate(()=>frame.onload());}}};
  const window={addEventListener(name,fn){listeners.add(fn);},removeEventListener(name,fn){listeners.delete(fn);}};
  const context={window,document,crypto:require('node:crypto').webcrypto,location:{origin:'https://local.example',protocol:'https:'},setTimeout,clearTimeout};
  vm.createContext(context);vm.runInContext(fs.readFileSync('dist/catalog.js','utf8'),context);vm.runInContext(fs.readFileSync('dist/progress-manager.js','utf8'),context);
  await tick();await tick();return{nodes,requests,exercises:window.EXERCISES};
}
test('opening and cancelling the confirmation never clears records',async()=>{
  const {nodes,requests}=await setup();assert.equal(nodes['clear-all'].disabled,false);
  nodes['clear-all'].onclick();assert.equal(nodes.confirmation.open,true);assert.match(nodes['confirm-text'].textContent,/旧版记录/);
  nodes.cancel.onclick();assert.equal(nodes.confirmation.open,false);assert.equal(requests.filter(r=>r.action==='clear').length,0);
});
test('clearing one version sends only the selected key to the selected exercise',async()=>{
  const {nodes,requests}=await setup();
  nodes.records.events.click({target:{closest(){return {dataset:{id:'semantic-blocks',key:'semantic-blocks-v4'}};}}});
  await nodes.confirm.onclick();const clears=requests.filter(r=>r.action==='clear');assert.equal(clears.length,1);assert.deepEqual([...clears[0].keys],['semantic-blocks-v4']);assert.match(clears[0].src,/\/chinese\/semantic-blocks\.html#/);assert.match(nodes.status.textContent,/已清理/);
});
test('clear-all reports partial failure instead of claiming success',async()=>{
  const {nodes,requests,exercises}=await setup(true);nodes['clear-all'].onclick();await nodes.confirm.onclick();
  assert.deepEqual(requests.filter(r=>r.action==='clear').map(r=>r.src.split('#')[0]),[...exercises].map(item=>item.path));
  assert.doesNotMatch(nodes.records.innerHTML,/读懂再答/);
  assert(requests.every(request=>!request.src.includes('read-before-answer')));
  assert.match(nodes.status.textContent,/部分清理失败/);assert.match(nodes.status.textContent,/语义积木/);
});

test('clearing a classified mode identifies the mode and targets only its frame',async()=>{
  const {nodes,requests}=await setup();
  assert.match(nodes.records.innerHTML,/标点应用 · 随机闯关/);
  assert.match(nodes.records.innerHTML,/标点应用 · 分类练习/);
  nodes.records.events.click({target:{closest(){return {dataset:{id:'punctuation-classified'}};}}});
  assert.match(nodes['confirm-text'].textContent,/《标点应用 · 分类练习》/);
  await nodes.confirm.onclick();
  const cleared=requests.filter(request=>request.action==='clear');
  assert.equal(cleared.length,1);
  assert.match(cleared[0].src,/punctuation\.html\?mode=classified#/);
});
