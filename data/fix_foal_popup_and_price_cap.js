/**
 * Spring foal birth popup + market price ±25% (low stock = higher price)
 * Safe: only appends at end of last script, no mid-file replace.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'mou_isso_v0_6_1.html');
const JSON_PATH = path.join(__dirname, 'market_economy.json');

let ME = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
ME.priceMultMin = 0.75;
ME.priceMultMax = 1.25;
if (ME.sellToBuyRatio == null) ME.sellToBuyRatio = 0.9;
if (!ME.shopMin) {
  ME.shopMin = { iron: 2, wood: 2, niter: 1, herb: 2, food_mat: 4, med: 0, sword: 0, siege_w: 0 };
}
if (ME.ambientDelta == null) ME.ambientDelta = 0;
function fixKeys(o) {
  if (!o || typeof o !== 'object') return o;
  if (Array.isArray(o)) return o.map(fixKeys);
  const out = {};
  Object.keys(o).forEach((k) => {
    out[k === 'Iron' ? 'iron' : k] = fixKeys(o[k]);
  });
  return out;
}
ME = fixKeys(ME);
fs.writeFileSync(JSON_PATH, JSON.stringify(ME, null, 2) + '\n', 'utf8');

let h = fs.readFileSync(HTML, 'utf8');
// remove any previous broken/half foal fix at end
if (h.includes('[foal popup + price')) {
  const a = h.indexOf('// ═══ foal popup + price');
  if (a >= 0) {
    const end = h.indexOf('</script>', a);
    h = h.slice(0, a) + h.slice(end);
    console.log('removed old foal fix block');
  }
}
// also remove corrupted mid-file if present (born.length in queueUnlock)
if (h.includes("牧場に仔馬が '+born.length")) {
  console.warn('WARNING: mid-file corruption still present — restore backup first');
}

// sync MARKET_ECON
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
      let after = end + 1;
      if (h[after] === ';') after++;
      h = h.slice(0, i) + 'MARKET_ECON = ' + JSON.stringify(ME) + ';' + h.slice(after);
      console.log('MARKET_ECON synced');
    }
  }
}

const css = `
#game-popup-ov{
  display:none; position:fixed; inset:0; z-index:500;
  background:rgba(20,14,6,.55);
  align-items:center; justify-content:center;
}
#game-popup-ov.on{ display:flex; }
#game-popup-box{
  background:var(--paper,#f2ead8);
  border:2px solid var(--gold,#b8860b);
  border-radius:8px;
  padding:18px 22px;
  max-width:420px; width:90%;
  box-shadow:0 8px 28px rgba(0,0,0,.35);
  color:var(--ink,#1a1207);
}
#game-popup-box h3{
  margin:0 0 10px;
  font-family:'Noto Serif JP',serif;
  font-size:16px;
  color:var(--gold,#b8860b);
}
#game-popup-body{ font-size:13px; line-height:1.7; white-space:pre-wrap; margin-bottom:14px; }
#game-popup-ok{
  display:block; width:100%;
  font-family:'Noto Serif JP',serif;
  font-size:14px; font-weight:700;
  padding:10px; border:none; border-radius:4px;
  background:var(--gold,#b8860b); color:#241d11; cursor:pointer;
}
`;
if (!h.includes('#game-popup-ov{')) {
  h = h.replace('</style>', css + '\n</style>');
  console.log('css');
}

const FIX = `
// ═══ foal popup + price ±25% ═══
(function(){
'use strict';
if(window.__foalPopupPriceCap) return;
window.__foalPopupPriceCap = true;

function ensurePopupDom(){
  var ov = document.getElementById('game-popup-ov');
  if(ov) return ov;
  ov = document.createElement('div');
  ov.id = 'game-popup-ov';
  ov.innerHTML = '<div id="game-popup-box"><h3 id="game-popup-title">お知らせ</h3>'+
    '<div id="game-popup-body"></div>'+
    '<button type="button" id="game-popup-ok">OK</button></div>';
  document.body.appendChild(ov);
  document.getElementById('game-popup-ok').onclick = function(){ ov.classList.remove('on'); };
  ov.addEventListener('click', function(ev){ if(ev.target===ov) ov.classList.remove('on'); });
  return ov;
}
window.showGamePopup = function(title, body){
  var ov = ensurePopupDom();
  var t = document.getElementById('game-popup-title');
  var b = document.getElementById('game-popup-body');
  if(t) t.textContent = title || 'お知らせ';
  if(b) b.textContent = body || '';
  ov.classList.add('on');
};
window.flushGamePopup = function(){
  if(gs && gs._pendingGamePopup){
    window.showGamePopup(gs._pendingGamePopup.title, gs._pendingGamePopup.body);
    gs._pendingGamePopup = null;
  }
};

function starOf(hh){
  if(typeof window.displayStar==='function') return window.displayStar(hh.rank);
  if(typeof displayStar==='function') return displayStar(hh.rank);
  return Math.max(1, Math.floor(Number(hh.rank)||1));
}

function wrapOnSeasonChange(){
  var orig = window.onSeasonChange;
  if(typeof orig!=='function'){
    if(typeof onSeasonChange==='function') orig = onSeasonChange;
  }
  if(typeof orig!=='function' || orig.__foalWrapped) return false;
  window.onSeasonChange = function(prevSeason, newSeason){
    var before = {};
    try{ (gs.horses||[]).forEach(function(hh){ before[hh.id]=true; }); }catch(e){}
    var r = orig.apply(this, arguments);
    try{
      if(prevSeason===3 && newSeason===0){
        var born = (gs.horses||[]).filter(function(hh){
          return !before[hh.id] && (hh.source==='birth' || hh.isFoal);
        });
        if(born.length){
          var lines = born.map(function(hh){
            var sex = hh.sex==='f' ? '雌' : '雄';
            return '・' + hh.name + '（' + sex + '・★' + starOf(hh) + '）';
          });
          var msg = '春になりました。\\n牧場に仔馬が ' + born.length + ' 頭、生まれました。\\n\\n' + lines.join('\\n');
          gs._pendingGamePopup = { title: '牧場だより', body: msg };
          setTimeout(function(){ window.flushGamePopup(); }, 450);
          if(typeof showToast==='function') showToast('春：仔馬が ' + born.length + ' 頭生まれました');
        }
      }
    }catch(e){ console.warn('foal popup', e); }
    return r;
  };
  window.onSeasonChange.__foalWrapped = true;
  try{ onSeasonChange = window.onSeasonChange; }catch(e){}
  return true;
}
wrapOnSeasonChange();
setTimeout(wrapOnSeasonChange, 50);
setTimeout(wrapOnSeasonChange, 300);

(function(){
  var orig = window.goToNextTurn;
  if(typeof orig!=='function') return;
  window.goToNextTurn = function(){
    var r = orig.apply(this, arguments);
    setTimeout(function(){
      window.flushGamePopup();
      try{
        if(typeof window.renderRanchHorseList==='function') window.renderRanchHorseList();
      }catch(e){}
    }, 550);
    return r;
  };
})();

// Price: base ±25% only. Low stock => higher price.
if(window.MARKET_ECON){
  window.MARKET_ECON.priceMultMin = 0.75;
  window.MARKET_ECON.priceMultMax = 1.25;
}

window.priceFromStock = function(res){
  var M = window.MARKET_ECON || {};
  var baseB = (M.baseBuy && M.baseBuy[res]) || 20;
  var baseS = (M.baseSell && M.baseSell[res]) || Math.round(baseB * 0.9);
  if(res==='med' || res==='sword' || res==='siege_w'){
    return { buy:999, sell:baseS };
  }
  var cap = (gs.market && gs.market.shopCap && gs.market.shopCap[res]) || 20;
  if(cap < 1) cap = 1;
  var shop = (gs.market && gs.market.shop && gs.market.shop[res]) || 0;
  if(shop < 0) shop = 0;
  var ratio = shop / cap;
  if(ratio > 1) ratio = 1;
  // 0.75 .. 1.25  (empty=1.25 高値, full=0.75 安値)
  var multMin = 0.75, multMax = 1.25;
  var mult = multMax - ratio * (multMax - multMin);
  var buy = Math.max(1, Math.round(baseB * mult));
  var sratio = (M.sellToBuyRatio != null) ? M.sellToBuyRatio : 0.9;
  var baseRatio = baseB > 0 ? baseS / baseB : sratio;
  var useRatio = Math.min(sratio, baseRatio);
  if(useRatio >= 1) useRatio = 0.9;
  var sell = Math.max(1, Math.round(buy * useRatio));
  if(sell >= buy) sell = Math.max(1, buy - 1);
  return { buy:buy, sell:sell };
};

window.recomputePrices = function(savePrev){
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  else if(typeof ensureMarket==='function') ensureMarket();
  if(!gs.market) return;
  if(savePrev){
    gs.market.prevBuy = Object.assign({}, gs.market.priceBuy || {});
  }
  ['iron','wood','niter','herb','food_mat','med'].forEach(function(r){
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
  var M = window.MARKET_ECON || {};
  ['sword','siege_w','med'].forEach(function(r){
    gs.market.priceSell[r] = (M.baseSell && M.baseSell[r]) || gs.market.priceSell[r] || 0;
    gs.market.priceBuy[r] = 999;
  });
};

(function(){
  var prev = window.openCard;
  if(typeof prev!=='function') return;
  window.openCard = function(name){
    var r = prev.apply(this, arguments);
    if(name==='market'){
      try{
        window.recomputePrices(false);
        if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
      }catch(e){}
    }
    return r;
  };
  try{ openCard = window.openCard; }catch(e){}
})();

// After buy/sell, price should reflect new stock (low stock => up)
(function(){
  var prev = window.confirmTrade;
  if(typeof prev!=='function') return;
  window.confirmTrade = function(){
    var r = prev.apply(this, arguments);
    try{
      window.recomputePrices(false);
      if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
    }catch(e){}
    return r;
  };
})();

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    ensurePopupDom();
    wrapOnSeasonChange();
    try{
      if(window.MARKET_ECON){
        window.MARKET_ECON.priceMultMin = 0.75;
        window.MARKET_ECON.priceMultMax = 1.25;
      }
      window.recomputePrices(false);
    }catch(e){}
  }, 120);
});

console.log('[foal popup + price cap 25pct] ready');
})();
`;

// FIX is a template literal in the write file - the \\n in msg will become \n in output which is correct for JS string newlines.
// But we're using write() with content as template - in the file above I used backticks for FIX in the actual write tool content.

// Wait - in the write tool I used const FIX = `...` with \\n - when node runs this file, \\n becomes \n in the string which writes as \n to HTML - good.

const last = h.lastIndexOf('</script>');
if (last < 0) throw new Error('no script end');
h = h.slice(0, last) + FIX + '\n' + h.slice(last);
fs.writeFileSync(HTML, h, 'utf8');

const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m,
  n = 0,
  fail = false;
while ((m = re.exec(h))) {
  const body = m[1];
  if (!body || body.length < 40) continue;
  try {
    new Function(body);
    console.log('OK', n);
  } catch (e) {
    fail = true;
    console.error('FAIL', n, e.message);
  }
  n++;
}
console.log('DONE', { fail, ready: h.includes('[foal popup + price cap 25pct]') });
