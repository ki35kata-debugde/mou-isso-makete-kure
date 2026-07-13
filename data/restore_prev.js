/**
 * Revert HTML to the state just before fix_gameplay.js (FIX v2).
 * Restores EXTRA_JS from build_and_patch.js era.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const HTML_PATH = path.join(ROOT, 'mou_isso_v0_6.html');

// Load EXTRA_JS string from build_and_patch.js without executing its HTML write
const buildSrc = fs.readFileSync(path.join(__dirname, 'build_and_patch.js'), 'utf8');
const m = buildSrc.match(/const EXTRA_JS = `([\s\S]*?)`;\s*\n\s*\/\/ ── Patch HTML/);
if (!m) {
  console.error('Could not extract EXTRA_JS from build_and_patch.js');
  process.exit(1);
}
const EXTRA_JS = m[1]
  // template was evaluated in build file with ${} - EXTRA_JS uses only escaped sequences
  .replace(/\\`/g, '`')
  .replace(/\\\$/g, '$')
  .replace(/\\\\/g, '\\');

// Actually the EXTRA_JS in the file is a template literal - when we extract with regex we get the raw content
// with \\n sequences etc. In the source, EXTRA_JS = `...` so content has real newlines and \\{\\{ becomes \{\{ in the actual runtime when node loads it.
// When we regex extract, we get the SOURCE text of the template which still has \\{\\{ etc.
// We need the same evaluation as the template literal. Use Function:
let EXTRA_EVAL;
try {
  EXTRA_EVAL = Function('return `' + m[1] + '`')();
} catch (e) {
  // fallback: use raw with unescape of common sequences
  EXTRA_EVAL = m[1]
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\`/g, '`')
    .replace(/\\\$\{/g, '${')
    .replace(/\\\\/g, '\\');
  console.log('template eval failed, using unescape', e.message);
}
const EXTRA = EXTRA_EVAL;
console.log('EXTRA length', EXTRA.length, 'starts', EXTRA.slice(0, 60));

const market = JSON.parse(fs.readFileSync(path.join(__dirname, 'market.json'), 'utf8'));
const orders = JSON.parse(fs.readFileSync(path.join(__dirname, 'orders.json'), 'utf8'));
// restore letters from original letters.json - may have been edited; keep current letters file
const letters = JSON.parse(fs.readFileSync(path.join(__dirname, 'letters.json'), 'utf8'));

// Revert letter text changes from fix_gameplay if present
if (letters.food && letters.food.demand) {
  for (const d of letters.food.demand) {
    if (d.id === 'food_order') {
      d.body =
        '前線より。兵糧の補充を求める。\n\n【依頼】{{order_label}}　納期残：およそ{{deadline}}ターン';
    }
    if (d.id === 'food_node_enter') {
      d.body =
        '到着した。思ったより速かった。\nこの先、兵糧が要る。送ってくれ。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後';
    }
  }
}
fs.writeFileSync(path.join(__dirname, 'letters.json'), JSON.stringify(letters, null, 2), 'utf8');

const GAME_DATA = {
  prices: market.prices,
  prep_quests: orders.prep,
  node_orders: orders.nodes,
  remind_after_turns: orders.remind_after_turns || 3,
  letters,
  orders: Object.fromEntries(
    Object.keys(orders.nodes).map((k) => {
      const n1 = orders.nodes[k]['1'];
      return [k, { item_label: n1.label, deadline: n1.deadline }];
    })
  ),
};
fs.writeFileSync(
  path.join(__dirname, 'game-data.js'),
  'window.GAME_DATA = ' + JSON.stringify(GAME_DATA, null, 2) + ';\n',
  'utf8'
);

let html = fs.readFileSync(HTML_PATH, 'utf8');
// backup current (broken) version
fs.writeFileSync(HTML_PATH + '.bak_before_revert', html, 'utf8');
console.log('backed up broken HTML to .bak_before_revert');

// 1) Remove FIX v2 / external merge blocks before original map DOMContentLoaded
const origDom = "document.addEventListener('DOMContentLoaded',()=>{\n  document.querySelectorAll('.node')";
const origIdx = html.indexOf(origDom);
if (origIdx < 0) {
  // try alternate
  const alt = "document.addEventListener('DOMContentLoaded',()=>{";
  const all = [];
  let p = 0;
  while ((p = html.indexOf(alt, p)) >= 0) {
    all.push(p);
    p += alt.length;
  }
  console.log('DOMContentLoaded positions', all);
  console.error('original node DOMContentLoaded not found');
  process.exit(1);
}

const starts = [
  html.indexOf('// ════════════════════════════════════════════════\n// FIX v2:'),
  html.indexOf('// ═══ External data merge'),
  html.indexOf('(function(){\n\'use strict\';\nif(typeof GAME_DATA'),
];
let cutStart = -1;
for (const s of starts) {
  if (s >= 0 && s < origIdx) {
    if (cutStart < 0 || s < cutStart) cutStart = s;
  }
}
// also look for "FIX v2" alone
const fixPos = html.indexOf('FIX v2');
if (fixPos >= 0) {
  // walk back to line start / comment
  let s = html.lastIndexOf('\n', fixPos);
  const cand = html.lastIndexOf('//', fixPos);
  if (cand > s) s = cand;
  if (s >= 0 && s < origIdx && (cutStart < 0 || s < cutStart)) cutStart = s;
}

if (cutStart >= 0) {
  html = html.slice(0, cutStart) + EXTRA + '\n' + html.slice(origIdx);
  console.log('replaced fix block with EXTRA_JS', cutStart, '->', origIdx);
} else {
  html = html.slice(0, origIdx) + EXTRA + '\n' + html.slice(origIdx);
  console.log('inserted EXTRA_JS before original DOMContentLoaded');
}

// 2) Replace GAME_DATA inline
const gdInline = 'window.GAME_DATA=window.GAME_DATA||' + JSON.stringify(GAME_DATA) + ';';
if (html.includes('window.GAME_DATA=window.GAME_DATA||')) {
  html = html.replace(/window\.GAME_DATA=window\.GAME_DATA\|\|\{[\s\S]*?\};/, gdInline);
  console.log('updated GAME_DATA');
}

// 3) Restore means buttons for siege/weapon
const siegeMeans = `<div class="means-row" id="means-siege">
  <button class="means-btn" onclick="selectMeans('siege','jinput',this)">人足（積載1）</button>
  <button class="means-btn" onclick="selectMeans('siege','cart',this)">荷車（積載2）</button>
</div>`;
const weaponMeans = `<div class="means-row" id="means-weapon">
  <button class="means-btn" onclick="selectMeans('weapon','jinput',this)">人足（積載1）</button>
  <button class="means-btn" onclick="selectMeans('weapon','cart',this)">荷車（積載2）</button>
  <button class="means-btn" onclick="selectMeans('weapon','boat',this)">船（積載4）</button>
</div>`;

html = html.replace(/<div class="means-row" id="means-siege"><\/div>/, siegeMeans);
html = html.replace(/<div class="means-row" id="means-siege">\s*<\/div>/, siegeMeans);
html = html.replace(/<div class="means-row" id="means-weapon"><\/div>/, weaponMeans);
html = html.replace(/<div class="means-row" id="means-weapon">\s*<\/div>/, weaponMeans);

// If still empty self-closing style
if (!html.includes("selectMeans('siege','jinput'")) {
  html = html.replace(
    /id="means-siege"[^>]*>[\s\S]*?<\/div>/,
    'id="means-siege">\n  <button class="means-btn" onclick="selectMeans(\'siege\',\'jinput\',this)">人足（積載1）</button>\n  <button class="means-btn" onclick="selectMeans(\'siege\',\'cart\',this)">荷車（積載2）</button>\n</div>'
  );
}
if (!html.includes("selectMeans('weapon','jinput'")) {
  html = html.replace(
    /id="means-weapon"[^>]*>[\s\S]*?<\/div>/,
    'id="means-weapon">\n  <button class="means-btn" onclick="selectMeans(\'weapon\',\'jinput\',this)">人足（積載1）</button>\n  <button class="means-btn" onclick="selectMeans(\'weapon\',\'cart\',this)">荷車（積載2）</button>\n  <button class="means-btn" onclick="selectMeans(\'weapon\',\'boat\',this)">船（積載4）</button>\n</div>'
  );
}
console.log('means siege', html.includes("selectMeans('siege','jinput'"));
console.log('means weapon', html.includes("selectMeans('weapon','jinput'"));

// 4) Food/horse: keep means UI if present (was OK before fix v2 too after first patch)
// Ensure ph-letter-complete
html = html.replace(
  /id="ph-letter-complete"[^>]*>/,
  'id="ph-letter-complete" onclick="tryGoToMgmt()">'
);

fs.writeFileSync(HTML_PATH, html, 'utf8');
console.log('wrote HTML', html.length);

// syntax check main script
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let mm;
let n = 0;
while ((mm = re.exec(html))) {
  if (!mm[1] || mm[1].length < 500) continue;
  try {
    new Function(mm[1]);
    console.log('script OK', n, mm[1].length);
  } catch (e) {
    console.error('script FAIL', n, e.message);
    process.exit(1);
  }
  n++;
}
console.log('RESTORED to pre-fix_gameplay state');
console.log({
  FIXv2: html.includes('FIX v2'),
  External: html.includes('External data merge'),
  tryGo: html.includes('tryGoToMgmt'),
  research: html.includes('researchTech'),
  renderConvoys: html.includes('renderConvoys'),
  food6: html.includes('兵糧×6'),
  food2: (html.match(/兵糧×2/g) || []).length,
});
