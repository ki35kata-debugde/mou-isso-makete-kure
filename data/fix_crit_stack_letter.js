const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');

// Ensure sanitizeInv does not call updateHeaderDisplay
h = h.replace(
  /function sanitizeInv\(\)\{[\s\S]*?\n\}\nsanitizeInv\(\);/,
  `function sanitizeInv(){
  if(!gs.inv) gs.inv={iron:5,wood:5,niter:0,herb:4,food:8};
  ['iron','wood','niter','herb','food'].forEach(function(k){
    var v=Number(gs.inv[k]);
    if(!isFinite(v)) gs.inv[k]=(k==='iron'||k==='wood')?5:(k==='food'?8:(k==='herb'?4:0));
    else gs.inv[k]=v;
  });
  // DO NOT call updateHeaderDisplay here (was infinite recursion)
}
sanitizeInv();`
);
console.log('sanitizeInv ok');

// Ensure inv display uses iron key (base function)
if (h.includes("set('inv-iron',gs.inv.鉄)")) {
  h = h.replace("set('inv-iron',gs.inv.鉄)", "set('inv-iron',gs.inv.iron)");
  console.log('fixed inv.鉄');
}

const FIX = `
// ═══ critical fix stack+letter ═══
(function(){
'use strict';
if(window.__critFix) return;
window.__critFix = true;

// Horse prep letter always shows food+med text until sortied
var horsePrepBody = '出立の前に、兵糧と薬を少し分けてくれ。\\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可';
var __rl = window.renderLetter || (typeof renderLetter==='function' ? renderLetter : null);
if(__rl){
  window.renderLetter = function(key){
    __rl(key);
    try{
      if(key==='horse' && !(gs.sortied && gs.sortied.horse) && !((gs.node&&gs.node.horse)>0)){
        var dem=document.getElementById('lt-horse-demand');
        if(dem){
          dem.innerHTML='<div class="letter-block"><div class="letter-from">騎馬次（出立前・準備依頼）</div><div class="letter-text">'+horsePrepBody.replace(/\\\\n/g,'\\n')+'</div></div>';
        }
      }
    }catch(e){}
  };
  if(typeof renderLetter==='function') renderLetter = window.renderLetter;
}

// Also patch getLetterBundle / pickLetterEntry data if present
if(typeof CFG!=='undefined'){
  if(CFG.letters && CFG.letters.horse && CFG.letters.horse.prep){
    CFG.letters.horse.prep.demand_body = horsePrepBody.replace(/\\\\n/g,'\\n');
  }
  if(CFG.letterPool && CFG.letterPool.horse && CFG.letterPool.horse.demand){
    CFG.letterPool.horse.demand.forEach(function(e){
      if(e.id==='horse_prep' || (e.when && e.when.node===0)){
        e.body = horsePrepBody.replace(/\\\\n/g,'\\n');
      }
    });
  }
}

// goToTransport: never throw on NaN
var __gt = window.goToTransport || (typeof goToTransport==='function' ? goToTransport : null);
if(__gt){
  window.goToTransport = function(){
    try{
      if(gs.inv){
        ['iron','wood','niter','herb','food'].forEach(function(k){
          var v=Number(gs.inv[k]);
          if(!isFinite(v)) gs.inv[k]=0;
        });
      }
      if(gs.prod){
        ['sword','siege_w','med'].forEach(function(k){
          var v=Number(gs.prod[k]);
          if(!isFinite(v)) gs.prod[k]=0;
        });
      }
    }catch(e){}
    return __gt.apply(this, arguments);
  };
  if(typeof goToTransport==='function') goToTransport = window.goToTransport;
}

// refresh inv display after load
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    try{
      if(typeof sanitizeInv==='function') sanitizeInv();
      if(typeof updateInvDisplay==='function') updateInvDisplay();
      if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
      if(typeof renderAllLetters==='function') renderAllLetters();
    }catch(e){ console.warn('crit boot', e); }
  }, 100);
});

console.log('[crit fix] stack/letter/transport/inv-iron');
})();
`;

if (!h.includes('[crit fix]')) {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + FIX + '\n' + h.slice(last);
  console.log('crit fix inserted');
} else {
  // replace existing
  const a = h.indexOf('// ═══ critical fix stack+letter');
  if (a >= 0) {
    const b = h.indexOf('})();\n', a);
    if (b > a) {
      h = h.slice(0, a) + FIX + h.slice(b + 5);
      console.log('crit fix replaced');
    }
  }
}

fs.writeFileSync(HTML, h, 'utf8');

try {
  const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
  let m,
    n = 0;
  while ((m = re.exec(h))) {
    if (!m[1] || m[1].length < 3000) continue;
    new Function(m[1]);
    console.log('OK', n++);
  }
} catch (e) {
  console.error('FAIL', e.message);
  process.exit(1);
}

console.log('DONE', {
  invIron: h.includes("set('inv-iron',gs.inv.iron)"),
  noRecurse: !/sanitizeInv[\s\S]{0,200}updateHeaderDisplay/.test(
    h.slice(h.indexOf('function sanitizeInv'))
  ),
  crit: h.includes('[crit fix]'),
});
