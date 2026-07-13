/**
 * Fix: yellow only when hasNew; node-enter mail via pendingEnter (survives turn);
 * facility buttons 2x; ranch couple button colored like prod buttons
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_mail_btn_' + Date.now(), h, 'utf8');

// ── CSS: buttons 2x + mail-new clearer + couple btn ──
const css = `
/* facility / market buttons ~2x */
.qty-btn{
  width:44px !important;
  height:44px !important;
  font-size:22px !important;
  border-width:2px !important;
}
.qty-num{
  min-width:36px !important;
  font-size:16px !important;
  font-weight:700;
}
.btn-sm{
  font-size:16px !important;
  padding:12px 28px !important;
  min-height:48px;
}
.btn-prod-start{
  font-size:16px !important;
  padding:12px 28px !important;
  min-height:48px;
}
/* ranch season action buttons */
.ranch-season-actions button,
#ranch-season-actions button,
button#btn-pair-confirm,
.btn-pair-confirm{
  font-family:'Noto Serif JP',serif !important;
  font-size:16px !important;
  font-weight:700 !important;
  padding:12px 24px !important;
  min-height:48px !important;
  border:none !important;
  border-radius:4px !important;
  cursor:pointer !important;
  background:var(--green) !important;
  color:var(--paper) !important;
  letter-spacing:1px;
  box-shadow:0 1px 0 rgba(0,0,0,.15);
}
.ranch-season-actions button:hover,
#btn-pair-confirm:hover,
.btn-pair-confirm:hover{
  filter:brightness(1.05);
  border-color:transparent !important;
}
.ranch-season-actions button:disabled{
  opacity:.4 !important;
  cursor:default !important;
}
.ranch-pair-row{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:10px;
  width:100%;
}
.ranch-pair-row select{
  font-size:14px;
  padding:8px 10px;
  min-height:40px;
}
/* mail-new only — gold frame for NEW mail (not urg-tab) */
.tab-btn-5.mail-new{
  box-shadow: inset 0 0 0 3px #d4a017 !important;
  background: linear-gradient(#fff8dc, #f0e0a8) !important;
}
.tab-btn-5:not(.mail-new){
  /* ensure no leftover gold from class glitch */
}
/* stop urg-tab looking like mail (keep subtle) */
.tab-btn-5.urg-tab:not(.mail-new){
  box-shadow:none;
}
`;

if (!h.includes('/* facility / market buttons ~2x */')) {
  h = h.replace('</style>', css + '\n</style>');
  console.log('css buttons+mail');
} else {
  // replace block
  const a = h.indexOf('/* facility / market buttons ~2x */');
  if (a >= 0) {
    const b = h.indexOf('</style>', a);
    // leave and append fresh at end of style - skip
  }
}

// Make couple button use class in renderSeasonActions string
h = h.replace(
  'id="btn-pair-confirm">カップリング確定</button>',
  'id="btn-pair-confirm" class="btn-pair-confirm btn-prod-start">カップリング確定</button>'
);
console.log('couple btn class');

const FIX = `
// ═══ mail yellow + node enter + button polish ═══
(function(){
'use strict';
if(window.__mailYellowNodeBtn) return;
window.__mailYellowNodeBtn = true;

var PK = window.PKEYS || ['food','horse','siege','weapon'];

function ensureMailFlags(){
  if(!gs.letterFlags) gs.letterFlags = { used:{}, serial:{}, justEntered:{}, pendingEnter:{} };
  if(!gs.letterFlags.used) gs.letterFlags.used = {};
  if(!gs.letterFlags.justEntered) gs.letterFlags.justEntered = {};
  if(!gs.letterFlags.pendingEnter) gs.letterFlags.pendingEnter = {};
  if(!gs.mail) gs.mail = {};
  PK.forEach(function(k){
    if(!gs.mail[k]) gs.mail[k] = { hasNew:false, lastExchange:null, lastDemand:null };
    if(gs.letterFlags.pendingEnter[k]==null) gs.letterFlags.pendingEnter[k] = null;
  });
  if(!gs.choices) gs.choices = {};
  if(!gs.activeLetter) gs.activeLetter = {};
}

/** ノード到達メール用。justEnteredはターン進行で消えるので pendingEnter を正とする */
function setPendingEnter(key, node){
  ensureMailFlags();
  gs.letterFlags.pendingEnter[key] = node;
  gs.letterFlags.justEntered[key] = true; // 互換
}

function clearPendingEnter(key){
  ensureMailFlags();
  gs.letterFlags.pendingEnter[key] = null;
  gs.letterFlags.justEntered[key] = false;
}

function letterDisabled(e){ return !e || e.disabled === true; }

function matchWhenMail(when, key){
  if(!when) return true;
  if(when.fallback) return false;
  ensureMailFlags();
  var node = gs.node[key]||0;
  var trust = gs.trust[key]||0;
  var pend = gs.letterFlags.pendingEnter[key];

  if(when.node!=null && node!==when.node) return false;
  if(when.node_gte!=null && node<when.node_gte) return false;
  if(when.node_lte!=null && node>when.node_lte) return false;
  if(when.trust_gte!=null && trust<when.trust_gte) return false;
  if(when.trust_lt!=null && trust>=when.trust_lt) return false;

  if(when.on_node_enter){
    // 到達したノード番号が pending と一致するときだけ
    if(pend==null) return false;
    if(when.node!=null && pend!==when.node) return false;
    if(when.node==null && when.node_gte!=null && pend<when.node_gte) return false;
    if(when.node==null && when.node_gte==null && pend==null) return false;
  }

  var id = when._id || when.id || '';
  if(when.once && id && gs.letterFlags.used[id]) return false;
  // node enter letters also once-per-arrival: mark used by id
  if(when.on_node_enter && id && gs.letterFlags.used[id]) return false;

  return true;
}

function poolKind(key, kind){
  return (CFG.letterPool && CFG.letterPool[key] && CFG.letterPool[key][kind])
    || (CFG.letters && CFG.letters[key] && CFG.letters[key][kind])
    || (typeof GAME_DATA!=='undefined' && GAME_DATA.letters && GAME_DATA.letters[key] && GAME_DATA.letters[key][kind])
    || [];
}

function pickNewEntry(key, kind){
  var pool = poolKind(key, kind);
  var cands = [];
  pool.forEach(function(raw){
    if(letterDisabled(raw)) return;
    if(raw.when && raw.when.fallback) return;
    var e = Object.assign({}, raw, { when: Object.assign({}, raw.when||{}) });
    e.when._id = e.id;
    if(e.id && gs.letterFlags.used[e.id]) return;
    if(!matchWhenMail(e.when, key)) return;
    cands.push(e);
  });
  cands.sort(function(a,b){ return (b.priority||0)-(a.priority||0); });
  return cands[0] || null;
}

function recomputeMailFlags(){
  ensureMailFlags();
  PK.forEach(function(key){
    var pers = pickNewEntry(key, 'personal');
    var has = false;
    if(pers){
      // already replied this letter id this phase
      if(gs.choices[key] && gs.choices[key].letterId === pers.id) has = false;
      else if(gs.letterFlags.used[pers.id]) has = false;
      else has = true;
    }
    gs.mail[key].hasNew = has;
    gs.mail[key].pendingPersonal = has ? pers : null;
    gs.mail[key].pendingDemand = pickNewEntry(key, 'demand');
  });
}
window.recomputeMailFlags = recomputeMailFlags;

function updateMailTabStyles(){
  ensureMailFlags();
  recomputeMailFlags();
  PK.forEach(function(key){
    var tab = document.getElementById('ptab-'+key);
    if(!tab) return;
    var on = !!(gs.mail[key] && gs.mail[key].hasNew);
    tab.classList.toggle('mail-new', on);
    // 出立可能の urg-tab は黄色枠に使わない（クラスは残して文字色のみ）
    if(on) tab.classList.remove('urg-tab');
  });
}
window.updateMailTabStyles = updateMailTabStyles;

function fillT(s, key){
  if(!s) return '';
  if(typeof fillTemplate==='function') return fillTemplate(s, key);
  var od = (gs.order&&gs.order[key])||{};
  return String(s)
    .replace(/\{\{order_label\}\}/g, od.label||'')
    .replace(/\{\{deadline\}\}/g, String(od.deadline!=null?od.deadline:'?'))
    .replace(/\{\{node\}\}/g, String(gs.node[key]||0));
}

window.renderLetter = function(key){
  ensureMailFlags();
  recomputeMailFlags();
  var mail = gs.mail[key];
  var demEl = document.getElementById('lt-'+key+'-demand');
  var gm = document.getElementById('girl-msg-'+key);
  var pb = document.getElementById('personal-body-'+key);
  var area = document.getElementById('choices-area-'+key);

  // demand 文官
  var dem = mail.pendingDemand;
  var demBody, demFrom;
  if(dem){
    demBody = fillT(dem.body, key);
    demFrom = '文官より（ノード'+(gs.node[key]||0)+' 新規）';
    mail.lastDemand = { body:demBody, node:gs.node[key]||0, fromLabel:demFrom, id:dem.id };
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].demand = dem;
    gs.activeLetter[key].demandId = dem.id;
  } else if(mail.lastDemand){
    demBody = mail.lastDemand.body;
    demFrom = (mail.lastDemand.fromLabel||'文官より') + '・再掲';
  } else {
    var od = gs.order&&gs.order[key];
    demFrom = '文官より';
    demBody = od
      ? ('このノードの依頼：'+od.label+'（納期残 '+(od.deadline!=null?od.deadline:'?')+'T）\\n※新しい文官報告はありません。')
      : '新しい文官報告はありません。';
  }
  if(demEl){
    demEl.innerHTML = '<div class="letter-block"><div class="letter-from">'+demFrom+'</div>'+
      (!dem?'<div class="mail-archive-note">（このノードの記録）</div>':'')+
      '<div class="letter-text">'+String(demBody).replace(/\\n/g,'<br>').replace(/\\n/g,'<br>')+'</div></div>';
  }

  // personal 娘
  if(mail.hasNew && mail.pendingPersonal){
    var pe = mail.pendingPersonal;
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].personal = pe;
    gs.activeLetter[key].personalId = pe.id;
    if(gm) gm.textContent = pe.intro || '娘からの手紙です。';
    if(pb) pb.innerHTML = '<div class="letter-block"><div class="letter-text">'+String(pe.body||'').replace(/\\n/g,'<br>')+'</div></div>';
    renderChoicesMail(key, pe.choices||defaultCh(), pe.id);
  } else {
    var ex = mail.lastExchange;
    if(gm) gm.textContent = ex ? '前回のやりとりはこんなでした。' : 'まだ娘とのやりとりはありません。';
    if(pb){
      if(ex){
        pb.innerHTML = '<div class="mail-archive-note">前回のやりとり</div>'+
          '<div class="letter-block"><div class="letter-text">'+String(ex.body||'').replace(/\\n/g,'<br>')+'</div></div>'+
          (ex.choiceText?'<div class="letter-block" style="margin-top:8px"><div class="letter-from">あなたの返事</div><div class="letter-text">'+ex.choiceText+'</div></div>':'');
      } else {
        pb.innerHTML = '<div class="letter-block"><div class="letter-text">（記録なし）</div></div>';
      }
    }
    if(area) area.innerHTML = '';
  }
  updateMailTabStyles();
};

function defaultCh(){
  return [{icon:'📋',text:'「承知しました」',trust:0},{icon:'🤝',text:'「気にかけています」',trust:0}];
}
function renderChoicesMail(key, opts, letterId){
  var area=document.getElementById('choices-area-'+key); if(!area) return;
  var chosen=gs.choices[key];
  var html='<div class="choices-wrap"><div class="choices-label">返事を選んでください（取り消し不可）</div>';
  opts.forEach(function(o,i){
    var sel=(chosen&&chosen.idx===i)?'selected':'';
    html+='<button type="button" class="choice-btn '+sel+'" data-i="'+i+'">'+
      '<span class="choice-icon">'+(o.icon||'')+'</span><div>'+o.text+
      (o.trust?('<span class="trust-hint">✦ 信頼度 +'+o.trust+'</span>'):'')+'</div></button>';
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

window.selectChoice = function(key, idx, trust, el, letterId, choiceText){
  ensureMailFlags();
  recomputeMailFlags();
  if(!gs.mail[key] || !gs.mail[key].hasNew){
    showToast('いま返信が必要な手紙はありません');
    return;
  }
  if(gs.choices[key]!==undefined) return;
  var pe = gs.mail[key].pendingPersonal;
  var lid = letterId || (pe && pe.id);
  var body = pe && pe.body;
  var intro = pe && pe.intro;
  var ctext = choiceText || (pe && pe.choices && pe.choices[idx] && pe.choices[idx].text) || '';

  gs.choices[key] = { idx:idx, trust:trust||0, letterId:lid, choiceText:ctext };
  gs.trust[key] = Math.min(100, (gs.trust[key]||0) + (trust||0));
  if(el){
    var area=document.getElementById('choices-area-'+key);
    if(area) area.querySelectorAll('.choice-btn').forEach(function(b){ b.classList.remove('selected'); });
    el.classList.add('selected');
  }

  // 消費: once / node-enter を即 used に（黄色解除の本命）
  if(lid) gs.letterFlags.used[lid] = true;
  if(pe && pe.when && pe.when.on_node_enter){
    clearPendingEnter(key);
  }
  // 文官 demand も同じ到達なら同時消費
  var dem = gs.mail[key].pendingDemand;
  if(dem && dem.id){
    gs.letterFlags.used[dem.id] = true;
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].demand = dem;
  }

  gs.mail[key].lastExchange = {
    intro:intro, body:body, choiceText:ctext, trustDelta:trust||0, letterId:lid, turn:gs.turn
  };
  gs.mail[key].hasNew = false;
  gs.mail[key].pendingPersonal = null;

  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updatePrinceBar==='function') updatePrinceBar();
  updateMailTabStyles();
  // 再描画でアーカイブ表示に
  window.renderLetter(key);
  showToast((typeof PNAMES!=='undefined'?PNAMES[key]:key)+'へ返信しました');
};

window.renderAllLetters = function(){
  ensureMailFlags();
  recomputeMailFlags();
  PK.forEach(function(k){ window.renderLetter(k); });
  updateMailTabStyles();
};
try{ renderAllLetters = window.renderAllLetters; }catch(e){}

window.tryGoToMgmt = function(){
  ensureMailFlags();
  recomputeMailFlags();
  var pending = PK.filter(function(k){ return gs.mail[k] && gs.mail[k].hasNew; });
  if(pending.length){
    var msg = '返信していない手紙があります';
    if(typeof showToast==='function') showToast(msg);
    alert(msg);
    return;
  }
  // 未使用の demand だけ消費（personal は返信時に済）
  PK.forEach(function(k){
    var dem = gs.mail[k] && gs.mail[k].pendingDemand;
    if(dem && dem.id) gs.letterFlags.used[dem.id] = true;
    // pendingEnter は返信で消えている想定。残っていればクリア
    // 新規が無いのに残っている enter は消化
    if(!gs.mail[k].hasNew) clearPendingEnter(k);
  });
  if(typeof markLettersConsumedForTurn==='function'){
    try{ markLettersConsumedForTurn(); }catch(e){}
  }
  PK.forEach(function(k){ if(gs.letterFlags) gs.letterFlags.justEntered[k]=false; });
  if(typeof window.goToMgmt==='function') window.goToMgmt();
  else if(typeof goToMgmt==='function') goToMgmt();
};
try{ tryGoToMgmt = window.tryGoToMgmt; }catch(e){}

// sortie: set pendingEnter
function wrapSortie(){
  var prev = window.sortie;
  if(typeof prev!=='function' && typeof sortie==='function') prev = sortie;
  if(typeof prev!=='function') return;
  window.sortie = function(key){
    var r = prev.apply(this, arguments);
    // after sortie node should be 1
    if(gs.sortied && gs.sortied[key]){
      setPendingEnter(key, gs.node[key]||1);
      console.log('[mail] pendingEnter', key, gs.letterFlags.pendingEnter[key]);
    }
    return r;
  };
  try{ sortie = window.sortie; }catch(e){}
}
wrapSortie();

// 完納後に次ノードへ進め、到達メール用 pendingEnter をセット（1回だけ）
var _coc = window.checkOrderComplete;
window.checkOrderComplete = function(key){
  if(typeof _coc==='function') _coc(key);
  var od = gs.order && gs.order[key];
  if(!od || !od.items) return;
  if(!od.items.every(function(it){ return (it.delivered||0)>=it.qty; })) return;
  if(od._nodeAdvanced) return;
  var n = od.node || gs.node[key] || 1;
  var next = n + 1;
  if(next > 4) return;
  od._nodeAdvanced = true;
  gs.node[key] = next;
  if(typeof setOrderForNode==='function') setOrderForNode(key, next);
  setPendingEnter(key, next);
  showToast((typeof PNAMES!=='undefined'?PNAMES[key]:key)+' がノード'+next+'へ（次の手紙で報告）');
  if(typeof refreshMapNodes==='function') refreshMapNodes();
};
try{ checkOrderComplete = window.checkOrderComplete; }catch(e){}

// CRITICAL: do not wipe pendingEnter / justEntered on turn advance before letter phase
(function(){
  var orig = window.goToNextTurn;
  if(typeof orig!=='function') return;
  window.goToNextTurn = function(){
    ensureMailFlags();
    // snapshot pending enter
    var snap = {};
    PK.forEach(function(k){ snap[k] = gs.letterFlags.pendingEnter[k]; });
    var r = orig.apply(this, arguments);
    // restore if something cleared them
    ensureMailFlags();
    PK.forEach(function(k){
      if(snap[k]!=null){
        gs.letterFlags.pendingEnter[k] = snap[k];
        gs.letterFlags.justEntered[k] = true;
      }
    });
    gs.choices = {}; // new letter phase
    setTimeout(function(){
      recomputeMailFlags();
      if(typeof window.renderAllLetters==='function') window.renderAllLetters();
      updateMailTabStyles();
    }, 60);
    return r;
  };
})();

// updateTabLabels: don't leave mail-new wrong; re-apply mail styles after
var _ut = window.updateTabLabels;
window.updateTabLabels = function(){
  if(typeof _ut==='function') _ut();
  updateMailTabStyles();
};
try{ updateTabLabels = window.updateTabLabels; }catch(e){}

// setPhase letter
var _sp = window.setPhase;
if(typeof _sp==='function'){
  window.setPhase = function(p){
    var r = _sp.apply(this, arguments);
    if(p==='letter'){
      ensureMailFlags();
      recomputeMailFlags();
      if(typeof window.renderAllLetters==='function') window.renderAllLetters();
      updateMailTabStyles();
      var btn=document.getElementById('ph-letter-complete');
      if(btn){
        btn.onclick=function(ev){ if(ev) ev.preventDefault(); window.tryGoToMgmt(); };
        btn.setAttribute('onclick','tryGoToMgmt()');
      }
    }
    return r;
  };
  try{ setPhase = window.setPhase; }catch(e){}
}

// ranch couple button polish after render
var _rsa = window.renderSeasonActions;
if(typeof _rsa==='function' || typeof renderSeasonActions==='function'){
  var prev = window.renderSeasonActions || renderSeasonActions;
  window.renderSeasonActions = function(){
    prev.apply(this, arguments);
    var b = document.getElementById('btn-pair-confirm');
    if(b){
      b.classList.add('btn-pair-confirm','btn-prod-start');
      b.style.background = '';
      b.style.color = '';
      b.style.fontSize = '';
      b.style.padding = '';
    }
    // enlarge any season action buttons
    var box = document.getElementById('ranch-season-actions');
    if(box){
      box.querySelectorAll('button').forEach(function(btn){
        btn.classList.add('btn-pair-confirm');
      });
    }
  };
  try{ renderSeasonActions = window.renderSeasonActions; }catch(e){}
}

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    ensureMailFlags();
    recomputeMailFlags();
    updateMailTabStyles();
    if(gs.phase==='letter' && typeof window.renderAllLetters==='function') window.renderAllLetters();
  }, 200);
});

console.log('[mail yellow+node+btn] ready');
})();
`;

if (!h.includes('[mail yellow+node+btn] ready')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + FIX + '\n' + h.slice(last);
  console.log('fix inserted');
} else {
  const a = h.indexOf('// ═══ mail yellow + node enter');
  const b = h.indexOf('[mail yellow+node+btn] ready', a);
  const c = h.indexOf('})();', b);
  h = h.slice(0, a) + FIX + h.slice(c + 5);
  console.log('fix replaced');
}

// Patch source goToNextTurn wrappers that force justEntered=false
// Neutralize bulk clear lines carefully by replacing with pendingEnter-aware no-op comments in known patterns
h = h.replace(
  /PKEYS\.forEach\(function\(k\)\{\s*if\(gs\.letterFlags&&gs\.letterFlags\.justEntered\)\s*gs\.letterFlags\.justEntered\[k\]=false;\s*\}\);/g,
  '/* justEntered clear moved to letter phase end — see pendingEnter */ PKEYS.forEach(function(k){});'
);
h = h.replace(
  /PKEYS\.forEach\(key=>\{gs\.letterFlags\.justEntered\[key\]=false;\}\);/g,
  '/* justEntered clear deferred */ PKEYS.forEach(key=>{});'
);

fs.writeFileSync(HTML, h, 'utf8');

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
console.log('DONE', { fail, ready: h.includes('[mail yellow+node+btn] ready'), qty2x: h.includes('width:44px'), couple: h.includes('btn-pair-confirm') });
