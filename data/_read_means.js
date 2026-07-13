const fs=require("fs");
const h=fs.readFileSync("C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html","utf8");
const i=h.indexOf("function buildMeansUI")>=0?h.indexOf("function buildMeansUI"):h.indexOf("buildMeans");
console.log("idx",i);
console.log(h.slice(i, i+2000));
const j=h.indexOf("syncRanchCount");
console.log("syncRanch", h.slice(j, j+400));
