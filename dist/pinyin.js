// 公共注音组件：只增强文本节点，不改变原题、按钮属性或保存的数据。
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./vendor/pinyin-pro-3.29.5.js'),require('./pinyin-data.js'));
  else root.PinyinAid=factory(root.pinyinPro,root.PinyinData);
})(typeof globalThis!=='undefined'?globalThis:this,function(engine,data){
  'use strict';
  const defaults=new Set(data.knownChars),cache=new Map();
  const excluded='script,style,ruby,rt,rp,svg,math,textarea,input,select,option,code,pre,[data-pinyin="off"],[data-pinyin-skip],[aria-hidden="true"]';

  function pronunciation(text){
    if(cache.has(text))return cache.get(text);
    let offset=0;
    const items=engine.pinyin(text,{type:'all',toneSandhi:false}).map(item=>{
      const start=offset;offset+=item.origin.length;
      return {text:item.origin,start,end:offset,reading:item.isZh?item.pinyin:''};
    });
    if(cache.size>=500)cache.delete(cache.keys().next().value);
    cache.set(text,items);
    return items;
  }

  function segments(value,options={}){
    const text=String(value??''),known=new Set([...defaults,...String(options.knownChars??'')]);
    for(const char of String(options.extraChars??''))known.delete(char);
    for(const char of String(options.knownChars??''))known.add(char);
    const items=pronunciation(text).map(item=>({...item}));
    const readings={...data.readings,...options.readings},claimed=new Set();
    // 长词优先，防止短词的覆盖读音拆开已确认的完整词语。
    for(const word of Object.keys(readings).sort((a,b)=>b.length-a.length)){
      if(!word)continue;
      const syllables=String(readings[word]).trim().split(/\s+/),chars=[...word];
      if(syllables.length!==chars.length)continue;
      for(let at=text.indexOf(word);at!==-1;at=text.indexOf(word,at+word.length)){
        const matches=items.filter(item=>item.start>=at&&item.end<=at+word.length);
        if(matches.length!==syllables.length||matches.some(item=>claimed.has(item.start)))continue;
        matches.forEach((item,i)=>{item.reading=syllables[i];claimed.add(item.start);});
      }
    }
    return items.map(item=>({...item,reading:/^\p{Script=Han}$/u.test(item.text)&&!known.has(item.text)?item.reading:''}));
  }

  function annotate(root,options={}){
    if(!root)return 0;
    const selector=options.selector||'[data-pinyin]',scopes=[...root.querySelectorAll(selector)];
    if(root.nodeType===1&&root.matches(selector))scopes.unshift(root);
    const scopeSet=new Set(scopes);
    let count=0;
    for(const scope of scopes){
      if(scope.closest(excluded))continue;
      let parent=scope.parentElement,nested=false;
      while(parent){if(scopeSet.has(parent)){nested=true;break;}parent=parent.parentElement;}
      if(nested)continue;
      const document=scope.ownerDocument;
      const walker=document.createTreeWalker(scope,4),nodes=[];
      let node;
      while((node=walker.nextNode()))if(!node.parentElement.closest(excluded))nodes.push(node);
      const text=nodes.map(node=>node.nodeValue).join('');
      if(!text)continue;
      const items=segments(text,options);
      let offset=0,index=0;
      for(const node of nodes){
        const start=offset;offset+=node.nodeValue.length;
        const inside=[];
        while(index<items.length&&items[index].end<=offset){
          if(items[index].start>=start)inside.push(items[index]);
          index++;
        }
        if(!inside.some(item=>item.reading))continue;
        const fragment=document.createDocumentFragment();
        for(const item of inside){
          if(!item.reading){fragment.append(document.createTextNode(item.text));continue;}
          const ruby=document.createElement('ruby'),base=document.createElement('span'),rt=document.createElement('rt');
          ruby.className='pinyin-ruby';base.textContent=item.text;rt.textContent=item.reading;
          rt.setAttribute('aria-hidden','true');ruby.append(base,rt);fragment.append(ruby);count++;
        }
        // 裸文本原本可能是一个flex项目，用单个容器保留其排版边界。
        const wrapper=document.createElement('span');wrapper.className='pinyin-text';wrapper.append(fragment);
        node.replaceWith(wrapper);
      }
    }
    return count;
  }
  return Object.freeze({segments,annotate,version:data.version});
});
