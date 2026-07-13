const fs = require('fs');
const HTML = 'C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html';
let h = fs.readFileSync(HTML, 'utf8');
if (h.includes("kNorm = String(k).toLowerCase() === 'iron'")) {
  console.log('already');
  process.exit(0);
}
const area = h.indexOf('window.applySeasonStockDelta');
if (area < 0) {
  console.log('no applySeasonStockDelta');
  process.exit(0);
}
const needle = 'Object.keys(add).forEach(function(k){';
const j = h.indexOf(needle, area);
if (j < 0) {
  console.log('no forEach');
  process.exit(0);
}
const inject =
  "Object.keys(add).forEach(function(k){\n" +
  "    if(String(k).toLowerCase()==='iron') k='iron';\n";
h = h.slice(0, j) + inject + h.slice(j + needle.length);
fs.writeFileSync(HTML, h, 'utf8');
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m,
  n = 0,
  fail = false;
while ((m = re.exec(h))) {
  const b = m[1];
  if (!b || b.length < 40) continue;
  try {
    new Function(b);
    console.log('OK', n);
  } catch (e) {
    fail = true;
    console.log('FAIL', n, e.message);
  }
  n++;
}
console.log(fail ? 'FAIL' : 'OK patched');
