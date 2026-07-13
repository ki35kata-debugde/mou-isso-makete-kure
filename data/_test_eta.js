const fs = require('fs');
const MAP = JSON.parse(
  fs.readFileSync('C:/Users/kzawa/Downloads/Grok/data/map_cells.js', 'utf8').replace(/^window\.MAP_CELLS\s*=\s*/, '').replace(/;\s*$/, '')
);
function mas(route, n) {
  const cells = MAP.cells[route] || [];
  let idx = -1;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].node && cells[i].nidx === n - 1) {
      idx = i;
      break;
    }
  }
  return idx >= 0 ? idx + 1 : null;
}
['food', 'horse', 'siege', 'weapon'].forEach((r) => {
  console.log(
    r,
    [1, 2, 3, 4].map((n) => {
      const m = mas(r, n);
      return 'N' + n + '=' + m + 'mas/' + Math.ceil(m / 1) + 'T';
    })
  );
});
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');
console.log('foal phrase', h.includes('番になった馬に仔馬がうまれそうだ'));
console.log('eta ready', h.includes('[eta winter tp ui] ready'));
console.log('old feed still', h.includes('今冬は特別な餌やりをしなかった'));
