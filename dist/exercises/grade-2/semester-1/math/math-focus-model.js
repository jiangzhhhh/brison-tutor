(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./math-focus-bank.js'));
  else {
    root.MathFocusModel=factory(root.MathFocusBank);
    if(root.ProgressBridge)root.ProgressBridge.validateCurrent=root.MathFocusModel.isValidRecord;
  }
})(typeof window!=='undefined'?window:globalThis,function(bank){
  'use strict';
  const ID='math-focus',KEY='brison-tutor:progress:math-focus:v1',SCHEMA=1;
  const questions=new Map(bank.questions.map(q=>[q.id,q])),rounds=new Map(bank.rounds.map(r=>[r.id,r]));
  const groupByQuestion=new Map(bank.rounds.flatMap(group=>group.questionIds.map(id=>[id,group.id])));
  const clone=value=>JSON.parse(JSON.stringify(value));
  const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  const date=value=>typeof value==='string'&&Number.isFinite(Date.parse(value));
  const check=(condition,message='进度格式错误')=>{if(!condition)throw Error(message);};
  function initial(){return {route:'home',roundId:null,currentQuestionId:null,revisions:Object.fromEntries(bank.questions.map(q=>[q.id,q.revision])),rounds:{}};}
  function attempt(state){return state.rounds[state.roundId]?.attempts.find(a=>a.id===state.rounds[state.roundId].activeAttemptId);}
  function openRound(state,id,now,retry=false){
    check(rounds.has(id));const next=clone(state),round=rounds.get(id);
    next.roundId=id;
    const record=next.rounds[id]??={attempts:[],activeAttemptId:null};
    let a=record.attempts.find(item=>item.id===record.activeAttemptId);
    if(!a||retry){
      check(!a||a.completedAt,'请先完成当前练习');
      a={id:`${id}-${record.attempts.length+1}`,startedAt:now,questionIds:[...round.questionIds],answers:{},results:{},completedAt:null};
      record.attempts.push(a);record.activeAttemptId=a.id;
    }
    const savedPosition=record.currentQuestionId??(state.roundId===id?state.currentQuestionId:null);
    const resume=!retry&&a.questionIds.includes(savedPosition);
    next.currentQuestionId=resume?savedPosition:(a.questionIds.find(qid=>!a.results[qid])??a.questionIds[0]);
    record.currentQuestionId=next.currentQuestionId;
    next.route=a.completedAt?'summary':'question';return next;
  }
  function goTo(state,qid){
    const a=attempt(state);check(a?.questionIds.includes(qid));
    const next=clone(state);next.currentQuestionId=qid;next.rounds[state.roundId].currentQuestionId=qid;next.route='question';return next;
  }
  function choose(state,qid,choice){
    const a=attempt(state);check(a?.questionIds.includes(qid)&&!a.results[qid]&&!a.completedAt);
    check(questions.get(qid).choices.some(c=>c.id===choice));
    const next=clone(state);attempt(next).answers[qid]=choice;return next;
  }
  function isImmediate(roundId,qid){
    const round=rounds.get(roundId);
    const index=round?.questionIds.indexOf(qid)??-1;
    return index>=0&&index<round.immediateCount;
  }
  function grade(a,qid,now){
    const choice=a.answers[qid];check(questions.get(qid).choices.some(c=>c.id===choice),'请先选择答案');
    if(!a.results[qid])a.results[qid]={choice,correct:choice===questions.get(qid).answer,submittedAt:now};
  }
  function submitCurrent(state,now){
    check(isImmediate(state.roundId,state.currentQuestionId),'本题需整组提交');
    const next=clone(state),a=attempt(next);check(a&&!a.completedAt);grade(a,state.currentQuestionId,now);
    if(a.questionIds.every(qid=>a.results[qid]))a.completedAt=now;
    return next;
  }
  function submitRound(state,now){
    const next=clone(state),a=attempt(next);check(a);
    check(a.questionIds.every(qid=>a.answers[qid]),'还有题目未作答');
    for(const qid of a.questionIds)grade(a,qid,now);
    a.completedAt??=now;next.route='summary';return next;
  }
  function score(a){const results=Object.values(a.results);return {correct:results.filter(r=>r.correct).length,total:a.questionIds.length,submitted:results.length};}
  function firstResults(state){
    const first={};for(const r of Object.values(state.rounds))for(const a of r.attempts)for(const [qid,result] of Object.entries(a.results))first[qid]??=result;
    for(const [id,record] of Object.entries(state.practice?.questions??{})){
      if(record.attempts.length)first[id]??=record.attempts[0];
    }
    return first;
  }

  function questionProgress(state,id){
    const saved=state.practice?.questions[id];
    if(saved)return saved;
    const group=state.rounds[groupByQuestion.get(id)];
    const active=group?.attempts.find(item=>item.id===group.activeAttemptId);
    const draft=active&&!active.results[id]?active.answers[id]??null:null;
    const attempts=(group?.attempts??[]).flatMap(item=>item.results[id]?[item.results[id]]:[]);
    return {draft,attempts,submitted:draft===null&&attempts.length>0};
  }

  function selectQuestion(state,id){
    check(id===null||questions.has(id));
    return {...state,practice:{questionId:id,questions:state.practice?.questions??{}}};
  }

  function saveQuestionProgress(state,record){
    const practice=state.practice;
    return {...state,practice:{...practice,questions:{...practice.questions,[practice.questionId]:record}}};
  }

  function chooseQuestion(state,choice){
    const id=state.practice?.questionId,progress=questionProgress(state,id);
    check(!progress.submitted&&questions.get(id)?.choices.some(option=>option.id===choice));
    return saveQuestionProgress(state,{...progress,draft:choice});
  }

  function submitQuestion(state,now){
    const id=state.practice?.questionId,progress=questionProgress(state,id);
    check(!progress.submitted&&progress.draft!==null,'请先选择答案');
    const result={choice:progress.draft,correct:progress.draft===questions.get(id).answer,submittedAt:now};
    return saveQuestionProgress(state,{draft:null,attempts:[...progress.attempts,result],submitted:true});
  }

  function retryQuestion(state){
    const progress=questionProgress(state,state.practice?.questionId);
    check(progress.submitted);
    return saveQuestionProgress(state,{...progress,draft:null,submitted:false});
  }

  function validatePractice(practice,revisions){
    check(object(practice)&&object(practice.questions)&&(practice.questionId===null||questions.has(practice.questionId)));
    for(const [id,progress] of Object.entries(practice.questions)){
      const question=questions.get(id);
      check(question&&question.revision===revisions[id]&&object(progress)&&Array.isArray(progress.attempts));
      const validChoice=choice=>question.choices.some(option=>option.id===choice);
      check(progress.draft===null||validChoice(progress.draft));
      check(typeof progress.submitted==='boolean'&&(!progress.submitted||progress.draft===null&&progress.attempts.length>0));
      for(const result of progress.attempts){
        check(object(result)&&validChoice(result.choice)&&result.correct===(result.choice===question.answer)&&date(result.submittedAt));
      }
    }
  }
  function validate(state){
    check(object(state)&&['home','question','summary'].includes(state.route)&&object(state.revisions)&&object(state.rounds));
    check((state.roundId===null&&state.currentQuestionId===null)||rounds.has(state.roundId));
    for(const [rid,record] of Object.entries(state.rounds)){
      check(rounds.has(rid)&&object(record)&&Array.isArray(record.attempts)&&record.attempts.length>0);
      const ids=new Set();
      for(const a of record.attempts){
        check(object(a)&&typeof a.id==='string'&&!ids.has(a.id)&&date(a.startedAt)&&object(a.answers)&&object(a.results));ids.add(a.id);
        check(Array.isArray(a.questionIds)&&a.questionIds.length>0&&new Set(a.questionIds).size===a.questionIds.length);
        for(const qid of a.questionIds)check(rounds.get(rid).questionIds.includes(qid)&&state.revisions[qid]===questions.get(qid).revision,'题目版本不兼容');
        for(const [qid,choice] of Object.entries(a.answers))check(a.questionIds.includes(qid)&&questions.get(qid).choices.some(c=>c.id===choice));
        for(const [qid,r] of Object.entries(a.results))check(a.questionIds.includes(qid)&&object(r)&&Object.hasOwn(a.answers,qid)&&questions.get(qid).choices.some(c=>c.id===r.choice)&&r.choice===a.answers[qid]&&typeof r.correct==='boolean'&&r.correct===(r.choice===questions.get(qid).answer)&&date(r.submittedAt));
        const allSubmitted=a.questionIds.every(qid=>a.results[qid]);
        check(allSubmitted?date(a.completedAt):a.completedAt===null);
        if(Object.keys(a.results).some(qid=>!isImmediate(rid,qid)))check(allSubmitted,'分组提交结果不完整');
      }
      check(ids.has(record.activeAttemptId));
      if(record.currentQuestionId!==undefined)check(record.attempts.find(a=>a.id===record.activeAttemptId).questionIds.includes(record.currentQuestionId));
    }
    if(state.roundId!==null)check(attempt(state)?.questionIds.includes(state.currentQuestionId));
    if(state.route==='question')check(attempt(state));
    if(state.route==='summary')check(attempt(state)?.completedAt);
    if(state.practice!==undefined)validatePractice(state.practice,state.revisions);
    return true;
  }
  function isValidRecord(raw){
    try{
      const e=JSON.parse(raw);
      return e.exerciseId===ID&&e.schemaVersion===SCHEMA&&e.bankVersion===bank.version&&date(e.updatedAt)&&validate(e.data);
    }catch{return false;}
  }
  function persistence(storage,bridge={},onError=()=>{}){
    let blocked=false,lastRaw=null;
    const fail=message=>{onError(message);return message;};
    function load(){
      try{
        lastRaw=storage.getItem(KEY);
        if(lastRaw===null){
          for(let i=0;i<storage.length;i++){const key=storage.key(i);if(key?.startsWith(`brison-tutor:progress:${ID}:`)){blocked=true;return {state:initial(),error:fail('无法恢复上次进度，本次作答不会保存。')};}}
          return {state:initial(),error:'',migrated:false};
        }
        const envelope=JSON.parse(lastRaw);
        check(object(envelope)&&envelope.exerciseId===ID&&envelope.schemaVersion===SCHEMA&&date(envelope.updatedAt));
        check(typeof envelope.bankVersion==='string'&&/^\d{4}-\d{2}-\d{2}\.\d+$/.test(envelope.bankVersion));
        const versionParts=v=>v.split(/[-.]/).map(Number);
        const current=versionParts(bank.version),old=versionParts(envelope.bankVersion);
        const firstDifference=old.findIndex((v,i)=>v!==current[i]);
        check(firstDifference<0||old[firstDifference]<current[firstDifference],'题库版本不兼容');
        validate(envelope.data);
        const state=clone(envelope.data);
        state.revisions={...state.revisions,...initial().revisions};
        const migrated=envelope.bankVersion!==bank.version;
        if(migrated){
          check(!bridge.invalidated);
          const backup=KEY+':backup:'+envelope.bankVersion;
          const prior=storage.getItem(backup);check(prior===null||prior===lastRaw,'已有不同备份');
          storage.setItem(backup,lastRaw);check(storage.getItem(backup)===lastRaw,'备份验证失败');
          validate(state);
          const raw=JSON.stringify({exerciseId:ID,schemaVersion:SCHEMA,bankVersion:bank.version,updatedAt:envelope.updatedAt,data:state});
          storage.setItem(KEY,raw);lastRaw=raw;
        }
        return {state,error:'',migrated,updatedAt:envelope.updatedAt};
      }catch(error){
        blocked=true;
        return {state:initial(),error:fail(lastRaw!==null?'无法恢复上次进度，本次作答不会保存。':'无法读取浏览器存储，当前进度无法保存。')};
      }
    }
    function save(state,now){
      if(blocked)return false;
      if(bridge.invalidated){blocked=true;fail('进度已在其他页面更改，此页已暂停保存，请刷新后继续。');return false;}
      try{
        if(storage.getItem(KEY)!==lastRaw){blocked=true;fail('进度已在其他页面更改，此页已暂停保存，请刷新后继续。');return false;}
        validate(state);check(date(now));
        const raw=JSON.stringify({exerciseId:ID,schemaVersion:SCHEMA,bankVersion:bank.version,updatedAt:now,data:state});
        storage.setItem(KEY,raw);lastRaw=raw;return true;
      }catch{fail('进度保存失败，刷新或关闭页面可能丢失本次作答。');return false;}
    }
    return {load,save};
  }
  return Object.freeze({ID,KEY,SCHEMA,initial,attempt,openRound,goTo,choose,isImmediate,submitCurrent,submitRound,score,firstResults,selectQuestion,questionProgress,chooseQuestion,submitQuestion,retryQuestion,validate,isValidRecord,persistence});
});
