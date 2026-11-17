const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function setup(entries={}) {
  const window={};
  vm.runInNewContext(fs.readFileSync('dist/progress-store.js','utf8'),{window,TextEncoder});
  const values=new Map(Object.entries(entries));
  const storage={get length(){return values.size;},key(i){return [...values.keys()][i]??null;},getItem(k){return values.get(k)??null;},removeItem(k){values.delete(k);}};
  return {store:window.ProgressStore,storage,values};
}
const config={id:'semantic-blocks',storage:{currentKey:'semantic-blocks-v4',schemaVersion:4,bankVersion:4,legacyPrefixes:['semantic-blocks-v']}};
test('lists current, legacy and broken records without writing or reading unrelated data',()=>{
  const {store,storage,values}=setup({'semantic-blocks-v4':'{"version":4,"bankVersion":4}','semantic-blocks-v3':'{"version":3}','semantic-blocks-v2':'broken',unrelated:'private'});
  const before=JSON.stringify([...values]);const rows=store.list(storage,config);
  assert.equal(rows.length,3);assert.equal(rows.find(r=>r.key.endsWith('v4')).status,'current');assert.equal(rows.find(r=>r.key.endsWith('v3')).status,'legacy');assert.equal(rows.find(r=>r.key.endsWith('v2')).status,'damaged');assert.equal(JSON.stringify([...values]),before);
});
test('clear only registered keys and rejects keys from another exercise',()=>{
  const {store,storage,values}=setup({'semantic-blocks-v4':'{}','semantic-blocks-v3':'{}',unrelated:'keep'});
  assert.throws(()=>store.clear(storage,config,['unrelated']));
  store.clear(storage,config,['semantic-blocks-v3']);assert(values.has('semantic-blocks-v4'));
  store.clear(storage,config);assert.deepEqual([...values],[['unrelated','keep']]);
});
test('namespaced future versions and incompatible current records are visible',()=>{
  const {store,storage}=setup({'brison-tutor:progress:semantic-blocks:v5':'{"schemaVersion":5,"bankVersion":5}','semantic-blocks-v4':'{"version":99,"bankVersion":4}'});
  assert.equal(store.list(storage,config).length,2);assert.equal(store.list(storage,config).find(x=>x.key.endsWith('v4')).status,'incompatible');
});
test('blocked storage is an error, never mistaken for empty progress',()=>{
  const {store}=setup();assert.throws(()=>store.list({get length(){throw new Error('denied');}},config),/denied/);
});

test('migration markers stay hidden, survive clearing one version, and are included in clear-all',()=>{
  const marker='brison-tutor:progress:semantic-blocks:migration';
  const exercise={...config,storage:{...config.storage,auxiliaryKeys:[marker]}};
  const {store,storage,values}=setup({'semantic-blocks-v4':'{"version":4,"bankVersion":4}',[marker]:'{"done":true}',unrelated:'keep'});
  assert.equal(store.list(storage,exercise).length,1);
  store.clear(storage,exercise,['semantic-blocks-v4']);assert(values.has(marker));
  store.clear(storage,exercise);assert(!values.has(marker));assert(values.has('unrelated'));
});
