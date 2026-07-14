/**
 * 経営フェーズ入場時のOKポップアップ
 * - 進言の効果（人員増・増産・市場強化・厩舎・名馬・褒める）適用時にメッセージをキュー
 * - キュー済みの解禁/通知ポップアップを経営フェーズ入場時にも表示（従来は結果フェーズのみ）
 * マーカー: [mgmt phase popups] ready
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = path.join(ROOT, 'mou_isso_v0_6_1.html');

let h = fs.readFileSync(HTML, 'utf8');
if (h.includes('[mgmt phase popups] ready')) {
  console.log('already applied, skip');
  process.exit(0);
}
fs.writeFileSync(HTML + '.bak_mgmtpop_' + Date.now(), h, 'utf8');

const patch = `
<script>
// ═══ mgmt phase popups ═══
(function(){
'use strict';
if(window.__mgmtPopups) return;
window.__mgmtPopups = true;

// 1) 進言の効果が適用されたらポップアップをキュー
var _apa = window.applyPendingAdvice;
if(typeof _apa==='function'){
  window.applyPendingAdvice = function(){
    var f = (gs&&gs.facility)||{};
    var before = { smith:f.smithStaff||0, pharm:f.pharmStaff||0, market:f.marketLv||0, stable:f.stableExtra||0 };
    var sh = gs && gs.kengen && gs.kengen.shingen;
    var wasApplied = gs && gs.kengen && gs.kengen.appliedThisTurn && gs.kengen._appliedValues===sh;
    var r = _apa.apply(this, arguments);
    try{
      if(sh && !wasApplied){
        var f2 = (gs&&gs.facility)||{};
        var msg = null;
        if((f2.smithStaff||0) > before.smith){
          msg = '進言により工房に職人が加わった！生産枠が+3されました（人員 '+f2.smithStaff+'人・枠 '+(3+(f2.smithStaff||0)*3)+'）。';
        } else if((f2.pharmStaff||0) > before.pharm){
          msg = '進言により薬房に職人が加わった！生産枠が+3されました（人員 '+f2.pharmStaff+'人・枠 '+(3+(f2.pharmStaff||0)*3)+'）。';
        } else if((f2.marketLv||0) > before.market){
          msg = '進言により市場が強化された！店在庫の上限が上がりました。';
        } else if((f2.stableExtra||0) > before.stable){
          msg = '進言により厩舎が拡張された！ペア枠が増えました（'+(1+(f2.stableExtra||0))+'）。';
        } else if(sh==='horse_find'){
          msg = '進言により名馬探索を開始！次ターン開始時に馬が牧場へ加わります。';
        } else if(sh==='commend'){
          msg = '進言により王が皇子を褒めた！信頼が上がりました（+10）。';
        } else if(sh==='iron'||sh==='wood'||sh==='food_mat'||sh==='herb'){
          var L = { iron:'鉄', wood:'木材', food_mat:'兵糧', herb:'薬草' };
          msg = '進言により'+L[sh]+'の増産が始まった！店の在庫が約1年分増えました。';
        }
        if(msg){
          // queueUnlock は他IIFE内のローカル関数のため直接push
          gs.pendingUnlocks = gs.pendingUnlocks || [];
          if(gs.pendingUnlocks.indexOf(msg)<0) gs.pendingUnlocks.push(msg);
        }
      }
    }catch(e){ console.warn('mgmt popup queue', e); }
    return r;
  };
  try{ applyPendingAdvice = window.applyPendingAdvice; }catch(e){}
}

// 2) 経営フェーズ入場時にキュー済みポップアップを表示（従来は結果フェーズのみ）
var _sp = window.setPhase || (typeof setPhase==='function'?setPhase:null);
if(_sp){
  window.setPhase = function(p){
    var r = _sp.apply(this, arguments);
    try{
      if(p==='management'){
        setTimeout(function(){
          if(typeof showPendingUnlockModal==='function') showPendingUnlockModal();
          else if(typeof window.showPendingUnlockModal==='function') window.showPendingUnlockModal();
        }, 60);
      }
    }catch(e){}
    return r;
  };
  try{ setPhase = window.setPhase; }catch(e){}
}

console.log('[mgmt phase popups] ready');
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
console.log('DONE: mgmt phase popups applied');
