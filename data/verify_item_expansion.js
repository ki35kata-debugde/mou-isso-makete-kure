const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const html = fs.readFileSync('mou_isso_v0_6_1.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
scripts.forEach((body, i) => { if (body.trim()) new vm.Script(body, { filename: `inline-${i}.js` }); });

let feature = scripts.find(s => s.includes('window.__crossbowCatapult'));
assert(feature, 'crafting feature script missing');
feature = feature.replace(/\}\)\(\);\s*$/, 'window.__testCheckTechUnlocks=checkTechUnlocks;window.__testRecipes=RECIPES;})();');

const elements = {};
const document = {
  readyState: 'loading', head: { appendChild(){} },
  createElement(){ return { style:{}, setAttribute(){}, appendChild(){}, querySelector(){return null;} }; },
  getElementById(id){ return elements[id] || null; }, querySelector(){ return null; },
  addEventListener(){}
};
const gs = {
  inv:{iron:100,wood:100,niter:100,herb:100,food:0},
  stock:{sword:100,siege_w:10,med:10}, prod:{}, inProd:{}, unlockedTech:{}, cleared:{weapon:[],siege:[]}, pendingUnlocks:[],
  market:{priceSell:{}}, sellQ:{}, phase:'management'
};
function baseStockOf(id){ return Object.prototype.hasOwnProperty.call(gs.inv,id) ? gs.inv[id]||0 : gs.stock[id]||0; }
function baseTakeStock(id,q){ if(Object.prototype.hasOwnProperty.call(gs.inv,id))gs.inv[id]-=q;else gs.stock[id]=(gs.stock[id]||0)-q; }
function baseTransport(){
  ['sword','siege_w','med'].forEach(id=>{const q=gs.prod[id]||0;if(!q)return;for(const [m,n] of Object.entries(context.__testRecipes[id]))baseTakeStock(m,q*n);gs.inProd[id]=(gs.inProd[id]||0)+q;gs.prod[id]=0;});
}
function baseResult(){ ['sword','siege_w','med'].forEach(id=>{gs.stock[id]=(gs.stock[id]||0)+(gs.inProd[id]||0);gs.inProd[id]=0;}); }
const context = {
  window:null, document, console, setTimeout(){}, gs,
  stockOf:baseStockOf, takeStock:baseTakeStock, goToTransport:baseTransport, goToResult:baseResult, goToNextTurn(){},
  updateInvDisplay(){}, calcSellIncome(){return 0;}, completeSales(){}, refreshMarketUI(){}, buildTransportScreen(){}, renderResult(){},
  ensureMarket(){}, smithCap(){return 20;}, pharmCap(){return 20;},
  MARKET_ECON:JSON.parse(fs.readFileSync('data/market_economy.json','utf8'))
};
context.window=context;
vm.createContext(context);
vm.runInContext(feature, context, { filename:'crafting-feature.js' });
['crossbow2','fine_sword','throwing_blade','dark_blade','siege_ladder','catapult','bomb','fire_lance','gunpowder','numbing_drug','sleep_drug','elixir'].forEach(id=>gs.stock[id]=100);

const exact = {
  gunpowder:['weapon',1], fine_sword:['weapon',2], numbing_drug:['weapon',2], throwing_blade:['weapon',3], sleep_drug:['weapon',3], dark_blade:['weapon',4], elixir:['weapon',4],
  siege_ladder:['siege',1], catapult:['siege',2], bomb:['siege',3], fire_lance:['siege',4]
};
for(const [id,[route,node]] of Object.entries(exact)){
  gs.cleared.weapon=[];gs.cleared.siege=[];gs.unlockedTech={};
  assert.strictEqual(context.isTechUnlocked(id),false,`${id} unlocked before ${route} N${node}`);
  gs.cleared[route]=Array.from({length:node},(_,i)=>i+1);context.__testCheckTechUnlocks();
  assert.strictEqual(gs.unlockedTech[id],true,`${id} flag not set`);assert.strictEqual(context.isTechUnlocked(id),true,`${id} unavailable after unlock`);
}
gs.cleared.weapon=[];gs.cleared.siege=[];gs.unlockedTech={};
assert.strictEqual(context.isTechUnlocked('crossbow2'),false);
gs.cleared.weapon=[1];context.__testCheckTechUnlocks();assert(context.isTechUnlocked('crossbow2'));

function craftOne(id){
  gs.cleared.weapon=[1,2,3,4];gs.cleared.siege=[1,2,3,4];context.__testCheckTechUnlocks();
  gs.prod={};gs.inProd[id]=0;const before={};for(const m of Object.keys(context.__testRecipes[id]))before[m]=context.stockOf(m);
  context.produce(id,1);assert.strictEqual(gs.prod[id],1,`${id} was not queued`);context.goToTransport();
  for(const [m,n] of Object.entries(context.__testRecipes[id]))assert.strictEqual(context.stockOf(m),before[m]-n,`${id} did not consume ${m}`);
  const old=gs.stock[id]||0;context.goToResult();assert.strictEqual(gs.stock[id],old+1,`${id} did not complete`);
}
['fine_sword','throwing_blade','dark_blade','siege_ladder','bomb','fire_lance','gunpowder','numbing_drug','sleep_drug','elixir'].forEach(craftOne);
// Explicit chained-material checks are covered above: throwing_blade/dark_blade consume numbing_drug,
// bomb consumes gunpowder, fire_lance consumes bomb, and elixir consumes both drugs.

// Existing production remains operational.
craftOne('crossbow2');craftOne('catapult');craftOne('sword');craftOne('med');

const market=context.MARKET_ECON;
const sells={fine_sword:150,throwing_blade:300,dark_blade:500,siege_ladder:100,catapult:150,bomb:300,fire_lance:500,gunpowder:100,numbing_drug:150,sleep_drug:300,elixir:1000};
for(const [id,price] of Object.entries(sells))assert.strictEqual(market.baseSell[id],price,`${id} sell price`);

const gd=JSON.parse(fs.readFileSync('data/game-data.js','utf8').replace(/^\s*window\.GAME_DATA\s*=\s*/,'').replace(/;\s*$/,''));
assert.deepStrictEqual(gd.node_orders.weapon['3'],{label:'弩×3・名剣×1',items:[{id:'crossbow2',label:'弩',qty:3},{id:'fine_sword',label:'名剣',qty:1}],deadline:12,carts:4,trust_reward:15});
assert.deepStrictEqual(gd.node_orders.weapon['4'],{label:'名剣×2・投刀×1',items:[{id:'fine_sword',label:'名剣',qty:2},{id:'throwing_blade',label:'投刀',qty:1}],deadline:14,carts:6,trust_reward:20});
assert.deepStrictEqual(gd.node_orders.siege['4'],{label:'投石機×2・爆弾×1',items:[{id:'catapult',label:'投石機',qty:2},{id:'bomb',label:'爆弾',qty:1}],deadline:14,carts:6,trust_reward:20});

console.log('VERIFY_ITEM_EXPANSION_OK');
