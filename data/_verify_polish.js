const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');
const i = h.indexOf('"start"');
console.log(h.slice(i, i + 220));
console.log({
  polish: h.includes('[ui polish kengen/market/ranch] ready'),
  header: h.includes('価格(前期比)'),
  statsExport: h.includes('window.statsForRank = statsForRank'),
  noPrevOnTrade: !h.includes('instant price adjust after trade\n  gs.market.prevBuy') || h.includes('売買では prevBuy を上書きしない'),
  kgLock: h.includes('kg-locked-other'),
  速さ: h.includes('<th>速さ</th>'),
});
