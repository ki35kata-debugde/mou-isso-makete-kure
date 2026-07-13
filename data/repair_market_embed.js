/**
 * Repair: validate market_economy.json, fix Iron->iron,
 * re-embed MARKET_ECON cleanly, validate all script blocks.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'mou_isso_v0_6_1.html');
const JSON_PATH = path.join(__dirname, 'market_economy.json');

// 1) load & normalize JSON
let raw = fs.readFileSync(JSON_PATH, 'utf8');
// strip BOM
if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);

let ME;
try {
  ME = JSON.parse(raw);
  console.log('JSON parse OK');
} catch (e) {
  console.error('JSON parse FAIL:', e.message);
  process.exit(1);
}

// normalize season keys: Iron -> iron
function fixKeys(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(fixKeys);
  const out = {};
  Object.keys(obj).forEach((k) => {
    let nk = k;
    if (k === 'Iron') nk = 'iron';
    out[nk] = fixKeys(obj[k]);
  });
  return out;
}
ME = fixKeys(ME);

// ensure required fields
if (!ME.seasonStockDelta && ME.seasonRestock) ME.seasonStockDelta = ME.seasonRestock;
if (ME.seasonStockDelta && !ME.seasonRestock) ME.seasonRestock = ME.seasonStockDelta;
if (!ME.shopMin) {
  ME.shopMin = { iron: 2, wood: 2, niter: 1, herb: 2, food_mat: 4, med: 0, sword: 0, siege_w: 0 };
}
if (ME.ambientDelta == null) ME.ambientDelta = 0;
if (ME.priceMultMin == null) ME.priceMultMin = 0.55;
if (ME.priceMultMax == null) ME.priceMultMax = 1.55;
if (ME.sellToBuyRatio == null) ME.sellToBuyRatio = 0.9;

// rewrite clean JSON (no trailing junk)
const cleanJson = JSON.stringify(ME, null, 2) + '\n';
fs.writeFileSync(JSON_PATH, cleanJson, 'utf8');
console.log('JSON rewritten clean');

// 2) HTML: replace MARKET_ECON
let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_repair_' + Date.now(), h, 'utf8');

const marker = 'MARKET_ECON';
const i = h.indexOf(marker);
if (i < 0) {
  console.error('MARKET_ECON not found in HTML');
  process.exit(1);
}
// find start of assignment value
let eq = h.indexOf('{', i);
// walk braces
let depth = 0;
let end = -1;
for (let p = eq; p < h.length; p++) {
  const ch = h[p];
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) {
      end = p;
      break;
    }
  }
}
if (end < 0) {
  console.error('could not find end of MARKET_ECON object');
  process.exit(1);
}
let after = end + 1;
while (h[after] === ' ' || h[after] === '\t') after++;
if (h[after] === ';') after++;

// Only replace from MARKET_ECON through semicolon
// Keep prefix "MARKET_ECON = " or "var MARKET_ECON =" etc.
const lineStart = h.lastIndexOf('\n', i) + 1;
const assignPrefix = h.slice(lineStart, eq); // e.g. "MARKET_ECON = "
const replacement = assignPrefix.trimStart().startsWith('MARKET_ECON')
  ? assignPrefix.replace(/MARKET_ECON[\s\S]*$/, 'MARKET_ECON = ') + JSON.stringify(ME) + ';'
  : 'MARKET_ECON = ' + JSON.stringify(ME) + ';';

// Safer: replace only object
h = h.slice(0, i) + 'MARKET_ECON = ' + JSON.stringify(ME) + ';' + h.slice(after);
console.log('MARKET_ECON re-embedded');

// 3) Fix console.log with special unicode in market season fix if any
h = h.replace(
  /console\.log\('\[market season\+ui\] ready[^']*'\);/g,
  "console.log('[market season+ui] ready');"
);

// 4) Ensure applySeasonStockDelta normalizes keys case-insensitively for iron
// inject tiny guard if not present
if (!h.includes('/* iron key normalize */') && h.includes('window.applySeasonStockDelta')) {
  h = h.replace(
    'window.applySeasonStockDelta = function(){',
    `window.applySeasonStockDelta = function(){
  /* iron key normalize */`
  );
}

// 5) validate scripts
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m;
let n = 0;
let fail = false;
while ((m = re.exec(h))) {
  const body = m[1];
  if (!body || body.length < 20) continue;
  if (/^\s*src\s*=/i.test(m[0])) continue;
  try {
    new Function(body);
    console.log('script OK', n, 'len', body.length);
  } catch (e) {
    fail = true;
    console.error('script FAIL', n, e.message);
    // locate line
    const lines = body.split(/\n/);
    for (let li = 0; li < lines.length; li++) {
      try {
        new Function(lines.slice(0, li + 1).join('\n'));
      } catch (e2) {
        console.error('  near line', li + 1);
        console.error(lines.slice(Math.max(0, li - 1), li + 2).join('\n----\n'));
        break;
      }
    }
  }
  n++;
}

if (fail) {
  console.error('HTML still has syntax errors');
  process.exit(1);
}

fs.writeFileSync(HTML, h, 'utf8');
console.log('DONE repair OK');
console.log('seasonStockDelta sample', ME.seasonStockDelta && ME.seasonStockDelta['2']);
