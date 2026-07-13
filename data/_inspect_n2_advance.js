const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');

function snip(label, idx, n = 900) {
  console.log('\n===' + label + ' @' + idx + '===');
  if (idx < 0) return console.log('missing');
  console.log(h.slice(idx, idx + n));
}

snip('advanceNodeAfterClear', h.indexOf('function advanceNodeAfterClear'));
snip('checkOrderComplete', h.indexOf('function checkOrderComplete'));
snip('setOrderForNode', h.indexOf('function setOrderForNode'));
snip('getNodeOrder', h.indexOf('function getNodeOrder'));

// food node_orders keys
const gd = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/data/game-data.js', 'utf8');
const o = Function('return (' + gd.replace(/^window\.GAME_DATA\s*=\s*/, '').replace(/;\s*$/, '') + ')')();
console.log('\nfood nodes', Object.keys(o.node_orders.food));
console.log('food N2', JSON.stringify(o.node_orders.food['2'], null, 2));

// positionPieceAtNode
snip('positionPiece', h.indexOf('function positionPieceAtNode'));
