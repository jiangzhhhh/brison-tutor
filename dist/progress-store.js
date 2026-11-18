/* Storage inventory only: never rewrites, migrates, or clears unrelated data. */
(() => {
  'use strict';
  function owns(key, exercise) {
    if (key.startsWith(`brison-tutor:progress:${exercise.id}:`)) return true;
    return (exercise.storage.legacyPrefixes || []).some(prefix => {
      if (!key.startsWith(prefix)) return false;
      return /^\d+(?:[-:].*)?$/.test(key.slice(prefix.length));
    }) || key === exercise.storage.currentKey;
  }
  function list(storage, exercise) {
    const rows=[];
    for(let i=0;i<storage.length;i++) {
      const key=storage.key(i); if(!key || !owns(key,exercise) || (exercise.storage.auxiliaryKeys||[]).includes(key)) continue;
      const raw=storage.getItem(key); if(raw===null) continue;
      let data, status='legacy';
      try {
        data=JSON.parse(raw);
        if (!data || typeof data!=='object' || Array.isArray(data)) throw new Error('Invalid progress');
        if(key===exercise.storage.currentKey) {
          status=(data.schemaVersion??data.version)===exercise.storage.schemaVersion && String(data.bankVersion)===String(exercise.storage.bankVersion)?'current':'incompatible';
          if(status==='current' && exercise.storage.validate && !exercise.storage.validate(data)) status='damaged';
        }
      } catch {status='damaged';}
      rows.push({key,status,bytes:new TextEncoder().encode(raw).length,schemaVersion:data?.schemaVersion??data?.version??null,bankVersion:data?.bankVersion??null,updatedAt:typeof data?.updatedAt==='string'?data.updatedAt:null});
    }
    return rows.sort((a,b)=>a.key.localeCompare(b.key));
  }
  function clear(storage, exercise, keys) {
    // 全部清理也包含隐藏的迁移标记；单条清理保留标记，避免旧成绩再次迁入。
    const targets=keys || Array.from({length:storage.length},(_,i)=>storage.key(i)).filter(key=>key&&owns(key,exercise));
    if(!Array.isArray(targets) || targets.some(key=>typeof key!=='string'||!owns(key,exercise))) throw new Error('无法清理其他练习或站点的数据');
    for(const key of targets) storage.removeItem(key);
  }
  window.ProgressStore=Object.freeze({owns,list,clear});
})();
