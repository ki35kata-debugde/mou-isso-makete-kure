/**
 * Revert yellow tab frames; show [新着！] text instead.
 * Status line: 出立待ち / 戦地壱・弐・参 / 敵城
 * Keep node-enter via pendingEnter.
 * Buttons: only 確定系 large; ± stay default; couple confirm large+green.
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_tab_shincho_' + Date.now(), h, 'utf8');

// ── CSS: kill yellow mail-new frame; qty back; action buttons large ──
const css = `
/* === tab 新着は文字のみ（枠の黄色は使わない） === */
.tab-btn-5.mail-new{
  box-shadow: none !important;
  background: inherit !important;
}
.tab-btn-5.mail-new .tab-pname{ color: inherit !important; font-weight: inherit !important; }
.tab-dl.tab-shincho{
  color: #b8860b !important;
  font-weight: 700 !important;
  font-size: 9px !important;
}

/* ± は標準サイズに戻す（2倍指定を打ち消し） */
.qty-btn{
  width: 22px !important;
  height: 22px !important;
  font-size: 13px !important;
  border-width: 1px !important;
}
.qty-num{
  min-width: 22px !important;
  font-size: 12px !important;
  font-weight: 400;
}

/* 確定系ボタンのみ大きく */
.btn-sm,
.btn-prod-start,
button.btn-sm,
button.btn-prod-start{
  font-size: 16px !important;
  padding: 12px 28px !important;
  min-height: 48px !important;
  line-height: 1.3 !important;
}

/* 牧場カップリング確定：倍サイズ＋緑 */
#btn-pair-confirm,
button#btn-pair-confirm,
.btn-pair-confirm{
  font-family: 'Noto Serif JP', serif !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  padding: 12px 28px !important;
  min-height: 48px !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  background: var(--green) !important;
  color: var(--paper) !important;
  letter-spacing: 1px;
}
#btn-pair-confirm:hover,
.btn-pair-confirm:hover{
  filter: brightness(1.06);
}
.ranch-pair-row{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.ranch-pair-row select{
  font-size: 14px;
  padding: 8px 10px;
  min-height: 40px;
}
`;

if (!h.includes('/* === tab 新着は文字のみ')) {
  h = h.replace('</style>', css + '\n</style>');
  console.log('css tab+buttons');
}

// ensure couple button has class in HTML generator string
if (!h.includes('class="btn-pair-confirm btn-prod-start">カップリング確定')) {
  h = h.replace(
    /id="btn-pair-confirm"[^>]*>カップリング確定<\/button>/,
    'id="btn-pair-confirm" class="btn-pair-confirm btn-prod-start">カップリング確定</button>'
  );
  console.log('couple class');
}

const FIX = `
// ═══ tab [新着！] + pendingEnter + action buttons ═══
(function(){
'use strict';
if(window.__tabShinchoFix) return;
window.__tabShinchoFix = true;

var PK = window.PKEYS || ['food','horse','siege','weapon'];
var NODE_LOC = {0:'出立待ち', 1:'戦地壱', 2:'戦地弐', 3:'戦地参', 4:'敵城'};

function ensureMailFlags(){
  if(!gs.letterFlags) gs.letterFlags = { used:{}, serial:{}, justEntered:{}, pendingEnter:{} };
  if(!gs.letterFlags.used) gs.letterFlags.used = {};
  if(!gs.letterFlags.justEntered) gs.letterFlags.justEntered = {};
  if(!gs.letterFlags.pendingEnter) gs.letterFlags.pendingEnter = {};
  if(!gs.mail) gs.mail = {};
  PK.forEach(function(k){
    if(!gs.mail[k]) gs.mail[k] = { hasNew:false, lastExchange:null, lastDemand:null };
    if(gs.letterFlags.pendingEnter[k]===undefined) gs.letterFlags.pendingEnter[k] = null;
  });
  if(!gs.choices) gs.choices = {};
  if(!gs.activeLetter) gs.activeLetter = {};
}

function setPendingEnter(key, node){
  ensureMailFlags();
  gs.letterFlags.pendingEnter[key] = node;
  gs.letterFlags.justEntered[key] = true;
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
    if(pend==null) return false;
    if(when.node!=null && pend!==when.node) return false;
    if(when.node==null && when.node_gte!=null && pend<when.node_gte) return false;
  }
  var id = when._id || when.id || '';
  if(id && gs.letterFlags.used[id]) return false;
  if(when.once && id && gs.letterFlags.used[id]) return false;
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
      if(gs.letterFlags.used[pers.id]) has = false;
      else if(gs.choices[key] && gs.choices[key].letterId === pers.id) has = false;
      else has = true;
    }
    gs.mail[key].hasNew = has;
    gs.mail[key].pendingPersonal = has ? pers : null;
    gs.mail[key].pendingDemand = pickNewEntry(key, 'demand');
  });
}
window.recomputeMailFlags = recomputeMailFlags;

function locationLabel(key){
  if(!gs.sortied || !gs.sortied[key]) return '出立待ち';
  var n = (gs.node && gs.node[key]) || 1;
  if(n < 0) n = 0;
  if(n > 4) n = 4;
  return NODE_LOC[n] || ('ノード'+n);
}

/** 枠の黄色は付けない。文言だけ更新 */
function updateMailTabStyles(){
  ensureMailFlags();
  recomputeMailFlags();
  PK.forEach(function(key){
    var tab = document.getElementById('ptab-'+key);
    if(tab) tab.classList.remove('mail-new'); // 黄色枠を使わない
    var req = document.getElementById('ltab-req-'+key);
    var dl = document.getElementById('ltab-dl-'+key);
    var loc = locationLabel(key);
    var hasNew = !!(gs.mail[key] && gs.mail[key].hasNew);
    if(req){
      // 1行目: 状態のみ（準備：〜 は出さない）
      req.textContent = loc;
    }
    if(dl){
      if(hasNew){
        dl.textContent = '[新着！]';
        dl.classList.add('tab-shincho');
      } else {
        dl.textContent = '';
        dl.classList.remove('tab-shincho');
      }
    }
    var chk = document.getElementById('tab-check-'+key);
    if(chk) chk.textContent = (gs.choices[key]!==undefined) ? '☑ ' : '';
  });
}
window.updateMailTabStyles = updateMailTabStyles;

// 完全上書き: 従来の2行「準備」「出立待ち」をやめる
window.updateTabLabels = function(){
  updateMailTabStyles();
  // 謁見タブ
  var ks = document.getElementById('kg-summary-tab');
  if(ks){
    var parts = [];
    if(gs.kengen && gs.kengen.shingen) parts.push('進言✓');
    ks.textContent = parts.length ? parts.join(' ') : '進言';
  }
};
try{ updateTabLabels = window.updateTabLabels; }catch(e){}

function fillT(s, key){
  if(!s) return '';
  if(typeof fillTemplate==='function') return fillTemplate(s, key);
  var od = (gs.order&&gs.order[key])||{};
  return String(s)
    .replace(/\{\{order_label\}\}/g, od.label||'')
    .replace(/\{\{deadline\}\}/g, String(od.deadline!=null?od.deadline:'?'))
    .replace(/\{\{node\}\}/g, String(gs.node[key]||0));
}

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

window.renderLetter = function(key){
  ensureMailFlags();
  recomputeMailFlags();
  var mail = gs.mail[key];
  var demEl = document.getElementById('lt-'+key+'-demand');
  var gm = document.getElementById('girl-msg-'+key);
  var pb = document.getElementById('personal-body-'+key);
  var area = document.getElementById('choices-area-'+key);

  var dem = mail.pendingDemand;
  var demBody, demFrom;
  if(dem){
    demBody = fillT(dem.body, key);
    demFrom = '文官より（ノード'+(gs.node[key]||0)+'）';
    mail.lastDemand = { body:demBody, node:gs.node[key]||0, fromLabel:demFrom, id:dem.id };
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].demand = dem;
    gs.activeLetter[key].demandId = dem.id;
  } else if(mail.lastDemand){
    demBody = mail.lastDemand.body;
    demFrom = (mail.lastDemand.fromLabel||'文官より')+'・再掲';
  } else {
    var od = gs.order&&gs.order[key];
    demFrom = '文官より';
    demBody = od
      ? ('このノードの依頼：'+od.label+'（納期残 '+(od.deadline!=null?od.deadline:'?')+'T）')
      : '新しい文官報告はありません。';
  }
  if(demEl){
    demEl.innerHTML = '<div class="letter-block"><div class="letter-from">'+demFrom+'</div>'+
      '<div class="letter-text">'+String(demBody).replace(/\\n/g,'<br>')+'</div></div>';
  }

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
  gs.trust[key] = Math.min(100, (gs.trust[key]||0)+(trust||0));
  if(el){
    var area=document.getElementById('choices-area-'+key);
    if(area) area.querySelectorAll('.choice-btn').forEach(function(b){ b.classList.remove('selected'); });
    el.classList.add('selected');
  }
  if(lid) gs.letterFlags.used[lid] = true;
  if(pe && pe.when && pe.when.on_node_enter) clearPendingEnter(key);
  var dem = gs.mail[key].pendingDemand;
  if(dem && dem.id) gs.letterFlags.used[dem.id] = true;
  gs.mail[key].lastExchange = { intro:intro, body:body, choiceText:ctext, trustDelta:trust||0, letterId:lid, turn:gs.turn };
  gs.mail[key].hasNew = false;
  gs.mail[key].pendingPersonal = null;
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updatePrinceBar==='function') updatePrinceBar();
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
  PK.forEach(function(k){
    var dem = gs.mail[k] && gs.mail[k].pendingDemand;
    if(dem && dem.id) gs.letterFlags.used[dem.id] = true;
    if(!gs.mail[k].hasNew) clearPendingEnter(k);
  });
  if(typeof markLettersConsumedForTurn==='function'){
    try{ markLettersConsumedForTurn(); }catch(e){}
  }
  if(typeof window.goToMgmt==='function') window.goToMgmt();
  else if(typeof goToMgmt==='function') goToMgmt();
};
try{ tryGoToMgmt = window.tryGoToMgmt; }catch(e){}

// sortie → pendingEnter
(function(){
  var prev = window.sortie;
  if(typeof prev!=='function' && typeof sortie==='function') prev = sortie;
  if(typeof prev!=='function') return;
  window.sortie = function(key){
    var r = prev.apply(this, arguments);
    if(gs.sortied && gs.sortied[key]){
      setPendingEnter(key, gs.node[key]||1);
      console.log('[mail] pendingEnter after sortie', key, gs.letterFlags.pendingEnter[key]);
    }
    if(typeof window.updateTabLabels==='function') window.updateTabLabels();
    return r;
  };
  try{ sortie = window.sortie; }catch(e){}
})();

// goToNextTurn: preserve pendingEnter
(function(){
  var orig = window.goToNextTurn;
  if(typeof orig!=='function') return;
  window.goToNextTurn = function(){
    ensureMailFlags();
    var snap = {};
    PK.forEach(function(k){ snap[k] = gs.letterFlags.pendingEnter[k]; });
    var r = orig.apply(this, arguments);
    ensureMailFlags();
    PK.forEach(function(k){
      if(snap[k]!=null){
        gs.letterFlags.pendingEnter[k] = snap[k];
        gs.letterFlags.justEntered[k] = true;
      }
    });
    gs.choices = {};
    setTimeout(function(){
      recomputeMailFlags();
      if(typeof window.renderAllLetters==='function') window.renderAllLetters();
      updateMailTabStyles();
    }, 60);
    return r;
  };
})();

// setPhase letter
(function(){
  var _sp = window.setPhase;
  if(typeof _sp!=='function') return;
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
})();

// ranch couple button style after render
(function(){
  var prev = window.renderSeasonActions || (typeof renderSeasonActions==='function'?renderSeasonActions:null);
  if(!prev) return;
  window.renderSeasonActions = function(){
    prev.apply(this, arguments);
    var b = document.getElementById('btn-pair-confirm');
    if(b){
      b.className = 'btn-pair-confirm btn-prod-start';
      b.textContent = b.textContent || 'カップリング確定';
    }
  };
  try{ renderSeasonActions = window.renderSeasonActions; }catch(e){}
})();

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    ensureMailFlags();
    // 起動時に全タブから mail-new を除去
    PK.forEach(function(k){
      var t=document.getElementById('ptab-'+k);
      if(t) t.classList.remove('mail-new');
    });
    recomputeMailFlags();
    updateMailTabStyles();
    if(gs.phase==='letter' && typeof window.renderAllLetters==='function') window.renderAllLetters();
  }, 180);
});

console.log('[tab shincho] ready — no yellow frame, [新着！] text only');
})();
`;

if (!h.includes('[tab shincho] ready')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + FIX + '\n' + h.slice(last);
  console.log('fix inserted');
} else {
  const a = h.indexOf('// ═══ tab [新着！]');
  const b = h.indexOf('[tab shincho] ready', a);
  const c = h.indexOf('})();', b);
  h = h.slice(0, a) + FIX + h.slice(c + 5);
  console.log('fix replaced');
}

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
console.log('DONE', {
  fail,
  ready: h.includes('[tab shincho] ready'),
  noYellowCss: h.includes('tab 新着は文字のみ'),
  qty22: h.includes('width: 22px !important'),
});
