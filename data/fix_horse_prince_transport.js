/**
 * 馬王子輸送:
 *  - N0 手渡しのまま
 *  - N1以降: 手段なし。馬一覧から選んで送るのみ（自走）
 * 他王子:
 *  - 手段「馬」を廃止（選択肢から削除）
 *  - 馬車: 馬N2突破 + 荷車解禁、速2・積載2
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_horse_prince_tp_' + Date.now(), h, 'utf8');

const css = `
.horse-send-box{
  margin:8px 0 12px;
  padding:10px 12px;
  background:var(--panel,#ece3cc);
  border:1px solid var(--border,#c4a96a);
  border-radius:4px;
  font-size:12px;
}
.horse-send-box .hs-title{
  font-weight:700;
  margin-bottom:8px;
  font-family:'Noto Serif JP',serif;
}
.horse-send-box label{
  display:flex;
  align-items:center;
  gap:8px;
  padding:4px 0;
  cursor:pointer;
}
.horse-send-box label.locked{
  opacity:0.4;
  cursor:not-allowed;
}
.horse-send-box .hs-hint{
  font-size:11px;
  color:var(--faded,#5a4a2a);
  margin-top:6px;
  line-height:1.5;
}
`;
if (!h.includes('.horse-send-box{')) {
  h = h.replace('</style>', css + '\n</style>');
  console.log('css');
}

if (h.includes('[horse prince transport] ready')) {
  const a = h.indexOf('// ═══ horse prince transport');
  if (a >= 0) {
    const end = h.indexOf('</script>', a);
    h = h.slice(0, a) + h.slice(end);
    console.log('removed old');
  }
}

// Update UI strings in HTML if present
h = h.replace(
  /馬ルート ノード2完遂＋荷車＋馬で解禁/g,
  '騎馬次がノード2突破し、かつ荷車が使えると解禁（速2・積載2）'
);
h = h.replace(
  /馬車が解禁されました。馬と荷車を組み合わせた輸送が可能です。/g,
  '馬車が解禁されました。速さ2・積載2で使えます。'
);

const FIX = `
// ═══ horse prince transport ═══
(function(){
'use strict';
if(window.__horsePrinceTp) return;
window.__horsePrinceTp = true;

// MEANS: no 'horse' pack animal; wagon = speed2 capacity2
if(typeof MEANS_CAP!=='undefined'){
  MEANS_CAP.horse = 0;
  MEANS_CAP.wagon = 2;
} else {
  window.MEANS_CAP = { jinput:1, cart:2, boat:4, wagon:2 };
}
if(typeof MEANS_LABEL!=='undefined'){
  MEANS_LABEL.wagon = '馬車';
  delete MEANS_LABEL.horse;
}

function freeSendHorses(){
  if(typeof ensureHorseState==='function') ensureHorseState();
  return (gs.horses||[]).filter(function(hh){
    return hh.status==='ranch' && !hh.isFoal;
  });
}
function starOf(hh){
  if(typeof window.displayStar==='function') return window.displayStar(hh.rank);
  if(typeof displayStar==='function') return displayStar(hh.rank);
  return Math.max(1, Math.floor(Number(hh.rank)||1));
}
function minStarFromOrder(od){
  if(!od) return 1;
  var m = String(od.label||'').match(/★\\s*(\\d)/);
  if(m) return parseInt(m[1],10);
  // item labels
  if(od.items){
    for(var i=0;i<od.items.length;i++){
      var mm = String(od.items[i].label||'').match(/★\\s*(\\d)/);
      if(mm) return parseInt(mm[1],10);
    }
  }
  return 1;
}
function needHorseQty(od){
  if(!od||!od.items) return 0;
  var n = 0;
  od.items.forEach(function(it){ if(it.id==='horse') n += (it.qty - (it.delivered||0)); });
  return Math.max(0, n);
}

// --- isMeansUnlocked: no horse means; wagon = horse N2 + cart ---
window.isMeansUnlocked = function(m){
  if(typeof ensureState==='function') ensureState();
  if(m==='jinput') return true;
  if(m==='cart') return (gs.cleared && gs.cleared.food || []).indexOf(1)>=0;
  if(m==='boat') return (gs.cleared && gs.cleared.food || []).indexOf(2)>=0;
  if(m==='horse') return false; // 廃止
  if(m==='wagon'){
    var horseN2 = (gs.cleared && gs.cleared.horse || []).indexOf(2)>=0;
    var cartOk = (gs.cleared && gs.cleared.food || []).indexOf(1)>=0;
    return horseN2 && cartOk;
  }
  return false;
};
try{ isMeansUnlocked = window.isMeansUnlocked; }catch(e){}

window.meansUnlockHint = function(m){
  if(m==='cart') return (typeof S==='function'?S('means_locked_cart','兵糧ルート ノード1完遂で解禁'):'兵糧ルート ノード1完遂で解禁');
  if(m==='boat') return (typeof S==='function'?S('means_locked_boat','兵糧ルート ノード2完遂で解禁'):'兵糧ルート ノード2完遂で解禁');
  if(m==='horse') return '馬による荷役は廃止されました（騎馬次へ馬を送るときは一覧から選択）';
  if(m==='wagon') return '騎馬次がノード2突破し、かつ荷車が使えると解禁（速2・積載2）';
  return '未解禁';
};
try{ meansUnlockHint = window.meansUnlockHint; }catch(e){}

window.meansCap = function(means){
  if(means==='jinput') return (typeof portersFree==='function') ? portersFree() : 1;
  if(means==='cart') return 2;
  if(means==='boat') return 4;
  if(means==='wagon') return 2;
  if(means==='horse_self') return 99;
  return 1;
};
try{ meansCap = window.meansCap; }catch(e){}

// --- buildMeans: horse prince special; others without horse means ---
window.buildMeans = function(key){
  var nt = document.getElementById('normal-trans-'+key);
  if(!nt) return;

  if(key==='horse'){
    // 馬王子: 手段なし
    var row = document.getElementById('means-horse');
    if(row) row.style.display = 'none';
    buildHorsePrinceSendUI();
    return;
  }

  var row2 = document.getElementById('means-'+key);
  if(!row2){
    row2 = document.createElement('div');
    row2.id = 'means-'+key;
    row2.className = 'means-row';
    nt.insertBefore(row2, nt.firstChild);
  }
  row2.style.display = '';
  var list = [
    { id:'jinput', t:'人足（空き'+(typeof portersFree==='function'?portersFree():'?')+'/'+(gs.portersMax||4)+'・各1荷）' },
    { id:'cart', t:'荷車（積載2）' },
    { id:'boat', t:'船（積載4）' },
    { id:'wagon', t:'馬車（速2・積載2）' }
  ];
  var html = '';
  list.forEach(function(o){
    if(window.isMeansUnlocked(o.id)){
      html += '<button type="button" class="means-btn" onclick="selectMeans(\\''+key+'\\',\\''+o.id+'\\',this)">'+o.t+'</button>';
    } else {
      html += '<button type="button" class="means-btn" disabled title="'+window.meansUnlockHint(o.id)+'" style="opacity:.4">'+o.t+'🔒</button>';
    }
  });
  row2.innerHTML = html;

  if(!document.getElementById('tinfo-'+key)){
    var info = document.createElement('div');
    info.className = 'tp-info';
    info.id = 'tinfo-'+key;
    info.textContent = '輸送手段を選択（初期は人足のみ）';
    nt.appendChild(info);
  }
  if(!document.getElementById('go-'+key)){
    var go = document.createElement('button');
    go.className = 'go-btn';
    go.id = 'go-'+key;
    go.disabled = true;
    go.textContent = 'Go → 出発';
    go.onclick = function(){ window.goTransport(key); };
    nt.appendChild(go);
  }
  var cur = gs.transport[key] && gs.transport[key].means;
  if(cur && cur!=='horse'){
    row2.querySelectorAll('.means-btn:not([disabled])').forEach(function(b){
      if((b.getAttribute('onclick')||'').indexOf("'"+cur+"'")>=0) b.classList.add('active');
    });
  }
};
try{ buildMeans = window.buildMeans; }catch(e){}

function buildHorsePrinceSendUI(){
  var nt = document.getElementById('normal-trans-horse');
  if(!nt) return;
  // hide any means
  var means = document.getElementById('means-horse');
  if(means) means.style.display = 'none';

  // order summary via ensureOrderUI if exists
  if(typeof ensureOrderUI==='function'){
    try{ ensureOrderUI('horse'); }catch(e){}
  }
  // hide qty rows for horse items — replace with list
  var titems = document.getElementById('titems-horse');
  if(titems) titems.style.display = 'none';

  var box = document.getElementById('horse-send-box');
  if(!box){
    box = document.createElement('div');
    box.id = 'horse-send-box';
    box.className = 'horse-send-box';
    nt.appendChild(box);
  }
  box.style.display = 'block';

  var od = gs.order && gs.order.horse;
  var need = needHorseQty(od);
  var minStar = minStarFromOrder(od);
  var free = freeSendHorses();
  var html = '<div class="hs-title">🐴 送る馬を選択（自走・手段不要）</div>';
  if(od){
    html += '<div style="margin-bottom:6px">依頼：<b>'+od.label+'</b>　残り <b>'+need+'</b> 頭（目安★'+minStar+'以上）</div>';
  } else {
    html += '<div style="margin-bottom:6px;color:var(--faded)">現在の依頼がありません</div>';
  }
  html += '<div id="horse-send-list">';
  if(!free.length){
    html += '<div style="color:var(--faded)">牧場に送れる馬がいません（つがい中・仔馬・輸送中を除く）</div>';
  } else {
    free.forEach(function(hh){
      var st = starOf(hh);
      var ok = st >= minStar;
      var cls = ok ? '' : ' locked';
      var dis = ok ? '' : ' disabled';
      html += '<label class="'+cls+'"><input type="checkbox" data-hid="'+hh.id+'"'+dis+
        ' onchange="onHorseSendPick()">'+
        hh.name+'（'+(hh.sex==='f'?'雌':'雄')+'・★'+st+')'+
        (ok?'':' ※★不足')+'</label>';
    });
  }
  html += '</div>';
  html += '<div class="hs-hint">N0は手渡しのみ。出立後はここに馬を選んで送ります。輸送手段の選択はありません。</div>';
  box.innerHTML = html;

  var info = document.getElementById('tinfo-horse');
  if(!info){
    info = document.createElement('div');
    info.className = 'tp-info';
    info.id = 'tinfo-horse';
    nt.appendChild(info);
  }
  info.textContent = '送る馬にチェックを入れて出発してください';

  var go = document.getElementById('go-horse');
  if(!go){
    go = document.createElement('button');
    go.className = 'go-btn';
    go.id = 'go-horse';
    go.textContent = 'Go → 馬を送る';
    go.onclick = function(){ window.goTransport('horse'); };
    nt.appendChild(go);
  } else {
    go.textContent = 'Go → 馬を送る';
    go.onclick = function(){ window.goTransport('horse'); };
  }
  go.disabled = true;
  window.onHorseSendPick();
}

window.onHorseSendPick = function(){
  var list = document.getElementById('horse-send-list');
  var go = document.getElementById('go-horse');
  var info = document.getElementById('tinfo-horse');
  if(!list) return;
  var n = list.querySelectorAll('input[type=checkbox]:checked').length;
  var od = gs.order && gs.order.horse;
  var need = needHorseQty(od);
  if(info){
    if(!od) info.textContent = '依頼がありません';
    else info.textContent = '選択 '+n+' 頭 / 依頼残り '+need+' 頭';
  }
  if(go){
    go.disabled = !(n>0 && need>0 && n<=need+5); // allow select up to need (strict: n>0 && can send)
    // must have at least 1 and not exceed remaining request by much — require 1..need
    go.disabled = !(n>=1 && n<=Math.max(need,1) && need>0);
    if(need>0 && n>need) go.disabled = true;
  }
};

function selectedSendHorseIds(){
  var list = document.getElementById('horse-send-list');
  if(!list) return [];
  var ids = [];
  list.querySelectorAll('input[type=checkbox]:checked').forEach(function(inp){
    ids.push(inp.getAttribute('data-hid'));
  });
  return ids;
}

// --- goTransport ---
var _goTp = window.goTransport || (typeof goTransport==='function'?goTransport:null);

window.goTransport = function(prince){
  if(prince==='horse'){
    return goTransportHorsePrince();
  }
  // other princes: block horse cargo
  if(typeof ensureState==='function') ensureState();
  if(gs.phase && gs.phase!=='transport'){ showToast('輸送フェーズではありません'); return; }
  if(typeof canTransportThisTurn==='function' && !canTransportThisTurn(prince)){
    showToast('出立したターンは輸送できません。翌ターンから送れます');
    return;
  }
  var means = gs.transport[prince] && gs.transport[prince].means;
  if(means==='horse'){
    showToast('馬による荷役は廃止されました。馬車か他の手段を使ってください');
    return;
  }
  if(!means || !window.isMeansUnlocked(means)){
    showToast('輸送手段を選んでください（初期は人足のみ）');
    return;
  }
  var od = gs.order && gs.order[prince];
  var cargo = [];
  var total = 0;
  if(od && od.items){
    od.items.forEach(function(it){
      if(it.id==='horse') return; // 他王子への馬運送なし
      var q = (typeof qtys!=='undefined' && qtys[prince+'_'+it.id]) || 0;
      if(q>0){ cargo.push({id:it.id,label:it.label,qty:q}); total+=q; }
    });
  }
  if(total<=0){ showToast('送る数量を指定してください'); return; }
  var cap = window.meansCap(means);
  if(means==='jinput'){
    if(total>cap){ showToast('人足が足りません（空き'+cap+'）'); return; }
  } else if(total>cap){
    showToast('積載超過（最大'+cap+'）'); return;
  }
  cargo.forEach(function(c){
    if(typeof takeStock==='function') takeStock(c.id, c.qty);
  });
  var node = gs.node[prince]||1;
  var eta = 5;
  if(typeof etaFor==='function'){
    try{ eta = etaFor(prince, node, means); }catch(e){}
  }
  if(means==='wagon'){
    // 速さ2 → やや速い
    eta = Math.max(2, (eta||5) - 1);
    // fixed: speed 2 capacity 2 → roughly 3-4T; use 4 default
    eta = 4;
  }
  var portersUsed = means==='jinput' ? total : 0;
  gs.convoys = gs.convoys || [];
  gs.convoys.push({
    id:'cv_'+prince+'_'+Date.now(),
    route:prince, means:means, cargo:cargo,
    eta:eta, etaMax:eta, targetNode:node, porters:portersUsed
  });
  gs.transport[prince] = gs.transport[prince]||{};
  gs.transport[prince].done = true;
  gs.orderMissTurns[prince] = 0;
  if(typeof qtys!=='undefined'){
    Object.keys(qtys).forEach(function(k){ if(k.indexOf(prince+'_')===0) qtys[k]=0; });
  }
  document.querySelectorAll('[id^="qty-'+prince+'-"]').forEach(function(el){ el.textContent='0'; });
  showToast('輸送出発（'+(means==='wagon'?'馬車':means)+'・'+eta+'T後）');
  if(typeof updateTransportUI==='function') updateTransportUI();
  if(typeof buildMeans==='function') buildMeans(prince);
  if(typeof renderConvoys==='function') renderConvoys();
};

function goTransportHorsePrince(){
  if(typeof ensureState==='function') ensureState();
  if(gs.phase && gs.phase!=='transport'){ showToast('輸送フェーズではありません'); return; }
  if(typeof canTransportThisTurn==='function' && !canTransportThisTurn('horse')){
    showToast('出立したターンは輸送できません。翌ターンから送れます');
    return;
  }
  if(!gs.sortied || !gs.sortied.horse){
    showToast('出立前は手渡しで準備してください');
    return;
  }
  var od = gs.order && gs.order.horse;
  if(!od || !needHorseQty(od)){
    showToast('送る依頼がありません');
    return;
  }
  var ids = selectedSendHorseIds();
  var need = needHorseQty(od);
  var minStar = minStarFromOrder(od);
  if(!ids.length){ showToast('送る馬を選んでください'); return; }
  if(ids.length > need){ showToast('依頼残りは'+need+'頭までです'); return; }
  // validate stars
  for(var i=0;i<ids.length;i++){
    var hh = (gs.horses||[]).find(function(x){return x.id===ids[i];});
    if(!hh || hh.status!=='ranch'){ showToast('選べない馬が含まれています'); return; }
    if(starOf(hh) < minStar){ showToast(hh.name+'は★が足りません（★'+minStar+'以上）'); return; }
  }
  ids.forEach(function(hid){
    var hh = (gs.horses||[]).find(function(x){return x.id===hid;});
    if(hh) hh.status = 'transit';
  });
  if(typeof syncRanchCount==='function') syncRanchCount();

  var node = gs.node.horse || 1;
  // 自走: 速さの最小で ETA（速1→5T, 速2→4T, 速3→3T）
  var minSp = 99;
  ids.forEach(function(hid){
    var hh = (gs.horses||[]).find(function(x){return x.id===hid;});
    if(hh){
      var sp = hh.speed;
      if(sp==null && typeof window.statsForRank==='function') sp = window.statsForRank(hh.rank).speed;
      if(sp==null && typeof statsForRank==='function') sp = statsForRank(hh.rank).speed;
      minSp = Math.min(minSp, sp||1);
    }
  });
  var eta = Math.max(2, 6 - (minSp<99?minSp:1));

  gs.convoys = gs.convoys || [];
  gs.convoys.push({
    id: 'cv_horse_'+Date.now(),
    route: 'horse',
    means: 'horse_self',
    cargo: [{ id:'horse', label:'馬', qty:ids.length, horseIds:ids.slice() }],
    eta: eta,
    etaMax: eta,
    targetNode: node,
    porters: 0,
    cargoHorseIds: ids.slice()
  });
  gs.transport.horse = gs.transport.horse || {};
  gs.transport.horse.done = true;
  gs.orderMissTurns.horse = 0;

  showToast('馬 '+ids.length+' 頭が出発（自走・'+eta+'T後）');
  if(typeof updateTransportUI==='function') updateTransportUI();
  if(typeof window.buildMeans==='function') window.buildMeans('horse');
  if(typeof renderConvoys==='function') renderConvoys();
  if(typeof window.renderRanchHorseList==='function') window.renderRanchHorseList();
}

// tick: deploy cargo horses, don't return them
(function(){
  var prev = window.tickConvoys || (typeof tickConvoys==='function'?tickConvoys:null);
  if(typeof prev!=='function') return;
  window.tickConvoys = function(){
    var arriving = (gs.convoys||[]).filter(function(cv){ return (cv.eta-1)<=0; });
    var r = prev.apply(this, arguments);
    arriving.forEach(function(cv){
      (cv.cargoHorseIds||[]).forEach(function(hid){
        var hh = (gs.horses||[]).find(function(x){return x.id===hid;});
        if(hh){
          hh.status = 'deployed';
          hh.deployedRoute = cv.route;
        }
      });
      // also from cargo.horseIds
      (cv.cargo||[]).forEach(function(c){
        if(c.id==='horse' && c.horseIds){
          c.horseIds.forEach(function(hid){
            var hh = (gs.horses||[]).find(function(x){return x.id===hid;});
            if(hh){ hh.status='deployed'; hh.deployedRoute=cv.route; }
          });
        }
      });
    });
    if(typeof syncRanchCount==='function') syncRanchCount();
    return r;
  };
  try{ tickConvoys = window.tickConvoys; }catch(e){}
})();

// ensureOrderUI + buildMeans on transport update
(function(){
  var prev = window.updateTransportUI || (typeof updateTransportUI==='function'?updateTransportUI:null);
  if(typeof prev!=='function') return;
  window.updateTransportUI = function(){
    prev();
    PK.forEach(function(key){
      if(gs.sortied && gs.sortied[key]){
        if(typeof ensureOrderUI==='function'){
          try{ ensureOrderUI(key); }catch(e){}
        }
        if(typeof window.buildMeans==='function') window.buildMeans(key);
      }
    });
  };
  try{ updateTransportUI = window.updateTransportUI; }catch(e){}
})();

// wagon unlock message
(function(){
  var prev = window.markNodeCleared || (typeof markNodeCleared==='function'?markNodeCleared:null);
  if(typeof prev!=='function' || prev.__wagonMsg) return;
  window.markNodeCleared = function(key, node){
    var beforeH2 = (gs.cleared && gs.cleared.horse || []).indexOf(2)>=0;
    var beforeF1 = (gs.cleared && gs.cleared.food || []).indexOf(1)>=0;
    var r = prev.apply(this, arguments);
    try{
      var horseN2 = (gs.cleared && gs.cleared.horse || []).indexOf(2)>=0;
      var cartOk = (gs.cleared && gs.cleared.food || []).indexOf(1)>=0;
      // just unlocked wagon condition
      if(horseN2 && cartOk){
        var justHorse = key==='horse' && node===2 && !beforeH2;
        var justCart = key==='food' && node===1 && !beforeF1;
        if(justHorse || (justCart && horseN2) || (justHorse && cartOk)){
          if(typeof queueUnlock==='function'){
            queueUnlock('unlock_wagon', '馬車が解禁されました。速さ2・積載2で使えます。');
          } else if(typeof window.queueUnlock==='function'){
            window.queueUnlock('unlock_wagon', '馬車が解禁されました。速さ2・積載2で使えます。');
          }
        }
      }
    }catch(e){}
    return r;
  };
  window.markNodeCleared.__wagonMsg = true;
  try{ markNodeCleared = window.markNodeCleared; }catch(e){}
})();

var PK = window.PKEYS || ['food','horse','siege','weapon'];

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    if(gs.phase==='transport' && typeof window.updateTransportUI==='function'){
      window.updateTransportUI();
    }
  }, 150);
});

console.log('[horse prince transport] ready');
})();
`;

const last = h.lastIndexOf('</script>');
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
console.log('DONE', { fail, ready: h.includes('[horse prince transport] ready') });
