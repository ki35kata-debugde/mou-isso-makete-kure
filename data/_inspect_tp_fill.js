const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');
const keys = [
  'function fillTransport',
  'function renderTransport',
  'function buildTransport',
  'normal-trans',
  'buildMeans(',
  'refreshTransport',
  'order items',
  'ts-food',
  'changeQty',
];
keys.forEach((k) => console.log(k, h.indexOf(k)));

// find who fills normal-trans-food
let p = 0,
  c = 0;
console.log('\n--- normal-trans fill ---');
while ((p = h.indexOf('normal-trans-', p)) >= 0 && c < 25) {
  const sn = h.slice(p - 40, p + 80).replace(/\n/g, ' ');
  if (sn.includes('innerHTML') || sn.includes('append') || sn.includes('build') || sn.includes('getElement')) {
    console.log(p, sn);
  }
  p++;
  c++;
}

const i = h.indexOf('function updateTransportUI');
console.log('\nupdateTransportUI\n', h.slice(i, i + 1500));
