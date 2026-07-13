/**
 * Fix residual transport UI stuck on other phases + expose openStrayHorseEvent
 * Target: mou_isso_v0_6_1.html
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_phase_residue_' + Date.now(), h, 'utf8');

// 1) Expose openStrayHorseEvent on window (fix console warning)
h = h.replace(
  /function openStrayHorseEvent\(\)\{/,
  'function openStrayHorseEvent(){ window.openStrayHorseEvent = openStrayHorseEvent;\n'
);
// also assign at end of function definition block - better add explicit window assign after function
if (!h.includes('window.openStrayHorseEvent = openStrayHorseEvent')) {
  h = h.replace(
    /function openStrayHorseEvent\(\)\{ window\.openStrayHorseEvent = openStrayHorseEvent;\n/,
    'function openStrayHorseEvent(){\n'
  );
  h = h.replace(
    /function openStrayHorseEvent\(\)\{/,
    'function openStrayHorseEvent(){'
  );
  // After confirmStrayHorses assignment area - add after function openStrayHorseEvent complete
  // Simpler: in tryOpenStray use window
  h = h.replace(
    /if\(typeof openStrayHorseEvent==='function'\) openStrayHorseEvent\(\);\s*else console\.warn\('openStrayHorseEvent missing'\);/,
    `if(typeof window.openStrayHorseEvent==='function') window.openStrayHorseEvent();
    else if(typeof openStrayHorseEvent==='function') openStrayHorseEvent();
    else console.warn('openStrayHorseEvent missing');`
  );
  // Assign window right after function declaration ends - find "function openStrayHorseEvent" body end is hard
  // Add at start of horses after function defined:
  h = h.replace(
    /function grantHorseFind\(\)\{/,
    `window.openStrayHorseEvent = openStrayHorseEvent;\nfunction grantHorseFind(){`
  );
  console.log('exposed openStrayHorseEvent');
}

// 2) Phase panel hard hide addon
const ADDON = `
// ═══ phase UI residue fix ═══
(function(){
'use strict';
if(window.__phaseResidueFix) return;
window.__phaseResidueFix = true;

function hideEl(el){
  if(!el) return;
  el.style.setProperty('display','none','important');
  el.classList.remove('show','active','on');
}
function showEl(el, display){
  if(!el) return;
  el.style.setProperty('display', display||'block', 'important');
}

function syncPhaseUI(p){
  p = p || (typeof gs!=='undefined' && gs.phase) || 'letter';
  var sm=document.getElementById('sec-management');
  var st=document.getElementById('sec-transport');
  var sr=document.getElementById('sec-result');

  // sections
  if(p==='management'){ showEl(sm,'block'); hideEl(st); hideEl(sr); }
  else if(p==='transport'){ hideEl(sm); showEl(st,'block'); hideEl(sr); }
  else if(p==='result'){ hideEl(sm); hideEl(st); showEl(sr,'block'); }
  else { // letter or other
    hideEl(sm); hideEl(st); hideEl(sr);
  }

  // complete rows
  var am=document.getElementById('ph-actions-mgmt');
  var at=document.getElementById('ph-actions-trans');
  var ar=document.getElementById('ph-actions-result');
  hideEl(am); hideEl(at); hideEl(ar);
  if(p==='management'){ if(am){ am.classList.add('show'); showEl(am,'flex'); } }
  if(p==='transport'){ if(at){ at.classList.add('show'); showEl(at,'flex'); } }
  if(p==='result'){ if(ar){ ar.classList.add('show'); showEl(ar,'flex'); } }

  // never leave transport tab contents active outside transport
  if(p!=='transport'){
    document.querySelectorAll('.tp-tab-content').forEach(function(el){
      el.classList.remove('active');
      el.style.setProperty('display','none','important');
    });
    document.querySelectorAll('#sec-transport .prep-panel, #sec-transport .normal-trans, #sec-transport .sortie-area').forEach(function(el){
      // leave for when transport reopens; parent sec is hidden
    });
  } else {
    // restore active tab display rules
    document.querySelectorAll('.tp-tab-content').forEach(function(el){
      if(el.classList.contains('active')) el.style.setProperty('display','block','important');
      else el.style.setProperty('display','none','important');
    });
  }

  // step bar classes (visual)
  var steps=['letter','management','transport','result'];
  document.querySelectorAll('.step').forEach(function(s,i){
    s.classList.remove('active','done');
    var idx=steps.indexOf(p);
    if(i<idx) s.classList.add('done');
    else if(i===idx) s.classList.add('active');
  });
}
window.syncPhaseUI = syncPhaseUI;

// chain setPhase outermost
if(typeof setPhase==='function' || typeof window.setPhase==='function'){
  var __spRes = window.setPhase || setPhase;
  window.setPhase = function(p){
    __spRes(p);
    try{ syncPhaseUI(p); }catch(e){ console.warn('syncPhaseUI', e); }
  };
  if(typeof setPhase==='function') setPhase = window.setPhase;
}

// also after goToMgmt / goToTransport / goToResult
['goToMgmt','goToTransport','goToResult','goToNextTurn'].forEach(function(fn){
  var f = window[fn] || (typeof eval==='function' ? null : null);
  try{ f = window[fn]; }catch(e){}
  if(typeof window[fn]==='function'){
    var orig = window[fn];
    window[fn] = function(){
      var r = orig.apply(this, arguments);
      try{ syncPhaseUI(gs.phase); }catch(e){}
      return r;
    };
  }
});

// boot
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){ syncPhaseUI(gs.phase||'letter'); }, 60);
  setTimeout(function(){ syncPhaseUI(gs.phase||'letter'); }, 250);
});

console.log('[phase residue] sync ready');
})();
`;

if (!h.includes('[phase residue]')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + ADDON + '\n' + h.slice(last);
  console.log('phase residue addon inserted');
} else {
  console.log('phase residue already present');
}

// CSS harden: hide transport section unless body or by default keep existing
const css = `
/* phase residue: transport tabs never leak */
body:not(.phase-transport) #sec-transport,
body:not(.phase-transport) #ph-actions-trans {
  display: none !important;
}
body:not(.phase-management) #ph-actions-mgmt { display: none !important; }
body:not(.phase-result) #ph-actions-result,
body:not(.phase-result) #sec-result { display: none !important; }
body.phase-transport #sec-transport { display: block !important; }
body.phase-management #sec-management { display: block !important; }
body.phase-result #sec-result { display: block !important; }
`;
// syncPhaseUI should also set body class
if (!h.includes('body:not(.phase-transport) #sec-transport')) {
  h = h.replace('</style>', css + '\n</style>');
  console.log('css residue');
}

// Enhance syncPhaseUI in the string we just added - need body class
// Patch the inserted addon
h = h.replace(
  `function syncPhaseUI(p){
  p = p || (typeof gs!=='undefined' && gs.phase) || 'letter';
  var sm=document.getElementById('sec-management');
  var st=document.getElementById('sec-transport');
  var sr=document.getElementById('sec-result');`,
  `function syncPhaseUI(p){
  p = p || (typeof gs!=='undefined' && gs.phase) || 'letter';
  if(document.body){
    document.body.classList.remove('phase-letter','phase-management','phase-transport','phase-result');
    document.body.classList.add('phase-'+p);
  }
  var sm=document.getElementById('sec-management');
  var st=document.getElementById('sec-transport');
  var sr=document.getElementById('sec-result');`
);

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
  residue: h.includes('[phase residue]'),
  openStrayWin: h.includes('window.openStrayHorseEvent = openStrayHorseEvent'),
  css: h.includes('body:not(.phase-transport) #sec-transport'),
  fail,
});
if (fail) process.exit(1);
