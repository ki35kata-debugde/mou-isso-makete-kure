/**
 * 牧場画面の改修:
 * - 馬アイコン(★1〜5)をBase64で埋め込み window.HORSE_ICONS を追加
 * - 牧場の個体表: 先頭にアイコン列を追加、「容量」「状態」列を削除
 * - 表の下の説明文を変更
 * 対象: mou_isso_v0_6_1.html（プロジェクト直下）
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'mou_isso_v0_6_1.html');

let h = fs.readFileSync(HTML, 'utf8');

if (h.includes('[ranch icons+table] ready')) {
  console.log('already applied, skip');
  process.exit(0);
}

fs.writeFileSync(HTML + '.bak_ranch_icons_' + Date.now(), h, 'utf8');

// 1) 馬アイコンをBase64で読み込み
const iconDir = path.join(ROOT, 'assets', 'assets');
let iconEntries = [];
for (let star = 1; star <= 5; star++) {
  const p = path.join(iconDir, 'Horse_★' + star + '.png');
  if (!fs.existsSync(p)) {
    console.error('missing icon file:', p);
    process.exit(1);
  }
  const b64 = fs.readFileSync(p).toString('base64');
  iconEntries.push(String(star) + ':"data:image/png;base64,' + b64 + '"');
}
const iconScript =
  '\n<script>\nwindow.HORSE_ICONS = {' + iconEntries.join(',') + '};\n' +
  "console.log('[ranch icons+table] ready');\n</script>\n";

// 2) </body> 直前に挿入（無ければ末尾）
if (h.includes('</body>')) {
  h = h.replace('</body>', iconScript + '</body>');
} else {
  h = h + iconScript;
}

// 3) 表の書き換え: 先頭にアイコン列追加、容量・状態列を削除、footer文言変更
const oldHeader = '<th>名前</th><th>性</th><th>★</th><th>速さ</th><th>容量</th><th>性質</th><th>状態</th><th>売却</th></tr></thead><tbody>';
const newHeader = '<th>馬</th><th>名前</th><th>性</th><th>★</th><th>速さ</th><th>性質</th><th>売却</th></tr></thead><tbody>';
if (!h.includes(oldHeader)) {
  console.error('ranch table header not found (already changed?)');
  process.exit(1);
}
h = h.replace(oldHeader, newHeader);

const oldRow =
  "html += '<tr><td class=\"name\">'+(hh.name||'?')+'</td><td>'+(hh.sex==='f'?'メス':'オス')+\n" +
  "      '</td><td>'+st.star+'</td><td>'+st.speed+'</td><td>'+st.capacity+\n" +
  "      '</td><td>'+(hh.trait||'—')+'</td><td>'+statusLabel+'</td><td>'+btn+'</td></tr>';";
const newRow =
  "var iconSrc=(window.HORSE_ICONS&&window.HORSE_ICONS[st.star])||'';\n" +
  "    html += '<tr><td class=\"horse-icon\">'+(iconSrc?('<img src=\"'+iconSrc+'\" alt=\"★'+st.star+'\" class=\"horse-icon-img\">'):'')+'</td>'+\n" +
  "      '<td class=\"name\">'+(hh.name||'?')+'</td><td>'+(hh.sex==='f'?'メス':'オス')+\n" +
  "      '</td><td>'+st.star+'</td><td>'+st.speed+\n" +
  "      '</td><td>'+(hh.trait||'—')+'</td><td>'+btn+'</td></tr>';";
if (!h.includes(oldRow)) {
  console.error('ranch table row template not found (already changed?)');
  process.exit(1);
}
h = h.replace(oldRow, newRow);

const oldFooter = "html += '<div style=\"font-size:11px;color:var(--faded);margin-top:6px\">売却は牧場の個体リストから（市場には並びません）。出荷解禁後に有効。</div>';";
const newFooter = "html += '<div style=\"font-size:11px;color:var(--faded);margin-top:6px\">牧場の一年★春：仔馬出産、秋：ペア決定、冬：兵糧/薬投与★　健やかに育ってね</div>';";
if (!h.includes(oldFooter)) {
  console.error('ranch table footer not found (already changed?)');
  process.exit(1);
}
h = h.replace(oldFooter, newFooter);

// 4) アイコン表示用CSS（未追加なら1回だけ追加）
if (!h.includes('.horse-icon-img{')) {
  const css = '\n<style>\n.horse-icon-img{width:32px;height:32px;object-fit:contain;display:block;}\ntd.horse-icon{width:36px;text-align:center;}\n</style>\n';
  if (h.includes('</head>')) {
    h = h.replace('</head>', css + '</head>');
  } else {
    h = css + h;
  }
}

// 5) 構文チェック
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m;
let fail = false;
while ((m = re.exec(h))) {
  const body = m[1];
  if (!body || body.length < 20) continue;
  if (/^\s*src\s*=/i.test(m[0])) continue;
  try {
    new Function(body);
  } catch (e) {
    fail = true;
    console.error('script FAIL', e.message);
  }
}
if (fail) {
  console.error('HTML has syntax errors, NOT writing');
  process.exit(1);
}

fs.writeFileSync(HTML, h, 'utf8');
console.log('DONE: ranch icons + table polish applied');
