/**
 * Market economy + audience (no tribute) + staff unlocks + horse result messages
 * Target: mou_isso_v0_6_1.html
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
const ECON = JSON.parse(fs.readFileSync(path.join(__dirname, 'market_economy.json'), 'utf8'));

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_pre_market_' + Date.now(), h, 'utf8');

// ── 1) Market table: 店 / 所持 / 価格(±) ──
const marketTableOld = `<table class="mgmt-table">
        <tr><th>品目</th><th>在庫</th><th>価格</th><th>購入</th><th>売却</th></tr>
        <tr><td>鉄</td><td id="inv-iron">0</td><td class="res-price">売16両 買20両</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="buy('iron',-1)">−</button><div class="qty-num" id="buy-iron">0</div><button class="qty-btn" onclick="buy('iron',1)">＋</button></div></td><td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('iron',-1)">−</button><div class="qty-num" id="sell-iron">0</div><button class="qty-btn" onclick="sell('iron',1)">＋</button></div></td></tr>
        <tr><td>木材</td><td id="inv-wood">0</td><td class="res-price">売9両 買12両</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="buy('wood',-1)">−</button><div class="qty-num" id="buy-wood">0</div><button class="qty-btn" onclick="buy('wood',1)">＋</button></div></td><td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('wood',-1)">−</button><div class="qty-num" id="sell-wood">0</div><button class="qty-btn" onclick="sell('wood',1)">＋</button></div></td></tr>
        <tr><td>硝石</td><td id="inv-niter">0</td><td class="res-price">売20両 買25両</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="buy('niter',-1)">−</button><div class="qty-num" id="buy-niter">0</div><button class="qty-btn" onclick="buy('niter',1)">＋</button></div></td><td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('niter',-1)">−</button><div class="qty-num" id="sell-niter">0</div><button class="qty-btn" onclick="sell('niter',1)">＋</button></div></td></tr>
        <tr><td>薬草</td><td id="inv-herb">0</td><td class="res-price">売12両 買15両</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="buy('herb',-1)">−</button><div class="qty-num" id="buy-herb">0</div><button class="qty-btn" onclick="buy('herb',1)">＋</button></div></td><td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('herb',-1)">−</button><div class="qty-num" id="sell-herb">0</div><button class="qty-btn" onclick="sell('herb',1)">＋</button></div></td></tr>
        <tr><td>兵糧</td><td id="inv-food_mat">0</td><td class="res-price">売14両 買18両</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="buy('food_mat',-1)">−</button><div class="qty-num" id="buy-food_mat">0</div><button class="qty-btn" onclick="buy('food_mat',1)">＋</button></div></td><td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('food_mat',-1)">−</button><div class="qty-num" id="sell-food_mat">0</div><button class="qty-btn" onclick="sell('food_mat',1)">＋</button></div></td></tr>
        <tr><td>回復薬</td><td id="inv-med">0</td><td class="res-price">売30両</td><td class="locked">購入不可</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('med',-1)">−</button><div class="qty-num" id="sell-med">0</div><button class="qty-btn" onclick="sell('med',1)">＋</button></div></td></tr>
        </table>`;

const marketTableNew = `<table class="mgmt-table" id="market-table">
        <tr><th>品目</th><th>店</th><th>所持</th><th>価格</th><th>購入</th><th>売却</th></tr>
        <tr><td>鉄</td><td id="shop-iron">0</td><td id="inv-iron">0</td><td class="res-price" id="price-iron">—</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="buy('iron',-1)">−</button><div class="qty-num" id="buy-iron">0</div><button class="qty-btn" onclick="buy('iron',1)">＋</button></div></td><td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('iron',-1)">−</button><div class="qty-num" id="sell-iron">0</div><button class="qty-btn" onclick="sell('iron',1)">＋</button></div></td></tr>
        <tr><td>木材</td><td id="shop-wood">0</td><td id="inv-wood">0</td><td class="res-price" id="price-wood">—</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="buy('wood',-1)">−</button><div class="qty-num" id="buy-wood">0</div><button class="qty-btn" onclick="buy('wood',1)">＋</button></div></td><td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('wood',-1)">−</button><div class="qty-num" id="sell-wood">0</div><button class="qty-btn" onclick="sell('wood',1)">＋</button></div></td></tr>
        <tr><td>硝石</td><td id="shop-niter">0</td><td id="inv-niter">0</td><td class="res-price" id="price-niter">—</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="buy('niter',-1)">−</button><div class="qty-num" id="buy-niter">0</div><button class="qty-btn" onclick="buy('niter',1)">＋</button></div></td><td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('niter',-1)">−</button><div class="qty-num" id="sell-niter">0</div><button class="qty-btn" onclick="sell('niter',1)">＋</button></div></td></tr>
        <tr><td>薬草</td><td id="shop-herb">0</td><td id="inv-herb">0</td><td class="res-price" id="price-herb">—</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="buy('herb',-1)">−</button><div class="qty-num" id="buy-herb">0</div><button class="qty-btn" onclick="buy('herb',1)">＋</button></div></td><td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('herb',-1)">−</button><div class="qty-num" id="sell-herb">0</div><button class="qty-btn" onclick="sell('herb',1)">＋</button></div></td></tr>
        <tr><td>兵糧</td><td id="shop-food_mat">0</td><td id="inv-food_mat">0</td><td class="res-price" id="price-food_mat">—</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="buy('food_mat',-1)">−</button><div class="qty-num" id="buy-food_mat">0</div><button class="qty-btn" onclick="buy('food_mat',1)">＋</button></div></td><td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('food_mat',-1)">−</button><div class="qty-num" id="sell-food_mat">0</div><button class="qty-btn" onclick="sell('food_mat',1)">＋</button></div></td></tr>
        <tr><td>回復薬</td><td id="shop-med">—</td><td id="inv-med">0</td><td class="res-price" id="price-med">売のみ</td><td class="locked">購入不可</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('med',-1)">−</button><div class="qty-num" id="sell-med">0</div><button class="qty-btn" onclick="sell('med',1)">＋</button></div></td></tr>
        </table>`;

if (h.includes(marketTableOld)) {
  h = h.replace(marketTableOld, marketTableNew);
  console.log('market table replaced');
} else if (h.includes('id="inv-iron"') && !h.includes('id="shop-iron"')) {
  // softer: insert shop columns by replace per row headers
  h = h.replace(
    '<tr><th>品目</th><th>在庫</th><th>価格</th><th>購入</th><th>売却</th></tr>',
    '<tr><th>品目</th><th>店</th><th>所持</th><th>価格</th><th>購入</th><th>売却</th></tr>'
  );
  ['iron', 'wood', 'niter', 'herb', 'food_mat'].forEach((r) => {
    const re = new RegExp(
      `<tr><td>([^<]+)</td><td id="inv-${r}">0</td><td class="res-price">([^<]*)</td>`
    );
    h = h.replace(
      re,
      `<tr><td>$1</td><td id="shop-${r}">0</td><td id="inv-${r}">0</td><td class="res-price" id="price-${r}">$2</td>`
    );
  });
  h = h.replace(
    /<tr><td>回復薬<\/td><td id="inv-med">0<\/td><td class="res-price">売30両<\/td>/,
    '<tr><td>回復薬</td><td id="shop-med">—</td><td id="inv-med">0</td><td class="res-price" id="price-med">売のみ</td>'
  );
  console.log('market table soft');
} else {
  console.log('market table already has shop or unmatched');
}

// prod summary caps dynamic
h = h.replace(
  /枠：<span id="prod-smith-used">0<\/span>\/3/g,
  '枠：<span id="prod-smith-used">0</span>/<span id="prod-smith-cap">3</span>　人員:<span id="smith-staff-n">0</span>'
);
h = h.replace(
  /枠：<span id="prod-pharm-used">0<\/span>\/3/g,
  '枠：<span id="prod-pharm-used">0</span>/<span id="prod-pharm-cap">3</span>　人員:<span id="pharm-staff-n">0</span>'
);

// ── 2) Audience: remove tribute, add staff/market/stable advice ──
const kengenOld = `<div class="kengen-note">進言・献上の選択（次ターンから有効、確定ボタン不要）</div>
  <div class="kengen-group">
    <div class="kengen-group-label">進 言</div>
    <div class="kg-opts" id="kg-shingen">
      <button class="kg-opt" onclick="kgPick('shingen','iron',this)">鉄増産</button>
      <button class="kg-opt" onclick="kgPick('shingen','wood',this)">木材増産</button>
      <button class="kg-opt" onclick="kgPick('shingen','food_mat',this)">兵糧増産</button>
      <button class="kg-opt" onclick="kgPick('shingen','horse_find',this)">名馬探索</button>
      <button class="kg-opt" onclick="kgPick('shingen','commend',this)">王子を褒める
        <select class="kg-sub" id="kg-commend-sel" onclick="event.stopPropagation()"><option value="food">兵糧太</option><option value="horse">騎馬次</option><option value="siege">攻三城</option><option value="weapon">武刃四</option></select>
      </button>
    </div>
  </div>
  <div class="kengen-group">
    <div class="kengen-group-label">献 上</div>
    <div class="kg-opts" id="kg-kenjou">
      <button class="kg-opt" onclick="kgPick('kenjou','potion',this)">回復薬</button>
      <button class="kg-opt" onclick="kgPick('kenjou','gold100',this)">100両</button>
      <button class="kg-opt" onclick="kgPick('kenjou','gold300',this)">300両</button>
    </div>
  </div>
  <div id="kg-result"></div>`;

const kengenNew = `<div class="kengen-note">進言の選択（次ターンから有効。献上は廃止）</div>
  <div class="kengen-group">
    <div class="kengen-group-label">進 言</div>
    <div class="kg-opts" id="kg-shingen">
      <button class="kg-opt" onclick="kgPick('shingen','iron',this)">鉄増産</button>
      <button class="kg-opt" onclick="kgPick('shingen','wood',this)">木材増産</button>
      <button class="kg-opt" onclick="kgPick('shingen','food_mat',this)">兵糧増産</button>
      <button class="kg-opt" onclick="kgPick('shingen','horse_find',this)">名馬探索</button>
      <button class="kg-opt" id="kg-staff-smith" onclick="kgPick('shingen','staff_smith',this)" title="兵器ルート突破で解放">工房に人を増やす</button>
      <button class="kg-opt" id="kg-staff-pharm" onclick="kgPick('shingen','staff_pharm',this)" title="武器ルート突破で解放">薬房に人を増やす</button>
      <button class="kg-opt" id="kg-market-up" onclick="kgPick('shingen','market_up',this)" title="兵糧ルート突破で解放">市場を強化</button>
      <button class="kg-opt" id="kg-stable-up" onclick="kgPick('shingen','stable_up',this)" title="馬ルート突破で解放">厩舎を拡張</button>
      <button class="kg-opt" onclick="kgPick('shingen','commend',this)">王子を褒める
        <select class="kg-sub" id="kg-commend-sel" onclick="event.stopPropagation()"><option value="food">兵糧太</option><option value="horse">騎馬次</option><option value="siege">攻三城</option><option value="weapon">武刃四</option></select>
      </button>
    </div>
  </div>
  <div id="kg-result"></div>`;

if (h.includes(kengenOld)) {
  h = h.replace(kengenOld, kengenNew);
  console.log('kengen UI replaced');
} else if (h.includes('献 上')) {
  // remove tribute group
  h = h.replace(
    /<div class="kengen-group">\s*<div class="kengen-group-label">献 上<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<div id="kg-result">/,
    '<div id="kg-result">'
  );
  h = h.replace('進言・献上の選択（次ターンから有効、確定ボタン不要）', '進言の選択（次ターンから有効。献上は廃止）');
  // insert new buttons before commend
  if (!h.includes("staff_smith")) {
    h = h.replace(
      /<button class="kg-opt" onclick="kgPick\('shingen','commend',this\)">/,
      `<button class="kg-opt" id="kg-staff-smith" onclick="kgPick('shingen','staff_smith',this)">工房に人を増やす</button>
      <button class="kg-opt" id="kg-staff-pharm" onclick="kgPick('shingen','staff_pharm',this)">薬房に人を増やす</button>
      <button class="kg-opt" id="kg-market-up" onclick="kgPick('shingen','market_up',this)">市場を強化</button>
      <button class="kg-opt" id="kg-stable-up" onclick="kgPick('shingen','stable_up',this)">厩舎を拡張</button>
      <button class="kg-opt" onclick="kgPick('shingen','commend',this)">`
    );
  }
  console.log('kengen soft replace');
}

// ── 3) Big JS addon ──
const ADDON = `
// ═══ Market economy + audience staff ═══
window.MARKET_ECON = ${JSON.stringify(ECON)};
(function(){
'use strict';
if(window.__marketEcon) return;
window.__marketEcon = true;

var ME = window.MARKET_ECON || {};
var KEYS = ['iron','wood','niter','herb','food_mat','med'];
var LABELS = {iron:'鉄',wood:'木材',niter:'硝石',herb:'薬草',food_mat:'兵糧',med:'回復薬'};

function invKey(r){ return r==='food_mat' ? 'food' : r; }

function ensureMarket(){
  if(!gs.market){
    gs.market = {
      shop: Object.assign({}, ME.shopStart||{}),
      shopCap: Object.assign({}, ME.shopCapBase||{}),
      priceBuy: Object.assign({}, ME.baseBuy||{}),
      priceSell: Object.assign({}, ME.baseSell||{}),
      prevBuy: Object.assign({}, ME.baseBuy||{}),
      marketLv: 0
    };
  }
  if(!gs.facility){
    gs.facility = { smithStaff:0, pharmStaff:0, smithStaffMax:0, pharmStaffMax:0, marketLv:0, stableExtra:0 };
  }
  // caps from breakthroughs (N1+)
  refreshFacilityUnlockCaps();
}

function clearedMax(route){
  var arr = (gs.cleared && gs.cleared[route]) || [];
  var m = 0;
  arr.forEach(function(n){ if(n>m) m=n; });
  // also treat current node-1 as progress if deeper
  var node = (gs.node && gs.node[route]) || 0;
  // cleared nodes are 1-based indices that were beaten
  return Math.max(m, 0);
}
/** staff slots unlocked by route breakthrough: N1→1, N2→2, N3→3 max 2 for +6 frames? user: N1 keeps unlock. 1人=+3枠, 1人ずつ. max 2 staff from N1 and N2? or N1 N2 N3 = 3?
 * Plan: N1→1人, N2→2人, N3→ still 2 or 3. User said 1人ずつ with N1. I'll do max 2: N1=1, N2+=1 (N3 no extra) OR N1=1 N2=2 N3=3.
 * "1人ずつ解放" + N1 included → N1 first person, N2 second. Cap 2. N3 no third to avoid 3*3=9 too much? User wondered 3 slots per person is a lot. max 2 staff.
 */
function staffUnlockMax(route){
  var cm = clearedMax(route);
  if(cm >= 2) return 2;
  if(cm >= 1) return 1;
  return 0;
}
function refreshFacilityUnlockCaps(){
  ensureMarket();
  gs.facility.smithStaffMax = staffUnlockMax('siege');
  gs.facility.pharmStaffMax = staffUnlockMax('weapon');
  var foodMax = staffUnlockMax('food'); // market levels
  gs.facility.marketLvMax = foodMax;
  gs.facility.stableExtraMax = staffUnlockMax('horse');
  if(gs.facility.smithStaff > gs.facility.smithStaffMax) gs.facility.smithStaff = gs.facility.smithStaffMax;
  if(gs.facility.pharmStaff > gs.facility.pharmStaffMax) gs.facility.pharmStaff = gs.facility.pharmStaffMax;
  if((gs.facility.marketLv||0) > (gs.facility.marketLvMax||0)) gs.facility.marketLv = gs.facility.marketLvMax;
  if((gs.facility.stableExtra||0) > (gs.facility.stableExtraMax||0)) gs.facility.stableExtra = gs.facility.stableExtraMax;
  // apply market cap bonus
  var baseCap = ME.shopCapBase || {};
  KEYS.forEach(function(k){
    var b = baseCap[k]||10;
    gs.market.shopCap[k] = b + (gs.facility.marketLv||0)*8;
  });
  // ranch pairs
  if(gs.ranch){
    gs.ranch.maxPairs = 1 + (gs.facility.stableExtra||0);
  }
}

function smithCap(){ ensureMarket(); return 3 + (gs.facility.smithStaff||0)*3; }
function pharmCap(){ ensureMarket(); return 3 + (gs.facility.pharmStaff||0)*3; }
window.smithCap = smithCap;
window.pharmCap = pharmCap;

function priceFromStock(res){
  var baseB = (ME.baseBuy&&ME.baseBuy[res])||20;
  var baseS = (ME.baseSell&&ME.baseSell[res])||16;
  if(res==='med') return {buy:999, sell:baseS};
  var cap = (gs.market.shopCap&&gs.market.shopCap[res])||20;
  var shop = (gs.market.shop&&gs.market.shop[res])||0;
  var ratio = cap>0 ? shop/cap : 0.5;
  // more stock → cheaper (0.7x .. 1.4x)
  var mult = 1.35 - ratio*0.65;
  if(mult<0.7) mult=0.7; if(mult>1.45) mult=1.45;
  var buy = Math.max(1, Math.round(baseB * mult));
  var sell = Math.max(1, Math.round(baseS * mult * 0.95));
  if(sell >= buy) sell = Math.max(1, buy-1);
  return {buy:buy, sell:sell};
}

function recomputePrices(savePrev){
  ensureMarket();
  if(savePrev){
    gs.market.prevBuy = Object.assign({}, gs.market.priceBuy||{});
  }
  KEYS.forEach(function(r){
    var p = priceFromStock(r);
    gs.market.priceBuy[r] = p.buy;
    gs.market.priceSell[r] = p.sell;
    // sync CFG.prices for existing calc
    if(CFG.prices && CFG.prices[r]){
      CFG.prices[r].buy = p.buy;
      CFG.prices[r].sell = p.sell;
    }
  });
}

function seasonRestock(){
  ensureMarket();
  var table = ME.seasonRestock || {};
  var add = table[String(gs.season)] || {};
  Object.keys(add).forEach(function(k){
    var cap = gs.market.shopCap[k]||20;
    gs.market.shop[k] = Math.min(cap, (gs.market.shop[k]||0) + add[k]);
  });
  // small ambient restock for all
  KEYS.forEach(function(k){
    if(k==='med') return;
    var cap = gs.market.shopCap[k]||20;
    gs.market.shop[k] = Math.min(cap, (gs.market.shop[k]||0) + 1);
  });
}

function deltaStr(res){
  var cur = (gs.market.priceBuy&&gs.market.priceBuy[res])||0;
  var prev = (gs.market.prevBuy&&gs.market.prevBuy[res]);
  if(prev==null) return '';
  var d = cur - prev;
  if(d===0) return '（±0）';
  return d>0 ? '（+'+d+'）' : '（'+d+'）';
}

function refreshMarketUI(){
  ensureMarket();
  recomputePrices(false);
  KEYS.forEach(function(r){
    var shopEl = document.getElementById('shop-'+r);
    var invEl = document.getElementById(r==='food_mat'?'inv-food_mat':(r==='med'?'inv-med':'inv-'+r));
    var priceEl = document.getElementById('price-'+r);
    if(shopEl){
      if(r==='med') shopEl.textContent = '—';
      else shopEl.textContent = String(gs.market.shop[r]!=null?gs.market.shop[r]:0);
    }
    if(invEl){
      if(r==='med') invEl.textContent = String(gs.stock.med||0);
      else if(r==='food_mat') invEl.textContent = String(gs.inv.food||0);
      else invEl.textContent = String(gs.inv[r]||0);
    }
    if(priceEl){
      if(r==='med') priceEl.textContent = '売'+gs.market.priceSell.med+'両';
      else {
        var d = deltaStr(r);
        priceEl.innerHTML = '売'+gs.market.priceSell[r]+'両 買'+gs.market.priceBuy[r]+'両'+
          (d ? ' <span style="color:var(--faded);font-size:10px">'+d+'</span>' : '');
      }
    }
  });
  // capacity labels
  var sc=document.getElementById('prod-smith-cap'); if(sc) sc.textContent=String(smithCap());
  var pc=document.getElementById('prod-pharm-cap'); if(pc) pc.textContent=String(pharmCap());
  var ss=document.getElementById('smith-staff-n'); if(ss) ss.textContent=String(gs.facility.smithStaff||0);
  var ps=document.getElementById('pharm-staff-n'); if(ps) ps.textContent=String(gs.facility.pharmStaff||0);
  // advice buttons enabled state
  refreshAdviceButtons();
  refreshMarketBubble();
}
window.refreshMarketUI = refreshMarketUI;

function refreshAdviceButtons(){
  ensureMarket();
  refreshFacilityUnlockCaps();
  function setBtn(id, ok, tip){
    var b=document.getElementById(id);
    if(!b) return;
    b.disabled = !ok;
    b.style.opacity = ok ? '1' : '0.35';
    b.title = tip || '';
  }
  setBtn('kg-staff-smith',
    (gs.facility.smithStaffMax||0) > (gs.facility.smithStaff||0),
    '兵器ルート突破数で解放（現在最大'+gs.facility.smithStaffMax+'人／雇用'+gs.facility.smithStaff+'）');
  setBtn('kg-staff-pharm',
    (gs.facility.pharmStaffMax||0) > (gs.facility.pharmStaff||0),
    '武器ルート突破で解放（最大'+gs.facility.pharmStaffMax+'）');
  setBtn('kg-market-up',
    (gs.facility.marketLvMax||0) > (gs.facility.marketLv||0),
    '兵糧ルート突破で解放（強化Lv'+gs.facility.marketLv+'/'+gs.facility.marketLvMax+'）');
  setBtn('kg-stable-up',
    (gs.facility.stableExtraMax||0) > (gs.facility.stableExtra||0),
    '馬ルート突破で解放（追加つがい枠'+gs.facility.stableExtra+'/'+gs.facility.stableExtraMax+'）');
}

function refreshMarketBubble(){
  var card=document.getElementById('card-market');
  if(!card) return;
  var bubble=card.querySelector('.bubble');
  if(!bubble) return;
  var lines = ME.marketLines || [];
  var season = gs.season;
  var candidates = [];
  lines.forEach(function(L){
    if(L.when==='generic') candidates.push(L.text);
    if(L.when==='spring_herb' && season===0) candidates.push(L.text);
    if(L.when==='summer_herb' && season===1) candidates.push(L.text);
    if(L.when==='autumn_food' && season===2) candidates.push(L.text);
    if(L.when==='winter_wood' && season===3) candidates.push(L.text);
    if(L.when==='low_stock'){
      var low = KEYS.some(function(k){ return k!=='med' && (gs.market.shop[k]||0) < 4; });
      if(low) candidates.push(L.text);
    }
    if(L.when==='high_stock'){
      var hi = KEYS.some(function(k){
        if(k==='med') return false;
        var cap=gs.market.shopCap[k]||1;
        return (gs.market.shop[k]||0) > cap*0.75;
      });
      if(hi) candidates.push(L.text);
    }
  });
  if(!candidates.length) candidates.push('相場は動いています。');
  var text = candidates[Math.floor(Math.random()*candidates.length)];
  bubble.textContent = text;
}

// Override buy/sell/confirmTrade
window.buy = function(res, delta){
  ensureMarket();
  recomputePrices(false);
  var pBuy = gs.market.priceBuy[res];
  if(pBuy>=999) return;
  var cur = gs.buy[res]||0;
  var nv = Math.max(0, cur+delta);
  if(delta>0){
    var shop = gs.market.shop[res]||0;
    if(nv > shop) nv = shop; // can't buy more than shop
    // gold check
    var cost = 0;
    Object.keys(gs.buy||{}).forEach(function(r){
      if(r===res) return;
      cost += (gs.buy[r]||0)*(gs.market.priceBuy[r]||0);
    });
    cost += nv * pBuy;
    var income = 0;
    Object.keys(gs.sellQ||{}).forEach(function(r){
      income += (gs.sellQ[r]||0)*(gs.market.priceSell[r]||0);
    });
    if(gs.gold - cost + income < 0) return;
  }
  gs.buy[res]=nv;
  var el=document.getElementById('buy-'+res); if(el) el.textContent=nv;
  if(typeof updateTradeTotals==='function') updateTradeTotals();
};

window.sell = function(res, delta){
  ensureMarket();
  recomputePrices(false);
  var avail = res==='med' ? (gs.stock.med||0) : (gs.inv[invKey(res)]||0);
  var nv = Math.max(0, Math.min(avail, (gs.sellQ[res]||0)+delta));
  gs.sellQ[res]=nv;
  var el=document.getElementById('sell-'+res); if(el) el.textContent=nv;
  if(typeof updateTradeTotals==='function') updateTradeTotals();
};

window.calcBuyCost = function(){
  ensureMarket();
  return Object.entries(gs.buy||{}).reduce(function(s, e){
    return s + e[1]*(gs.market.priceBuy[e[0]]||CFG.prices[e[0]]&&CFG.prices[e[0]].buy||0);
  }, 0);
};
window.calcSellIncome = function(){
  ensureMarket();
  return Object.entries(gs.sellQ||{}).reduce(function(s, e){
    return s + e[1]*(gs.market.priceSell[e[0]]||0);
  }, 0);
};
window.calcTradeNet = function(){ return window.calcSellIncome() - window.calcBuyCost(); };

window.confirmTrade = function(){
  ensureMarket();
  recomputePrices(false);
  var net = window.calcTradeNet();
  if(gs.gold + net < 0){ showToast('金が足りません'); return; }
  // validate shop stock
  for(var r in gs.buy){
    if((gs.buy[r]||0) > (gs.market.shop[r]||0)){ showToast('店の在庫が足りません'); return; }
  }
  gs.gold += net;
  Object.keys(gs.buy||{}).forEach(function(r){
    var q = gs.buy[r]||0;
    if(!q) return;
    gs.market.shop[r] = Math.max(0, (gs.market.shop[r]||0) - q);
    if(r==='food_mat') gs.inv.food = (gs.inv.food||0) + q;
    else gs.inv[r] = (gs.inv[r]||0) + q;
  });
  Object.keys(gs.sellQ||{}).forEach(function(r){
    var q = gs.sellQ[r]||0;
    if(!q) return;
    if(r==='med') gs.stock.med = Math.max(0, (gs.stock.med||0)-q);
    else if(r==='food_mat') gs.inv.food = Math.max(0, (gs.inv.food||0)-q);
    else gs.inv[r] = Math.max(0, (gs.inv[r]||0)-q);
    if(r!=='med'){
      var cap = gs.market.shopCap[r]||20;
      gs.market.shop[r] = Math.min(cap, (gs.market.shop[r]||0) + q);
    }
  });
  gs.buy={}; gs.sellQ={};
  Object.keys(CFG.prices||{}).forEach(function(r){
    ['buy-','sell-'].forEach(function(pre){
      var e=document.getElementById(pre+r); if(e) e.textContent=0;
    });
  });
  // instant price adjust after trade
  gs.market.prevBuy = Object.assign({}, gs.market.priceBuy);
  recomputePrices(false);
  if(typeof updateTradeTotals==='function') updateTradeTotals();
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updateInvDisplay==='function') updateInvDisplay();
  refreshMarketUI();
  showToast('売買を確定しました');
};

// produce uses dynamic cap
var __produce = window.produce || (typeof produce==='function'?produce:null);
if(__produce){
  // replace produce entirely lightly
}
window.produce = function(item, delta){
  ensureMarket();
  var isPharma = item==='med';
  var cap = isPharma ? pharmCap() : smithCap();
  var group = isPharma ? ['med'] : ['sword','siege_w'];
  var used = group.reduce(function(s,k){ return s+(gs.prod[k]||0); }, 0);
  var nv = (gs.prod[item]||0) + delta;
  if(nv<0 || used+delta>cap) return;
  var ironNeed = (gs.prod.sword||0) + (item==='sword'?delta:0);
  var woodNeed = ((gs.prod.siege_w||0) + (item==='siege_w'?delta:0))*2;
  var herbNeed = (gs.prod.med||0) + (item==='med'?delta:0);
  if(!isPharma && (ironNeed>(gs.inv.iron||0) || woodNeed>(gs.inv.wood||0))) return;
  if(isPharma && herbNeed>(gs.inv.herb||0)) return;
  gs.prod[item]=nv;
  var set=function(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; };
  set('prod-'+item, nv);
  set('prod-smith-used', (gs.prod.sword||0)+(gs.prod.siege_w||0));
  set('prod-pharm-used', gs.prod.med||0);
  set('prod-smith-cap', smithCap());
  set('prod-pharm-cap', pharmCap());
  set('prod-鉄-cost', gs.prod.sword||0);
  set('prod-iron-cost', gs.prod.sword||0);
  set('prod-wood-cost', (gs.prod.siege_w||0)*2);
  set('prod-herb-cost', gs.prod.med||0);
};
if(typeof produce==='function') produce = window.produce;

// kgPick labels + pending apply next turn
var SHINGEN_LABELS = {
  iron:'鉄増産', wood:'木材増産', food_mat:'兵糧増産', horse_find:'名馬探索',
  staff_smith:'工房に人を増やす', staff_pharm:'薬房に人を増やす',
  market_up:'市場を強化', stable_up:'厩舎を拡張', commend:'王子を褒める'
};

var __kg = window.kgPick || (typeof kgPick==='function'?kgPick:null);
window.kgPick = function(type, val, btn){
  ensureMarket();
  refreshFacilityUnlockCaps();
  if(type==='kenjou'){ showToast('献上は廃止されました'); return; }
  if(val==='staff_smith'){
    if((gs.facility.smithStaff||0) >= (gs.facility.smithStaffMax||0)){
      showToast('工房の人員はこれ以上増やせません（兵器ルート突破が必要）'); return;
    }
  }
  if(val==='staff_pharm'){
    if((gs.facility.pharmStaff||0) >= (gs.facility.pharmStaffMax||0)){
      showToast('薬房の人員はこれ以上増やせません（武器ルート突破が必要）'); return;
    }
  }
  if(val==='market_up'){
    if((gs.facility.marketLv||0) >= (gs.facility.marketLvMax||0)){
      showToast('市場強化は兵糧ルート突破が必要です'); return;
    }
  }
  if(val==='stable_up'){
    if((gs.facility.stableExtra||0) >= (gs.facility.stableExtraMax||0)){
      showToast('厩舎拡張は馬ルート突破が必要です'); return;
    }
  }
  if(__kg) __kg(type, val, btn);
  else {
    gs.kengen = gs.kengen || {};
    gs.kengen[type]=val;
  }
  // update result text
  var kr=document.getElementById('kg-result');
  if(kr && gs.kengen && gs.kengen.shingen){
    kr.textContent = '進言：'+(SHINGEN_LABELS[gs.kengen.shingen]||gs.kengen.shingen)+'　→ 次ターンより有効';
  }
};
if(typeof kgPick==='function') kgPick = window.kgPick;

function applyPendingAdvice(){
  ensureMarket();
  var v = gs.kengen && gs.kengen.shingen;
  if(!v) return;
  refreshFacilityUnlockCaps();
  if(v==='staff_smith' && (gs.facility.smithStaff||0) < (gs.facility.smithStaffMax||0)){
    gs.facility.smithStaff = (gs.facility.smithStaff||0)+1;
    showToast('工房の人員+1（枠'+smithCap()+'）');
  }
  if(v==='staff_pharm' && (gs.facility.pharmStaff||0) < (gs.facility.pharmStaffMax||0)){
    gs.facility.pharmStaff = (gs.facility.pharmStaff||0)+1;
    showToast('薬房の人員+1（枠'+pharmCap()+'）');
  }
  if(v==='market_up' && (gs.facility.marketLv||0) < (gs.facility.marketLvMax||0)){
    gs.facility.marketLv = (gs.facility.marketLv||0)+1;
    refreshFacilityUnlockCaps();
    showToast('市場を強化しました（店在庫上限アップ）');
  }
  if(v==='stable_up' && (gs.facility.stableExtra||0) < (gs.facility.stableExtraMax||0)){
    gs.facility.stableExtra = (gs.facility.stableExtra||0)+1;
    if(gs.ranch) gs.ranch.maxPairs = 1 + gs.facility.stableExtra;
    showToast('厩舎を拡張しました（つがい枠'+(1+gs.facility.stableExtra)+'）');
  }
}

// goToNextTurn: season market + advice apply
(function(){
  var orig = window.goToNextTurn || (typeof goToNextTurn==='function'?goToNextTurn:null);
  if(!orig) return;
  window.goToNextTurn = function(){
    ensureMarket();
    applyPendingAdvice();
    var r = orig.apply(this, arguments);
    // after turn advance
    try{
      ensureMarket();
      seasonRestock();
      recomputePrices(true);
      refreshMarketUI();
    }catch(e){ console.warn('market turn', e); }
    return r;
  };
  if(typeof goToNextTurn==='function') goToNextTurn = window.goToNextTurn;
})();

// openCard market refresh
(function(){
  var prev = window.openCard || (typeof openCard==='function'?openCard:null);
  if(!prev) return;
  window.openCard = function(name){
    prev(name);
    if(name==='market' || name==='smith' || name==='pharmacy'){
      ensureMarket();
      refreshMarketUI();
    }
  };
  if(typeof openCard==='function') openCard = window.openCard;
})();

// updateInvDisplay also refresh market columns
(function(){
  var prev = window.updateInvDisplay || (typeof updateInvDisplay==='function'?updateInvDisplay:null);
  if(!prev) return;
  window.updateInvDisplay = function(){
    prev();
    try{ refreshMarketUI(); }catch(e){}
  };
  if(typeof updateInvDisplay==='function') updateInvDisplay = window.updateInvDisplay;
})();

// buildResultScreen: advice labels + horse seasonal reports
(function(){
  var prev = window.buildResultScreen || (typeof buildResultScreen==='function'?buildResultScreen:null);
  if(!prev) return;
  window.buildResultScreen = function(){
    prev.apply(this, arguments);
    // kengen labels
    var kng=document.getElementById('result-kengen');
    if(kng && gs.kengen && gs.kengen.shingen){
      var lab = SHINGEN_LABELS[gs.kengen.shingen] || gs.kengen.shingen;
      kng.innerHTML = '<div>📜 進言：<b>'+lab+'</b>　→ 次ターンより有効</div>';
    } else if(kng && (!gs.kengen || !gs.kengen.shingen)){
      // leave previous
    }
    // Horse result reports (end-of-season perspective: current season is the one that just "ended" for report)
    // When buildResult runs, season is still current turn's season before goToNextTurn
    try{
      var log = document.getElementById('result-log');
      if(!log || !gs.ranch) return;
      var s = gs.season;
      var notes = [];
      if(s===1){ // 夏の結果
        notes.push('🐎 馬も元気だ。そろそろ番を考えてあげよう。');
      } else if(s===2){ // 秋の結果
        if(gs.ranch.autumnCoupled || (gs.ranch.pairs&&gs.ranch.pairs.length)){
          notes.push('🐎 馬の夫婦は仲良さそうだ。今度、食料と薬を与えてみよう。');
        } else {
          notes.push('🐎 今秋は番を組まなかった。牧場は静かだ。');
        }
      } else if(s===3){ // 冬の結果
        var parts=[];
        if(gs.ranch.winterFoodDone) parts.push('兵糧');
        if(gs.ranch.winterMedDone) parts.push('回復薬');
        if(parts.length) notes.push('🐎 餌として'+parts.join('と')+'を与えた。');
        else notes.push('🐎 今冬は特別な餌やりをしなかった。');
      } else if(s===0){
        // spring result often after births already logged by v2
      }
      notes.forEach(function(t){
        var d=document.createElement('div');
        d.className='log-line log-info show';
        d.textContent=t;
        log.appendChild(d);
      });
    }catch(e){}
  };
  if(typeof buildResultScreen==='function') buildResultScreen = window.buildResultScreen;
})();

// Suppress old v2 spring/autumn pushy logs somewhat — leave them, result adds clearer ones

// init
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    ensureMarket();
    recomputePrices(true);
    refreshMarketUI();
  }, 90);
});
if(document.readyState!=='loading'){
  setTimeout(function(){ ensureMarket(); recomputePrices(true); refreshMarketUI(); }, 90);
}

console.log('[market+audience] ready');
})();
`;

if (!h.includes('[market+audience]')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + ADDON + '\n' + h.slice(last);
  console.log('market addon inserted');
} else {
  console.log('market addon exists');
}

// CSS small
const css = `
/* market price delta */
#market-table .res-price{font-size:11px;line-height:1.4;}
.kg-opt:disabled{pointer-events:none;}
`;
if (!h.includes('#market-table .res-price')) {
  h = h.replace('</style>', css + '\n</style>');
}

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
    console.log('OK', n);
  } catch (e) {
    console.error('FAIL', n, e.message);
    fail = true;
  }
  n++;
}

console.log('DONE', {
  shop: h.includes('shop-iron'),
  audience: h.includes('staff_smith'),
  noTribute: !h.includes("kgPick('kenjou'") || h.includes('献上は廃止'),
  marketJs: h.includes('[market+audience]'),
  fail,
});
if (fail) process.exit(1);
