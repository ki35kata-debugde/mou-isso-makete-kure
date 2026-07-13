const fs = require('fs');
const path = require('path');
const root = 'C:/Users/kzawa/Downloads/Grok';

// letters.json / game-data
for (const f of ['data/game-data.js', 'data/letters.json', 'data/market_economy.json']) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) continue;
  const t = fs.readFileSync(p, 'utf8');
  console.log('\n==', f, 'trust_reward count', (t.match(/trust_reward/g) || []).length);
  const idxs = [];
  let i = 0;
  while ((i = t.indexOf('trust_reward', i)) >= 0 && idxs.length < 8) {
    idxs.push(t.slice(Math.max(0, i - 40), i + 40).replace(/\n/g, ' '));
    i++;
  }
  idxs.forEach((s) => console.log(' ', s));
}

const h = fs.readFileSync(path.join(root, 'mou_isso_v0_6_1.html'), 'utf8');
console.log('\nHTML trust_reward', (h.match(/trust_reward/g) || []).length);
console.log('prep_quests sample');
const j = h.indexOf('prep_quests');
console.log(h.slice(j, j + 600));
console.log('\nnode_orders sample');
const k = h.indexOf('node_orders');
console.log(h.slice(k, k + 500));

// how trust increases on delivery
['trust_reward', 'gs.trust[', 'prepDone', 'deliver', 'handOver', 'completeOrder', 'orderComplete', '信頼'].forEach((s) => {
  let c = 0,
    p = 0;
  while ((p = h.indexOf(s, p)) >= 0 && c < 3) {
    if (s === 'gs.trust[' || s === 'trust_reward') {
      console.log(s, h.slice(p - 30, p + 80).replace(/\n/g, ' | '));
    }
    p++;
    c++;
  }
});

// search trust += on prep
const re = /trust\[.*?\]\s*(\+=|=).*?/g;
let m,
  n = 0;
while ((m = re.exec(h)) && n < 15) {
  console.log('assign', m[0], '@', m.index);
  n++;
}
