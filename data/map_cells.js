window.MAP_CELLS = {"CAP":[500,498],"ROUTES":{"weapon":{"color":"#a63a2c","name":"武器の王子","dirn":"南","start":[492,588],"nodes":[[372,668],[612,772],[382,902],[646,1022]],"between":[1,1,1,2],"amp":52},"siege":{"color":"#5a4a7d","name":"兵器の王子","dirn":"西","start":[412,512],"nodes":[[312,558],[152,682],[108,420],[122,168]],"between":[1,1,1,2],"amp":52},"horse":{"color":"#41756c","name":"馬の王子","dirn":"北","start":[512,412],"nodes":[[556,352],[362,176],[662,248],[824,70]],"between":[1,3,2,5],"amp":44},"food":{"color":"#a07417","name":"兵糧の王子","dirn":"東","start":[608,528],"nodes":[[690,540],[838,478],[896,684],[1034,572]],"between":[1,1,1,2],"amp":52}},"PORTS":{"weapon":[3,8],"food":[1,5]},"SIGN_OVERRIDE":{"horse:4":-1},"cells":{"weapon":[{"x":403.2,"y":584.7,"no":1,"node":false},{"x":372,"y":668,"no":2,"node":true,"nidx":0},{"x":512.7,"y":672.3,"no":3,"node":false},{"x":612,"y":772,"no":4,"node":true,"nidx":1},{"x":471.4,"y":791.7,"no":5,"node":false},{"x":382,"y":902,"no":6,"node":true,"nidx":2},{"x":491.5,"y":894.7,"no":7,"node":false},{"x":536.5,"y":1029.3,"no":8,"node":false},{"x":646,"y":1022,"no":9,"node":true,"nidx":3}],"siege":[{"x":340.3,"y":487.8,"no":1,"node":false},{"x":312,"y":558,"no":2,"node":true,"nidx":0},{"x":263.9,"y":661.1,"no":3,"node":false},{"x":152,"y":682,"no":4,"node":true,"nidx":1},{"x":181.3,"y":542.4,"no":5,"node":false},{"x":108,"y":420,"no":6,"node":true,"nidx":2},{"x":60.7,"y":333.1,"no":7,"node":false},{"x":169.3,"y":254.9,"no":8,"node":false},{"x":122,"y":168,"no":9,"node":true,"nidx":3}],"horse":[{"x":569.5,"y":408,"no":1,"node":false},{"x":556,"y":352,"no":2,"node":true,"nidx":0},{"x":477.9,"y":340.6,"no":3,"node":false},{"x":429.4,"y":296.6,"no":4,"node":false},{"x":380.9,"y":252.6,"no":5,"node":false},{"x":362,"y":176,"no":6,"node":true,"nidx":1},{"x":451.7,"y":242.8,"no":7,"node":false},{"x":572.3,"y":181.2,"no":8,"node":false},{"x":662,"y":248,"no":9,"node":true,"nidx":2},{"x":656.5,"y":188.7,"no":10,"node":false},{"x":748.5,"y":218.3,"no":11,"node":false},{"x":710.5,"y":129.4,"no":12,"node":false},{"x":802.5,"y":158.9,"no":13,"node":false},{"x":764.5,"y":70.1,"no":14,"node":false},{"x":824,"y":70,"no":15,"node":true,"nidx":3}],"food":[{"x":641.5,"y":585.5,"no":1,"node":false},{"x":690,"y":540,"no":2,"node":true,"nidx":0},{"x":743.9,"y":461,"no":3,"node":false},{"x":838,"y":478,"no":4,"node":true,"nidx":1},{"x":816.9,"y":595.1,"no":5,"node":false},{"x":896,"y":684,"no":6,"node":true,"nidx":2},{"x":909.2,"y":606.3,"no":7,"node":false},{"x":1020.8,"y":649.7,"no":8,"node":false},{"x":1034,"y":572,"no":9,"node":true,"nidx":3}]}};
window.masToNode=function(route,node1){
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
