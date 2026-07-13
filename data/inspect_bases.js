const fs = require('fs');
const files = ['mou_isso_v0_6.html', 'mou_isso_v0_6_1.html'];
for (const f of files) {
  const h = fs.readFileSync('C:/Users/kzawa/Downloads/Grok/' + f, 'utf8');
  console.log('===', f, h.length);
  console.log({
    horsesV1: h.includes('[horses v1]'),
    showPhase: h.includes('showPhaseCompleteRows'),
    phMgmt: h.includes('id="ph-actions-mgmt"'),
    phTrans: h.includes('id="ph-actions-trans"'),
    cssHide: h.includes('#ph-actions-mgmt, #ph-actions-trans'),
    yellow: h.includes('hint-y'),
    marketOpen: h.includes("openCard('market')"),
    buyHorse: h.includes('馬を増やす'),
    letterOpen: h.includes("setPhase('letter');openLetterOverlay()"),
  });
}
