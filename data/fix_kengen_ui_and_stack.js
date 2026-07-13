/**
 * Fix audience UI + ensureMarket stack overflow + goToMgmt
 * - Button per line with effect text
 * - UI_SETTINGS labels (…増員)
 * - 増産 = 1 year of seasonal restock to shop
 * - 褒める = trust +10
 * - Conditions shown on locked options
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_kengen_ui_' + Date.now(), h, 'utf8');

// ── CSS for stacked kengen buttons ──
const css = `
/* kengen stacked rows */
#kg-shingen.kg-opts{
  display:flex;
  flex-direction:column;
  flex-wrap:nowrap;
  gap:8px;
  align-items:stretch;
}
#kg-shingen .kg-opt{
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  text-align:left;
  padding:8px 12px;
  width:100%;
  box-sizing:border-box;
}
#kg-shingen .kg-opt .kg-title{
  font-weight:700;
  font-size:13px;
  color:var(--ink);
}
#kg-shingen .kg-opt .kg-effect{
  font-size:11px;
  color:var(--faded);
  margin-top:3px;
  line-height:1.5;
  font-weight:400;
}
#kg-shingen .kg-opt.locked-opt{
  opacity:0.45;
  cursor:not-allowed;
}
#kg-shingen .kg-opt .kg-sub{
  margin-top:6px;
  display:none;
}
#kg-shingen .kg-opt.chosen .kg-sub,
#kg-shingen .kg-opt .kg-sub.show{
  display:block;
}
`;
if (!h.includes('#kg-shingen.kg-opts')) {
  h = h.replace('</style>', css + '\n</style>');
  console.log('css kengen stacked');
}

// ── Replace kengen HTML buttons ──
const kengenBlockRe =
  /<div class="kengen-note">[\s\S]*?<div id="kg-result"><\/div>/;

const kengenHtml = `<div class="kengen-note">進言は1つ選べます（次ターンから有効）</div>
  <div class="kengen-group">
    <div class="kengen-group-label">進 言</div>
    <div class="kg-opts" id="kg-shingen">
      <button type="button" class="kg-opt" data-val="iron" onclick="kgPick('shingen','iron',this)">
        <span class="kg-title">鉄増産</span>
        <span class="kg-effect">効果：店の鉄在庫を約1年分（季節補充×4）増やす</span>
      </button>
      <button type="button" class="kg-opt" data-val="wood" onclick="kgPick('shingen','wood',this)">
        <span class="kg-title">木材増産</span>
        <span class="kg-effect">効果：店の木材在庫を約1年分増やす</span>
      </button>
      <button type="button" class="kg-opt" data-val="food_mat" onclick="kgPick('shingen','food_mat',this)">
        <span class="kg-title">兵糧増産</span>
        <span class="kg-effect">効果：店の兵糧在庫を約1年分増やす</span>
      </button>
      <button type="button" class="kg-opt" data-val="herb" onclick="kgPick('shingen','herb',this)">
        <span class="kg-title">薬草増産</span>
        <span class="kg-effect">効果：店の薬草在庫を約1年分増やす</span>
      </button>
      <button type="button" class="kg-opt" data-val="horse_find" onclick="kgPick('shingen','horse_find',this)">
        <span class="kg-title">名馬探索</span>
        <span class="kg-effect">効果：次ターン開始時、牧場に馬（★1〜2）が1頭加わる</span>
      </button>
      <button type="button" class="kg-opt" id="kg-staff-smith" data-val="staff_smith" onclick="kgPick('shingen','staff_smith',this)">
        <span class="kg-title" id="kg-label-staff-smith">工房増員</span>
        <span class="kg-effect" id="kg-eff-staff-smith">効果：工房の生産枠+3　条件：攻三城が戦線を突破時に解放</span>
      </button>
      <button type="button" class="kg-opt" id="kg-staff-pharm" data-val="staff_pharm" onclick="kgPick('shingen','staff_pharm',this)">
        <span class="kg-title" id="kg-label-staff-pharm">薬房増員</span>
        <span class="kg-effect" id="kg-eff-staff-pharm">効果：薬房の生産枠+3　条件：武刃四が戦線を突破時に解放</span>
      </button>
      <button type="button" class="kg-opt" id="kg-market-up" data-val="market_up" onclick="kgPick('shingen','market_up',this)">
        <span class="kg-title" id="kg-label-market-up">市場強化</span>
        <span class="kg-effect" id="kg-eff-market-up">効果：店在庫の上限アップ　条件：兵糧太が戦線を突破時に解放</span>
      </button>
      <button type="button" class="kg-opt" id="kg-stable-up" data-val="stable_up" onclick="kgPick('shingen','stable_up',this)">
        <span class="kg-title" id="kg-label-stable-up">厩舎拡張</span>
        <span class="kg-effect" id="kg-eff-stable-up">効果：つがい枠+1　条件：騎馬次が戦線を突破時に解放</span>
      </button>
      <button type="button" class="kg-opt" data-val="commend" onclick="kgPick('shingen','commend',this)">
        <span class="kg-title">皇子を褒める</span>
        <span class="kg-effect">効果：選んだ皇子の信頼度+10</span>
        <select class="kg-sub" id="kg-commend-sel" onclick="event.stopPropagation()">
          <option value="food">兵糧太</option>
          <option value="horse">騎馬次</option>
          <option value="siege">攻三城</option>
          <option value="weapon">武刃四</option>
        </select>
      </button>
    </div>
  </div>
  <div id="kg-result"></div>`;

if (kengenBlockRe.test(h) || h.includes('id="kg-shingen"')) {
  // replace from kengen-note through kg-result
  const re = /<div class="kengen-note">[\s\S]*?<div id="kg-result"><\/div>/;
  if (re.test(h)) {
    h = h.replace(re, kengenHtml);
    console.log('kengen HTML rebuilt');
  } else {
    console.warn('kengen HTML pattern miss');
  }
}

// ── Fix ensureMarket recursion + full audience logic patch ──
const FIX = `
// ═══ kengen UI + market stack fix + goToMgmt ═══
(function(){
'use strict';
if(window.__kengenUiFix) return;
window.__kengenUiFix = true;

// --- UI_SETTINGS (editable labels) ---
window.UI_SETTINGS = window.UI_SETTINGS || {
  label_staff_smith: '工房増員',
  label_staff_pharm: '薬房増員',
  label_market_up: '市場強化',
  label_stable_up: '厩舎拡張',
  effect_boost: '効果：店の{mat}在庫を約1年分（季節補充×4）増やす',
  effect_staff_smith: '効果：工房の生産枠+3　条件：攻三城が戦線を突破時に解放',
  effect_staff_pharm: '効果：薬房の生産枠+3　条件：武刃四が戦線を突破時に解放',
  effect_market_up: '効果：店在庫の上限アップ　条件：兵糧太が戦線を突破時に解放',
  effect_stable_up: '効果：つがい枠+1　条件：騎馬次が戦線を突破時に解放',
  effect_horse_find: '効果：次ターン開始時、牧場に馬（★1〜2）が1頭加わる',
  effect_commend: '効果：選んだ皇子の信頼度+10',
  cond_locked_prefix: '（未解放）'
};

function applyUiSettingLabels(){
  var U = window.UI_SETTINGS || {};
  function setTxt(id, t){ var e=document.getElementById(id); if(e && t) e.textContent=t; }
  setTxt('kg-label-staff-smith', U.label_staff_smith);
  setTxt('kg-label-staff-pharm', U.label_staff_pharm);
  setTxt('kg-label-market-up', U.label_market_up);
  setTxt('kg-label-stable-up', U.label_stable_up);
  setTxt('kg-eff-staff-smith', U.effect_staff_smith);
  setTxt('kg-eff-staff-pharm', U.effect_staff_pharm);
  setTxt('kg-eff-market-up', U.effect_market_up);
  setTxt('kg-eff-stable-up', U.effect_stable_up);
}

// --- Break ensureMarket <-> refreshFacilityUnlockCaps loop ---
if(typeof ensureMarket === 'function' || typeof window.ensureMarket === 'function'){
  // redefine carefully if market module exists
}
// Patch by wrapping after market loads - replace recursive calls
// We re-define the two functions if MARKET_ECON present
if(window.__marketEcon || window.MARKET_ECON){
  var ME = window.MARKET_ECON || {};
  var KEYS = ['iron','wood','niter','herb','food_mat','med'];

  function clearedMax(route){
    var arr = (gs.cleared && gs.cleared[route]) || [];
    var m = 0;
    arr.forEach(function(n){ if(n>m) m=n; });
    return m;
  }
  function staffUnlockMax(route){
    var cm = clearedMax(route);
    if(cm >= 2) return 2;
    if(cm >= 1) return 1;
    return 0;
  }

  window.refreshFacilityUnlockCaps = function(){
    if(!gs.facility){
      gs.facility = { smithStaff:0, pharmStaff:0, smithStaffMax:0, pharmStaffMax:0, marketLv:0, stableExtra:0 };
    }
    if(!gs.market){
      // minimal market without calling ensureMarket
      gs.market = {
        shop: Object.assign({}, ME.shopStart||{}),
        shopCap: Object.assign({}, ME.shopCapBase||{}),
        priceBuy: Object.assign({}, ME.baseBuy||{}),
        priceSell: Object.assign({}, ME.baseSell||{}),
        prevBuy: Object.assign({}, ME.baseBuy||{})
      };
    }
    gs.facility.smithStaffMax = staffUnlockMax('siege');
    gs.facility.pharmStaffMax = staffUnlockMax('weapon');
    gs.facility.marketLvMax = staffUnlockMax('food');
    gs.facility.stableExtraMax = staffUnlockMax('horse');
    if(gs.facility.smithStaff > gs.facility.smithStaffMax) gs.facility.smithStaff = gs.facility.smithStaffMax;
    if(gs.facility.pharmStaff > gs.facility.pharmStaffMax) gs.facility.pharmStaff = gs.facility.pharmStaffMax;
    if((gs.facility.marketLv||0) > (gs.facility.marketLvMax||0)) gs.facility.marketLv = gs.facility.marketLvMax;
    if((gs.facility.stableExtra||0) > (gs.facility.stableExtraMax||0)) gs.facility.stableExtra = gs.facility.stableExtraMax;
    var baseCap = ME.shopCapBase || {};
    KEYS.forEach(function(k){
      var b = baseCap[k]||10;
      if(!gs.market.shopCap) gs.market.shopCap = {};
      gs.market.shopCap[k] = b + (gs.facility.marketLv||0)*8;
    });
    if(gs.ranch) gs.ranch.maxPairs = 1 + (gs.facility.stableExtra||0);
  };

  window.ensureMarket = function(){
    if(!gs.market){
      gs.market = {
        shop: Object.assign({}, ME.shopStart||{}),
        shopCap: Object.assign({}, ME.shopCapBase||{}),
        priceBuy: Object.assign({}, ME.baseBuy||{}),
        priceSell: Object.assign({}, ME.baseSell||{}),
        prevBuy: Object.assign({}, ME.baseBuy||{}),
        marketLv: 0
      };
    }
    if(!gs.facility){
      gs.facility = { smithStaff:0, pharmStaff:0, smithStaffMax:0, pharmStaffMax:0, marketLv:0, stableExtra:0 };
    }
    // call unlock once — does NOT call ensureMarket again
    window.refreshFacilityUnlockCaps();
  };

  // year restock amount for one resource = sum of seasonal table for that key * 4 seasons approx
  function yearRestockAmount(res){
    var table = ME.seasonRestock || {};
    var total = 0;
    Object.keys(table).forEach(function(s){
      if(table[s][res]) total += table[s][res];
    });
    // also ambient +1 * 4
    if(res !== 'med') total += 4;
    // if resource not in seasonal table (iron, niter), give a base pack
    if(total <= 4){
      if(res==='iron') total = 12;
      else if(res==='niter') total = 8;
      else if(res==='wood') total = 8+4;
      else if(res==='herb') total = 6*2+4;
      else if(res==='food_mat') total = 12+4;
    }
    return total;
  }
  window.yearRestockAmount = yearRestockAmount;

  function applyBoostShop(res){
    window.ensureMarket();
    if(res==='med') return;
    var key = res === 'food' ? 'food_mat' : res;
    var amt = yearRestockAmount(key);
    var cap = (gs.market.shopCap && gs.market.shopCap[key]) || 99;
    gs.market.shop[key] = Math.min(cap, (gs.market.shop[key]||0) + amt);
    if(typeof recomputePrices==='function') recomputePrices(false);
    else if(typeof window.recomputePrices==='function') window.recomputePrices(false);
    showToast((LABELS_MAT[key]||key)+'の店在庫 +'+amt+'（約1年分）');
  }
  var LABELS_MAT = {iron:'鉄',wood:'木材',niter:'硝石',herb:'薬草',food_mat:'兵糧'};

  // Override applyPendingAdvice to include boost + commend
  window.applyPendingAdvice = function(){
    window.ensureMarket();
    var v = gs.kengen && gs.kengen.shingen;
    if(!v) return;
    window.refreshFacilityUnlockCaps();
    if(v==='iron'||v==='wood'||v==='niter'||v==='herb'||v==='food_mat'){
      applyBoostShop(v);
    }
    if(v==='staff_smith' && (gs.facility.smithStaff||0) < (gs.facility.smithStaffMax||0)){
      gs.facility.smithStaff = (gs.facility.smithStaff||0)+1;
      showToast('工房増員（枠'+(3+gs.facility.smithStaff*3)+'）');
    }
    if(v==='staff_pharm' && (gs.facility.pharmStaff||0) < (gs.facility.pharmStaffMax||0)){
      gs.facility.pharmStaff = (gs.facility.pharmStaff||0)+1;
      showToast('薬房増員（枠'+(3+gs.facility.pharmStaff*3)+'）');
    }
    if(v==='market_up' && (gs.facility.marketLv||0) < (gs.facility.marketLvMax||0)){
      gs.facility.marketLv = (gs.facility.marketLv||0)+1;
      window.refreshFacilityUnlockCaps();
      showToast('市場を強化しました');
    }
    if(v==='stable_up' && (gs.facility.stableExtra||0) < (gs.facility.stableExtraMax||0)){
      gs.facility.stableExtra = (gs.facility.stableExtra||0)+1;
      if(gs.ranch) gs.ranch.maxPairs = 1 + gs.facility.stableExtra;
      showToast('厩舎拡張（つがい枠'+(1+gs.facility.stableExtra)+'）');
    }
    if(v==='commend'){
      var sel = document.getElementById('kg-commend-sel');
      var pk = (gs.kengen && gs.kengen.commendTarget) || (sel && sel.value) || 'food';
      if(gs.trust && pk in gs.trust){
        gs.trust[pk] = Math.min(100, (gs.trust[pk]||0)+10);
        showToast((typeof PNAMES!=='undefined'&&PNAMES[pk]?PNAMES[pk]:pk)+'の信頼度 +10');
      }
    }
    if(v==='horse_find' && typeof grantHorseFind==='function'){
      // still granted in other hooks; skip double if already
    }
  };

  // refreshAdviceButtons with locked class + effect text
  window.refreshAdviceButtons = function(){
    window.ensureMarket();
    window.refreshFacilityUnlockCaps();
    applyUiSettingLabels();
    function setLock(id, unlocked, lockedReason){
      var b=document.getElementById(id);
      if(!b) return;
      b.disabled = !unlocked;
      b.classList.toggle('locked-opt', !unlocked);
      b.style.opacity = unlocked ? '1' : '0.45';
      var eff = b.querySelector('.kg-effect');
      if(eff && !unlocked && lockedReason){
        // keep base effect, ensure condition visible
        if(eff.textContent.indexOf('条件：')<0){
          eff.textContent += '　'+lockedReason;
        }
      }
    }
    setLock('kg-staff-smith', (gs.facility.smithStaffMax||0)>(gs.facility.smithStaff||0),
      '条件：攻三城が戦線を突破時に解放');
    setLock('kg-staff-pharm', (gs.facility.pharmStaffMax||0)>(gs.facility.pharmStaff||0),
      '条件：武刃四が戦線を突破時に解放');
    setLock('kg-market-up', (gs.facility.marketLvMax||0)>(gs.facility.marketLv||0),
      '条件：兵糧太が戦線を突破時に解放');
    setLock('kg-stable-up', (gs.facility.stableExtraMax||0)>(gs.facility.stableExtra||0),
      '条件：騎馬次が戦線を突破時に解放');
  };
}

// kgPick: store commend target, no recursion
window.kgPick = function(type, val, btn){
  try{
    if(type==='kenjou'){ showToast('献上は廃止されました'); return; }
    if(typeof window.ensureMarket==='function') window.ensureMarket();
    if(typeof window.refreshFacilityUnlockCaps==='function') window.refreshFacilityUnlockCaps();

    if(val==='staff_smith' && gs.facility && (gs.facility.smithStaff||0) >= (gs.facility.smithStaffMax||0)){
      showToast('工房増員は未解放か上限です（攻三城の戦線突破が必要）'); return;
    }
    if(val==='staff_pharm' && gs.facility && (gs.facility.pharmStaff||0) >= (gs.facility.pharmStaffMax||0)){
      showToast('薬房増員は未解放か上限です（武刃四の戦線突破が必要）'); return;
    }
    if(val==='market_up' && gs.facility && (gs.facility.marketLv||0) >= (gs.facility.marketLvMax||0)){
      showToast('市場強化は未解放か上限です（兵糧太の戦線突破が必要）'); return;
    }
    if(val==='stable_up' && gs.facility && (gs.facility.stableExtra||0) >= (gs.facility.stableExtraMax||0)){
      showToast('厩舎拡張は未解放か上限です（騎馬次の戦線突破が必要）'); return;
    }

    gs.kengen = gs.kengen || {shingen:null, kenjou:null};
    gs.kengen[type] = val;
    if(val==='commend'){
      var sel=document.getElementById('kg-commend-sel');
      gs.kengen.commendTarget = sel ? sel.value : 'food';
    }

    document.querySelectorAll('#kg-shingen .kg-opt').forEach(function(b){
      b.classList.remove('chosen');
      var sub=b.querySelector('.kg-sub');
      if(sub) sub.classList.remove('show');
    });
    if(btn){
      btn.classList.add('chosen');
      var sub2=btn.querySelector('.kg-sub');
      if(sub2) sub2.classList.add('show');
    }
    // show commend select when chosen
    var csel=document.getElementById('kg-commend-sel');
    if(csel){
      if(val==='commend') csel.classList.add('show');
      else csel.classList.remove('show');
    }

    var labels = {
      iron:'鉄増産', wood:'木材増産', food_mat:'兵糧増産', herb:'薬草増産', horse_find:'名馬探索',
      staff_smith:(window.UI_SETTINGS&&window.UI_SETTINGS.label_staff_smith)||'工房増員',
      staff_pharm:(window.UI_SETTINGS&&window.UI_SETTINGS.label_staff_pharm)||'薬房増員',
      market_up:(window.UI_SETTINGS&&window.UI_SETTINGS.label_market_up)||'市場強化',
      stable_up:(window.UI_SETTINGS&&window.UI_SETTINGS.label_stable_up)||'厩舎拡張',
      commend:'皇子を褒める'
    };
    var kr=document.getElementById('kg-result');
    if(kr){
      var extra = '';
      if(val==='commend' && gs.kengen.commendTarget && typeof PNAMES!=='undefined'){
        extra = '（'+ (PNAMES[gs.kengen.commendTarget]||gs.kengen.commendTarget) +'）';
      }
      kr.textContent = '進言：'+(labels[val]||val)+extra+'　→ 次ターンより有効';
    }
  }catch(e){
    console.error('kgPick', e);
    showToast('進言の選択でエラー');
  }
};

// Hard goToMgmt / tryGoToMgmt (no stack)
window.goToMgmt = function(){
  try{
    if(typeof closeOverlay==='function') closeOverlay();
    var ov=document.getElementById('overlay');
    if(ov){ ov.classList.remove('on'); ov.style.display='none'; ov.style.visibility='hidden'; }
    gs.phase = 'management';
    if(typeof setPhase==='function') setPhase('management');
    else if(typeof window.setPhase==='function') window.setPhase('management');
  }catch(e){
    console.error('goToMgmt', e);
    gs.phase='management';
    try{ setPhase('management'); }catch(e2){}
  }
};
window.tryGoToMgmt = function(){
  try{
    var all = true;
    if(typeof PKEYS!=='undefined'){
      all = PKEYS.every(function(k){ return gs.choices && gs.choices[k]!==undefined; });
    }
    if(!all){
      if(!confirm('すべての返信が終わっていませんが大丈夫ですか？')) return;
    }
    if(typeof markLettersConsumedForTurn==='function') markLettersConsumedForTurn();
    window.goToMgmt();
  }catch(e){
    console.error('tryGoToMgmt', e);
    window.goToMgmt();
  }
};
// wire button
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    applyUiSettingLabels();
    if(typeof window.refreshAdviceButtons==='function') window.refreshAdviceButtons();
    var btn=document.getElementById('ph-letter-complete');
    if(btn){
      btn.disabled=false;
      btn.onclick = function(ev){ if(ev) ev.preventDefault(); window.tryGoToMgmt(); };
      btn.setAttribute('onclick','tryGoToMgmt()');
    }
  }, 50);
  setTimeout(function(){
    if(typeof window.refreshAdviceButtons==='function') window.refreshAdviceButtons();
  }, 200);
});

// commend select change updates target
document.addEventListener('change', function(ev){
  if(ev.target && ev.target.id==='kg-commend-sel'){
    if(gs.kengen) gs.kengen.commendTarget = ev.target.value;
  }
});

console.log('[kengen UI fix] ready');
})();
`;

// Insert fix at end before </script>
if (!h.includes('[kengen UI fix]')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + FIX + '\n' + h.slice(last);
  console.log('kengen fix inserted');
} else {
  const a = h.indexOf('// ═══ kengen UI + market stack fix');
  if (a >= 0) {
    const b = h.indexOf('[kengen UI fix] ready', a);
    const c = h.indexOf('})();', b);
    h = h.slice(0, a) + FIX + h.slice(c + 5);
    console.log('kengen fix replaced');
  }
}

// Also neutralize the recursive ensureMarket in market block (source)
h = h.replace(
  `function ensureMarket(){
  if(!gs.market){
    gs.market = {
      shop: Object.assign({}, ME.shopStart||{}),
      shopCap: Object.assign({}, ME.shopCapBase||{}),
      priceBuy: Object.assign({}, ME.baseBuy||{}),
      priceSell: Object.assign({}, ME.baseSell||{}),
      prevBuy: Object.assign({}, ME.baseBuy||{}),
      marketLv: 0
    };
  }
  if(!gs.facility){
    gs.facility = { smithStaff:0, pharmStaff:0, smithStaffMax:0, pharmStaffMax:0, marketLv:0, stableExtra:0 };
  }
  // caps from breakthroughs (N1+)
  refreshFacilityUnlockCaps();
}`,
  `function ensureMarket(){
  if(!gs.market){
    gs.market = {
      shop: Object.assign({}, ME.shopStart||{}),
      shopCap: Object.assign({}, ME.shopCapBase||{}),
      priceBuy: Object.assign({}, ME.baseBuy||{}),
      priceSell: Object.assign({}, ME.baseSell||{}),
      prevBuy: Object.assign({}, ME.baseBuy||{}),
      marketLv: 0
    };
  }
  if(!gs.facility){
    gs.facility = { smithStaff:0, pharmStaff:0, smithStaffMax:0, pharmStaffMax:0, marketLv:0, stableExtra:0 };
  }
  // IMPORTANT: do not call refreshFacilityUnlockCaps here if it calls ensureMarket (stack overflow)
  if(!ensureMarket._locking){
    ensureMarket._locking = true;
    try{ refreshFacilityUnlockCaps(); }finally{ ensureMarket._locking = false; }
  }
}`
);

// refreshFacilityUnlockCaps should not call ensureMarket - check
h = h.replace(
  /function refreshFacilityUnlockCaps\(\)\{[\s\S]*?ensureMarket\(\);[\s\S]*?gs\.facility\.smithStaffMax/,
  `function refreshFacilityUnlockCaps(){
  if(!gs.facility){
    gs.facility = { smithStaff:0, pharmStaff:0, smithStaffMax:0, pharmStaffMax:0, marketLv:0, stableExtra:0 };
  }
  if(!gs.market){
    gs.market = {
      shop: Object.assign({}, ME.shopStart||{}),
      shopCap: Object.assign({}, ME.shopCapBase||{}),
      priceBuy: Object.assign({}, ME.baseBuy||{}),
      priceSell: Object.assign({}, ME.baseSell||{}),
      prevBuy: Object.assign({}, ME.baseBuy||{})
    };
  }
  gs.facility.smithStaffMax`
);

fs.writeFileSync(HTML, h, 'utf8');

// syntax
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m,
  n = 0,
  fail = false;
while ((m = re.exec(h))) {
  if (!m[1] || m[1].length < 3000) continue;
  try {
    new Function(m[1]);
    console.log('OK', n);
  } catch (e) {
    console.error('FAIL', n, e.message);
    fail = true;
  }
  n++;
}

console.log('DONE', {
  stacked: h.includes('#kg-shingen.kg-opts'),
  増員: h.includes('工房増員'),
  herb: h.includes("data-val=\"herb\""),
  goFix: h.includes('[kengen UI fix]'),
  fail,
});
if (fail) process.exit(1);
