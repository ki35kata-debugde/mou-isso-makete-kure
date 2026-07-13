/**
 * Bugfix: convoy UI, phase hide, ETA from build_cells, sortie transport lock, W1 sword, ui_strings
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/kzawa/Downloads/Grok';
const DATA = path.join(ROOT, 'data');
const HTML_PATH = path.join(ROOT, 'mou_isso_v0_6.html');

const uiStrings = JSON.parse(fs.readFileSync(path.join(DATA, 'ui_strings.json'), 'utf8'));

// ensure map_cells.js exists
if (!fs.existsSync(path.join(DATA, 'map_cells.js'))) {
  require('./build_map_cells.js');
}

const ADDON = `
// ═══ Transport/Node fix (safe addon) ═══
// v3 bugfix: build_cells ETA, convoy HTML popup, phase hide, sortie-turn lock
(function(){
'use strict';
var UI_STRINGS = ${JSON.stringify(uiStrings)};
if(typeof CONVOY_ICON_SIZE==='undefined') var CONVOY_ICON_SIZE=56;
var ROUTE_COLOR={weapon:'#a63a2c',siege:'#5a4a7d',horse:'#41756c',food:'#a07417'};
var MEANS_SPEED={jinput:1, cart:1, boat:3, horse:2, wagon:2}; // マス/T
var MEANS_CAP={jinput:1, cart:2, boat:4, horse:2, wagon:4};
var MEANS_LABEL={jinput:'人足', cart:'荷車', boat:'船', horse:'馬', wagon:'馬車'};

function S(key, fb){ return (UI_STRINGS&&UI_STRINGS[key])||fb||key; }

function ensureState(){
  if(!gs.node)gs.node={food:0,horse:0,siege:0,weapon:0};
  if(!gs.order)gs.order={food:null,horse:null,siege:null,weapon:null};
  if(!gs.orderMissTurns)gs.orderMissTurns={food:0,horse:0,siege:0,weapon:0};
  if(!gs.orderLocked)gs.orderLocked={food:false,horse:false,siege:false,weapon:false};
  if(!gs.cleared)gs.cleared={food:[],horse:[],siege:[],weapon:[]};
  if(!gs.convoys)gs.convoys=[];
  if(gs.ranchHorses==null)gs.ranchHorses=0;
  if(!gs.sortieAvailableTurn)gs.sortieAvailableTurn={food:null,horse:null,siege:null,weapon:null};
  if(!gs.sortieTurn)gs.sortieTurn={food:null,horse:null,siege:null,weapon:null};
  if(!gs.letterFlags)gs.letterFlags={used:{},serial:{},justEntered:{food:false,horse:false,siege:false,weapon:false}};
  if(!gs.letterFlags.justEntered)gs.letterFlags.justEntered={food:false,horse:false,siege:false,weapon:false};
  if(!gs.tech)gs.tech={};
}
ensureState();

function isMeansUnlocked(m){
  ensureState();
  if(m==='jinput')return true;
  if(m==='cart')return (gs.cleared.food||[]).indexOf(1)>=0;
  if(m==='boat')return (gs.cleared.food||[]).indexOf(2)>=0;
  if(m==='horse')return (gs.ranchHorses||0)>0;
  if(m==='wagon')return (gs.cleared.horse||[]).indexOf(2)>=0 && isMeansUnlocked('cart') && (gs.ranchHorses||0)>0;
  return false;
}
function meansUnlockHint(m){
  if(m==='cart')return S('means_locked_cart','兵糧ルート ノード1撃破で解禁');
  if(m==='boat')return S('means_locked_boat','兵糧ルート ノード2撃破で解禁');
  if(m==='horse')return S('means_locked_horse','牧場で馬を所有すると解禁');
  if(m==='wagon')return S('means_locked_wagon','馬ルート ノード2撃破＋荷車＋馬で解禁');
  return '';
}

function getNodeOrderDef(key,node){
  var tree=(CFG.node_orders&&CFG.node_orders[key])||(typeof GAME_DATA!=='undefined'&&GAME_DATA.node_orders&&GAME_DATA.node_orders[key]);
  if(!tree)return null;
  return tree[String(node)]||null;
}
function setOrderForNode(key,node,force){
  ensureState();
  if(!force&&gs.orderLocked[key]&&gs.order[key]&&gs.order[key].node===node)return;
  var od=getNodeOrderDef(key,node);
  if(!od){gs.order[key]=null;gs.orderLocked[key]=false;return;}
  gs.order[key]={
    label:od.label,
    items:(od.items||[]).map(function(it){return {id:it.id,label:it.label,qty:it.qty,delivered:0};}),
    deadline:od.deadline,
    deadlineMax:od.deadline,
    node:node
  };
  gs.orderMissTurns[key]=0;
  gs.orderLocked[key]=true;
}
function orderLabel(key){
  return (gs.order[key]&&gs.order[key].label)||((CFG.orders&&CFG.orders[key]&&CFG.orders[key].item_label)||'—');
}

/** 首都→ノード(1-based)のマス数 = build_cells の node cell.no */
function masToTarget(route, node1){
  if(typeof masToNode==='function') return masToNode(route, node1);
  return 2;
}
function speedOf(means){ return MEANS_SPEED[means]||1; }
function etaFor(route, node1, means){
  var mas=masToTarget(route, node1||1);
  var sp=speedOf(means);
  return Math.max(1, Math.ceil(mas/sp));
}

// --- pieces ---
function positionPieceAtNode(key){
  ensureState();
  var node=gs.node[key]||0;
  var piece=document.querySelector('.piece[data-route="'+key+'"]');
  if(!piece)return;
  if(node<1){piece.style.display='none';return;}
  piece.style.display='';
  var list=(typeof MAP_CELLS!=='undefined'&&MAP_CELLS.cells[key])||[];
  var c=list.find(function(x){return x.node&&x.nidx===node-1;});
  if(!c)return;
  var w=parseFloat(piece.getAttribute('width')||135);
  piece.setAttribute('x',String(c.x-w/2));
  piece.setAttribute('y',String(c.y-w*0.72));
}
function positionAllPieces(){PKEYS.forEach(positionPieceAtNode);}

// --- node visuals ---
function refreshMapNodes(){
  ensureState();
  document.querySelectorAll('g.node').forEach(function(g){
    var route=g.getAttribute('data-route');
    var idx=parseInt(g.getAttribute('data-idx'),10);
    if(!route||isNaN(idx))return;
    if(g.querySelector('image'))return;
    var list=(typeof MAP_CELLS!=='undefined'&&MAP_CELLS.cells[route])||[];
    var cell=list.find(function(x){return x.node&&x.nidx===idx;});
    var cx=cell?cell.x:0, cy=cell?cell.y:0;
    var color=ROUTE_COLOR[route]||'#888';
    var cur=gs.node[route]||0;
    var curIdx=cur>=1?cur-1:-1;
    var cleared=(gs.cleared[route]||[]).indexOf(idx+1)>=0;
    var isCurrent=curIdx===idx;
    var num=String(idx+1);
    var html='';
    if(isCurrent){
      html='<circle cx="'+cx+'" cy="'+cy+'" r="57" fill="none" stroke="'+color+'" stroke-width="6" opacity="0.9"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="43" fill="#efe4c8" stroke="#2f2619" stroke-width="3.5"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="38" fill="none" stroke="'+color+'" stroke-width="6" opacity="0.95"/>'+
        '<text x="'+cx+'" y="'+(cy+13)+'" text-anchor="middle" font-size="38" font-weight="bold" fill="#4a3b26">'+num+'</text>';
    }else if(cleared){
      html='<circle cx="'+cx+'" cy="'+cy+'" r="43" fill="'+color+'" stroke="#2f2619" stroke-width="3.5"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="38" fill="none" stroke="#e8dcc0" stroke-width="6" opacity="0.95"/>'+
        '<text x="'+cx+'" y="'+(cy+13)+'" text-anchor="middle" font-size="34" font-weight="bold" fill="#efe4c8">✓</text>';
    }else{
      html='<circle cx="'+cx+'" cy="'+cy+'" r="43" fill="#efe4c8" stroke="#2f2619" stroke-width="3.5"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="38" fill="none" stroke="'+color+'" stroke-width="6" opacity="0.95"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="29" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-dasharray="7 8" opacity="0.85"/>'+
        '<text x="'+cx+'" y="'+(cy+13)+'" text-anchor="middle" font-size="38" font-weight="bold" fill="#4a3b26">'+num+'</text>';
    }
    g.innerHTML=html;
  });
}

function stockOf(id){
  if(id==='food')return gs.inv.food||0;
  if(id==='sword')return gs.stock.sword||0;
  if(id==='siege_w')return gs.stock.siege_w||0;
  if(id==='med')return gs.stock.med||0;
  if(id==='horse')return gs.ranchHorses||0;
  if(id==='crossbow2')return 0; // 未解禁の代替在庫なし（表示0）
  return 0;
}
function takeStock(id,q){
  if(id==='food')gs.inv.food=Math.max(0,(gs.inv.food||0)-q);
  else if(id==='sword')gs.stock.sword=Math.max(0,(gs.stock.sword||0)-q);
  else if(id==='siege_w')gs.stock.siege_w=Math.max(0,(gs.stock.siege_w||0)-q);
  else if(id==='med')gs.stock.med=Math.max(0,(gs.stock.med||0)-q);
  else if(id==='horse')gs.ranchHorses=Math.max(0,(gs.ranchHorses||0)-q);
}

function canTransportThisTurn(key){
  ensureState();
  if((gs.node[key]||0)<1)return false;
  // 出立したターンは送れない
  if(gs.sortieTurn[key]!=null && gs.turn<=gs.sortieTurn[key])return false;
  return true;
}

function rebuildMeans(key){
  var nt=document.getElementById('normal-trans-'+key); if(!nt)return;
  var row=document.getElementById('means-'+key);
  if(!row){ row=document.createElement('div'); row.id='means-'+key; row.className='means-row'; nt.insertBefore(row, nt.firstChild); }
  var list=[
    {id:'jinput',t:'人足（積載1）'},
    {id:'cart',t:'荷車（積載2）'},
    {id:'boat',t:'船（積載4）'},
    {id:'horse',t:'馬（積載2）'},
    {id:'wagon',t:'馬車（積載4）'}
  ];
  var html='';
  list.forEach(function(o){
    if(isMeansUnlocked(o.id)){
      html+='<button type="button" class="means-btn" onclick="selectMeans(\\''+key+'\\',\\''+o.id+'\\',this)">'+o.t+'</button>';
    }else{
      html+='<button type="button" class="means-btn" disabled title="'+meansUnlockHint(o.id)+'" style="opacity:.4">'+o.t+'🔒</button>';
    }
  });
  row.innerHTML=html;
  if(!document.getElementById('tinfo-'+key)){
    var info=document.createElement('div'); info.className='tp-info'; info.id='tinfo-'+key;
    info.textContent='輸送手段を選択（初期は人足のみ）';
    nt.appendChild(info);
  }
  if(!document.getElementById('go-'+key)){
    var go=document.createElement('button');
    go.className='go-btn'; go.id='go-'+key; go.disabled=true;
    go.textContent='Go → 出発';
    go.onclick=function(){goTransport(key);};
    nt.appendChild(go);
  }
  var cur=gs.transport[key]&&gs.transport[key].means;
  if(cur){
    row.querySelectorAll('.means-btn:not([disabled])').forEach(function(b){
      if((b.getAttribute('onclick')||'').indexOf("'"+cur+"'")>=0)b.classList.add('active');
    });
  }
}

selectMeans=function(prince,means,btn){
  if(!isMeansUnlocked(means)){showToast(meansUnlockHint(means)||'未解禁');return;}
  if(!canTransportThisTurn(prince)){showToast(S('transport_after_sortie_hint','出立したターンは輸送できません'));return;}
  gs.transport[prince]=gs.transport[prince]||{};
  gs.transport[prince].means=means;
  document.querySelectorAll('#means-'+prince+' .means-btn').forEach(function(b){b.classList.remove('active');});
  if(btn)btn.classList.add('active');
  var node=gs.node[prince]||1;
  var eta=etaFor(prince,node,means);
  var cap=MEANS_CAP[means]||1;
  var ti=document.getElementById('tinfo-'+prince);
  if(ti)ti.textContent=(MEANS_LABEL[means]||means)+' 積載'+cap+'　あと'+eta+'Tで到着（ノード'+node+'）';
  var go=document.getElementById('go-'+prince);
  if(go){go.disabled=false; go.className='go-btn';}
};

function ensureOrderUI(key){
  var nt=document.getElementById('normal-trans-'+key); if(!nt)return;
  // remove static weapon/siege item rows left from template (弩固定など)
  Array.prototype.slice.call(nt.querySelectorAll('.item-row')).forEach(function(el){
    if(!el.closest('#titems-'+key)) el.remove();
  });
  var sum=document.getElementById('order-sum-'+key);
  if(!sum){ sum=document.createElement('div'); sum.id='order-sum-'+key; sum.className='tp-info'; sum.style.marginBottom='8px'; nt.insertBefore(sum, nt.firstChild); }
  var od=gs.order[key]; var node=gs.node[key]||0;
  if(od){
    var prog=(od.items||[]).map(function(it){return it.label+':'+(it.delivered||0)+'/'+it.qty;}).join('　');
    sum.innerHTML='<b>ノード'+node+' 依頼</b>：'+od.label+'　納期残 <b>'+od.deadline+'</b>T<br><small>'+prog+'</small>';
  }else sum.textContent='依頼なし';
  var box=document.getElementById('titems-'+key);
  if(!box){ box=document.createElement('div'); box.id='titems-'+key; var means=document.getElementById('means-'+key); if(means)means.after(box); else nt.appendChild(box); }
  if(!od||!od.items){box.innerHTML='';return;}
  var html='';
  od.items.forEach(function(it){
    var qk=key+'_'+it.id;
    if(typeof qtys!=='undefined'&&qtys[qk]==null)qtys[qk]=0;
    var q=(typeof qtys!=='undefined'?qtys[qk]:0)||0;
    html+='<div class="item-row"><div class="item-info"><div class="item-name">'+it.label+
      '</div><div class="item-stock">現庫:<b>'+stockOf(it.id)+'</b> 依頼:'+it.qty+' 到着済:'+(it.delivered||0)+
      '</div></div><div class="item-qty-large">'+
      '<button class="qty-btn-lg" onclick="changeQty(\\''+key+'\\',\\''+it.id+'\\',-1)">－</button>'+
      '<span class="qty-val-lg" id="qty-'+key+'-'+it.id+'">'+q+'</span>'+
      '<button class="qty-btn-lg" onclick="changeQty(\\''+key+'\\',\\''+it.id+'\\',1)">＋</button></div></div>';
  });
  box.innerHTML=html;
}

changeQty=function(prince,item,delta){
  var key=prince+'_'+item;
  var avail=stockOf(item);
  qtys[key]=Math.max(0,Math.min(avail,(qtys[key]||0)+delta));
  var el=document.getElementById('qty-'+prince+'-'+item); if(el)el.textContent=qtys[key];
};

function iconHref(means){
  var I=(typeof TRANSPORT_ICONS!=='undefined'&&TRANSPORT_ICONS)||{};
  return I[means]||I.jinput||'';
}

/** HTML overlay convoys on #map-wrap (percent of 1100 viewBox) */
function renderConvoys(){
  ensureState();
  var wrap=document.getElementById('map-wrap'); if(!wrap)return;
  if(getComputedStyle(wrap).position==='static') wrap.style.position='relative';
  var layer=document.getElementById('convoy-html-layer');
  if(!layer){
    layer=document.createElement('div');
    layer.id='convoy-html-layer';
    layer.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:12;';
    wrap.appendChild(layer);
  }
  layer.innerHTML='';
  (gs.convoys||[]).forEach(function(cv){
    var node=cv.targetNode||gs.node[cv.route]||1;
    var pos;
    if(typeof posForConvoy==='function'){
      pos=posForConvoy(cv.route, node, cv.eta, cv.etaMax);
    }else{
      pos={x:500,y:500};
    }
    // viewBox 0 0 1100 1100 → percent
    var left=(pos.x/1100)*100;
    var top=(pos.y/1100)*100;
    var color=ROUTE_COLOR[cv.route]||'#333';
    var cargo=(cv.cargo||[]).map(function(c){return c.label+'×'+c.qty;}).join('、');
    var title=(MEANS_LABEL[cv.means]||cv.means)+' → '+(PNAMES[cv.route]||cv.route)+'（'+(PDIRS[cv.route]||'')+'）';
    var href=iconHref(cv.means);
    var el=document.createElement('div');
    el.className='convoy-wrap open';
    el.style.cssText='left:'+left+'%;top:'+top+'%;transform:translate(-50%,-50%);pointer-events:auto;';
    el.innerHTML=
      '<div class="convoy-icon" style="border-color:'+color+'">'+(href?'<img src="'+href+'" style="width:28px;height:28px;object-fit:contain">':'📦')+'</div>'+
      '<div class="convoy-popup" style="display:block">'+
      '<div class="cb-title" style="color:'+color+'">'+title+'</div>'+
      '<div>'+cargo+'</div>'+
      '<div style="color:'+color+';font-weight:700">あと '+cv.eta+'T</div></div>';
    layer.appendChild(el);
  });
}

function markNodeCleared(key,node){
  ensureState();
  if((gs.cleared[key]||[]).indexOf(node)<0) gs.cleared[key].push(node);
  if(key==='food'&&node===1)showToast('🔓 荷車が解禁されました');
  if(key==='food'&&node===2)showToast('🔓 船が解禁されました');
  if(key==='horse'&&node===2)showToast('🔓 馬車技術が解禁されました');
  refreshMapNodes();
}
function checkOrderComplete(key){
  var od=gs.order[key]; if(!od||!od.items)return;
  if(od.items.every(function(it){return (it.delivered||0)>=it.qty;})){
    var node=od.node||gs.node[key]||1;
    markNodeCleared(key,node);
    gs.orderLocked[key]=false;
    showToast('✓ '+PNAMES[key]+' ノード'+node+' 依頼完納（撃破/クリア）');
  }
}

goTransport=function(prince){
  ensureState();
  if(gs.phase&&gs.phase!=='transport'){showToast('輸送フェーズではありません');return;}
  if(!canTransportThisTurn(prince)){
    showToast(S('transport_after_sortie_hint','出立したターンは輸送できません。翌ターンから送れます'));
    return;
  }
  var means=gs.transport[prince]&&gs.transport[prince].means;
  if(!means||!isMeansUnlocked(means)){showToast('輸送手段を選んでください（初期は人足のみ）');return;}
  var od=gs.order[prince];
  var cargo=[]; var total=0;
  if(od&&od.items){
    od.items.forEach(function(it){
      var q=qtys[prince+'_'+it.id]||0;
      if(q>0){cargo.push({id:it.id,label:it.label,qty:q});total+=q;}
    });
  }
  if(total<=0){showToast('送る数量を指定してください');return;}
  var cap=MEANS_CAP[means]||1;
  if(total>cap){showToast('積載超過（最大'+cap+'）');return;}
  cargo.forEach(function(c){takeStock(c.id,c.qty);});
  var node=gs.node[prince]||1;
  var eta=etaFor(prince,node,means);
  gs.convoys.push({
    id:'cv_'+prince+'_'+Date.now(),
    route:prince, means:means, cargo:cargo,
    eta:eta, etaMax:eta, targetNode:node
  });
  gs.transport[prince]=gs.transport[prince]||{};
  gs.transport[prince].done=true;
  gs.orderMissTurns[prince]=0;
  Object.keys(qtys).forEach(function(k){if(k.startsWith(prince+'_'))qtys[k]=0;});
  var btn=document.getElementById('go-'+prince);
  if(btn){btn.textContent='✓ 出発済み';btn.className='go-btn done-btn';btn.disabled=true;}
  updateHeaderDisplay();updateInvDisplay();updateStockBar();
  ensureOrderUI(prince);renderConvoys();
  showToast(PNAMES[prince]+'へ出発（あと'+eta+'T）');
};

function tickConvoys(){
  ensureState();
  var left=[];
  (gs.convoys||[]).forEach(function(cv){
    cv.eta-=1;
    if(cv.eta<=0){
      var od=gs.order[cv.route];
      if(od&&od.items){
        (cv.cargo||[]).forEach(function(c){
          var it=od.items.find(function(x){return x.id===c.id;});
          if(it)it.delivered=(it.delivered||0)+c.qty;
        });
      }
      showToast('📦 '+PNAMES[cv.route]+'に荷物が到着');
      checkOrderComplete(cv.route);
    }else left.push(cv);
  });
  gs.convoys=left;
  renderConvoys();
}

// --- sortie ---
function updateSortieReadyFlags(){
  ensureState();
  PKEYS.forEach(function(key){
    if(gs.sortied[key])return;
    var ready=gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold;
    if(ready&&gs.sortieAvailableTurn[key]==null){
      gs.sortieAvailableTurn[key]=gs.turn+1;
    }
  });
}
checkSortieConditions=function(){
  ensureState();
  updateSortieReadyFlags();
  PKEYS.forEach(function(key){
    if(gs.sortied[key])return;
    var area=document.getElementById('sortie-area-'+key);
    var btn=document.getElementById('sortie-btn-'+key);
    if(!area||!btn)return;
    var ready=gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold;
    var can=ready&&gs.sortieAvailableTurn[key]!=null&&gs.turn>=gs.sortieAvailableTurn[key]&&!gs.sortieDoneThisTurn;
    area.style.display=ready?'block':'none';
    btn.style.display=can?'block':'none';
  });
};

var __handDeliver=typeof handDeliver==='function'?handDeliver:null;
if(__handDeliver){
  handDeliver=function(key){
    __handDeliver(key);
    if(key==='horse'&&gs.prepDone[key]&&!gs._horsePrepGranted){
      gs.ranchHorses=(gs.ranchHorses||0)+2; gs._horsePrepGranted=true;
    }
    updateSortieReadyFlags(); checkSortieConditions();
  };
}
var __selectChoice=typeof selectChoice==='function'?selectChoice:null;
if(__selectChoice){
  selectChoice=function(key,idx,trust,btn){
    __selectChoice(key,idx,trust,btn);
    updateSortieReadyFlags(); checkSortieConditions();
  };
}

sortie=function(key){
  ensureState();
  if(gs.sortieDoneThisTurn){showToast('このターンはすでに出立させています');return;}
  if(!gs.prepDone[key]||gs.trust[key]<CFG.sortie_trust_threshold)return;
  if(gs.sortieAvailableTurn[key]==null||gs.turn<gs.sortieAvailableTurn[key]){
    showToast(S('sortie_next_turn_hint','出立は準備完了の翌ターンからです'));return;
  }
  if(!confirm(S('sortie_confirm','出立時には他の皇子の出立には手が回らなくなりますがよろしいですか？')))return;
  gs.sortied[key]=true;
  gs.sortieDoneThisTurn=true;
  gs.sortieTurn[key]=gs.turn; // このターンは輸送不可
  gs.node[key]=1;
  gs.letterFlags.justEntered[key]=true;
  gs.orderLocked[key]=false;
  setOrderForNode(key,1,true);
  // safety: never crossbow on N1
  if(key==='weapon'&&gs.order[key]){
    gs.order[key].items=(gs.order[key].items||[]).filter(function(it){return it.id!=='crossbow2';});
    if(!gs.order[key].items.length){
      gs.order[key].items=[{id:'sword',label:'剣★1',qty:4,delivered:0}];
      gs.order[key].label='剣★1×4';
    }
  }
  var btn=document.getElementById('sortie-btn-'+key); if(btn)btn.style.display='none';
  var done=document.getElementById('sortie-done-'+key); if(done)done.style.display='block';
  PKEYS.forEach(function(k){ if(k!==key){ var b=document.getElementById('sortie-btn-'+k); if(b)b.style.display='none'; }});
  document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(function(el){el.style.display='';});
  positionPieceAtNode(key); refreshMapNodes();
  showToast('⚑ '+PNAMES[key]+' 出立 → ノード1（輸送は翌ターンから）');
  updatePrinceBar(); updateTabLabels(); updateTransportUI();
};

updatePrinceBar=function(){
  ensureState();
  PKEYS.forEach(function(key){
    var req=document.getElementById('pc-req-'+key);
    var sub=document.getElementById('pc-sub-'+key);
    var dlEl=document.getElementById('pc-dl-'+key);
    if(!req)return;
    var t=gs.trust[key];
    var q=CFG.prep_quests[key];
    var node=gs.node[key]||0;
    if(node>=1){
      req.textContent=orderLabel(key);
      if(sub)sub.textContent='ノード'+node+((gs.cleared[key]||[]).indexOf(node)>=0?'・クリア済':'・依頼中');
      var od=gs.order[key];
      if(dlEl&&od){
        var urg=od.deadline<=3?'urg':'';
        dlEl.innerHTML='<div class="pc-dl-badge '+urg+'">納期<br><b>'+od.deadline+'</b>T</div>';
      }
    }else if(gs.prepDone[key]&&t>=CFG.sortie_trust_threshold){
      var av=gs.sortieAvailableTurn[key];
      req.textContent='出立準備完了';
      if(sub)sub.textContent=(av!=null&&gs.turn>=av)?'出立可能（今ターン）':'出立は翌ターンから';
      if(dlEl)dlEl.innerHTML='';
    }else if(gs.prepDone[key]){
      req.textContent='準備完了　信頼'+t+'/100';
      if(sub)sub.textContent='あと'+(CFG.sortie_trust_threshold-t)+'で出立可';
      if(dlEl)dlEl.innerHTML='';
    }else{
      req.textContent='準備：'+q.label+'×'+q.qty;
      if(sub)sub.textContent='信頼度'+t+'/100';
      if(dlEl)dlEl.innerHTML='';
    }
  });
};

updateTabLabels=function(){
  ensureState();
  PKEYS.forEach(function(key){
    var req=document.getElementById('ltab-req-'+key);
    var dl=document.getElementById('ltab-dl-'+key);
    var tab=document.getElementById('ptab-'+key);
    var chk=document.getElementById('tab-check-'+key);
    if(chk)chk.textContent=(gs.choices[key]!==undefined)?'☑ ':'';
    var t=gs.trust[key];
    var node=gs.node[key]||0;
    if(node>=1){
      if(req)req.textContent=orderLabel(key);
      if(dl)dl.textContent='ノード'+node;
      if(tab)tab.classList.remove('urg-tab');
    }else if(gs.prepDone[key]){
      if(req)req.textContent='準備完了'; if(dl)dl.textContent='信頼'+t+'/100';
      if(tab)tab.classList.toggle('urg-tab',t>=CFG.sortie_trust_threshold);
    }else{
      var q=CFG.prep_quests[key];
      if(req)req.textContent='準備:'+q.label+'×'+q.qty;
      if(dl)dl.textContent='信頼'+t+'/100';
    }
  });
  var ks=document.getElementById('kg-summary-tab');
  if(ks){
    var parts=[];
    if(gs.kengen&&gs.kengen.shingen)parts.push('進言✓');
    if(gs.kengen&&gs.kengen.kenjou)parts.push('献上✓');
    ks.textContent=parts.length?parts.join(' '):'進言/献上';
  }
};

// hide transport UI outside transport phase
var __setPhase=typeof setPhase==='function'?setPhase:null;
if(__setPhase){
  setPhase=function(p){
    __setPhase(p);
    gs.phase=p;
    var st=document.getElementById('sec-transport');
    var sr=document.getElementById('sec-result');
    var sm=document.getElementById('sec-management');
    if(st) st.style.display=(p==='transport')?'block':'none';
    if(sr) sr.style.display=(p==='result')?'block':'none';
    if(sm) sm.style.display=(p==='management')?'block':'none';
    if(p!=='transport'){
      // force hide any leftover
      if(st) st.style.display='none';
    }
    if(p==='transport') updateTransportUI();
    renderConvoys();
  };
}

updateTransportUI=function(){
  ensureState();
  if(gs.phase&&gs.phase!=='transport'){
    var st=document.getElementById('sec-transport');
    if(st) st.style.display='none';
    return;
  }
  PKEYS.forEach(function(key){
    var pp=document.getElementById('prep-panel-'+key);
    var nt=document.getElementById('normal-trans-'+key);
    var sa=document.getElementById('sortie-area-'+key);
    var node=gs.node[key]||0;
    if(node>=1){
      if(pp)pp.style.display='none';
      if(sa)sa.style.display='none';
      if(nt){
        nt.style.display='block';
        rebuildMeans(key);
        ensureOrderUI(key);
        var go=document.getElementById('go-'+key);
        var ti=document.getElementById('tinfo-'+key);
        if(!canTransportThisTurn(key)){
          if(ti)ti.textContent=S('transport_after_sortie_hint','出立したターンは輸送できません。翌ターンから送れます');
          if(go){go.disabled=true; go.textContent='翌ターンから輸送可';}
          // disable means
          var row=document.getElementById('means-'+key);
          if(row) row.querySelectorAll('.means-btn').forEach(function(b){b.disabled=true; b.style.opacity='.4';});
        }else if(gs.transport[key]&&gs.transport[key].done){
          if(go){go.textContent='✓ 出発済み';go.className='go-btn done-btn';go.disabled=true;}
        }
      }
    }else{
      if(pp)pp.style.display='block';
      if(nt)nt.style.display='none';
      if(sa)sa.style.display=(gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold)?'block':'none';
    }
    var hb=document.getElementById('hand-btn-'+key);
    if(hb&&gs.prepDone[key]){hb.textContent='✓ 手渡し済み';hb.className='hand-btn done';hb.disabled=true;}
    checkSortieConditions();
  });
  renderConvoys();
  var ranch=document.getElementById('card-ranch');
  if(ranch&&!document.getElementById('ranch-horse-btn')){
    var body=ranch.querySelector('.card-body');
    if(body){
      var d=document.createElement('div'); d.style.marginTop='8px';
      d.innerHTML='<div style="font-size:11px;color:var(--faded)">牧場の馬: <b id="ranch-horse-count">0</b>頭</div>'+
        '<button class="btn-sm" id="ranch-horse-btn" onclick="buyRanchHorse()">馬を増やす（金40）</button>';
      body.appendChild(d);
    }
  }
  var rc=document.getElementById('ranch-horse-count'); if(rc)rc.textContent=String(gs.ranchHorses||0);
};

window.buyRanchHorse=function(){
  if(gs.gold<40){showToast('金が足りません');return;}
  gs.gold-=40; gs.ranchHorses=(gs.ranchHorses||0)+1;
  updateHeaderDisplay(); updateTransportUI();
  showToast('牧場の馬 +1（'+gs.ranchHorses+'頭）');
};

// letter demand continuity
var __renderLetter=typeof renderLetter==='function'?renderLetter:null;
if(__renderLetter){
  renderLetter=function(key){
    __renderLetter(key);
    ensureState();
    if((gs.node[key]||0)>=1&&gs.order[key]&&!(gs.letterFlags.justEntered&&gs.letterFlags.justEntered[key])){
      var dem=document.getElementById('lt-'+key+'-demand');
      if(dem){
        var od=gs.order[key];
        var miss=gs.orderMissTurns[key]||0;
        var from=PNAMES[key]+'（'+PDIRS[key]+'）ノード'+gs.node[key]+'より';
        var body=miss>=(CFG.remind_after_turns||3)
          ? ('……荷が届かぬ。催促する。\\n\\n【催促・継続】'+od.label+'　納期残：'+od.deadline+'ターン')
          : ('前線より。依頼は継続中（新規ではない）。\\n\\n【継続依頼】'+od.label+'　納期残：'+od.deadline+'ターン');
        dem.innerHTML='<div class="letter-block"><div class="letter-from">'+from+'</div><div class="letter-text">'+body+'</div></div>';
      }
    }
  };
}

var __goNext=goToNextTurn;
goToNextTurn=function(){
  ensureState();
  PKEYS.forEach(function(key){
    if((gs.node[key]||0)>=1&&gs.order[key]){
      if(gs.order[key].deadline>0)gs.order[key].deadline--;
      var tr=gs.transport[key];
      if(!(tr&&tr.done))gs.orderMissTurns[key]=(gs.orderMissTurns[key]||0)+1;
      else gs.orderMissTurns[key]=0;
    }
  });
  tickConvoys();
  __goNext();
  ensureState();
  PKEYS.forEach(function(k){ if(gs.letterFlags&&gs.letterFlags.justEntered) gs.letterFlags.justEntered[k]=false; });
  updateSortieReadyFlags();
  updatePrinceBar(); updateTabLabels();
  refreshMapNodes(); positionAllPieces(); renderConvoys();
};

var __apply=typeof applySaveData==='function'?applySaveData:null;
if(__apply){
  applySaveData=function(data){
    var ok=__apply(data);
    ensureState();
    PKEYS.forEach(function(key){
      if(gs.sortied[key]&&!(gs.node[key]>0)){
        gs.node[key]=1;
        if(!gs.order[key]){gs.orderLocked[key]=false;setOrderForNode(key,1,true);}
      }
      // fix bad crossbow orders on node 1
      if(key==='weapon'&&gs.node[key]===1&&gs.order[key]&&gs.order[key].items){
        if(gs.order[key].items.some(function(it){return it.id==='crossbow2';})){
          setOrderForNode(key,1,true);
        }
      }
    });
    updatePrinceBar();updateTabLabels();updateTransportUI();
    refreshMapNodes();positionAllPieces();renderConvoys();
    return ok;
  };
}

function bootAddon(){
  ensureState();
  ['food','horse','siege','weapon'].forEach(function(key){
    var nt=document.getElementById('normal-trans-'+key);
    if(!nt)return;
    if(nt.querySelector('p')&&!document.getElementById('means-'+key)) nt.innerHTML='';
  });
  PKEYS.forEach(function(key){
    if((gs.node[key]||0)<1)
      document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(function(el){el.style.display='none';});
  });
  refreshMapNodes(); positionAllPieces(); renderConvoys();
  updateSortieReadyFlags(); checkSortieConditions();
  var btn=document.getElementById('ph-letter-complete');
  if(btn){ btn.disabled=false; btn.setAttribute('onclick','tryGoToMgmt()'); }
  // hide transport if not in that phase
  if(gs.phase&&gs.phase!=='transport'){
    var st=document.getElementById('sec-transport');
    if(st) st.style.display='none';
  }
}
document.addEventListener('DOMContentLoaded',function(){ setTimeout(bootAddon,0); });
if(document.readyState!=='loading') setTimeout(bootAddon,0);
})();
`;

let html = fs.readFileSync(HTML_PATH, 'utf8');
fs.writeFileSync(HTML_PATH + '.bak_before_bugfix', html, 'utf8');
console.log('backup ok');

// inject map_cells.js + ui strings near other data scripts
if (!html.includes('map_cells.js')) {
  const inject =
    '<script src="./data/map_cells.js"></script>\n' +
    '<script>window.UI_STRINGS=window.UI_STRINGS||' +
    JSON.stringify(uiStrings) +
    ';</script>\n';
  if (html.includes('transport_icons.js')) {
    html = html.replace(
      '<script src="./data/transport_icons.js"></script>',
      '<script src="./data/transport_icons.js"></script>\n' + inject
    );
  } else if (html.includes('game-data.js')) {
    html = html.replace(
      '<script src="./data/game-data.js"></script>',
      '<script src="./data/game-data.js"></script>\n' + inject
    );
  } else {
    html = html.replace('<div id="toast"></div>', '<div id="toast"></div>\n' + inject);
  }
  console.log('injected map_cells + UI_STRINGS');
} else {
  // refresh inline UI_STRINGS
  html = html.replace(
    /window\.UI_STRINGS=window\.UI_STRINGS\|\|\{[\s\S]*?\};/,
    'window.UI_STRINGS=window.UI_STRINGS||' + JSON.stringify(uiStrings) + ';'
  );
}

// Replace existing Transport/Node fix addon block
const START = '// ═══ Transport/Node fix (safe addon) ═══';
const MARKER = "document.addEventListener('DOMContentLoaded',()=>{\n  document.querySelectorAll('.node')";
const startIdx = html.indexOf(START);
const markIdx = html.indexOf(MARKER);
if (startIdx >= 0 && markIdx > startIdx) {
  html = html.slice(0, startIdx) + ADDON + '\n' + html.slice(markIdx);
  console.log('replaced addon block');
} else if (markIdx >= 0) {
  html = html.slice(0, markIdx) + ADDON + '\n' + html.slice(markIdx);
  console.log('inserted addon before map DOMContentLoaded');
} else {
  console.error('marker missing');
  process.exit(1);
}

// Merge UI_STRINGS into GAME_DATA inline if present
if (html.includes('window.GAME_DATA=window.GAME_DATA||')) {
  try {
    const m = html.match(/window\.GAME_DATA=window\.GAME_DATA\|\|(\{[\s\S]*?\});/);
    if (m) {
      const gd = JSON.parse(m[1]);
      gd.ui_strings = uiStrings;
      // ensure weapon N1
      if (gd.node_orders && gd.node_orders.weapon && gd.node_orders.weapon['1']) {
        gd.node_orders.weapon['1'] = {
          label: '剣★1×4',
          items: [{ id: 'sword', label: '剣★1', qty: 4 }],
          deadline: 8,
          carts: 2,
        };
      }
      if (gd.orders && gd.orders.weapon) {
        gd.orders.weapon = { item_label: '剣★1×4', deadline: 8 };
      }
      html = html.replace(m[0], 'window.GAME_DATA=window.GAME_DATA||' + JSON.stringify(gd) + ';');
      console.log('updated GAME_DATA weapon N1 + ui_strings');
    }
  } catch (e) {
    console.log('GAME_DATA parse skip', e.message);
  }
}

// Strip static 弩 label in weapon transport if present as only item-name
html = html.replace(
  /(<div id="normal-trans-weapon"[^>]*>[\s\S]*?<div class="item-name">)弩\s*★2(<\/div>)/,
  '$1剣 ★1$2'
);

fs.writeFileSync(HTML_PATH, html, 'utf8');
console.log('HTML', html.length);

// syntax check large scripts
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let mm;
let n = 0;
while ((mm = re.exec(html))) {
  if (!mm[1] || mm[1].length < 300) continue;
  try {
    new Function(mm[1]);
    console.log('OK', n, mm[1].length);
  } catch (e) {
    console.error('FAIL', n, e.message);
    process.exit(1);
  }
  n++;
}

// write ui_strings into game-data.js too
const gdPath = path.join(DATA, 'game-data.js');
if (fs.existsSync(gdPath)) {
  let t = fs.readFileSync(gdPath, 'utf8');
  const j = JSON.parse(t.replace(/^window\.GAME_DATA\s*=\s*/, '').replace(/;\s*$/, ''));
  j.ui_strings = uiStrings;
  if (j.node_orders && j.node_orders.weapon) {
    j.node_orders.weapon['1'] = {
      label: '剣★1×4',
      items: [{ id: 'sword', label: '剣★1', qty: 4 }],
      deadline: 8,
      carts: 2,
    };
  }
  if (j.orders) j.orders.weapon = { item_label: '剣★1×4', deadline: 8 };
  fs.writeFileSync(gdPath, 'window.GAME_DATA = ' + JSON.stringify(j, null, 2) + ';\n', 'utf8');
  console.log('game-data.js updated');
}

console.log('DONE');
console.log({
  addon: html.includes('v3 bugfix'),
  mapCells: html.includes('map_cells.js'),
  uiStrings: html.includes('sortie_confirm'),
  convoyHtml: html.includes('convoy-html-layer') || html.includes('renderConvoys'),
});
