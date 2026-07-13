const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6.html', 'utf8');

const ov = h.indexOf('<div id="overlay"');
const ovEnd = h.indexOf('<div id="save-overlay"');
const chunk = h.slice(ov, ovEnd);

console.log('overlay chunk length', chunk.length);
console.log('lt-food-demand', chunk.includes('id="lt-food-demand"'));
console.log('lc-food', (chunk.match(/id="lc-food"[^>]*>/) || [])[0]);
console.log('ph-actions-letter', chunk.includes('ph-actions-letter'));
console.log('ov-inner', chunk.includes('id="ov-inner"'));

// count open/close divs roughly in overlay
const opens = (chunk.match(/<div\b/g) || []).length;
const closes = (chunk.match(/<\/div>/g) || []).length;
console.log('div open/close', opens, closes, 'diff', opens - closes);

// show structure skeleton without base64
const skeleton = chunk
  .replace(/src="data:image\/[^"]+"/g, 'src="IMG"')
  .replace(/src="\[image[^\"]*"/g, 'src="IMG"');
// only tags and short text
const lines = skeleton
  .replace(/></g, '>\n<')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l.startsWith('<') && (l.includes('id=') || l.includes('class=') || l.startsWith('</') || l.includes('button') || l.includes('ltab') || l.includes('ph-')));
console.log(lines.slice(0, 80).join('\n'));
console.log('---');
console.log(lines.slice(-40).join('\n'));
