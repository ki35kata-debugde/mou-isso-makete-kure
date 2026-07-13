/**
 * SAFE horses v1 on mou_isso_v0_6_1.html only.
 * Minimal DOM edits; no phase-button / layout rewrites.
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/kzawa/Downloads/Grok';
const HTML = path.join(ROOT, 'mou_isso_v0_6_1.html');
const HORSES_JSON = path.join(ROOT, 'data', 'horses.json');

if (!fs.existsSync(HTML)) {
  console.error('missing', HTML);
  process.exit(1);
}

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_safe_horses_' + Date.now(), h, 'utf8');
console.log('backup written, base size', h.length);

if (h.includes('[horses v1 safe]')) {
  console.log('already applied — abort to avoid double patch');
  process.exit(0);
}

const horsesData = JSON.parse(fs.readFileSync(HORSES_JSON, 'utf8'));

// ── CSS (append only) ──
const CSS = `
/* horses v1 safe — do not touch phase buttons */
#horse-stray-overlay{
  display:none;position:fixed;inset:0;z-index:90;
  background:rgba(8,5,2,.88);align-items:center;justify-content:center;padding:12px;
}
#horse-stray-overlay.on{display:flex;}
.horse-stray-modal{
  width:min(96%,520px);max-height:92vh;overflow-y:auto;
  background:var(--paper);border:3px solid var(--ink);border-radius:8px;
  box-shadow:0 8px 28px rgba(0,0,0,.55);padding:14px 16px 16px;
}
.horse-stray-modal h3{font-family:'Noto Serif JP',serif;font-size:16px;margin:0 0 8px;letter-spacing:2px;}
.horse-stray-modal .hs-desc{font-size:12px;color:var(--faded);line-height:1.7;margin-bottom:12px;}
.hs-sex-label{font-size:12px;font-weight:700;margin:10px 0 6px;color:var(--ink);}
.hs-row{display:flex;gap:8px;flex-wrap:wrap;}
.hs-card{
  flex:1;min-width:120px;padding:10px;border:2px solid var(--border);border-radius:6px;
  background:var(--paper2);cursor:pointer;text-align:center;font-size:12px;line-height:1.5;
}
.hs-card:hover{border-color:var(--gold);}
.hs-card.selected{border-color:var(--gold);background:#f0e0b0;}
.hs-card .hs-name{font-family:'Noto Serif JP',serif;font-weight:700;font-size:14px;}
.hs-card .hs-meta{color:var(--faded);font-size:11px;margin-top:4px;}
.hs-actions{display:flex;gap:8px;margin-top:14px;}
.hs-actions .hs-ok{
  flex:1;padding:10px;font-family:'Noto Serif JP',serif;font-size:13px;font-weight:700;
  border-radius:4px;cursor:pointer;border:2px solid var(--gold);
  background:linear-gradient(#d8b13a,#b58f1d);color:#241d11;
}
.hs-actions .hs-ok:disabled{opacity:.4;cursor:default;}
#ranch-horse-list{margin-top:10px;}
.ranch-horse-table{width:100%;border-collapse:collapse;font-size:11.5px;}
.ranch-horse-table th,.ranch-horse-table td{border:1px solid var(--border);padding:5px 6px;text-align:center;}
.ranch-horse-table th{background:var(--panel);font-weight:700;}
.ranch-horse-table td.name{text-align:left;font-family:'Noto Serif JP',serif;font-weight:700;}
.ranch-empty{font-size:12px;color:var(--faded);padding:8px 0;}
`;
if (!h.includes('/* horses v1 safe')) {
  h = h.replace('</style>', CSS + '\n</style>');
  console.log('css ok');
}

// ── Ranch list: ONLY insert inside card-ranch body, before its closing ──
// card-ranch structure: card > head + body > girl-row ; body closes ; card closes
// Insert <div id="ranch-horse-list"></div> just before </div> that closes card-body
if (!h.includes('id="ranch-horse-list"')) {
  const ranchIdx = h.indexOf('id="card-ranch"');
  if (ranchIdx < 0) {
    console.error('card-ranch missing');
    process.exit(1);
  }
  // Find card-body after ranch
  const bodyIdx = h.indexOf('<div class="card-body">', ranchIdx);
  const mgmtPh = h.indexOf('id="ph-actions-mgmt"', ranchIdx);
  if (bodyIdx < 0 || mgmtPh < 0 || bodyIdx > mgmtPh) {
    console.error('card-ranch body/ph markers wrong', { bodyIdx, mgmtPh });
    process.exit(1);
  }
  // Insert list right before the close of card-body: the </div> immediately before
  // the structure is: girl-row ... </div></div> (girl, body) then </div> (card) then ph-actions
  // Looking at file: after girl-row: </div></div>\n  </div>\n  <div ph-actions-mgmt
  // That's: girl-row close, body close, card close, ph-actions
  const slice = h.slice(ranchIdx, mgmtPh);
  const needle = '</div>\n  </div>\n  <div class="ph-actions" id="ph-actions-mgmt"';
  // more flexible
  const re = /(id="card-ranch"[\s\S]*?<div class="card-body">[\s\S]*?)(<\/div>\s*<\/div>\s*<div class="ph-actions" id="ph-actions-mgmt")/;
  // card-body contains girl-row; closes with </div> for body then </div> for card - but ph-actions is SIBLING of card inside sec-management
  // Actual:
  //   <div card-ranch>
  //     head
  //     <div card-body>
  //       girl-row ... </div></div>  wait girl-row is one div
  //     </div> body
  //   </div> card
  //   <div ph-actions-mgmt>
  const re2 =
    /(<div class="card" id="card-ranch">[\s\S]*?<div class="card-body">[\s\S]*?<\/div>\s*)(<\/div>\s*<div class="ph-actions" id="ph-actions-mgmt")/;
  if (re2.test(h)) {
    h = h.replace(
      re2,
      '$1<div id="ranch-horse-list"></div>\n    $2'
    );
    console.log('ranch list inserted (re2)');
  } else {
    // fallback: after bubble small text close
    const marker = '（牧場機能は次の試作で実装予定）';
    const mi = h.indexOf(marker);
    if (mi > 0) {
      // after </div></div> following marker (bubble + girl-row)
      const after = h.indexOf('</div></div>', mi);
      if (after > 0) {
        const pos = after + '</div></div>'.length;
        h =
          h.slice(0, pos) +
          '\n      <div id="ranch-horse-list"></div>' +
          h.slice(pos);
        console.log('ranch list inserted after girl-row');
      }
    } else {
      console.error('could not insert ranch list');
      process.exit(1);
    }
  }
  // update bubble note
  h = h.replace('（牧場機能は次の試作で実装予定）', '牧場の馬を育てます');
}

// ── Prep panel horse: replace ONLY prep-panel-horse block (not surrounding) ──
const prepStart = h.indexOf('id="prep-panel-horse"');
const prepEnd = h.indexOf('id="sortie-area-horse"', prepStart);
if (prepStart > 0 && prepEnd > prepStart) {
  // include from id=prep-panel-horse back to opening <div
  const open = h.lastIndexOf('<div', prepStart);
  // panel ends at </div> before sortie-area - find matching
  // Simple: from open to just before <div class="sortie-area" id="sortie-area-horse"
  const sortieOpen = h.lastIndexOf('<div', prepEnd);
  const oldPanel = h.slice(open, sortieOpen);
  const newPanel = `<div class="prep-panel" id="prep-panel-horse">
  <div class="prep-header">📦 出立準備依頼（手渡し・即時）</div>
  <div class="item-row">
    <div class="item-info">
      <div class="item-name">兵糧</div>
      <div class="item-stock" id="prep-stock-horse-food">現庫: <b>0</b>　必要: 4</div>
    </div>
    <div class="item-qty-large">
      <button class="qty-btn-lg" onclick="changePrepQtyHorse('food',-1)">－</button>
      <span class="qty-val-lg" id="prep-qty-horse-food">0</span>
      <button class="qty-btn-lg" onclick="changePrepQtyHorse('food',1)">＋</button>
    </div>
  </div>
  <div class="item-row">
    <div class="item-info">
      <div class="item-name">回復薬</div>
      <div class="item-stock" id="prep-stock-horse-med">現庫: <b>0</b>　必要: 1</div>
    </div>
    <div class="item-qty-large">
      <button class="qty-btn-lg" onclick="changePrepQtyHorse('med',-1)">－</button>
      <span class="qty-val-lg" id="prep-qty-horse-med">0</span>
      <button class="qty-btn-lg" onclick="changePrepQtyHorse('med',1)">＋</button>
    </div>
  </div>
  <div class="prep-info" id="prep-info-horse">兵糧×4と回復薬×1を手渡すと信頼度+3。薬は冬の牧場でも大事…</div>
  <button class="hand-btn" id="hand-btn-horse" onclick="handDeliverHorse()" disabled>手渡しする</button>
</div>
`;
  h = h.slice(0, open) + newPanel + h.slice(sortieOpen);
  console.log('prep horse panel replaced');
} else {
  console.warn('prep-panel-horse not found', prepStart, prepEnd);
}

// ── Stray overlay: insert before save-overlay only ──
if (!h.includes('id="horse-stray-overlay"')) {
  const saveOv = h.indexOf('<div id="save-overlay"');
  if (saveOv < 0) {
    console.error('save-overlay missing');
    process.exit(1);
  }
  const strayHtml = `
<div id="horse-stray-overlay">
  <div class="horse-stray-modal" role="dialog" aria-modal="true">
    <h3 id="hs-title">迷い馬</h3>
    <div class="hs-desc" id="hs-desc"></div>
    <div class="hs-sex-label">雄から1頭</div>
    <div class="hs-row" id="hs-males"></div>
    <div class="hs-sex-label">雌から1頭</div>
    <div class="hs-row" id="hs-females"></div>
    <div class="hs-actions">
      <button type="button" class="hs-ok" id="hs-confirm" disabled onclick="confirmStrayHorses()">この2頭を引き取る</button>
    </div>
  </div>
</div>
`;
  h = h.slice(0, saveOv) + strayHtml + h.slice(saveOv);
  console.log('stray overlay ok');
}

// ── Neutralize gold buy (keep function name, stop spending) — JS override also ──
h = h.replace(
  /window\.buyRanchHorse=function\(\)\{\s*if\(gs\.gold<40\)\{showToast\('金が足りません'\);return;\}\s*gs\.gold-=40; gs\.ranchHorses=\(gs\.ranchHorses\|\|0\)\+1;\s*updateHeaderDisplay\(\); updateTransportUI\(\);\s*showToast\('牧場の馬 \+1（'\+gs\.ranchHorses\+'頭）'\);\s*\};/,
  `window.buyRanchHorse=function(){ showToast('馬は買えません。牧場の迷い馬や進言で手に入ります'); };`
);

// Remove buy UI injection block if present
h = h.replace(
  /var ranch=document\.getElementById\('card-ranch'\);\s*if\(ranch&&!document\.getElementById\('ranch-horse-btn'\)\)\{[\s\S]*?if\(rc\)rc\.textContent=String\(gs\.ranchHorses\|\|0\);/,
  '/* ranch buy UI removed — horses v1 safe */'
);
console.log('buy UI neutralized');

// Patch GAME_DATA prep horse in HTML if present
h = h.replace(
  /"horse":\{"item":"horse","label":"★1馬","qty":2,"trust_reward":3\}/,
  '"horse":{"items":[{"item":"food","label":"兵糧","qty":4},{"item":"med","label":"回復薬","qty":1}],"label":"兵糧×4・回復薬×1","trust_reward":3}'
);

// ── JS addon ONLY (no setPhase reimplementation except light chain) ──
const ADDON = `
// ═══ Horses v1 safe (on v0.6.1 base) ═══
window.HORSE_DATA = ${JSON.stringify(horsesData)};
(function(){
'use strict';
if(window.__horsesV1Safe) return;
window.__horsesV1Safe = true;

var HD = window.HORSE_DATA || {};
var RANK_TABLE = HD.rankTable || {
  '1':{speed:1,capacity:1},'2':{speed:2,capacity:1},'3':{speed:2,capacity:2},
  '4':{speed:3,capacity:1},'5':{speed:3,capacity:2}
};
var NAMES = HD.names || ['胡瓜','南瓜','綿飴'];
var TRAITS = HD.traits || ['のんびり'];
var STR = HD.strings || {};
var STAR2 = HD.strayStar2Chance != null ? HD.strayStar2Chance : 0.28;
var _hid = 1;
var _stray = { m:[], f:[], pickM:null, pickF:null };

function S(k, fb){ return STR[k] || fb || k; }
function ensureHorseState(){
  if(!gs.horses) gs.horses = [];
  if(!gs.ranch) gs.ranch = { introDone:false, maxPairs:1, pairs:[], shippingUnlocked:false };
  if(gs.ranch.introDone == null) gs.ranch.introDone = false;
  gs.ranchHorses = gs.horses.filter(function(x){
    return x.status==='ranch' || x.status==='paired' || x.status==='transit';
  }).length;
}
function displayStar(rank){
  var s = Math.floor(Number(rank)||1);
  if(s<1)s=1; if(s>5)s=5; return s;
}
function statsForRank(rank){
  var st = displayStar(rank);
  var t = RANK_TABLE[String(st)] || {speed:1,capacity:1};
  return { star:st, speed:t.speed, capacity:t.capacity };
}
function randomName(){
  ensureHorseState();
  var used = {};
  gs.horses.forEach(function(hh){ used[hh.name]=1; });
  var pool = NAMES.filter(function(n){ return !used[n]; });
  if(!pool.length) pool = NAMES.slice();
  return pool[Math.floor(Math.random()*pool.length)];
}
function randomTrait(){ return TRAITS[Math.floor(Math.random()*TRAITS.length)]; }
function rollRank(){ return Math.random() < STAR2 ? 2 : 1; }
function makeHorse(opts){
  opts = opts || {};
  var rank = opts.rank != null ? opts.rank : 1;
  var st = statsForRank(rank);
  return {
    id: opts.id || ('h_'+(_hid++)+'_'+Date.now().toString(36)),
    name: opts.name || randomName(),
    sex: opts.sex || 'm',
    rank: Math.round(rank*10)/10,
    speed: st.speed,
    capacity: st.capacity,
    status: opts.status || 'ranch',
    bornTurn: opts.bornTurn != null ? opts.bornTurn : (gs.turn||1),
    shippableFromTurn: null,
    pairId: null,
    winterFood: 0,
    winterMed: 0,
    trait: opts.trait || randomTrait(),
    source: opts.source || 'unknown'
  };
}
function addHorse(opts){
  ensureHorseState();
  var horse = makeHorse(opts);
  gs.horses.push(horse);
  ensureHorseState();
  return horse;
}
function ownedRanch(){
  ensureHorseState();
  return gs.horses.filter(function(x){ return x.status==='ranch'; });
}
function hasHorseMeans(){
  ensureHorseState();
  return gs.horses.some(function(x){ return x.status==='ranch' || x.status==='transit'; });
}

function renderRanchHorseList(){
  ensureHorseState();
  var box = document.getElementById('ranch-horse-list');
  if(!box) return;
  var list = gs.horses.filter(function(x){
    return x.status==='ranch'||x.status==='paired'||x.status==='transit';
  });
  if(!list.length){
    box.innerHTML = '<div class="ranch-empty">'+S('list_empty','まだ馬がいません。')+'</div>';
    return;
  }
  var html = '<table class="ranch-horse-table"><thead><tr>'+
    '<th>名前</th><th>性</th><th>★</th><th>速</th><th>容</th><th>性質</th><th>状態</th></tr></thead><tbody>';
  list.forEach(function(hh){
    var st = statsForRank(hh.rank);
    html += '<tr><td class="name">'+hh.name+'</td><td>'+(hh.sex==='f'?'雌':'雄')+
      '</td><td>'+st.star+'</td><td>'+st.speed+'</td><td>'+st.capacity+
      '</td><td>'+(hh.trait||'—')+'</td><td>'+S('status_'+hh.status, hh.status)+'</td></tr>';
  });
  html += '</tbody></table>';
  box.innerHTML = html;
}
window.renderRanchHorseList = renderRanchHorseList;

function setRanchBubble(text){
  var card = document.getElementById('card-ranch');
  if(!card) return;
  var bubble = card.querySelector('.bubble');
  if(!bubble) return;
  var small = bubble.querySelector('small');
  var note = small ? small.outerHTML : '';
  bubble.innerHTML = text + (note ? '<br>'+note : '');
}

function openStrayHorseEvent(){
  ensureHorseState();
  if(gs.ranch.introDone) return;
  _stray.m = [makeHorse({sex:'m',rank:rollRank(),source:'stray'}), makeHorse({sex:'m',rank:rollRank(),source:'stray'})];
  _stray.f = [makeHorse({sex:'f',rank:rollRank(),source:'stray'}), makeHorse({sex:'f',rank:rollRank(),source:'stray'})];
  var seen={};
  [_stray.m[0],_stray.m[1],_stray.f[0],_stray.f[1]].forEach(function(hh){
    var g=0; while(seen[hh.name]&&g++<20) hh.name=randomName(); seen[hh.name]=1;
  });
  _stray.pickM = null; _stray.pickF = null;
  var title=document.getElementById('hs-title');
  var desc=document.getElementById('hs-desc');
  if(title) title.textContent=S('stray_title','迷い馬');
  if(desc) desc.textContent=S('stray_body','牧場の前に迷い馬がいます…');
  paintRow('hs-males', _stray.m, 'm');
  paintRow('hs-females', _stray.f, 'f');
  var btn=document.getElementById('hs-confirm');
  if(btn){ btn.disabled=true; }
  var ov=document.getElementById('horse-stray-overlay');
  if(ov) ov.classList.add('on');
}
function paintRow(id, arr, sex){
  var row=document.getElementById(id); if(!row) return;
  row.innerHTML='';
  arr.forEach(function(hh, idx){
    var st=statsForRank(hh.rank);
    var card=document.createElement('div');
    card.className='hs-card';
    card.innerHTML='<div class="hs-name">'+hh.name+'</div><div class="hs-meta">★'+st.star+'　速'+st.speed+'　容'+st.capacity+'</div><div class="hs-meta">'+(hh.trait||'')+'</div>';
    card.onclick=function(){ selectStray(sex, idx); };
    row.appendChild(card);
  });
}
function selectStray(sex, idx){
  if(sex==='m') _stray.pickM=idx; else _stray.pickF=idx;
  document.querySelectorAll('#hs-males .hs-card').forEach(function(c,i){ c.classList.toggle('selected', _stray.pickM===i); });
  document.querySelectorAll('#hs-females .hs-card').forEach(function(c,i){ c.classList.toggle('selected', _stray.pickF===i); });
  var btn=document.getElementById('hs-confirm');
  if(btn) btn.disabled = !(_stray.pickM!=null && _stray.pickF!=null);
}
window.confirmStrayHorses = function(){
  ensureHorseState();
  if(_stray.pickM==null||_stray.pickF==null){
    showToast(S('stray_need_both','雄と雌を1頭ずつ選んでください')); return;
  }
  var keepM=_stray.m[_stray.pickM], keepF=_stray.f[_stray.pickF];
  keepM.status='ranch'; keepF.status='ranch';
  gs.horses.push(keepM, keepF);
  gs.ranch.introDone=true;
  ensureHorseState();
  var ov=document.getElementById('horse-stray-overlay');
  if(ov) ov.classList.remove('on');
  showToast(S('stray_done','迷い馬を2頭引き取りました'));
  setTimeout(function(){ showToast(S('stray_fled','選ばれなかった馬は逃げていきました')); }, 700);
  setRanchBubble(S('bubble_after_stray','…この子たち、筋が良さそうです。'));
  renderRanchHorseList();
  if(typeof updateTransportUI==='function') updateTransportUI();
};

function grantHorseFind(){
  var horse=addHorse({ sex: Math.random()<0.5?'m':'f', rank:rollRank(), source:'horse_find' });
  showToast(S('horse_find_ok','名馬探索：{name}（★{star}）')
    .replace('{name}',horse.name).replace('{star}',String(displayStar(horse.rank))));
  renderRanchHorseList();
  return horse;
}

// means unlock
var __imu = typeof isMeansUnlocked==='function' ? isMeansUnlocked : null;
isMeansUnlocked = function(m){
  ensureHorseState();
  if(m==='horse') return hasHorseMeans();
  if(m==='wagon'){
    return !!(gs.cleared&&gs.cleared.horse&&gs.cleared.horse.indexOf(2)>=0) &&
      isMeansUnlocked('cart') && hasHorseMeans();
  }
  return __imu ? __imu(m) : false;
};
var __stockOf = typeof stockOf==='function' ? stockOf : null;
stockOf = function(id){
  if(id==='horse'){ ensureHorseState(); return ownedRanch().length; }
  return __stockOf ? __stockOf(id) : 0;
};
var __takeStock = typeof takeStock==='function' ? takeStock : null;
takeStock = function(id,q){
  if(id==='horse') return; // never consume horses
  if(__takeStock) __takeStock(id,q);
};

window.buyRanchHorse = function(){
  showToast('馬は買えません。牧場の迷い馬や進言で手に入ります');
};

// prep multi
function ensurePrepQtyHorse(){
  if(!gs.prepQtyHorse || typeof gs.prepQtyHorse!=='object') gs.prepQtyHorse={food:0,med:0};
}
window.changePrepQtyHorse = function(item, delta){
  if(gs.prepDone&&gs.prepDone.horse) return;
  ensurePrepQtyHorse();
  var need = item==='med'?1:4;
  var avail = item==='med'?(gs.stock.med||0):(gs.inv.food||0);
  var cur = gs.prepQtyHorse[item]||0;
  var nv = Math.max(0, Math.min(Math.min(avail,need), cur+delta));
  gs.prepQtyHorse[item]=nv;
  var el=document.getElementById('prep-qty-horse-'+item);
  if(el) el.textContent=nv;
  var si=document.getElementById('prep-stock-horse-'+item);
  if(si) si.innerHTML='現庫: <b>'+avail+'</b>　必要: '+need+'　選択: <b>'+nv+'</b>';
  var btn=document.getElementById('hand-btn-horse');
  if(btn) btn.disabled = !((gs.prepQtyHorse.food||0)>=4 && (gs.prepQtyHorse.med||0)>=1);
};
window.handDeliverHorse = function(){
  if(gs.prepDone&&gs.prepDone.horse) return;
  ensurePrepQtyHorse();
  if((gs.prepQtyHorse.food||0)<4 || (gs.prepQtyHorse.med||0)<1){
    showToast('兵糧×4と回復薬×1が必要です'); return;
  }
  if((gs.inv.food||0)<4 || (gs.stock.med||0)<1){ showToast('在庫が足りません'); return; }
  gs.inv.food-=4; gs.stock.med-=1;
  gs.trust.horse=Math.min(100,(gs.trust.horse||0)+3);
  gs.prepDone.horse=true;
  var pi=document.getElementById('prep-info-horse');
  if(pi) pi.textContent='✓ 準備依頼を完了しました！（兵糧×4・回復薬×1）';
  var hb=document.getElementById('hand-btn-horse');
  if(hb){ hb.textContent='✓ 手渡し済み'; hb.className='hand-btn done'; hb.disabled=true; }
  showToast((typeof PNAMES!=='undefined'?PNAMES.horse:'騎馬次')+'への手渡し（信頼度 +3）');
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updateStockBar==='function') updateStockBar();
  if(typeof updatePrinceBar==='function') updatePrinceBar();
  if(typeof checkSortieConditions==='function') checkSortieConditions();
  if(typeof updateTabLabels==='function') updateTabLabels();
};
var __hand = typeof handDeliver==='function' ? handDeliver : null;
if(__hand){
  handDeliver = function(key){
    if(key==='horse'){ handDeliverHorse(); return; }
    __hand(key);
  };
}
var __cpq = typeof changePrepQty==='function' ? changePrepQty : null;
if(__cpq){
  changePrepQty = function(key, delta){
    if(key==='horse') return;
    __cpq(key, delta);
  };
}
if(typeof CFG!=='undefined'){
  CFG.prep_quests = CFG.prep_quests || {};
  CFG.prep_quests.horse = {
    items:[{item:'food',label:'兵糧',qty:4},{item:'med',label:'回復薬',qty:1}],
    label:'兵糧×4・回復薬×1', trust_reward:3
  };
}

// openCard: ranch only — do NOT wrap setPhase
var __oc = typeof openCard==='function' ? openCard : null;
if(__oc){
  openCard = function(name){
    __oc(name);
    var buy=document.getElementById('ranch-horse-btn');
    if(buy&&buy.parentNode) buy.parentNode.remove();
    if(name==='ranch'){
      ensureHorseState();
      renderRanchHorseList();
      if(!gs.ranch.introDone) setTimeout(openStrayHorseEvent, 60);
      else setRanchBubble(S('bubble_default','…牧場の馬たちを見ていきます。'));
    }
  };
}

// updateTransportUI: strip buy btn + refresh prep labels — chain only
var __utu = typeof updateTransportUI==='function' ? updateTransportUI : null;
if(__utu){
  updateTransportUI = function(){
    __utu();
    var buy=document.getElementById('ranch-horse-btn');
    if(buy&&buy.parentNode) buy.parentNode.remove();
    ensurePrepQtyHorse();
    var af=gs.inv.food||0, am=gs.stock.med||0;
    var sf=document.getElementById('prep-stock-horse-food');
    var sm=document.getElementById('prep-stock-horse-med');
    if(sf) sf.innerHTML='現庫: <b>'+af+'</b>　必要: 4　選択: <b>'+(gs.prepQtyHorse.food||0)+'</b>';
    if(sm) sm.innerHTML='現庫: <b>'+am+'</b>　必要: 1　選択: <b>'+(gs.prepQtyHorse.med||0)+'</b>';
    var pf=document.getElementById('prep-qty-horse-food');
    var pm=document.getElementById('prep-qty-horse-med');
    if(pf) pf.textContent=gs.prepQtyHorse.food||0;
    if(pm) pm.textContent=gs.prepQtyHorse.med||0;
  };
}

// goToNextTurn: horse_find + return transit
var __gn = typeof goToNextTurn==='function' ? goToNextTurn : null;
if(__gn){
  goToNextTurn = function(){
    ensureHorseState();
    if(gs.kengen && gs.kengen.shingen==='horse_find') grantHorseFind();
    gs.horses.forEach(function(hh){ if(hh.status==='transit') hh.status='ranch'; });
    ensureHorseState();
    __gn();
    gs.prepQtyHorse={food:0,med:0};
    renderRanchHorseList();
  };
}

var __br = typeof buildResultScreen==='function' ? buildResultScreen : null;
if(__br){
  buildResultScreen = function(){
    __br();
    if(gs.kengen && gs.kengen.shingen==='horse_find'){
      var kng=document.getElementById('result-kengen');
      if(kng) kng.innerHTML += '<div style="color:var(--green)">🐎 名馬探索：次ターン開始時に牧場へ馬が加わります</div>';
    }
  };
}

var __as = typeof applySaveData==='function' ? applySaveData : null;
if(__as){
  applySaveData = function(data){
    var ok=__as(data);
    ensureHorseState();
    renderRanchHorseList();
    return ok;
  };
}

// IMPORTANT: do not re-wrap setPhase / showPhaseCompleteRows
// Only ensure buy UI gone on boot
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    ensureHorseState();
    var buy=document.getElementById('ranch-horse-btn');
    if(buy&&buy.parentNode) buy.parentNode.remove();
    renderRanchHorseList();
  }, 40);
});

console.log('[horses v1 safe] ready on v0.6.1 base');
})();
`;

// Insert BEFORE map DOMContentLoaded — after existing map+yellow block if any
const MARK = "document.addEventListener('DOMContentLoaded',()=>{\n  document.querySelectorAll('.node')";
if (h.includes(MARK)) {
  h = h.replace(MARK, ADDON + '\n' + MARK);
  console.log('addon inserted before map boot');
} else {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + ADDON + '\n' + h.slice(last);
  console.log('addon appended');
}

// Verify phase machinery untouched
const phaseOk =
  h.includes('showPhaseCompleteRows') &&
  h.includes('id="ph-actions-mgmt"') &&
  h.includes('id="ph-actions-trans"') &&
  h.includes('#ph-actions-mgmt, #ph-actions-trans');
console.log('phase intact', phaseOk);

fs.writeFileSync(HTML, h, 'utf8');

// syntax
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m,
  n = 0,
  fail = false;
while ((m = re.exec(h))) {
  if (!m[1] || m[1].length < 3000) continue;
  try {
    new Function(m[1]);
    console.log('OK', n, m[1].length);
  } catch (e) {
    console.error('FAIL', n, e.message);
    fail = true;
  }
  n++;
}

console.log('DONE', {
  file: 'mou_isso_v0_6_1.html',
  horses: h.includes('[horses v1 safe]'),
  list: h.includes('ranch-horse-list'),
  stray: h.includes('horse-stray-overlay'),
  prep: h.includes('changePrepQtyHorse'),
  phaseOk,
  fail,
  size: h.length,
});
if (fail || !phaseOk) process.exit(1);
