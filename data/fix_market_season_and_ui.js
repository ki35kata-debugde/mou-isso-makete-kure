/**
 * ① [新着！] 赤
 * ② 輸送 prep-info の信頼+N を trust_reward と同期
 * ③ 同季は売＜買（季節またぎ転売向け）。基準をやや寄せつつ同季黒字は不可
 * ④ 季節在庫の増減 + shopMin
 * ⑤ 季節変動適用後に価格再計算（感度アップ）
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'mou_isso_v0_6_1.html');
const JSON_PATH = path.join(__dirname, 'market_economy.json');

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_market_season_' + Date.now(), h, 'utf8');

// ── market_economy.json ──
let ME = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// 同季転売は不可のまま、やや寄せる（売≈買の88〜92%）
ME.baseBuy = ME.baseBuy || {};
ME.baseSell = ME.baseSell || {};
const buySellPairs = {
  iron: [20, 18],
  wood: [12, 11],
  niter: [25, 22],
  herb: [15, 13],
  food_mat: [18, 16],
};
Object.keys(buySellPairs).forEach((k) => {
  ME.baseBuy[k] = buySellPairs[k][0];
  ME.baseSell[k] = buySellPairs[k][1];
});
// products unchanged sell-only
ME.baseBuy.med = 999;
ME.baseBuy.sword = 999;
ME.baseBuy.siege_w = 999;

// 季節増減（正=入荷, 負=減）— 秋に兵糧増、他季で徐々に減
ME.seasonStockDelta = {
  '0': { herb: 6, food_mat: -2 }, // 春
  '1': { herb: 6, food_mat: -2 }, // 夏
  '2': { food_mat: 14, herb: -1 }, // 秋 ばんと増
  '3': { wood: 8, food_mat: -3, herb: -2 }, // 冬
};
// 互換: 旧 seasonRestock も残すが実行時は seasonStockDelta 優先
ME.seasonRestock = ME.seasonStockDelta;

ME.shopMin = {
  iron: 2,
  wood: 2,
  niter: 1,
  herb: 2,
  food_mat: 4,
  med: 0,
  sword: 0,
  siege_w: 0,
};
ME.ambientDelta = 0; // 全品+1はやめて季節表に任せる

// 価格倍率レンジ（在庫感度）
ME.priceMultMin = 0.55;
ME.priceMultMax = 1.55;
// 同季: 売値は買値の何倍まで（常に <1 で同季転売赤字）
ME.sellToBuyRatio = 0.9;

// セリフ更新
if (Array.isArray(ME.marketLines)) {
  ME.marketLines = ME.marketLines.map((L) => {
    if (L.text && L.text.indexOf('転売') >= 0) {
      return Object.assign({}, L, {
        text: '同じ季節のうちの転売は損しやすいです。安い季節に仕入れて、足りない季節に出すと…ね。',
      });
    }
    return L;
  });
  const hasSeasonTip = ME.marketLines.some((L) => L.text && L.text.indexOf('安い季節') >= 0);
  if (!hasSeasonTip) {
    ME.marketLines.push({
      when: 'generic',
      text: '秋は兵糧がだぶついて安くなりやすいです。冬から夏にかけて減ると値も戻りますよ。',
    });
  }
}

fs.writeFileSync(JSON_PATH, JSON.stringify(ME, null, 2), 'utf8');
console.log('market_economy.json updated');

// sync MARKET_ECON in HTML
{
  const i = h.indexOf('MARKET_ECON');
  if (i >= 0) {
    const eq = h.indexOf('{', i);
    let depth = 0,
      end = -1;
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
      console.log('MARKET_ECON synced');
    }
  }
}

// CSS: 新着赤
const css = `
/* 新着は赤 */
.tab-dl.tab-shincho{
  color: #c0392b !important;
  font-weight: 700 !important;
  font-size: 9px !important;
}
`;
if (!h.includes('/* 新着は赤 */')) {
  h = h.replace('</style>', css + '\n</style>');
  console.log('css red shincho');
}

// prep-info hardcoded numbers → placeholders updated by JS, also fix HTML defaults to +4
h = h.replace(
  '準備品を手渡すと信頼度が上がります（+3）',
  '準備品を手渡すと信頼度が上がります（+4）'
);
h = h.replace(
  '兵糧×4と回復薬×1を手渡すと信頼度+3。薬は冬の牧場でも大事…',
  '兵糧×4と回復薬×1を手渡すと信頼度+4。薬は冬の牧場でも大事…'
);
h = h.replace(
  /準備品を手渡すと信頼度が上がります（\+2）/g,
  '準備品を手渡すと信頼度が上がります（+4）'
);
console.log('prep-info HTML defaults');

const FIX = `
// ═══ market season + trust prep text + red shincho ═══
(function(){
'use strict';
if(window.__marketSeasonUiFix) return;
window.__marketSeasonUiFix = true;

var ME = window.MARKET_ECON || {};
var RAW_KEYS = ['iron','wood','niter','herb','food_mat','med'];

function mcfg(){ return window.MARKET_ECON || ME || {}; }

// ① 新着赤（CSSでも指定。JSで再適用）
function styleShinchoRed(){
  // nothing dynamic beyond class tab-shincho
}

// ② 輸送説明文を trust_reward と同期
function syncPrepTrustLabels(){
  try{
    if(typeof CFG==='undefined' || !CFG.prep_quests) return;
    var PK = window.PKEYS || ['food','horse','siege','weapon'];
    PK.forEach(function(key){
      var q = CFG.prep_quests[key];
      if(!q) return;
      var tr = q.trust_reward!=null ? q.trust_reward : 4;
      var el = document.getElementById('prep-info-'+key);
      if(!el) return;
      if(key==='horse'){
        el.textContent = '兵糧×4と回復薬×1を手渡すと信頼度+'+tr+'。薬は冬の牧場でも大事…';
      } else {
        el.textContent = '準備品を手渡すと信頼度が上がります（+'+tr+'）';
      }
    });
  }catch(e){ console.warn('syncPrepTrustLabels', e); }
}
window.syncPrepTrustLabels = syncPrepTrustLabels;

// 価格: 在庫比で倍率。同季は常に売＜買（季節またぎで利益）
window.priceFromStock = function(res){
  var M = mcfg();
  var baseB = (M.baseBuy && M.baseBuy[res]) || 20;
  var baseS = (M.baseSell && M.baseSell[res]) || Math.round(baseB * 0.9);
  if(res==='med' || res==='sword' || res==='siege_w'){
    return { buy: 999, sell: baseS };
  }
  var cap = (gs.market.shopCap && gs.market.shopCap[res]) || 20;
  var shop = (gs.market.shop && gs.market.shop[res]) || 0;
  var ratio = cap > 0 ? shop / cap : 0.5;
  if(ratio < 0) ratio = 0;
  if(ratio > 1) ratio = 1;
  var multMin = M.priceMultMin != null ? M.priceMultMin : 0.55;
  var multMax = M.priceMultMax != null ? M.priceMultMax : 1.55;
  // ratio0 → max, ratio1 → min
  var mult = multMax - ratio * (multMax - multMin);
  var buy = Math.max(1, Math.round(baseB * mult));
  // 同季スプレッド: 売 = 買 × sellToBuyRatio（既定0.9）かつ 必ず buy 未満
  var sratio = M.sellToBuyRatio != null ? M.sellToBuyRatio : 0.9;
  // base の比率も加味
  var baseRatio = baseB > 0 ? baseS / baseB : sratio;
  var useRatio = Math.min(sratio, baseRatio);
  if(useRatio >= 1) useRatio = 0.9;
  var sell = Math.max(1, Math.round(buy * useRatio));
  if(sell >= buy) sell = Math.max(1, buy - 1);
  return { buy: buy, sell: sell };
};

window.recomputePrices = function(savePrev){
  if(typeof ensureMarket==='function') ensureMarket();
  else if(typeof window.ensureMarket==='function') window.ensureMarket();
  if(!gs.market) return;
  if(savePrev){
    gs.market.prevBuy = Object.assign({}, gs.market.priceBuy || {});
  }
  var keys = RAW_KEYS.slice();
  keys.forEach(function(r){
    var p = window.priceFromStock(r);
    if(!gs.market.priceBuy) gs.market.priceBuy = {};
    if(!gs.market.priceSell) gs.market.priceSell = {};
    gs.market.priceBuy[r] = p.buy;
    gs.market.priceSell[r] = p.sell;
    if(typeof CFG!=='undefined' && CFG.prices && CFG.prices[r]){
      CFG.prices[r].buy = p.buy;
      CFG.prices[r].sell = p.sell;
    }
  });
  // products fixed sell
  ['sword','siege_w','med'].forEach(function(r){
    var M = mcfg();
    if(gs.market.priceSell) gs.market.priceSell[r] = (M.baseSell&&M.baseSell[r])||gs.market.priceSell[r]||0;
    if(gs.market.priceBuy) gs.market.priceBuy[r] = 999;
  });
};

// ④ 季節増減 + 最低在庫
window.applySeasonStockDelta = function(){
  if(typeof ensureMarket==='function') ensureMarket();
  else if(typeof window.ensureMarket==='function') window.ensureMarket();
  var M = mcfg();
  var table = M.seasonStockDelta || M.seasonRestock || {};
  var add = table[String(gs.season)] || {};
  var mins = M.shopMin || {};
  Object.keys(add).forEach(function(k){
    var cap = (gs.market.shopCap && gs.market.shopCap[k]) || 20;
    var min = mins[k] != null ? mins[k] : 0;
    var next = (gs.market.shop[k] || 0) + add[k];
    if(next > cap) next = cap;
    if(next < min) next = min;
    gs.market.shop[k] = next;
  });
  // ambient
  var amb = M.ambientDelta;
  if(amb == null) amb = 0;
  if(amb !== 0){
    RAW_KEYS.forEach(function(k){
      if(k==='med'||k==='sword'||k==='siege_w') return;
      var cap = (gs.market.shopCap && gs.market.shopCap[k]) || 20;
      var min = mins[k] != null ? mins[k] : 0;
      var next = (gs.market.shop[k] || 0) + amb;
      if(next > cap) next = cap;
      if(next < min) next = min;
      gs.market.shop[k] = next;
    });
  }
  // clamp all to min/max
  RAW_KEYS.forEach(function(k){
    if(gs.market.shop[k]==null) return;
    var cap = (gs.market.shopCap && gs.market.shopCap[k]) || 20;
    var min = mins[k] != null ? mins[k] : 0;
    if(gs.market.shop[k] > cap) gs.market.shop[k] = cap;
    if(gs.market.shop[k] < min) gs.market.shop[k] = min;
  });
};
// alias
window.seasonRestock = function(){ window.applySeasonStockDelta(); };
if(typeof seasonRestock==='function'){
  try{ seasonRestock = window.seasonRestock; }catch(e){}
}

// ⑤ ターン進行: 前期保存 → 季節在庫 → 今季価格
(function(){
  var orig = window.goToNextTurn;
  if(typeof orig!=='function') return;
  window.goToNextTurn = function(){
    try{
      if(typeof window.ensureMarket==='function') window.ensureMarket();
      // 1) 前期価格（季節変動前）
      if(gs.market && gs.market.priceBuy){
        gs.market.prevBuy = Object.assign({}, gs.market.priceBuy);
      }
    }catch(e){}
    var r = orig.apply(this, arguments);
    try{
      // 他フックが seasonRestock/recompute していても、順序を保証してやり直す
      if(typeof window.applySeasonStockDelta==='function') window.applySeasonStockDelta();
      if(typeof window.recomputePrices==='function') window.recomputePrices(false);
      if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
    }catch(e){ console.warn('market turn order', e); }
    try{ syncPrepTrustLabels(); }catch(e){}
    return r;
  };
})();

// openCard transport/market
(function(){
  var prev = window.openCard;
  if(typeof prev!=='function') return;
  window.openCard = function(name){
    var r = prev.apply(this, arguments);
    if(name==='transport' || name==='market'){
      syncPrepTrustLabels();
    }
    if(name==='market' && typeof window.refreshMarketUI==='function'){
      try{ window.recomputePrices(false); window.refreshMarketUI(); }catch(e){}
    }
    return r;
  };
  try{ openCard = window.openCard; }catch(e){}
})();

// setPhase transport
(function(){
  var _sp = window.setPhase;
  if(typeof _sp!=='function') return;
  window.setPhase = function(p){
    var r = _sp.apply(this, arguments);
    if(p==='transport' || p==='management'){
      syncPrepTrustLabels();
    }
    return r;
  };
  try{ setPhase = window.setPhase; }catch(e){}
})();

// confirmTrade: 売買後も min を割らない
(function(){
  var prev = window.confirmTrade;
  if(typeof prev!=='function') return;
  window.confirmTrade = function(){
    var r = prev.apply(this, arguments);
    try{
      var M = mcfg();
      var mins = M.shopMin || {};
      RAW_KEYS.forEach(function(k){
        if(!gs.market || gs.market.shop[k]==null) return;
        var min = mins[k]!=null ? mins[k] : 0;
        var cap = (gs.market.shopCap&&gs.market.shopCap[k])||20;
        if(gs.market.shop[k] < min) gs.market.shop[k] = min;
        if(gs.market.shop[k] > cap) gs.market.shop[k] = cap;
      });
      if(typeof window.recomputePrices==='function') window.recomputePrices(false);
      if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
    }catch(e){}
    return r;
  };
})();

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    syncPrepTrustLabels();
    styleShinchoRed();
    try{
      if(typeof window.ensureMarket==='function') window.ensureMarket();
      if(typeof window.recomputePrices==='function') window.recomputePrices(false);
    }catch(e){}
  }, 120);
});

console.log('[market season+ui] ready — red shincho, prep trust labels, seasonal delta+min, price after stock');
})();
`;

if (!h.includes('[market season+ui] ready')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + FIX + '\n' + h.slice(last);
  console.log('fix inserted');
} else {
  const a = h.indexOf('// ═══ market season + trust prep text');
  const b = h.indexOf('[market season+ui] ready', a);
  const c = h.indexOf('})();', b);
  h = h.slice(0, a) + FIX + h.slice(c + 5);
  console.log('fix replaced');
}

// Patch source priceFromStock if present for consistency
if (h.includes('function priceFromStock(res){') && !h.includes('/* priceFromStock season-arb */')) {
  h = h.replace(
    /function priceFromStock\(res\)\{[\s\S]*?return \{buy:buy, sell:sell\};\n\}/,
    `function priceFromStock(res){
  /* priceFromStock season-arb */
  if(typeof window.priceFromStock==='function' && window.priceFromStock!==priceFromStock){
    return window.priceFromStock(res);
  }
  var baseB = (ME.baseBuy&&ME.baseBuy[res])||20;
  var baseS = (ME.baseSell&&ME.baseSell[res])||16;
  if(res==='med') return {buy:999, sell:baseS};
  var cap = (gs.market.shopCap&&gs.market.shopCap[res])||20;
  var shop = (gs.market.shop&&gs.market.shop[res])||0;
  var ratio = cap>0 ? shop/cap : 0.5;
  if(ratio<0)ratio=0; if(ratio>1)ratio=1;
  var multMin = (ME.priceMultMin!=null)?ME.priceMultMin:0.55;
  var multMax = (ME.priceMultMax!=null)?ME.priceMultMax:1.55;
  var mult = multMax - ratio*(multMax-multMin);
  var buy = Math.max(1, Math.round(baseB * mult));
  var sratio = (ME.sellToBuyRatio!=null)?ME.sellToBuyRatio:0.9;
  var baseRatio = baseB>0 ? baseS/baseB : sratio;
  var useRatio = Math.min(sratio, baseRatio);
  if(useRatio>=1) useRatio=0.9;
  var sell = Math.max(1, Math.round(buy * useRatio));
  if(sell >= buy) sell = Math.max(1, buy-1);
  return {buy:buy, sell:sell};
}`
  );
  console.log('source priceFromStock patched');
}

fs.writeFileSync(HTML, h, 'utf8');

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
console.log('DONE', {
  fail,
  ready: h.includes('[market season+ui] ready'),
  red: h.includes('/* 新着は赤 */'),
  prep4: h.includes('信頼度が上がります（+4）'),
  delta: h.includes('seasonStockDelta'),
});
