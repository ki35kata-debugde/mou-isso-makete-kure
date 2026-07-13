const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');

// forceLetterOpen: never force when not in letter phase
h = h.replace(
  /function forceLetterOpen\(\)\{[\s\S]*?catch\(e\)\{ console\.warn\('forceLetterOpen', e\); \}\n\}/,
  `function forceLetterOpen(){
  try{
    if(typeof gs!=='undefined' && gs.phase && gs.phase!=='letter') return;
    if(typeof openLetterOverlay==='function') openLetterOverlay();
    else if(typeof window.openLetterOverlay==='function') window.openLetterOverlay();
  }catch(e){ console.warn('forceLetterOpen', e); }
}`
);
console.log('forceLetterOpen guarded');

// FINAL bootLetter same guard
h = h.replace(
  /function bootLetter\(\)\{\s*try\{\s*var ov=document\.getElementById\('overlay'\);[\s\S]*?catch\(e\)\{ console\.warn\('FINAL letter boot', e\); \}\s*\}/,
  `function bootLetter(){
    try{
      if(typeof gs!=='undefined' && gs.phase && gs.phase!=='letter') return;
      var ov=document.getElementById('overlay');
      if(ov){ ov.classList.add('on'); ov.style.display='block'; }
      if(typeof openLetterOverlay==='function') openLetterOverlay();
      else if(typeof window.openLetterOverlay==='function') window.openLetterOverlay();
    }catch(e){ console.warn('FINAL letter boot', e); }
  }`
);
console.log('bootLetter guarded');

// setPhase letter re-open only if still letter
h = h.replace(
  /if\(p==='letter'\) setTimeout\(forceLetterOpen, 0\);/,
  "if(p==='letter') setTimeout(function(){ if(gs.phase==='letter') forceLetterOpen(); }, 0);"
);
h = h.replace(
  /if\(p==="letter"\) setTimeout\(function\(\)\{ if\(gs\.phase==="letter"\) forceLetterOpen\(\); \}, 0\);/,
  "if(p==='letter') setTimeout(function(){ if(gs.phase==='letter') forceLetterOpen(); }, 0);"
);

// goToMgmt: ensure phase management sticks
if (!h.includes('// goToMgmt hardened')) {
  h = h.replace(
    /function goToMgmt\(\)\{closeOverlay\(\);setPhase\('management'\);\}/,
    `function goToMgmt(){// goToMgmt hardened
  closeOverlay();
  setPhase('management');
  // cancel any pending letter re-open
  if(typeof gs!=='undefined') gs.phase='management';
  var ov=document.getElementById('overlay');
  if(ov){ ov.classList.remove('on'); ov.style.display=''; }
}`
  );
  console.log('goToMgmt hardened');
}

fs.writeFileSync(HTML, h, 'utf8');

try {
  const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
  let m,
    n = 0;
  while ((m = re.exec(h))) {
    if (!m[1] || m[1].length < 3000) continue;
    new Function(m[1]);
    console.log('OK', n);
    n++;
  }
} catch (e) {
  console.error('FAIL', e.message);
  process.exit(1);
}
console.log('DONE');
