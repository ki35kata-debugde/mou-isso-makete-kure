/**
 * Minimal UX polish on stable baseline:
 * 1) Move map after phase-panel (below facility/transport UI)
 * 2) Yellow corner frames:
 *    - letter: prince tabs + 依頼/娘 tabs
 *    - management: 4 facility cmd buttons
 * Does NOT rewrite openLetterOverlay / renderLetter logic.
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6.html');

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_before_map_yellow', h, 'utf8');

// ── helpers ──
function findMatchingClose(html, openIdx) {
  const openTagEnd = html.indexOf('>', openIdx);
  if (openTagEnd < 0) return -1;
  let i = openTagEnd + 1;
  let depth = 1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', i);
    const nextClose = html.indexOf('</div>', i);
    if (nextClose < 0) return -1;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) return nextClose + 6;
      i = nextClose + 6;
    }
  }
  return -1;
}

// ── 1) Move map after phase-panel, before overlay ──
const mapOpen = h.indexOf('<div id="map-wrap">');
const phaseOpen = h.indexOf('<div id="phase-panel">');
const ovOpen = h.indexOf('<div id="overlay">');

if (mapOpen < 0 || phaseOpen < 0 || ovOpen < 0) {
  console.error('markers missing', { mapOpen, phaseOpen, ovOpen });
  process.exit(1);
}

const mapEnd = findMatchingClose(h, mapOpen);
if (mapEnd < 0) {
  console.error('map-wrap close not found');
  process.exit(1);
}

// Already in correct order? (cmd < phase < map < ov)
const cmdOpen = h.indexOf('<div id="cmd-bar">');
if (cmdOpen < phaseOpen && phaseOpen < mapOpen && mapOpen < ovOpen) {
  console.log('map already after phase-panel');
} else {
  const mapBlock = h.slice(mapOpen, mapEnd);
  let afterMap = mapEnd;
  while (h[afterMap] === '\n' || h[afterMap] === '\r' || h[afterMap] === ' ') afterMap++;

  // remove map
  h = h.slice(0, mapOpen) + h.slice(afterMap);

  // insert before overlay
  const ov2 = h.indexOf('<div id="overlay">');
  if (ov2 < 0) {
    console.error('overlay lost after map remove');
    process.exit(1);
  }
  h = h.slice(0, ov2) + mapBlock + '\n' + h.slice(ov2);
  console.log('moved map after phase-panel');
}

const order = {
  step: h.indexOf('<div class="step-bar">'),
  cmd: h.indexOf('<div id="cmd-bar">'),
  phase: h.indexOf('<div id="phase-panel">'),
  map: h.indexOf('<div id="map-wrap">'),
  ov: h.indexOf('<div id="overlay">'),
};
console.log('order', order);
if (!(order.cmd < order.phase && order.phase < order.map && order.map < order.ov)) {
  console.warn('WARNING unexpected order', order);
}

// ── 2) CSS yellow corner frames (append once) ──
const CSS = `
/* === yellow corner hints (safe) === */
.hint-y{
  position:relative !important;
  z-index:2;
  overflow:visible !important;
}
.hint-y::before{
  content:'' !important;
  display:block !important;
  position:absolute !important;
  top:2px; left:2px; right:2px; bottom:2px;
  pointer-events:none !important;
  z-index:5 !important;
  background-image:
    linear-gradient(#e8c547,#e8c547),
    linear-gradient(#e8c547,#e8c547),
    linear-gradient(#e8c547,#e8c547),
    linear-gradient(#e8c547,#e8c547),
    linear-gradient(#e8c547,#e8c547),
    linear-gradient(#e8c547,#e8c547),
    linear-gradient(#e8c547,#e8c547),
    linear-gradient(#e8c547,#e8c547);
  background-size:
    12px 2px, 2px 12px,
    12px 2px, 2px 12px,
    12px 2px, 2px 12px,
    12px 2px, 2px 12px;
  background-position:
    top left, top left,
    top right, top right,
    bottom left, bottom left,
    bottom right, bottom right;
  background-repeat:no-repeat;
}
.tab-bar-5, .ltabs{ overflow:visible !important; }
.cmd-btn.hint-y:not(.disabled){
  background:rgba(232,197,71,.10) !important;
}
#map-wrap{ margin-top:10px; }
`;

if (!h.includes('/* === yellow corner hints (safe) === */')) {
  h = h.replace('</style>', CSS + '\n</style>');
  console.log('css added');
} else {
  console.log('css already present');
}

// ── 3) JS addon only (do not touch openLetterOverlay body) ──
const ADDON = `
// ═══ map under panels + yellow corner hints ═══
(function(){
'use strict';
if(window.__mapYellowHints) return;
window.__mapYellowHints = true;

function clearYellowHints(){
  document.querySelectorAll('.hint-y').forEach(function(el){
    el.classList.remove('hint-y');
  });
}

function applyYellowHints(phase){
  clearYellowHints();
  var p = phase || (typeof gs!=='undefined' && gs.phase) || 'letter';
  if(p==='letter'){
    document.querySelectorAll('#ov-inner .tab-btn-5').forEach(function(b){
      b.classList.add('hint-y');
    });
    document.querySelectorAll('#ov-inner .ltab').forEach(function(b){
      b.classList.add('hint-y');
    });
  }else if(p==='management'){
    ['cmd-market','cmd-smith','cmd-ranch','cmd-pharmacy'].forEach(function(id){
      var b=document.getElementById(id);
      if(b && !b.classList.contains('disabled')) b.classList.add('hint-y');
    });
  }
}
window.applyYellowHints = applyYellowHints;

// wrap setPhase lightly
if(typeof setPhase==='function'){
  var __setPhaseBase = setPhase;
  setPhase = function(p){
    __setPhaseBase(p);
    applyYellowHints(p);
  };
}

// after letter open / tab change, re-apply letter frames
if(typeof openLetterOverlay==='function'){
  var __openLetterBase = openLetterOverlay;
  openLetterOverlay = function(){
    __openLetterBase();
    setTimeout(function(){ applyYellowHints('letter'); }, 0);
  };
}
if(typeof selectTab==='function'){
  var __selectTabBase = selectTab;
  selectTab = function(key){
    __selectTabBase(key);
    if(typeof gs!=='undefined' && gs.phase==='letter'){
      setTimeout(function(){ applyYellowHints('letter'); }, 0);
    }
  };
}
if(typeof selectLetterTab==='function'){
  var __selectLetterTabBase = selectLetterTab;
  selectLetterTab = function(prince, tab){
    __selectLetterTabBase(prince, tab);
    if(typeof gs!=='undefined' && gs.phase==='letter'){
      setTimeout(function(){ applyYellowHints('letter'); }, 0);
    }
  };
}

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    applyYellowHints((typeof gs!=='undefined' && gs.phase) || 'letter');
  }, 30);
});

console.log('[map+yellow] ready');
})();
`;

const MARKER = "document.addEventListener('DOMContentLoaded',()=>{\n  document.querySelectorAll('.node')";
const old = h.indexOf('// ═══ map under panels + yellow corner hints ═══');
const mi = h.indexOf(MARKER);

if (old >= 0 && mi > old) {
  h = h.slice(0, old) + ADDON + '\n' + h.slice(mi);
  console.log('replaced addon block');
} else if (mi >= 0) {
  h = h.slice(0, mi) + ADDON + '\n' + h.slice(mi);
  console.log('inserted addon before map DOMContentLoaded');
} else {
  // fallback: before last </script>
  const last = h.lastIndexOf('</script>');
  if (last < 0) {
    console.error('no script end');
    process.exit(1);
  }
  h = h.slice(0, last) + ADDON + '\n' + h.slice(last);
  console.log('appended addon before last script end');
}

// ensure openLetterOverlay is still original simple version (not rewritten badly)
const openIdx = h.indexOf('function openLetterOverlay(){');
const openSnippet = h.slice(openIdx, openIdx + 200);
console.log('openLetterOverlay head:', openSnippet.replace(/\n/g, ' | '));

fs.writeFileSync(HTML, h, 'utf8');

// syntax check large scripts
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m;
let n = 0;
let fail = false;
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

const o2 = {
  cmd: h.indexOf('<div id="cmd-bar">'),
  phase: h.indexOf('<div id="phase-panel">'),
  map: h.indexOf('<div id="map-wrap">'),
  ov: h.indexOf('<div id="overlay">'),
};
console.log('DONE', {
  mapAfterPhase: o2.cmd < o2.phase && o2.phase < o2.map && o2.map < o2.ov,
  css: h.includes('yellow corner hints'),
  addon: h.includes('[map+yellow]'),
  openSimple: h.includes("document.getElementById('overlay').classList.add('on')"),
  fail,
});
if (fail) process.exit(1);
