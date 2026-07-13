/**
 * Rebuild working file from clean v0.6.1 base + horses v1 + phase-button harden.
 * Does NOT re-run layout/letter experiments.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = 'C:/Users/kzawa/Downloads/Grok';
const MAIN = path.join(ROOT, 'mou_isso_v0_6.html');
const BASE = path.join(ROOT, 'mou_isso_v0_6_1.html');
const NODE = 'C:/Program Files/nodejs/node.exe';

if (!fs.existsSync(BASE)) {
  console.error('base missing', BASE);
  process.exit(1);
}

// 1) backup current main
fs.copyFileSync(MAIN, MAIN + '.bak_before_rebuild_v061_' + Date.now());
// 2) restore from v0.6.1
fs.copyFileSync(BASE, MAIN);
console.log('restored from v0_6_1', fs.statSync(MAIN).size);

// 3) apply horses (script paths relative)
const scripts = [
  path.join(ROOT, 'data', 'apply_horses_v1.js'),
  path.join(ROOT, 'data', 'fix_ranch_list_dom.js'),
  path.join(ROOT, 'data', 'strip_ranch_buy.js'),
];
for (const s of scripts) {
  console.log('run', path.basename(s));
  execFileSync(NODE, [s], { stdio: 'inherit' });
}

// 4) harden phase complete buttons (must survive any leftover visible rows)
let h = fs.readFileSync(MAIN, 'utf8');

// Ensure IDs still present
const need = {
  mgmt: h.includes('id="ph-actions-mgmt"'),
  trans: h.includes('id="ph-actions-trans"'),
  result: h.includes('id="ph-actions-result"'),
  show: h.includes('showPhaseCompleteRows'),
};
console.log('phase markers after horses', need);

if (!need.mgmt) {
  h = h.replace(
    /<div class="ph-actions">\s*<button class="ph-complete" onclick="goToTransport\(\)">/,
    '<div class="ph-actions" id="ph-actions-mgmt">\n  <button class="ph-complete" onclick="goToTransport()">'
  );
}
if (!need.trans) {
  h = h.replace(
    /<div class="ph-actions">\s*<button class="ph-complete" onclick="goToResult\(\)">/,
    '<div class="ph-actions" id="ph-actions-trans">\n  <button class="ph-complete" onclick="goToResult()">'
  );
}
if (!need.result) {
  h = h.replace(
    /<div class="ph-actions">\s*<button class="ph-complete" id="next-turn-btn"/,
    '<div class="ph-actions" id="ph-actions-result">\n  <button class="ph-complete" id="next-turn-btn"'
  );
}

// Stronger CSS: hide non-matching by phase attribute on body
const hardCss = `
/* phase complete harden */
body.phase-letter #ph-actions-mgmt,
body.phase-letter #ph-actions-trans,
body.phase-letter #ph-actions-result,
body.phase-management #ph-actions-trans,
body.phase-management #ph-actions-result,
body.phase-transport #ph-actions-mgmt,
body.phase-transport #ph-actions-result,
body.phase-result #ph-actions-mgmt,
body.phase-result #ph-actions-trans {
  display: none !important;
}
body.phase-management #ph-actions-mgmt { display: flex !important; }
body.phase-transport #ph-actions-trans { display: flex !important; }
body.phase-result #ph-actions-result { display: flex !important; }
`;
if (!h.includes('/* phase complete harden */')) {
  h = h.replace('</style>', hardCss + '\n</style>');
  console.log('hard css phase');
}

// Body class sync addon
const HARD = `
// ═══ phase body class harden ═══
(function(){
'use strict';
if(window.__phaseBodyHard) return;
window.__phaseBodyHard = true;
function setBodyPhase(p){
  var b=document.body;
  if(!b) return;
  b.classList.remove('phase-letter','phase-management','phase-transport','phase-result');
  b.classList.add('phase-'+(p||'letter'));
  // also force rows by id
  var map={
    management:'ph-actions-mgmt',
    transport:'ph-actions-trans',
    result:'ph-actions-result'
  };
  ['ph-actions-mgmt','ph-actions-trans','ph-actions-result'].forEach(function(id){
    var el=document.getElementById(id);
    if(!el) return;
    var on = map[p]===id;
    el.classList.toggle('show', on);
    el.style.setProperty('display', on ? 'flex' : 'none', 'important');
  });
}
if(typeof setPhase==='function'){
  var __spb=setPhase;
  setPhase=function(p){
    __spb(p);
    setBodyPhase(p);
    if(typeof showPhaseCompleteRows==='function') showPhaseCompleteRows(p);
  };
}
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    setBodyPhase((typeof gs!=='undefined' && gs.phase) || 'letter');
  }, 20);
});
console.log('[phase body hard] ready');
})();
`;

if (!h.includes('// ═══ phase body class harden ═══')) {
  const mark = "document.addEventListener('DOMContentLoaded',()=>{\n  document.querySelectorAll('.node')";
  if (h.includes(mark)) {
    h = h.replace(mark, HARD + '\n' + mark);
  } else {
    const last = h.lastIndexOf('</script>');
    h = h.slice(0, last) + HARD + '\n' + h.slice(last);
  }
  console.log('phase body hard inserted');
}

fs.writeFileSync(MAIN, h, 'utf8');

// syntax check last large script
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

const final = {
  horses: h.includes('[horses v1]'),
  phaseHard: h.includes('[phase body hard]'),
  showPhase: h.includes('showPhaseCompleteRows'),
  phMgmt: h.includes('id="ph-actions-mgmt"'),
  phTrans: h.includes('id="ph-actions-trans"'),
  buyGold: h.includes('馬を増やす（金40）'),
  stray: h.includes('horse-stray-overlay'),
  yellow: h.includes('hint-y'),
  market: h.includes("openCard('market')"),
  fail,
};
console.log('DONE', final);
if (fail || !final.horses || !final.phMgmt || !final.phTrans) process.exit(1);
