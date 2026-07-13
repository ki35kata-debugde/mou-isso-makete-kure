const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6.html');
let h = fs.readFileSync(HTML, 'utf8');

// Remove legacy buy-UI block in updateTransportUI
const re =
  /var ranch=document\.getElementById\('card-ranch'\);\s*if\(ranch&&!document\.getElementById\('ranch-horse-btn'\)\)\{[\s\S]*?var rc=document\.getElementById\('ranch-horse-count'\); if\(rc\)rc\.textContent=String\(gs\.ranchHorses\|\|0\);/;

if (re.test(h)) {
  h = h.replace(re, '/* ranch buy UI removed — horses v1 */');
  console.log('removed buy inject block');
} else {
  console.warn('buy inject block not found');
}

// Neutralize standalone buyRanchHorse definition that still spends gold (horses v1 overrides later)
h = h.replace(
  /window\.buyRanchHorse=function\(\)\{\s*if\(gs\.gold<40\)\{showToast\('金が足りません'\);return;\}\s*gs\.gold-=40; gs\.ranchHorses=\(gs\.ranchHorses\|\|0\)\+1;\s*updateHeaderDisplay\(\); updateTransportUI\(\);\s*showToast\('牧場の馬 \+1（'\+gs\.ranchHorses\+'頭）'\);\s*\};/,
  '/* old buyRanchHorse removed */'
);
console.log('old buy fn stripped', !h.includes("gs.gold-=40; gs.ranchHorses"));

// item-name ★1馬 leftover in prep if any
h = h.replace(
  /prep-panel-horse[\s\S]{0,200}★1馬/,
  (m) => m.replace('★1馬', '兵糧・回復薬')
);

fs.writeFileSync(HTML, h, 'utf8');
console.log('done');
