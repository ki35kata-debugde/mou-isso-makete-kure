/**
 * 1) ETA: implement masToNode from MAP_CELLS.between; all UI/toast use etaFor
 *    N1 food should be 2T for jinput (between[0]=1... wait food between[1,1,1,2] so N1=1)
 *    User said N1 takes 2T - food between starts with 1. Maybe include start cell?
 *    Use: sum of between[0..node-1], minimum 2 for N1 if between is 1? User: 2T for N1.
 *    food between[0]=1 → if we use max(2, sum) or sum+1...
 *    Looking at cells: 1 step from start to N1 node often. User wants 2T for 人足 speed1.
 *    So mas should be 2 for N1 food. between[0]=1 is too small.
 *    Better: count cells from start to target node (index of target node in cells array).
 *
 * 2) Winter result: remove two feed lines; if paired, show 番になった馬に仔馬がうまれそうだ
 * 3) Transport UI: remove 人足あとXT line; on means select show ノードxまであとxT
 */
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_eta_winter_' + Date.now(), h, 'utf8');

if (h.includes('[eta winter tp ui] ready')) {
  const a = h.indexOf('// ═══ eta winter tp ui');
  if (a >= 0) {
    h = h.slice(0, a) + h.slice(h.indexOf('</script>', a));
    console.log('removed old');
  }
}

const FIX = `
// ═══ eta winter tp ui ═══
(function(){
'use strict';
if(window.__etaWinterTpUi) return;
window.__etaWinterTpUi = true;

// --- Distance to node (マス) ---
// Prefer counting map cells to the target node; fallback to ROUTES.between
window.masToNode = function(route, node1){
  var n = Math.max(1, Number(node1)||1);
  try{
    var cells = (typeof MAP_CELLS!=='undefined' && MAP_CELLS.cells && MAP_CELLS.cells[route]) || [];
    if(cells.length){
      var idx = -1;
      for(var i=0;i<cells.length;i++){
        if(cells[i].node && cells[i].nidx === n-1){ idx = i; break; }
      }
      if(idx >= 0){
        // cells before target + 1 = steps from capital area to node
        // User expects N1 ≒ 2T for speed1 → use idx+1 (0-based index+1)
        return Math.max(1, idx + 1);
      }
    }
    var R = (typeof MAP_CELLS!=='undefined' && MAP_CELLS.ROUTES && MAP_CELLS.ROUTES[route]) || null;
    if(R && R.between && R.between.length){
      var sum = 0;
      for(var j=0; j<n && j<R.between.length; j++) sum += (R.between[j]||1);
      // between alone is often 1 for N1; ensure at least 2 for walk (人足)
      if(sum < 2 && n===1) sum = 2;
      return Math.max(1, sum);
    }
  }catch(e){}
  // default: N1=2, each further node +1
  return Math.max(2, n + 1);
};

window.masToTarget = function(route, node1){
  return window.masToNode(route, node1);
};

// speeds: 人足1 荷車1 船3 馬車2
if(typeof MEANS_SPEED==='undefined'){
  window.MEANS_SPEED = { jinput:1, cart:1, boat:3, horse:2, wagon:2, horse_self:2 };
} else {
  MEANS_SPEED.jinput = 1;
  MEANS_SPEED.cart = 1;
  MEANS_SPEED.boat = 3;
  MEANS_SPEED.wagon = 2;
  MEANS_SPEED.horse = 2;
  MEANS_SPEED.horse_self = 2;
}

window.speedOf = function(means){
  var t = (typeof MEANS_SPEED!=='undefined' ? MEANS_SPEED : window.MEANS_SPEED) || {};
  return t[means] || 1;
};

window.etaFor = function(route, node1, means){
  var mas = window.masToNode(route, node1||1);
  var sp = window.speedOf(means||'jinput');
  if(sp < 1) sp = 1;
  return Math.max(1, Math.ceil(mas / sp));
};
try{
  masToNode = window.masToNode;
  masToTarget = window.masToTarget;
  speedOf = window.speedOf;
  etaFor = window.etaFor;
}catch(e){}

function etaToNodeText(prince, means){
  var node = (gs.node && gs.node[prince]) || 1;
  var eta = window.etaFor(prince, node, means||'jinput');
  return 'ノード'+node+'まであと'+eta+'T';
}

// --- selectMeans: show ノードxまであとxT ---
(function(){
  var prev = window.selectMeans || (typeof selectMeans==='function'?selectMeans:null);
  window.selectMeans = function(prince, means, btn){
    if(typeof prev==='function') prev(prince, means, btn);
    else {
      gs.transport[prince]=gs.transport[prince]||{};
      gs.transport[prince].means=means;
      if(btn){
        document.querySelectorAll('#means-'+prince+' .means-btn').forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
      }
      var go=document.getElementById('go-'+prince); if(go) go.disabled=false;
    }
    var ti = document.getElementById('tinfo-'+prince);
    if(ti && means){
      ti.textContent = etaToNodeText(prince, means);
    }
    // hide redundant fleet-line
    var fl = document.getElementById('fleet-line-'+prince);
    if(fl) fl.style.display = 'none';
  };
  try{ selectMeans = window.selectMeans; }catch(e){}
})();

// --- goTransport: always use etaFor (no default 5) ---
(function(){
  var prev = window.goTransport || (typeof goTransport==='function'?goTransport:null);
  if(typeof prev!=='function') return;
  window.goTransport = function(prince){
    // run previous (handles cargo/fleet) but fix eta after if convoy just pushed
    var beforeLen = (gs.convoys||[]).length;
    var r = prev.apply(this, arguments);
    try{
      var after = gs.convoys||[];
      if(after.length > beforeLen){
        var cv = after[after.length-1];
        if(cv && cv.route===prince){
          var means = cv.means || 'jinput';
          var node = cv.targetNode || gs.node[prince] || 1;
          var eta = window.etaFor(prince, node, means==='horse_self'?'horse':means);
          cv.eta = eta;
          cv.etaMax = eta;
          // refresh toast-ish info
          var ti = document.getElementById('tinfo-'+prince);
          if(ti) ti.textContent = '出発済　'+etaToNodeText(prince, means)+'（進行中）';
          showToast('出発 → ノード'+node+'まであと'+eta+'T');
        }
      }
      // hide fleet line always
      var fl = document.getElementById('fleet-line-'+prince);
      if(fl) fl.style.display = 'none';
    }catch(e){ console.warn('eta fix', e); }
    return r;
  };
  try{ goTransport = window.goTransport; }catch(e){}
})();

// --- buildMeans: remove fleet-line "人足あと"; tinfo default ---
(function(){
  var prev = window.buildMeans || (typeof buildMeans==='function'?buildMeans:null);
  if(typeof prev!=='function') return;
  window.buildMeans = function(key){
    var r = prev.apply(this, arguments);
    // force-hide redundant line
    var fl = document.getElementById('fleet-line-'+key);
    if(fl){
      fl.style.display = 'none';
      fl.textContent = '';
    }
    // if means already selected, show ETA
    var means = gs.transport[key] && gs.transport[key].means;
    var ti = document.getElementById('tinfo-'+key);
    if(ti){
      if(means) ti.textContent = etaToNodeText(key, means);
      else if(key!=='horse') ti.textContent = '輸送手段を選択';
    }
    // fix 人足 button if it still says ?
    var row = document.getElementById('means-'+key);
    if(row && typeof portersFree==='function'){
      var free = portersFree();
      var max = gs.portersMax||4;
      row.querySelectorAll('.means-btn').forEach(function(b){
        var t = b.textContent||'';
        if(t.indexOf('人足')>=0 && t.indexOf('?')>=0){
          b.textContent = '人足（空き'+free+'/'+max+'・各1荷）';
        }
      });
    }
    return r;
  };
  try{ buildMeans = window.buildMeans; }catch(e){}
})();

// --- Winter result text ---
(function(){
  var prev = window.buildResultScreen || (typeof buildResultScreen==='function'?buildResultScreen:null);
  if(typeof prev!=='function') return;
  window.buildResultScreen = function(){
    var r = prev.apply(this, arguments);
    try{
      // rewrite winter horse notes if present
      var log = document.getElementById('result-log') || document.querySelector('.result-log');
      if(!log) return r;
      var season = gs.season; // after turn advance, season is NEW season
      // Result screen often shows the season we just finished.
      // Winter notes are written when s===3 in buildResultScreen using current season.
      // Fix: scan log lines and replace winter feed messages
      var lines = log.querySelectorAll('.log-line');
      var removed = false;
      lines.forEach(function(d){
        var t = d.textContent||'';
        if(t.indexOf('餌として')>=0 || t.indexOf('特別な餌やり')>=0 || t.indexOf('今冬は特別')>=0){
          d.remove();
          removed = true;
        }
      });
      // If winter (either still 3 or just left winter), and pairs exist, add message
      var hasPair = !!(gs.ranch && ((gs.ranch.pairs&&gs.ranch.pairs.length) || gs.ranch.autumnCoupled));
      // also check horse status paired
      if(!hasPair && gs.horses){
        hasPair = gs.horses.some(function(hh){ return hh.status==='paired'; });
      }
      // show on winter result: when season is 3, or when notes were winter
      var isWinterView = (gs.season===3) || removed;
      if(isWinterView && hasPair){
        var exists = false;
        log.querySelectorAll('.log-line').forEach(function(d){
          if((d.textContent||'').indexOf('仔馬がうまれそう')>=0) exists=true;
        });
        if(!exists){
          var d=document.createElement('div');
          d.className='log-line log-info show';
          d.textContent='🐎 番になった馬に仔馬がうまれそうだ';
          log.appendChild(d);
        }
      }
    }catch(e){ console.warn('winter note fix', e); }
    return r;
  };
  try{ buildResultScreen = window.buildResultScreen; }catch(e){}
})();

// Also clean onSeasonChange winter log
(function(){
  var prev = window.onSeasonChange || (typeof onSeasonChange==='function'?onSeasonChange:null);
  if(typeof prev!=='function') return;
  window.onSeasonChange = function(prevSeason, newSeason){
    var r = prev.apply(this, arguments);
    try{
      if(newSeason===3 && gs._ranchSeasonNotes){
        gs._ranchSeasonNotes = (gs._ranchSeasonNotes||[]).filter(function(t){
          return String(t).indexOf('兵糧と回復薬')<0 && String(t).indexOf('薬は仔')<0;
        });
        var hasPair = (gs.ranch&&gs.ranch.pairs&&gs.ranch.pairs.length) || (gs.horses||[]).some(function(hh){return hh.status==='paired';});
        if(hasPair){
          gs._ranchSeasonNotes.push('番になった馬に仔馬がうまれそうだ');
        }
      }
    }catch(e){}
    return r;
  };
  try{ onSeasonChange = window.onSeasonChange; }catch(e){}
})();

// Debug helper
window.debugEta = function(route, node, means){
  var mas = window.masToNode(route, node||1);
  var sp = window.speedOf(means||'jinput');
  var eta = window.etaFor(route, node||1, means||'jinput');
  console.log({route:route, node:node, means:means, mas:mas, speed:sp, eta:eta});
  return eta;
};

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    // hide any existing fleet lines
    document.querySelectorAll('[id^="fleet-line-"]').forEach(function(el){
      el.style.display='none';
      el.textContent='';
    });
  }, 200);
});

console.log('[eta winter tp ui] ready — N1 jinput eta should be ~2');
})();
`;

const last = h.lastIndexOf('</script>');
h = h.slice(0, last) + FIX + '\n' + h.slice(last);
fs.writeFileSync(HTML, h, 'utf8');

// Patch winter notes at source for cleanliness
h = fs.readFileSync(HTML, 'utf8');
h = h.replace(
  /} else if\(s===3\)\{ \/\/ 冬の結果[\s\S]*?else notes\.push\('🐎 今冬は特別な餌やりをしなかった。'\);/,
  `} else if(s===3){ // 冬の結果
        var hasPair = !!(gs.ranch && ((gs.ranch.pairs&&gs.ranch.pairs.length)||gs.ranch.autumnCoupled));
        if(!hasPair && gs.horses) hasPair = gs.horses.some(function(hh){return hh.status==='paired';});
        if(hasPair) notes.push('🐎 番になった馬に仔馬がうまれそうだ');`
);
// winter onSeasonChange log
h = h.replace(
  /logs\.push\('冬：兵糧と回復薬を与えられます（薬は仔のランクのみ上昇）。'\);/,
  `// winter feed tip removed from result; pair message handled in buildResultScreen
    var _hp = (gs.ranch&&gs.ranch.pairs&&gs.ranch.pairs.length) || (gs.horses||[]).some(function(hh){return hh.status==='paired';});
    if(_hp) logs.push('番になった馬に仔馬がうまれそうだ');`
);

fs.writeFileSync(HTML, h, 'utf8');

const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m,
  n = 0,
  fail = false;
while ((m = re.exec(h))) {
  const body = m[1];
  if (!body || body.length < 40) continue;
  try {
    new Function(body);
    console.log('OK', n);
  } catch (e) {
    fail = true;
    console.error('FAIL', n, e.message);
  }
  n++;
}
console.log('DONE', { fail, ready: h.includes('[eta winter tp ui] ready') });
