/**
 * Bedtime polish:
 * - Winter: food AND med both allowed (separate flags)
 * - Horse letter: hard-force prep demand text on every open/tab
 * - Transport residue: stronger hide
 * - Foals: 1～2 (raise chance of 2; still random)
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_bedtime_' + Date.now(), h, 'utf8');

// ── Winter: separate flags ──
h = h.replace(
  /if\(gs\.ranch\.winterFed==null\) gs\.ranch\.winterFed=false;/,
  `if(gs.ranch.winterFoodDone==null) gs.ranch.winterFoodDone=false;
  if(gs.ranch.winterMedDone==null) gs.ranch.winterMedDone=false;
  if(gs.ranch.winterFed==null) gs.ranch.winterFed=false; // legacy`
);

// replace winter UI block in renderSeasonActions
const winterOld = `  } else if(s===3){ // 冬: feed
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
  }`;

const winterNew = `  } else if(s===3){ // 冬: feed BOTH independently
    var b1=document.createElement('button');
    b1.textContent=gs.ranch.winterFoodDone ? '✓ 兵糧は与えた' : '全馬に兵糧をやる（1頭1兵糧）';
    b1.disabled=!!gs.ranch.winterFoodDone;
    b1.onclick=function(){ winterFeedFood(); };
    var b2=document.createElement('button');
    b2.textContent=gs.ranch.winterMedDone ? '✓ 回復薬は与えた' : 'つがいに回復薬（仔の★+0.5）';
    b2.disabled=!!gs.ranch.winterMedDone;
    b2.onclick=function(){ winterFeedMed(); };
    box.appendChild(b1); box.appendChild(b2);
    var msg='冬です。<strong>兵糧と回復薬は両方</strong>与えられます（どちらか一方でも可）。';
    msg+=' 薬は<strong>翌春の仔馬のランクだけ</strong>上がります。';
    if(gs.ranch.winterFoodDone) msg+='（兵糧済）';
    if(gs.ranch.winterMedDone) msg+='（薬済）';
    setSeasonMsg(msg);
  }`;

if (h.includes(winterOld)) {
  h = h.replace(winterOld, winterNew);
  console.log('winter both feeds UI');
} else {
  console.warn('winter block exact match failed — soft replace');
  h = h.replace(
    /} else if\(s===3\)\{ \/\/ 冬: feed[\s\S]*?\} else if\(s===0\)\{/,
    winterNew + ' else if(s===0){'
  );
}

// winterFeedFood / Med: don't set shared winterFed that blocks the other
h = h.replace(
  /function winterFeedFood\(\)\{[\s\S]*?gs\.ranch\.winterFed=true;\s*showToast\('全馬に兵糧を与えました/,
  `function winterFeedFood(){
  ensureRanchSeason();
  if(gs.ranch.winterFoodDone){ showToast('今冬の兵糧は済みです'); return; }
  var list=gs.horses.filter(function(h){ return h.status==='ranch'||h.status==='paired'; });
  var need=list.length;
  if(need<=0){ showToast('馬がいません'); return; }
  if((gs.inv.food||0)<need){ showToast('兵糧が足りません（必要'+need+'）'); return; }
  gs.inv.food-=need;
  list.forEach(function(h){ h.winterFood=(h.winterFood||0)+1; });
  gs.ranch.winterFoodDone=true;
  showToast('全馬に兵糧を与えました`
);

h = h.replace(
  /function winterFeedMed\(\)\{[\s\S]*?gs\.ranch\.winterFed=true;\s*showToast\('つがいに回復薬を与えました/,
  `function winterFeedMed(){
  ensureRanchSeason();
  if(gs.ranch.winterMedDone){ showToast('今冬の回復薬は済みです'); return; }
  var pairs=gs.ranch.pairs||[];
  if(!pairs.length){ showToast('つがいがいません'); return; }
  var need=pairs.length;
  if((gs.stock.med||0)<need){ showToast('回復薬が足りません（つがい1組につき1）'); return; }
  gs.stock.med-=need;
  pairs.forEach(function(p){ p.medBonus=(p.medBonus||0)+0.5; });
  gs.ranch.winterMedDone=true;
  showToast('つがいに回復薬を与えました`
);

// reset both on spring
h = h.replace(
  /gs\.ranch\.winterFed=false;/,
  `gs.ranch.winterFed=false; gs.ranch.winterFoodDone=false; gs.ranch.winterMedDone=false;`
);

// foals: prefer 2 (still 1-2)
h = h.replace(
  /var n=1\+\(Math\.random\(\)<0\.5\?1:0\); \/\/ 1 or 2/,
  'var n=1+(Math.random()<0.7?1:0); // 1 or 2 (70% twin)'
);

// ── Letter hard force ──
const LETTER = `
// ═══ horse letter force (bedtime) ═══
(function(){
'use strict';
if(window.__horseLetterForce) return;
window.__horseLetterForce = true;
var BODY = '出立の前に、兵糧と薬を少し分けてくれ。\\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可';
function forceHorsePrepLetter(){
  try{
    if(!gs || (gs.sortied && gs.sortied.horse) || ((gs.node&&gs.node.horse)>0)) return;
    var dem=document.getElementById('lt-horse-demand');
    if(!dem) return;
    dem.innerHTML='<div class="letter-block"><div class="letter-from">騎馬次（出立前・準備依頼）</div>'+
      '<div class="letter-text" style="white-space:pre-line">'+BODY.replace(/\\\\n/g,'\\n')+'</div></div>';
  }catch(e){}
}
// Patch data sources
function patchLetterData(){
  try{
    if(CFG.letters&&CFG.letters.horse&&CFG.letters.horse.prep){
      CFG.letters.horse.prep.demand_body=BODY.replace(/\\\\n/g,'\\n');
    }
    if(CFG.letterPool&&CFG.letterPool.horse&&CFG.letterPool.horse.demand){
      CFG.letterPool.horse.demand.forEach(function(e){
        if(e.id==='horse_prep'||(e.when&&e.when.node===0&&!e.when.node_gte)){
          e.body=BODY.replace(/\\\\n/g,'\\n');
        }
      });
    }
    if(typeof GAME_DATA!=='undefined'&&GAME_DATA.letters&&GAME_DATA.letters.horse&&GAME_DATA.letters.horse.demand){
      GAME_DATA.letters.horse.demand.forEach(function(e){
        if(e.id==='horse_prep'||(e.when&&e.when.node===0&&!e.when.node_gte)){
          e.body=BODY.replace(/\\\\n/g,'\\n');
        }
      });
    }
  }catch(e){}
}
patchLetterData();

var __rAll = window.renderAllLetters || (typeof renderAllLetters==='function'?renderAllLetters:null);
if(__rAll){
  window.renderAllLetters=function(){
    patchLetterData();
    __rAll();
    forceHorsePrepLetter();
  };
  if(typeof renderAllLetters==='function') renderAllLetters=window.renderAllLetters;
}
var __st = window.selectTab || (typeof selectTab==='function'?selectTab:null);
if(__st){
  window.selectTab=function(key){
    __st(key);
    if(key==='horse') setTimeout(forceHorsePrepLetter, 0);
  };
  if(typeof selectTab==='function') selectTab=window.selectTab;
}
var __olo = window.openLetterOverlay || (typeof openLetterOverlay==='function'?openLetterOverlay:null);
if(__olo){
  window.openLetterOverlay=function(){
    patchLetterData();
    __olo();
    setTimeout(forceHorsePrepLetter, 0);
    setTimeout(forceHorsePrepLetter, 50);
  };
  if(typeof openLetterOverlay==='function') openLetterOverlay=window.openLetterOverlay;
}
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){ patchLetterData(); forceHorsePrepLetter(); }, 120);
});
console.log('[horse letter force] ready');
})();
`;

// ── Transport residue stronger ──
const RES = `
// ═══ transport residue hard ═══
(function(){
'use strict';
if(window.__transHard) return;
window.__transHard = true;
function hardHideTransport(){
  var st=document.getElementById('sec-transport');
  var at=document.getElementById('ph-actions-trans');
  if(st){ st.style.setProperty('display','none','important'); }
  if(at){ at.style.setProperty('display','none','important'); at.classList.remove('show'); }
  // if any tp content leaked outside (broken DOM), hide active non-hidden parents
  document.querySelectorAll('.tp-tab-content').forEach(function(el){
    if(!st || !st.contains(el)){
      el.style.setProperty('display','none','important');
      el.classList.remove('active');
    }
  });
}
function hardShowTransport(){
  var st=document.getElementById('sec-transport');
  if(st) st.style.setProperty('display','block','important');
  document.querySelectorAll('.tp-tab-content').forEach(function(el){
    el.style.removeProperty('display');
  });
}
var prev = window.syncPhaseUI;
if(typeof prev==='function'){
  window.syncPhaseUI = function(p){
    prev(p);
    p = p || (gs&&gs.phase) || 'letter';
    if(p!=='transport') hardHideTransport();
    else hardShowTransport();
  };
}
// also on every phase button click paths
document.addEventListener('click', function(ev){
  var t=ev.target;
  if(!t) return;
  var txt=(t.textContent||'');
  if(txt.indexOf('輸送フェーズへ')>=0 || txt.indexOf('ターン終了')>=0 || txt.indexOf('次のターン')>=0 || txt.indexOf('経営フェーズ')>=0){
    setTimeout(function(){
      if(gs.phase!=='transport') hardHideTransport();
    }, 0);
    setTimeout(function(){
      if(gs.phase!=='transport') hardHideTransport();
    }, 50);
  }
}, true);
console.log('[transport hard hide] ready');
})();
`;

if (!h.includes('[horse letter force]')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + LETTER + '\n' + RES + '\n' + h.slice(last);
  console.log('letter force + transport hard added');
} else {
  console.log('already has letter force');
}

// game-data.js horse prep body once more
const gd = path.join(__dirname, 'game-data.js');
if (fs.existsSync(gd)) {
  let g = fs.readFileSync(gd, 'utf8');
  const before = g;
  g = g.replace(
    /"body":\s*"馬。良いのを。以上。[\s\S]*?輸送フェーズで手渡し可"/,
    '"body":"出立の前に、兵糧と薬を少し分けてくれ。\\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可"'
  );
  if (g.includes('馬。良いのを')) {
    g = g.replace(/馬。良いのを。以上。\\n【出立準備依頼】[^"]*/g, '出立の前に、兵糧と薬を少し分けてくれ。\\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可');
  }
  if (g !== before) {
    fs.writeFileSync(gd, g, 'utf8');
    console.log('game-data letter updated');
  }
}

fs.writeFileSync(HTML, h, 'utf8');

try {
  const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
  let m,
    n = 0;
  while ((m = re.exec(h))) {
    if (!m[1] || m[1].length < 3000) continue;
    new Function(m[1]);
    console.log('OK', n++);
  }
} catch (e) {
  console.error('FAIL', e.message);
  process.exit(1);
}

console.log('DONE bedtime polish');
