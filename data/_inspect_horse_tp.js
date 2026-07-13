const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');
const gd = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/data/game-data.js', 'utf8');

const o = Function('return (' + gd.replace(/^window\.GAME_DATA\s*=\s*/, '').replace(/;\s*$/, '') + ')')();
console.log('horse node_orders', JSON.stringify(o.node_orders.horse, null, 2));

const i = h.indexOf('buildMeans');
console.log('\nbuildMeans\n', h.slice(i, i + 1200));

const j = h.indexOf('function isMeansUnlocked');
console.log('\nisMeans\n', h.slice(j, j + 450));

const k = h.indexOf('goTransport=function');
console.log('\ngoTransport\n', h.slice(k, k + 900));

// how normal-trans is filled for food/horse
const m = h.indexOf("normal-trans-'+key");
console.log('\nfill pattern', h.slice(m - 200, m + 400));

console.log('horse means buttons in html', (h.match(/selectMeans\('horse'/g) || []).length);
console.log('wagon', h.includes('wagon'));
