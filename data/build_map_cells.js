/**
 * Port gen_map.py build_cells → map_cells.js
 * Includes SIGN_OVERRIDE for horse cell no=4
 */
const fs = require('fs');
const path = require('path');

const CAP = [500, 498];
const ROUTES = {
  weapon: {
    color: '#a63a2c',
    name: '武器の王子',
    dirn: '南',
    start: [492, 588],
    nodes: [
      [372, 668],
      [612, 772],
      [382, 902],
      [646, 1022],
    ],
    between: [1, 1, 1, 2],
    amp: 52,
  },
  siege: {
    color: '#5a4a7d',
    name: '兵器の王子',
    dirn: '西',
    start: [412, 512],
    nodes: [
      [312, 558],
      [152, 682],
      [108, 420],
      [122, 168],
    ],
    between: [1, 1, 1, 2],
    amp: 52,
  },
  horse: {
    color: '#41756c',
    name: '馬の王子',
    dirn: '北',
    start: [512, 412],
    nodes: [
      [556, 352],
      [362, 176],
      [662, 248],
      [824, 70],
    ],
    between: [1, 3, 2, 5],
    amp: 44,
  },
  food: {
    color: '#a07417',
    name: '兵糧の王子',
    dirn: '東',
    start: [608, 528],
    nodes: [
      [690, 540],
      [838, 478],
      [896, 684],
      [1034, 572],
    ],
    between: [1, 1, 1, 2],
    amp: 52,
  },
};
// 北ルート 通しセル番号4（N1→N2 間の小マス）は下側へ折る
const SIGN_OVERRIDE = { 'horse:4': -1 };
const PORTS = { weapon: [3, 8], food: [1, 5] };

function buildCells(rkey, R) {
  const pts = [R.start].concat(R.nodes);
  const cells = [];
  let no = 1;
  for (let seg = 0; seg < pts.length - 1; seg++) {
    const [x0, y0] = pts[seg];
    const [x1, y1] = pts[seg + 1];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L;
    const ny = dx / L;
    const k = R.between[seg];
    const base_sign = seg % 2 === 0 ? 1 : -1;
    for (let i = 1; i <= k; i++) {
      const t = i / (k + 1);
      let sign = base_sign * (i % 2 === 1 ? 1 : -1);
      const ov = SIGN_OVERRIDE[rkey + ':' + no];
      if (ov !== undefined) sign = ov;
      const x = x0 + dx * t + nx * R.amp * sign;
      const y = y0 + dy * t + ny * R.amp * sign;
      cells.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, no, node: false });
      no++;
    }
    cells.push({
      x: pts[seg + 1][0],
      y: pts[seg + 1][1],
      no,
      node: true,
      nidx: seg,
    });
    no++;
  }
  return cells;
}

const cells = {};
for (const k of Object.keys(ROUTES)) {
  cells[k] = buildCells(k, ROUTES[k]);
}

// mas to node (1-based node index): cell.no of that node
function masToNode(route, node1) {
  const list = cells[route] || [];
  const c = list.find((x) => x.node && x.nidx === node1 - 1);
  return c ? c.no : 2;
}

// verify weapon N1 = 2
console.log('weapon N1 mas', masToNode('weapon', 1));
console.log('horse N1 mas', masToNode('horse', 1));
console.log('horse N2 mas', masToNode('horse', 2));
console.log(
  'horse cells around N1-N2',
  cells.horse.filter((c) => c.no >= 1 && c.no <= 6)
);

const out = {
  CAP,
  ROUTES,
  PORTS,
  SIGN_OVERRIDE,
  cells,
};
const js =
  'window.MAP_CELLS = ' +
  JSON.stringify(out) +
  ';\n' +
  `window.masToNode=function(route,node1){
  var list=(window.MAP_CELLS.cells[route]||[]);
  var c=list.find(function(x){return x.node&&x.nidx===node1-1;});
  return c?c.no:2;
};
window.posForConvoy=function(route,targetNode,eta,etaMax){
  var mas=window.masToNode(route,targetNode);
  var em=etaMax!=null?etaMax:mas;
  var left=eta!=null?eta:0;
  var done=Math.max(0,em-left);
  var p=em>0?done/em:1;
  var list=window.MAP_CELLS.cells[route]||[];
  var CAP=window.MAP_CELLS.CAP;
  var endIdx=-1;
  for(var j=0;j<list.length;j++){ if(list[j].node&&list[j].nidx===targetNode-1){ endIdx=j; break; } }
  var sub=[[CAP[0],CAP[1]]];
  for(var k=0;k<=endIdx&&k<list.length;k++) sub.push([list[k].x,list[k].y]);
  if(sub.length<2) return {x:CAP[0],y:CAP[1]};
  var segs=sub.length-1;
  var f=Math.max(0,Math.min(1,p))*segs;
  var i=Math.min(segs-1,Math.floor(f));
  var t=f-i;
  return {x:sub[i][0]+(sub[i+1][0]-sub[i][0])*t, y:sub[i][1]+(sub[i+1][1]-sub[i][1])*t};
};
`;

fs.writeFileSync(path.join(__dirname, 'map_cells.js'), js, 'utf8');
console.log('wrote map_cells.js');
