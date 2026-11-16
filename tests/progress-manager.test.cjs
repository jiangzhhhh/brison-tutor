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
    queueMicrotask(()=>{const response={channel:data.channel,token:data.token,requestId:data.requestId,rows:data.action==='clear'?[]:[{key:frame.src.includes('/math/')?'reading-lab-v1':'semantic-blocks-v4',status:'current',schemaVersion:1,bankVersion:1,bytes:100}]};
      if(failClear&&data.action==='clear'&&frame.src.includes('/chinese/'))response.error='blocked';
      for(const listener of [...listeners])listener({source:frame.contentWindow,origin:'https://local.example',data:response});});
  }}};return frame;},body:{append(frame){setImmediate(()=>frame.onload());}}};
  const window={addEventListener(name,fn){listeners.add(fn);},removeEventListener(name,fn){listeners.delete(fn);}};
  const context={window,document,crypto:require('node:crypto').webcrypto,location:{origin:'https://local.example',protocol:'https:'},setTimeout,clearTimeout};
  vm.createContext(context);vm.runInContext(fs.readFileSync('dist/catalog.js','utf8'),context);vm.runInContext(fs.readFileSync('dist/progress-manager.js','utf8'),context);
  await tick();await tick();return{nodes,requests};
}
test('opening and cancelling the confirmation never clears records',async()=>{
  const {nodes,requests}=await setup();assert.equal(nodes['clear-all'].disabled,false);
  nodes['clear-all'].onclick();assert.equal(nodes.confirmation.open,true);assert.match(nodes['confirm-text'].textContent,/旧版记录/);
  nodes.cancel.onclick();assert.equal(nodes.confirmation.open,false);assert.equal(requests.filter(r=>r.action==='clear').length,0);
});
test('clearing one version sends only the selected key to the selected exercise',async()=>{
  const {nodes,requests}=await setup();
  nodes.records.events.click({target:{closest(){return {dataset:{id:'read-before-answer',key:'reading-lab-v1'}};}}});
  await nodes.confirm.onclick();const clears=requests.filter(r=>r.action==='clear');assert.equal(clears.length,1);assert.deepEqual([...clears[0].keys],['reading-lab-v1']);assert.match(clears[0].src,/\/math\//);assert.match(nodes.status.textContent,/已清理/);
});
test('clear-all reports partial failure instead of claiming success',async()=>{
  const {nodes,requests}=await setup(true);nodes['clear-all'].onclick();await nodes.confirm.onclick();assert.equal(requests.filter(r=>r.action==='clear').length,2);assert.match(nodes.status.textContent,/部分清理失败/);assert.match(nodes.status.textContent,/语义积木/);
});
