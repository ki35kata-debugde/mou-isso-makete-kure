// data/letters.json を HTML 内の window.GAME_DATA.letters に焼き込む
// 使い方: node data\sync_letters.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'mou_isso_v0_6_1.html');
const lettersPath = path.join(__dirname, 'letters.json');

const html = fs.readFileSync(htmlPath, 'utf8');
const letters = JSON.parse(fs.readFileSync(lettersPath, 'utf8'));

const m = html.match(/(<script>window\.GAME_DATA=)(\{[\s\S]*?\})(;?<\/script>)/);
if (!m) { console.error('GAME_DATA が見つかりません'); process.exit(1); }

const gd = JSON.parse(m[2]);
if (!gd.letters) { console.error('GAME_DATA.letters がありません'); process.exit(1); }
gd.letters = letters;

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const bak = htmlPath + '.bak_letters_' + stamp;
fs.copyFileSync(htmlPath, bak);

const out = html.slice(0, m.index) + m[1] + JSON.stringify(gd) + m[3] + html.slice(m.index + m[0].length);
fs.writeFileSync(htmlPath, out);
console.log('完了: GAME_DATA.letters を同期しました');
console.log('バックアップ: ' + path.basename(bak));
