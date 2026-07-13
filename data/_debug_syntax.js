const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html', 'utf8');
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m,
  n = 0;
while ((m = re.exec(h))) {
  const body = m[1];
  if (!body || body.length < 40) continue;
  try {
    new Function(body);
    console.log('OK', n);
  } catch (e) {
    console.log('FAIL', n, e.message);
    const lines = body.split(/\n/);
    for (let li = 0; li < lines.length; li++) {
      try {
        new Function(lines.slice(0, li + 1).join('\n'));
      } catch (e2) {
        console.log('at line', li + 1);
        for (let k = Math.max(0, li - 6); k <= Math.min(lines.length - 1, li + 6); k++) {
          console.log((k + 1) + (k === li ? '>>>' : '   ') + lines[k]);
        }
        break;
      }
    }
  }
  n++;
}
