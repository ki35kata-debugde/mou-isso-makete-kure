/**
 * 1) 手紙フェーズを開いたとき、新着がある最初の皇子タブ（食・馬・兵器・武器の順）を自動で開く。
 *    どの皇子にも新着がなければ「王への進言」タブを開く。
 * 2) 進言費用を分離: 王子を「褒める」(commend)は300両、それ以外は150両。
 * マーカー: [letter autotab + advice cost] ready
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'mou_isso_v0_6_1.html');

let h = fs.readFileSync(HTML, 'utf8');
if (h.includes('[letter autotab + advice cost] ready')) {
  console.log('already applied, skip');
  process.exit(0);
}
fs.writeFileSync(HTML + '.bak_autotab_' + Date.now(), h, 'utf8');

const patch = `
<script>
// ═══ letter autotab + advice cost split ═══
(function(){
'use strict';
if(window.__letterAutotabAdviceCost) return;
window.__letterAutotabAdviceCost = true;

var ORDER = ['food','horse','siege','weapon'];

function pickFirstNewTab(){
  try{
    if(typeof recomputeMailFlags==='function') recomputeMailFlags();
    for(var i=0;i<ORDER.length;i++){
      var k = ORDER[i];
      if(gs.mail && gs.mail[k] && gs.mail[k].hasNew) return k;
    }
  }catch(e){}
  return 'kengen';
}

var __olo = window.openLetterOverlay || (typeof openLetterOverlay==='function'?openLetterOverlay:null);
if(__olo){
  window.openLetterOverlay = function(){
    var r = __olo.apply(this, arguments);
    try{
      var target = pickFirstNewTab();
      if(typeof selectTab==='function') selectTab(target);
      else if(typeof window.selectTab==='function') window.selectTab(target);
    }catch(e){ console.warn('letter autotab', e); }
    return r;
  };
  try{ openLetterOverlay = window.openLetterOverlay; }catch(e){}
}

// 進言費用: commend(褒める)=adviceCostGold(300) / それ以外=adviceCostGoldOther(150)
window.adviceCostFor = function(val){
  var M = window.MARKET_ECON || {};
  if(val==='commend'){
    var c1 = M.adviceCostGold; return (c1!=null?c1:300)|0;
  }
  var c2 = M.adviceCostGoldOther; return (c2!=null?c2:150)|0;
};
// adviceCost() は引数なしで呼ばれている箇所が多いため、直前に選ばれている val（gs.kengen.shingen か
// クリック対象）を推定できるよう、グローバル adviceCost 自体を val 対応に置き換える。
// kgPick 内の adviceCost() 呼び出しは "これから選ぼうとしている val" より前に評価されるため、
// window.__adviceCostPendingVal に一時セットしてから adviceCost() を呼ぶよう kgPick もラップする。
window.adviceCost = function(){
  var v = window.__adviceCostPendingVal!=null ? window.__adviceCostPendingVal : (gs.kengen && gs.kengen.shingen);
  return window.adviceCostFor(v);
};
try{ adviceCost = window.adviceCost; }catch(e){}

var __kgp = window.kgPick || (typeof kgPick==='function'?kgPick:null);
if(__kgp){
  window.kgPick = function(type, val, btn){
    window.__adviceCostPendingVal = (type==='shingen') ? val : null;
    var r = __kgp.apply(this, arguments);
    window.__adviceCostPendingVal = null;
    return r;
  };
  try{ kgPick = window.kgPick; }catch(e){}
}

// 進言一覧のコスト表示（各ボタンごとに正しい費用を出す）
var __pkcl = window.paintKengenCostsAndLocks || (typeof paintKengenCostsAndLocks==='function'?paintKengenCostsAndLocks:null);
if(__pkcl){
  window.paintKengenCostsAndLocks = function(){
    var r = __pkcl.apply(this, arguments);
    try{
      var root = document.getElementById('kg-shingen');
      if(root){
        var chosen = gs.kengen && gs.kengen.shingen;
        var paid = gs.kengen && gs.kengen.paidThisTurn;
        root.querySelectorAll('.kg-opt').forEach(function(btn){
          var val = btn.getAttribute('data-val');
          var cost = window.adviceCostFor(val);
          var costEl = btn.querySelector('.kg-cost');
          if(!costEl) return;
          if(paid && chosen){
            if(val===chosen) costEl.textContent = '費用：'+cost+'両（支払い済み）';
            else costEl.textContent = '（他の進言を選択済み）';
          }else{
            costEl.textContent = '費用：金'+cost+'両';
          }
        });
      }
      var note = document.getElementById('kg-cost-note');
      if(note) note.textContent = '費用：褒める300両／その他150両（1ターン1回分。選び直しは追加料金なし／市場・工房・薬房の操作は無料）';
    }catch(e){}
    return r;
  };
  try{ paintKengenCostsAndLocks = window.paintKengenCostsAndLocks; }catch(e){}
}

console.log('[letter autotab + advice cost] ready');
})();
</script>
`;

if (h.includes('</body>')) h = h.replace('</body>', patch + '</body>');
else h += patch;

const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m, fail = false;
while ((m = re.exec(h))) {
  const body = m[1];
  if (!body || body.length < 20) continue;
  if (/^\s*src\s*=/i.test(m[0])) continue;
  try { new Function(body); } catch (e) { fail = true; console.error('script FAIL:', e.message); }
}
if (fail) { console.error('syntax errors, NOT writing'); process.exit(1); }
fs.writeFileSync(HTML, h, 'utf8');
console.log('DONE: letter autotab + advice cost applied');
