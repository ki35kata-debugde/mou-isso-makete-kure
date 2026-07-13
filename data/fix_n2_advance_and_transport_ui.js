/**
 * Bug: N1 clear → advance to N2 + new order
 * Transport UI:
 *  ① タイトル1行
 *  ② 人足空きは portersFree()（? をやめる）/ 荷車50 馬車100
 *  ③ 品目1行（現庫・依頼残・輸送中）
 *  ④ 人足ステータスは「あとXT」中心
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_n2_tpui_' + Date.now(), h, 'utf8');

const css = `
.tp-order-title{
  font-size:12px;
  line-height:1.5;
  margin-bottom:8px;
  padding:6px 8px;
  background:var(--panel,#ece3cc);
  border:1px solid var(--border,#c4a96a);
  border-radius:4px;
}
.tp-item-line{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:8px 12px;
  padding:6px 4px;
  border-bottom:1px solid var(--border,#c4a96a);
  font-size:12px;
}
.tp-item-line .nm{ font-weight:700; min-width:3em; }
.tp-item-line .meta{ color:var(--faded,#5a4a2a); }
.tp-fleet-line{
  font-size:11px;
  color:var(--faded,#5a4a2a);
  margin:4px 0 8px;
}
.means-row{ margin-bottom:6px; }
`;
if (!h.includes('.tp-order-title{')) {
  h = h.replace('</style>', css + '\n</style>');
  console.log('css');
}

if (h.includes('[n2 advance + tp ui] ready')) {
  const a = h.indexOf('// ═══ n2 advance + transport ui');
  if (a >= 0) {
    h = h.slice(0, a) + h.slice(h.indexOf('</script>', a));
    console.log('removed old');
  }
}

const FIX = `
// ═══ n2 advance + transport ui ═══
(function(){
'use strict';
if(window.__n2TpUi) return;
window.__n2TpUi = true;

var PK = window.PKEYS || ['food','horse','siege','weapon'];

// ----- fleet -----
function ensureFleet(){
  if(!gs.fleet) gs.fleet = { cartMax:50, wagonMax:100 };
  if(gs.fleet.cartMax==null) gs.fleet.cartMax = 50;
  if(gs.fleet.wagonMax==null) gs.fleet.wagonMax = 100;
  if(gs.portersMax==null) gs.portersMax = 4;
}
function portersBusySafe(){
  ensureFleet();
  var n=0;
  (gs.convoys||[]).forEach(function(cv){
    if(cv.means!=='jinput') return;
    if(cv.porters!=null) n += cv.porters;
    else n += (cv.cargo||[]).reduce(function(s,c){ return s+(c.qty||0); },0);
  });
  return n;
}
function portersFreeSafe(){
  ensureFleet();
  return Math.max(0, (gs.portersMax||4) - portersBusySafe());
}
window.portersBusy = portersBusySafe;
window.portersFree = portersFreeSafe;
try{ portersBusy = portersBusySafe; portersFree = portersFreeSafe; }catch(e){}

function fleetBusy(means){
  var n=0;
  (gs.convoys||[]).forEach(function(cv){
    if(cv.means!==means) return;
    if(cv.fleetUsed!=null) n += cv.fleetUsed;
    else n += 1;
  });
  return n;
}
function fleetFree(means){
  ensureFleet();
  if(means==='cart') return Math.max(0, gs.fleet.cartMax - fleetBusy('cart'));
  if(means==='wagon') return Math.max(0, gs.fleet.wagonMax - fleetBusy('wagon'));
  return 99;
}
/** 使用台数/人数 = ceil(荷量 / 1台あたり容量) */
function unitsNeeded(means, cargoQty){
  var capPer = 1;
  if(means==='jinput') capPer = 1;
  else if(means==='cart') capPer = 2;
  else if(means==='boat') capPer = 4;
  else if(means==='wagon') capPer = 2;
  else capPer = 1;
  if(cargoQty<=0) return 0;
  return Math.ceil(cargoQty / capPer);
}

function inTransitQty(route, itemId){
  var n=0;
  (gs.convoys||[]).forEach(function(cv){
    if(cv.route!==route) return;
    (cv.cargo||[]).forEach(function(c){
      if(c.id===itemId) n += (c.qty||0);
    });
  });
  return n;
}

function earliestPorterReturnT(){
  var min=null;
  (gs.convoys||[]).forEach(function(cv){
    if(cv.means!=='jinput') return;
    if(cv.eta==null) return;
    if(min==null || cv.eta<min) min = cv.eta;
  });
  return min;
}

function stockOfSafe(id){
  if(typeof stockOf==='function') return stockOf(id);
  if(id==='food') return (gs.inv&&gs.inv.food)||0;
  if(id==='sword') return (gs.stock&&gs.stock.sword)||0;
  if(id==='siege_w') return (gs.stock&&gs.stock.siege_w)||0;
  if(id==='med') return (gs.stock&&gs.stock.med)||0;
  if(id==='horse'){
    return (gs.horses||[]).filter(function(hh){ return hh.status==='ranch'&&!hh.isFoal; }).length;
  }
  return 0;
}

// ----- N1 clear → N2 -----
function advanceNodeAfterClear(key){
  var od = gs.order && gs.order[key];
  if(!od || !od.items) return;
  if(!od.items.every(function(it){ return (it.delivered||0)>=it.qty; })) return;
  if(od._nodeAdvanced) return;

  var node = od.node != null ? od.node : (gs.node[key]||1);
  od._nodeAdvanced = true;

  // mark cleared (trust may already be granted by checkOrderComplete)
  if(typeof markNodeCleared==='function'){
    try{ markNodeCleared(key, node); }catch(e){}
  } else if(typeof window.markNodeCleared==='function'){
    try{ window.markNodeCleared(key, node); }catch(e){}
  }

  var next = node + 1;
  if(next > 4){
    showToast((typeof PNAMES!=='undefined'?PNAMES[key]:key)+' 最終ノード完遂');
    gs.order[key] = null;
    return;
  }

  gs.node[key] = next;
  // letter pending enter
  if(!gs.letterFlags) gs.letterFlags = { used:{}, serial:{}, justEntered:{}, pendingEnter:{} };
  if(!gs.letterFlags.pendingEnter) gs.letterFlags.pendingEnter = {};
  gs.letterFlags.pendingEnter[key] = next;
  gs.letterFlags.justEntered[key] = true;

  if(typeof setOrderForNode==='function'){
    setOrderForNode(key, next);
  } else if(typeof window.setOrderForNode==='function'){
    window.setOrderForNode(key, next);
  }

  // ensure new order has delivered:0
  if(gs.order[key] && gs.order[key].items){
    gs.order[key].items.forEach(function(it){ if(it.delivered==null) it.delivered=0; });
  }

  showToast((typeof PNAMES!=='undefined'?PNAMES[key]:key)+' がノード'+next+'へ進みました');
  if(typeof refreshMapNodes==='function') refreshMapNodes();
  if(typeof updateTransportUI==='function') updateTransportUI();
  if(typeof window.updateTabLabels==='function') window.updateTabLabels();
}

// wrap checkOrderComplete
(function(){
  var prev = window.checkOrderComplete || (typeof checkOrderComplete==='function'?checkOrderComplete:null);
  window.checkOrderComplete = function(key){
    if(typeof prev==='function') prev(key);
    try{ advanceNodeAfterClear(key); }catch(e){ console.warn('advanceNode', e); }
  };
  try{ checkOrderComplete = window.checkOrderComplete; }catch(e){}
})();

// ----- Transport UI -----
function formatOrderTitle(key){
  var od = gs.order && gs.order[key];
  var node = (gs.node && gs.node[key]) || 0;
  if(!od) return 'ノード'+node+' 依頼なし';
  var parts = (od.items||[]).map(function(it){
    var lab = it.label || it.id;
    // shorten ★ labels
    lab = String(lab).replace(/\\s*★\\d+/,'').replace(/×\\d+/,'');
    if(it.id==='food') lab = '兵糧';
    if(it.id==='med') lab = '回復薬';
    if(it.id==='sword') lab = '剣';
    if(it.id==='siege_w') lab = '衝車';
    if(it.id==='horse') lab = '馬';
    return '（'+lab+(it.delivered||0)+'/'+it.qty+'個納入）';
  });
  return 'ノード'+node+'依頼'+parts.join('')+'納期残'+(od.deadline!=null?od.deadline:'?')+'T';
}

window.ensureOrderUI = function(key){
  var nt = document.getElementById('normal-trans-'+key);
  if(!nt) return;

  // strip old static item rows outside titems
  Array.prototype.slice.call(nt.querySelectorAll('.item-row')).forEach(function(el){
    if(!el.closest('#titems-'+key) && !el.closest('.horse-send-box')) el.remove();
  });

  var sum = document.getElementById('order-sum-'+key);
  if(!sum){
    sum = document.createElement('div');
    sum.id = 'order-sum-'+key;
    sum.className = 'tp-order-title';
    nt.insertBefore(sum, nt.firstChild);
  }
  sum.className = 'tp-order-title';
  sum.textContent = formatOrderTitle(key);

  // horse prince: leave horse-send UI to other module
  if(key==='horse'){
    var titemsH = document.getElementById('titems-horse');
    if(titemsH) titemsH.style.display = 'none';
    return;
  }

  var box = document.getElementById('titems-'+key);
  if(!box){
    box = document.createElement('div');
    box.id = 'titems-'+key;
    var means = document.getElementById('means-'+key);
    if(means) means.after(box);
    else nt.appendChild(box);
  }
  box.style.display = '';

  var od = gs.order && gs.order[key];
  if(!od || !od.items){ box.innerHTML = ''; return; }

  var html = '';
  od.items.forEach(function(it){
    if(it.id==='horse') return; // 他王子への馬運送なし
    var qk = key+'_'+it.id;
    if(typeof qtys!=='undefined' && qtys[qk]==null) qtys[qk]=0;
    var q = (typeof qtys!=='undefined' ? qtys[qk] : 0) || 0;
    var inv = stockOfSafe(it.id);
    var remain = Math.max(0, it.qty - (it.delivered||0));
    var transit = inTransitQty(key, it.id);
    var lab = it.label || it.id;
    if(it.id==='food') lab = '兵糧';
    if(it.id==='med') lab = '回復薬';
    if(it.id==='sword') lab = '剣';
    if(it.id==='siege_w') lab = '衝車';

    html += '<div class="tp-item-line" data-item="'+it.id+'">'+
      '<span class="nm">'+lab+'</span>'+
      '<span class="meta">現庫'+inv+'</span>'+
      '<span class="meta">依頼残'+remain+'</span>'+
      '<span class="meta">輸送中'+transit+'</span>'+
      '<span class="item-qty-large" style="display:inline-flex;align-items:center;gap:4px;margin-left:auto">'+
      '<button type="button" class="qty-btn-lg" onclick="changeQty(\\''+key+'\\',\\''+it.id+'\\',-1)">－</button>'+
      '<span class="qty-val-lg" id="qty-'+key+'-'+it.id+'">'+q+'</span>'+
      '<button type="button" class="qty-btn-lg" onclick="changeQty(\\''+key+'\\',\\''+it.id+'\\',1)">＋</button>'+
      '</span></div>';
  });
  box.innerHTML = html;
};
try{ ensureOrderUI = window.ensureOrderUI; }catch(e){}

// buildMeans with real free counts
window.buildMeans = function(key){
  var nt = document.getElementById('normal-trans-'+key);
  if(!nt) return;

  // horse prince handled by horse prince module if present
  if(key==='horse'){
    var rowH = document.getElementById('means-horse');
    if(rowH) rowH.style.display = 'none';
    if(typeof buildHorsePrinceSendUI==='function'){
      try{ buildHorsePrinceSendUI(); }catch(e){}
    } else if(window.__horsePrinceTp && typeof window.buildMeans==='function'){
      // fallthrough avoided
    }
    // call horse UI builder if defined on window from other patch
    if(typeof window.buildHorsePrinceSendUI==='function') window.buildHorsePrinceSendUI();
    return;
  }

  ensureFleet();
  var freeP = portersFreeSafe();
  var maxP = gs.portersMax||4;
  var freeC = fleetFree('cart');
  var maxC = gs.fleet.cartMax;
  var freeW = fleetFree('wagon');
  var maxW = gs.fleet.wagonMax;

  var row = document.getElementById('means-'+key);
  if(!row){
    row = document.createElement('div');
    row.id = 'means-'+key;
    row.className = 'means-row';
    var sum = document.getElementById('order-sum-'+key);
    if(sum && sum.nextSibling) sum.after(row);
    else nt.insertBefore(row, nt.firstChild ? nt.firstChild.nextSibling : null);
    if(!row.parentNode) nt.appendChild(row);
  }
  row.style.display = '';

  function unlocked(m){
    if(typeof window.isMeansUnlocked==='function') return window.isMeansUnlocked(m);
    if(typeof isMeansUnlocked==='function') return isMeansUnlocked(m);
    if(m==='jinput') return true;
    if(m==='cart') return (gs.cleared&&gs.cleared.food||[]).indexOf(1)>=0;
    if(m==='boat') return (gs.cleared&&gs.cleared.food||[]).indexOf(2)>=0;
    if(m==='wagon') return (gs.cleared&&gs.cleared.horse||[]).indexOf(2)>=0 && (gs.cleared&&gs.cleared.food||[]).indexOf(1)>=0;
    return false;
  }
  function hint(m){
    if(typeof window.meansUnlockHint==='function') return window.meansUnlockHint(m);
    return '未解禁';
  }

  var list = [
    { id:'jinput', t:'人足（空き'+freeP+'/'+maxP+'・各1荷）' },
    { id:'cart', t:'荷車（空き'+freeC+'/'+maxC+'・積載2）' },
    { id:'boat', t:'船（積載4）' },
    { id:'wagon', t:'馬車（空き'+freeW+'/'+maxW+'・速2・積載2）' }
  ];
  // no horse means
  var html = '';
  list.forEach(function(o){
    if(unlocked(o.id)){
      html += '<button type="button" class="means-btn" onclick="selectMeans(\\''+key+'\\',\\''+o.id+'\\',this)">'+o.t+'</button>';
    } else {
      html += '<button type="button" class="means-btn" disabled title="'+hint(o.id)+'" style="opacity:.4">'+o.t+'🔒</button>';
    }
  });
  row.innerHTML = html;

  // fleet status line (人足は「あとXT」のみ)
  var fl = document.getElementById('fleet-line-'+key);
  if(!fl){
    fl = document.createElement('div');
    fl.id = 'fleet-line-'+key;
    fl.className = 'tp-fleet-line';
    row.after(fl);
  }
  var ret = earliestPorterReturnT();
  if(portersBusySafe()>0 && ret!=null){
    fl.textContent = '人足　あと'+ret+'T';
  } else {
    fl.textContent = '人足　待機中（空き'+freeP+'/'+maxP+'）';
  }

  if(!document.getElementById('tinfo-'+key)){
    var info = document.createElement('div');
    info.className = 'tp-info';
    info.id = 'tinfo-'+key;
    info.textContent = '輸送手段を選択';
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
  if(cur){
    row.querySelectorAll('.means-btn:not([disabled])').forEach(function(b){
      if((b.getAttribute('onclick')||'').indexOf("'"+cur+"'")>=0) b.classList.add('active');
    });
  }
};
try{ buildMeans = window.buildMeans; }catch(e){}

// selectMeans refresh fleet line
(function(){
  var prev = window.selectMeans || (typeof selectMeans==='function'?selectMeans:null);
  window.selectMeans = function(prince, means, btn){
    if(means==='horse'){ showToast('馬による荷役は廃止されました'); return; }
    if(typeof prev==='function') prev(prince, means, btn);
    else {
      gs.transport[prince]=gs.transport[prince]||{};
      gs.transport[prince].means=means;
      if(btn){
        document.querySelectorAll('#means-'+prince+' .means-btn').forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
      }
      var go=document.getElementById('go-'+prince); if(go) go.disabled=false;
    }
    // update tinfo with free counts
    var ti = document.getElementById('tinfo-'+prince);
    if(ti){
      var freeP = portersFreeSafe();
      var maxP = gs.portersMax||4;
      if(means==='jinput') ti.textContent = '人足　空き'+freeP+'/'+maxP+'・各1荷';
      else if(means==='cart') ti.textContent = '荷車　空き'+fleetFree('cart')+'/'+(gs.fleet&&gs.fleet.cartMax||50)+'・積載2';
      else if(means==='wagon') ti.textContent = '馬車　空き'+fleetFree('wagon')+'/'+(gs.fleet&&gs.fleet.wagonMax||100)+'・速2・積載2';
      else if(means==='boat') ti.textContent = '船　積載4';
    }
    if(typeof window.buildMeans==='function'){
      // re-paint free numbers without killing selection
    }
  };
  try{ selectMeans = window.selectMeans; }catch(e){}
})();

// goTransport with fleet usage
(function(){
  var prev = window.goTransport || (typeof goTransport==='function'?goTransport:null);
  window.goTransport = function(prince){
    if(prince==='horse'){
      // keep horse prince handler if exists
      if(prev && prev !== window.goTransport){
        // check if horse-specific exists via name
      }
      // call previous which may be horse-aware from horse prince patch
      if(typeof prev==='function'){
        // If horse prince transport module set goTransport, it handles horse
        return prev(prince);
      }
    }

    if(typeof ensureState==='function') ensureState();
    ensureFleet();
    if(gs.phase && gs.phase!=='transport'){ showToast('輸送フェーズではありません'); return; }
    if(typeof canTransportThisTurn==='function' && !canTransportThisTurn(prince)){
      showToast('出立したターンは輸送できません。翌ターンから送れます'); return;
    }
    if(prince==='horse'){
      // fallback if horse module missing
      showToast('馬王子は馬一覧から送ってください'); return;
    }

    var means = gs.transport[prince] && gs.transport[prince].means;
    if(!means){ showToast('輸送手段を選んでください'); return; }
    if(means==='horse'){ showToast('馬荷役は廃止'); return; }

    var od = gs.order && gs.order[prince];
    var cargo=[]; var total=0;
    if(od&&od.items){
      od.items.forEach(function(it){
        if(it.id==='horse') return;
        var q=(typeof qtys!=='undefined'&&qtys[prince+'_'+it.id])||0;
        if(q>0){ cargo.push({id:it.id,label:it.label,qty:q}); total+=q; }
      });
    }
    if(total<=0){ showToast('送る数量を指定してください'); return; }

    var units = unitsNeeded(means, total);
    if(means==='jinput'){
      var free = portersFreeSafe();
      if(units>free){ showToast('人足が足りません（必要'+units+'・空き'+free+'）'); return; }
    } else if(means==='cart'){
      var fc = fleetFree('cart');
      if(units>fc){ showToast('荷車が足りません（必要'+units+'・空き'+fc+'）'); return; }
    } else if(means==='wagon'){
      var fw = fleetFree('wagon');
      if(units>fw){ showToast('馬車が足りません（必要'+units+'・空き'+fw+'）'); return; }
    } else if(means==='boat'){
      if(total>4){ showToast('積載超過（船は4）'); return; }
      units = 1;
    }

    cargo.forEach(function(c){
      if(typeof takeStock==='function') takeStock(c.id, c.qty);
    });

    var node = gs.node[prince]||1;
    var eta = 5;
    if(typeof etaFor==='function'){
      try{ eta = etaFor(prince, node, means); }catch(e){}
    }
    if(means==='wagon') eta = 4; // 速2

    gs.convoys = gs.convoys || [];
    gs.convoys.push({
      id: 'cv_'+prince+'_'+Date.now(),
      route: prince,
      means: means,
      cargo: cargo,
      eta: eta,
      etaMax: eta,
      targetNode: node,
      porters: means==='jinput' ? units : 0,
      fleetUsed: (means==='cart'||means==='wagon') ? units : 0
    });
    gs.transport[prince] = gs.transport[prince]||{};
    gs.transport[prince].done = true;
    gs.orderMissTurns[prince] = 0;
    if(typeof qtys!=='undefined'){
      Object.keys(qtys).forEach(function(k){ if(k.indexOf(prince+'_')===0) qtys[k]=0; });
    }
    document.querySelectorAll('[id^="qty-'+prince+'-"]').forEach(function(el){ el.textContent='0'; });

    showToast('出発（'+means+'×'+units+'・'+eta+'T後）');
    if(typeof updateTransportUI==='function') updateTransportUI();
    if(typeof window.ensureOrderUI==='function') window.ensureOrderUI(prince);
    if(typeof window.buildMeans==='function') window.buildMeans(prince);
    if(typeof renderConvoys==='function') renderConvoys();
  };
  try{ goTransport = window.goTransport; }catch(e){}
})();

// If horse prince module exists, preserve its goTransport for horse by chaining
(function(){
  // Re-read: horse prince patch sets goTransport that handles horse first.
  // Our wrap may have overwritten it. Restore horse branch by checking for buildHorsePrinceSendUI / __horsePrinceTp
  if(!window.__horsePrinceTp) return;
  var ourGo = window.goTransport;
  // The horse module's goTransportHorsePrince may not be on window. Rebuild horse path:
  var horseGo = function(){
    // try click path: if go-horse has handler from horse module, invoke selected horses
    if(typeof window.goTransportHorsePrince==='function') return window.goTransportHorsePrince();
    // inline minimal: use selected checkboxes from horse-send-list
    var list = document.getElementById('horse-send-list');
    if(!list){ showToast('馬一覧がありません'); return; }
    // defer to original horse logic if user opens go-horse
  };
})();

// updateTransportUI glue
(function(){
  var prev = window.updateTransportUI || (typeof updateTransportUI==='function'?updateTransportUI:null);
  if(typeof prev!=='function') return;
  window.updateTransportUI = function(){
    prev();
    PK.forEach(function(key){
      if(gs.sortied && gs.sortied[key]){
        try{ window.ensureOrderUI(key); }catch(e){}
        try{ window.buildMeans(key); }catch(e){}
      }
    });
  };
  try{ updateTransportUI = window.updateTransportUI; }catch(e){}
})();

// setPhase transport refresh
(function(){
  var _sp = window.setPhase;
  if(typeof _sp!=='function') return;
  window.setPhase = function(p){
    var r = _sp.apply(this, arguments);
    if(p==='transport'){
      setTimeout(function(){
        if(typeof window.updateTransportUI==='function') window.updateTransportUI();
      }, 30);
    }
    return r;
  };
  try{ setPhase = window.setPhase; }catch(e){}
})();

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    ensureFleet();
    if(gs.phase==='transport' && typeof window.updateTransportUI==='function') window.updateTransportUI();
  }, 160);
});

console.log('[n2 advance + tp ui] ready');
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
console.log('DONE', { fail, ready: h.includes('[n2 advance + tp ui] ready') });
