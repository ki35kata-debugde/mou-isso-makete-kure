/**
 * Bugfixes (NaN iron, prep label undefined) + Horse Phase B annual cycle
 * Target: mou_isso_v0_6_1.html
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_v2_' + Date.now(), h, 'utf8');

// ── Fix iron NaN: CFG.start.鉄 → iron ──
h = h.replace(
  'inv:{iron:CFG.start.鉄,wood:CFG.start.wood,niter:CFG.start.niter,herb:CFG.start.herb,food:CFG.start.food}',
  "inv:{iron:(CFG.start.iron!=null?CFG.start.iron:CFG.start['鉄'])||5,wood:CFG.start.wood||0,niter:CFG.start.niter||0,herb:CFG.start.herb||0,food:CFG.start.food||0}"
);
console.log('iron start fixed');

// ── Fix prep label: don't append ×qty when items[] form ──
// updateTabLabels and updatePrinceBar (both copies)
h = h.replace(
  /if\(req\)req\.textContent='準備:'\+q\.label\+'\×'\+q\.qty;/g,
  "if(req)req.textContent='準備:'+((q&&q.label)?q.label:((q&&q.item)?q.item:''))+(q&&q.qty!=null?('×'+q.qty):'');"
);
// also with fullwidth × 
h = h.replace(
  /req\.textContent='準備：'\+q\.label\+'\×'\+q\.qty;/g,
  "req.textContent='準備：'+((q&&q.label)?q.label:((q&&q.item)?q.item:''))+(q&&q.qty!=null?('×'+q.qty):'');"
);
// prince bar uses 準備： with fullwidth colon
h = h.replace(
  /req\.textContent='準備：'\+q\.label\+'×'\+q\.qty;/g,
  "req.textContent='準備：'+((q&&q.label)?q.label:((q&&q.item)?q.item:''))+(q&&q.qty!=null?('×'+q.qty):'');"
);
h = h.replace(
  /req\.textContent='準備:'\+q\.label\+'×'\+q\.qty;/g,
  "req.textContent='準備:'+((q&&q.label)?q.label:((q&&q.item)?q.item:''))+(q&&q.qty!=null?('×'+q.qty):'');"
);
console.log('prep labels patched');

// ── CSS for ranch season UI ──
const CSS = `
/* horse season UI */
.ranch-season-bar{font-size:11px;color:var(--faded);margin:8px 0 4px;padding:6px 8px;background:var(--panel);border-radius:4px;border:1px solid var(--border);}
.ranch-season-actions{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;}
.ranch-season-actions button{font-family:'Noto Serif JP',serif;font-size:11px;padding:6px 10px;border:1px solid var(--border);background:var(--paper2);border-radius:3px;cursor:pointer;}
.ranch-season-actions button:hover{border-color:var(--gold);}
.ranch-season-actions button:disabled{opacity:.4;cursor:default;}
.ranch-pair-row{display:flex;gap:8px;align-items:center;margin:6px 0;font-size:12px;}
.ranch-pair-row select{flex:1;font-size:12px;padding:4px;}
#ranch-season-msg{font-size:12px;line-height:1.7;margin-top:6px;color:var(--ink);}
`;
if (!h.includes('/* horse season UI */')) {
  h = h.replace('</style>', CSS + '\n</style>');
  console.log('season css');
}

// ── Ranch HTML: season panel ──
if (!h.includes('id="ranch-season-panel"')) {
  h = h.replace(
    '<div id="ranch-horse-list"></div>',
    `<div id="ranch-season-panel">
      <div class="ranch-season-bar" id="ranch-season-bar">季節：—</div>
      <div class="ranch-season-actions" id="ranch-season-actions"></div>
      <div id="ranch-season-msg"></div>
    </div>
      <div id="ranch-horse-list"></div>`
  );
  console.log('season panel html');
}

// ── Phase B addon ──
const ADDON = `
// ═══ Horses v2 seasonal + bugfixes ═══
(function(){
'use strict';
if(window.__horsesV2) return;
window.__horsesV2 = true;

// sanitize inv numbers (NaN iron etc.)
function sanitizeInv(){
  if(!gs.inv) gs.inv={iron:5,wood:5,niter:0,herb:4,food:8};
  ['iron','wood','niter','herb','food'].forEach(function(k){
    var v=Number(gs.inv[k]);
    if(!isFinite(v)) gs.inv[k]=(k==='iron'||k==='wood')?5:(k==='food'?8:(k==='herb'?4:0));
    else gs.inv[k]=v;
  });
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
}
sanitizeInv();

function prepQuestLabel(q){
  if(!q) return '';
  if(q.label && q.qty==null) return q.label; // multi-item form already full label
  if(q.label && q.qty!=null) return q.label+'×'+q.qty;
  if(q.items && q.items.length){
    return q.items.map(function(it){ return (it.label||it.item)+'×'+it.qty; }).join('・');
  }
  return '';
}
window.prepQuestLabel = prepQuestLabel;

// Patch prince bar / tab labels on next update
function fixPrepLabelsNow(){
  try{
    if(typeof updatePrinceBar==='function'){
      // re-run inner logic for non-sortied non-done
      PKEYS.forEach(function(key){
        if(gs.sortied[key]||gs.prepDone[key]) return;
        var q=CFG.prep_quests&&CFG.prep_quests[key];
        var lab=prepQuestLabel(q);
        var req=document.getElementById('pc-req-'+key);
        if(req && lab) req.textContent='準備：'+lab;
        var lreq=document.getElementById('ltab-req-'+key);
        if(lreq && lab) lreq.textContent='準備:'+lab;
      });
    }
  }catch(e){}
}

// Wrap updatePrinceBar / updateTabLabels lightly
if(typeof updatePrinceBar==='function'){
  var __upb = updatePrinceBar;
  window.updatePrinceBar = function(){
    __upb();
    fixPrepLabelsNow();
  };
  updatePrinceBar = window.updatePrinceBar;
}
if(typeof updateTabLabels==='function'){
  var __utl = updateTabLabels;
  window.updateTabLabels = function(){
    __utl();
    fixPrepLabelsNow();
  };
  updateTabLabels = window.updateTabLabels;
}
if(typeof updateHeaderDisplay==='function'){
  var __uhd = updateHeaderDisplay;
  window.updateHeaderDisplay = function(){
    sanitizeInv();
    __uhd();
  };
  updateHeaderDisplay = window.updateHeaderDisplay;
}

// ── Seasonal state ──
function ensureRanchSeason(){
  if(!gs.ranch) gs.ranch={introDone:false,maxPairs:1,pairs:[],shippingUnlocked:false};
  if(!gs.horses) gs.horses=[];
  if(gs.ranch.yearIndex==null) gs.ranch.yearIndex=0;
  if(gs.ranch.maxPairs==null) gs.ranch.maxPairs=1;
  if(!gs.ranch.pairs) gs.ranch.pairs=[];
  if(gs.ranch.shippingUnlocked==null) gs.ranch.shippingUnlocked=false;
  if(gs.ranch.summerAnnounced==null) gs.ranch.summerAnnounced=false;
  if(gs.ranch.autumnCoupled==null) gs.ranch.autumnCoupled=false;
  if(gs.ranch.winterFed==null) gs.ranch.winterFed=false;
  if(gs.ranch.pendingFoals==null) gs.ranch.pendingFoals=0;
  if(gs.ranch.seasonLog==null) gs.ranch.seasonLog=[];
}
function seasonName(){ return (typeof SEASONS!=='undefined'?SEASONS[gs.season]:['春','夏','秋','冬'][gs.season])||'?'; }
function displayStar(rank){
  var s=Math.floor(Number(rank)||1); if(s<1)s=1; if(s>5)s=5; return s;
}
function statsForRank(rank){
  var table=(window.HORSE_DATA&&window.HORSE_DATA.rankTable)||{
    '1':{speed:1,capacity:1},'2':{speed:2,capacity:1},'3':{speed:2,capacity:2},
    '4':{speed:3,capacity:1},'5':{speed:3,capacity:2}
  };
  var st=displayStar(rank);
  var t=table[String(st)]||{speed:1,capacity:1};
  return {star:st,speed:t.speed,capacity:t.capacity};
}
function ranchAdults(){
  ensureRanchSeason();
  return gs.horses.filter(function(hh){
    return (hh.status==='ranch'||hh.status==='paired') && !hh.isFoal;
  });
}
function ranchMales(){ return ranchAdults().filter(function(h){return h.sex==='m' && h.status==='ranch';}); }
function ranchFemales(){ return ranchAdults().filter(function(h){return h.sex==='f' && h.status==='ranch';}); }

function setSeasonMsg(html){
  var el=document.getElementById('ranch-season-msg');
  if(el) el.innerHTML=html||'';
}
function renderSeasonBar(){
  ensureRanchSeason();
  var bar=document.getElementById('ranch-season-bar');
  if(!bar) return;
  var ship=gs.ranch.shippingUnlocked?'出荷可':'出荷は最初の秋以降';
  bar.textContent='季節：'+seasonName()+'（T'+gs.turn+'）　つがい枠:'+gs.ranch.maxPairs+'　'+ship+
    '　馬'+(gs.horses?gs.horses.filter(function(x){return x.status!=='gifted'&&x.status!=='lost';}).length:0)+'頭';
}

function renderSeasonActions(){
  ensureRanchSeason();
  var box=document.getElementById('ranch-season-actions');
  if(!box) return;
  box.innerHTML='';
  var s=gs.season; // 0春 1夏 2秋 3冬

  if(s===2){ // 秋: coupling
    var males=ranchMales(), females=ranchFemales();
    if(males.length && females.length && !gs.ranch.autumnCoupled){
      var row=document.createElement('div');
      row.className='ranch-pair-row';
      row.innerHTML='<span>つがい:</span>'+
        '<select id="pair-male"></select><span>×</span><select id="pair-female"></select>'+
        '<button type="button" id="btn-pair-confirm">カップリング確定</button>';
      box.appendChild(row);
      var sm=document.getElementById('pair-male');
      var sf=document.getElementById('pair-female');
      males.forEach(function(hh){
        var o=document.createElement('option'); o.value=hh.id;
        o.textContent=hh.name+' ★'+displayStar(hh.rank)+' 雄'; sm.appendChild(o);
      });
      females.forEach(function(hh){
        var o=document.createElement('option'); o.value=hh.id;
        o.textContent=hh.name+' ★'+displayStar(hh.rank)+' 雌'; sf.appendChild(o);
      });
      document.getElementById('btn-pair-confirm').onclick=function(){
        confirmCouple(sm.value, sf.value);
      };
      setSeasonMsg('秋です。つがいを組むと輸送・献上に使えません。翌春に仔馬が生まれます。');
    } else if(gs.ranch.autumnCoupled){
      setSeasonMsg('今秋のカップリングは確定済みです。つがいの馬は輸送不可です。');
    } else {
      setSeasonMsg('秋ですが、つがいにできる雄雌がいません。');
    }
  } else if(s===3){ // 冬: feed
    if(!gs.ranch.winterFed){
      var b1=document.createElement('button');
      b1.textContent='全馬に兵糧をやる（1頭1兵糧）';
      b1.onclick=function(){ winterFeedFood(); };
      var b2=document.createElement('button');
      b2.textContent='つがいに回復薬（仔の★+0.5）';
      b2.onclick=function(){ winterFeedMed(); };
      box.appendChild(b1); box.appendChild(b2);
      setSeasonMsg('冬です。兵糧で体調を支え、回復薬は<strong>翌春の仔馬のランク</strong>だけ上がります（親には付きません）。');
    } else {
      setSeasonMsg('今冬の餌やりは記録済みです。');
    }
  } else if(s===0){
    setSeasonMsg('春です。仔馬が生まれる季節です（結果フェーズ／ターン進行で反映）。');
  } else if(s===1){
    setSeasonMsg('夏です。仔馬の成長とステータスが判明します。1年目は出荷準備の話が出ます。');
  }
}

function confirmCouple(maleId, femaleId){
  ensureRanchSeason();
  if(gs.season!==2){ showToast('カップリングは秋のみです'); return; }
  if(gs.ranch.pairs.length >= gs.ranch.maxPairs){
    showToast('つがい枠がいっぱいです（'+gs.ranch.maxPairs+'）'); return;
  }
  var m=gs.horses.find(function(h){return h.id===maleId;});
  var f=gs.horses.find(function(h){return h.id===femaleId;});
  if(!m||!f||m.sex!=='m'||f.sex!=='f'){ showToast('雄と雌を選んでください'); return; }
  if(m.status!=='ranch'||f.status!=='ranch'){ showToast('その馬はつがいにできません'); return; }
  if(!confirm(m.name+' と '+f.name+' をつがいにしますか？\\nこの2頭は輸送・献上に使えません。')) return;
  var pid='pair_'+Date.now().toString(36);
  m.status='paired'; f.status='paired'; m.pairId=pid; f.pairId=pid;
  gs.ranch.pairs.push({id:pid, maleId:m.id, femaleId:f.id, medBonus:0});
  gs.ranch.autumnCoupled=true;
  showToast('カップリング確定：'+m.name+'×'+f.name);
  if(typeof renderRanchHorseList==='function') renderRanchHorseList();
  renderSeasonBar(); renderSeasonActions();
}

function winterFeedFood(){
  ensureRanchSeason();
  var list=gs.horses.filter(function(h){ return h.status==='ranch'||h.status==='paired'; });
  var need=list.length;
  if(need<=0){ showToast('馬がいません'); return; }
  if((gs.inv.food||0)<need){ showToast('兵糧が足りません（必要'+need+'）'); return; }
  gs.inv.food-=need;
  list.forEach(function(h){ h.winterFood=(h.winterFood||0)+1; });
  gs.ranch.winterFed=true;
  showToast('全馬に兵糧を与えました（-'+need+'）');
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  renderSeasonActions();
}
function winterFeedMed(){
  ensureRanchSeason();
  var pairs=gs.ranch.pairs||[];
  if(!pairs.length){ showToast('つがいがいません'); return; }
  var need=pairs.length;
  if((gs.stock.med||0)<need){ showToast('回復薬が足りません（つがい1組につき1）'); return; }
  gs.stock.med-=need;
  pairs.forEach(function(p){ p.medBonus=(p.medBonus||0)+0.5; });
  gs.ranch.winterFed=true;
  showToast('つがいに回復薬を与えました（仔の★+0.5予定）');
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updateStockBar==='function') updateStockBar();
  renderSeasonActions();
}
window.confirmCouple=confirmCouple;
window.winterFeedFood=winterFeedFood;
window.winterFeedMed=winterFeedMed;

function randomName(){
  var names=(window.HORSE_DATA&&window.HORSE_DATA.names)||['胡瓜','南瓜','綿飴'];
  var used={}; (gs.horses||[]).forEach(function(h){used[h.name]=1;});
  var pool=names.filter(function(n){return !used[n];});
  if(!pool.length) pool=names.slice();
  return pool[Math.floor(Math.random()*pool.length)];
}
function makeFoal(pair){
  var m=gs.horses.find(function(h){return h.id===pair.maleId;});
  var f=gs.horses.find(function(h){return h.id===pair.femaleId;});
  var rMin=Math.min(m?m.rank:1, f?f.rank:1);
  var rMax=Math.max(m?m.rank:1, f?f.rank:1);
  var base=rMin + Math.random()*(rMax-rMin+0.01);
  var rank=Math.round((base+(pair.medBonus||0))*10)/10;
  if(rank<1) rank=1; if(rank>5) rank=5;
  var st=statsForRank(rank);
  return {
    id:'h_f_'+Date.now().toString(36)+'_'+Math.floor(Math.random()*999),
    name:randomName(),
    sex: Math.random()<0.5?'m':'f',
    rank:rank,
    speed:st.speed, capacity:st.capacity,
    status:'ranch',
    bornTurn:gs.turn,
    isFoal:true,
    grewUp:false,
    shippableFromTurn:null,
    pairId:null,
    winterFood:0, winterMed:0,
    trait:(window.HORSE_DATA&&window.HORSE_DATA.traits)?window.HORSE_DATA.traits[Math.floor(Math.random()*window.HORSE_DATA.traits.length)]:'のんびり',
    source:'birth'
  };
}

// Run seasonal events when season advances (hook goToNextTurn)
function onSeasonChange(prevSeason, newSeason){
  ensureRanchSeason();
  var logs=[];
  // Leaving winter (3) → spring (0): births
  if(prevSeason===3 && newSeason===0){
    var born=[];
    (gs.ranch.pairs||[]).forEach(function(pair){
      var n=1+(Math.random()<0.5?1:0); // 1 or 2
      for(var i=0;i<n;i++){
        var foal=makeFoal(pair);
        gs.horses.push(foal);
        born.push(foal.name+'★'+displayStar(foal.rank));
      }
      // unpair parents back to ranch
      var m=gs.horses.find(function(h){return h.id===pair.maleId;});
      var f=gs.horses.find(function(h){return h.id===pair.femaleId;});
      if(m){ m.status='ranch'; m.pairId=null; }
      if(f){ f.status='ranch'; f.pairId=null; }
    });
    gs.ranch.pairs=[];
    gs.ranch.autumnCoupled=false;
    gs.ranch.winterFed=false;
    if(born.length){
      logs.push('春：仔馬が生まれました（'+born.join('、')+'）');
    } else if(gs.ranch.yearIndex>0){
      logs.push('春：今年は仔馬がいませんでした');
    }
    gs.ranch.yearIndex=(gs.ranch.yearIndex||0)+1;
  }
  // Summer: foals grow
  if(newSeason===1){
    var grew=[];
    gs.horses.forEach(function(hh){
      if(hh.isFoal && !hh.grewUp){
        hh.grewUp=true;
        hh.isFoal=false;
        var st=statsForRank(hh.rank);
        hh.speed=st.speed; hh.capacity=st.capacity;
        grew.push(hh.name+'（★'+displayStar(hh.rank)+' 速'+st.speed+' 容'+st.capacity+'）');
      }
    });
    if(grew.length) logs.push('夏：仔馬が成長しステータスが判明（'+grew.join('、')+'）');
    // Year 1 summer: announce shipping next season
    if(!gs.ranch.shippingUnlocked && !gs.ranch.summerAnnounced){
      gs.ranch.summerAnnounced=true;
      logs.push('夏：牧場の娘「もうすぐ牧場から出られる子がいます…来季（秋）から輸送・献上の準備ができます」');
      gs.ranch.pendingShipUnlock=true;
    }
  }
  // Autumn: unlock shipping if pending
  if(newSeason===2){
    if(gs.ranch.pendingShipUnlock || gs.ranch.summerAnnounced){
      if(!gs.ranch.shippingUnlocked){
        gs.ranch.shippingUnlocked=true;
        gs.horses.forEach(function(hh){
          if(hh.status==='ranch' && hh.shippableFromTurn==null) hh.shippableFromTurn=gs.turn;
        });
        logs.push('秋：馬の出荷が解禁されました（輸送・献上に使えます。つがい中は除く）');
      }
    }
    gs.ranch.autumnCoupled=false;
    logs.push('秋：カップリングの季節です。牧場でつがいを組んでください。');
  }
  if(newSeason===3){
    gs.ranch.winterFed=false;
    logs.push('冬：兵糧と回復薬を与えられます（薬は仔のランクのみ上昇）。');
  }
  gs.ranch.seasonLog = (gs.ranch.seasonLog||[]).concat(logs).slice(-20);
  gs._ranchSeasonNotes = logs;
  if(typeof renderRanchHorseList==='function') renderRanchHorseList();
  renderSeasonBar(); renderSeasonActions();
}

// Hook goToNextTurn
(function(){
  var orig = window.goToNextTurn || (typeof goToNextTurn==='function'?goToNextTurn:null);
  if(!orig) return;
  window.goToNextTurn = function(){
    ensureRanchSeason();
    sanitizeInv();
    var prevSeason = gs.season;
    // return transit horses
    (gs.horses||[]).forEach(function(hh){ if(hh.status==='transit') hh.status='ranch'; });
    // horse_find before clear
    if(gs.kengen && gs.kengen.shingen==='horse_find' && typeof grantHorseFind==='function'){
      try{ grantHorseFind(); }catch(e){}
    }
    var r = orig.apply(this, arguments);
    // after turn++ season advanced
    try{ onSeasonChange(prevSeason, gs.season); }catch(e){ console.warn('onSeasonChange', e); }
    sanitizeInv();
    fixPrepLabelsNow();
    return r;
  };
  if(typeof goToNextTurn==='function') goToNextTurn = window.goToNextTurn;
})();

// Result screen: show ranch season notes
(function(){
  var orig = window.buildResultScreen || (typeof buildResultScreen==='function'?buildResultScreen:null);
  if(!orig) return;
  window.buildResultScreen = function(){
    orig.apply(this, arguments);
    var notes = gs._ranchSeasonNotes || (gs.ranch && gs.ranch.seasonLog && gs.ranch.seasonLog.slice(-3)) || [];
    if(!notes.length) return;
    var log=document.getElementById('result-log');
    if(log){
      notes.forEach(function(t){
        var d=document.createElement('div');
        d.className='log-line log-info show';
        d.textContent='🐎 '+t;
        log.appendChild(d);
      });
    }
    // also ranch-related in transport result area if empty-ish
  };
  if(typeof buildResultScreen==='function') buildResultScreen = window.buildResultScreen;
})();

// hasHorseMeans: only shippable unlocked adults for transport means (after unlock)
(function(){
  if(typeof window.isMeansUnlocked!=='function' && typeof isMeansUnlocked!=='function') return;
  var prev = window.isMeansUnlocked || isMeansUnlocked;
  window.isMeansUnlocked = function(m){
    if(m==='horse'){
      ensureRanchSeason();
      // Phase A compatibility: if not unlocked yet, still allow if any ranch horse (user may be early game)
      // Spec: shipping after first autumn. Means unlock when shippingUnlocked && free horse.
      if(!gs.ranch.shippingUnlocked){
        // still unlock means icon if own horses (can prepare); actual use limited later
        return (gs.horses||[]).some(function(h){ return h.status==='ranch'||h.status==='transit'; });
      }
      return (gs.horses||[]).some(function(h){ return h.status==='ranch'; });
    }
    return prev(m);
  };
  if(typeof isMeansUnlocked==='function') isMeansUnlocked = window.isMeansUnlocked;
})();

// openCard ranch: render season UI
(function(){
  var prev = window.openCard || (typeof openCard==='function'?openCard:null);
  if(!prev) return;
  window.openCard = function(name){
    prev(name);
    if(name==='ranch'){
      ensureRanchSeason();
      sanitizeInv();
      renderSeasonBar();
      renderSeasonActions();
      if(typeof renderRanchHorseList==='function') renderRanchHorseList();
    }
  };
  if(typeof openCard==='function') openCard = window.openCard;
})();

// boot
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    sanitizeInv();
    ensureRanchSeason();
    fixPrepLabelsNow();
    renderSeasonBar();
    renderSeasonActions();
  }, 80);
});

console.log('[horses v2] seasonal + NaN/label fixes');
})();
`;

if (!h.includes('[horses v2]')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + ADDON + '\n' + h.slice(last);
  console.log('v2 addon inserted');
} else {
  console.log('v2 already present — skip insert');
}

fs.writeFileSync(HTML, h, 'utf8');

// syntax
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m,
  n = 0,
  fail = false;
while ((m = re.exec(h))) {
  if (!m[1] || m[1].length < 3000) continue;
  try {
    new Function(m[1]);
    console.log('OK', n);
  } catch (e) {
    console.error('FAIL', n, e.message);
    fail = true;
  }
  n++;
}

console.log('DONE', {
  iron: h.includes("CFG.start.iron"),
  prepFix: h.includes('q.qty!=null'),
  v2: h.includes('[horses v2]'),
  seasonPanel: h.includes('ranch-season-panel'),
  fail,
});
if (fail) process.exit(1);
