const fs=require("fs");
const h=fs.readFileSync("C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html","utf8");
function snip(lab,idx,n=800){console.log("\n==="+lab+"@"+idx+"===");if(idx<0)return console.log("missing");console.log(h.slice(idx,idx+n));}
// find letter related functions
["function renderLetter","function openLetter","function updateLetter","function fillLetter","function selectTab","function checkLetters","markLettersConsumed","letterFlags","function updateTabLabels","ptab","tab-req","personal","trustMilestone","node_enter","justEntered"].forEach(s=>{const i=h.indexOf(s);console.log(s,i);});
snip("renderLetter area", h.indexOf("function renderLetter")>=0?h.indexOf("function renderLetter"):h.indexOf("function updateLetterUI")>=0?h.indexOf("function updateLetterUI"):h.indexOf("function showLetter"));
// search patterns
const pats=["letterFlags","personal_body","demand_body","choices[","gs.choices","ltab-req","unread","hasNew","forceLetterOpen","letterPool"];
pats.forEach(p=>{let c=0,i=0;while((i=h.indexOf(p,i))>=0&&c<3){console.log(p,i,h.slice(i,i+60).replace(/\\n/g," "));i++;c++;}});
