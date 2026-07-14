/**
 * 弩★2・投石機★3 の生産実装
 * - レシピ: 弩★2=鉄1+木材1 / 投石機★3=鉄1+木材3（工房枠を共有）
 * - 解禁: 弩=兵器or武器ルートN1クリア / 投石機=兵器ルートN2クリア（queueUnlockでポップアップ）
 * - アイコン: assets/assets の Wepon_★1/★2, Ammunition_★1/★3, potion_★1 を Base64 埋め込み（ITEM_ICONS）
 * - 市場: 売りのみ行を追加（sword/siege_w と同パターン）
 * 適用: HTML末尾に IIFE 追記。マーカー [crossbow+catapult] ready
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'mou_isso_v0_6_1.html');

let h = fs.readFileSync(HTML, 'utf8');
if (h.includes('[crossbow+catapult] ready')) {
  console.log('already applied, skip');
  process.exit(0);
}
fs.writeFileSync(HTML + '.bak_crossbow_' + Date.now(), h, 'utf8');

// ---- icons ----
const iconDir = path.join(ROOT, 'assets', 'assets');
function b64(name) {
  const p = path.join(iconDir, name);
  if (!fs.existsSync(p)) { console.error('missing icon:', p); process.exit(1); }
  return 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
}
const ICONS = {
  sword: b64('Wepon_★1.png'),
  crossbow2: b64('Wepon_★2.png'),
  siege_w: b64('Ammunition_★1.png'),
  catapult: b64('Ammunition_★3.png'),
  med: b64('potion_★1.png')
};

const patch = `
<script>
// ═══ crossbow + catapult production ═══
window.ITEM_ICONS = {${Object.keys(ICONS).map(k => JSON.stringify(k) + ':' + JSON.stringify(ICONS[k])).join(',')}};
(function(){
'use strict';
if(window.__crossbowCatapult) return;
window.__crossbowCatapult = true;

var NEW_ITEMS = ['crossbow2','catapult'];
var RECIPES = {
  sword:    { iron:1 },
  siege_w:  { wood:2 },
  crossbow2:{ iron:1, wood:1 },
  catapult: { iron:1, wood:3 },
  med:      { herb:1 }
};
var LABELS = { crossbow2:'弩 ★2', catapult:'投石機 ★3' };
var RECIPE_TEXT = { crossbow2:'鉄×1 木材×1', catapult:'鉄×1 木材×3' };

function ensureNewItems(){
  if(typeof gs==='undefined') return;
  gs.stock = gs.stock || {};
  gs.inProd = gs.inProd || {};
  gs.prod = gs.prod || {};
  gs.unlockedTech = gs.unlockedTech || {};
  NEW_ITEMS.forEach(function(k){
    if(gs.stock[k]==null) gs.stock[k]=0;
    if(gs.inProd[k]==null) gs.inProd[k]=0;
    if(gs.prod[k]==null) gs.prod[k]=0;
  });
}

function clearedHas(route, node){
  return !!(gs.cleared && gs.cleared[route] && gs.cleared[route].indexOf(node)>=0);
}
function isTechUnlocked(item){
  if(typeof gs==='undefined') return false;
  ensureNewItems();
  if(item==='crossbow2') return !!gs.unlockedTech.crossbow2 || clearedHas('siege',1) || clearedHas('weapon',1);
  if(item==='catapult')  return !!gs.unlockedTech.catapult  || clearedHas('siege',2);
  return true;
}
window.isTechUnlocked = isTechUnlocked;

// 解禁チェック（初回到達時にポップアップ＋フラグ保存）
function checkTechUnlocks(){
  if(typeof gs==='undefined') return;
  ensureNewItems();
  if(!gs.unlockedTech.crossbow2 && (clearedHas('siege',1)||clearedHas('weapon',1))){
    gs.unlockedTech.crossbow2 = true;
    if(typeof queueUnlock==='function') queueUnlock('unlock_crossbow2','炉子が弩の図面を完成させた！工房で弩★2を生産できます。');
    else if(typeof window.queueUnlock==='function') window.queueUnlock('unlock_crossbow2','炉子が弩の図面を完成させた！工房で弩★2を生産できます。');
  }
  if(!gs.unlockedTech.catapult && clearedHas('siege',2)){
    gs.unlockedTech.catapult = true;
    if(typeof queueUnlock==='function') queueUnlock('unlock_catapult','投石機の図面が届いた！工房で投石機★3を生産できます。');
    else if(typeof window.queueUnlock==='function') window.queueUnlock('unlock_catapult','投石機の図面が届いた！工房で投石機★3を生産できます。');
  }
  // 結果フェーズ中に解禁された場合は即モーダル表示（次フェーズ持ち越し防止）
  try{
    if(gs.phase==='result' && typeof showPendingUnlockModal==='function') showPendingUnlockModal();
  }catch(e){}
  refreshSmithRows();
}
if(typeof UI_STRINGS!=='undefined'){
  UI_STRINGS.unlock_crossbow2 = '炉子が弩の図面を完成させた！工房で弩★2を生産できます。';
  UI_STRINGS.unlock_catapult = '投石機の図面が届いた！工房で投石機★3を生産できます。';
}

// ---- stockOf / takeStock ----
var __so = window.stockOf || (typeof stockOf==='function'?stockOf:null);
window.stockOf = function(id){
  if(NEW_ITEMS.indexOf(id)>=0){ ensureNewItems(); return gs.stock[id]||0; }
  return __so ? __so(id) : 0;
};
try{ stockOf = window.stockOf; }catch(e){}
var __ts = window.takeStock || (typeof takeStock==='function'?takeStock:null);
window.takeStock = function(id,q){
  if(NEW_ITEMS.indexOf(id)>=0){ ensureNewItems(); gs.stock[id]=Math.max(0,(gs.stock[id]||0)-q); return; }
  if(__ts) __ts(id,q);
};
try{ takeStock = window.takeStock; }catch(e){}

// ---- produce（工房グループ拡張・全面再実装） ----
window.produce = function(item, delta){
  if(typeof ensureMarket==='function') ensureMarket();
  ensureNewItems();
  var isPharma = item==='med';
  if(!isPharma && NEW_ITEMS.indexOf(item)>=0 && !isTechUnlocked(item)) return;
  var cap = isPharma ? pharmCap() : smithCap();
  var group = isPharma ? ['med'] : ['sword','siege_w','crossbow2','catapult'];
  var used = group.reduce(function(s,k){ return s+(gs.prod[k]||0); }, 0);
  var nv = (gs.prod[item]||0) + delta;
  if(nv<0 || used+delta>cap) return;
  // 材料合計チェック（group全体で共有材料を取り合う）
  var need = { iron:0, wood:0, herb:0 };
  group.forEach(function(k){
    var q = (gs.prod[k]||0) + (k===item?delta:0);
    var r = RECIPES[k]||{};
    need.iron += q*(r.iron||0);
    need.wood += q*(r.wood||0);
    need.herb += q*(r.herb||0);
  });
  if(need.iron>(gs.inv.iron||0) || need.wood>(gs.inv.wood||0) || need.herb>(gs.inv.herb||0)) return;
  gs.prod[item]=nv;
  var set=function(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; };
  set('prod-'+item, nv);
  set('prod-smith-used', ['sword','siege_w','crossbow2','catapult'].reduce(function(s,k){return s+(gs.prod[k]||0);},0));
  set('prod-pharm-used', gs.prod.med||0);
  set('prod-smith-cap', smithCap());
  set('prod-pharm-cap', pharmCap());
  set('prod-iron-cost', need.iron);
  set('prod-wood-cost', need.wood);
  set('prod-herb-cost', need.herb);
};
try{ produce = window.produce; }catch(e){}

// ---- goToTransport: 新品目の材料消費＋仕掛品化（基底は既存品目のみ扱う） ----
var __gtt = window.goToTransport || (typeof goToTransport==='function'?goToTransport:null);
window.goToTransport = function(){
  ensureNewItems();
  try{
    NEW_ITEMS.forEach(function(k){
      var q = gs.prod[k]||0;
      if(!q) return;
      var r = RECIPES[k]||{};
      gs.inv.iron = Math.max(0,(Number(gs.inv.iron)||0) - q*(r.iron||0));
      gs.inv.wood = Math.max(0,(Number(gs.inv.wood)||0) - q*(r.wood||0));
      gs.inProd[k] = (gs.inProd[k]||0) + q;
      gs.prod[k] = 0;
    });
  }catch(e){ console.warn('crossbow gtt', e); }
  return __gtt ? __gtt.apply(this, arguments) : undefined;
};
try{ goToTransport = window.goToTransport; }catch(e){}

// ---- goToResult: 完成 ----
var __gtr = window.goToResult || (typeof goToResult==='function'?goToResult:null);
window.goToResult = function(){
  ensureNewItems();
  try{
    NEW_ITEMS.forEach(function(k){
      if(gs.inProd[k]>0){
        gs.stock[k] = (gs.stock[k]||0) + gs.inProd[k];
        gs.inProd[k] = 0;
      }
    });
    checkTechUnlocks(); // クリア済み判定は前ターンの輸送到着時に確定しているため、結果表示の前に解禁を積む
  }catch(e){ console.warn('crossbow gtr', e); }
  var r = __gtr ? __gtr.apply(this, arguments) : undefined;
  try{ checkTechUnlocks(); }catch(e){}
  return r;
};
try{ goToResult = window.goToResult; }catch(e){}

// ---- goToNextTurn: prod リセット後にキー再付与＋解禁チェック ----
var __gnt = window.goToNextTurn || (typeof goToNextTurn==='function'?goToNextTurn:null);
window.goToNextTurn = function(){
  var r = __gnt ? __gnt.apply(this, arguments) : undefined;
  ensureNewItems();
  try{ checkTechUnlocks(); }catch(e){}
  return r;
};
try{ goToNextTurn = window.goToNextTurn; }catch(e){}

// ---- 工房テーブル行の注入 ----
function iconTd(id){
  var src = window.ITEM_ICONS && window.ITEM_ICONS[id];
  return src ? '<img src="'+src+'" alt="" class="item-icon-img">' : '';
}
function injectSmithRows(){
  var card = document.getElementById('card-smith');
  if(!card) return;
  var table = card.querySelector('.mgmt-table');
  if(!table) return;
  // 既存行（剣・衝車）の品目セルにアイコン
  table.querySelectorAll('tr').forEach(function(tr){
    var td = tr.querySelector('td');
    if(!td || td.querySelector('.item-icon-img')) return;
    var t = td.textContent||'';
    if(t.indexOf('剣')===0) td.innerHTML = iconTd('sword')+td.innerHTML;
    else if(t.indexOf('衝車')===0) td.innerHTML = iconTd('siege_w')+td.innerHTML;
  });
  // 薬房の回復薬にもアイコン
  var pc = document.getElementById('card-pharmacy');
  if(pc){
    pc.querySelectorAll('.mgmt-table tr').forEach(function(tr){
      var td = tr.querySelector('td');
      if(!td || td.querySelector('.item-icon-img')) return;
      if((td.textContent||'').indexOf('回復薬')===0) td.innerHTML = iconTd('med')+td.innerHTML;
    });
  }
  // 新規行（未追加なら）
  NEW_ITEMS.forEach(function(k){
    if(document.getElementById('smith-row-'+k)) return;
    var tr = document.createElement('tr');
    tr.id = 'smith-row-'+k;
    tr.style.display = 'none';
    tr.innerHTML = '<td>'+iconTd(k)+LABELS[k]+'</td>'+
      '<td><b id="stk-'+k+'">0</b></td>'+
      '<td class="res-price">'+RECIPE_TEXT[k]+'</td>'+
      '<td>鉄：<span id="smith-mat-iron-'+k+'">0</span> 木：<span id="smith-mat-wood-'+k+'">0</span></td>'+
      '<td><div class="qty-ctrl"><button class="qty-btn" onclick="produce(\\''+k+'\\',-1)">−</button><div class="qty-num" id="prod-'+k+'">0</div><button class="qty-btn" onclick="produce(\\''+k+'\\',1)">＋</button></div></td>';
    table.appendChild(tr);
  });
  refreshSmithRows();
}
function refreshSmithRows(){
  ensureNewItems();
  NEW_ITEMS.forEach(function(k){
    var tr = document.getElementById('smith-row-'+k);
    if(tr) tr.style.display = isTechUnlocked(k) ? '' : 'none';
    var st = document.getElementById('stk-'+k);
    if(st) st.textContent = gs.stock[k]||0;
    var mi = document.getElementById('smith-mat-iron-'+k);
    if(mi) mi.textContent = gs.inv.iron||0;
    var mw = document.getElementById('smith-mat-wood-'+k);
    if(mw) mw.textContent = gs.inv.wood||0;
    var pd = document.getElementById('prod-'+k);
    if(pd) pd.textContent = gs.prod[k]||0;
  });
}
var __uid = window.updateInvDisplay || (typeof updateInvDisplay==='function'?updateInvDisplay:null);
window.updateInvDisplay = function(){
  if(__uid) __uid.apply(this, arguments);
  try{ refreshSmithRows(); refreshMarketNewRows(); }catch(e){}
};
try{ updateInvDisplay = window.updateInvDisplay; }catch(e){}

// ---- 市場: 売りのみ行の注入 ----
function injectMarketRows(){
  var table = document.getElementById('market-table');
  if(!table) return;
  NEW_ITEMS.forEach(function(k){
    if(document.getElementById('row-prod-'+k)) return;
    var tr = document.createElement('tr');
    tr.id = 'row-prod-'+k;
    tr.className = 'prod-sell-row';
    tr.setAttribute('data-item', k);
    tr.style.display = 'none';
    tr.innerHTML = '<td>'+iconTd(k)+LABELS[k]+'</td><td id="shop-'+k+'">—</td><td id="inv-'+k+'">0</td>'+
      '<td class="res-price" id="price-'+k+'">売のみ</td>'+
      '<td class="locked">購入不可</td>'+
      '<td><div class="qty-ctrl"><button class="qty-btn" onclick="sell(\\''+k+'\\',-1)">−</button><div class="qty-num" id="sell-'+k+'">0</div><button class="qty-btn" onclick="sell(\\''+k+'\\',1)">＋</button></div></td>';
    var anchor = document.getElementById('row-prod-siege_w');
    if(anchor && anchor.parentNode) anchor.parentNode.insertBefore(tr, anchor.nextSibling);
    else table.appendChild(tr);
  });
}
function refreshMarketNewRows(){
  if(typeof gs==='undefined') return;
  ensureNewItems();
  var M = window.MARKET_ECON || {};
  NEW_ITEMS.forEach(function(k){
    var tr = document.getElementById('row-prod-'+k);
    if(tr) tr.style.display = isTechUnlocked(k) ? '' : 'none';
    var inv = document.getElementById('inv-'+k);
    if(inv) inv.textContent = gs.stock[k]||0;
    var pr = document.getElementById('price-'+k);
    if(pr){
      var s = (gs.market&&gs.market.priceSell&&gs.market.priceSell[k]) || (M.baseSell&&M.baseSell[k]) || 0;
      pr.textContent = s ? ('売'+s+'両') : '売のみ';
    }
  });
}
// 売却額（productSellPrice は sword/siege_w/med 固定のため calcSellIncome をラップ）
var __csi = window.calcSellIncome;
if(typeof __csi==='function'){
  window.calcSellIncome = function(){
    var sum = __csi.apply(this, arguments);
    var M = window.MARKET_ECON || {};
    NEW_ITEMS.forEach(function(k){
      var q = (gs.sellQ&&gs.sellQ[k])||0;
      if(!q) return;
      // __csi 側は productSellPrice 非対応品目を priceSell で拾う可能性があるため二重計上を避ける
      var already = (gs.market&&gs.market.priceSell&&gs.market.priceSell[k])||0;
      var base = (M.baseSell&&M.baseSell[k])||0;
      if(!already && base) sum += q*base;
    });
    return sum;
  };
}
// recomputePrices: 新品目の売値を baseSell に固定
var __rp = window.recomputePrices;
if(typeof __rp==='function'){
  window.recomputePrices = function(savePrev){
    var r = __rp.apply(this, arguments);
    try{
      var M = window.MARKET_ECON || {};
      if(gs.market && gs.market.priceSell){
        NEW_ITEMS.forEach(function(k){
          gs.market.priceSell[k] = (M.baseSell&&M.baseSell[k]) || gs.market.priceSell[k] || 0;
          if(gs.market.priceBuy) gs.market.priceBuy[k] = 999;
        });
      }
    }catch(e){}
    return r;
  };
  try{ recomputePrices = window.recomputePrices; }catch(e){}
}

// ---- 輸送品目行にアイコン ----
var __eou = window.ensureOrderUI;
if(typeof __eou==='function'){
  window.ensureOrderUI = function(key){
    var r = __eou.apply(this, arguments);
    try{
      document.querySelectorAll('#titems-'+key+' .tp-item-line').forEach(function(line){
        if(line.querySelector('.item-icon-img')) return;
        var id = line.getAttribute('data-item');
        var src = window.ITEM_ICONS && window.ITEM_ICONS[id];
        if(!src) return;
        var img = document.createElement('img');
        img.src = src; img.className='item-icon-img'; img.alt='';
        line.insertBefore(img, line.firstChild);
      });
    }catch(e){}
    return r;
  };
  try{ ensureOrderUI = window.ensureOrderUI; }catch(e){}
}

// ---- 結果フェーズ: 生産中/完成表示 ----
var __brs = window.buildResultScreen || (typeof buildResultScreen==='function'?buildResultScreen:null);
if(__brs){
  window.buildResultScreen = function(){
    var r = __brs.apply(this, arguments);
    try{
      ensureNewItems();
      var log = document.getElementById('result-log');
      if(log){
        NEW_ITEMS.forEach(function(k){
          if((gs.stock[k]||0)>0 || (gs.inProd[k]||0)>0){
            var d = document.createElement('div');
            d.className = 'log-line log-info show';
            var extra = (gs.inProd[k]||0)>0 ? ('・生産中'+gs.inProd[k]+'（来T完成）') : '';
            d.textContent = '⚒ '+LABELS[k]+'：在庫'+(gs.stock[k]||0)+extra;
            log.appendChild(d);
          }
        });
      }
    }catch(e){}
    return r;
  };
  try{ buildResultScreen = window.buildResultScreen; }catch(e){}
}

// ---- CSS ----
var st = document.createElement('style');
st.textContent = '.item-icon-img{width:26px;height:26px;object-fit:contain;vertical-align:middle;margin-right:4px;border-radius:4px;}'+
  '.tp-item-line .item-icon-img{width:22px;height:22px;}';
document.head.appendChild(st);

// ---- boot ----
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    try{
      ensureNewItems();
      injectSmithRows();
      injectMarketRows();
      checkTechUnlocks();
      refreshMarketNewRows();
    }catch(e){ console.warn('crossbow boot', e); }
  }, 150);
});
if(document.readyState!=='loading'){
  setTimeout(function(){
    try{ ensureNewItems(); injectSmithRows(); injectMarketRows(); checkTechUnlocks(); refreshMarketNewRows(); }catch(e){}
  }, 150);
}

console.log('[crossbow+catapult] ready');
})();
</script>
`;

// insert before </body>
if (h.includes('</body>')) h = h.replace('</body>', patch + '</body>');
else h += patch;

// syntax check
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m, fail = false;
while ((m = re.exec(h))) {
  const body = m[1];
  if (!body || body.length < 20) continue;
  if (/^\s*src\s*=/i.test(m[0])) continue;
  try { new Function(body); } catch (e) { fail = true; console.error('script FAIL:', e.message); }
}
if (fail) { console.error('syntax errors, NOT writing'); process.exit(1); }
fs.writeFileSync(HTML, h, 'utf8');
console.log('DONE: crossbow+catapult applied');
