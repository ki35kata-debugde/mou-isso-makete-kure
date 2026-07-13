const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');

// CFG.start
let i = h.indexOf('"start"');
if (i < 0) i = h.indexOf('start:');
console.log('start idx', i);
console.log(h.slice(i, i + 400));

// RANK_TABLE definition
i = h.indexOf('RANK_TABLE');
console.log('\nRANK_TABLE', i);
console.log(h.slice(i, i + 350));

// displayStar
i = h.indexOf('function displayStar');
console.log('\ndisplayStar', h.slice(i, i + 250));

// goToNextTurn market
i = h.indexOf('seasonRestock');
console.log('\nseasonRestock calls');
let c = 0, p = 0;
while ((p = h.indexOf('seasonRestock', p)) >= 0 && c < 6) {
  console.log(h.slice(p - 80, p + 80).replace(/\n/g, ' | '));
  p++; c++;
}

// confirmTrade prevBuy
p = 0; c = 0;
console.log('\nprevBuy writes');
while ((p = h.indexOf('prevBuy', p)) >= 0 && c < 15) {
  console.log(c, h.slice(p - 30, p + 60).replace(/\n/g, ' '));
  p++; c++;
}

// letters sync
const gd = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/data/game-data.js', 'utf8').slice(0, 200);
console.log('\ngame-data head', gd);
console.log('letters.json exists', fs.existsSync('C:/Users/kzawa/Downloads/Grok/data/letters.json'));
console.log('size letters', fs.statSync('C:/Users/kzawa/Downloads/Grok/data/letters.json').size);
