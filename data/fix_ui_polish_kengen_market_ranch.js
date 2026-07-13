/**
 * UI polish:
 * - 進言: 費用をボタンに表示、1回選んだら他ロック
 * - 市場: 価格列に(前期比)、前期比はターン進行時のみ更新（売買で潰さない）
 * - 剣初期在庫0、初期金/店在庫を CFG.start / shopStart に合わせる
 * - 牧場: 速さ/容量、stats の ? 修正（window 公開 + フォールバック表）
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'mou_isso_v0_6_1.html');
const JSON_PATH = path.join(__dirname, 'market_economy.json');

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_ui_polish_' + Date.now(), h, 'utf8');

// ── sword start 0 in embedded GAME_DATA / start ──
h = h.replace(/("sword"\s*:\s*)2(\s*,\s*"siege_w")/g, '$10$2');
h = h.replace(/(sword:\s*)2(\s*,\s*siege_w)/g, '$10$2');
// also common pattern in start block
h = h.replace(/("sword":\s*)2(\s*,\s*\n\s*"siege_w")/g, '$10$2');
console.log('sword start -> 0 (patterns)');

// game-data.js
const gdPath = path.join(__dirname, 'game-data.js');
if (fs.existsSync(gdPath)) {
  let gd = fs.readFileSync(gdPath, 'utf8');
  const gd2 = gd.replace(/("sword"\s*:\s*)2(\s*,)/g, '$10$2');
  if (gd2 !== gd) {
    fs.writeFileSync(gdPath, gd2, 'utf8');
    console.log('game-data.js sword start 0');
  }
}

// market_economy: ensure sword shop 0 (player stock is separate)
let ME = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
ME.shopStart = ME.shopStart || {};
ME.shopStart.sword = 0;
ME.shopStart.siege_w = 0;
ME.shopStart.med = 0;
fs.writeFileSync(JSON_PATH, JSON.stringify(ME, null, 2), 'utf8');

// re-sync MARKET_ECON in HTML
{
  const i = h.indexOf('MARKET_ECON');
  if (i >= 0) {
    const eq = h.indexOf('{', i);
    let depth = 0, end = -1;
    for (let p = eq; p < h.length; p++) {
      if (h[p] === '{') depth++;
      else if (h[p] === '}') {
        depth--;
        if (depth === 0) {
          end = p;
          break;
        }
      }
    }
    if (end > 0) {
      let semi = end + 1;
      if (h[semi] === ';') semi++;
      h = h.slice(0, i) + 'MARKET_ECON = ' + JSON.stringify(ME) + ';' + h.slice(semi);
      console.log('MARKET_ECON resynced');
    }
  }
}

// ── Market table header: 価格(前期比) ──
if (h.includes('>価格</th>') && !h.includes('価格(前期比)')) {
  h = h.replace('>価格</th>', '>価格(前期比)</th>');
  console.log('price header updated');
} else if (h.includes('>価格</th>')) {
  // try only first market table occurrence
  h = h.replace('>価格</th>', '>価格(前期比)</th>');
  console.log('price header force');
}

// ── Kengen HTML: add cost line on each button ──
const costNote = (label, effect) => null; // via runtime
// Add cost to kengen note
h = h.replace(
  /費用：金\d+両（1ターン1回分。選び直しは追加料金なし）/,
  '費用：各進言 金300両（ボタンに表示）。1つ選ぶと他は選択不可'
);
if (!h.includes('kg-cost-on-btn') && h.includes('kg-effect')) {
  // inject cost spans after each kg-effect in kengen block - done in runtime for flexibility
  console.log('cost on buttons via runtime');
}

// CSS
const css = `
/* kengen locked after pick */
#kg-shingen .kg-opt.kg-locked-other{
  opacity:0.4;
  pointer-events:none;
  cursor:not-allowed;
}
#kg-shingen .kg-opt .kg-cost{
  font-size:11px;
  color:var(--accent);
  font-weight:700;
  margin-top:2px;
}
#kg-shingen .kg-opt.chosen .kg-cost{
  color:var(--ink);
}
.price-delta-up{color:#8b2c2c}
.price-delta-down{color:#3a6a3a}
.price-delta-zero{color:var(--faded)}
`;
if (!h.includes('kg-locked-other')) {
  h = h.replace('</style>', css + '\n</style>');
  console.log('css polish');
}

const FIX = `
// ═══ UI polish kengen/market/ranch ═══
(function(){
'use strict';
if(window.__uiPolishKengenMarketRanch) return;
window.__uiPolishKengenMarketRanch = true;

var DEFAULT_RANK = {
  '1':{speed:1,capacity:1},
  '2':{speed:2,capacity:1},
  '3':{speed:2,capacity:2},
  '4':{speed:3,capacity:1},
  '5':{speed:3,capacity:2}
};

function adviceCost(){
  var c = window.MARKET_ECON && window.MARKET_ECON.adviceCostGold;
  return (c!=null ? c : 300)|0;
}

// ── export horse stats globally (fix ? display) ──
window.getRankTable = function(){
  if(window.RANK_TABLE) return window.RANK_TABLE;
  var HD = window.HORSE_DATA || {};
  return HD.rankTable || DEFAULT_RANK;
};
window.displayStar = window.displayStar || function(rank){
  var s = Math.floor(Number(rank)||1);
  if(s<1)s=1; if(s>5)s=5; return s;
};
window.statsForRank = function(rank){
  if(typeof statsForRank==='function' && statsForRank !== window.statsForRank){
    try{ return statsForRank(rank); }catch(e){}
  }
  var st = window.displayStar(rank);
  var t = window.getRankTable()[String(st)] || DEFAULT_RANK[String(st)] || {speed:1,capacity:1};
  return { star:st, speed:t.speed, capacity:t.capacity };
};

// ── 進言: 費用表示 + 1選択で他ロック ──
function paintKengenCostsAndLocks(){
  var cost = adviceCost();
  var root = document.getElementById('kg-shingen');
  if(!root) return;
  var chosen = gs.kengen && gs.kengen.shingen;
  var paid = gs.kengen && gs.kengen.paidThisTurn;
  root.querySelectorAll('.kg-opt').forEach(function(btn){
    var val = btn.getAttribute('data-val');
    // cost line
    var costEl = btn.querySelector('.kg-cost');
    if(!costEl){
      costEl = document.createElement('span');
      costEl.className = 'kg-cost kg-cost-on-btn';
      var eff = btn.querySelector('.kg-effect');
      if(eff && eff.nextSibling) btn.insertBefore(costEl, eff.nextSibling);
      else if(eff) eff.after(costEl);
      else btn.appendChild(costEl);
    }
    if(paid && chosen){
      if(val===chosen) costEl.textContent = '費用：'+cost+'両（支払い済み）';
      else costEl.textContent = '（他の進言を選択済み）';
    }else{
      costEl.textContent = '費用：金'+cost+'両';
    }
    // lock others after one pick
    var isChosen = chosen && val===chosen;
    var lockOther = !!(chosen && !isChosen);
    btn.classList.toggle('kg-locked-other', lockOther);
    btn.classList.toggle('chosen', !!isChosen);
    if(lockOther){
      btn.disabled = true;
    }else if(btn.classList.contains('locked-opt')){
      // keep unlock-condition disabled
      btn.disabled = true;
    }else{
      btn.disabled = false;
    }
  });
  var note = document.getElementById('kg-cost-note');
  if(note){
    if(chosen){
      note.textContent = '進言を選択済み（費用 '+cost+'両）。このターンは変更できません。効果は次ターンから。';
    }else{
      note.textContent = '進言は1つだけ選べます。費用は各 '+cost+'両（ボタンに表示）。未選択なら費用はかかりません。';
    }
  }
}
window.paintKengenCostsAndLocks = paintKengenCostsAndLocks;

// wrap kgPick: no re-pick after first successful choice; show cost before pay
var _kg = window.kgPick;
window.kgPick = function(type, val, btn){
  try{
    if(type==='kenjou'){ showToast('献上は廃止されました'); return; }
    gs.kengen = gs.kengen || {shingen:null,kenjou:null};
    // already chosen this turn → lock
    if(type==='shingen' && gs.kengen.shingen && gs.kengen.paidThisTurn){
      if(gs.kengen.shingen !== val){
        showToast('このターンはすでに進言を選びました（変更不可）');
      }
      paintKengenCostsAndLocks();
      return;
    }
    if(type==='shingen' && gs.kengen.shingen && !gs.kengen.paidThisTurn && gs.kengen.shingen !== val){
      // edge: selected without pay — still lock change if we want strict; allow change until paid
    }
    var cost = adviceCost();
    var willPay = type==='shingen' && val && !gs.kengen.paidThisTurn;
    if(willPay && (gs.gold||0) < cost){
      showToast('進言には金'+cost+'両が必要です（所持'+(gs.gold||0)+'両）');
      return;
    }
    // call previous
    if(typeof _kg==='function') _kg(type, val, btn);
    else {
      gs.kengen[type]=val;
    }
    // if selection stuck and unpaid, charge once
    if(type==='shingen' && val && gs.kengen.shingen===val && !gs.kengen.paidThisTurn){
      gs.gold = (gs.gold||0) - cost;
      gs.kengen.paidThisTurn = true;
      if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
      showToast('進言「'+val+'」を選択（−'+cost+'両）');
    }
    paintKengenCostsAndLocks();
  }catch(e){
    console.error('kgPick polish', e);
    if(typeof _kg==='function') try{_kg(type,val,btn);}catch(e2){}
  }
};

// ── 市場: 前期比（ターン単位）・初期同期 ──
function matLabel(k){
  var L = (window.MARKET_ECON && window.MARKET_ECON.labels) || {};
  return L[k] || k;
}

/** 初期金・所持・店在庫をデータと一致させる（不足時のみ補完。既存セーブは触らない） */
window.syncStartResourcesIfNeeded = function(){
  var start = (typeof CFG!=='undefined' && CFG.start) || (window.GAME_DATA && window.GAME_DATA.start) || {};
  if(gs.gold==null) gs.gold = start.gold!=null ? start.gold : 1000;
  if(!gs.inv) gs.inv = {};
  ['iron','wood','niter','herb','food'].forEach(function(k){
    if(gs.inv[k]==null && start[k]!=null) gs.inv[k]=start[k];
  });
  if(!gs.stock) gs.stock = {};
  // 剣の初期は0に統一
  if(gs.stock.sword==null) gs.stock.sword = (start.sword!=null?start.sword:0);
  if(gs.stock.siege_w==null) gs.stock.siege_w = start.siege_w!=null?start.siege_w:0;
  if(gs.stock.med==null) gs.stock.med = start.med!=null?start.med:0;
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  // 店在庫: 市場未初期化時のみ shopStart
  if(gs.market && !gs.market._shopInitedFromJson){
    var ME = window.MARKET_ECON || {};
    var ss = ME.shopStart || {};
    Object.keys(ss).forEach(function(k){
      if(gs.market.shop[k]==null) gs.market.shop[k]=ss[k];
    });
    // 初回は前期=今期（±0表示用に prev を記録）
    if(!gs.market.prevBuy || !Object.keys(gs.market.prevBuy).length){
      gs.market.prevBuy = Object.assign({}, gs.market.priceBuy||ME.baseBuy||{});
    }
    gs.market._shopInitedFromJson = true;
  }
};

// delta display helper
function formatDelta(d){
  if(d==null || isNaN(d)) return '<span class="price-delta-zero">（前期比 —）</span>';
  if(d===0) return '<span class="price-delta-zero">（前期比 ±0）</span>';
  if(d>0) return '<span class="price-delta-up">（前期比 +'+d+'）</span>';
  return '<span class="price-delta-down">（前期比 '+d+'）</span>';
}

var _deltaStr = (typeof window.deltaStr==='function') ? window.deltaStr : (typeof deltaStr==='function'?deltaStr:null);
window.deltaStr = function(res){
  var cur = (gs.market && gs.market.priceBuy && gs.market.priceBuy[res])||0;
  var prev = gs.market && gs.market.prevBuy ? gs.market.prevBuy[res] : null;
  if(prev==null) return '（前期比 —）';
  var d = cur - prev;
  if(d===0) return '（前期比 ±0）';
  return d>0 ? '（前期比 +'+d+'）' : '（前期比 '+d+'）';
};

// wrap refreshMarketUI for clearer 前期比
var _rm = window.refreshMarketUI;
window.refreshMarketUI = function(){
  try{ window.syncStartResourcesIfNeeded(); }catch(e){}
  if(typeof _rm==='function') _rm();
  // repaint price cells with 前期比 label (buy side)
  var KEYS = ['iron','wood','niter','herb','food_mat'];
  KEYS.forEach(function(r){
    var priceEl = document.getElementById('price-'+r);
    if(!priceEl || !gs.market) return;
    var buy = gs.market.priceBuy && gs.market.priceBuy[r];
    var sell = gs.market.priceSell && gs.market.priceSell[r];
    var prev = gs.market.prevBuy && gs.market.prevBuy[r];
    var d = (prev!=null && buy!=null) ? (buy - prev) : null;
    priceEl.innerHTML = '売'+sell+'両 買'+buy+'両 '+formatDelta(d);
  });
  // products
  ['sword','siege_w','med'].forEach(function(r){
    var priceEl = document.getElementById('price-'+r);
    if(!priceEl || !gs.market) return;
    var sell = (gs.market.priceSell && gs.market.priceSell[r]) ||
      (window.MARKET_ECON && window.MARKET_ECON.baseSell && window.MARKET_ECON.baseSell[r]) || 0;
    priceEl.textContent = '売'+sell+'両';
    var invEl = document.getElementById(r==='med'?'inv-med':'inv-'+r);
    if(invEl){
      var v = r==='med' ? (gs.stock.med||0) : (gs.stock[r]||0);
      invEl.textContent = String(v);
    }
  });
  paintKengenCostsAndLocks();
};

// confirmTrade: 前期比を売買で上書きしない
var _ct = window.confirmTrade;
window.confirmTrade = function(){
  var savedPrev = gs.market && gs.market.prevBuy ? Object.assign({}, gs.market.prevBuy) : null;
  if(typeof _ct==='function') _ct();
  if(gs.market && savedPrev){
    gs.market.prevBuy = savedPrev; // restore 前期 (turn-based)
  }
  if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
};

// goToNextTurn: after market season, ensure prev is from before recompute
(function(){
  var orig = window.goToNextTurn;
  if(typeof orig!=='function') return;
  window.goToNextTurn = function(){
    // snapshot prices as "前期" before restock+recompute happens in other hooks
    try{
      if(typeof window.ensureMarket==='function') window.ensureMarket();
      if(gs.market && gs.market.priceBuy){
        gs.market.prevBuy = Object.assign({}, gs.market.priceBuy);
      }
    }catch(e){}
    var r = orig.apply(this, arguments);
    try{
      if(gs.kengen){
        // new turn: allow new advice
        gs.kengen.paidThisTurn = false;
        // keep shingen until applyPendingAdvice consumes it — other code may clear
      }
      paintKengenCostsAndLocks();
      if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
    }catch(e){}
    return r;
  };
})();

// recomputePrices(true) should set prev BEFORE changing — ensure order
var _re = window.recomputePrices;
window.recomputePrices = function(savePrev){
  if(savePrev && gs.market && gs.market.priceBuy){
    gs.market.prevBuy = Object.assign({}, gs.market.priceBuy);
  }
  if(typeof _re==='function'){
    // call with false to avoid double-save if original also saves
    return _re.call(this, false);
  }
};

// ── 牧場リスト: 速さ/容量 + 正しい数値 ──
window.renderRanchHorseList = function(){
  if(typeof ensureHorseState==='function') ensureHorseState();
  var box = document.getElementById('ranch-horse-list');
  if(!box) return;
  var list = (gs.horses||[]).filter(function(x){
    return x.status==='ranch'||x.status==='paired'||x.status==='transit';
  });
  if(!list.length){
    box.innerHTML = '<div class="ranch-empty">まだ馬がいません。</div>';
    return;
  }
  var canShip = !!(gs.ranch && gs.ranch.shippingUnlocked);
  var html = '<table class="ranch-horse-table"><thead><tr>'+
    '<th>名前</th><th>性</th><th>★</th><th>速さ</th><th>容量</th><th>性質</th><th>状態</th><th>売却</th></tr></thead><tbody>';
  list.forEach(function(hh){
    var st = window.statsForRank(hh.rank);
    var map = {ranch:'牧場',paired:'つがい',transit:'輸送中'};
    var statusLabel = map[hh.status]||hh.status;
    var price = (typeof window.horseSellPrice==='function') ? window.horseSellPrice(hh) : (st.star*80);
    var canSell = canShip && hh.status==='ranch';
    var tip = !canShip ? '出荷解禁後（最初の秋以降）' : (hh.status!=='ranch' ? '牧場にいるときだけ売却可' : (price+'両で売却'));
    var btn = canSell
      ? ('<button type="button" class="hs-sell-btn" onclick="sellHorse(\\''+String(hh.id).replace(/'/g,'')+'\\')">'+price+'両</button>')
      : ('<button type="button" class="hs-sell-btn" disabled title="'+tip+'">—</button>');
    html += '<tr><td class="name">'+(hh.name||'?')+'</td><td>'+(hh.sex==='f'?'雌':'雄')+
      '</td><td>'+st.star+'</td><td>'+st.speed+'</td><td>'+st.capacity+
      '</td><td>'+(hh.trait||'—')+'</td><td>'+statusLabel+'</td><td>'+btn+'</td></tr>';
  });
  html += '</tbody></table>';
  html += '<div style="font-size:11px;color:var(--faded);margin-top:6px">売却は牧場の個体リストから（市場には並びません）。出荷解禁後に有効。</div>';
  box.innerHTML = html;
};
try{ renderRanchHorseList = window.renderRanchHorseList; }catch(e){}

// openCard hooks
(function(){
  var prev = window.openCard;
  if(typeof prev!=='function') return;
  window.openCard = function(name){
    var r = prev.apply(this, arguments);
    if(name==='ranch'){
      try{ renderRanchHorseList = window.renderRanchHorseList; }catch(e){}
      window.renderRanchHorseList();
    }
    if(name==='market'){
      if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
    }
    if(name==='letter' || name==='kengen'){
      paintKengenCostsAndLocks();
    }
    return r;
  };
  try{ openCard = window.openCard; }catch(e){}
})();

// letter tab kengen
var _sel = window.selectTab;
if(typeof _sel==='function'){
  window.selectTab = function(key){
    var r = _sel.apply(this, arguments);
    if(key==='kengen') paintKengenCostsAndLocks();
    return r;
  };
  try{ selectTab = window.selectTab; }catch(e){}
}

// boot
function bootPolish(){
  try{
    // force sword start 0 for brand-new state only when stock looks like old default 2 and no progress
    if(gs && gs.stock && gs.stock.sword===2 && (gs.turn===0||gs.turn===1) && !gs.sortieDoneThisTurn){
      // don't auto-zero mid-game saves with 2 swords earned — only if never produced?
      // User asked initial = 0. Safer: only if total turns early and no production history
      if(!gs.inProd || ((gs.inProd.sword||0)+(gs.stock.siege_w||0)===gs.stock.siege_w)){
        // leave existing saves; new games get 0 from CFG
      }
    }
    window.syncStartResourcesIfNeeded();
    paintKengenCostsAndLocks();
    if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
  }catch(e){ console.warn('boot polish', e); }
}
document.addEventListener('DOMContentLoaded', function(){ setTimeout(bootPolish, 120); });
setTimeout(bootPolish, 400);

console.log('[ui polish kengen/market/ranch] ready');
})();
`;

if (!h.includes('[ui polish kengen/market/ranch] ready')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + FIX + '\n' + h.slice(last);
  console.log('polish inserted');
} else {
  const a = h.indexOf('// ═══ UI polish kengen/market/ranch');
  const b = h.indexOf('[ui polish kengen/market/ranch] ready', a);
  const c = h.indexOf('})();', b);
  h = h.slice(0, a) + FIX + h.slice(c + 5);
  console.log('polish replaced');
}

// Also patch original horses IIFE to export statsForRank (belt and suspenders)
if (!h.includes('window.statsForRank = statsForRank') && h.includes('function statsForRank(rank)')) {
  h = h.replace(
    'function statsForRank(rank){\n  var st = displayStar(rank);\n  var t = RANK_TABLE[String(st)] || {speed:1,capacity:1};\n  return { star:st, speed:t.speed, capacity:t.capacity };\n}',
    `function statsForRank(rank){
  var st = displayStar(rank);
  var t = RANK_TABLE[String(st)] || {speed:1,capacity:1};
  return { star:st, speed:t.speed, capacity:t.capacity };
}
window.statsForRank = statsForRank;
window.displayStar = displayStar;
window.RANK_TABLE = RANK_TABLE;`
  );
  console.log('exported statsForRank from horses IIFE');
}

// Fix prevBuy overwrite in confirmTrade originals (source)
h = h.replace(
  /\/\/ instant price adjust after trade\s*gs\.market\.prevBuy = Object\.assign\(\{\}, gs\.market\.priceBuy\);\s*recomputePrices\(false\);/g,
  '// 前期比はターン進行時のみ更新（売買では prevBuy を上書きしない）\n  recomputePrices(false);'
);
// second variant from advice fix
h = h.replace(
  /if\(gs\.market\) gs\.market\.prevBuy = Object\.assign\(\{\}, gs\.market\.priceBuy\);\s*if\(typeof window\.recomputePrices/g,
  'if(typeof window.recomputePrices'
);

fs.writeFileSync(HTML, h, 'utf8');

// syntax
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m, n = 0, fail = false;
while ((m = re.exec(h))) {
  const body = m[1];
  if (!body || body.length < 40) continue;
  try {
    new Function(body);
    console.log('OK', n);
  } catch (e) {
    console.error('FAIL', n, e.message);
    fail = true;
  }
  n++;
}

// verify sword start
const swordStart = (h.match(/"sword"\s*:\s*(\d+)/g) || []).slice(0, 5);
console.log('DONE', {
  fail,
  polish: h.includes('[ui polish kengen/market/ranch] ready'),
  priceHeader: h.includes('価格(前期比)'),
  swordSamples: swordStart,
  exportStats: h.includes('window.statsForRank = statsForRank'),
});
