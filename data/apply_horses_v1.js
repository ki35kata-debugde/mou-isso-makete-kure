/**
 * Horses v1 Phase A:
 * - Individual horse model (gs.horses / gs.ranch)
 * - Remove gold buy
 * - Stray horse intro on first ranch open
 * - Ranch list UI
 * - Transport unlock by owned horses
 * - horse_find grants ★1-2 horse
 * - Horse prep quest → food×4 + med×1
 * Notes for later: transit lock one-way return next turn; medicine bonus kids only; couple in autumn
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/kzawa/Downloads/Grok';
const HTML = path.join(ROOT, 'mou_isso_v0_6.html');
const HORSES_JSON = path.join(ROOT, 'data', 'horses.json');
const GAME_DATA = path.join(ROOT, 'data', 'game-data.js');

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_before_horses_v1', h, 'utf8');

const horsesData = JSON.parse(fs.readFileSync(HORSES_JSON, 'utf8'));

// ── 1) Update game-data.js prep horse ──
let gd = fs.readFileSync(GAME_DATA, 'utf8');
const oldPrep =
  `"horse": {
      "item": "horse",
      "label": "★1馬",
      "qty": 2,
      "trust_reward": 3
    }`;
const newPrep =
  `"horse": {
      "items": [
        { "item": "food", "label": "兵糧", "qty": 4 },
        { "item": "med", "label": "回復薬", "qty": 1 }
      ],
      "label": "兵糧×4・回復薬×1",
      "trust_reward": 3
    }`;
if (gd.includes(oldPrep)) {
  gd = gd.replace(oldPrep, newPrep);
  fs.writeFileSync(GAME_DATA, gd, 'utf8');
  console.log('game-data prep horse updated');
} else if (gd.includes('"item": "horse"')) {
  gd = gd.replace(
    /"horse":\s*\{[^}]*"item":\s*"horse"[^}]*\}/,
    newPrep.replace(/\n/g, '\n    ')
  );
  fs.writeFileSync(GAME_DATA, gd, 'utf8');
  console.log('game-data prep horse regex');
} else {
  console.warn('game-data horse prep not found');
}

// ── 2) CSS for ranch / stray modal ──
const CSS = `
/* === horses v1 === */
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
  transition:border-color .15s,background .15s;
}
.hs-card:hover{border-color:var(--gold);}
.hs-card.selected{border-color:var(--gold);background:#f0e0b0;box-shadow:inset 0 0 0 1px var(--gold);}
.hs-card .hs-name{font-family:'Noto Serif JP',serif;font-weight:700;font-size:14px;}
.hs-card .hs-meta{color:var(--faded);font-size:11px;margin-top:4px;}
.hs-actions{display:flex;gap:8px;margin-top:14px;}
.hs-actions button{
  flex:1;padding:10px;font-family:'Noto Serif JP',serif;font-size:13px;font-weight:700;
  border-radius:4px;cursor:pointer;border:2px solid var(--border);
}
.hs-actions .hs-ok{background:linear-gradient(#d8b13a,#b58f1d);border-color:var(--gold);color:#241d11;}
.hs-actions .hs-ok:disabled{opacity:.4;cursor:default;}
#ranch-horse-list{margin-top:10px;}
.ranch-horse-table{width:100%;border-collapse:collapse;font-size:11.5px;}
.ranch-horse-table th,.ranch-horse-table td{
  border:1px solid var(--border);padding:5px 6px;text-align:center;
}
.ranch-horse-table th{background:var(--panel);font-weight:700;letter-spacing:1px;}
.ranch-horse-table td.name{text-align:left;font-family:'Noto Serif JP',serif;font-weight:700;}
.ranch-empty{font-size:12px;color:var(--faded);padding:8px 0;}
`;
if (!h.includes('/* === horses v1 === */')) {
  h = h.replace('</style>', CSS + '\n</style>');
  console.log('css horses');
}

// ── 3) Ranch card body: list container ──
const ranchBodyOld = `<div class="girl-row"><img src="`;
// more reliable: replace bubble placeholder text and inject list after girl-row close inside card-ranch
if (!h.includes('id="ranch-horse-list"')) {
  h = h.replace(
    /id="card-ranch"[\s\S]*?<\/div>\s*<\/div>\s*<div class="ph-actions" id="ph-actions-mgmt"/,
    (block) => {
      let b = block;
      b = b.replace(
        /（牧場機能は次の試作で実装予定）/,
        '牧場の馬を育てます'
      );
      b = b.replace(
        /<\/div><\/div>\s*<\/div>\s*<div class="ph-actions" id="ph-actions-mgmt"/,
        `</div></div>
      <div id="ranch-horse-list"></div>
    </div>
  </div>
  <div class="ph-actions" id="ph-actions-mgmt"`
      );
      return b;
    }
  );
  // simpler inject if above failed
  if (!h.includes('id="ranch-horse-list"')) {
    h = h.replace(
      /id="card-ranch"[\s\S]{0,2500}?<\/div>\s*<\/div>\s*<\/div>\s*<div class="ph-actions" id="ph-actions-mgmt"/,
      (m) => {
        return m.replace(
          /<\/div>\s*<\/div>\s*<\/div>\s*<div class="ph-actions" id="ph-actions-mgmt"/,
          `<div id="ranch-horse-list"></div>
    </div>
  </div>
  <div class="ph-actions" id="ph-actions-mgmt"`
        );
      }
    );
    console.log('ranch list inject attempt2', h.includes('id="ranch-horse-list"'));
  } else console.log('ranch list injected');
}

// ── 4) Horse prep panel HTML → food + med ──
const prepHorseRe =
  /id="prep-panel-horse">[\s\S]*?<div class="prep-info" id="prep-info-horse">[\s\S]*?<\/button>\s*<\/div>/;
const prepHorseNew = `id="prep-panel-horse">
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
  <div class="prep-info" id="prep-info-horse">兵糧×4と回復薬×1を手渡すと信頼度が上がります（+3）。薬は冬の牧場でも大事…</div>
  <button class="hand-btn" id="hand-btn-horse" onclick="handDeliverHorse()" disabled>手渡しする</button>
</div>`;
if (prepHorseRe.test(h)) {
  h = h.replace(prepHorseRe, prepHorseNew);
  console.log('prep panel horse replaced');
} else {
  console.warn('prep panel horse pattern miss — will rely on JS rebuild');
}

// ── 5) Stray overlay HTML before save-overlay ──
if (!h.includes('id="horse-stray-overlay"')) {
  const strayHtml = `
<div id="horse-stray-overlay" onclick="if(event.target===this){}">
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
  const saveOv = h.indexOf('<div id="save-overlay"');
  if (saveOv > 0) {
    h = h.slice(0, saveOv) + strayHtml + h.slice(saveOv);
    console.log('stray overlay inserted');
  }
}

// ── 6) Embed horses data + main addon JS ──
const ADDON = `
// ═══ Horses v1 Phase A ═══
window.HORSE_DATA = ${JSON.stringify(horsesData)};
(function(){
'use strict';
if(window.__horsesV1) return;
window.__horsesV1 = true;

var HD = window.HORSE_DATA || {};
var RANK_TABLE = HD.rankTable || {
  '1':{speed:1,capacity:1},'2':{speed:2,capacity:1},'3':{speed:2,capacity:2},
  '4':{speed:3,capacity:1},'5':{speed:3,capacity:2}
};
var NAMES = HD.names || ['胡瓜','南瓜','綿飴','鏡餅'];
var TRAITS = HD.traits || ['のんびり'];
var STR = HD.strings || {};
var STAR2 = (HD.strayStar2Chance!=null)?HD.strayStar2Chance:0.28;
var _hid = 1;
var _strayCands = {m:[],f:[],pickM:null,pickF:null};

function S(k, fb){ return STR[k] || fb || k; }

function ensureHorseState(){
  if(!gs.horses) gs.horses = [];
  if(!gs.ranch) gs.ranch = { introDone:false, maxPairs:1, pairs:[], yearIndex:0, shippingUnlocked:false };
  if(gs.ranch.introDone==null) gs.ranch.introDone = false;
  if(gs.ranch.shippingUnlocked==null) gs.ranch.shippingUnlocked = false;
  // migrate old counter → nothing (can't invent individuals)
  if(gs.ranchHorses==null) gs.ranchHorses = gs.horses.length;
  else gs.ranchHorses = gs.horses.filter(function(x){ return x.status==='ranch'||x.status==='paired'||x.status==='transit'; }).length;
}

function displayStar(rank){
  var s = Math.floor(Number(rank)||1);
  if(s<1)s=1; if(s>5)s=5;
  return s;
}
function statsForRank(rank){
  var st = displayStar(rank);
  var t = RANK_TABLE[String(st)] || {speed:1,capacity:1};
  return { star:st, speed:t.speed, capacity:t.capacity };
}
function randomName(){
  ensureHorseState();
  var used = {};
  gs.horses.forEach(function(h){ used[h.name]=1; });
  var pool = NAMES.filter(function(n){ return !used[n]; });
  if(!pool.length) pool = NAMES.slice();
  return pool[Math.floor(Math.random()*pool.length)];
}
function randomTrait(){
  return TRAITS[Math.floor(Math.random()*TRAITS.length)];
}
function rollStrayRank(){
  // idea 3: ★2 is low chance
  return (Math.random() < STAR2) ? 2 : 1;
}
function makeHorse(opts){
  opts = opts || {};
  var rank = opts.rank!=null ? opts.rank : 1;
  var st = statsForRank(rank);
  var id = opts.id || ('h_'+( _hid++ )+'_'+Date.now().toString(36));
  return {
    id: id,
    name: opts.name || randomName(),
    sex: opts.sex || 'm',
    rank: Math.round(rank*10)/10,
    speed: st.speed,
    capacity: st.capacity,
    status: opts.status || 'ranch',
    bornTurn: opts.bornTurn!=null ? opts.bornTurn : (gs.turn||1),
    shippableFromTurn: opts.shippableFromTurn!=null ? opts.shippableFromTurn : null,
    pairId: null,
    winterFood: 0,
    winterMed: 0, // future: winter med on parents affects kids only at birth
    trait: opts.trait || randomTrait(),
    source: opts.source || 'unknown'
  };
}
function refreshHorseStats(horse){
  var st = statsForRank(horse.rank);
  horse.speed = st.speed;
  horse.capacity = st.capacity;
  return horse;
}
function addHorse(opts){
  ensureHorseState();
  var horse = makeHorse(opts);
  refreshHorseStats(horse);
  gs.horses.push(horse);
  syncRanchCount();
  return horse;
}
function syncRanchCount(){
  ensureHorseState();
  gs.ranchHorses = gs.horses.filter(function(h){
    return h.status==='ranch' || h.status==='paired' || h.status==='transit';
  }).length;
}
function ownedRanchHorses(){
  ensureHorseState();
  return gs.horses.filter(function(h){ return h.status==='ranch'; });
}
/** Phase A: means unlock if any horse owned at ranch (shipping season lock is Phase B) */
function hasHorseForTransportMeans(){
  ensureHorseState();
  return gs.horses.some(function(h){
    return h.status==='ranch' || (h.status==='transit');
  });
}
function shippableHorseCount(){
  ensureHorseState();
  // Phase A: all ranch horses count as stock display; real shipping unlock later
  if(!gs.ranch.shippingUnlocked) return ownedRanchHorses().length; // still show ownership
  return ownedRanchHorses().length;
}

// ── UI: ranch list ──
function renderRanchHorseList(){
  ensureHorseState();
  var box = document.getElementById('ranch-horse-list');
  if(!box) return;
  var list = gs.horses.filter(function(h){
    return h.status==='ranch'||h.status==='paired'||h.status==='transit';
  });
  if(!list.length){
    box.innerHTML = '<div class="ranch-empty">'+S('list_empty','まだ馬がいません。')+'</div>';
    return;
  }
  var html = '<table class="ranch-horse-table"><thead><tr>'+
    '<th>名前</th><th>性</th><th>★</th><th>速</th><th>容</th><th>性質</th><th>状態</th></tr></thead><tbody>';
  list.forEach(function(h){
    var st = statsForRank(h.rank);
    var sex = h.sex==='f' ? S('sex_f','雌') : S('sex_m','雄');
    var status = S('status_'+h.status, h.status);
    html += '<tr><td class="name">'+h.name+'</td><td>'+sex+'</td><td>'+st.star+'</td><td>'+st.speed+
      '</td><td>'+st.capacity+'</td><td>'+(h.trait||'—')+'</td><td>'+status+'</td></tr>';
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

// ── Stray horse event ──
function openStrayHorseEvent(){
  ensureHorseState();
  if(gs.ranch.introDone) return;
  _strayCands.m = [makeHorse({sex:'m',rank:rollStrayRank(),source:'stray'}), makeHorse({sex:'m',rank:rollStrayRank(),source:'stray'})];
  _strayCands.f = [makeHorse({sex:'f',rank:rollStrayRank(),source:'stray'}), makeHorse({sex:'f',rank:rollStrayRank(),source:'stray'})];
  // ensure unique names among 4
  var seen={};
  [_strayCands.m[0],_strayCands.m[1],_strayCands.f[0],_strayCands.f[1]].forEach(function(h){
    var guard=0;
    while(seen[h.name] && guard++<20){ h.name = randomName(); }
    seen[h.name]=1;
  });
  _strayCands.pickM = null;
  _strayCands.pickF = null;
  var title = document.getElementById('hs-title');
  var desc = document.getElementById('hs-desc');
  if(title) title.textContent = S('stray_title','迷い馬');
  if(desc) desc.textContent = S('stray_body','牧場の前に迷い馬がいます…');
  paintStrayRow('hs-males', _strayCands.m, 'm');
  paintStrayRow('hs-females', _strayCands.f, 'f');
  var btn = document.getElementById('hs-confirm');
  if(btn){ btn.disabled = true; btn.textContent = S('stray_confirm','この2頭を引き取る'); }
  var ov = document.getElementById('horse-stray-overlay');
  if(ov) ov.classList.add('on');
}
function paintStrayRow(elId, arr, sex){
  var row = document.getElementById(elId);
  if(!row) return;
  row.innerHTML = '';
  arr.forEach(function(h, idx){
    var st = statsForRank(h.rank);
    var card = document.createElement('div');
    card.className = 'hs-card';
    card.dataset.sex = sex;
    card.dataset.idx = String(idx);
    card.innerHTML = '<div class="hs-name">'+h.name+'</div>'+
      '<div class="hs-meta">★'+st.star+'　速'+st.speed+'　容'+st.capacity+'</div>'+
      '<div class="hs-meta">'+(h.trait||'')+'</div>';
    card.onclick = function(){ selectStrayCard(sex, idx); };
    row.appendChild(card);
  });
}
function selectStrayCard(sex, idx){
  if(sex==='m') _strayCands.pickM = idx;
  else _strayCands.pickF = idx;
  document.querySelectorAll('#hs-males .hs-card').forEach(function(c,i){
    c.classList.toggle('selected', _strayCands.pickM===i);
  });
  document.querySelectorAll('#hs-females .hs-card').forEach(function(c,i){
    c.classList.toggle('selected', _strayCands.pickF===i);
  });
  var btn = document.getElementById('hs-confirm');
  if(btn) btn.disabled = !(_strayCands.pickM!=null && _strayCands.pickF!=null);
}
window.selectStrayCard = selectStrayCard;

window.confirmStrayHorses = function(){
  ensureHorseState();
  if(_strayCands.pickM==null || _strayCands.pickF==null){
    showToast(S('stray_need_both','雄と雌を1頭ずつ選んでください'));
    return;
  }
  var keepM = _strayCands.m[_strayCands.pickM];
  var keepF = _strayCands.f[_strayCands.pickF];
  // "feed" flavor — just accept
  keepM.source = 'stray'; keepF.source = 'stray';
  keepM.status = 'ranch'; keepF.status = 'ranch';
  gs.horses.push(keepM, keepF);
  gs.ranch.introDone = true;
  syncRanchCount();
  var ov = document.getElementById('horse-stray-overlay');
  if(ov) ov.classList.remove('on');
  showToast(S('stray_done','迷い馬を2頭引き取りました'));
  setTimeout(function(){ showToast(S('stray_fled','選ばれなかった馬は草原へ逃げていきました')); }, 700);
  setRanchBubble(S('bubble_after_stray','…この子たち、筋が良さそうです。'));
  renderRanchHorseList();
  if(typeof updateTransportUI==='function') updateTransportUI();
};

// ── Grant from horse_find ──
function grantHorseFind(){
  var horse = addHorse({
    sex: Math.random()<0.5?'m':'f',
    rank: rollStrayRank(),
    source: 'horse_find'
  });
  showToast(S('horse_find_ok','名馬探索：{name}（★{star}）が牧場に加わりました')
    .replace('{name}', horse.name)
    .replace('{star}', String(displayStar(horse.rank))));
  renderRanchHorseList();
  return horse;
}
window.grantHorseFind = grantHorseFind;

// ── Override means unlock / stock ──
var __isMeansUnlocked = typeof isMeansUnlocked==='function' ? isMeansUnlocked : null;
isMeansUnlocked = function(m){
  ensureHorseState();
  if(m==='horse') return hasHorseForTransportMeans();
  if(m==='wagon'){
    var base = __isMeansUnlocked ? __isMeansUnlocked('wagon') : false;
    // re-check horse part
    return (gs.cleared && gs.cleared.horse && gs.cleared.horse.indexOf(2)>=0) &&
      isMeansUnlocked('cart') && hasHorseForTransportMeans();
  }
  return __isMeansUnlocked ? __isMeansUnlocked(m) : false;
};

var __stockOf = typeof stockOf==='function' ? stockOf : null;
stockOf = function(id){
  ensureHorseState();
  if(id==='horse') return ownedRanchHorses().length;
  return __stockOf ? __stockOf(id) : 0;
};
// Transport does NOT consume horses (user rule). takeStock horse = no-op.
var __takeStock = typeof takeStock==='function' ? takeStock : null;
takeStock = function(id,q){
  if(id==='horse'){
    // Phase C: mark transit; Phase A: no-op (orders rarely need horse qty after prep change)
    return;
  }
  if(__takeStock) __takeStock(id,q);
};

// ── Remove buy ranch horse UI ──
window.buyRanchHorse = function(){
  showToast('馬は買えません。牧場の迷い馬や進言・繁殖で手に入ります');
};

// ── Prep horse: food×4 + med×1 ──
function ensurePrepQtyHorse(){
  if(!gs.prepQtyHorse || typeof gs.prepQtyHorse!=='object'){
    gs.prepQtyHorse = { food:0, med:0 };
  }
}
window.changePrepQtyHorse = function(item, delta){
  if(gs.prepDone && gs.prepDone.horse) return;
  ensurePrepQtyHorse();
  var need = item==='med' ? 1 : 4;
  var avail = item==='med' ? (gs.stock.med||0) : (gs.inv.food||0);
  var cur = gs.prepQtyHorse[item]||0;
  var nv = Math.max(0, Math.min(Math.min(avail, need), cur+delta));
  gs.prepQtyHorse[item] = nv;
  var el = document.getElementById('prep-qty-horse-'+item);
  if(el) el.textContent = nv;
  var si = document.getElementById('prep-stock-horse-'+item);
  if(si) si.innerHTML = '現庫: <b>'+avail+'</b>　必要: '+need+'　選択: <b>'+nv+'</b>';
  var btn = document.getElementById('hand-btn-horse');
  if(btn) btn.disabled = !((gs.prepQtyHorse.food||0)>=4 && (gs.prepQtyHorse.med||0)>=1);
};
window.handDeliverHorse = function(){
  if(gs.prepDone && gs.prepDone.horse) return;
  ensurePrepQtyHorse();
  var fq = gs.prepQtyHorse.food||0;
  var mq = gs.prepQtyHorse.med||0;
  if(fq<4 || mq<1){ showToast('兵糧×4と回復薬×1が必要です'); return; }
  if((gs.inv.food||0)<4 || (gs.stock.med||0)<1){ showToast('在庫が足りません'); return; }
  gs.inv.food -= 4;
  gs.stock.med -= 1;
  var trust = 3;
  gs.trust.horse = Math.min(100, (gs.trust.horse||0)+trust);
  gs.prepDone.horse = true;
  var pi = document.getElementById('prep-info-horse');
  if(pi) pi.textContent = '✓ 準備依頼を完了しました！（兵糧×4・回復薬×1）';
  var hb = document.getElementById('hand-btn-horse');
  if(hb){ hb.textContent='✓ 手渡し済み'; hb.className='hand-btn done'; hb.disabled=true; }
  showToast(PNAMES.horse+'への手渡し（信頼度 +'+trust+'）');
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updateStockBar==='function') updateStockBar();
  if(typeof updatePrinceBar==='function') updatePrinceBar();
  if(typeof checkSortieConditions==='function') checkSortieConditions();
  if(typeof updateTabLabels==='function') updateTabLabels();
};

// Override handDeliver for horse key → multi item
var __handDeliver = typeof handDeliver==='function' ? handDeliver : null;
if(__handDeliver){
  handDeliver = function(key){
    if(key==='horse'){ handDeliverHorse(); return; }
    __handDeliver(key);
  };
}
// Override changePrepQty for horse
var __changePrepQty = typeof changePrepQty==='function' ? changePrepQty : null;
if(__changePrepQty){
  changePrepQty = function(key, delta){
    if(key==='horse') return; // use changePrepQtyHorse
    __changePrepQty(key, delta);
  };
}

// CFG prep_quests horse
if(typeof CFG!=='undefined'){
  CFG.prep_quests = CFG.prep_quests || {};
  CFG.prep_quests.horse = {
    items:[{item:'food',label:'兵糧',qty:4},{item:'med',label:'回復薬',qty:1}],
    label:'兵糧×4・回復薬×1',
    trust_reward:3
  };
}
if(typeof GAME_DATA!=='undefined' && GAME_DATA.prep_quests){
  GAME_DATA.prep_quests.horse = CFG.prep_quests.horse;
}

// ── openCard ranch → list + stray ──
var __openCard = typeof openCard==='function' ? openCard : null;
if(__openCard){
  openCard = function(name){
    __openCard(name);
    // strip buy button if present
    var buyBtn = document.getElementById('ranch-horse-btn');
    if(buyBtn && buyBtn.parentNode) buyBtn.parentNode.remove();
    var cnt = document.getElementById('ranch-horse-count');
    if(cnt && cnt.parentNode && cnt.parentNode.querySelector && !cnt.closest('#ranch-horse-list')){
      // leave if part of old UI — remove whole old block
      var p = cnt.parentNode;
      if(p && p.id!=='ranch-horse-list') p.remove();
    }
    if(name==='ranch'){
      ensureHorseState();
      renderRanchHorseList();
      if(!gs.ranch.introDone){
        setTimeout(openStrayHorseEvent, 80);
      } else {
        setRanchBubble(S('bubble_default','…牧場の馬たちを見ていきます。'));
      }
    }
  };
}

// ── updateTransportUI: remove buy inject ──
var __updateTransportUI = typeof updateTransportUI==='function' ? updateTransportUI : null;
if(__updateTransportUI){
  updateTransportUI = function(){
    __updateTransportUI();
    // remove buy UI if addon re-added it
    var buyBtn = document.getElementById('ranch-horse-btn');
    if(buyBtn){
      var wrap = buyBtn.parentNode;
      if(wrap) wrap.remove();
    }
    ensureHorseState();
    // refresh prep stock labels for horse multi
    ensurePrepQtyHorse();
    var af = gs.inv.food||0, am = gs.stock.med||0;
    var sf = document.getElementById('prep-stock-horse-food');
    var sm = document.getElementById('prep-stock-horse-med');
    if(sf) sf.innerHTML = '現庫: <b>'+af+'</b>　必要: 4　選択: <b>'+(gs.prepQtyHorse.food||0)+'</b>';
    if(sm) sm.innerHTML = '現庫: <b>'+am+'</b>　必要: 1　選択: <b>'+(gs.prepQtyHorse.med||0)+'</b>';
    var pf = document.getElementById('prep-qty-horse-food');
    var pm = document.getElementById('prep-qty-horse-med');
    if(pf) pf.textContent = gs.prepQtyHorse.food||0;
    if(pm) pm.textContent = gs.prepQtyHorse.med||0;
    if(document.getElementById('card-ranch') && document.getElementById('card-ranch').classList.contains('show')){
      renderRanchHorseList();
    }
  };
}

// ── goToNextTurn: horse_find + return transit horses ──
var __goNext = typeof goToNextTurn==='function' ? goToNextTurn : null;
if(__goNext){
  goToNextTurn = function(){
    ensureHorseState();
    // apply horse_find before kengen clear
    if(gs.kengen && gs.kengen.shingen==='horse_find'){
      grantHorseFind();
    }
    // return horses from transit (one-way lock ends next turn)
    gs.horses.forEach(function(h){
      if(h.status==='transit'){
        h.status = 'ranch';
      }
    });
    syncRanchCount();
    __goNext();
    ensureHorseState();
    gs.prepQtyHorse = { food:0, med:0 };
    renderRanchHorseList();
  };
}

// ── buildResultScreen: note horse_find ──
var __buildResult = typeof buildResultScreen==='function' ? buildResultScreen : null;
if(__buildResult){
  buildResultScreen = function(){
    __buildResult();
    if(gs.kengen && gs.kengen.shingen==='horse_find'){
      var kng = document.getElementById('result-kengen');
      if(kng){
        kng.innerHTML += '<div style="color:var(--green)">🐎 名馬探索：次のターン開始時に牧場へ★1〜2の馬が加わります</div>';
      }
    }
  };
}

// ── applySaveData ensure ──
var __applySave = typeof applySaveData==='function' ? applySaveData : null;
if(__applySave){
  applySaveData = function(data){
    var ok = __applySave(data);
    ensureHorseState();
    // rehydrate ranks
    gs.horses.forEach(refreshHorseStats);
    syncRanchCount();
    renderRanchHorseList();
    return ok;
  };
}

// ── ensureState hook ──
if(typeof ensureState==='function'){
  var __ens = ensureState;
  ensureState = function(){
    __ens();
    ensureHorseState();
  };
}

// kill old buy injection in updateTransportUI body by DOM observer once
document.addEventListener('DOMContentLoaded', function(){
  ensureHorseState();
  // remove legacy buy UI
  setTimeout(function(){
    var buyBtn = document.getElementById('ranch-horse-btn');
    if(buyBtn && buyBtn.parentNode) buyBtn.parentNode.remove();
    renderRanchHorseList();
  }, 50);
});

console.log('[horses v1] phase A ready');
})();
`;

// Inject addon before map+yellow or icon swap or at end
const markers = [
  '// ═══ item / cmd icon helpers ═══',
  '// ═══ map under panels + yellow corner hints ═══',
  "document.addEventListener('DOMContentLoaded',()=>{\n  document.querySelectorAll('.node')",
];
let inserted = false;
if (h.includes('// ═══ Horses v1 Phase A ═══')) {
  const a = h.indexOf('// ═══ Horses v1 Phase A ═══');
  let b = h.length;
  for (const m of markers) {
    const i = h.indexOf(m, a + 10);
    if (i > a && i < b) b = i;
  }
  // find end of previous horses block roughly at next ═══ or DOMContentLoaded map
  const next = h.indexOf('\n// ═══', a + 5);
  const end = next > a ? next : b;
  h = h.slice(0, a) + ADDON + '\n' + h.slice(end);
  console.log('replaced horses v1 block');
  inserted = true;
} else {
  for (const m of markers) {
    const i = h.indexOf(m);
    if (i >= 0) {
      h = h.slice(0, i) + ADDON + '\n' + h.slice(i);
      console.log('inserted horses before', m.slice(0, 40));
      inserted = true;
      break;
    }
  }
}
if (!inserted) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + ADDON + '\n' + h.slice(last);
  console.log('appended horses addon');
}

// Embed horses.json load optional - already embedded HORSE_DATA

// Patch embedded GAME_DATA prep in html if present
h = h.replace(
  /"horse":\{"item":"horse","label":"★1馬","qty":2,"trust_reward":3\}/,
  '"horse":{"items":[{"item":"food","label":"兵糧","qty":4},{"item":"med","label":"回復薬","qty":1}],"label":"兵糧×4・回復薬×1","trust_reward":3}'
);
// also spaced form
h = h.replace(
  /"horse":\s*\{\s*"item":\s*"horse",\s*"label":\s*"★1馬",\s*"qty":\s*2,\s*"trust_reward":\s*3\s*\}/,
  '"horse":{"items":[{"item":"food","label":"兵糧","qty":4},{"item":"med","label":"回復薬","qty":1}],"label":"兵糧×4・回復薬×1","trust_reward":3}'
);
console.log('html GAME_DATA prep patched', h.includes('兵糧×4・回復薬×1'));

// CFG embedded prep in const CFG
h = h.replace(
  /horse:\s*\{\s*item:\s*['"]horse['"],\s*label:\s*['"]★1馬['"],\s*qty:\s*2,\s*trust_reward:\s*3\s*\}/,
  `horse:{items:[{item:'food',label:'兵糧',qty:4},{item:'med',label:'回復薬',qty:1}],label:'兵糧×4・回復薬×1',trust_reward:3}`
);

fs.writeFileSync(HTML, h, 'utf8');

// syntax check
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m, n = 0, fail = false;
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
  horsesAddon: h.includes('[horses v1]'),
  strayOv: h.includes('horse-stray-overlay'),
  ranchList: h.includes('ranch-horse-list'),
  prepHorse: h.includes('changePrepQtyHorse'),
  fail,
});
if (fail) process.exit(1);
