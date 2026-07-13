const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');
console.log('portersBusy\n', h.slice(h.indexOf('function portersBusy'), h.indexOf('function portersBusy') + 350));
console.log('\nsetOrderForNode\n', h.slice(h.indexOf('function setOrderForNode'), h.indexOf('function setOrderForNode') + 450));
let p = 0,
  c = 0;
console.log('\n空き');
while ((p = h.indexOf('空き', p)) >= 0 && c < 15) {
  console.log(p, h.slice(p - 30, p + 60).replace(/\n/g, ' '));
  p++;
  c++;
}
console.log('\nhas horse prince', h.includes('[horse prince transport]'));
console.log('checkOrderComplete full\n', h.slice(h.indexOf('function checkOrderComplete'), h.indexOf('function checkOrderComplete') + 600));
// stockOf
console.log('\nstockOf', h.slice(h.indexOf('function stockOf'), h.indexOf('function stockOf') + 300));
