const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');
if (h.includes('[letter confirm proceed] ready')) {
  console.log('already present');
  process.exit(0);
}
const FIX = `
// ═══ letter confirm proceed ═══
(function(){
'use strict';
if(window.__letterConfirmProceed) return;
window.__letterConfirmProceed = true;
window.tryGoToMgmt = function(){
  try{
    var PK = window.PKEYS || ['food','horse','siege','weapon'];
    if(typeof window.recomputeMailFlags==='function') window.recomputeMailFlags();
    var pending = PK.filter(function(k){
      var hasNew = gs.mail && gs.mail[k] && gs.mail[k].hasNew;
      var unreplied = !gs.choices || gs.choices[k]===undefined;
      return hasNew && unreplied;
    });
    if(!pending.length){
      // 新着フラグが無くても choices 未完了なら確認
      var incomplete = PK.some(function(k){ return !gs.choices || gs.choices[k]===undefined; });
      // ただし新着がない皇子は返信不要なので、新着があるのに未返信だけを pending にしている
      // 旧ロジック互換: 全員 choices 未設定のときも確認しない（新着なし）
    }
    if(pending.length){
      if(!confirm('返信していない手紙があります。このまま経営フェーズへ進みますか？')) return;
    }
    if(typeof markLettersConsumedForTurn==='function'){
      try{ markLettersConsumedForTurn(); }catch(e){}
    }
    PK.forEach(function(k){
      if(gs.letterFlags) gs.letterFlags.justEntered[k]=false;
    });
    if(typeof window.goToMgmt==='function') window.goToMgmt();
    else if(typeof goToMgmt==='function') goToMgmt();
  }catch(e){
    console.error('tryGoToMgmt', e);
    if(typeof window.goToMgmt==='function') window.goToMgmt();
    else if(typeof goToMgmt==='function') goToMgmt();
  }
};
try{ tryGoToMgmt = window.tryGoToMgmt; }catch(e){}
function wireBtn(){
  var b=document.getElementById('ph-letter-complete');
  if(!b) return;
  b.disabled=false;
  b.onclick=function(ev){ if(ev) ev.preventDefault(); window.tryGoToMgmt(); };
  b.setAttribute('onclick','tryGoToMgmt()');
}
wireBtn();
document.addEventListener('DOMContentLoaded', function(){ setTimeout(wireBtn, 80); });
console.log('[letter confirm proceed] ready');
})();
`;
const last = h.lastIndexOf('</script>');
h = h.slice(0, last) + FIX + '\n' + h.slice(last);
fs.writeFileSync(HTML, h, 'utf8');
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m, n = 0, fail = false;
while ((m = re.exec(h))) {
  const body = m[1];
  if (!body || body.length < 40) continue;
  try {
    new Function(body);
  } catch (e) {
    fail = true;
    console.error('FAIL', n, e.message);
  }
  n++;
}
console.log('DONE', { fail, ready: h.includes('[letter confirm proceed] ready') });
