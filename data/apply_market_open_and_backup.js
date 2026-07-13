/**
 * - Management phase opens market by default
 * - Snapshot v0.6.1 before horse feature work
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/kzawa/Downloads/Grok';
const HTML = path.join(ROOT, 'mou_isso_v0_6.html');

let h = fs.readFileSync(HTML, 'utf8');

// 1) base setPhase: open market instead of null
const oldMgmt = "if(p==='management'){openCard(null);updateInvDisplay();}";
const newMgmt =
  "if(p==='management'){openCard('market');updateInvDisplay();var cm=document.getElementById('cmd-market');if(cm){document.querySelectorAll('#cmd-bar .cmd-btn').forEach(function(b){b.classList.remove('active');});cm.classList.add('active');}}";

if (h.includes(oldMgmt)) {
  h = h.replace(oldMgmt, newMgmt);
  console.log('base setPhase: open market');
} else if (/if\(p==='management'\)\{openCard\(null\);updateInvDisplay\(\);\}/.test(h)) {
  h = h.replace(
    /if\(p==='management'\)\{openCard\(null\);updateInvDisplay\(\);\}/,
    newMgmt
  );
  console.log('base setPhase: open market (regex)');
} else {
  console.warn('base setPhase mgmt line not found');
}

// 2) outer wrap (map+yellow): also force market
const wrapNeedle =
  '__setPhaseBase(p);\n    applyYellowHints(p);\n    showPhaseCompleteRows(p);';
const wrapRepl = `__setPhaseBase(p);
    if(p==='management'){
      if(typeof openCard==='function') openCard('market');
      var cm=document.getElementById('cmd-market');
      if(cm){
        document.querySelectorAll('#cmd-bar .cmd-btn').forEach(function(b){ b.classList.remove('active'); });
        cm.classList.add('active');
      }
    }
    applyYellowHints(p);
    showPhaseCompleteRows(p);`;

if (h.includes(wrapNeedle)) {
  h = h.replace(wrapNeedle, wrapRepl);
  console.log('wrap setPhase: market');
} else {
  console.warn('wrap needle not found — market still via base setPhase');
}

// 3) version label in header (once)
if (!h.includes('v0.6.1')) {
  h = h.replace(
    'もういっそ敗けてくれ</div>',
    'もういっそ敗けてくれ <span style="font-size:10px;opacity:.7">v0.6.1</span></div>'
  );
  console.log('title v0.6.1');
}

fs.writeFileSync(HTML, h, 'utf8');

// 4) versioned backups
const copies = [
  path.join(ROOT, 'mou_isso_v0_6_1.html'),
  path.join(ROOT, 'mou_isso_v0_6_1_stable_pre_horse.html'),
  path.join(ROOT, 'mou_isso_v0_6.html.bak_v0_6_1_pre_horse'),
];
for (const dest of copies) {
  fs.copyFileSync(HTML, dest);
  console.log('saved', path.basename(dest), fs.statSync(dest).size);
}

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

console.log('DONE', {
  market: h.includes("openCard('market')"),
  openNull: h.includes('openCard(null)'),
  fail,
});
if (fail) process.exit(1);
