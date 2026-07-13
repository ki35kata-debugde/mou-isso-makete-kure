/**
 * Safe transport/node fix (plan re-apply, no full FIX v2 rewrite of everything)
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = 'C:/Users/kzawa/Downloads/Grok';
const DATA = path.join(ROOT, 'data');
const HTML_PATH = path.join(ROOT, 'mou_isso_v0_6.html');

// ── 1) Build transport_icons.js from assets ──
function b64File(p) {
  return fs.readFileSync(p).toString('base64');
}
function findAsset(zipList, names) {
  // extract from zip via powershell to temp
  return null;
}

// Extract selected files from assets.zip
const extractDir = path.join(DATA, '_icons');
fs.mkdirSync(extractDir, { recursive: true });
const iconMap = {
  cart: 'icon_cart.png',
  boat: 'icon_boat.png',
  wagon: 'icon_wagon.png',
};
// Use Expand-Archive is whole zip - use .NET
const zipPath = path.join(ROOT, 'assets.zip');
execSync(
  `powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; $z=[IO.Compression.ZipFile]::OpenRead('${zipPath.replace(/'/g, "''")}'); foreach($n in @('assets/icon_cart.png','assets/icon_boat.png','assets/icon_wagon.png','assets/Horse_★1.png','assets/Horse_★1.png')){ $e=$z.Entries|?{ $_.FullName -eq $n -or $_.FullName -like ('*' + ($n -replace 'assets/','')) }; if(-not $e){ $e=$z.Entries|?{ $_.Name -like '*cart*' -or $_.Name -like '*boat*' -or $_.Name -like '*wagon*' -or $_.Name -like 'Horse*' } | Select-Object -First 20 } }; $z.Entries | ForEach-Object { $name=$_.Name; if($name -match 'icon_cart|icon_boat|icon_wagon|Horse'){ $dest=Join-Path '${extractDir.replace(/\\/g,'/')}' $name; [IO.Directory]::CreateDirectory((Split-Path $dest))|Out-Null; [IO.Compression.ZipFileExtensions]::ExtractToFile($_, $dest, $true) } }; $z.Dispose()"`,
  { stdio: 'pipe' }
);

// List extracted
const extracted = fs.existsSync(extractDir) ? fs.readdirSync(extractDir) : [];
console.log('extracted icons', extracted);

function findLocal(patterns) {
  for (const f of extracted) {
    for (const p of patterns) {
      if (f.toLowerCase().includes(p.toLowerCase()) || f.includes(p)) {
        return path.join(extractDir, f);
      }
    }
  }
  return null;
}

const porterPath = path.join(ROOT, '輸送_人.png');
const cartPath = findLocal(['icon_cart', 'cart']) || path.join(ROOT, 'assets', 'icon_cart.png');
const boatPath = findLocal(['icon_boat', 'boat']);
const wagonPath = findLocal(['icon_wagon', 'wagon']);
const horsePath = findLocal(['Horse', 'horse']);

function dataUrl(filePath, mime) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  const b = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${b}`;
}

const ICONS = {
  jinput: dataUrl(porterPath, 'image/png'),
  cart: dataUrl(cartPath, 'image/png'),
  boat: dataUrl(boatPath, 'image/png'),
  wagon: dataUrl(wagonPath, 'image/png'),
  horse: dataUrl(horsePath, 'image/png'),
};
console.log(
  'icons present',
  Object.fromEntries(Object.entries(ICONS).map(([k, v]) => [k, !!v && v.length > 100]))
);

fs.writeFileSync(
  path.join(DATA, 'transport_icons.js'),
  'window.TRANSPORT_ICONS = ' + JSON.stringify(ICONS) + ';\n',
  'utf8'
);

// ── 2) NODE coords from README ──
const NODE_COORDS = {
  weapon: [
    [372, 668],
    [612, 772],
    [382, 902],
    [646, 1022],
  ],
  siege: [
    [312, 558],
    [152, 682],
    [108, 420],
    [122, 168],
  ],
  horse: [
    [556, 352],
    [362, 176],
    [662, 248],
    [824, 70],
  ],
  food: [
    [690, 540],
    [838, 478],
    [896, 684],
    [1034, 572],
  ],
};
const ROUTE_START = {
  weapon: [492, 588],
  siege: [412, 512],
  horse: [512, 412],
  food: [608, 528],
};
const ROUTE_COLOR = {
  weapon: '#a63a2c',
  siege: '#5a4a7d',
  horse: '#41756c',
  food: '#a07417',
};

// ── 3) ADDON JS ──
const ADDON = `
// ═══ Transport/Node fix (safe addon) ═══
(function(){
'use strict';
if(typeof NODE_COORDS==='undefined'){
  var NODE_COORDS=${JSON.stringify(NODE_COORDS)};
  var ROUTE_START=${JSON.stringify(ROUTE_START)};
  var ROUTE_COLOR=${JSON.stringify(ROUTE_COLOR)};
}
if(typeof CONVOY_ICON_SIZE==='undefined') var CONVOY_ICON_SIZE=56;
var MEANS_META={
  jinput:{label:'人足',cap:1,eta:5},
  cart:{label:'荷車',cap:2,eta:4},
  boat:{label:'船',cap:4,eta:3},
  horse:{label:'馬',cap:2,eta:3},
  wagon:{label:'馬車',cap:4,eta:2}
};
var PATH_ID={food:'rt_food',horse:'rt_horse',siege:'rt_siege',weapon:'rt_weapon'};

function ensureState(){
  if(!gs.node)gs.node={food:0,horse:0,siege:0,weapon:0};
  if(!gs.order)gs.order={food:null,horse:null,siege:null,weapon:null};
  if(!gs.orderMissTurns)gs.orderMissTurns={food:0,horse:0,siege:0,weapon:0};
  if(!gs.orderLocked)gs.orderLocked={food:false,horse:false,siege:false,weapon:false};
  if(!gs.cleared)gs.cleared={food:[],horse:[],siege:[],weapon:[]};
  if(!gs.convoys)gs.convoys=[];
  if(gs.ranchHorses==null)gs.ranchHorses=0;
  if(!gs.sortieAvailableTurn)gs.sortieAvailableTurn={food:null,horse:null,siege:null,weapon:null};
  if(!gs.letterFlags)gs.letterFlags={used:{},serial:{},justEntered:{food:false,horse:false,siege:false,weapon:false}};
  if(!gs.letterFlags.justEntered)gs.letterFlags.justEntered={food:false,horse:false,siege:false,weapon:false};
  if(!gs.tech)gs.tech={}; // derived from cleared, kept for save
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
  if(m==='cart')return '兵糧ルート ノード1撃破で解禁';
  if(m==='boat')return '兵糧ルート ノード2撃破で解禁';
  if(m==='horse')return '牧場で馬を所有すると解禁';
  if(m==='wagon')return '馬ルート ノード2撃破＋荷車＋馬で解禁';
  return '';
}

function getNodeOrderDef(key,node){
  const tree=(CFG.node_orders&&CFG.node_orders[key])||(typeof GAME_DATA!=='undefined'&&GAME_DATA.node_orders&&GAME_DATA.node_orders[key]);
  if(!tree)return null;
  return tree[String(node)]||null;
}
function setOrderForNode(key,node,force){
  ensureState();
  if(!force&&gs.orderLocked[key]&&gs.order[key]&&gs.order[key].node===node)return;
  const od=getNodeOrderDef(key,node);
  if(!od){gs.order[key]=null;gs.orderLocked[key]=false;return;}
  gs.order[key]={
    label:od.label,
    items:(od.items||[]).map(it=>({id:it.id,label:it.label,qty:it.qty,delivered:0})),
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

// --- piece position (README coords) ---
function positionPieceAtNode(key){
  ensureState();
  const node=gs.node[key]||0;
  const piece=document.querySelector('.piece[data-route="'+key+'"]');
  if(!piece)return;
  if(node<1){piece.style.display='none';return;}
  piece.style.display='';
  const coords=NODE_COORDS[key];
  if(!coords||!coords[node-1])return;
  const [cx,cy]=coords[node-1];
  const w=parseFloat(piece.getAttribute('width')||135);
  piece.setAttribute('x',String(cx-w/2));
  piece.setAttribute('y',String(cy-w*0.72));
}
function positionAllPieces(){PKEYS.forEach(positionPieceAtNode);}

// --- node visuals ---
function refreshMapNodes(){
  ensureState();
  document.querySelectorAll('g.node').forEach(g=>{
    const route=g.getAttribute('data-route');
    const idx=parseInt(g.getAttribute('data-idx'),10);
    if(!route||isNaN(idx))return;
    const hasImg=!!g.querySelector('image');
    if(hasImg)return; // keep fortress art
    const cxAttr=(g.querySelector('circle')||{}).getAttribute?.('cx');
    const cyAttr=(g.querySelector('circle')||{}).getAttribute?.('cy');
    const coords=NODE_COORDS[route];
    const cx=cxAttr|| (coords&&coords[idx]?coords[idx][0]:0);
    const cy=cyAttr|| (coords&&coords[idx]?coords[idx][1]:0);
    const color=ROUTE_COLOR[route]||'#888';
    const cur=gs.node[route]||0;
    const curIdx=cur>=1?cur-1:-1;
    const cleared=(gs.cleared[route]||[]).indexOf(idx+1)>=0;
    const isCurrent=curIdx===idx;
    const num=String(idx+1);
    let html='';
    if(isCurrent){
      html=
        '<circle cx="'+cx+'" cy="'+cy+'" r="57" fill="none" stroke="'+color+'" stroke-width="6" opacity="0.9"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="43" fill="#efe4c8" stroke="#2f2619" stroke-width="3.5"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="38" fill="none" stroke="'+color+'" stroke-width="6" opacity="0.95"/>'+
        '<text x="'+cx+'" y="'+(parseFloat(cy)+13)+'" text-anchor="middle" font-size="38" font-weight="bold" fill="#4a3b26">'+num+'</text>';
    }else if(cleared){
      html=
        '<circle cx="'+cx+'" cy="'+cy+'" r="43" fill="'+color+'" stroke="#2f2619" stroke-width="3.5"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="38" fill="none" stroke="#e8dcc0" stroke-width="6" opacity="0.95"/>'+
        '<text x="'+cx+'" y="'+(parseFloat(cy)+13)+'" text-anchor="middle" font-size="34" font-weight="bold" fill="#efe4c8">✓</text>';
    }else{
      html=
        '<circle cx="'+cx+'" cy="'+cy+'" r="43" fill="#efe4c8" stroke="#2f2619" stroke-width="3.5"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="38" fill="none" stroke="'+color+'" stroke-width="6" opacity="0.95"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="29" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-dasharray="7 8" opacity="0.85"/>'+
        '<text x="'+cx+'" y="'+(parseFloat(cy)+13)+'" text-anchor="middle" font-size="38" font-weight="bold" fill="#4a3b26">'+num+'</text>';
    }
    g.innerHTML=html;
  });
}

// --- stock helpers ---
function stockOf(id){
  if(id==='food')return gs.inv.food||0;
  if(id==='sword'||id==='crossbow2')return gs.stock.sword||0;
  if(id==='siege_w')return gs.stock.siege_w||0;
  if(id==='med')return gs.stock.med||0;
  if(id==='horse')return gs.ranchHorses||0;
  return 0;
}
function takeStock(id,q){
  if(id==='food')gs.inv.food=Math.max(0,(gs.inv.food||0)-q);
  else if(id==='sword'||id==='crossbow2')gs.stock.sword=Math.max(0,(gs.stock.sword||0)-q);
  else if(id==='siege_w')gs.stock.siege_w=Math.max(0,(gs.stock.siege_w||0)-q);
  else if(id==='med')gs.stock.med=Math.max(0,(gs.stock.med||0)-q);
  else if(id==='horse')gs.ranchHorses=Math.max(0,(gs.ranchHorses||0)-q);
}

// --- means UI ---
function rebuildMeans(key){
  let row=document.getElementById('means-'+key);
  const nt=document.getElementById('normal-trans-'+key);
  if(!nt)return;
  if(!row){
    row=document.createElement('div');
    row.id='means-'+key;
    row.className='means-row';
    nt.insertBefore(row,nt.firstChild);
  }
  const list=[
    {id:'jinput',t:'人足（積載1）'},
    {id:'cart',t:'荷車（積載2）'},
    {id:'boat',t:'船（積載4）'},
    {id:'horse',t:'馬（積載2）'},
    {id:'wagon',t:'馬車（積載4）'}
  ];
  let html='';
  list.forEach(o=>{
    if(isMeansUnlocked(o.id)){
      html+='<button type="button" class="means-btn" onclick="selectMeans(\\''+key+'\\',\\''+o.id+'\\',this)">'+o.t+'</button>';
    }else{
      html+='<button type="button" class="means-btn" disabled title="'+meansUnlockHint(o.id)+'" style="opacity:.4">'+o.t+'🔒</button>';
    }
  });
  row.innerHTML=html;
  if(!document.getElementById('tinfo-'+key)){
    const info=document.createElement('div');
    info.className='tp-info';info.id='tinfo-'+key;
    info.textContent='輸送手段を選択（初期は人足のみ）';
    nt.appendChild(info);
  }
  if(!document.getElementById('go-'+key)){
    const go=document.createElement('button');
    go.className='go-btn';go.id='go-'+key;go.disabled=true;
    go.textContent='Go → 出発';
    go.onclick=function(){goTransport(key);};
    nt.appendChild(go);
  }
  // restore selection highlight
  const cur=gs.transport[key]&&gs.transport[key].means;
  if(cur){
    row.querySelectorAll('.means-btn:not([disabled])').forEach(b=>{
      if((b.getAttribute('onclick')||'').indexOf("'"+cur+"'")>=0)b.classList.add('active');
    });
  }
}

var __selectMeans=typeof selectMeans==='function'?selectMeans:null;
selectMeans=function(prince,means,btn){
  if(!isMeansUnlocked(means)){showToast(meansUnlockHint(means)||'未解禁');return;}
  gs.transport[prince]=gs.transport[prince]||{};
  gs.transport[prince].means=means;
  document.querySelectorAll('#means-'+prince+' .means-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  const m=MEANS_META[means]||{cap:1,eta:5,label:means};
  const ti=document.getElementById('tinfo-'+prince);
  if(ti)ti.textContent=m.label+' 積載'+m.cap+'　到着予定 約'+m.eta+'T後';
  const go=document.getElementById('go-'+prince);if(go)go.disabled=false;
};

function ensureOrderUI(key){
  const nt=document.getElementById('normal-trans-'+key);if(!nt)return;
  let sum=document.getElementById('order-sum-'+key);
  if(!sum){sum=document.createElement('div');sum.id='order-sum-'+key;sum.className='tp-info';sum.style.marginBottom='8px';nt.insertBefore(sum,nt.firstChild);}
  const od=gs.order[key];const node=gs.node[key]||0;
  if(od){
    const prog=(od.items||[]).map(it=>it.label+':'+(it.delivered||0)+'/'+it.qty).join('　');
    sum.innerHTML='<b>ノード'+node+' 依頼</b>：'+od.label+'　納期残 <b>'+od.deadline+'</b>T<br><small>'+prog+'</small>';
  }else sum.textContent='依頼なし';
  let box=document.getElementById('titems-'+key);
  if(!box){
    box=document.createElement('div');box.id='titems-'+key;
    const means=document.getElementById('means-'+key);
    if(means)means.after(box);else nt.appendChild(box);
  }
  if(!od||!od.items){box.innerHTML='';return;}
  let html='';
  od.items.forEach(it=>{
    const qk=key+'_'+it.id;
    if(typeof qtys!=='undefined'&&qtys[qk]==null)qtys[qk]=0;
    const q=(typeof qtys!=='undefined'?qtys[qk]:0)||0;
    html+='<div class="item-row"><div class="item-info"><div class="item-name">'+it.label+
      '</div><div class="item-stock">現庫:<b>'+stockOf(it.id)+'</b> 依頼:'+it.qty+' 到着済:'+(it.delivered||0)+
      '</div></div><div class="item-qty-large">'+
      '<button class="qty-btn-lg" onclick="changeQty(\\''+key+'\\',\\''+it.id+'\\',-1)">－</button>'+
      '<span class="qty-val-lg" id="qty-'+key+'-'+it.id+'">'+q+'</span>'+
      '<button class="qty-btn-lg" onclick="changeQty(\\''+key+'\\',\\''+it.id+'\\',1)">＋</button></div></div>';
  });
  box.innerHTML=html;
}

var __changeQty=typeof changeQty==='function'?changeQty:null;
changeQty=function(prince,item,delta){
  const key=prince+'_'+item;
  const avail=stockOf(item);
  qtys[key]=Math.max(0,Math.min(avail,(qtys[key]||0)+delta));
  const el=document.getElementById('qty-'+prince+'-'+item);if(el)el.textContent=qtys[key];
};

// --- convoys ---
function iconHref(means){
  const I=(typeof TRANSPORT_ICONS!=='undefined'&&TRANSPORT_ICONS)||{};
  return I[means]||I.jinput||'';
}
function renderConvoys(){
  ensureState();
  const svg=document.querySelector('#map-wrap svg');if(!svg)return;
  let layer=document.getElementById('convoy-layer');
  if(!layer){
    layer=document.createElementNS('http://www.w3.org/2000/svg','g');
    layer.setAttribute('id','convoy-layer');
    svg.appendChild(layer);
  }
  while(layer.firstChild)layer.removeChild(layer.firstChild);
  (gs.convoys||[]).forEach(cv=>{
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','convoy-live');
    g.style.cursor='pointer';
    const size=CONVOY_ICON_SIZE||56;
    const href=iconHref(cv.means);
    if(href){
      const img=document.createElementNS('http://www.w3.org/2000/svg','image');
      img.setAttribute('href',href);
      img.setAttributeNS('http://www.w3.org/1999/xlink','href',href);
      img.setAttribute('width',String(size));
      img.setAttribute('height',String(size));
      img.setAttribute('x',String(-size/2));
      img.setAttribute('y',String(-size/2));
      g.appendChild(img);
    }else{
      const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('r','22');c.setAttribute('fill','#fdf6e3');
      c.setAttribute('stroke',ROUTE_COLOR[cv.route]||'#333');c.setAttribute('stroke-width','3');
      g.appendChild(c);
    }
    const title=document.createElementNS('http://www.w3.org/2000/svg','title');
    const cargo=(cv.cargo||[]).map(x=>x.label+'×'+x.qty).join('、');
    title.textContent=(MEANS_META[cv.means]||{}).label+' → '+PNAMES[cv.route]+' 残'+cv.eta+'T '+cargo;
    g.appendChild(title);
    // position along path
    let x=400,y=400;
    const path=document.getElementById(PATH_ID[cv.route]||('rt_'+cv.route));
    if(path&&path.getTotalLength){
      try{
        const len=path.getTotalLength();
        const p=1-Math.max(0,cv.eta)/(cv.etaMax||1);
        const pt=path.getPointAtLength(Math.min(len*0.92,Math.max(len*0.08,len*p)));
        x=pt.x;y=pt.y;
      }catch(e){}
    }else if(NODE_COORDS[cv.route]){
      const n=Math.max(0,(gs.node[cv.route]||1)-1);
      const c=NODE_COORDS[cv.route][n];
      if(c){x=c[0];y=c[1];}
    }
    g.setAttribute('transform','translate('+x+','+y+')');
    g.addEventListener('click',()=>{
      showToast((MEANS_META[cv.means]||{}).label+'→'+PNAMES[cv.route]+' 残'+cv.eta+'T');
    });
    layer.appendChild(g);
  });
}

function markNodeCleared(key,node){
  ensureState();
  if((gs.cleared[key]||[]).indexOf(node)<0)gs.cleared[key].push(node);
  // unlocks are derived via isMeansUnlocked from cleared
  if(key==='food'&&node===1)showToast('🔓 荷車が解禁されました');
  if(key==='food'&&node===2)showToast('🔓 船が解禁されました');
  if(key==='horse'&&node===2)showToast('🔓 馬車技術が解禁されました');
  refreshMapNodes();
}

function checkOrderComplete(key){
  const od=gs.order[key];if(!od||!od.items)return;
  const done=od.items.every(it=>(it.delivered||0)>=it.qty);
  if(done){
    const node=od.node||gs.node[key]||1;
    markNodeCleared(key,node);
    gs.orderLocked[key]=false;
    showToast('✓ '+PNAMES[key]+' ノード'+node+' の依頼を完納（撃破/クリア）');
    // stay on node (do not auto-advance)
  }
}

var __goTransport=typeof goTransport==='function'?goTransport:null;
goTransport=function(prince){
  ensureState();
  const means=gs.transport[prince]&&gs.transport[prince].means;
  if(!means||!isMeansUnlocked(means)){showToast('輸送手段を選んでください（初期は人足のみ）');return;}
  const od=gs.order[prince];
  const cargo=[];let total=0;
  if(od&&od.items){
    od.items.forEach(it=>{
      const q=qtys[prince+'_'+it.id]||0;
      if(q>0){cargo.push({id:it.id,label:it.label,qty:q});total+=q;}
    });
  }
  if(total<=0){showToast('送る数量を指定してください');return;}
  const cap=(MEANS_META[means]||{}).cap||1;
  if(total>cap){showToast('積載超過（最大'+cap+'）');return;}
  cargo.forEach(c=>takeStock(c.id,c.qty));
  const eta=(MEANS_META[means]||{}).eta||4;
  gs.convoys.push({id:'cv_'+prince+'_'+Date.now(),route:prince,means,cargo,eta,etaMax:eta});
  gs.transport[prince]=gs.transport[prince]||{};
  gs.transport[prince].done=true;
  gs.orderMissTurns[prince]=0;
  Object.keys(qtys).forEach(k=>{if(k.startsWith(prince+'_'))qtys[k]=0;});
  const btn=document.getElementById('go-'+prince);
  if(btn){btn.textContent='✓ 出発済み';btn.className='go-btn done-btn';btn.disabled=true;}
  updateHeaderDisplay();updateInvDisplay();updateStockBar();
  ensureOrderUI(prince);renderConvoys();
  showToast(PNAMES[prince]+'へ輸送出発（'+eta+'T後）');
};

function tickConvoys(){
  ensureState();
  const left=[];
  (gs.convoys||[]).forEach(cv=>{
    cv.eta-=1;
    if(cv.eta<=0){
      // deliver into order.delivered
      const od=gs.order[cv.route];
      if(od&&od.items){
        (cv.cargo||[]).forEach(c=>{
          const it=od.items.find(x=>x.id===c.id);
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

// --- sortie: next turn only + confirm ---
function updateSortieReadyFlags(){
  ensureState();
  PKEYS.forEach(key=>{
    if(gs.sortied[key])return;
    const ready=gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold;
    if(ready&&gs.sortieAvailableTurn[key]==null){
      gs.sortieAvailableTurn[key]=gs.turn+1; // next turn
    }
  });
}
var __checkSortie=typeof checkSortieConditions==='function'?checkSortieConditions:null;
checkSortieConditions=function(){
  ensureState();
  updateSortieReadyFlags();
  PKEYS.forEach(key=>{
    if(gs.sortied[key])return;
    const area=document.getElementById('sortie-area-'+key);
    const btn=document.getElementById('sortie-btn-'+key);
    if(!area||!btn)return;
    const can=gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold
      &&gs.sortieAvailableTurn[key]!=null&&gs.turn>=gs.sortieAvailableTurn[key]
      &&!gs.sortieDoneThisTurn;
    area.style.display=(gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold)?'block':'none';
    btn.style.display=can?'block':'none';
    if(gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold&&!can&&!gs.sortieDoneThisTurn){
      // hint
      const done=document.getElementById('sortie-done-'+key);
      // optional toast once not needed
    }
  });
};

var __handDeliver=typeof handDeliver==='function'?handDeliver:null;
if(__handDeliver){
  handDeliver=function(key){
    __handDeliver(key);
    // if horse prep, count toward ranch ownership lightly
    const q=CFG.prep_quests[key];
    if(key==='horse'&&gs.prepDone[key]){
      // ownership of horses at ranch for unlock: grant 2 when prep complete once
      if(!gs._horsePrepGranted){gs.ranchHorses=(gs.ranchHorses||0)+2;gs._horsePrepGranted=true;}
    }
    updateSortieReadyFlags();
    checkSortieConditions();
  };
}

var __selectChoice=typeof selectChoice==='function'?selectChoice:null;
if(__selectChoice){
  selectChoice=function(key,idx,trust,btn){
    __selectChoice(key,idx,trust,btn);
    updateSortieReadyFlags();
    checkSortieConditions();
  };
}

var __sortie=typeof sortie==='function'?sortie:null;
sortie=function(key){
  ensureState();
  if(gs.sortieDoneThisTurn){showToast('このターンはすでに出立させています');return;}
  if(!gs.prepDone[key]||gs.trust[key]<CFG.sortie_trust_threshold)return;
  if(gs.sortieAvailableTurn[key]==null||gs.turn<gs.sortieAvailableTurn[key]){
    showToast('出立は準備完了の翌ターンからです');return;
  }
  if(!confirm('出立時には他の皇子の出立には手が回らなくなりますがよろしいですか？'))return;
  gs.sortied[key]=true;
  gs.sortieDoneThisTurn=true;
  gs.node[key]=1; // ALWAYS node 1
  gs.letterFlags.justEntered[key]=true;
  gs.orderLocked[key]=false;
  setOrderForNode(key,1,true);
  const btn=document.getElementById('sortie-btn-'+key);if(btn)btn.style.display='none';
  const done=document.getElementById('sortie-done-'+key);if(done)done.style.display='block';
  PKEYS.forEach(k=>{if(k!==key){const b=document.getElementById('sortie-btn-'+k);if(b)b.style.display='none';}});
  document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(el=>el.style.display='');
  positionPieceAtNode(key);
  refreshMapNodes();
  showToast('⚑ '+PNAMES[key]+' 出立 → ノード1');
  updatePrinceBar();updateTabLabels();updateTransportUI();
};

// --- UI labels ---
var __updatePrinceBar=typeof updatePrinceBar==='function'?updatePrinceBar:null;
updatePrinceBar=function(){
  ensureState();
  PKEYS.forEach(key=>{
    const req=document.getElementById('pc-req-'+key);
    const sub=document.getElementById('pc-sub-'+key);
    const dlEl=document.getElementById('pc-dl-'+key);
    if(!req)return;
    const t=gs.trust[key];
    const q=CFG.prep_quests[key];
    const node=gs.node[key]||0;
    if(node>=1){
      req.textContent=orderLabel(key);
      if(sub)sub.textContent='ノード'+node+( (gs.cleared[key]||[]).indexOf(node)>=0?'・クリア済':'・依頼中');
      const od=gs.order[key];
      if(dlEl&&od){
        const urg=od.deadline<=3?'urg':'';
        dlEl.innerHTML='<div class="pc-dl-badge '+urg+'">納期<br><b>'+od.deadline+'</b>T</div>';
      }
    }else if(gs.prepDone[key]&&t>=CFG.sortie_trust_threshold){
      const av=gs.sortieAvailableTurn[key];
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

var __updateTabLabels=typeof updateTabLabels==='function'?updateTabLabels:null;
updateTabLabels=function(){
  ensureState();
  PKEYS.forEach(key=>{
    const req=document.getElementById('ltab-req-'+key);
    const dl=document.getElementById('ltab-dl-'+key);
    const tab=document.getElementById('ptab-'+key);
    const chk=document.getElementById('tab-check-'+key);
    if(chk)chk.textContent=(gs.choices[key]!==undefined)?'☑ ':'';
    const t=gs.trust[key];
    const node=gs.node[key]||0;
    if(node>=1){
      if(req)req.textContent=orderLabel(key);
      if(dl)dl.textContent='ノード'+node;
      if(tab)tab.classList.remove('urg-tab');
    }else if(gs.prepDone[key]){
      if(req)req.textContent='準備完了';if(dl)dl.textContent='信頼'+t+'/100';
      if(tab)tab.classList.toggle('urg-tab',t>=CFG.sortie_trust_threshold);
    }else{
      const q=CFG.prep_quests[key];
      if(req)req.textContent='準備:'+q.label+'×'+q.qty;
      if(dl)dl.textContent='信頼'+t+'/100';
    }
  });
  const ks=document.getElementById('kg-summary-tab');
  if(ks){
    const parts=[];
    if(gs.kengen&&gs.kengen.shingen)parts.push('進言✓');
    if(gs.kengen&&gs.kengen.kenjou)parts.push('献上✓');
    ks.textContent=parts.length?parts.join(' '):'進言/献上';
  }
};

var __updateTransportUI=typeof updateTransportUI==='function'?updateTransportUI:null;
updateTransportUI=function(){
  ensureState();
  PKEYS.forEach(key=>{
    const pp=document.getElementById('prep-panel-'+key);
    const nt=document.getElementById('normal-trans-'+key);
    const sa=document.getElementById('sortie-area-'+key);
    const node=gs.node[key]||0;
    if(node>=1){
      if(pp)pp.style.display='none';
      if(sa)sa.style.display='none';
      if(nt){nt.style.display='block';rebuildMeans(key);ensureOrderUI(key);}
    }else{
      if(pp)pp.style.display='block';
      if(nt)nt.style.display='none';
      if(sa)sa.style.display=(gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold)?'block':'none';
    }
    const hb=document.getElementById('hand-btn-'+key);
    if(hb&&gs.prepDone[key]){hb.textContent='✓ 手渡し済み';hb.className='hand-btn done';hb.disabled=true;}
    checkSortieConditions();
  });
  renderConvoys();
  // ranch hint
  const ranch=document.getElementById('card-ranch');
  if(ranch&&!document.getElementById('ranch-horse-btn')){
    const body=ranch.querySelector('.card-body');
    if(body){
      const d=document.createElement('div');
      d.style.marginTop='8px';
      d.innerHTML='<div style="font-size:11px;color:var(--faded)">牧場の馬: <b id="ranch-horse-count">0</b>頭（輸送の「馬」解禁に必要）</div>'+
        '<button class="btn-sm" id="ranch-horse-btn" onclick="buyRanchHorse()">馬を増やす（金40）</button>';
      body.appendChild(d);
    }
  }
  const rc=document.getElementById('ranch-horse-count');if(rc)rc.textContent=String(gs.ranchHorses||0);
};

window.buyRanchHorse=function(){
  if(gs.gold<40){showToast('金が足りません');return;}
  gs.gold-=40;gs.ranchHorses=(gs.ranchHorses||0)+1;
  updateHeaderDisplay();updateTransportUI();
  showToast('牧場の馬 +1（'+gs.ranchHorses+'頭）・馬輸送が使えます');
};

// demand letter stability when in field
var __renderLetter=typeof renderLetter==='function'?renderLetter:null;
if(__renderLetter){
  const _rl=__renderLetter;
  renderLetter=function(key){
    _rl(key);
    // rewrite demand body if on field with locked order (continuation)
    ensureState();
    if((gs.node[key]||0)>=1&&gs.order[key]&&!gs.letterFlags.justEntered[key]){
      const dem=document.getElementById('lt-'+key+'-demand');
      if(dem){
        const od=gs.order[key];
        const miss=gs.orderMissTurns[key]||0;
        const from=PNAMES[key]+'（'+PDIRS[key]+'）ノード'+gs.node[key]+'より';
        let body;
        if(miss>=(CFG.remind_after_turns||3)){
          body='……荷が届かぬ。催促する。\\n\\n【催促・継続】'+od.label+'　納期残：'+od.deadline+'ターン';
        }else{
          body='前線より。依頼は継続中（新規ではない）。\\n\\n【継続依頼】'+od.label+'　納期残：'+od.deadline+'ターン';
        }
        dem.innerHTML='<div class="letter-block"><div class="letter-from">'+from+'</div><div class="letter-text">'+body+'</div></div>';
      }
    }
  };
}

// next turn
var __goNext=goToNextTurn;
goToNextTurn=function(){
  ensureState();
  PKEYS.forEach(key=>{
    if((gs.node[key]||0)>=1&&gs.order[key]){
      if(gs.order[key].deadline>0)gs.order[key].deadline--;
      const tr=gs.transport[key];
      if(!(tr&&tr.done))gs.orderMissTurns[key]=(gs.orderMissTurns[key]||0)+1;
      else gs.orderMissTurns[key]=0;
    }
  });
  tickConvoys();
  __goNext();
  ensureState();
  PKEYS.forEach(k=>{if(gs.letterFlags&&gs.letterFlags.justEntered)gs.letterFlags.justEntered[k]=false;});
  updateSortieReadyFlags();
  updatePrinceBar();updateTabLabels();
  refreshMapNodes();positionAllPieces();renderConvoys();
};

var __apply=typeof applySaveData==='function'?applySaveData:null;
if(__apply){
  applySaveData=function(data){
    const ok=__apply(data);
    ensureState();
    PKEYS.forEach(key=>{
      if(gs.sortied[key]&&!(gs.node[key]>0)){
        gs.node[key]=1;
        if(!gs.order[key]){gs.orderLocked[key]=false;setOrderForNode(key,1,true);}
      }
    });
    updatePrinceBar();updateTabLabels();updateTransportUI();
    refreshMapNodes();positionAllPieces();renderConvoys();
    return ok;
  };
}

function bootAddon(){
  ensureState();
  // food/horse shells
  ['food','horse','siege','weapon'].forEach(key=>{
    const nt=document.getElementById('normal-trans-'+key);
    if(!nt)return;
    // clear placeholder only text
    if(nt.querySelector('p')&&!document.getElementById('means-'+key)){
      nt.innerHTML='';
    }
    rebuildMeans(key);
  });
  PKEYS.forEach(key=>{
    if((gs.node[key]||0)<1)
      document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(el=>el.style.display='none');
  });
  refreshMapNodes();positionAllPieces();renderConvoys();
  updateSortieReadyFlags();checkSortieConditions();
  const btn=document.getElementById('ph-letter-complete');
  if(btn){btn.disabled=false;if(!btn.getAttribute('onclick')||btn.getAttribute('onclick').indexOf('tryGoToMgmt')<0)btn.setAttribute('onclick','tryGoToMgmt()');}
}

document.addEventListener('DOMContentLoaded',function(){setTimeout(bootAddon,0);});
if(document.readyState!=='loading')setTimeout(bootAddon,0);
})();
`;

// ── 4) Patch HTML ──
let html = fs.readFileSync(HTML_PATH, 'utf8');
fs.writeFileSync(HTML_PATH + '.bak_before_transport_fix', html, 'utf8');
console.log('backup written');

// Inject transport_icons.js
if (!html.includes('transport_icons.js')) {
  if (html.includes('game-data.js')) {
    html = html.replace(
      '<script src="./data/game-data.js"></script>',
      '<script src="./data/game-data.js"></script>\n<script src="./data/transport_icons.js"></script>'
    );
  } else {
    html = html.replace(
      '<div id="toast"></div>',
      '<div id="toast"></div>\n<script src="./data/transport_icons.js"></script>'
    );
  }
  console.log('injected transport_icons.js');
}

// Also inline icons fallback
const iconInline =
  '<script>window.TRANSPORT_ICONS=window.TRANSPORT_ICONS||' +
  JSON.stringify(ICONS) +
  ';</script>';
if (!html.includes('TRANSPORT_ICONS=window.TRANSPORT_ICONS')) {
  html = html.replace(
    '<script src="./data/transport_icons.js"></script>',
    '<script src="./data/transport_icons.js"></script>\n' + iconInline
  );
}

// Insert ADDON before original map DOMContentLoaded, AFTER external merge if present
const MARKER = "document.addEventListener('DOMContentLoaded',()=>{\n  document.querySelectorAll('.node')";
const idx = html.indexOf(MARKER);
if (idx < 0) {
  console.error('marker not found');
  process.exit(1);
}

// Remove previous addon if re-run
const ADDON_START = '// ═══ Transport/Node fix (safe addon) ═══';
const prev = html.indexOf(ADDON_START);
if (prev >= 0 && prev < idx) {
  html = html.slice(0, prev) + html.slice(idx);
  console.log('removed previous addon');
}
const idx2 = html.indexOf(MARKER);
html = html.slice(0, idx2) + ADDON + '\n' + html.slice(idx2);
console.log('inserted addon');

// Fix food/horse normal-trans shells to empty container (JS fills)
const foodPh =
  /<div class="normal-trans" id="normal-trans-food"[^>]*>[\s\S]*?<\/div>\s*(?=<div class="tp-title"|<div id="tp-horse"|<\/div>\s*<\/div>\s*<div class="ph-actions"|<\/div>\s*$)/;
// simpler replace known patterns
if (html.includes('id="normal-trans-food"')) {
  html = html.replace(
    /<div class="normal-trans" id="normal-trans-food"[^>]*>[\s\S]*?<\/div>/,
    '<div class="normal-trans" id="normal-trans-food" style="display:none"></div>'
  );
  console.log('food shell');
}
if (html.includes('id="normal-trans-horse"')) {
  html = html.replace(
    /<div class="normal-trans" id="normal-trans-horse"[^>]*>[\s\S]*?<\/div>/,
    '<div class="normal-trans" id="normal-trans-horse" style="display:none"></div>'
  );
  console.log('horse shell');
}

fs.writeFileSync(HTML_PATH, html, 'utf8');
console.log('HTML size', html.length);

// syntax check
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m;
let n = 0;
while ((m = re.exec(html))) {
  if (!m[1] || m[1].length < 200) continue;
  try {
    new Function(m[1]);
    console.log('OK script', n, m[1].length);
  } catch (e) {
    console.error('FAIL script', n, e.message);
    process.exit(1);
  }
  n++;
}

// refresh game-data.js from json
const market = JSON.parse(fs.readFileSync(path.join(DATA, 'market.json'), 'utf8'));
const orders = JSON.parse(fs.readFileSync(path.join(DATA, 'orders.json'), 'utf8'));
const letters = JSON.parse(fs.readFileSync(path.join(DATA, 'letters.json'), 'utf8'));
const GAME_DATA = {
  prices: market.prices,
  prep_quests: orders.prep,
  node_orders: orders.nodes,
  remind_after_turns: orders.remind_after_turns || 3,
  letters,
  orders: Object.fromEntries(
    Object.keys(orders.nodes).map((k) => {
      const n1 = orders.nodes[k]['1'];
      return [k, { item_label: n1.label, deadline: n1.deadline }];
    })
  ),
};
fs.writeFileSync(
  path.join(DATA, 'game-data.js'),
  'window.GAME_DATA = ' + JSON.stringify(GAME_DATA, null, 2) + ';\n',
  'utf8'
);
console.log('DONE');
