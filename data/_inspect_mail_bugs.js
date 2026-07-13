const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');

// all justEntered assignments
let p = 0;
console.log('=== justEntered writes ===');
while ((p = h.indexOf('justEntered', p)) >= 0) {
  const sn = h.slice(Math.max(0, p - 60), p + 100).replace(/\n/g, ' | ');
  if (sn.includes('=') || sn.includes('false') || sn.includes('true')) {
    console.log(p, sn.slice(0, 160));
  }
  p++;
}

// markNodeCleared
const i = h.indexOf('function markNodeCleared');
console.log('\n=== markNodeCleared ===');
console.log(h.slice(i, i + 800));

// food_land in letters data
const L = JSON.parse(fs.readFileSync('C:/Users/kzawa/Downloads/Grok/data/letters.json', 'utf8'));
console.log('\nfood personal', L.food.personal.filter((e) => !e.disabled).map((e) => ({ id: e.id, when: e.when })));
console.log('food demand', L.food.demand.filter((e) => !e.disabled).map((e) => ({ id: e.id, when: e.when })));

// ranch coupling button text
const j = h.indexOf('カップリング');
console.log('\n coupling', j, h.slice(j - 100, j + 200));
const k = h.indexOf('renderSeasonActions');
console.log('\n renderSeasonActions', h.slice(k, k + 1500));
