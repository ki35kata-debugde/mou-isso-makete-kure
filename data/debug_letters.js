const fs = require('fs');
const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6.html', 'utf8');

console.log('demand_body count', (h.match(/demand_body/g) || []).length);
console.log('food_prep', h.includes('food_prep'));
console.log('兵糧三千', h.includes('兵糧三千'));

// Check openLetterOverlay and if render is swallowed
const i = h.indexOf('function openLetterOverlay');
console.log(h.slice(i, i + 450));

// Check if lc-food has active
console.log('lc-food class', (h.match(/id="lc-food"[^>]*>/) || [])[0]);
console.log('overlay open', (h.match(/id="overlay"[^>]*>/) || [])[0]);

// Check script src paths
console.log(
  'scripts',
  h.match(/<script[^>]+>/g).slice(0, 8)
);

// Extract and test pickLetterEntry logic with game-data
const window = {};
eval(fs.readFileSync('C:/Users/kzawa/Downloads/Grok/data/game-data.js', 'utf8'));
const letters = window.GAME_DATA.letters;

// Minimal mock
const gs = {
  node: { food: 0, horse: 0, siege: 0, weapon: 0 },
  sortied: { food: false, horse: false, siege: false, weapon: false },
  trust: { food: 0, horse: 0, siege: 0, weapon: 0 },
  orderMissTurns: { food: 0, horse: 0, siege: 0, weapon: 0 },
  letterFlags: { used: {}, serial: {}, justEntered: { food: false, horse: false, siege: false, weapon: false } },
  order: {},
};
const CFG = { letterPool: letters, letters: null };

function matchWhen(when, key) {
  if (!when) return true;
  const node = gs.node[key] || 0;
  const trust = gs.trust[key] || 0;
  const miss = gs.orderMissTurns[key] || 0;
  if (when.node != null && node !== when.node) return false;
  if (when.node_gte != null && node < when.node_gte) return false;
  if (when.node_lte != null && node > when.node_lte) return false;
  if (when.trust_gte != null && trust < when.trust_gte) return false;
  if (when.trust_lt != null && trust >= when.trust_lt) return false;
  if (when.miss_turns_gte != null && miss < when.miss_turns_gte) return false;
  if (when.on_node_enter && !gs.letterFlags.justEntered[key]) return false;
  if (when.once && gs.letterFlags.used[when._id || '']) return false;
  if (when.serial != null) {
    const step = gs.letterFlags.serial[when.serial] || 0;
    if (step !== (when.step || 0)) return false;
  }
  return true;
}

function pickLetterEntry(key, kind) {
  const pool = (CFG.letterPool[key] && CFG.letterPool[key][kind]) || [];
  const candidates = [];
  for (const raw of pool) {
    const e = { ...raw, when: { ...(raw.when || {}) } };
    e.when._id = e.id;
    if (e.when.once && gs.letterFlags.used[e.id]) continue;
    if (e.when.fallback) continue;
    if (!matchWhen(e.when, key)) continue;
    candidates.push(e);
  }
  candidates.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  if (candidates.length) return candidates[0];
  for (const raw of pool) {
    if (raw.when && raw.when.fallback) return raw;
  }
  return null;
}

['food', 'horse', 'siege', 'weapon'].forEach((key) => {
  const d = pickLetterEntry(key, 'demand');
  const p = pickLetterEntry(key, 'personal');
  console.log(key, {
    demand: d && (d.body || '').slice(0, 40),
    personal: p && (p.intro || '').slice(0, 40),
    choices: p && p.choices && p.choices.length,
  });
});
