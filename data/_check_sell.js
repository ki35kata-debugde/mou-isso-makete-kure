const fs=require("fs");
const h=fs.readFileSync("C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html","utf8");
const i=h.indexOf("window.renderRanchHorseList = function");
const chunk=h.slice(i, i+2200);
const line=chunk.split("\n").find(l=>l.includes("sellHorse("));
console.log(line);
console.log("paidThisTurn", h.includes("paidThisTurn"));
console.log("productSellPrice", h.includes("productSellPrice"));
