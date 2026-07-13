/**
 * Swap food prep icon (stone → potion ★5) and transport cmd (🚚 → cart).
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/kzawa/Downloads/Grok';
const HTML = path.join(ROOT, 'mou_isso_v0_6.html');
const ASSETS = 'C:/Users/kzawa/Downloads/assets';
const ICONS = path.join(ROOT, 'data', '_icons');

function findPotion5() {
  const candidates = [
    path.join(ASSETS, 'potion_★5.png'),
    path.join(ASSETS, 'potion_★5.png'),
    path.join('C:/Users/kzawa/Downloads/mou_isso_handoff/handoff/assets', 'potion_★5.png'),
  ];
  // also scan assets dir for potion *5*
  if (fs.existsSync(ASSETS)) {
    for (const f of fs.readdirSync(ASSETS)) {
      if (/potion/i.test(f) && /5/.test(f) && /\.png$/i.test(f)) {
        candidates.unshift(path.join(ASSETS, f));
      }
    }
  }
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function findCart() {
  const p1 = path.join(ICONS, 'icon_cart.png');
  if (fs.existsSync(p1)) return p1;
  return null;
}

function toDataUri(filePath) {
  const buf = fs.readFileSync(filePath);
  return 'data:image/png;base64,' + buf.toString('base64');
}

let h = fs.readFileSync(HTML, 'utf8');
fs.writeFileSync(HTML + '.bak_before_icons', h, 'utf8');

const potionPath = findPotion5();
const cartPath = findCart();
console.log('potion5', potionPath);
console.log('cart', cartPath);
if (!potionPath) {
  console.error('potion ★5 not found');
  process.exit(1);
}
if (!cartPath) {
  console.error('icon_cart not found');
  process.exit(1);
}

const potionUri = toDataUri(potionPath);
const cartUri = toDataUri(cartPath);

// Copy potion into _icons for future edits
try {
  fs.copyFileSync(potionPath, path.join(ICONS, 'icon_food_potion5.png'));
  console.log('copied potion to data/_icons/icon_food_potion5.png');
} catch (e) {
  console.warn('copy potion skipped', e.message);
}

// ── 1) Replace food prep item-row img inside prep-panel-food ──
const prepStart = h.indexOf('id="prep-panel-food"');
if (prepStart < 0) {
  console.error('prep-panel-food not found');
  process.exit(1);
}
const prepEnd = h.indexOf('id="prep-panel-horse"', prepStart);
const prepChunk = h.slice(prepStart, prepEnd > 0 ? prepEnd : prepStart + 3000);
const imgRe = /<img src="data:image\/png;base64,[A-Za-z0-9+/=]+" alt="">/;
if (!imgRe.test(prepChunk)) {
  // try any img
  const imgRe2 = /<img src="[^"]+" alt="">/;
  if (!imgRe2.test(prepChunk)) {
    console.error('food prep img not found in panel');
    process.exit(1);
  }
  const newPrep = prepChunk.replace(imgRe2, '<img src="' + potionUri + '" alt="兵糧">');
  h = h.slice(0, prepStart) + newPrep + h.slice(prepStart + prepChunk.length);
  console.log('replaced food prep img (generic src)');
} else {
  const newPrep = prepChunk.replace(imgRe, '<img src="' + potionUri + '" alt="兵糧">');
  h = h.slice(0, prepStart) + newPrep + h.slice(prepStart + prepChunk.length);
  console.log('replaced food prep img (base64)');
}

// ── 2) cmd-transport: 🚚 → cart img ──
const truckRe =
  /<button class="cmd-btn disabled" id="cmd-transport" onclick="setPhase\('transport'\)">\s*<div class="cmd-ph">🚚<\/div><span>輸送<\/span><\/button>/;
const truckRe2 =
  /id="cmd-transport" onclick="setPhase\('transport'\)">\s*<div class="cmd-ph">🚚<\/div><span>輸送<\/span>/;

if (truckRe.test(h)) {
  h = h.replace(
    truckRe,
    '<button class="cmd-btn disabled" id="cmd-transport" onclick="setPhase(\'transport\')">\n    <img src="' +
      cartUri +
      '" alt="輸送"><span>輸送</span></button>'
  );
  console.log('replaced cmd-transport (full)');
} else if (truckRe2.test(h)) {
  h = h.replace(
    truckRe2,
    'id="cmd-transport" onclick="setPhase(\'transport\')">\n    <img src="' +
      cartUri +
      '" alt="輸送"><span>輸送</span>'
  );
  console.log('replaced cmd-transport (partial)');
} else if (h.includes('cmd-transport') && h.includes('🚚')) {
  // replace first 🚚 near transport
  const i = h.indexOf('id="cmd-transport"');
  const slice = h.slice(i, i + 250);
  if (slice.includes('🚚')) {
    h =
      h.slice(0, i) +
      slice.replace(
        /<div class="cmd-ph">🚚<\/div>/,
        '<img src="' + cartUri + '" alt="輸送">'
      ) +
      h.slice(i + slice.length);
    console.log('replaced 🚚 near cmd-transport');
  } else {
    console.warn('could not locate truck emoji pattern');
  }
} else {
  console.warn('cmd-transport pattern not matched');
}

// ── 3) ensureOrderUI: add food icon when building order item rows ──
const oldRow =
  "html+='<div class=\"item-row\"><div class=\"item-info\"><div class=\"item-name\">'+it.label+";
const newRow =
  "html+='<div class=\"item-row\">'+(it.id==='food'?'<img src=\"" +
  potionUri.replace(/'/g, "\\'") +
  "\" alt=\"兵糧\">':'')+'<div class=\"item-info\"><div class=\"item-name\">'+it.label+";

// potionUri is huge — better use a window constant
const ICON_BOOT = `
// ═══ item / cmd icon helpers ═══
window.ITEM_ICON_FOOD = ${JSON.stringify(potionUri)};
window.CMD_ICON_TRANSPORT = ${JSON.stringify(cartUri)};
(function(){
'use strict';
if(window.__iconSwapDone) return;
window.__iconSwapDone = true;
// ensureOrderUI rows for food get icon
if(typeof ensureOrderUI==='function'){
  var __eou = ensureOrderUI;
  ensureOrderUI = function(key){
    __eou(key);
    var box=document.getElementById('titems-'+key);
    if(!box) return;
    box.querySelectorAll('.item-row').forEach(function(row){
      if(row.querySelector('img')) return;
      var name=(row.querySelector('.item-name')||{}).textContent||'';
      if(name.indexOf('兵糧')>=0 && window.ITEM_ICON_FOOD){
        var img=document.createElement('img');
        img.src=window.ITEM_ICON_FOOD;
        img.alt='兵糧';
        row.insertBefore(img, row.firstChild);
      }
    });
  };
}
// if transport cmd still emoji (hot reload edge), fix
document.addEventListener('DOMContentLoaded', function(){
  var btn=document.getElementById('cmd-transport');
  if(btn && window.CMD_ICON_TRANSPORT && !btn.querySelector('img')){
    var ph=btn.querySelector('.cmd-ph');
    if(ph){
      var img=document.createElement('img');
      img.src=window.CMD_ICON_TRANSPORT;
      img.alt='輸送';
      ph.replaceWith(img);
    }
  }
});
console.log('[icon swap] food=potion★5, transport=cart');
})();
`;

// Don't embed full base64 twice in ensureOrderUI string — use ICON_BOOT only
const MARKER = '// ═══ map under panels + yellow corner hints ═══';
if (h.includes('// ═══ item / cmd icon helpers ═══')) {
  const a = h.indexOf('// ═══ item / cmd icon helpers ═══');
  const b = h.indexOf(MARKER, a);
  if (b > a) {
    h = h.slice(0, a) + ICON_BOOT + '\n' + h.slice(b);
    console.log('replaced icon helper block');
  } else {
    h = h.slice(0, a) + ICON_BOOT + h.slice(a + 50);
    console.log('replaced icon helper (loose)');
  }
} else if (h.includes(MARKER)) {
  h = h.replace(MARKER, ICON_BOOT + '\n' + MARKER);
  console.log('inserted icon helpers before map+yellow');
} else {
  const last = h.lastIndexOf('</script>');
  h = h.slice(0, last) + ICON_BOOT + '\n' + h.slice(last);
  console.log('appended icon helpers');
}

fs.writeFileSync(HTML, h, 'utf8');

// verify
const okFood = h.includes('alt="兵糧"') && h.includes(potionUri.slice(0, 40));
const okCart = h.includes('id="cmd-transport"') && h.includes(cartUri.slice(0, 40));
const stillTruck =
  h.includes('cmd-transport') &&
  /cmd-transport[\s\S]{0,200}🚚/.test(h);

console.log('DONE', {
  okFoodPanel: h.indexOf('prep-panel-food') >= 0,
  hasPotionInHtml: h.includes(potionUri.slice(20, 60)),
  hasCartInHtml: h.includes(cartUri.slice(20, 60)),
  stillTruckNearCmd: stillTruck,
  iconBoot: h.includes('[icon swap]'),
  size: h.length,
});
