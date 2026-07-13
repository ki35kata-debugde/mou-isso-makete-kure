const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');

// prep delivery
const a = h.indexOf('trustGain');
console.log('---trustGain context---');
console.log(h.slice(a - 400, a + 500));

// search order complete trust
['function deliver', 'function confirmHand', 'prepDone', 'orderComplete', 'onArrive', 'convoy', 'arriveOrder', 'fillOrder', 'delivered'].forEach((s) => {
  let p = 0, c = 0;
  while ((p = h.indexOf(s, p)) >= 0 && c < 2) {
    if (s.length > 6) console.log(s, p, h.slice(p, p + 60).replace(/\n/g, ' '));
    p++;
    c++;
  }
});

// find where order items delivered fully
const re = /order\[.*?\][\s\S]{0,200}trust/g;
let m;
while ((m = re.exec(h)) && m.index < 20000000) {
  if (m.index > 10000000) {
    console.log('near', m.index, m[0].slice(0, 150));
    break;
  }
}

// search trust after transport
let p = 0, c = 0;
console.log('\n--- +trust patterns ---');
while ((p = h.indexOf('gs.trust', p)) >= 0 && c < 25) {
  const snip = h.slice(p, p + 100).replace(/\n/g, ' ');
  if (snip.includes('+') || snip.includes('Math.min')) console.log(p, snip);
  p++;
  c++;
}
