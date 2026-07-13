/**
 * - Order success trust: N0=+4, N1-3=+15, N4=+20 (all routes)
 * - Advice: this season (immediate apply) + copy
 * - Letters: only N0-N4 文官+娘 + trust 20/40/60/80/100 娘
 * - Yellow only when hasNew; archive last exchange; block complete if unreplied
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'mou_isso_v0_6_1.html');
const GD = path.join(__dirname, 'game-data.js');
const LJ = path.join(__dirname, 'letters.json');

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_letters_trust_' + Date.now(), h, 'utf8');

// ── game-data.js: prep + node_orders trust ──
let gd = fs.readFileSync(GD, 'utf8');
// prep all trust_reward -> 4
gd = gd.replace(/("trust_reward"\s*:\s*)\d+/g, (m, p1) => {
  // only inside prep_quests roughly - also might hit elsewhere
  return p1 + '4';
});
// careful: only prep had trust_reward. After replace all are 4. Good for prep.
// Now inject trust_reward into node_orders nodes
function injectNodeTrust(src) {
  // For each "1": { ... "deadline": N  without trust_reward before closing of node object
  // Simpler: after "carts": N add trust if missing
  return src.replace(
    /("([1-4])"\s*:\s*\{)([^}]*?"carts"\s*:\s*\d+)(\s*)(,*)(\s*)(\})/g,
    (full, open, node, mid, sp, comma, sp2, close) => {
      if (mid.includes('trust_reward')) return full;
      const tr = node === '4' ? 20 : 15;
      return `${open}${mid},\n        "trust_reward": ${tr}${close}`;
    }
  );
}
// prep might have been set to 4 already. Re-set prep explicitly via parse if possible
try {
  // parse game-data as JS object
  const obj = Function('return (' + gd.replace(/^window\.GAME_DATA\s*=\s*/, '').replace(/;\s*$/, '') + ')')();
  ['food', 'horse', 'siege', 'weapon'].forEach((k) => {
    if (obj.prep_quests && obj.prep_quests[k]) obj.prep_quests[k].trust_reward = 4;
    if (obj.node_orders && obj.node_orders[k]) {
      ['1', '2', '3', '4'].forEach((n) => {
        if (obj.node_orders[k][n]) {
          obj.node_orders[k][n].trust_reward = n === '4' ? 20 : 15;
        }
      });
    }
  });
  // simplify letters in game-data if present
  if (obj.letters) obj.letters = simplifyLetters(obj.letters);
  gd = 'window.GAME_DATA = ' + JSON.stringify(obj, null, 2) + ';\n';
  fs.writeFileSync(GD, gd, 'utf8');
  console.log('game-data.js updated (trust + letters)');
} catch (e) {
  console.warn('game-data parse fail, regex fallback', e.message);
  gd = injectNodeTrust(gd);
  fs.writeFileSync(GD, gd, 'utf8');
}

function defaultChoices(label) {
  return [
    { icon: '📋', text: '「承知しました」', trust: 0 },
    { icon: '🤝', text: '「気にかけています」', trust: 0 },
  ];
}

function simplifyLetters(letters) {
  const keys = ['food', 'horse', 'siege', 'weapon'];
  const names = { food: '兵糧太', horse: '騎馬次', siege: '攻三城', weapon: '武刃四' };
  const out = {};
  for (const key of keys) {
    const src = letters[key] || { demand: [], personal: [] };
    const demand = [];
    const personal = [];
    // demand: prep + node_enter variants
    (src.demand || []).forEach((e) => {
      const id = e.id || '';
      if (id.endsWith('_order') || id.endsWith('_remind') || id.includes('remind') || id.includes('_order')) {
        demand.push(Object.assign({}, e, { disabled: true, _comment: 'disabled: 毎ターン依頼/催促' }));
        return;
      }
      demand.push(e);
    });
    // ensure node enter for 2-4 demand placeholders if only generic enter
    const hasEnter = demand.some((e) => !e.disabled && e.when && (e.when.on_node_enter || e.id.includes('node_enter')));
    if (hasEnter) {
      // expand generic node_gte:1 enter into per-node if only one
      const generic = demand.find((e) => !e.disabled && e.when && e.when.on_node_enter && e.when.node_gte === 1 && e.when.node == null);
      if (generic) {
        generic.disabled = true;
        generic._comment = 'split into land nodes';
        for (let n = 1; n <= 4; n++) {
          demand.push({
            id: `${key}_node_enter_${n}`,
            priority: 100,
            when: { node: n, on_node_enter: true },
            body:
              generic.body ||
              `ノード${n}に到着しました。\n\n【依頼】{{order_label}}　納期：{{deadline}}ターン後`,
          });
        }
      }
    }
    // personal
    const trustBands = [
      [20, 40],
      [40, 60],
      [60, 80],
      [80, 100],
      [100, null],
    ];
    const existingPersonal = src.personal || [];
    existingPersonal.forEach((e) => {
      const id = e.id || '';
      if (id.includes('chat') || id.includes('foal') || (e.when && e.when.fallback) || (e.when && e.when.serial)) {
        personal.push(Object.assign({}, e, { disabled: true, _comment: 'disabled: 雑談/シリアル' }));
        return;
      }
      personal.push(e);
    });
    // land 2-4 if missing
    for (let n = 2; n <= 4; n++) {
      const id = `${key}_land_${n}`;
      if (!personal.some((e) => e.id === id || (e.when && e.when.node === n && e.when.on_node_enter))) {
        personal.push({
          id,
          priority: 100,
          when: { node: n, on_node_enter: true },
          intro: `${names[key]}の娘より。ノード${n}からの手紙です。`,
          body: `（ノード${n}到達）父上、前線の様子を送ります。引き続き補給をお願いします。`,
          choices: defaultChoices(),
        });
      }
    }
    // trust milestones
    trustBands.forEach(([lo, hi]) => {
      const id = `${key}_trust_${lo}`;
      if (personal.some((e) => e.id === id || (e.when && e.when.trust_gte === lo && e.when.once))) {
        // ensure disabled false
        personal.forEach((e) => {
          if (e.id === id || (e.when && e.when.trust_gte === lo && e.when.once && !e.when.on_node_enter)) {
            e.disabled = false;
            if (e.when && hi != null) e.when.trust_lt = hi;
            if (e.when && hi == null) delete e.when.trust_lt;
          }
        });
        return;
      }
      const when = { trust_gte: lo, once: true };
      if (hi != null) when.trust_lt = hi;
      personal.push({
        id,
        priority: 60,
        when,
        intro: `${names[key]}の娘より。信頼が深まったようで…。`,
        body: `（信頼${lo}）いつも支えてくださり、ありがとうございます。父上の言葉が力になっています。`,
        choices: defaultChoices(),
      });
    });
    out[key] = { demand, personal };
  }
  return out;
}

// letters.json
if (fs.existsSync(LJ)) {
  fs.writeFileSync(path.join(__dirname, 'letters_full_backup.json'), fs.readFileSync(LJ));
  let L = JSON.parse(fs.readFileSync(LJ, 'utf8'));
  L = simplifyLetters(L);
  fs.writeFileSync(LJ, JSON.stringify(L, null, 2), 'utf8');
  console.log('letters.json simplified');
}

// Sync GAME_DATA in HTML if present as window.GAME_DATA={...}
try {
  const obj = Function('return (' + fs.readFileSync(GD, 'utf8').replace(/^window\.GAME_DATA\s*=\s*/, '').replace(/;\s*$/, '') + ')')();
  const meStr = 'window.GAME_DATA=' + JSON.stringify(obj) + ';';
  if (h.includes('window.GAME_DATA=')) {
    // replace first large assignment
    const re = /window\.GAME_DATA\s*=\s*\{[\s\S]*?\};/;
    // This may fail on nested - use brace match from first window.GAME_DATA=
    const i = h.indexOf('window.GAME_DATA=');
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
        let semi = end + 1;
        if (h[semi] === ';') semi++;
        h = h.slice(0, i) + meStr + h.slice(semi);
        console.log('HTML GAME_DATA replaced');
      }
    }
  }
} catch (e) {
  console.warn('HTML GAME_DATA replace skip', e.message);
}

// CSS mail-new
const css = `
.tab-btn-5.mail-new{
  box-shadow: inset 0 0 0 2px #d4a017;
  background: linear-gradient(#fff8dc, #f2ead8);
}
.tab-btn-5.mail-new .tab-pname{ color:#8b6914; font-weight:700; }
.mail-archive-note{ font-size:12px; color:var(--faded); margin-bottom:8px; font-style:italic; }
.kengen-note{ white-space:pre-line; }
`;
if (!h.includes('.tab-btn-5.mail-new')) {
  h = h.replace('</style>', css + '\n</style>');
  console.log('css mail-new');
}

// kengen note text
h = h.replace(
  /進言は1つ選べます（次ターンから有効）/g,
  '進言は1つ選べます（今季から有効）\n！献上品が高いのでご利用は計画的に！'
);
h = h.replace(
  /進言は1つ選べます（今季から有効）(?!\n！)/g,
  '進言は1つ選べます（今季から有効）\n！献上品が高いのでご利用は計画的に！'
);
// avoid double if already full
h = h.replace(
  /進言は1つ選べます（今季から有効）\n！献上品が高いのでご利用は計画的に！\n！献上品が高いのでご利用は計画的に！/g,
  '進言は1つ選べます（今季から有効）\n！献上品が高いのでご利用は計画的に！'
);

const FIX = `
// ═══ letters simplify + trust rewards + advice now ═══
(function(){
'use strict';
if(window.__lettersTrustAdviceFix) return;
window.__lettersTrustAdviceFix = true;

var PKEYS2 = window.PKEYS || ['food','horse','siege','weapon'];
var TRUST_N0 = 4;
var TRUST_N123 = 15;
var TRUST_N4 = 20;

function ensureCfgTrustRewards(){
  try{
    if(typeof CFG==='undefined') return;
    if(CFG.prep_quests){
      PKEYS2.forEach(function(k){
        if(CFG.prep_quests[k]) CFG.prep_quests[k].trust_reward = TRUST_N0;
      });
    }
    if(CFG.node_orders){
      PKEYS2.forEach(function(k){
        var tree=CFG.node_orders[k]; if(!tree) return;
        ['1','2','3','4'].forEach(function(n){
          if(tree[n]) tree[n].trust_reward = (n==='4'?TRUST_N4:TRUST_N123);
        });
      });
    }
    // letters pool from GAME_DATA if updated
    if(typeof GAME_DATA!=='undefined' && GAME_DATA.letters){
      CFG.letterPool = GAME_DATA.letters;
      CFG.letters = GAME_DATA.letters;
    }
  }catch(e){ console.warn('ensureCfgTrustRewards', e); }
}
ensureCfgTrustRewards();

// ── order complete trust ──
function grantOrderTrust(key, node){
  var n = Number(node)||1;
  var gain = n>=4 ? TRUST_N4 : TRUST_N123;
  // prefer data
  try{
    var od = CFG.node_orders && CFG.node_orders[key] && CFG.node_orders[key][String(n)];
    if(od && od.trust_reward!=null) gain = od.trust_reward;
  }catch(e){}
  gs.trust[key] = Math.min(100, (gs.trust[key]||0) + gain);
  return gain;
}

var _coc = window.checkOrderComplete || (typeof checkOrderComplete==='function'?checkOrderComplete:null);
window.checkOrderComplete = function(key){
  var od=gs.order&&gs.order[key];
  var already = od && od._trustGranted;
  if(typeof _coc==='function') _coc(key);
  else if(typeof checkOrderComplete==='function' && checkOrderComplete!==window.checkOrderComplete) checkOrderComplete(key);
  // if completed and not yet granted
  od=gs.order&&gs.order[key];
  if(od && od.items && od.items.every(function(it){return (it.delivered||0)>=it.qty;})){
    if(!od._trustGranted && !already){
      var node=od.node||gs.node[key]||1;
      var g=grantOrderTrust(key, node);
      od._trustGranted = true;
      showToast('✓ '+(typeof PNAMES!=='undefined'?PNAMES[key]:key)+' ノード'+node+' 完納（信頼 +'+g+'）');
      if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
      if(typeof updatePrinceBar==='function') updatePrinceBar();
      if(typeof updateTabLabels==='function') updateTabLabels();
    }
  }
};
try{ checkOrderComplete = window.checkOrderComplete; }catch(e){}

// prep always uses CFG trust_reward (=4)
var _hd = window.handDeliver || (typeof handDeliver==='function'?handDeliver:null);
// leave handDeliver; prep trust_reward already 4 via CFG

// ── mail state ──
function ensureMail(){
  if(!gs.mail) gs.mail = {};
  PKEYS2.forEach(function(k){
    if(!gs.mail[k]) gs.mail[k] = { hasNew:false, lastExchange:null, lastDemand:null };
  });
  if(!gs.letterFlags) gs.letterFlags={used:{},serial:{},justEntered:{food:false,horse:false,siege:false,weapon:false}};
  if(!gs.activeLetter) gs.activeLetter={};
  if(!gs.choices) gs.choices={};
}

function letterDisabled(e){
  return !e || e.disabled === true;
}

function matchWhen2(when, key){
  if(!when) return true;
  if(when.fallback) return false; // never auto for "new"
  var node=gs.node[key]||0;
  var trust=gs.trust[key]||0;
  if(when.node!=null && node!==when.node) return false;
  if(when.node_gte!=null && node<when.node_gte) return false;
  if(when.node_lte!=null && node>when.node_lte) return false;
  if(when.trust_gte!=null && trust<when.trust_gte) return false;
  if(when.trust_lt!=null && trust>=when.trust_lt) return false;
  if(when.on_node_enter && !gs.letterFlags.justEntered[key]) return false;
  if(when.once && gs.letterFlags.used[when._id||when.id||'']) return false;
  // N0 intro: node 0 without on_node_enter — show until once used
  if(when.node===0 && when.once && gs.letterFlags.used[when._id||'']) return false;
  return true;
}

function poolKind(key, kind){
  var pool = (CFG.letterPool && CFG.letterPool[key] && CFG.letterPool[key][kind])
    || (CFG.letters && CFG.letters[key] && CFG.letters[key][kind])
    || [];
  return pool;
}

function pickNewEntry(key, kind){
  var pool = poolKind(key, kind);
  var cands = [];
  pool.forEach(function(raw){
    if(letterDisabled(raw)) return;
    if(raw.when && raw.when.fallback) return;
    var e = Object.assign({}, raw, { when: Object.assign({}, raw.when||{}) });
    e.when._id = e.id;
    if(e.when.once && gs.letterFlags.used[e.id]) return;
    if(!matchWhen2(e.when, key)) return;
    cands.push(e);
  });
  cands.sort(function(a,b){ return (b.priority||0)-(a.priority||0); });
  return cands[0] || null;
}

function recomputeMailFlags(){
  ensureMail();
  PKEYS2.forEach(function(key){
    var pers = pickNewEntry(key, 'personal');
    // hasNew if personal needs reply and not yet chosen for this letter id this phase
    var has = !!pers;
    if(has && gs.choices[key] && gs.choices[key].letterId === pers.id){
      has = false; // already replied
    }
    // if choice exists without letterId (legacy), treat as replied for this turn only if no new higher priority
    if(has && gs.choices[key] && gs.choices[key].letterId == null && gs.choices[key].idx!=null){
      // still has new letter of different id
      if(pers && !gs.letterFlags.used[pers.id]) has = true;
    }
    gs.mail[key].hasNew = has;
    gs.mail[key].pendingPersonal = pers;
    gs.mail[key].pendingDemand = pickNewEntry(key, 'demand');
  });
}
window.recomputeMailFlags = recomputeMailFlags;

function fillTemplate2(s, key){
  if(!s) return '';
  if(typeof fillTemplate==='function') return fillTemplate(s, key);
  var od=gs.order&&gs.order[key]||{};
  return String(s)
    .replace(/\{\{order_label\}\}/g, od.label||'')
    .replace(/\{\{deadline\}\}/g, String(od.deadline!=null?od.deadline:'?'))
    .replace(/\{\{node\}\}/g, String(gs.node[key]||0));
}

window.renderLetter = function(key){
  ensureMail();
  recomputeMailFlags();
  var mail = gs.mail[key];
  var demEl = document.getElementById('lt-'+key+'-demand');
  var gm = document.getElementById('girl-msg-'+key);
  var pb = document.getElementById('personal-body-'+key);
  var area = document.getElementById('choices-area-'+key);

  // ── 文官 demand ──
  var dem = mail.pendingDemand;
  var demBody, demFrom;
  if(dem){
    demBody = fillTemplate2(dem.body, key);
    demFrom = '文官より（ノード'+(gs.node[key]||0)+'）';
    mail.lastDemand = { body: demBody, node: gs.node[key]||0, fromLabel: demFrom, id: dem.id };
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].demand = dem;
    gs.activeLetter[key].demandId = dem.id;
  } else if(mail.lastDemand){
    demBody = mail.lastDemand.body;
    demFrom = mail.lastDemand.fromLabel || ('文官より（ノード'+(mail.lastDemand.node!=null?mail.lastDemand.node:(gs.node[key]||0))+'・再掲）');
  } else {
    // archive from order label
    var od = gs.order&&gs.order[key];
    demFrom = '文官より';
    demBody = od
      ? ('このノードの依頼：'+od.label+'（納期残 '+(od.deadline!=null?od.deadline:'?')+'T）\\n※新しい文官報告はありません。輸送画面でも確認できます。')
      : '新しい文官報告はありません。';
  }
  if(demEl){
    demEl.innerHTML = '<div class="letter-block"><div class="letter-from">'+demFrom+'</div>'+
      (dem?'':'<div class="mail-archive-note">（このノードの記録）</div>')+
      '<div class="letter-text">'+demBody.replace(/\\n/g,'<br>')+'</div></div>';
  }

  // ── 娘 personal ──
  if(mail.hasNew && mail.pendingPersonal){
    var pe = mail.pendingPersonal;
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].personal = pe;
    gs.activeLetter[key].personalId = pe.id;
    if(gm) gm.textContent = pe.intro || '娘からの手紙です。';
    if(pb) pb.innerHTML = '<div class="letter-block"><div class="letter-text">'+(pe.body||'').replace(/\\n/g,'<br>')+'</div></div>';
    if(typeof renderChoices==='function') renderChoices(key, pe.choices||defaultChoicesRuntime());
    else if(area){
      // minimal choices
      renderChoicesLocal(key, pe.choices||defaultChoicesRuntime(), pe.id);
    }
  } else {
    // archive
    var ex = mail.lastExchange;
    if(gm) gm.textContent = ex ? '前回のやりとりはこんなでした。' : 'まだ娘とのやりとりはありません。';
    if(pb){
      if(ex){
        pb.innerHTML = '<div class="mail-archive-note">前回のやりとり</div>'+
          '<div class="letter-block"><div class="letter-text">'+(ex.body||'').replace(/\\n/g,'<br>')+'</div></div>'+
          (ex.choiceText ? '<div class="letter-block" style="margin-top:8px"><div class="letter-from">あなたの返事</div><div class="letter-text">'+ex.choiceText+'</div></div>' : '');
      } else {
        pb.innerHTML = '<div class="letter-block"><div class="letter-text">（記録なし）</div></div>';
      }
    }
    if(area) area.innerHTML = '';
    // clear active personal so consume won't re-mark wrongly
    if(gs.activeLetter[key]) gs.activeLetter[key].personal = null;
  }
  updateMailTabStyles();
};

function defaultChoicesRuntime(){
  return [
    {icon:'📋', text:'「承知しました」', trust:0},
    {icon:'🤝', text:'「気にかけています」', trust:0}
  ];
}
function renderChoicesLocal(key, opts, letterId){
  var area=document.getElementById('choices-area-'+key); if(!area) return;
  var chosen=gs.choices[key];
  var html='<div class="choices-wrap"><div class="choices-label">返事を選んでください（取り消し不可）</div>';
  opts.forEach(function(o,i){
    var sel=(chosen!==undefined&&chosen.idx===i)?'selected':'';
    html+='<button type="button" class="choice-btn '+sel+'" data-i="'+i+'">'+
      '<span class="choice-icon">'+(o.icon||'')+'</span><div>'+o.text+
      (o.trust?('<span class="trust-hint">✦ 信頼度 +'+o.trust+'</span>'):'')+
      '</div></button>';
  });
  html+='</div>';
  area.innerHTML=html;
  area.querySelectorAll('.choice-btn').forEach(function(btn){
    btn.onclick=function(){
      var i=parseInt(btn.getAttribute('data-i'),10);
      window.selectChoice(key, i, opts[i].trust||0, btn, letterId, opts[i].text);
    };
  });
}

// wrap selectChoice
var _sc = window.selectChoice || (typeof selectChoice==='function'?selectChoice:null);
window.selectChoice = function(key, idx, trust, el, letterId, choiceText){
  ensureMail();
  if(!gs.mail[key] || !gs.mail[key].hasNew){
    showToast('いま返信が必要な手紙はありません');
    return;
  }
  if(gs.choices[key]!==undefined) return;
  var pe = gs.mail[key].pendingPersonal;
  var lid = letterId || (pe && pe.id) || (gs.activeLetter[key]&&gs.activeLetter[key].personalId);
  var body = pe && pe.body;
  var intro = pe && pe.intro;
  var ctext = choiceText;
  if(!ctext && pe && pe.choices && pe.choices[idx]) ctext = pe.choices[idx].text;
  if(typeof _sc==='function'){
    _sc(key, idx, trust, el);
  } else {
    gs.choices[key]={idx:idx, trust:trust};
    gs.trust[key]=Math.min(100,(gs.trust[key]||0)+(trust||0));
    if(el) el.classList.add('selected');
  }
  gs.choices[key] = Object.assign({}, gs.choices[key]||{}, { letterId: lid, choiceText: ctext });
  gs.mail[key].lastExchange = {
    intro: intro,
    body: body,
    choiceText: ctext,
    trustDelta: trust||0,
    letterId: lid,
    turn: gs.turn
  };
  gs.mail[key].hasNew = false;
  updateMailTabStyles();
  if(typeof updateTabLabels==='function') updateTabLabels();
  if(typeof updatePrinceBar==='function') updatePrinceBar();
};
try{ selectChoice = window.selectChoice; }catch(e){}

// wrap renderChoices used by old code
var _rc = window.renderChoices || (typeof renderChoices==='function'?renderChoices:null);
window.renderChoices = function(key, opts){
  var pe = gs.mail && gs.mail[key] && gs.mail[key].pendingPersonal;
  var lid = pe && pe.id;
  if(!opts) opts = defaultChoicesRuntime();
  // use local that hooks letterId
  renderChoicesLocal(key, opts, lid);
};
try{ renderChoices = window.renderChoices; }catch(e){}

function updateMailTabStyles(){
  ensureMail();
  recomputeMailFlags();
  PKEYS2.forEach(function(key){
    var tab=document.getElementById('ptab-'+key);
    if(!tab) return;
    tab.classList.toggle('mail-new', !!(gs.mail[key]&&gs.mail[key].hasNew));
  });
}
window.updateMailTabStyles = updateMailTabStyles;

var _utl = window.updateTabLabels || (typeof updateTabLabels==='function'?updateTabLabels:null);
window.updateTabLabels = function(){
  if(typeof _utl==='function') _utl();
  updateMailTabStyles();
};
try{ updateTabLabels = window.updateTabLabels; }catch(e){}

window.renderAllLetters = function(){
  ensureMail();
  recomputeMailFlags();
  PKEYS2.forEach(function(k){ window.renderLetter(k); });
  updateMailTabStyles();
  if(typeof checkLettersDone==='function') checkLettersDone();
};
try{ renderAllLetters = window.renderAllLetters; }catch(e){}

// tryGoToMgmt hard block
window.tryGoToMgmt = function(){
  ensureMail();
  recomputeMailFlags();
  var pending = PKEYS2.filter(function(k){
    return gs.mail[k] && gs.mail[k].hasNew && gs.choices[k]===undefined;
  });
  if(pending.length){
    var msg = '返信していない手紙があります';
    if(typeof showToast==='function') showToast(msg);
    alert(msg);
    return;
  }
  if(typeof markLettersConsumedForTurn==='function') markLettersConsumedForTurn();
  // also mark used personal once
  PKEYS2.forEach(function(k){
    var a=gs.activeLetter&&gs.activeLetter[k];
    if(a&&a.personal&&a.personal.id){
      gs.letterFlags.used[a.personal.id]=true;
    }
    if(a&&a.demand&&a.demand.id){
      gs.letterFlags.used[a.demand.id]=true;
    }
    if(gs.letterFlags) gs.letterFlags.justEntered[k]=false;
  });
  if(typeof window.goToMgmt==='function') window.goToMgmt();
  else if(typeof goToMgmt==='function') goToMgmt();
};
try{ tryGoToMgmt = window.tryGoToMgmt; }catch(e){}

// ── 進言: 今季から即時 ──
function applyAdviceNow(){
  if(typeof window.applyPendingAdvice==='function') window.applyPendingAdvice();
  else if(typeof applyPendingAdvice==='function') applyPendingAdvice();
  // horse find if pending
  if(gs.kengen && gs.kengen.shingen==='horse_find' && typeof grantHorseFind==='function' && !gs.kengen._horseGranted){
    try{ grantHorseFind(); gs.kengen._horseGranted=true; }catch(e){}
  }
}

var _kg = window.kgPick;
window.kgPick = function(type, val, btn){
  if(typeof _kg==='function') _kg(type, val, btn);
  // after successful pay+select
  if(type==='shingen' && gs.kengen && gs.kengen.shingen===val && gs.kengen.paidThisTurn && !gs.kengen.appliedThisTurn){
    applyAdviceNow();
    gs.kengen.appliedThisTurn = true;
    // clear pending so next turn hook won't re-apply
    // keep shingen for display; set applied flag checked in applyPendingAdvice wrap
    var kr=document.getElementById('kg-result');
    if(kr){
      kr.textContent = (kr.textContent||'').replace(/次ターンより有効/g,'今季から有効（適用済み）');
      if(kr.textContent.indexOf('今季')<0) kr.textContent += '　→ 今季から有効（適用済み）';
    }
    if(typeof showToast==='function') showToast('進言の効果を今季から適用しました');
  }
};

// prevent double apply on goToNextTurn
var _apa = window.applyPendingAdvice;
window.applyPendingAdvice = function(){
  if(gs.kengen && gs.kengen.appliedThisTurn && gs.kengen._appliedValues===gs.kengen.shingen){
    return; // already applied this selection
  }
  var before = gs.kengen && gs.kengen.shingen;
  if(typeof _apa==='function') _apa();
  if(gs.kengen && before){
    gs.kengen.appliedThisTurn = true;
    gs.kengen._appliedValues = before;
  }
};

// goToNextTurn: reset kengen pay/apply flags for new season; do not re-apply old
(function(){
  var orig = window.goToNextTurn;
  if(typeof orig!=='function') return;
  window.goToNextTurn = function(){
    // skip applyPendingAdvice re-fire if already applied: temporarily mark
    if(gs.kengen && gs.kengen.appliedThisTurn){
      gs.kengen.shingen = null; // consumed
      gs.kengen.paidThisTurn = false;
      gs.kengen.appliedThisTurn = false;
      gs.kengen._appliedValues = null;
      gs.kengen._horseGranted = false;
      gs.kengen.commendTarget = null;
    }
    // clear choices for new letter phase
    gs.choices = {};
    var r = orig.apply(this, arguments);
    ensureCfgTrustRewards();
    ensureMail();
    // after turn, recompute mail
    setTimeout(function(){
      recomputeMailFlags();
      if(typeof window.renderAllLetters==='function') window.renderAllLetters();
      updateMailTabStyles();
    }, 50);
    return r;
  };
})();

// kengen note DOM
function fixKengenNote(){
  var el=document.querySelector('.kengen-note');
  if(el) el.textContent='進言は1つ選べます（今季から有効）\\n！献上品が高いのでご利用は計画的に！';
  // use br
  if(el) el.innerHTML='進言は1つ選べます（今季から有効）<br>！献上品が高いのでご利用は計画的に！';
  var note=document.getElementById('kg-cost-note');
  if(note && note.textContent.indexOf('次ターン')>=0){
    note.textContent=note.textContent.replace(/次ターン/g,'今季');
  }
}

// open letter phase
var _sp = window.setPhase;
if(typeof _sp==='function'){
  window.setPhase = function(p){
    var r=_sp.apply(this, arguments);
    if(p==='letter'){
      ensureCfgTrustRewards();
      ensureMail();
      recomputeMailFlags();
      if(typeof window.renderAllLetters==='function') window.renderAllLetters();
      fixKengenNote();
    }
    return r;
  };
  try{ setPhase = window.setPhase; }catch(e){}
}

// boot
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    ensureCfgTrustRewards();
    ensureMail();
    fixKengenNote();
    recomputeMailFlags();
    if(gs.phase==='letter' && typeof window.renderAllLetters==='function') window.renderAllLetters();
    updateMailTabStyles();
    var btn=document.getElementById('ph-letter-complete');
    if(btn){
      btn.onclick=function(ev){ if(ev) ev.preventDefault(); window.tryGoToMgmt(); };
      btn.setAttribute('onclick','tryGoToMgmt()');
    }
  }, 150);
});

console.log('[letters+trust+advice] ready N0='+TRUST_N0+' N1-3='+TRUST_N123+' N4='+TRUST_N4);
})();
`;

if (!h.includes('[letters+trust+advice] ready')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + FIX + '\n' + h.slice(last);
  console.log('runtime fix inserted');
} else {
  const a = h.indexOf('// ═══ letters simplify + trust rewards');
  const b = h.indexOf('[letters+trust+advice] ready', a);
  const c = h.indexOf('})();', b);
  h = h.slice(0, a) + FIX + h.slice(c + 5);
  console.log('runtime fix replaced');
}

// also patch checkOrderComplete in source for non-window calls
if (h.includes('function checkOrderComplete(key){') && !h.includes('/* trust grant patched */')) {
  h = h.replace(
    `function checkOrderComplete(key){
  var od=gs.order[key]; if(!od||!od.items)return;
  if(od.items.every(function(it){return (it.delivered||0)>=it.qty;})){
    var node=od.node||gs.node[key]||1;
    markNodeCleared(key,node);
    gs.orderLocked[key]=false;
    showToast('✓ '+PNAMES[key]+' ノード'+node+' 依頼完納（撃破/クリア）');
  }
}`,
    `function checkOrderComplete(key){
  var od=gs.order[key]; if(!od||!od.items)return;
  if(od.items.every(function(it){return (it.delivered||0)>=it.qty;})){
    var node=od.node||gs.node[key]||1;
    markNodeCleared(key,node);
    gs.orderLocked[key]=false;
    /* trust grant patched */
    if(!od._trustGranted){
      var tr=20;
      try{
        var conf=CFG.node_orders&&CFG.node_orders[key]&&CFG.node_orders[key][String(node)];
        if(conf&&conf.trust_reward!=null) tr=conf.trust_reward;
        else tr = (node>=4?20:15);
      }catch(e){ tr=(node>=4?20:15); }
      gs.trust[key]=Math.min(100,(gs.trust[key]||0)+tr);
      od._trustGranted=true;
      showToast('✓ '+PNAMES[key]+' ノード'+node+' 依頼完納（信頼 +'+tr+'）');
    } else {
      showToast('✓ '+PNAMES[key]+' ノード'+node+' 依頼完納（撃破/クリア）');
    }
  }
}`
  );
  console.log('checkOrderComplete source patched');
}

fs.writeFileSync(HTML, h, 'utf8');

// syntax
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m, n = 0, fail = false;
while ((m = re.exec(h))) {
  const body = m[1];
  if (!body || body.length < 40) continue;
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
  ready: h.includes('[letters+trust+advice] ready'),
  kengen: h.includes('今季から有効'),
  mailNew: h.includes('mail-new'),
});
