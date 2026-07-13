/**
 * Ensure ranch list sell buttons always show:
 * - rebind bare renderRanchHorseList → window version
 * - call on openCard('ranch')
 * - optional: allow sell even before first autumn if cfg says so (default still shippingUnlocked)
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_ranch_sell_' + Date.now(), h, 'utf8');

const FIX = `
// ═══ ranch sell bind (个体列表出售) ═══
(function(){
'use strict';
if(window.__ranchSellBind) return;
window.__ranchSellBind = true;

// 価格表（market_economy.json の horseSellByStar と同じ）
function horseSellPrice(hh){
  var st = (typeof statsForRank==='function') ? statsForRank(hh.rank) : {star: Math.max(1, Math.floor(hh.rank||1))};
  var star = st.star || Math.max(1, Math.floor(hh.rank||1));
  var table = (window.MARKET_ECON && window.MARKET_ECON.horseSellByStar) || {1:80,2:150,3:280,4:480,5:800};
  return table[String(star)] != null ? table[String(star)] : (table[star] != null ? table[star] : star*80);
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
    var star = (typeof statsForRank==='function') ? statsForRank(hh.rank).star : Math.floor(hh.rank||1);
    var price = horseSellPrice(hh);
    if(!confirm(hh.name+'（★'+star+'）を '+price+'両 で売りますか？\\n※市場ではなく牧場からの売却です')) return;
    gs.horses = gs.horses.filter(function(x){ return x.id!==horseId; });
    if(gs.ranch && gs.ranch.pairs){
      gs.ranch.pairs = (gs.ranch.pairs||[]).filter(function(p){
        return p && p.m!==horseId && p.f!==horseId && p.male!==horseId && p.female!==horseId;
      });
    }
    // つがい状態の相手が残っていれば ranch に戻す（安全側）
    (gs.horses||[]).forEach(function(x){
      if(x.status==='paired' && x.pairWith===horseId){
        x.status='ranch';
        delete x.pairWith;
      }
    });
    gs.gold = (gs.gold||0) + price;
    if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
    // 必ず売却付きリストを再描画
    if(typeof window.renderRanchHorseList==='function') window.renderRanchHorseList();
    try{ renderRanchHorseList = window.renderRanchHorseList; }catch(e){}
    showToast(hh.name+'を売却（+'+price+'両）');
  }catch(e){
    console.error('sellHorse', e);
    showToast('売却に失敗しました');
  }
};

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
    '<th>名前</th><th>性</th><th>★</th><th>速</th><th>容</th><th>性質</th><th>状態</th><th>売却</th></tr></thead><tbody>';
  list.forEach(function(hh){
    var st = (typeof statsForRank==='function') ? statsForRank(hh.rank) : {star:Math.floor(hh.rank||1),speed:'?',capacity:'?'};
    var map = {ranch:'牧場',paired:'つがい',transit:'輸送中'};
    var statusLabel = map[hh.status]||hh.status;
    if(typeof S==='function'){
      try{ statusLabel = S('status_'+hh.status, statusLabel); }catch(e){}
    }
    var price = horseSellPrice(hh);
    var canSell = canShip && hh.status==='ranch';
    var tip = !canShip ? '出荷解禁後（最初の秋以降）' : (hh.status!=='ranch' ? '牧場にいるときだけ売却可' : (price+'両で売却'));
    var btn = canSell
      ? ('<button type="button" class="hs-sell-btn" onclick="sellHorse(\\''+String(hh.id).replace(/'/g,'')+'\\')">'+price+'両</button>')
      : ('<button type="button" class="hs-sell-btn" disabled title="'+tip+'">—</button>');
    html += '<tr><td class="name">'+hh.name+'</td><td>'+(hh.sex==='f'?'雌':'雄')+
      '</td><td>'+st.star+'</td><td>'+st.speed+'</td><td>'+st.capacity+
      '</td><td>'+(hh.trait||'—')+'</td><td>'+statusLabel+'</td><td>'+btn+'</td></tr>';
  });
  html += '</tbody></table>';
  if(!canShip){
    html += '<div style="font-size:11px;color:var(--faded);margin-top:6px">馬の売却は牧場の個体リストから行います。最初の秋（出荷解禁）以降に「売却」ボタンが有効になります。つがい中・輸送中は売れません。</div>';
  }else{
    html += '<div style="font-size:11px;color:var(--faded);margin-top:6px">売却は市場ではなく、この牧場リストから行います（★別の定価）。</div>';
  }
  box.innerHTML = html;
};

// 同一スクリプト内の裸の renderRanchHorseList() 呼び出しも新実装を使う
try{ renderRanchHorseList = window.renderRanchHorseList; }catch(e){}

// openCard('ranch') で必ず再描画
(function(){
  var prev = window.openCard;
  if(typeof prev!=='function') return;
  window.openCard = function(name){
    var r = prev.apply(this, arguments);
    if(name==='ranch'){
      try{ renderRanchHorseList = window.renderRanchHorseList; }catch(e){}
      if(typeof window.renderRanchHorseList==='function') window.renderRanchHorseList();
    }
    return r;
  };
  try{ openCard = window.openCard; }catch(e){}
})();

// DOM 後でも再バインド
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    try{ renderRanchHorseList = window.renderRanchHorseList; }catch(e){}
    if(typeof window.renderRanchHorseList==='function') window.renderRanchHorseList();
  }, 100);
});

console.log('[ranch sell bind] ready');
})();
`;

if (!h.includes('[ranch sell bind] ready')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + FIX + '\n' + h.slice(last);
  console.log('inserted ranch sell bind');
} else {
  const a = h.indexOf('// ═══ ranch sell bind');
  const b = h.indexOf('[ranch sell bind] ready', a);
  const c = h.indexOf('})();', b);
  h = h.slice(0, a) + FIX + h.slice(c + 5);
  console.log('replaced ranch sell bind');
}

// CSS if missing
if (!h.includes('button.hs-sell-btn')) {
  const css = `
button.hs-sell-btn{
  font-size:11px;padding:2px 8px;margin-left:4px;
  background:var(--gold);border:1px solid var(--border);border-radius:3px;cursor:pointer;color:var(--wood);
}
button.hs-sell-btn:disabled{opacity:0.4;cursor:not-allowed}
.ranch-horse-table th:last-child,.ranch-horse-table td:last-child{white-space:nowrap}
`;
  h = h.replace('</style>', css + '\n</style>');
  console.log('css added');
}

fs.writeFileSync(HTML, h, 'utf8');

// syntax
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m, n = 0, fail = false;
while ((m = re.exec(h))) {
  const body = m[1];
  if (!body || body.length < 40) continue;
  try { new Function(body); console.log('OK', n); }
  catch (e) { console.error('FAIL', n, e.message); fail = true; }
  n++;
}
console.log('DONE', { fail, bind: h.includes('[ranch sell bind] ready') });
