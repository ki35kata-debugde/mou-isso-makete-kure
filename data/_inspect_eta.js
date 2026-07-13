const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');

function snip(label, idx, n = 600) {
  console.log('\n===' + label + '===');
  console.log(h.slice(idx, idx + n));
}

snip('etaFor', h.indexOf('function etaFor'));
snip('masToTarget', h.indexOf('function masToTarget'));
snip('speedOf means', h.indexOf('function speedOf'));
// MAP_CELLS path lengths?
const i = h.indexOf('MAP_CELLS');
console.log('MAP_CELLS', i);

// result winter notes
const j = h.indexOf('s===3){ // 冬の結果');
snip('winter result', j, 900);

// n2 goTransport eta overrides
const k = h.lastIndexOf('means===\'wagon\'');
snip('wagon eta', k - 100, 400);

// fleet-line and tinfo
console.log('\nfleet-line set', h.includes("人足　あと"));
console.log('tinfo jinput', h.includes('人足　空き'));
