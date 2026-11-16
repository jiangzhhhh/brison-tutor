(() => {
  'use strict';
  const $=id=>document.getElementById(id), clients=new Map(), snapshots=new Map();
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels={current:'当前版本',legacy:'保留的旧版记录',damaged:'无法解析的记录',incompatible:'与当前版本不兼容'};
  let sequence=0,busy=false,pending=null;
  function client(exercise){
    if(clients.has(exercise.id)) return clients.get(exercise.id);
    const token=Array.from(crypto.getRandomValues(new Uint32Array(4))).join('-');
    const frame=document.createElement('iframe');frame.title=`${exercise.title}进度读取`;frame.src=`${exercise.path}#brison-progress=${token}`;
    const ready=new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('练习页面加载超时，请检查文件是否完整。')),8000);frame.onload=()=>{clearTimeout(timeout);resolve();};frame.onerror=()=>{clearTimeout(timeout);reject(new Error('练习页面未能加载。'));};});
    // Avoid an unhandled rejection before the first request begins waiting.
    ready.catch(()=>{});document.body.append(frame);
    const value={frame,token,ready};clients.set(exercise.id,value);return value;
  }
  async function request(exercise,action,keys){
    const c=client(exercise);await c.ready;const requestId=++sequence;
    return new Promise((resolve,reject)=>{
      const cleanup=()=>{clearTimeout(timeout);window.removeEventListener('message',receive);};
      const receive=event=>{
        const d=event.data;
        if(event.origin!==(location.protocol==='file:'?'null':location.origin)||event.source!==c.frame.contentWindow||d?.channel!=='brison-progress'||d.token!==c.token||d.requestId!==requestId) return;
        cleanup();d.error?reject(new Error(d.error)):resolve(d.rows);
      };
      const timeout=setTimeout(()=>{cleanup();reject(new Error('浏览器未允许读取进度。请在练习内管理记录，或使用同一地址打开项目。'));},8000);
      window.addEventListener('message',receive);c.frame.contentWindow.postMessage({channel:'brison-progress',token:c.token,requestId,action,keys},'*');
    });
  }
  function render(){
    $('records').setAttribute('aria-busy',String(busy));
    $('records').innerHTML=window.EXERCISES.map(exercise=>{
      const value=snapshots.get(exercise.id);
      const body=!value?'<p>正在读取…</p>':value.error?`<p class="error">${escape(value.error)}</p>`:value.rows.length?value.rows.map(row=>`<div class="version"><div><strong>${labels[row.status]}</strong><p>数据版本 ${escape(row.schemaVersion??'未知')} · 题库版本 ${escape(row.bankVersion??'未知')} · ${Math.max(1,Math.ceil(row.bytes/1024))} KB</p><p>${escape(row.key)}</p></div><button class="secondary" type="button" data-id="${escape(exercise.id)}" data-key="${escape(row.key)}" ${busy?'disabled':''}>清理此记录…</button></div>`).join(''):'<p class="empty">没有已保存的进度。</p>';
      return `<article class="card"><div class="row"><h2>${escape(exercise.title)}</h2><button class="danger" type="button" data-id="${escape(exercise.id)}" ${busy||!value?.rows?.length?'disabled':''}>清理此练习进度…</button></div>${body}</article>`;
    }).join('');
    $('refresh').disabled=busy;
    $('clear-all').disabled=busy||![...snapshots.values()].some(value=>value.rows?.length);
  }
  async function refresh(){
    busy=true;render();$('status').textContent='正在读取各练习的进度…';
    await Promise.all(window.EXERCISES.map(async exercise=>{try{snapshots.set(exercise.id,{rows:await request(exercise,'list')});}catch(error){snapshots.set(exercise.id,{error:error.message});}}));
    busy=false;render();$('status').textContent=[...snapshots.values()].some(value=>value.error)?'部分练习读取失败，请查看下方说明。':'记录已刷新。';
  }
  function ask(exercises,keys){
    pending={exercises,keys};$('confirm-text').textContent=keys?'将删除所选的一条进度记录，无法撤销。':`将清理${exercises.map(e=>`《${e.title}》`).join('、')}的全部进度，包含保留的旧版记录，无法撤销。`;
    $('confirmation').showModal();$('cancel').focus();
  }
  $('refresh').onclick=refresh;
  $('clear-all').onclick=()=>ask(window.EXERCISES);
  $('records').addEventListener('click',event=>{const b=event.target.closest('button[data-id]');if(!b||b.disabled)return;const exercise=window.EXERCISES.find(e=>e.id===b.dataset.id);if(exercise)ask([exercise],b.dataset.key?[b.dataset.key]:undefined);});
  $('cancel').onclick=()=>{$('confirmation').close();pending=null;};
  $('confirmation').addEventListener('cancel',()=>{pending=null;});
  $('confirm').onclick=async()=>{
    if(!pending||busy)return;const operation=pending;pending=null;$('confirmation').close();busy=true;render();
    const failures=[];
    for(const exercise of operation.exercises){try{snapshots.set(exercise.id,{rows:await request(exercise,'clear',operation.keys)});}catch(error){snapshots.set(exercise.id,{error:error.message});failures.push(exercise.title);}}
    busy=false;render();$('status').textContent=failures.length?`部分清理失败：${failures.join('、')}。已成功清理的练习不会回滚，请查看下方说明。`:'所选进度已清理。下次打开练习将重新开始。';
  };
  refresh();
})();
