const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, '..', 'mou_isso_v0_6_1.html');
let h = fs.readFileSync(HTML, 'utf8');

// CFG prep_quests horse (embedded)
h = h.replace(
  /"horse":\s*\{\s*"item":\s*"horse",\s*"label":\s*"★1馬",\s*"qty":\s*2,\s*"trust_reward":\s*3\s*\}/g,
  '"horse":{"items":[{"item":"food","label":"兵糧","qty":4},{"item":"med","label":"回復薬","qty":1}],"label":"兵糧×4・回復薬×1","trust_reward":3}'
);

// Any remaining old horse prep letter body
const oldBodies = [
  '馬。良いのを。以上。\\n【出立準備依頼】★1馬×2頭　輸送フェーズで手渡し可',
  '馬。良いのを。以上。\n【出立準備依頼】★1馬×2頭　輸送フェーズで手渡し可',
  '馬。良いのを。以上。\\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可',
];
const newBody =
  '出立の前に、兵糧と薬を少し分けてくれ。\\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可';
const newBodyNl =
  '出立の前に、兵糧と薬を少し分けてくれ。\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可';

oldBodies.forEach((o) => {
  if (h.includes(o)) {
    h = h.split(o).join(o.includes('\\n') ? newBody : newBodyNl);
    console.log('replaced body variant');
  }
});

// GAME_DATA letters horse_prep body (embedded long JSON)
h = h.replace(
  /"id":"horse_prep"([^\]]*?"body":")([^"]*)(")/,
  (m, a, body, c) => {
    console.log('horse_prep body was', body.slice(0, 40));
    return (
      '"id":"horse_prep"' +
      a +
      '出立の前に、兵糧と薬を少し分けてくれ。\\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可' +
      c
    );
  }
);

// Simpler global remaining
if (h.includes('馬。良いのを')) {
  h = h.replace(/馬。良いのを。以上。[^\n"\\]*/g, '出立の前に、兵糧と薬を少し分けてくれ。');
  console.log('scrubbed 馬。良いのを remnants');
}

fs.writeFileSync(HTML, h, 'utf8');
console.log({
  oldPrepQuest: h.includes('"item":"horse","label":"★1馬"'),
  oldBody: h.includes('馬。良いのを'),
  newBody: (h.match(/兵糧と薬を少し分けてくれ/g) || []).length,
});
