const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');

function snip(label, idx, n = 600) {
  console.log('\n===' + label + ' @' + idx + '===');
  if (idx < 0) return console.log('(missing)');
  console.log(h.slice(idx, idx + n));
}

snip('recomputePrices', h.indexOf('function recomputePrices'));
snip('deltaStr', h.indexOf('function deltaStr'));
snip('statsForRank', h.indexOf('function statsForRank'));
snip('STAR_TABLE or rankStats', h.search(/STAR_|rankTable|statsByStar|SPEED_BY/));

// market thead
const th = h.indexOf('<table class="res-table">');
snip('market table', th > 0 ? th : h.indexOf('店</th>'), 500);

// gold init
const goldMatches = [];
const re = /gold\s*[:=]\s*\d+/g;
let m;
while ((m = re.exec(h)) && goldMatches.length < 20) goldMatches.push(m[0] + '@' + m.index);
console.log('\ngold patterns', goldMatches);

// stock init
snip('stock init', h.indexOf('stock:{'));
snip('stock alt', h.indexOf('stock: {'));
snip('gs.stock', h.indexOf('gs.stock'));

// sword stock
console.log('\nsword stock mentions');
let i = 0, c = 0;
while ((i = h.indexOf('sword', i)) >= 0 && c < 8) {
  if (h.slice(i - 20, i + 30).includes('stock') || h.slice(i - 5, i + 15).match(/sword["']?\s*:/)) {
    console.log(h.slice(i - 40, i + 40).replace(/\n/g, ' '));
    c++;
  }
  i++;
}

// GAME_DATA prices fragment
const gp = h.indexOf('window.GAME_DATA');
snip('GAME_DATA start', gp, 400);

// letter/message files
const path = require('path');
const dataDir = 'C:/Users/kzawa/Downloads/Grok/data';
console.log('\ndata files', fs.readdirSync(dataDir).filter(f => /letter|string|message|game-data|ui_/i.test(f)));

// kengen buttons
snip('kengen iron btn', h.indexOf('data-val="iron"'), 200);

// ranch render last
const rr = h.lastIndexOf('window.renderRanchHorseList = function');
snip('ranch list last', rr, 700);
