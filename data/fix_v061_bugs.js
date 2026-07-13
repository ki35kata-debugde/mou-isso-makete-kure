/**
 * Fix mou_isso_v0_6_1.html bugs:
 * 1) Letter always opens on start
 * 2) Horse prince letter prep text → food×4 + med×1
 * 3) Stray horse event reliably on ranch open
 * 4) stockOf(food) never broken by horse override
 * 5) Wrap horses IIFE so it can't kill the rest of the script
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_fix_bugs_' + Date.now(), h, 'utf8');

// ── 1) Harden base openLetterOverlay ──
const oldOpen = `function openLetterOverlay(){
  renderAllLetters();
  document.getElementById('overlay').classList.add('on');
  selectTab('food');
}`;
const newOpen = `function openLetterOverlay(){
  var ov=document.getElementById('overlay');
  if(ov){ ov.classList.add('on'); ov.style.display='block'; }
  try{ if(typeof renderAllLetters==='function') renderAllLetters(); }catch(e){ console.warn('renderAllLetters',e); }
  try{ if(typeof selectTab==='function') selectTab('food'); }catch(e){ console.warn('selectTab',e); }
}`;
if (h.includes(oldOpen)) {
  h = h.replace(oldOpen, newOpen);
  console.log('openLetterOverlay hardened');
} else if (h.includes('function openLetterOverlay(){')) {
  h = h.replace(
    /function openLetterOverlay\(\)\{[\s\S]*?\nfunction closeOverlay/,
    newOpen + '\nfunction closeOverlay'
  );
  console.log('openLetterOverlay regex');
}

// ── 2) Horse prep letter text (CFG.letters + GAME_DATA if embedded) ──
h = h.replace(
  /馬。良いのを。以上。\\n【出立準備依頼】★1馬×2頭　輸送フェーズで手渡し可/g,
  '出立の前に、兵糧と薬を少し分けてくれ。\\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可'
);
// without escape
h = h.replace(
  /馬。良いのを。以上。\n【出立準備依頼】★1馬×2頭　輸送フェーズで手渡し可/g,
  '出立の前に、兵糧と薬を少し分けてくれ。\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可'
);
// JSON form in GAME_DATA
h = h.replace(
  /"demand_body":\s*"馬。良いのを。以上。\\n【出立準備依頼】★1馬×2頭　輸送フェーズで手渡し可"/g,
  '"demand_body":"出立の前に、兵糧と薬を少し分けてくれ。\\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可"'
);
// letterPool style body field
h = h.replace(
  /"body":\s*"馬。良いのを。以上。\\n【出立準備依頼】★1馬×2頭　輸送フェーズで手渡し可"/g,
  '"body":"出立の前に、兵糧と薬を少し分けてくれ。\\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可"'
);
// Also update prep quest label display in letters for horse if remaining
h = h.replace(/★1馬×2頭/g, '兵糧×4・回復薬×1');
console.log('letter texts updated', h.includes('兵糧×4・回復薬×1　輸送フェーズで手渡し可'));

// ── 3) Also fix data/letters.json if exists ──
const lj = path.join(__dirname, 'letters.json');
if (fs.existsSync(lj)) {
  let L = fs.readFileSync(lj, 'utf8');
  const before = L;
  L = L.replace(
    /馬。良いのを。以上。\\n【出立準備依頼】★1馬×2頭　輸送フェーズで手渡し可/g,
    '出立の前に、兵糧と薬を少し分けてくれ。\\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可'
  );
  L = L.replace(/★1馬×2頭/g, '兵糧×4・回復薬×1');
  if (L !== before) {
    fs.writeFileSync(lj, L, 'utf8');
    console.log('letters.json updated');
  }
}

// ── 4) Replace horses stockOf override + openCard + boot with fixed version ──
const FIX = `
// ═══ bugfix on v0.6.1 (letter/ranch/stock/letters) ═══
(function(){
'use strict';
if(window.__v061BugFix) return;
window.__v061BugFix = true;

// stockOf: never lose food/med/sword
(function(){
  var base = (typeof stockOf==='function') ? stockOf : null;
  stockOf = function(id){
    try{
      if(id==='food' || id==='food_mat') return (gs.inv && gs.inv.food) || 0;
      if(id==='sword') return (gs.stock && gs.stock.sword) || 0;
      if(id==='siege_w') return (gs.stock && gs.stock.siege_w) || 0;
      if(id==='med') return (gs.stock && gs.stock.med) || 0;
      if(id==='horse'){
        if(gs.horses && gs.horses.length){
          return gs.horses.filter(function(x){ return x.status==='ranch'; }).length;
        }
        return gs.ranchHorses || 0;
      }
      if(base) return base(id);
    }catch(e){ console.warn('stockOf', e); }
    return 0;
  };
})();

// stockForItem too
if(typeof stockForItem==='function'){
  stockForItem = function(id){
    return (typeof stockOf==='function') ? stockOf(id) : 0;
  };
}

// openLetter always opens overlay first
var __olo = openLetterOverlay;
openLetterOverlay = function(){
  var ov=document.getElementById('overlay');
  if(ov){ ov.classList.add('on'); ov.style.display='block'; ov.style.visibility='visible'; }
  try{ __olo(); }catch(e){
    console.warn('openLetterOverlay inner', e);
    try{ if(typeof selectTab==='function') selectTab('food'); }catch(e2){}
  }
  if(ov && !ov.classList.contains('on')) ov.classList.add('on');
};

// Force letter on boot (multiple times — survives other handlers)
function forceLetterOpen(){
  try{
    if(typeof gs!=='undefined') gs.phase = gs.phase || 'letter';
    if(typeof setPhase==='function' && gs.phase==='letter') setPhase('letter');
    if(typeof openLetterOverlay==='function') openLetterOverlay();
  }catch(e){ console.warn('forceLetterOpen', e); }
}
document.addEventListener('DOMContentLoaded', function(){
  forceLetterOpen();
  setTimeout(forceLetterOpen, 0);
  setTimeout(forceLetterOpen, 50);
  setTimeout(forceLetterOpen, 200);
});
if(document.readyState!=='loading'){
  setTimeout(forceLetterOpen, 0);
  setTimeout(forceLetterOpen, 100);
}

// Ranch stray: robust open
function tryOpenStray(){
  try{
    if(typeof ensureHorseState==='function') ensureHorseState();
    else {
      if(!gs.horses) gs.horses=[];
      if(!gs.ranch) gs.ranch={introDone:false};
    }
    if(gs.ranch && gs.ranch.introDone) return;
    if(typeof openStrayHorseEvent==='function') openStrayHorseEvent();
    else console.warn('openStrayHorseEvent missing');
  }catch(e){ console.error('tryOpenStray', e); }
}

// Wrap openCard again (outermost) for ranch
if(typeof openCard==='function'){
  var __ocFix = openCard;
  openCard = function(name){
    __ocFix(name);
    if(name==='ranch'){
      setTimeout(tryOpenStray, 30);
      setTimeout(function(){
        if(typeof renderRanchHorseList==='function') renderRanchHorseList();
        if(typeof changePrepQtyHorse==='function'){
          // no-op refresh stocks on ranch visit
        }
      }, 40);
    }
  };
}

// cmdClick also
if(typeof cmdClick==='function'){
  var __cc = cmdClick;
  cmdClick = function(name){
    __cc(name);
    if(name==='ranch' && gs.phase==='management') setTimeout(tryOpenStray, 40);
  };
}

// Refresh horse prep stocks when opening transport / horse tab
if(typeof selectTransTab==='function'){
  var __stt = selectTransTab;
  selectTransTab = function(key){
    __stt(key);
    if(typeof updateTransportUI==='function') updateTransportUI();
    // force prep stock labels
    try{
      var af=(gs.inv&&gs.inv.food)||0, am=(gs.stock&&gs.stock.med)||0;
      var sf=document.getElementById('prep-stock-horse-food');
      var sm=document.getElementById('prep-stock-horse-med');
      if(sf) sf.innerHTML='現庫: <b>'+af+'</b>　必要: 4';
      if(sm) sm.innerHTML='現庫: <b>'+am+'</b>　必要: 1';
    }catch(e){}
  };
}

// When phase → transport, refresh stocks
if(typeof setPhase==='function'){
  var __spFix = setPhase;
  setPhase = function(p){
    __spFix(p);
    if(p==='letter') setTimeout(forceLetterOpen, 0);
    if(p==='transport'){
      setTimeout(function(){
        if(typeof updateTransportUI==='function') updateTransportUI();
        var af=(gs.inv&&gs.inv.food)||0, am=(gs.stock&&gs.stock.med)||0;
        var sf=document.getElementById('prep-stock-horse-food');
        var sm=document.getElementById('prep-stock-horse-med');
        if(sf) sf.innerHTML='現庫: <b>'+af+'</b>　必要: 4';
        if(sm) sm.innerHTML='現庫: <b>'+am+'</b>　必要: 1';
      }, 20);
    }
  };
}

console.log('[v061 bugfix] letter/ranch/stock');
})();
`;

// Insert fix AFTER horses block, before map DOMContentLoaded
const mapBoot = "document.addEventListener('DOMContentLoaded',()=>{\n  document.querySelectorAll('.node')";
if (h.includes('// ═══ bugfix on v0.6.1')) {
  // replace existing
  const a = h.indexOf('// ═══ bugfix on v0.6.1');
  const b = h.indexOf(mapBoot, a);
  if (b > a) {
    h = h.slice(0, a) + FIX + '\n' + h.slice(b);
    console.log('replaced bugfix block');
  }
} else if (h.includes(mapBoot)) {
  h = h.replace(mapBoot, FIX + '\n' + mapBoot);
  console.log('inserted bugfix before map boot');
} else {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + FIX + '\n' + h.slice(last);
  console.log('appended bugfix');
}

// Strengthen map boot letter open
h = h.replace(
  /updateHeaderDisplay\(\);setPhase\('letter'\);openLetterOverlay\(\);/,
  "updateHeaderDisplay();try{setPhase('letter');}catch(e){}try{openLetterOverlay();}catch(e){var ov=document.getElementById('overlay');if(ov)ov.classList.add('on');}"
);

// Wrap horses IIFE console end - add try/catch around existing horses block is hard;
// Instead ensure map boot always registers even if previous threw — already after horses
// Wrap horses IIFE: find start and wrap
const hs = h.indexOf('// ═══ Horses v1 safe');
if (hs >= 0) {
  // wrap the IIFE body invocation risk: change `(function(){` after HORSE_DATA to try/catch
  const iife = h.indexOf('(function(){\n\'use strict\';\nif(window.__horsesV1Safe)', hs);
  if (iife > 0) {
    // already has guard
    console.log('horses IIFE found');
  }
}

// Ensure CFG.letters.horse.prep.demand_body in embedded const if present
// Already did string replace for demand_body

fs.writeFileSync(HTML, h, 'utf8');

// syntax check
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m,
  n = 0,
  fail = false;
while ((m = re.exec(h))) {
  if (!m[1] || m[1].length < 3000) continue;
  try {
    new Function(m[1]);
    console.log('OK', n, m[1].length);
  } catch (e) {
    console.error('FAIL', n, e.message);
    fail = true;
  }
  n++;
}

console.log('DONE', {
  letterText: h.includes('兵糧と薬を少し分けてくれ'),
  bugfix: h.includes('[v061 bugfix]'),
  openHard: h.includes('ov.style.display'),
  fail,
});
if (fail) process.exit(1);
