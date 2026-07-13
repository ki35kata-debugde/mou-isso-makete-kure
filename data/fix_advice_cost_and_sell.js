/**
 * - 進言コスト: 金300両（market_economy.adviceCostGold）
 * - 生産物（剣・衝車・回復薬）を解禁後に市場で売却可
 * - 馬を牧場から売却（出荷解禁後・つがい中以外）
 * - MARKET_ECON を json から同期
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'mou_isso_v0_6_1.html');
const JSON_PATH = path.join(__dirname, 'market_economy.json');

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_sell_' + Date.now(), h, 'utf8');
const ME = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// ── Sync MARKET_ECON embedded object ──
{
  const re = /MARKET_ECON\s*=\s*\{[\s\S]*?\};\s*\n/;
  const meStr = 'MARKET_ECON = ' + JSON.stringify(ME) + ';\n';
  if (re.test(h)) {
    h = h.replace(re, meStr);
    console.log('MARKET_ECON synced from json');
  } else {
    const i = h.indexOf('MARKET_ECON');
    if (i >= 0) {
      // find first { after MARKET_ECON and matching };
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
        console.log('MARKET_ECON replaced by brace match');
      }
    } else {
      console.warn('MARKET_ECON not found');
    }
  }
}

// ── Market table: add product sell rows after med ──
const prodRows = `
        <tr id="row-prod-sword" class="prod-sell-row" data-item="sword">
          <td>剣★1</td><td id="shop-sword">—</td><td id="inv-sword">0</td>
          <td class="res-price" id="price-sword">売のみ</td>
          <td class="locked">購入不可</td>
          <td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('sword',-1)">−</button><div class="qty-num" id="sell-sword">0</div><button class="qty-btn" onclick="sell('sword',1)">＋</button></div></td>
        </tr>
        <tr id="row-prod-siege_w" class="prod-sell-row" data-item="siege_w">
          <td>衝車★1</td><td id="shop-siege_w">—</td><td id="inv-siege_w">0</td>
          <td class="res-price" id="price-siege_w">売のみ</td>
          <td class="locked">購入不可</td>
          <td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('siege_w',-1)">−</button><div class="qty-num" id="sell-siege_w">0</div><button class="qty-btn" onclick="sell('siege_w',1)">＋</button></div></td>
        </tr>`;

if (!h.includes('id="row-prod-sword"')) {
  // insert before closing </table> of market trade (after sell-med row)
  const medSell = /id="sell-med">0<\/div><button class="qty-btn" onclick="sell\('med',1\)">＋<\/button><\/div><\/td><\/tr>/;
  if (medSell.test(h)) {
    h = h.replace(medSell, (m) => m + prodRows);
    console.log('product sell rows added');
  } else {
    // more flexible
    const re2 = /(<div class="qty-num" id="sell-med">0<\/div>[\s\S]*?<\/tr>)/;
    if (re2.test(h)) {
      h = h.replace(re2, '$1' + prodRows);
      console.log('product sell rows added (flex)');
    } else {
      console.warn('could not insert product rows');
    }
  }
}

// ── CSS for locked product rows / horse sell ──
const css = `
/* product sell rows */
.prod-sell-row.locked-row{opacity:0.4;pointer-events:none}
.prod-sell-row .locked{color:var(--faded);font-size:11px}
button.hs-sell-btn{
  font-size:11px;padding:2px 8px;margin-left:4px;
  background:var(--gold);border:1px solid var(--border);border-radius:3px;cursor:pointer;color:var(--wood);
}
button.hs-sell-btn:disabled{opacity:0.4;cursor:not-allowed}
.ranch-horse-table th:last-child,.ranch-horse-table td:last-child{white-space:nowrap}
.kengen-cost-note{font-size:11px;color:var(--accent);margin:0 0 8px;font-weight:700}
`;
if (!h.includes('button.hs-sell-btn')) {
  h = h.replace('</style>', css + '\n</style>');
  console.log('css sell added');
}

// ── Kengen cost note in HTML ──
if (!h.includes('kengen-cost-note')) {
  h = h.replace(
    '<div class="kengen-note">進言は1つ選べます（次ターンから有効）</div>',
    '<div class="kengen-note">進言は1つ選べます（次ターンから有効）</div>\n  <div class="kengen-cost-note" id="kg-cost-note">費用：金300両（1ターン1回分。選び直しは追加料金なし）</div>'
  );
  console.log('kengen cost note');
}

// ── Runtime patch ──
const FIX = `
// ═══ advice cost + product/horse sell ═══
(function(){
'use strict';
if(window.__adviceSellFix) return;
window.__adviceSellFix = true;

var ME = window.MARKET_ECON || {};
var RAW_KEYS = ['iron','wood','niter','herb','food_mat','med'];
var PROD_KEYS = ['sword','siege_w','med'];
var ALL_TRADE = ['iron','wood','niter','herb','food_mat','med','sword','siege_w'];

function adviceCost(){
  var c = (window.MARKET_ECON && window.MARKET_ECON.adviceCostGold);
  if(c==null) c = 300;
  return c|0;
}

function matLabel(k){
  var L = (window.MARKET_ECON && window.MARKET_ECON.labels) || {};
  if(L[k]) return L[k];
  var fallback = {iron:'鉄',wood:'木材',niter:'硝石',herb:'薬草',food_mat:'兵糧',food:'兵糧',med:'回復薬',sword:'剣★1',siege_w:'衝車★1'};
  return fallback[k]||k;
}

/** 生産物が市場で売れるか（施設が経営で使える＝解禁済み） */
function isProductSellUnlocked(item){
  // 現時点: 工房・薬房は経営フェーズ開始から利用可。将来は unlock フラグを見る
  var meta = (window.MARKET_ECON && window.MARKET_ECON.productSell && window.MARKET_ECON.productSell[item]) || null;
  if(meta && meta.unlockedBy === 'smith'){
    // 工房レシピが存在する＝解禁
    var rs = (typeof CFG!=='undefined' && CFG.recipes_smith) || (window.GAME_DATA && window.GAME_DATA.recipes_smith) || {};
    return !!rs[item] || item==='sword' || item==='siege_w';
  }
  if(meta && meta.unlockedBy === 'pharmacy'){
    var rp = (typeof CFG!=='undefined' && CFG.recipes_pharmacy) || (window.GAME_DATA && window.GAME_DATA.recipes_pharmacy) || {};
    return !!rp[item] || item==='med';
  }
  // default: known products
  if(item==='sword'||item==='siege_w'||item==='med') return true;
  return false;
}
window.isProductSellUnlocked = isProductSellUnlocked;

function stockOf(res){
  if(res==='med') return gs.stock && gs.stock.med || 0;
  if(res==='sword') return gs.stock && gs.stock.sword || 0;
  if(res==='siege_w') return gs.stock && gs.stock.siege_w || 0;
  if(res==='food_mat') return gs.inv && gs.inv.food || 0;
  return gs.inv && gs.inv[res] || 0;
}

function deductStock(res, q){
  if(res==='med') gs.stock.med = Math.max(0, (gs.stock.med||0)-q);
  else if(res==='sword') gs.stock.sword = Math.max(0, (gs.stock.sword||0)-q);
  else if(res==='siege_w') gs.stock.siege_w = Math.max(0, (gs.stock.siege_w||0)-q);
  else if(res==='food_mat') gs.inv.food = Math.max(0, (gs.inv.food||0)-q);
  else gs.inv[res] = Math.max(0, (gs.inv[res]||0)-q);
}

// price for products: fixed baseSell (not shop-ratio) unless recompute includes them
function productSellPrice(res){
  var ME2 = window.MARKET_ECON || {};
  if(gs.market && gs.market.priceSell && gs.market.priceSell[res]!=null)
    return gs.market.priceSell[res];
  return (ME2.baseSell && ME2.baseSell[res]) || 0;
}

// wrap ensureMarket to init product prices
var _ens = window.ensureMarket;
window.ensureMarket = function(){
  if(typeof _ens==='function') _ens();
  else if(typeof ensureMarket==='function' && ensureMarket!==window.ensureMarket) ensureMarket();
  if(!gs.market) return;
  var ME2 = window.MARKET_ECON || {};
  ['sword','siege_w','med'].forEach(function(k){
    if(gs.market.priceSell[k]==null) gs.market.priceSell[k] = (ME2.baseSell&&ME2.baseSell[k])||0;
    if(gs.market.priceBuy[k]==null) gs.market.priceBuy[k] = 999;
    if(gs.market.shop[k]==null) gs.market.shop[k] = 0;
  });
  if(!gs.stock) gs.stock = {sword:0,siege_w:0,med:0};
  if(gs.stock.sword==null) gs.stock.sword=0;
  if(gs.stock.siege_w==null) gs.stock.siege_w=0;
  if(gs.stock.med==null) gs.stock.med=0;
};

// recomputePrices: keep product sell at base (fixed)
var _recomp = window.recomputePrices;
window.recomputePrices = function(savePrev){
  if(typeof _recomp==='function') _recomp(savePrev);
  var ME2 = window.MARKET_ECON || {};
  if(gs.market && gs.market.priceSell){
    ['sword','siege_w','med'].forEach(function(k){
      gs.market.priceSell[k] = (ME2.baseSell&&ME2.baseSell[k])||gs.market.priceSell[k]||0;
      gs.market.priceBuy[k] = 999;
    });
  }
};

// sell override with products
window.sell = function(res, delta){
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  if(typeof window.recomputePrices==='function') window.recomputePrices(false);
  if(PROD_KEYS.indexOf(res)>=0 && !isProductSellUnlocked(res)){
    showToast(matLabel(res)+'はまだ売却解禁されていません');
    return;
  }
  var avail = stockOf(res);
  var nv = Math.max(0, Math.min(avail, (gs.sellQ[res]||0)+delta));
  gs.sellQ = gs.sellQ || {};
  gs.sellQ[res]=nv;
  var el=document.getElementById('sell-'+res); if(el) el.textContent=nv;
  if(typeof updateTradeTotals==='function') updateTradeTotals();
  else if(typeof window.updateTradeTotals==='function') window.updateTradeTotals();
};

window.calcSellIncome = function(){
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  var sum = 0;
  Object.keys(gs.sellQ||{}).forEach(function(r){
    var q = gs.sellQ[r]||0;
    if(!q) return;
    var p;
    if(r==='sword'||r==='siege_w'||r==='med') p = productSellPrice(r);
    else p = (gs.market.priceSell&&gs.market.priceSell[r])||0;
    sum += q * p;
  });
  return sum;
};

window.calcBuyCost = function(){
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  var sum = 0;
  Object.keys(gs.buy||{}).forEach(function(r){
    var q = gs.buy[r]||0;
    if(!q) return;
    if(r==='sword'||r==='siege_w'||r==='med') return; // not buyable
    sum += q * ((gs.market.priceBuy&&gs.market.priceBuy[r])||0);
  });
  return sum;
};

window.calcTradeNet = function(){
  return window.calcSellIncome() - window.calcBuyCost();
};

window.confirmTrade = function(){
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  if(typeof window.recomputePrices==='function') window.recomputePrices(false);
  var net = window.calcTradeNet();
  if(gs.gold + net < 0){ showToast('金が足りません'); return; }
  for(var r in (gs.buy||{})){
    if((gs.buy[r]||0) > (gs.market.shop[r]||0)){ showToast('店の在庫が足りません'); return; }
  }
  // validate sells
  for(var r2 in (gs.sellQ||{})){
    var q2 = gs.sellQ[r2]||0;
    if(q2 > stockOf(r2)){ showToast('所持が足りません'); return; }
    if(PROD_KEYS.indexOf(r2)>=0 && !isProductSellUnlocked(r2)){ showToast('未解禁の品は売れません'); return; }
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
    deductStock(r, q);
    // raw mats return to shop; products do not stock the shop
    if(r!=='med' && r!=='sword' && r!=='siege_w'){
      var cap = gs.market.shopCap[r]||20;
      gs.market.shop[r] = Math.min(cap, (gs.market.shop[r]||0) + q);
    }
  });
  gs.buy={}; gs.sellQ={};
  ALL_TRADE.forEach(function(r){
    ['buy-','sell-'].forEach(function(pre){
      var e=document.getElementById(pre+r); if(e) e.textContent=0;
    });
  });
  if(gs.market) gs.market.prevBuy = Object.assign({}, gs.market.priceBuy);
  if(typeof window.recomputePrices==='function') window.recomputePrices(false);
  if(typeof updateTradeTotals==='function') updateTradeTotals();
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updateInvDisplay==='function') updateInvDisplay();
  if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
  showToast('売買を確定しました');
};

// refreshMarketUI: product rows
var _rmui = window.refreshMarketUI;
window.refreshMarketUI = function(){
  if(typeof _rmui==='function') _rmui();
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  PROD_KEYS.forEach(function(r){
    if(r==='med'){
      // already handled; still refresh inv
      var invEl = document.getElementById('inv-med');
      if(invEl) invEl.textContent = String(gs.stock.med||0);
      var priceEl = document.getElementById('price-med');
      if(priceEl) priceEl.textContent = '売'+productSellPrice('med')+'両';
      return;
    }
    var row = document.getElementById('row-prod-'+r);
    var unlocked = isProductSellUnlocked(r);
    if(row){
      row.classList.toggle('locked-row', !unlocked);
      row.style.display = unlocked ? '' : 'none';
    }
    var invEl2 = document.getElementById('inv-'+r);
    if(invEl2) invEl2.textContent = String(stockOf(r));
    var shopEl = document.getElementById('shop-'+r);
    if(shopEl) shopEl.textContent = '—';
    var priceEl2 = document.getElementById('price-'+r);
    if(priceEl2) priceEl2.textContent = unlocked ? ('売'+productSellPrice(r)+'両') : '未解禁';
  });
  var note = document.getElementById('kg-cost-note');
  if(note) note.textContent = '費用：金'+adviceCost()+'両（1ターン1回分。選び直しは追加料金なし／市場・工房・薬房の操作は無料）';
};

// ── 進言コスト（成功して選択が確定したときだけ課金。1ターン1回） ──
var _kgPick = window.kgPick;
window.kgPick = function(type, val, btn){
  try{
    if(type==='kenjou'){ showToast('献上は廃止されました'); return; }
    gs.kengen = gs.kengen || {shingen:null, kenjou:null};
    var cost = adviceCost();
    var paidBefore = !!gs.kengen.paidThisTurn;
    if(type==='shingen' && val && !paidBefore){
      if((gs.gold||0) < cost){
        showToast('進言には金'+cost+'両が必要です（所持'+(gs.gold||0)+'両）');
        return;
      }
    }
    if(typeof _kgPick==='function') _kgPick(type, val, btn);
    // ロック等で選ばれなかった場合は課金しない
    if(type==='shingen' && val && gs.kengen && gs.kengen.shingen===val && !paidBefore && !gs.kengen.paidThisTurn){
      gs.gold = (gs.gold||0) - cost;
      gs.kengen.paidThisTurn = true;
      if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
      showToast('進言の費用 '+cost+'両 を納めました');
    }
  }catch(e){
    console.error('kgPick cost', e);
    if(typeof _kgPick==='function') try{ _kgPick(type, val, btn); }catch(e2){}
  }
};

// reset paid flag on turn advance (after advice applied)
(function(){
  var orig = window.goToNextTurn;
  if(!orig) return;
  window.goToNextTurn = function(){
    var r = orig.apply(this, arguments);
    try{
      if(gs.kengen) gs.kengen.paidThisTurn = false;
    }catch(e){}
    return r;
  };
})();

// ── 馬売却 ──
function horseSellPrice(hh){
  var st = (typeof statsForRank==='function') ? statsForRank(hh.rank) : {star: Math.floor(hh.rank||1)};
  var star = st.star || Math.max(1, Math.floor(hh.rank||1));
  var table = (window.MARKET_ECON && window.MARKET_ECON.horseSellByStar) || {};
  return table[String(star)] || table[star] || (star*80);
}
window.horseSellPrice = horseSellPrice;

window.sellHorse = function(horseId){
  try{
    if(typeof ensureHorseState==='function') ensureHorseState();
    if(!gs.ranch || !gs.ranch.shippingUnlocked){
      showToast('馬の売却は最初の秋以降（出荷解禁後）です');
      return;
    }
    var hh = (gs.horses||[]).find(function(x){ return x.id===horseId; });
    if(!hh){ showToast('馬が見つかりません'); return; }
    if(hh.status==='paired'){ showToast('つがい中の馬は売れません'); return; }
    if(hh.status==='transit'){ showToast('輸送中の馬は売れません'); return; }
    if(hh.status!=='ranch'){ showToast('牧場にいる馬だけ売れます'); return; }
    var price = horseSellPrice(hh);
    if(!confirm(hh.name+'（★'+((typeof statsForRank==='function'?statsForRank(hh.rank).star:Math.floor(hh.rank)))+'）を '+price+'両 で売りますか？')) return;
    gs.horses = gs.horses.filter(function(x){ return x.id!==horseId; });
    // clear pair if any
    if(gs.ranch && gs.ranch.pairs){
      gs.ranch.pairs = gs.ranch.pairs.filter(function(p){
        return p.m!==horseId && p.f!==horseId;
      });
    }
    gs.gold = (gs.gold||0) + price;
    if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
    if(typeof renderRanchHorseList==='function') renderRanchHorseList();
    if(typeof window.renderRanchHorseList==='function') window.renderRanchHorseList();
    if(typeof refreshRanchUI==='function') refreshRanchUI();
    showToast(hh.name+'を売却（+'+price+'両）');
  }catch(e){
    console.error('sellHorse', e);
    showToast('売却に失敗しました');
  }
};

// enhance ranch list with sell button
var _rr = window.renderRanchHorseList;
window.renderRanchHorseList = function(){
  if(typeof ensureHorseState==='function') ensureHorseState();
  var box = document.getElementById('ranch-horse-list');
  if(!box){
    if(typeof _rr==='function') return _rr();
    return;
  }
  var list = (gs.horses||[]).filter(function(x){
    return x.status==='ranch'||x.status==='paired'||x.status==='transit';
  });
  if(!list.length){
    box.innerHTML = '<div class="ranch-empty">まだ馬がいません。</div>';
    return;
  }
  var canShip = !!(gs.ranch && gs.ranch.shippingUnlocked);
  var html = '<table class="ranch-horse-table"><thead><tr>'+
    '<th>名前</th><th>性</th><th>★</th><th>速</th><th>容</th><th>性質</th><th>状態</th><th>売却</th></tr></thead><tbody>';
  list.forEach(function(hh){
    var st = (typeof statsForRank==='function') ? statsForRank(hh.rank) : {star:Math.floor(hh.rank||1),speed:'?',capacity:'?'};
    var statusLabel = hh.status;
    if(typeof S==='function') statusLabel = S('status_'+hh.status, hh.status);
    else {
      var map = {ranch:'牧場',paired:'つがい',transit:'輸送中'};
      statusLabel = map[hh.status]||hh.status;
    }
    var price = horseSellPrice(hh);
    var canSell = canShip && hh.status==='ranch';
    var btn = canSell
      ? ('<button type="button" class="hs-sell-btn" onclick="sellHorse(\\''+String(hh.id).replace(/'/g,'')+'\\')">'+price+'両</button>')
      : '<button type="button" class="hs-sell-btn" disabled title="'+(canShip?'売却不可':'出荷解禁後')+'">—</button>';
    html += '<tr><td class="name">'+hh.name+'</td><td>'+(hh.sex==='f'?'雌':'雄')+
      '</td><td>'+st.star+'</td><td>'+st.speed+'</td><td>'+st.capacity+
      '</td><td>'+(hh.trait||'—')+'</td><td>'+statusLabel+'</td><td>'+btn+'</td></tr>';
  });
  html += '</tbody></table>';
  if(!canShip){
    html += '<div style="font-size:11px;color:var(--faded);margin-top:6px">馬の売却は最初の秋（出荷解禁）以降です。つがい中・輸送中は売れません。</div>';
  }
  box.innerHTML = html;
};

console.log('[advice+sell] ready cost='+adviceCost());
})();
`;

if (!h.includes('[advice+sell] ready')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + FIX + '\n' + h.slice(last);
  console.log('advice+sell fix inserted');
} else {
  const a = h.indexOf('// ═══ advice cost + product/horse sell');
  if (a >= 0) {
    const b = h.indexOf('[advice+sell] ready', a);
    const c = h.indexOf('})();', b);
    h = h.slice(0, a) + FIX + h.slice(c + 5);
    console.log('advice+sell fix replaced');
  }
}

fs.writeFileSync(HTML, h, 'utf8');

// syntax check scripts
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m, n = 0, fail = false;
while ((m = re.exec(h))) {
  const body = m[1];
  if (!body || body.length < 20) continue;
  if (body.includes('src=')) continue;
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
  cost: ME.adviceCostGold,
  swordRow: h.includes('row-prod-sword'),
  sellHorse: h.includes('sellHorse'),
  sync: h.includes('"adviceCostGold":300') || h.includes('"adviceCostGold": 300') || h.includes('adviceCostGold'),
});
