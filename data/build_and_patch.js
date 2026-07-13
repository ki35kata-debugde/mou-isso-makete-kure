/**
 * Build game-data.js and patch mou_isso_v0_6.html
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = __dirname;
const HTML_PATH = path.join(ROOT, 'mou_isso_v0_6.html');

const market = JSON.parse(fs.readFileSync(path.join(DATA, 'market.json'), 'utf8'));
const orders = JSON.parse(fs.readFileSync(path.join(DATA, 'orders.json'), 'utf8'));
const letters = JSON.parse(fs.readFileSync(path.join(DATA, 'letters.json'), 'utf8'));

const GAME_DATA = {
  prices: market.prices,
  prep_quests: orders.prep,
  node_orders: orders.nodes,
  remind_after_turns: orders.remind_after_turns || 3,
  letters: letters,
  // legacy flat orders for deadline badges (node 1 defaults)
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
console.log('wrote game-data.js');

// ── Market table rows HTML ──
function buildMarketRows() {
  let rows = '';
  for (const [res, pd] of Object.entries(market.prices)) {
    let buyCell = `<td><div class="qty-ctrl"><button class="qty-btn" onclick="buy('${res}',-1)">−</button><div class="qty-num" id="buy-${res}">0</div><button class="qty-btn" onclick="buy('${res}',1)">＋</button></div></td>`;
    let sellCell = `<td><div class="qty-ctrl"><button class="qty-btn" onclick="sell('${res}',-1)">−</button><div class="qty-num" id="sell-${res}">0</div><button class="qty-btn" onclick="sell('${res}',1)">＋</button></div></td>`;
    if (pd.buy >= 999) buyCell = '<td class="locked">購入不可</td>';
    const invId = res === 'med' ? 'inv-med' : res === 'food_mat' ? 'inv-food' : `inv-${res}`;
    // use unique ids for display stock in market; food_mat shows food
    const invIdAttr = res === 'food_mat' ? 'inv-food_mat' : invId;
    // Actually original used inv-iron etc for materials and inv-med for med
    let stockId = invId;
    if (res === 'food_mat') stockId = 'inv-food_mat';
    if (res === 'iron') stockId = 'inv-iron';
    if (res === 'wood') stockId = 'inv-wood';
    if (res === 'niter') stockId = 'inv-niter';
    if (res === 'herb') stockId = 'inv-herb';
    if (res === 'med') stockId = 'inv-med';
    const priceTxt = pd.buy < 999 ? `売${pd.sell}両 買${pd.buy}両` : `売${pd.sell}両`;
    rows += `<tr><td>${pd.label}</td><td id="${stockId}">0</td><td class="res-price">${priceTxt}</td>${buyCell}${sellCell}</tr>\n        `;
  }
  return rows;
}

// ── Extra JS to inject ──
const EXTRA_JS = `
// ═══ External data merge + letter/order/node system ═══
(function mergeGameData(){
  if(typeof GAME_DATA==='undefined'||!GAME_DATA)return;
  if(GAME_DATA.prices)CFG.prices=GAME_DATA.prices;
  if(GAME_DATA.prep_quests)CFG.prep_quests=GAME_DATA.prep_quests;
  if(GAME_DATA.orders)CFG.orders=GAME_DATA.orders;
  if(GAME_DATA.node_orders)CFG.node_orders=GAME_DATA.node_orders;
  if(GAME_DATA.letters)CFG.letterPool=GAME_DATA.letters;
  if(GAME_DATA.remind_after_turns!=null)CFG.remind_after_turns=GAME_DATA.remind_after_turns;
})();
if(!CFG.node_orders)CFG.node_orders={};
if(!CFG.letterPool)CFG.letterPool=CFG.letters||{};
if(CFG.remind_after_turns==null)CFG.remind_after_turns=3;

// extend gs
gs.node={food:0,horse:0,siege:0,weapon:0};
gs.order={food:null,horse:null,siege:null,weapon:null};
gs.orderMissTurns={food:0,horse:0,siege:0,weapon:0};
gs.letterFlags={used:{},serial:{},justEntered:{food:false,horse:false,siege:false,weapon:false}};
gs.activeLetter={};

function emptyOrderMap(){return {food:null,horse:null,siege:null,weapon:null};}
function emptyNumMap(){return {food:0,horse:0,siege:0,weapon:0};}
function emptyBoolMap(){return {food:false,horse:false,siege:false,weapon:false};}

function getNodeOrder(key,node){
  const tree=CFG.node_orders&&CFG.node_orders[key];
  if(!tree)return null;
  return tree[String(node)]||tree[node]||null;
}
function setOrderForNode(key,node){
  const od=getNodeOrder(key,node);
  if(!od){gs.order[key]=null;return;}
  gs.order[key]={
    label:od.label,
    items:(od.items||[]).map(it=>({...it})),
    deadline:od.deadline,
    deadlineMax:od.deadline,
    carts:od.carts||1,
    node:node
  };
  gs.orderMissTurns[key]=0;
}
function orderLabel(key){
  return (gs.order[key]&&gs.order[key].label)||(CFG.orders[key]&&CFG.orders[key].item_label)||'—';
}
function fillTemplate(s,key){
  if(!s)return '';
  const od=gs.order[key]||{};
  return String(s)
    .replace(/\\{\\{order_label\\}\\}/g,od.label||orderLabel(key))
    .replace(/\\{\\{deadline\\}\\}/g,String(od.deadline!=null?od.deadline:(CFG.orders[key]&&CFG.orders[key].deadline)||'?'))
    .replace(/\\{\\{node\\}\\}/g,String(gs.node[key]||0));
}

function matchWhen(when,key){
  if(!when)return true;
  const node=gs.node[key]||0;
  const trust=gs.trust[key]||0;
  const miss=gs.orderMissTurns[key]||0;
  if(when.node!=null&&node!==when.node)return false;
  if(when.node_gte!=null&&node<when.node_gte)return false;
  if(when.node_lte!=null&&node>when.node_lte)return false;
  if(when.trust_gte!=null&&trust<when.trust_gte)return false;
  if(when.trust_lt!=null&&trust>=when.trust_lt)return false;
  if(when.miss_turns_gte!=null&&miss<when.miss_turns_gte)return false;
  if(when.on_node_enter&&!gs.letterFlags.justEntered[key])return false;
  if(when.once&&gs.letterFlags.used[when._id||''])return false;
  if(when.serial!=null){
    const step=gs.letterFlags.serial[when.serial]||0;
    if(step!==(when.step||0))return false;
  }
  if(when.fallback)return true;
  return true;
}

function pickLetterEntry(key,kind){
  const pool=(CFG.letterPool[key]&&CFG.letterPool[key][kind])||[];
  const candidates=[];
  for(const raw of pool){
    const e={...raw,when:{...(raw.when||{})}};
    e.when._id=e.id;
    if(e.when.once&&gs.letterFlags.used[e.id])continue;
    // fallback only if nothing else — handle later
    if(e.when.fallback)continue;
    if(!matchWhen(e.when,key))continue;
    candidates.push(e);
  }
  candidates.sort((a,b)=>(b.priority||0)-(a.priority||0));
  if(candidates.length)return candidates[0];
  // fallback
  for(const raw of pool){
    if(raw.when&&raw.when.fallback)return raw;
  }
  // legacy CFG.letters
  const leg=CFG.letters&&CFG.letters[key];
  if(leg){
    const block=gs.sortied[key]?leg.sortied:leg.prep;
    if(kind==='demand')return {id:'legacy_d',body:block.demand_body,priority:1};
    return {id:'legacy_p',intro:block.personal_intro,body:block.personal_body,choices:block.choices,priority:1};
  }
  return null;
}

function consumeLetterFlags(key,entry){
  if(!entry)return;
  if(entry.when&&entry.when.once&&entry.id)gs.letterFlags.used[entry.id]=true;
  if(entry.id)gs.letterFlags.used[entry.id]=true;
  if(entry.when&&entry.when.serial!=null){
    const s=entry.when.serial;
    gs.letterFlags.serial[s]=(gs.letterFlags.serial[s]||0)+1;
  }
  // clear justEntered after personal+demand rendered for this turn open
}

function getLetterBundle(key){
  const demand=pickLetterEntry(key,'demand');
  const personal=pickLetterEntry(key,'personal');
  return {
    demand_body:fillTemplate((demand&&(demand.body||demand.demand_body))||'',key),
    personal_intro:(personal&&(personal.intro||personal.personal_intro))||'',
    personal_body:fillTemplate((personal&&(personal.body||personal.personal_body))||'',key),
    choices:(personal&&personal.choices)||[{icon:'📋',text:'「承知しました」',trust:1}],
    _demandId:demand&&demand.id,
    _personalId:personal&&personal.id,
    _demand:demand,
    _personal:personal
  };
}

// override getLetter / renderLetter
function getLetter(key){
  return getLetterBundle(key);
}
function renderLetter(key){
  const ld=getLetter(key);
  gs.activeLetter[key]={demandId:ld._demandId,personalId:ld._personalId,personal:ld._personal,demand:ld._demand};
  const node=gs.node[key]||0;
  const fromLabel=node>=1
    ? (PNAMES[key]+'（'+PDIRS[key]+'）ノード'+node+'より')
    : (PNAMES[key]+'（出立前・準備依頼）');
  const dem=document.getElementById('lt-'+key+'-demand');
  if(dem)dem.innerHTML='<div class="letter-block"><div class="letter-from">'+fromLabel+'</div><div class="letter-text">'+ld.demand_body+'</div></div>';
  const gm=document.getElementById('girl-msg-'+key);
  if(gm)gm.textContent=ld.personal_intro;
  const pb=document.getElementById('personal-body-'+key);
  if(pb)pb.innerHTML='<div class="letter-block"><div class="letter-text">'+ld.personal_body+'</div></div>';
  renderChoices(key,ld.choices);
}

function renderAllLetters(){
  PKEYS.forEach(key=>renderLetter(key));
  // after rendering, mark node-enter letters consumed for next turn (not mid-turn)
  updateTabLabels();
  checkLettersDone();
}

function markLettersConsumedForTurn(){
  PKEYS.forEach(key=>{
    const a=gs.activeLetter[key];
    if(!a)return;
    if(a.demand)consumeLetterFlags(key,a.demand);
    if(a.personal)consumeLetterFlags(key,a.personal);
    gs.letterFlags.justEntered[key]=false;
  });
}

// Letter phase complete: always enabled, confirm if incomplete
function checkLettersDone(){
  const btn=document.getElementById('ph-letter-complete');
  if(btn)btn.disabled=false;
}
function tryGoToMgmt(){
  const all=PKEYS.every(k=>gs.choices[k]!==undefined);
  if(!all){
    if(!confirm('すべての返信が終わっていませんが大丈夫ですか？'))return;
  }
  markLettersConsumedForTurn();
  goToMgmt();
}

// sortie: node 1 + order
function sortie(key){
  if(gs.sortieDoneThisTurn){showToast('このターンはすでに出立させています');return;}
  if(!gs.prepDone[key]||gs.trust[key]<CFG.sortie_trust_threshold)return;
  gs.sortied[key]=true;
  gs.sortieDoneThisTurn=true;
  gs.node[key]=1;
  gs.letterFlags.justEntered[key]=true;
  setOrderForNode(key,1);
  const btn=document.getElementById('sortie-btn-'+key);if(btn)btn.style.display='none';
  const done=document.getElementById('sortie-done-'+key);if(done)done.style.display='block';
  PKEYS.forEach(k=>{if(k!==key){const b=document.getElementById('sortie-btn-'+k);if(b)b.style.display='none';}});
  document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(el=>el.style.display='');
  showToast('⚑ '+PNAMES[key]+'が出立！ノード1へ');
  updatePrinceBar();updateTabLabels();updateTransportUI();
}

// patch updateTabLabels node text
const _updateTabLabelsOrig=typeof updateTabLabels==='function'?updateTabLabels:null;
function updateTabLabels(){
  PKEYS.forEach(key=>{
    const req=document.getElementById('ltab-req-'+key);
    const dl=document.getElementById('ltab-dl-'+key);
    const tab=document.getElementById('ptab-'+key);
    const chk=document.getElementById('tab-check-'+key);
    if(chk)chk.textContent=(gs.choices[key]!==undefined)?'☑ ':'';
    const t=gs.trust[key];
    const node=gs.node[key]||0;
    if(gs.sortied[key]||node>=1){
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
    if(gs.kengen.shingen)parts.push('進言✓');
    if(gs.kengen.kenjou)parts.push('献上✓');
    ks.textContent=parts.length?parts.join(' '):'進言/献上';
  }
}

function updatePrinceBar(){
  PKEYS.forEach(key=>{
    const req=document.getElementById('pc-req-'+key);
    const sub=document.getElementById('pc-sub-'+key);
    const dlEl=document.getElementById('pc-dl-'+key);
    if(!req)return;
    const t=gs.trust[key];
    const q=CFG.prep_quests[key];
    const node=gs.node[key]||0;
    if(gs.sortied[key]||node>=1){
      req.textContent=orderLabel(key);
      if(sub)sub.textContent='ノード'+node+'・依頼受付中';
      const od=gs.order[key];
      const deadline=od?od.deadline:(CFG.orders[key]&&CFG.orders[key].deadline);
      if(dlEl&&deadline!=null){
        const urg=deadline<=6?'urg':'';
        dlEl.innerHTML='<div class="pc-dl-badge '+urg+'">納期<br><b>'+deadline+'</b>T</div>';
      }
    }else if(gs.prepDone[key]){
      req.textContent='準備完了　信頼度'+t+'/100';
      if(sub)sub.textContent=t>=CFG.sortie_trust_threshold?'出立可能！':'あと'+(CFG.sortie_trust_threshold-t)+'で出立可';
      if(dlEl)dlEl.innerHTML='';
    }else{
      req.textContent='準備：'+q.label+'×'+q.qty;
      if(sub)sub.textContent='信頼度'+t+'/100';
      if(dlEl)dlEl.innerHTML='';
    }
  });
}

function stockForItem(id){
  if(id==='food')return gs.inv.food;
  if(id==='sword')return gs.stock.sword;
  if(id==='siege_w')return gs.stock.siege_w;
  if(id==='med')return gs.stock.med;
  if(id==='crossbow2')return gs.stock.sword; // placeholder until crafted type exists
  return 0;
}

function updateTransportUI(){
  PKEYS.forEach(key=>{
    const pp=document.getElementById('prep-panel-'+key);
    const nt=document.getElementById('normal-trans-'+key);
    const sa=document.getElementById('sortie-area-'+key);
    const node=gs.node[key]||0;
    if(gs.sortied[key]||node>=1){
      if(pp)pp.style.display='none';if(sa)sa.style.display='none';if(nt)nt.style.display='block';
      // dynamic order summary
      let sum=document.getElementById('order-sum-'+key);
      if(nt&&!sum){
        sum=document.createElement('div');
        sum.id='order-sum-'+key;
        sum.className='tp-info';
        sum.style.marginBottom='8px';
        nt.insertBefore(sum,nt.firstChild);
      }
      if(sum){
        const od=gs.order[key];
        if(od){
          sum.innerHTML='<b>ノード'+node+' 依頼</b>：'+od.label+'　納期残 <b>'+od.deadline+'</b>T';
        }else sum.textContent='依頼なし';
      }
      // request remaining badge
      const reqEl=document.getElementById('ts-'+key+'-req');
      if(reqEl&&gs.order[key]&&gs.order[key].items&&gs.order[key].items[0]){
        reqEl.textContent=gs.order[key].items[0].qty;
      }
      const stk=document.getElementById('ts-'+key+'-stk');
      if(stk&&gs.order[key]&&gs.order[key].items&&gs.order[key].items[0]){
        stk.textContent=stockForItem(gs.order[key].items[0].id);
      }
      // rename item if weapon node1 uses sword
      if(key==='weapon'){
        const nameEl=nt&&nt.querySelector('.item-name');
        if(nameEl&&gs.order[key]&&gs.order[key].items&&gs.order[key].items[0]){
          nameEl.textContent=gs.order[key].items[0].label||'剣 ★1';
        }
      }
    }else{
      if(pp)pp.style.display='block';if(nt)nt.style.display='none';
      if(sa)sa.style.display=gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold?'block':'none';
    }
    const hb=document.getElementById('hand-btn-'+key);
    if(hb&&gs.prepDone[key]){hb.textContent='✓ 手渡し済み';hb.className='hand-btn done';hb.disabled=true;}
    const si=document.getElementById('prep-stock-'+key);
    if(si&&!gs.prepDone[key]){const q=CFG.prep_quests[key];si.innerHTML='現庫: <b>'+getAvailForPrep(key)+'</b>　必要: '+q.qty;}
    const qel=document.getElementById('prep-qty-'+key);if(qel)qel.textContent=gs.prepQty[key]||0;
    checkSortieConditions();
  });
}

// goToNextTurn: tick deadlines + miss turns (assignment to avoid hoist bugs)
var __goToNextTurnBase=goToNextTurn;
goToNextTurn=function(){
  PKEYS.forEach(key=>{
    if((gs.node[key]||0)>=1&&gs.order[key]){
      if(gs.order[key].deadline>0)gs.order[key].deadline--;
      const tr=gs.transport[key];
      if(!(tr&&tr.done))gs.orderMissTurns[key]=(gs.orderMissTurns[key]||0)+1;
      else gs.orderMissTurns[key]=0;
    }
  });
  __goToNextTurnBase();
  if(!gs.node)gs.node=emptyNumMap();
  if(!gs.order)gs.order=emptyOrderMap();
  if(!gs.orderMissTurns)gs.orderMissTurns=emptyNumMap();
  if(!gs.letterFlags)gs.letterFlags={used:{},serial:{},justEntered:emptyBoolMap()};
  if(!gs.activeLetter)gs.activeLetter={};
  if(!gs.letterFlags.justEntered)gs.letterFlags.justEntered=emptyBoolMap();
  PKEYS.forEach(key=>{gs.letterFlags.justEntered[key]=false;});
  updatePrinceBar();updateTabLabels();
};

// applySaveData field defaults
var __applySaveDataBase=applySaveData;
applySaveData=function(data){
  const ok=__applySaveDataBase(data);
  gs.node=gs.node||emptyNumMap();
  gs.order=gs.order||emptyOrderMap();
  gs.orderMissTurns=gs.orderMissTurns||emptyNumMap();
  gs.letterFlags=gs.letterFlags||{used:{},serial:{},justEntered:emptyBoolMap()};
  if(!gs.letterFlags.used)gs.letterFlags.used={};
  if(!gs.letterFlags.serial)gs.letterFlags.serial={};
  if(!gs.letterFlags.justEntered)gs.letterFlags.justEntered=emptyBoolMap();
  gs.activeLetter=gs.activeLetter||{};
  PKEYS.forEach(key=>{
    if(gs.sortied[key]&&!(gs.node[key]>0)){
      gs.node[key]=1;
      if(!gs.order[key])setOrderForNode(key,1);
    }
  });
  updatePrinceBar();updateTabLabels();updateTransportUI();
  return ok;
};

// market stock display for food_mat id
var __updateInvDisplayBase=updateInvDisplay;
updateInvDisplay=function(){
  __updateInvDisplayBase();
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('inv-food_mat',gs.inv.food);
};

// override function declarations that were defined earlier in the same script
getLetter=getLetter;
// re-bind critical overrides as assignments after function declarations above
var __renderLetterImpl=renderLetter;
var __renderAllLettersImpl=renderAllLetters;
var __sortieImpl=sortie;
var __updateTabLabelsImpl=updateTabLabels;
var __updatePrinceBarImpl=updatePrinceBar;
var __updateTransportUIImpl=updateTransportUI;
var __checkLettersDoneImpl=checkLettersDone;
// function declarations already overwrote globals; ensure names exist

// wire letter complete button on DOM ready (override onclick)
document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.getElementById('ph-letter-complete');
  if(btn){
    btn.disabled=false;
    btn.setAttribute('onclick','tryGoToMgmt()');
  }
});
`;

// ── Patch HTML ──
let html = fs.readFileSync(HTML_PATH, 'utf8');

// 1) Market rows
const marketRows = buildMarketRows();
const marketTableRe =
  /(<table class="mgmt-table">\s*<tr><th>品目<\/th><th>在庫<\/th><th>価格<\/th><th>購入<\/th><th>売却<\/th><\/tr>)([\s\S]*?)(<\/table>\s*<div class="trade-summary">)/;
if (!marketTableRe.test(html)) {
  console.error('market table not found');
  process.exit(1);
}
html = html.replace(marketTableRe, `$1\n        ${marketRows}$3`);
console.log('market rows replaced');

// 2) Inject game-data.js + inline fallback before main script
if (!html.includes('game-data.js') && !html.includes('window.GAME_DATA')) {
  const inline =
    '<script src="./data/game-data.js"></script>\n' +
    '<script>window.GAME_DATA=window.GAME_DATA||' +
    JSON.stringify(GAME_DATA) +
    ';</script>\n<script>';
  // only first <script> of main - find the one after toast
  const toastScript = '<div id="toast"></div>\n<script>';
  if (html.includes(toastScript)) {
    html = html.replace(toastScript, '<div id="toast"></div>\n' + inline);
  } else {
    html = html.replace('<script>\nconst CFG', inline + '\nconst CFG');
  }
  console.log('injected game-data');
}

// 3) Inject EXTRA_JS before DOMContentLoaded or at end of script before closing
if (!html.includes('tryGoToMgmt')) {
  const marker = "document.addEventListener('DOMContentLoaded',()=>{";
  // insert before last DOMContentLoaded
  const idx = html.lastIndexOf(marker);
  if (idx < 0) {
    console.error('DOMContentLoaded not found');
    process.exit(1);
  }
  html = html.slice(0, idx) + EXTRA_JS + '\n' + html.slice(idx);
  console.log('injected EXTRA_JS');
} else {
  console.log('EXTRA_JS already present — full re-inject');
  // remove old block between markers if re-run
}

// 4) Change ph-letter-complete onclick in HTML
html = html.replace(
  /id="ph-letter-complete"[^>]*onclick="goToMgmt\(\)"/,
  'id="ph-letter-complete" onclick="tryGoToMgmt()"'
);
html = html.replace(
  /id="ph-letter-complete" disabled onclick="goToMgmt\(\)"/,
  'id="ph-letter-complete" onclick="tryGoToMgmt()"'
);
// ensure not disabled by default in HTML
html = html.replace(
  'id="ph-letter-complete" disabled',
  'id="ph-letter-complete"'
);

// 5) Fix weapon prep letter in embedded CFG if present (legacy)
html = html.replace(
  /「弩を四挺、至急送れ。★2以上のものを選べ。期限を守れぬならば、その首で詫びろ」\\n\\n依頼：弩★2×4　納期：6ターン後/g,
  '出立の支度だ。剣を揃えろ。\\n\\n【出立準備依頼】剣★1×2　輸送フェーズで手渡し可'
);
html = html.replace(
  /山道、余裕だった。約束通り一番乗りだ。\\n\\n【依頼】弩★2×4　納期：6ターン後（継続）/g,
  '山道、余裕だった。まずここを押さえる。\\n\\n【依頼】剣★1×4　納期：8ターン後（ノード1）'
);

// 6) CFG.orders weapon deadline in embedded JSON
html = html.replace(
  /"weapon":\s*\{\s*"item_label":\s*"弩★2×4",\s*"deadline":\s*6\s*\}/,
  '"weapon": { "item_label": "剣★1×4", "deadline": 8 }'
);

fs.writeFileSync(HTML_PATH, html, 'utf8');
console.log('patched HTML size', html.length);

// also fix gen_v06.py market indent and basic hooks
const genPath = path.join(ROOT, 'gen_v06.py');
let gen = fs.readFileSync(genPath, 'utf8');
const badIndent = `        price_txt = f'売{pd["sell"]}両 買{pd["buy"]}両' if pd['buy']<999 else f'売{pd["sell"]}両'
    rows_market+=f'<tr><td>{pd["label"]}</td><td id="{inv_id}">0</td><td class="res-price">{price_txt}</td>{buy_cell}{sell_cell}</tr>'`;
const goodIndent = `        price_txt = f'売{pd["sell"]}両 買{pd["buy"]}両' if pd['buy']<999 else f'売{pd["sell"]}両'
        rows_market+=f'<tr><td>{pd["label"]}</td><td id="{inv_id}">0</td><td class="res-price">{price_txt}</td>{buy_cell}{sell_cell}</tr>'`;
if (gen.includes(badIndent)) {
  gen = gen.replace(badIndent, goodIndent);
  console.log('fixed gen_v06 market indent');
} else if (gen.includes("rows_market+=f'<tr><td>{pd[\"label\"]}</td>")) {
  // try line-based fix
  gen = gen.replace(
    /\n    rows_market\+=f'<tr><td>\{pd\["label"\]\}<\/td>/,
    "\n        rows_market+=f'<tr><td>{pd[\"label\"]}</td>"
  );
  console.log('fixed gen_v06 market indent (alt)');
} else {
  console.log('gen market indent already ok or pattern mismatch');
}

// Add data loading at top of gen if not present
if (!gen.includes('data/market.json') && !gen.includes('load_external_data')) {
  const loadBlock = `
def load_external_data():
    """data/ 配下の JSON を読み込み CONFIG にマージ"""
    import os
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    def _load(name):
        p = os.path.join(base, name)
        if not os.path.isfile(p):
            return None
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    m = _load('market.json')
    o = _load('orders.json')
    L = _load('letters.json')
    if m and 'prices' in m:
        CONFIG['prices'] = m['prices']
    if o:
        if 'prep' in o:
            CONFIG['prep_quests'] = o['prep']
        if 'nodes' in o:
            CONFIG['node_orders'] = o['nodes']
        CONFIG['remind_after_turns'] = o.get('remind_after_turns', 3)
        # legacy orders from node 1
        CONFIG['orders'] = {
            k: {'item_label': v['1']['label'], 'deadline': v['1']['deadline']}
            for k, v in o.get('nodes', {}).items() if '1' in v
        }
    if L:
        CONFIG['letter_pool'] = L
    # write game-data.js for HTML
    if os.path.isdir(base):
        gd = {
            'prices': CONFIG.get('prices'),
            'prep_quests': CONFIG.get('prep_quests'),
            'orders': CONFIG.get('orders'),
            'node_orders': CONFIG.get('node_orders'),
            'remind_after_turns': CONFIG.get('remind_after_turns', 3),
            'letters': CONFIG.get('letter_pool') or CONFIG.get('letters'),
        }
        with open(os.path.join(base, 'game-data.js'), 'w', encoding='utf-8') as f:
            f.write('window.GAME_DATA = ' + json.dumps(gd, ensure_ascii=False, indent=2) + ';\\n')

`;
  gen = gen.replace(
    'PKEYS = [\'food\',\'horse\',\'siege\',\'weapon\']',
    loadBlock + "\nPKEYS = ['food','horse','siege','weapon']"
  );
  // call after CONFIG defined - find end of CONFIG letters
  if (!gen.includes('load_external_data()')) {
    gen = gen.replace(
      '# ════════════════════════════════════════════════\n# 以下はゲームロジック・UI生成（通常は編集不要）',
      'load_external_data()\n\n# ════════════════════════════════════════════════\n# 以下はゲームロジック・UI生成（通常は編集不要）'
    );
  }
  fs.writeFileSync(genPath, gen, 'utf8');
  console.log('updated gen_v06.py data loading');
} else {
  fs.writeFileSync(genPath, gen, 'utf8');
}

console.log('DONE');
