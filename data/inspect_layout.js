const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6.html', 'utf8');

const marks = [
  ['map-wrap', '<div id="map-wrap">'],
  ['step-bar', '<div class="step-bar">'],
  ['cmd-bar', '<div id="cmd-bar">'],
  ['phase-panel', '<div id="phase-panel">'],
  ['sec-management', 'id="sec-management"'],
  ['sec-transport', 'id="sec-transport"'],
  ['overlay', '<div id="overlay">'],
  ['ph-letter-complete', 'id="ph-letter-complete"'],
];
const found = marks.map(([n, m]) => [n, h.indexOf(m)]).sort((a, b) => a[1] - b[1]);
console.log('DOM order:', found);

// overlay CSS
const oi = h.indexOf('#overlay{');
console.log('\noverlay CSS snippet:\n', h.slice(oi, oi + 400));

const oi2 = h.indexOf('#overlay.on');
console.log('\noverlay.on:\n', h.slice(oi2, oi2 + 200));

// openLetterOverlay
const ol = h.indexOf('function openLetterOverlay');
console.log('\nopenLetterOverlay:\n', h.slice(ol, ol + 500));

// tab-btn styles
const tb = h.indexOf('.tab-btn-5');
console.log('\ntab-btn-5 CSS:\n', h.slice(tb, tb + 300));

const ltab = h.indexOf('.ltab');
console.log('\nltab CSS:\n', h.slice(ltab, ltab + 250));

// cmd-btn overflow
const cb = h.indexOf('.cmd-btn{');
console.log('\ncmd-btn:\n', h.slice(cb, cb + 250));

// letter fix boot
const lf = h.indexOf('// ═══ Letter hints');
console.log('\nletter fix present', lf > 0);
console.log(h.slice(lf, lf + 200));

// setPhase letter
const sp = h.indexOf("if(p==='letter')");
console.log('\nsetPhase letter hits', (h.match(/openLetterOverlay\(\)/g) || []).length);

// phase-panel end / map relation
const pp = h.indexOf('<div id="phase-panel">');
console.log('\naround phase-panel start:', h.slice(pp, pp + 200));
console.log('map before phase?', h.indexOf('<div id="map-wrap">') < pp);
console.log('map after cmd?', h.indexOf('<div id="map-wrap">') > h.indexOf('<div id="cmd-bar">'));
