const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');

const keys = [
  'function resolveTransport',
  'function processArrivals',
  'function onConvoy',
  'function advanceConvoys',
  'function tickTransport',
  'function completeOrder',
  'function checkOrder',
  'order fully',
  '依頼完了',
  '納品完了',
  'delivered)>=',
  'delivered >=',
  'it.delivered',
  'setOrderForNode',
  'node[key]++',
  'gs.node[key]',
];
keys.forEach((s) => {
  const p = h.indexOf(s);
  console.log(s, p);
  if (p > 0) console.log(' ', h.slice(p, p + 200).replace(/\n/g, ' | ').slice(0, 180));
});

// search delivered complete logic
let p = 0,
  c = 0;
console.log('\n=== delivered checks ===');
while ((p = h.indexOf('delivered', p)) >= 0 && c < 30) {
  const sn = h.slice(p - 20, p + 100).replace(/\n/g, ' ');
  if (sn.includes('>=') || sn.includes('完') || sn.includes('every') || sn.includes('all')) {
    console.log(p, sn);
  }
  p++;
  c++;
}
