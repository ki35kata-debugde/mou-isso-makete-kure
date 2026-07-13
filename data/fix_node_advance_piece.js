/**
 * Fix N1 clear → N2 advance + map piece move
 * Replaces checkOrderComplete with one clean implementation
 * Recovers stuck saves
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_node_piece_' + Date.now(), h, 'utf8');

if (h.includes('[node advance piece] ready')) {
  const a = h.indexOf('// ═══ node advance piece');
  if (a >= 0) {
    h = h.slice(0, a) + h.slice(h.indexOf('</script>', a));
    console.log('removed old');
  }
}

const FIX = `
// ═══ node advance piece ═══
(function(){
'use strict';
if(window.__nodeAdvancePiece) return;
window.__nodeAdvancePiece = true;

function trustRewardFor(key, node){
  try{
    var conf = CFG.node_orders && CFG.node_orders[key] && CFG.node_orders[key][String(node)];
    if(conf && conf.trust_reward!=null) return conf.trust_reward|0;
  }catch(e){}
  return node>=4 ? 20 : 15;
}

function orderFullyDelivered(od){
  if(!od || !od.items || !od.items.length) return false;
  return od.items.every(function(it){ return (it.delivered||0) >= it.qty; });
}

/** 完納した依頼を次ノードへ。駒・UIも更新 */
window.advanceAfterOrderComplete = function(key){
  if(typeof ensureState==='function') ensureState();
  var od = gs.order && gs.order[key];
  if(!orderFullyDelivered(od)) return false;
  if(od._nodeAdvanced){
    // 途中でフラグだけ立った救済: ノードが依頼と同じままなら進める
    var stuckNode = od.node != null ? od.node : (gs.node[key]||1);
    if((gs.node[key]||1) > stuckNode && gs.order[key] && gs.order[key].node === (gs.node[key]||1)){
      // already ok
      if(typeof positionAllPieces==='function') positionAllPieces();
      return false;
    }
    if((gs.node[key]||1) <= stuckNode){
      // force continue despite flag
      od._nodeAdvanced = false;
    } else {
      if(typeof positionAllPieces==='function') positionAllPieces();
      return false;
    }
  }

  var node = od.node != null ? od.node : (gs.node[key]||1);
  od._nodeAdvanced = true;

  // trust once
  if(!od._trustGranted){
    var tr = trustRewardFor(key, node);
    gs.trust[key] = Math.min(100, (gs.trust[key]||0) + tr);
    od._trustGranted = true;
    showToast('✓ '+(typeof PNAMES!=='undefined'?PNAMES[key]:key)+' ノード'+node+' 完納（信頼 +'+tr+'）');
  }

  // clear flag on map
  if(typeof window.markNodeCleared==='function'){
    try{ window.markNodeCleared(key, node); }catch(e){}
  } else if(typeof markNodeCleared==='function'){
    try{ markNodeCleared(key, node); }catch(e){}
  } else {
    if(!gs.cleared) gs.cleared = {};
    if(!gs.cleared[key]) gs.cleared[key] = [];
    if(gs.cleared[key].indexOf(node)<0) gs.cleared[key].push(node);
  }

  gs.orderLocked = gs.orderLocked || {};
  gs.orderLocked[key] = false;

  var next = node + 1;
  if(next > 4){
    gs.order[key] = null;
    gs.node[key] = 4;
    showToast((typeof PNAMES!=='undefined'?PNAMES[key]:key)+' 最終ノード完遂');
  } else {
    gs.node[key] = next;
    // letter enter
    if(!gs.letterFlags) gs.letterFlags = { used:{}, serial:{}, justEntered:{}, pendingEnter:{} };
    if(!gs.letterFlags.pendingEnter) gs.letterFlags.pendingEnter = {};
    if(!gs.letterFlags.justEntered) gs.letterFlags.justEntered = {};
    gs.letterFlags.pendingEnter[key] = next;
    gs.letterFlags.justEntered[key] = true;

    if(typeof setOrderForNode==='function') setOrderForNode(key, next);
    else if(typeof window.setOrderForNode==='function') window.setOrderForNode(key, next);

    if(gs.order[key] && gs.order[key].items){
      gs.order[key].items.forEach(function(it){
        if(it.delivered==null) it.delivered = 0;
      });
      gs.order[key].node = next;
      gs.order[key]._nodeAdvanced = false;
      gs.order[key]._trustGranted = false;
    }
    showToast((typeof PNAMES!=='undefined'?PNAMES[key]:key)+' がノード'+next+'へ進みました');
  }

  // ★ 駒を必ず動かす
  try{
    if(typeof positionAllPieces==='function') positionAllPieces();
    else if(typeof positionPieceAtNode==='function') positionPieceAtNode(key);
  }catch(e){ console.warn('position piece', e); }
  try{ if(typeof refreshMapNodes==='function') refreshMapNodes(); }catch(e){}
  try{ if(typeof updateTransportUI==='function') updateTransportUI(); }catch(e){}
  try{ if(typeof window.ensureOrderUI==='function') window.ensureOrderUI(key); }catch(e){}
  try{ if(typeof window.buildMeans==='function') window.buildMeans(key); }catch(e){}
  try{ if(typeof window.updateTabLabels==='function') window.updateTabLabels(); }catch(e){}
  try{ if(typeof updatePrinceBar==='function') updatePrinceBar(); }catch(e){}
  try{ if(typeof updateHeaderDisplay==='function') updateHeaderDisplay(); }catch(e){}

  return true;
};

// 一本化: 以降のラップを上書き
window.checkOrderComplete = function(key){
  try{
    window.advanceAfterOrderComplete(key);
  }catch(e){
    console.error('checkOrderComplete', e);
  }
};
try{ checkOrderComplete = window.checkOrderComplete; }catch(e){}

/** セーブ救済: 完納済みなのに止まっている / node と order のズレ */
window.recoverNodeProgress = function(){
  var keys = window.PKEYS || ['food','horse','siege','weapon'];
  keys.forEach(function(key){
    if(!gs.sortied || !gs.sortied[key]) return;
    var od = gs.order && gs.order[key];
    var node = gs.node[key]||0;
    if(!od){
      // 依頼がないがノード途中 → 現ノードの依頼を付与
      if(node>=1 && node<=4 && typeof setOrderForNode==='function'){
        setOrderForNode(key, node);
      }
      return;
    }
    // 完納なのに未進行
    if(orderFullyDelivered(od)){
      var on = od.node != null ? od.node : node;
      if(!od._nodeAdvanced || node <= on){
        od._nodeAdvanced = false;
        window.advanceAfterOrderComplete(key);
      }
    } else {
      // order.node と gs.node が違う → 駒を合わせる
      if(od.node != null && gs.node[key] !== od.node){
        // prefer higher progress
        gs.node[key] = Math.max(gs.node[key]||1, od.node);
      }
    }
  });
  try{ if(typeof positionAllPieces==='function') positionAllPieces(); }catch(e){}
};

// tickConvoys 後に確実に
(function(){
  var prev = window.tickConvoys || (typeof tickConvoys==='function'?tickConvoys:null);
  if(typeof prev!=='function') return;
  window.tickConvoys = function(){
    var r = prev.apply(this, arguments);
    try{
      var keys = window.PKEYS || ['food','horse','siege','weapon'];
      keys.forEach(function(k){
        var od = gs.order && gs.order[k];
        if(orderFullyDelivered(od)) window.advanceAfterOrderComplete(k);
      });
      if(typeof positionAllPieces==='function') positionAllPieces();
    }catch(e){}
    return r;
  };
  try{ tickConvoys = window.tickConvoys; }catch(e){}
})();

// 輸送・結果・手紙で救済
(function(){
  var _sp = window.setPhase;
  if(typeof _sp!=='function') return;
  window.setPhase = function(p){
    var r = _sp.apply(this, arguments);
    if(p==='transport' || p==='result' || p==='letter' || p==='management'){
      setTimeout(function(){
        try{ window.recoverNodeProgress(); }catch(e){}
        try{ if(typeof positionAllPieces==='function') positionAllPieces(); }catch(e){}
      }, 40);
    }
    return r;
  };
  try{ setPhase = window.setPhase; }catch(e){}
})();

(function(){
  var prev = window.updateTransportUI || (typeof updateTransportUI==='function'?updateTransportUI:null);
  if(typeof prev!=='function') return;
  window.updateTransportUI = function(){
    try{ window.recoverNodeProgress(); }catch(e){}
    prev();
    try{ if(typeof positionAllPieces==='function') positionAllPieces(); }catch(e){}
  };
  try{ updateTransportUI = window.updateTransportUI; }catch(e){}
})();

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    try{ window.recoverNodeProgress(); }catch(e){}
    try{ if(typeof positionAllPieces==='function') positionAllPieces(); }catch(e){}
  }, 250);
});

console.log('[node advance piece] ready');
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
console.log('DONE', { fail, ready: h.includes('[node advance piece] ready') });
