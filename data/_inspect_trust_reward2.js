const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');
const gd = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/data/game-data.js', 'utf8');

// full prep_quests from game-data
const i = gd.indexOf('"prep_quests"');
console.log('=== prep_quests game-data ===');
console.log(gd.slice(i, i + 700));

// does any node_orders entry have trust?
console.log('\nnode_orders has trust?', /node_orders[\s\S]{0,8000}trust/.test(gd));
const j = gd.indexOf('"node_orders"');
// find if trust_reward inside node_orders section before next top key
const next = gd.indexOf('\n  "recipes', j);
const section = gd.slice(j, next > 0 ? next : j + 5000);
console.log('trust in node_orders section', section.includes('trust'));

// delivery code
['function confirmPrep', 'function handOver', 'prepQty', 'trust_reward', 'orderMiss', 'completeTransport', 'arrive', '納品', 'prepDone'].forEach((s) => {
  const p = h.indexOf(s);
  console.log(s, p);
});

// find where prep trust is applied
let p = 0,
  c = 0;
console.log('\n=== trust_reward usages ===');
while ((p = h.indexOf('trust_reward', p)) >= 0 && c < 20) {
  console.log(h.slice(p - 80, p + 120).replace(/\n/g, ' | '));
  p++;
  c++;
}
