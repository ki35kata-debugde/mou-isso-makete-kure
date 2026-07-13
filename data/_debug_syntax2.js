const fs = require("fs");
const h = fs.readFileSync("C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6_1.html", "utf8");
const a = h.lastIndexOf("showGamePopup");
console.log("last showGamePopup", a);
console.log(h.slice(a - 500, a + 1500));
