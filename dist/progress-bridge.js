/* Run in the exercise document so file:// storage is read at its original URL. */
(() => {
  'use strict';
  const script=document.currentScript;
  const exercise=window.EXERCISES.find(item=>item.id===script.dataset.exercise);
  if(!exercise) return;
  const isManagementFrame=parent!==window && location.hash.startsWith('#brison-progress=');
  const bridge=window.ProgressBridge={isManagementFrame,invalidated:false};
  if(isManagementFrame) {
    document.documentElement.hidden=true;
    const token=location.hash.slice('#brison-progress='.length);
    window.addEventListener('message',event=>{
      if(event.origin!==(location.protocol==='file:'?'null':location.origin) || event.source!==parent || event.data?.channel!=='brison-progress' || event.data?.token!==token || !['list','clear'].includes(event.data.action)) return;
      const request=event.data;
      try {
        if(request.action==='clear') window.ProgressStore.clear(localStorage,exercise,request.keys);
        const rows=window.ProgressStore.list(localStorage,exercise);
        parent.postMessage({channel:'brison-progress',token,requestId:request.requestId,rows},'*');
      } catch {
        parent.postMessage({channel:'brison-progress',token,requestId:request.requestId,error:'无法读取或清理浏览器存储。请检查浏览器权限，或进入练习的进度管理中处理。'},'*');
      }
    });
  } else {
    // Keep incompatible/corrupt records intact rather than saving fresh state over them.
    try {
      const current=window.ProgressStore.list(localStorage,exercise).find(row=>row.key===exercise.storage.currentKey);
      if(current && ['incompatible','damaged'].includes(current.status)) {
        bridge.invalidated=true;
        window.addEventListener('DOMContentLoaded',()=>{
          const notice=document.createElement('div');notice.className='project-storage-notice';notice.setAttribute('role','alert');
          notice.append('已有进度与当前版本不兼容或无法读取，已保留原记录并暂停保存。 ');
          const link=document.createElement('a');link.href='../../../../progress.html';link.textContent='前往进度管理';notice.append(link);document.body.prepend(notice);
        });
      }
    } catch { /* The exercise itself displays its storage-unavailable warning. */ }
    // A cleared or replaced record must not be restored by an old open tab.
    window.addEventListener('storage',event=>{
      if(event.key!==null && !window.ProgressStore.owns(event.key,exercise)) return;
      bridge.invalidated=true;
      if(document.getElementById('progress-changed')) return;
      const notice=document.createElement('div');notice.id='progress-changed';notice.className='project-storage-notice';notice.setAttribute('role','alert');
      notice.append('进度已在其他页面更改。此页已暂停保存，请刷新后继续。 ');
      const refresh=document.createElement('button');refresh.type='button';refresh.textContent='刷新练习';refresh.onclick=()=>location.reload();notice.append(refresh);document.body.prepend(notice);
    });
  }
})();
