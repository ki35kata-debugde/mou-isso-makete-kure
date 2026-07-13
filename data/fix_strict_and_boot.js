/**
 * Fix ReferenceError in strict IIFE (isMeansUnlocked=...) and guarantee letter boot.
 * Target: mou_isso_v0_6_1.html
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_strict_' + Date.now(), h, 'utf8');

// 1) In horses v1 safe IIFE: assign via window.* only
// Replace bare assignments that break strict mode
const replacements = [
  [/([^.\w])isMeansUnlocked\s*=\s*function/g, '$1window.isMeansUnlocked=function'],
  [/([^.\w])stockOf\s*=\s*function/g, '$1window.stockOf=function'],
  [/([^.\w])takeStock\s*=\s*function/g, '$1window.takeStock=function'],
  [/([^.\w])openCard\s*=\s*function/g, '$1window.openCard=function'],
  [/([^.\w])handDeliver\s*=\s*function/g, '$1window.handDeliver=function'],
  [/([^.\w])changePrepQty\s*=\s*function/g, '$1window.changePrepQty=function'],
  [/([^.\w])goToNextTurn\s*=\s*function/g, '$1window.goToNextTurn=function'],
  [/([^.\w])buildResultScreen\s*=\s*function/g, '$1window.buildResultScreen=function'],
  [/([^.\w])applySaveData\s*=\s*function/g, '$1window.applySaveData=function'],
  [/([^.\w])updateTransportUI\s*=\s*function/g, '$1window.updateTransportUI=function'],
  [/([^.\w])selectTransTab\s*=\s*function/g, '$1window.selectTransTab=function'],
  [/([^.\w])cmdClick\s*=\s*function/g, '$1window.cmdClick=function'],
  [/([^.\w])setPhase\s*=\s*function/g, '$1window.setPhase=function'],
  [/([^.\w])openLetterOverlay\s*=\s*function/g, '$1window.openLetterOverlay=function'],
  [/([^.\w])stockForItem\s*=\s*function/g, '$1window.stockForItem=function'],
];

// Only apply inside horses + bugfix sections to avoid breaking function declarations
// Safer: fix the exact horses block lines
const horsesStart = h.indexOf('// ═══ Horses v1 safe');
const bugStart = h.indexOf('// ═══ bugfix on v0.6.1');
const mapBoot = h.indexOf("document.addEventListener('DOMContentLoaded',()=>{\n  document.querySelectorAll('.node')");

if (horsesStart < 0) {
  console.error('horses block missing');
  process.exit(1);
}

// Split: before horses | horses..end | after
// End of horses is console.log('[horses v1 safe]...
const horsesEndMarker = "console.log('[horses v1 safe] ready on v0.6.1 base');\n})();";
const horsesEnd = h.indexOf(horsesEndMarker, horsesStart);
if (horsesEnd < 0) {
  console.error('horses end missing');
  process.exit(1);
}
const horsesEndPos = horsesEnd + horsesEndMarker.length;

let horsesBlock = h.slice(horsesStart, horsesEndPos);

// Fix typeof checks and assignments
horsesBlock = horsesBlock.replace(
  /var __imu = typeof isMeansUnlocked==='function' \? isMeansUnlocked : null;\nisMeansUnlocked = function\(m\)\{/,
  `var __imu = (typeof window.isMeansUnlocked==='function') ? window.isMeansUnlocked : (typeof isMeansUnlocked==='function' ? isMeansUnlocked : null);
window.isMeansUnlocked = function(m){`
);

// Fix recursive isMeansUnlocked('cart') inside - uses window which is fine
horsesBlock = horsesBlock.replace(
  /return !!\(gs\.cleared&&gs\.cleared\.horse&&gs\.cleared\.horse\.indexOf\(2\)>=0\) &&\s*isMeansUnlocked\('cart'\) && hasHorseMeans\(\);/,
  `return !!(gs.cleared&&gs.cleared.horse&&gs.cleared.horse.indexOf(2)>=0) &&
      (window.isMeansUnlocked('cart')) && hasHorseMeans();`
);
// Wait that recurses into our wrapper - for cart should call __imu
horsesBlock = horsesBlock.replace(
  /if\(m==='wagon'\)\{\s*return !!\(gs\.cleared&&gs\.cleared\.horse&&gs\.cleared\.horse\.indexOf\(2\)>=0\) &&\s*\(window\.isMeansUnlocked\('cart'\)\) && hasHorseMeans\(\);\s*\}/,
  `if(m==='wagon'){
    var cartOk = __imu ? __imu('cart') : false;
    return !!(gs.cleared&&gs.cleared.horse&&gs.cleared.horse.indexOf(2)>=0) && cartOk && hasHorseMeans();
  }`
);

horsesBlock = horsesBlock.replace(
  /var __stockOf = typeof stockOf==='function' \? stockOf : null;\nstockOf = function\(id\)\{/,
  `var __stockOf = (typeof window.stockOf==='function') ? window.stockOf : (typeof stockOf==='function' ? stockOf : null);
window.stockOf = function(id){
  if(id==='food'||id==='food_mat') return (gs.inv&&gs.inv.food)||0;
  if(id==='sword') return (gs.stock&&gs.stock.sword)||0;
  if(id==='siege_w') return (gs.stock&&gs.stock.siege_w)||0;
  if(id==='med') return (gs.stock&&gs.stock.med)||0;
`
);

horsesBlock = horsesBlock.replace(
  /var __takeStock = typeof takeStock==='function' \? takeStock : null;\ntakeStock = function\(id,q\)\{/,
  `var __takeStock = (typeof window.takeStock==='function') ? window.takeStock : (typeof takeStock==='function' ? takeStock : null);
window.takeStock = function(id,q){`
);

horsesBlock = horsesBlock.replace(
  /var __oc = typeof openCard==='function' \? openCard : null;\nif\(__oc\)\{\s*openCard = function\(name\)\{/,
  `var __oc = (typeof window.openCard==='function') ? window.openCard : (typeof openCard==='function' ? openCard : null);
if(__oc){
  window.openCard = function(name){`
);

horsesBlock = horsesBlock.replace(
  /var __utu = typeof updateTransportUI==='function' \? updateTransportUI : null;\nif\(__utu\)\{\s*updateTransportUI = function\(\)\{/,
  `var __utu = (typeof window.updateTransportUI==='function') ? window.updateTransportUI : (typeof updateTransportUI==='function' ? updateTransportUI : null);
if(__utu){
  window.updateTransportUI = function(){`
);

horsesBlock = horsesBlock.replace(
  /var __hand = typeof handDeliver==='function' \? handDeliver : null;\nif\(__hand\)\{\s*handDeliver = function\(key\)\{/,
  `var __hand = (typeof window.handDeliver==='function') ? window.handDeliver : (typeof handDeliver==='function' ? handDeliver : null);
if(__hand){
  window.handDeliver = function(key){`
);

horsesBlock = horsesBlock.replace(
  /var __cpq = typeof changePrepQty==='function' \? changePrepQty : null;\nif\(__cpq\)\{\s*changePrepQty = function\(key, delta\)\{/,
  `var __cpq = (typeof window.changePrepQty==='function') ? window.changePrepQty : (typeof changePrepQty==='function' ? changePrepQty : null);
if(__cpq){
  window.changePrepQty = function(key, delta){`
);

horsesBlock = horsesBlock.replace(
  /var __gn = typeof goToNextTurn==='function' \? goToNextTurn : null;\nif\(__gn\)\{\s*goToNextTurn = function\(\)\{/,
  `var __gn = (typeof window.goToNextTurn==='function') ? window.goToNextTurn : (typeof goToNextTurn==='function' ? goToNextTurn : null);
if(__gn){
  window.goToNextTurn = function(){`
);

horsesBlock = horsesBlock.replace(
  /var __br = typeof buildResultScreen==='function' \? buildResultScreen : null;\nif\(__br\)\{\s*buildResultScreen = function\(\)\{/,
  `var __br = (typeof window.buildResultScreen==='function') ? window.buildResultScreen : (typeof buildResultScreen==='function' ? buildResultScreen : null);
if(__br){
  window.buildResultScreen = function(){`
);

horsesBlock = horsesBlock.replace(
  /var __as = typeof applySaveData==='function' \? applySaveData : null;\nif\(__as\)\{\s*applySaveData = function\(data\)\{/,
  `var __as = (typeof window.applySaveData==='function') ? window.applySaveData : (typeof applySaveData==='function' ? applySaveData : null);
if(__as){
  window.applySaveData = function(data){`
);

// Wrap entire horses IIFE body in try/catch so boot always continues
if (!horsesBlock.includes('try{ /* horses safe wrap */')) {
  horsesBlock = horsesBlock.replace(
    "(function(){\n'use strict';\nif(window.__horsesV1Safe) return;\nwindow.__horsesV1Safe = true;",
    `(function(){
'use strict';
if(window.__horsesV1Safe) return;
window.__horsesV1Safe = true;
try{ /* horses safe wrap */`
  );
  horsesBlock = horsesBlock.replace(
    "console.log('[horses v1 safe] ready on v0.6.1 base');\n})();",
    `console.log('[horses v1 safe] ready on v0.6.1 base');
}catch(err){ console.error('[horses v1 safe] FAILED', err); }
})();`
  );
}

h = h.slice(0, horsesStart) + horsesBlock + h.slice(horsesEndPos);
console.log('horses block patched for strict mode');

// 2) Fix bugfix block similarly for bare assignments
const bugStart2 = h.indexOf('// ═══ bugfix on v0.6.1');
const mapBoot2 = h.indexOf("document.addEventListener('DOMContentLoaded',()=>{\n  document.querySelectorAll('.node')");
if (bugStart2 > 0 && mapBoot2 > bugStart2) {
  let bug = h.slice(bugStart2, mapBoot2);
  bug = bug.replace(/\nstockOf = function/g, '\nwindow.stockOf = function');
  bug = bug.replace(/\nstockForItem = function/g, '\nwindow.stockForItem = function');
  bug = bug.replace(/\nopenLetterOverlay = function/g, '\nwindow.openLetterOverlay = function');
  bug = bug.replace(/\nopenCard = function/g, '\nwindow.openCard = function');
  bug = bug.replace(/\ncmdClick = function/g, '\nwindow.cmdClick = function');
  bug = bug.replace(/\nselectTransTab = function/g, '\nwindow.selectTransTab = function');
  bug = bug.replace(/\nsetPhase = function/g, '\nwindow.setPhase = function');
  // var __olo = openLetterOverlay without window
  bug = bug.replace(
    /var __olo = openLetterOverlay;\nwindow\.openLetterOverlay = function/,
    'var __olo = window.openLetterOverlay || openLetterOverlay;\nwindow.openLetterOverlay = function'
  );
  bug = bug.replace(
    /var __ocFix = openCard;\n  window\.openCard = function/,
    'var __ocFix = window.openCard || openCard;\n  window.openCard = function'
  );
  bug = bug.replace(
    /var __cc = cmdClick;\n  window\.cmdClick = function/,
    'var __cc = window.cmdClick || cmdClick;\n  window.cmdClick = function'
  );
  bug = bug.replace(
    /var __stt = selectTransTab;\n  window\.selectTransTab = function/,
    'var __stt = window.selectTransTab || selectTransTab;\n  window.selectTransTab = function'
  );
  bug = bug.replace(
    /var __spFix = setPhase;\n  window\.setPhase = function/,
    'var __spFix = window.setPhase || setPhase;\n  window.setPhase = function'
  );
  // Wrap bugfix in try/catch
  if (!bug.includes('try{ /* bugfix wrap */')) {
    bug = bug.replace(
      "(function(){\n'use strict';\nif(window.__v061BugFix) return;\nwindow.__v061BugFix = true;",
      `(function(){
'use strict';
if(window.__v061BugFix) return;
window.__v061BugFix = true;
try{ /* bugfix wrap */`
    );
    bug = bug.replace(
      "console.log('[v061 bugfix] letter/ranch/stock');\n})();\n",
      `console.log('[v061 bugfix] letter/ranch/stock');
}catch(err){ console.error('[v061 bugfix] FAILED', err); }
})();
`
    );
  }
  h = h.slice(0, bugStart2) + bug + h.slice(mapBoot2);
  console.log('bugfix block patched');
}

// 3) Absolute letter boot AFTER all scripts content — inject final boot that cannot be skipped
const FINAL_BOOT = `
// ═══ FINAL letter boot (must run) ═══
(function(){
  function bootLetter(){
    try{
      var ov=document.getElementById('overlay');
      if(ov){ ov.classList.add('on'); ov.style.display='block'; }
      if(typeof openLetterOverlay==='function') openLetterOverlay();
      else if(typeof window.openLetterOverlay==='function') window.openLetterOverlay();
    }catch(e){ console.warn('FINAL letter boot', e); }
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', function(){
      bootLetter();
      setTimeout(bootLetter, 30);
      setTimeout(bootLetter, 150);
    });
  } else {
    bootLetter();
    setTimeout(bootLetter, 30);
  }
  console.log('[FINAL letter boot] registered');
})();
`;

if (!h.includes('[FINAL letter boot]')) {
  // before last </script>
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + FINAL_BOOT + '\n' + h.slice(last);
  console.log('FINAL letter boot added');
}

// 4) Ensure tryGoToMgmt still works - goToMgmt shouldn't be broken
// Check if goToMgmt was overwritten incorrectly - shouldn't be

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

// verify no bare isMeansUnlocked =
const bad = /[^.\w]isMeansUnlocked\s*=\s*function/.test(h.slice(h.indexOf('Horses v1 safe')));
console.log('DONE', {
  windowAssign: h.includes('window.isMeansUnlocked = function') || h.includes('window.isMeansUnlocked=function'),
  finalBoot: h.includes('[FINAL letter boot]'),
  tryCatch: h.includes('horses safe wrap'),
  bareAssignLeft: bad,
  fail,
});
if (fail) process.exit(1);
