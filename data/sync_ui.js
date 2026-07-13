/**
 * ユーザー編集 JSON → HTML / game-data.js へ同期
 *
 * 編集後に実行:
 *   node data/sync_ui.js
 *
 * 対象:
 *   ui_strings.json, facility_lines.json, mat_labels.json
 *   market.json, orders.json, letters.json
 *   輸送_人.png → transport_icons.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = __dirname;
const HTML = path.join(ROOT, 'mou_isso_v0_6.html');

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA, name), 'utf8'));
}

const ui = loadJson('ui_strings.json');
const facility = loadJson('facility_lines.json');
const matLabels = loadJson('mat_labels.json');
const market = loadJson('market.json');
const orders = loadJson('orders.json');
const letters = loadJson('letters.json');

// ── icons ──
function b64png(p) {
  if (!fs.existsSync(p)) return null;
  return 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
}
const iconDir = path.join(DATA, '_icons');
const ICONS = {
  jinput: b64png(path.join(ROOT, '輸送_人.png')),
  cart: b64png(path.join(iconDir, 'icon_cart.png')),
  boat: b64png(path.join(iconDir, 'icon_boat.png')),
  wagon: b64png(path.join(iconDir, 'icon_wagon.png')),
  horse: b64png(path.join(iconDir, 'Horse_★1.png')),
};
console.log(
  'icons',
  Object.fromEntries(Object.entries(ICONS).map(([k, v]) => [k, v ? Math.round(v.length / 1024) + 'KB' : 'MISSING']))
);
fs.writeFileSync(
  path.join(DATA, 'transport_icons.js'),
  'window.TRANSPORT_ICONS = ' + JSON.stringify(ICONS) + ';\n',
  'utf8'
);

// ── game-data.js ──
const GAME_DATA = {
  prices: market.prices,
  prep_quests: orders.prep,
  node_orders: orders.nodes,
  remind_after_turns: orders.remind_after_turns || 3,
  letters,
  facility_lines: facility,
  mat_labels: matLabels,
  ui_strings: ui,
  orders: Object.fromEntries(
    Object.keys(orders.nodes).map((k) => {
      const n1 = orders.nodes[k]['1'];
      return [k, { item_label: n1.label, deadline: n1.deadline }];
    })
  ),
};
fs.writeFileSync(
  path.join(DATA, 'game-data.js'),
  'window.GAME_DATA = ' + JSON.stringify(GAME_DATA, null, 2) + ';\n',
  'utf8'
);
console.log('wrote game-data.js');

// ── patch HTML ──
let html = fs.readFileSync(HTML, 'utf8');
if (!fs.existsSync(HTML + '.bak_before_ui_polish')) {
  fs.writeFileSync(HTML + '.bak_before_ui_polish', html, 'utf8');
  console.log('backup created');
}

// Force-assign UI_STRINGS (not ||=) so json wins
const uiAssign = 'window.UI_STRINGS=' + JSON.stringify(ui) + ';';
if (html.includes('window.UI_STRINGS=window.UI_STRINGS||')) {
  html = html.replace(/window\.UI_STRINGS=window\.UI_STRINGS\|\|\{[\s\S]*?\};/, uiAssign);
  console.log('UI_STRINGS force-assign (was ||=)');
} else if (html.includes('window.UI_STRINGS=')) {
  html = html.replace(/window\.UI_STRINGS=\{[\s\S]*?\};/, uiAssign);
  console.log('UI_STRINGS replaced');
} else {
  html = html.replace(
    '<script src="./data/map_cells.js"></script>',
    '<script src="./data/map_cells.js"></script>\n<script>' + uiAssign + '</script>'
  );
  console.log('UI_STRINGS inserted');
}

// Force TRANSPORT_ICONS jinput (and full object)
const iconAssign = 'window.TRANSPORT_ICONS=' + JSON.stringify(ICONS) + ';';
if (html.includes('window.TRANSPORT_ICONS=window.TRANSPORT_ICONS||')) {
  html = html.replace(/window\.TRANSPORT_ICONS=window\.TRANSPORT_ICONS\|\|\{[\s\S]*?\};/, iconAssign);
  console.log('TRANSPORT_ICONS force-assign');
} else if (html.includes('window.TRANSPORT_ICONS=')) {
  // may be huge
  html = html.replace(/window\.TRANSPORT_ICONS=\{[\s\S]*?\};/, iconAssign);
  console.log('TRANSPORT_ICONS replaced');
}

// GAME_DATA full replace
const gdAssign = 'window.GAME_DATA=' + JSON.stringify(GAME_DATA) + ';';
if (html.includes('window.GAME_DATA=window.GAME_DATA||')) {
  html = html.replace(/window\.GAME_DATA=window\.GAME_DATA\|\|\{[\s\S]*?\};/, gdAssign);
  console.log('GAME_DATA force-assign');
} else if (html.includes('window.GAME_DATA=')) {
  html = html.replace(/window\.GAME_DATA=\{[\s\S]*?\};/, gdAssign);
  console.log('GAME_DATA replaced');
}

// Addon UI_STRINGS var should read window
html = html.replace(
  /var UI_STRINGS = \{[\s\S]*?\};/,
  'var UI_STRINGS = Object.assign({}, window.UI_STRINGS||{});'
);
// also if was JSON embedded
html = html.replace(
  /var UI_STRINGS = \{"sortie_confirm"[\s\S]*?\};/,
  'var UI_STRINGS = Object.assign({}, window.UI_STRINGS||{});'
);

// ── POLISH addon: append/replace polish section inside transport fix ──
const POLISH = `
// ═══ UI polish (sync_ui) ═══
(function(){
'use strict';
// re-bind strings from window (json sync)
if(typeof window.UI_STRINGS==='object'&&window.UI_STRINGS){
  if(typeof UI_STRINGS==='undefined') var UI_STRINGS={};
  Object.assign(UI_STRINGS, window.UI_STRINGS);
}
if(typeof GAME_DATA!=='undefined'&&GAME_DATA){
  if(GAME_DATA.ui_strings) Object.assign(UI_STRINGS||(window.UI_STRINGS={}), GAME_DATA.ui_strings);
  if(GAME_DATA.facility_lines) CFG.facility_lines=GAME_DATA.facility_lines;
  if(GAME_DATA.mat_labels) CFG.mat_labels=GAME_DATA.mat_labels;
  if(GAME_DATA.letters) CFG.letterPool=GAME_DATA.letters;
}
if(!CFG.mat_labels) CFG.mat_labels={iron:'鉄',wood:'木材',niter:'硝石',herb:'薬草',food:'兵糧',food_mat:'兵糧',med:'回復薬',sword:'剣',siege_w:'衝車'};
if(!CFG.facility_lines) CFG.facility_lines={};

function matLabel(k){ return (CFG.mat_labels&&CFG.mat_labels[k])||k; }

// --- 1) phase panels: only one section visible ---
var __setPhase2 = setPhase;
setPhase = function(p){
  __setPhase2(p);
  gs.phase = p;
  var sm=document.getElementById('sec-management');
  var st=document.getElementById('sec-transport');
  var sr=document.getElementById('sec-result');
  if(sm) sm.style.display = (p==='management') ? 'block' : 'none';
  if(st) st.style.display = (p==='transport') ? 'block' : 'none';
  if(sr) sr.style.display = (p==='result') ? 'block' : 'none';
  // hide any stray transport ph-complete if not transport
  if(p!=='transport' && st){
    st.style.display='none';
  }
  if(p==='result'){
    showPendingUnlockModal();
  }
  if(p==='transport' && typeof updateTransportUI==='function') updateTransportUI();
  if(typeof renderConvoys==='function') renderConvoys();
};

// --- 2) convoy icon transparent bg ---
var styleEl=document.getElementById('polish-convoy-css');
if(!styleEl){
  styleEl=document.createElement('style');
  styleEl.id='polish-convoy-css';
  styleEl.textContent=
    '.convoy-icon{background:transparent!important;box-shadow:none;}'+
    '.convoy-icon img{background:transparent;object-fit:contain;}'+
    '#unlock-modal-overlay{display:none;position:fixed;inset:0;z-index:90;background:rgba(8,5,2,.75);align-items:center;justify-content:center;padding:16px;}'+
    '#unlock-modal-overlay.on{display:flex;}'+
    '#unlock-modal{background:var(--paper,#f2ead8);border:3px solid var(--ink,#1a1207);border-radius:8px;max-width:400px;width:92%;padding:16px 18px;box-shadow:0 8px 24px rgba(0,0,0,.5);}'+
    '#unlock-modal h3{font-family:Noto Serif JP,serif;margin:0 0 10px;font-size:16px;letter-spacing:2px;}'+
    '#unlock-modal p{font-size:13px;line-height:1.8;margin:0 0 14px;white-space:pre-line;}'+
    '#unlock-modal button{display:block;width:100%;padding:10px;font-family:Noto Serif JP,serif;font-weight:700;background:linear-gradient(#d8b13a,#b58f1d);border:2px solid #b8860b;border-radius:4px;cursor:pointer;}';
  document.head.appendChild(styleEl);
}

// --- 3) in-transit qty ---
function inTransitQty(route, itemId){
  var n=0;
  (gs.convoys||[]).forEach(function(cv){
    if(cv.route!==route)return;
    (cv.cargo||[]).forEach(function(c){ if(c.id===itemId) n+=(c.qty||0); });
  });
  return n;
}

// wrap ensureOrderUI if exists
if(typeof ensureOrderUI==='function'){
  var __ensureOrderUI = ensureOrderUI;
  ensureOrderUI = function(key){
    __ensureOrderUI(key);
    var box=document.getElementById('titems-'+key);
    var od=gs.order&&gs.order[key];
    if(!box||!od||!od.items)return;
    // rebuild stock line with 輸送中
    var html='';
    od.items.forEach(function(it){
      var qk=key+'_'+it.id;
      if(typeof qtys!=='undefined'&&qtys[qk]==null)qtys[qk]=0;
      var q=(typeof qtys!=='undefined'?qtys[qk]:0)||0;
      var tr=inTransitQty(key,it.id);
      var avail=(typeof stockOf==='function')?stockOf(it.id):0;
      html+='<div class="item-row"><div class="item-info"><div class="item-name">'+it.label+
        '</div><div class="item-stock">現庫:<b>'+avail+'</b> 依頼:'+it.qty+
        ' 到着済:'+(it.delivered||0)+
        (tr>0?(' <span style="color:var(--accent)">輸送中:'+tr+'</span>'):'')+
        '</div></div><div class="item-qty-large">'+
        '<button class="qty-btn-lg" onclick="changeQty(\\''+key+'\\',\\''+it.id+'\\',-1)">－</button>'+
        '<span class="qty-val-lg" id="qty-'+key+'-'+it.id+'">'+q+'</span>'+
        '<button class="qty-btn-lg" onclick="changeQty(\\''+key+'\\',\\''+it.id+'\\',1)">＋</button></div></div>';
    });
    box.innerHTML=html;
  };
}

// --- 4) Go button text fix ---
if(typeof updateTransportUI==='function'){
  var __updTr = updateTransportUI;
  updateTransportUI = function(){
    // phase guard first
    if(gs.phase && gs.phase!=='transport'){
      var st=document.getElementById('sec-transport');
      if(st) st.style.display='none';
      return;
    }
    __updTr();
    PKEYS.forEach(function(key){
      var go=document.getElementById('go-'+key);
      if(!go)return;
      var can = (typeof canTransportThisTurn==='function') ? canTransportThisTurn(key) : true;
      var done = gs.transport[key]&&gs.transport[key].done;
      var node = (gs.node&&gs.node[key])||0;
      if(node<1)return;
      if(done){
        go.textContent = (UI_STRINGS&&UI_STRINGS.go_done)||'✓ 出発済み';
        go.className='go-btn done-btn';
        go.disabled=true;
      }else if(!can){
        go.textContent = (UI_STRINGS&&UI_STRINGS.go_wait_next)||'翌ターンから輸送可';
        go.disabled=true;
        go.className='go-btn';
      }else{
        go.textContent = (UI_STRINGS&&UI_STRINGS.go_depart)||'Go → 出発';
        go.disabled = !(gs.transport[key]&&gs.transport[key].means);
        go.className='go-btn';
      }
    });
  };
}

// canTransportThisTurn: sortieTurn strict >
if(typeof canTransportThisTurn==='function'){
  // redefine clearly
  canTransportThisTurn = function(key){
    if(typeof ensureState==='function') ensureState();
    if((gs.node[key]||0)<1) return false;
    if(gs.sortieTurn && gs.sortieTurn[key]!=null){
      // 出立ターンと同じターンは不可。翌ターン(turn > sortieTurn)から可
      if(gs.turn <= gs.sortieTurn[key]) return false;
    }
    return true;
  };
}

// --- 5) unlock modal ---
if(!gs.pendingUnlocks) gs.pendingUnlocks=[];
function queueUnlock(msgKey, fallback){
  if(!gs.pendingUnlocks) gs.pendingUnlocks=[];
  var msg = (typeof S==='function'?S(msgKey,fallback):null) || (UI_STRINGS&&UI_STRINGS[msgKey]) || fallback;
  if(gs.pendingUnlocks.indexOf(msg)<0) gs.pendingUnlocks.push(msg);
}
if(typeof markNodeCleared==='function'){
  var __mnc = markNodeCleared;
  markNodeCleared = function(key,node){
    var beforeFood1=(gs.cleared.food||[]).indexOf(1)>=0;
    var beforeFood2=(gs.cleared.food||[]).indexOf(2)>=0;
    var beforeHorse2=(gs.cleared.horse||[]).indexOf(2)>=0;
    __mnc(key,node);
    if(key==='food'&&node===1&&!beforeFood1) queueUnlock('unlock_cart','荷車が解禁されました。');
    if(key==='food'&&node===2&&!beforeFood2) queueUnlock('unlock_boat','船が解禁されました。');
    if(key==='horse'&&node===2&&!beforeHorse2) queueUnlock('unlock_wagon','馬車が解禁されました。');
  };
}
function showPendingUnlockModal(){
  if(!gs.pendingUnlocks||!gs.pendingUnlocks.length)return;
  var ov=document.getElementById('unlock-modal-overlay');
  if(!ov){
    ov=document.createElement('div');
    ov.id='unlock-modal-overlay';
    ov.innerHTML='<div id="unlock-modal"><h3 id="unlock-modal-title"></h3><p id="unlock-modal-body"></p><button type="button" id="unlock-modal-ok"></button></div>';
    document.body.appendChild(ov);
    document.getElementById('unlock-modal-ok').onclick=function(){
      gs.pendingUnlocks.shift();
      if(gs.pendingUnlocks.length) showPendingUnlockModal();
      else ov.classList.remove('on');
    };
  }
  document.getElementById('unlock-modal-title').textContent=(UI_STRINGS&&UI_STRINGS.unlock_popup_title)||'解禁のお知らせ';
  document.getElementById('unlock-modal-body').textContent=gs.pendingUnlocks[0];
  document.getElementById('unlock-modal-ok').textContent=(UI_STRINGS&&UI_STRINGS.unlock_ok)||'OK';
  ov.classList.add('on');
}
window.showPendingUnlockModal=showPendingUnlockModal;

// --- 6) facility random lines ---
function pickFacilityLine(key){
  var arr=(CFG.facility_lines&&CFG.facility_lines[key])||(GAME_DATA&&GAME_DATA.facility_lines&&GAME_DATA.facility_lines[key])||[];
  if(!arr.length)return null;
  return arr[Math.floor(Math.random()*arr.length)];
}
function applyFacilityLine(cardId, lineKey){
  var card=document.getElementById(cardId);
  if(!card)return;
  var bubble=card.querySelector('.bubble');
  if(!bubble)return;
  var line=pickFacilityLine(lineKey);
  if(!line)return;
  // keep small note if present
  var small=bubble.querySelector('small');
  var note=small?small.outerHTML:'';
  bubble.innerHTML=line+(note?('<br>'+note):'');
}
if(typeof openCard==='function'){
  var __openCard=openCard;
  openCard=function(name){
    __openCard(name);
    if(name==='market') applyFacilityLine('card-market','market');
    if(name==='smith') applyFacilityLine('card-smith','smith');
    if(name==='pharmacy') applyFacilityLine('card-pharmacy','pharmacy');
    if(name==='ranch') applyFacilityLine('card-ranch','ranch');
  };
}

// --- 7) Japanese recipe costs in management tables ---
function localizeRecipeTables(){
  document.querySelectorAll('#card-smith .mgmt-table td.res-price, #card-pharmacy .mgmt-table td.res-price').forEach(function(td){
    var t=td.textContent||'';
    // replace english keys
    Object.keys(CFG.mat_labels||{}).forEach(function(k){
      var re=new RegExp('\\\\b'+k+'\\\\b','gi');
      t=t.replace(re, CFG.mat_labels[k]);
    });
    // iron×1 style without word boundary in JP mix
    t=t.replace(/iron/gi,'鉄').replace(/wood/gi,'木材').replace(/herb/gi,'薬草').replace(/niter/gi,'硝石');
    td.textContent=t;
  });
}
document.addEventListener('DOMContentLoaded', function(){ setTimeout(localizeRecipeTables, 50); });
if(document.readyState!=='loading') setTimeout(localizeRecipeTables, 50);

// also when opening smith/pharmacy
if(typeof openCard==='function'){
  var __oc2=openCard;
  openCard=function(name){
    __oc2(name);
    if(name==='smith'||name==='pharmacy') setTimeout(localizeRecipeTables,0);
  };
}

console.log('[sync_ui polish] ready');
})();
`;

// Insert POLISH before map DOMContentLoaded, after transport addon
const MARKER = "document.addEventListener('DOMContentLoaded',()=>{\n  document.querySelectorAll('.node')";
const polishStart = html.indexOf('// ═══ UI polish (sync_ui) ═══');
const markIdx = html.indexOf(MARKER);
if (polishStart >= 0 && markIdx > polishStart) {
  html = html.slice(0, polishStart) + POLISH + '\n' + html.slice(markIdx);
  console.log('replaced polish block');
} else if (markIdx >= 0) {
  // insert before original map listener (after transport addon)
  html = html.slice(0, markIdx) + POLISH + '\n' + html.slice(markIdx);
  console.log('inserted polish block');
} else {
  console.error('marker not found');
  process.exit(1);
}

// Japanese-ize static recipe cells in HTML source (iron× / wood×)
html = html.replace(/>iron×/gi, '>鉄×');
html = html.replace(/>wood×/gi, '>木材×');
html = html.replace(/>herb×/gi, '>薬草×');
html = html.replace(/>niter×/gi, '>硝石×');
html = html.replace(/iron×/gi, '鉄×');
html = html.replace(/wood×/gi, '木材×');
html = html.replace(/herb×/gi, '薬草×');
// cost strings like iron・wood
html = html.replace(/>([^<]*)iron([^<]*)</gi, (m, a, b) => '>' + a + '鉄' + b + '<');

fs.writeFileSync(HTML, html, 'utf8');
console.log('HTML written', html.length);

// syntax check
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m;
let n = 0;
while ((m = re.exec(html))) {
  if (!m[1] || m[1].length < 2000) continue;
  try {
    new Function(m[1]);
    console.log('OK script', n, m[1].length);
  } catch (e) {
    console.error('FAIL', n, e.message);
    process.exit(1);
  }
  n++;
}

console.log('\\n=== 同期完了 ===');
console.log('編集して node data/sync_ui.js を実行すれば反映されるファイル:');
console.log('  - data/ui_strings.json');
console.log('  - data/facility_lines.json');
console.log('  - data/letters.json');
console.log('  - data/market.json');
console.log('  - data/orders.json');
console.log('  - data/mat_labels.json');
console.log('  - 輸送_人.png (人足アイコン)');
