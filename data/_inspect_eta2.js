const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');
console.log(h.slice(h.indexOf('function masToNode'), h.indexOf('function masToNode') + 800));
console.log('\nMEANS_SPEED', h.slice(h.indexOf('MEANS_SPEED'), h.indexOf('MEANS_SPEED') + 200));
// map cells sample - food path
const mc = h.indexOf('window.MAP_CELLS');
console.log('\nMAP start', mc);
// search mas or steps
let p = h.indexOf('function masToNode');
// also in map_cells.js
try {
  const m = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/data/map_cells.js', 'utf8');
  console.log('map_cells len', m.length);
  console.log(m.slice(0, 500));
  const i = m.indexOf('food');
  console.log(m.slice(i, i + 800));
} catch (e) {
  console.log(e.message);
}
