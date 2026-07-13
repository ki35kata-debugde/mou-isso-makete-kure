const fs = require('fs');
const p = 'C:/Users/kzawa/Downloads/Grok/data/letters.json';
const t = fs.readFileSync(p, 'utf8');
console.log('len', t.length);
console.log(t.slice(0, 400));
try {
  const L = JSON.parse(t);
  console.log('keys', Object.keys(L));
  for (const k of Object.keys(L).slice(0, 4)) {
    const v = L[k];
    console.log('---', k, typeof v, Array.isArray(v) ? 'arr'+v.length : Object.keys(v||{}));
    if (v && v.personal) {
      console.log('personal ids', v.personal.map(x => ({ id: x.id, when: x.when })));
    }
    if (v && v.demand) {
      console.log('demand ids', v.demand.map(x => ({ id: x.id, when: x.when })));
    }
  }
} catch (e) {
  console.log('parse err', e.message);
}

const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');
let c = 0, p2 = 0;
console.log('\ntrust_gte samples');
while ((p2 = h.indexOf('trust_gte', p2)) >= 0 && c < 12) {
  console.log(h.slice(p2 - 30, p2 + 90).replace(/\n/g, ' '));
  p2++;
  c++;
}
c = 0; p2 = 0;
console.log('\non_node_enter');
while ((p2 = h.indexOf('on_node_enter', p2)) >= 0 && c < 8) {
  console.log(h.slice(p2 - 50, p2 + 100).replace(/\n/g, ' '));
  p2++;
  c++;
}

// yellow/gold tab styling
console.log('\nurg-tab css', h.includes('urg-tab'));
const u = h.indexOf('.tab-btn-5.urg-tab');
console.log(h.slice(u, u + 250));
