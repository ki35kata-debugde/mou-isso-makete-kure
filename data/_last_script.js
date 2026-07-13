
const CFG = {
  "start": {
    "gold": 1000,
    "iron": 5,
    "wood": 5,
    "niter": 0,
    "herb": 4,
    "food": 8,
    "sword": 0,
    "siege_w": 0,
    "med": 0
  },
  "prices": {
    "iron": {
      "buy": 20,
      "sell": 16,
      "label": "鉄"
    },
    "wood": {
      "buy": 12,
      "sell": 9,
      "label": "木材"
    },
    "niter": {
      "buy": 25,
      "sell": 20,
      "label": "硝石"
    },
    "herb": {
      "buy": 15,
      "sell": 12,
      "label": "薬草"
    },
    "food_mat": {
      "buy": 18,
      "sell": 14,
      "label": "兵糧"
    },
    "med": {
      "buy": 999,
      "sell": 30,
      "label": "回復薬"
    }
  },
  "prep_quests": {
    "food": {
      "item": "food",
      "label": "兵糧",
      "qty": 5,
      "trust_reward": 3
    },
    "horse":{"items":[{"item":"food","label":"兵糧","qty":4},{"item":"med","label":"回復薬","qty":1}],"label":"兵糧×4・回復薬×1","trust_reward":3},
    "siege": {
      "item": "siege_w",
      "label": "衝車★1",
      "qty": 2,
      "trust_reward": 2
    },
    "weapon": {
      "item": "sword",
      "label": "剣★1",
      "qty": 2,
      "trust_reward": 2
    }
  },
  "sortie_trust_threshold": 5,
  "orders": {
    "food": {
      "item_label": "兵糧×20",
      "deadline": 8
    },
    "horse": {
      "item_label": "良馬×3頭",
      "deadline": 10
    },
    "siege": {
      "item_label": "弩★1×4",
      "deadline": 9
    },
    "weapon": { "item_label": "剣★1×4", "deadline": 8 }
  },
  "recipes_smith": {
    "sword": {
      "label": "剣 ★1",
      "cost": {
        "iron": 1
      },
      "slots": 1
    },
    "siege_w": {
      "label": "衝車 ★1",
      "cost": {
        "wood": 2
      },
      "slots": 1
    }
  },
  "recipes_pharmacy": {
    "med": {
      "label": "回復薬 ★1",
      "cost": {
        "herb": 1
      },
      "slots": 1
    }
  },
  "smith_capacity": 3,
  "pharmacy_capacity": 3,
  "letters": {
    "food": {
      "prep": {
        "demand_body": "兵糧三千。不足は一升たりとも許さぬ。\n【出立準備依頼】兵糧×5　輸送フェーズで手渡し可",
        "personal_intro": "王子からです。今回は少し長い手紙ですよ、父上。",
        "personal_body": "先日の市価の報告、受け取った。そなたの読みは正確だ。\n\nひとつ聞く。出立前夜、兵に何を食わせれば士気が上がると思う。勝算より、飯の話が聞きたい。",
        "choices": [
          {
            "icon": "🍚",
            "text": "「白米に干し魚。腹が満ちれば足が動きます。数字より胃袋です」",
            "trust": 2
          },
          {
            "icon": "📊",
            "text": "「現在庫から最適な配給量を計算します」と数字で返す",
            "trust": 1
          },
          {
            "icon": "😅",
            "text": "「…また少し焦がしました」と関係のないことを書く",
            "trust": 0
          }
        ]
      },
      "sortied": {
        "demand_body": "到着した。思ったより速かった。\nこの先、兵糧が要る。送ってくれ。\n\n【依頼】兵糧×20　納期：8ターン後",
        "personal_intro": "到着の報告が来ましたよ。父上、良かったですね。",
        "personal_body": "前線の飯は不味い。やはりそなたの言う通りだった。\n\n次の荷が届いたら、少し余分に干し魚を頼む。",
        "choices": [
          {
            "icon": "🐟",
            "text": "「干し魚、多めに用意しておきます」",
            "trust": 2
          },
          {
            "icon": "📋",
            "text": "「承知しました。兵糧の手配を急ぎます」",
            "trust": 1
          }
        ]
      }
    },
    "horse": {
      "prep": {
        "demand_body": "出立の前に、兵糧と薬を少し分けてくれ。\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可",
        "personal_intro": "…馬の王子からです。今回も短いですが、絵が描いてあります。",
        "personal_body": "今年は仔馬を何頭見た。栗毛の仔が一頭。良い目をしていた。\n［馬の絵：下手だが丁寧に描かれている］\n\n朝は冷える。羽織れ。",
        "choices": [
          {
            "icon": "🎨",
            "text": "絵で返す　─　同じ栗毛の仔馬を丁寧に描いて送る",
            "trust": 2
          },
          {
            "icon": "📝",
            "text": "「栗毛の仔馬、こちらでも記録しておきます」と返す",
            "trust": 1
          },
          {
            "icon": "📋",
            "text": "「準備の馬2頭を揃えます」と事務的に返す",
            "trust": 0
          }
        ]
      },
      "sortied": {
        "demand_body": "着いた。馬も元気だ。\n\n【依頼】良馬×3頭　納期：10ターン後",
        "personal_intro": "着いたみたいです。馬のことしか書いてないけど。",
        "personal_body": "北の草は違う。馬が喜んでいる。\n\nそちらの仔馬はどうなった。",
        "choices": [
          {
            "icon": "🐴",
            "text": "「仔馬は元気です。もうすぐ★2になりそうです」",
            "trust": 2
          },
          {
            "icon": "📝",
            "text": "「こちらも無事です。良馬の手配を進めます」",
            "trust": 1
          }
        ]
      }
    },
    "siege": {
      "prep": {
        "demand_body": "衝車、二台。できるだけ早く。以下、設計図を添付した。\n【出立準備依頼】衝車★1×2　輸送フェーズで手渡し可",
        "personal_intro": "来ました！今回の図面、前回より格段に複雑で——でも面白い！",
        "personal_body": "── 設計図 v0.1（衝車・改良型）──\n車軸径：4寸。外装板：杉材3分厚。前部衝角：鋳鉄30斤。\n補強箇所は図面の通り。読めるか。",
        "choices": [
          {
            "icon": "✨",
            "text": "「読めます。前部衝角、幅を広げると食い込みが改善されるかと」と改良案を返す",
            "trust": 2
          },
          {
            "icon": "🔨",
            "text": "「了解しました。2台、取りかかります」",
            "trust": 1
          }
        ]
      },
      "sortied": {
        "demand_body": "陣を構えた。衝車の調子は良い。\n次の攻城には弩も要る。\n\n【依頼】弩★1×4　納期：9ターン後",
        "personal_intro": "陣を構えたそうです。設計図の改良案、採用されたみたいで嬉しいです。",
        "personal_body": "前部衝角の改良、正解だった。炉子の案がなければ今頃困っていた。\n\n次は弩の設計図を送る。また読んでくれ。",
        "choices": [
          {
            "icon": "📐",
            "text": "「楽しみにしています！設計図、待ってます」",
            "trust": 2
          },
          {
            "icon": "🔩",
            "text": "「弩の製作、準備しておきます」",
            "trust": 1
          }
        ]
      }
    },
    "weapon": {
      "prep": {
        "demand_body": "出立の支度だ。剣を揃えろ。\n\n【出立準備依頼】剣★1×2　輸送フェーズで手渡し可",
        "personal_intro": "父上、また来ましたよ武刃四からの手紙。今回は……少し様子が違います。",
        "personal_body": "愛しの職人殿〜、武器の王子でございます。\nいや、そんな名前じゃないんだけどね。うちの薬房、評判いいって聞いたよ。期待してる。\n\nあと俺、山道は慣れてるから。一番早く終わらせてみせる。誰より先に。",
        "choices": [
          {
            "icon": "⚡",
            "text": "「早く終わらせれば誰も死なないと？ずいぶん自信家ですね」と切り返す",
            "trust": 2
          },
          {
            "icon": "💊",
            "text": "「ご期待に沿えるよう精進します」と返す",
            "trust": 1
          },
          {
            "icon": "📋",
            "text": "必要な薬の品目を確認して事務的に返す",
            "trust": 0
          }
        ]
      },
      "sortied": {
        "demand_body": "山道、余裕だった。まずここを押さえる。\n\n【依頼】剣★1×4　納期：8ターン後（ノード1）",
        "personal_intro": "一番乗りだって自慢してます、父上。まあ……格好いいですけど。",
        "personal_body": "薬、効いたよ。山道でちょっと足をやったけど、一日で治った。\n\nありがとう。……って言うの、恥ずかしいんだけど。",
        "choices": [
          {
            "icon": "💊",
            "text": "「お役に立てて何よりです。無理しないでください」",
            "trust": 2
          },
          {
            "icon": "😄",
            "text": "「一番乗り、おめでとうございます」と素直に祝う",
            "trust": 1
          }
        ]
      }
    }
  }
};

const PKEYS=['food','horse','siege','weapon'];
const PNAMES={food:'兵糧太',horse:'騎馬次',siege:'攻三城',weapon:'武刃四'};
const PDIRS={food:'東',horse:'北',siege:'西',weapon:'南'};
const PCOLORS={food:'#a07417',horse:'#41756c',siege:'#5a4a7d',weapon:'#a63a2c'};
const SEASONS=['春','夏','秋','冬'];
// 運送駒の表示サイズ（旧デモ animateMotion 駒 width≈50–58 に合わせる。王子 .piece とは別）
const CONVOY_ICON_SIZE=56;
const qtys={};

const gs={
  phase:'letter', turn:1, year:1, season:0,
  gold:CFG.start.gold,
  inv:{iron:(CFG.start.iron!=null?CFG.start.iron:CFG.start['鉄'])||5,wood:CFG.start.wood||0,niter:CFG.start.niter||0,herb:CFG.start.herb||0,food:CFG.start.food||0},
  stock:{sword:CFG.start.sword,siege_w:CFG.start.siege_w,med:CFG.start.med},
  inProd:{sword:0,siege_w:0,med:0},  // 生産中（翌T完成）
  buy:{}, sellQ:{},
  prod:{sword:0,siege_w:0,med:0},    // 今T指示分
  transport:{}, choices:{}, kengen:{shingen:null,kenjou:null},
  trust:{food:0,horse:0,siege:0,weapon:0},
  prepDone:{food:false,horse:false,siege:false,weapon:false},
  sortied:{food:false,horse:false,siege:false,weapon:false},
  prepQty:{food:0,horse:0,siege:0,weapon:0},
  sortieDoneThisTurn:false,
};

// ── フェーズ ──
function setPhase(p){
  gs.phase=p;
  const LBL={letter:'手紙',management:'経営',transport:'輸送',result:'結果'};
  document.getElementById('phase-badge').textContent=LBL[p]||p;
  const steps=['letter','management','transport','result'];
  document.querySelectorAll('.step').forEach((s,i)=>{
    s.classList.remove('active','done');
    const idx=steps.indexOf(p);
    if(i<idx)s.classList.add('done');else if(i===idx)s.classList.add('active');
  });
  document.querySelectorAll('.cmd-btn').forEach(b=>{
    b.classList.remove('active','disabled');
    const id=b.id;
    if(p==='letter'){
      if(['cmd-market','cmd-smith','cmd-ranch','cmd-pharmacy','cmd-transport'].includes(id))b.classList.add('disabled');
      if(id==='cmd-letter')b.classList.add('active');
    }else if(p==='management'){
      if(['cmd-letter','cmd-transport'].includes(id))b.classList.add('disabled');
    }else if(p==='transport'){
      if(['cmd-letter','cmd-market','cmd-smith','cmd-ranch','cmd-pharmacy'].includes(id))b.classList.add('disabled');
      if(id==='cmd-transport')b.classList.add('active');
    }else{document.querySelectorAll('.cmd-btn').forEach(b=>b.classList.add('disabled'));}
  });
  ['management','transport','result'].forEach(sec=>{
    document.getElementById('sec-'+sec).style.display=(p===sec)?'block':'none';
  });
  if(p==='management'){openCard('market');updateInvDisplay();var cm=document.getElementById('cmd-market');if(cm){document.querySelectorAll('#cmd-bar .cmd-btn').forEach(function(b){b.classList.remove('active');});cm.classList.add('active');}}
  if(p==='transport'){selectTransTab('food');updateStockBar();updateTransportUI();}
  if(p==='result')buildResultScreen();
}

// ── 手紙オーバーレイ ──
function openLetterOverlay(){
  var ov=document.getElementById('overlay');
  if(ov){ ov.classList.add('on'); ov.style.display='block'; }
  try{ if(typeof renderAllLetters==='function') renderAllLetters(); }catch(e){ console.warn('renderAllLetters',e); }
  try{ if(typeof selectTab==='function') selectTab('food'); }catch(e){ console.warn('selectTab',e); }
}
function closeOverlay(){document.getElementById('overlay').classList.remove('on');}

// ── 手紙レンダリング ──
function renderAllLetters(){
  PKEYS.forEach(key=>renderLetter(key));
  updateTabLabels();
  checkLettersDone();
}
function getLetter(key){
  const ld=CFG.letters[key];
  return gs.sortied[key]?ld.sortied:ld.prep;
}
function renderLetter(key){
  const ld=getLetter(key);
  const fromLabel=gs.sortied[key]?
    PNAMES[key]+'（'+PDIRS[key]+'）ノード1より':
    PNAMES[key]+'（出立前・準備依頼）';
  // 依頼タブ
  document.getElementById('lt-'+key+'-demand').innerHTML=
    '<div class="letter-block"><div class="letter-from">'+fromLabel+'</div>'+
    '<div class="letter-text">'+ld.demand_body+'</div></div>';
  // 娘メッセージ
  const gm=document.getElementById('girl-msg-'+key);
  if(gm)gm.textContent=ld.personal_intro;
  // 本文
  const pb=document.getElementById('personal-body-'+key);
  if(pb)pb.innerHTML='<div class="letter-block"><div class="letter-text">'+ld.personal_body+'</div></div>';
  // 選択肢
  renderChoices(key,ld.choices);
}
function renderChoices(key,opts){
  const area=document.getElementById('choices-area-'+key);if(!area)return;
  const chosen=gs.choices[key];
  let html='<div class="choices-wrap"><div class="choices-label">返事を選んでください（取り消し不可）</div>';
  opts.forEach((o,i)=>{
    const sel=(chosen!==undefined&&chosen.idx===i)?'selected':'';
    html+=`<button class="choice-btn ${sel}" onclick="selectChoice('${key}',${i},${o.trust},this)">
      <span class="choice-icon">${o.icon}</span>
      <div>${o.text}<span class="trust-hint">✦ 信頼度 +${o.trust}</span></div></button>`;
  });
  html+='</div>';
  area.innerHTML=html;
}
function updateTabLabels(){
  PKEYS.forEach(key=>{
    const req=document.getElementById('ltab-req-'+key);
    const dl=document.getElementById('ltab-dl-'+key);
    const tab=document.getElementById('ptab-'+key);
    const chk=document.getElementById('tab-check-'+key);
    if(chk)chk.textContent=(gs.choices[key]!==undefined)?'☑ ':'';
    const t=gs.trust[key];
    if(gs.sortied[key]){
      if(req)req.textContent='出立済';if(dl)dl.textContent='ノード1';
      if(tab)tab.classList.remove('urg-tab');
    }else if(gs.prepDone[key]){
      if(req)req.textContent='準備完了';if(dl)dl.textContent='信頼'+t+'/100';
      if(tab)tab.classList.toggle('urg-tab',t>=CFG.sortie_trust_threshold);
    }else{
      const q=CFG.prep_quests[key];
      if(req)req.textContent='準備:'+((q&&q.label)?q.label:((q&&q.item)?q.item:''))+(q&&q.qty!=null?('×'+q.qty):'');
      if(dl)dl.textContent='信頼'+t+'/100';
    }
  });
  // 謁見タブのサマリー
  const ks=document.getElementById('kg-summary-tab');
  if(ks){
    const parts=[];
    if(gs.kengen.shingen)parts.push('進言✓');
    if(gs.kengen.kenjou)parts.push('献上✓');
    ks.textContent=parts.length?parts.join(' '):'進言/献上';
  }
}

// ── 5タブ切り替え ──
function selectTab(key){
  document.querySelectorAll('[id^="ptab-"]').forEach(b=>b.classList.remove('active'));
  const btn=document.getElementById('ptab-'+key);if(btn)btn.classList.add('active');
  document.querySelectorAll('#ov-inner .tab-content').forEach(c=>c.classList.remove('active'));
  const lc=document.getElementById('lc-'+key);if(lc)lc.classList.add('active');
}
function selectLetterTab(prince,tab){
  ['demand','personal'].forEach(t=>{
    const el=document.getElementById('lt-'+prince+'-'+t);if(el)el.style.display=(t===tab)?'block':'none';
  });
  document.querySelectorAll('#lc-'+prince+' .ltab').forEach((b,i)=>{
    b.classList.toggle('active',(i===0&&tab==='demand')||(i===1&&tab==='personal'));
  });
}
function selectChoice(key,idx,trust,btn){
  if(gs.choices[key]!==undefined)return;
  gs.choices[key]={idx,trust};
  document.querySelectorAll('#choices-area-'+key+' .choice-btn').forEach((b,i)=>b.classList.toggle('selected',i===idx));
  gs.trust[key]=Math.min(100,gs.trust[key]+trust);
  const dotMap={food:0,horse:1,siege:2,weapon:3};
  const dot=document.getElementById('lp-'+dotMap[key]);if(dot)dot.classList.add('done');
  checkLettersDone();showToast('返事を選びました（取り消し不可）');
  updatePrinceBar();checkSortieConditions();updateTabLabels();
}
function checkLettersDone(){
  const all=PKEYS.every(k=>gs.choices[k]!==undefined);
  const btn=document.getElementById('ph-letter-complete');if(btn)btn.disabled=!all;
}

// ── 謁見 ──
function kgPick(type,val,btn){
  gs.kengen[type]=val;
  document.querySelectorAll('#kg-'+type+' .kg-opt').forEach(b=>b.classList.remove('chosen'));
  btn.classList.add('chosen');
  if(val==='commend'){const s=document.getElementById('kg-commend-sel');if(s)s.classList.add('show');}
  const labels={鉄:'鉄増産',wood:'木材増産',food_mat:'兵糧増産',horse_find:'名馬探索',commend:'王子を褒める',
    potion:'回復薬を献上',gold100:'100両を献上',gold300:'300両を献上'};
  document.getElementById('kg-result').textContent=
    (gs.kengen.shingen?'進言：'+(labels[gs.kengen.shingen]||gs.kengen.shingen)+'　':'')+
    (gs.kengen.kenjou?'献上：'+(labels[gs.kengen.kenjou]||gs.kengen.kenjou):'');
  updateTabLabels();
}

// ── 経営カード ──
function openCard(name){
  ['market','smith','pharmacy','ranch'].forEach(n=>{
    const el=document.getElementById('card-'+n);if(el)el.classList.toggle('show',n===name);
  });
}
function cmdClick(name){
  if(gs.phase==='management')openCard(name);
  else if(gs.phase==='letter')openLetterOverlay();
}

// ── 売買 ──
function buy(res,delta){
  const p=CFG.prices[res];if(!p||p.buy>=999)return;
  const nv=Math.max(0,(gs.buy[res]||0)+delta);
  if(delta>0&&gs.gold-calcBuyCost()+calcSellIncome()-p.buy<0)return;
  gs.buy[res]=nv;const el=document.getElementById('buy-'+res);if(el)el.textContent=nv;
  updateTradeTotals();
}
function sell(res,delta){
  const p=CFG.prices[res];if(!p)return;
  const avail=res==='med'?gs.stock.med:(gs.inv[res==='food_mat'?'food':res]||0);
  const nv=Math.max(0,Math.min(avail,(gs.sellQ[res]||0)+delta));
  gs.sellQ[res]=nv;const el=document.getElementById('sell-'+res);if(el)el.textContent=nv;
  updateTradeTotals();
}
function calcBuyCost(){return Object.entries(gs.buy||{}).reduce((s,[r,q])=>s+q*(CFG.prices[r]?.buy||0),0);}
function calcSellIncome(){return Object.entries(gs.sellQ||{}).reduce((s,[r,q])=>s+q*(CFG.prices[r]?.sell||0),0);}
function calcTradeNet(){return calcSellIncome()-calcBuyCost();}
function updateTradeTotals(){
  const b=calcBuyCost(),s=calcSellIncome(),net=s-b;
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('buy-total',b);set('sell-total',s);
  const ne=document.getElementById('net-total');
  if(ne){ne.textContent=(net>=0?'+':'')+net;ne.style.color=net>=0?'var(--green)':'var(--accent)';}
}
function confirmTrade(){
  if(gs.gold+calcTradeNet()<0){showToast('金が足りません');return;}
  gs.gold+=calcTradeNet();
  for(const[r,q]of Object.entries(gs.buy||{})){if(r==='food_mat')gs.inv.food+=q;else gs.inv[r]=(gs.inv[r]||0)+q;}
  for(const[r,q]of Object.entries(gs.sellQ||{})){
    if(r==='food_mat')gs.inv.food=Math.max(0,gs.inv.food-q);
    else if(r==='med')gs.stock.med=Math.max(0,gs.stock.med-q);
    else gs.inv[r]=Math.max(0,(gs.inv[r]||0)-q);
  }
  gs.buy={};gs.sellQ={};
  Object.keys(CFG.prices).forEach(r=>{
    ['buy-','sell-'].forEach(pre=>{const e=document.getElementById(pre+r);if(e)e.textContent=0;});
  });
  updateTradeTotals();updateHeaderDisplay();updateInvDisplay();showToast('売買を確定しました');
}

// ── 生産（今ターン指示、結果フェーズで完成） ──
function produce(item,delta){
  const isPharma=item==='med';
  const cap=isPharma?CFG.pharmacy_capacity:CFG.smith_capacity;
  const group=isPharma?['med']:['sword','siege_w'];
  const used=group.reduce((s,k)=>s+gs.prod[k],0);
  const nv=gs.prod[item]+delta;
  if(nv<0||used+delta>cap)return;
  // 素材チェック（指示した瞬間は消費しない、フェーズ完了時に消費）
  const ironNeed=gs.prod.sword+(item==='sword'?delta:0);
  const woodNeed=(gs.prod.siege_w+(item==='siege_w'?delta:0))*2;
  const herbNeed=gs.prod.med+(item==='med'?delta:0);
  if(!isPharma&&(ironNeed>gs.inv.iron||woodNeed>gs.inv.wood))return;
  if(isPharma&&herbNeed>gs.inv.herb)return;
  gs.prod[item]=nv;
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('prod-'+item,nv);
  set('prod-smith-used',gs.prod.sword+gs.prod.siege_w);
  set('prod-pharm-used',gs.prod.med);
  set('prod-鉄-cost',gs.prod.sword);
  set('prod-wood-cost',gs.prod.siege_w*2);
  set('prod-herb-cost',gs.prod.med);
}
function startProduction(facility){
  const items=facility==='smith'?['sword','siege_w']:['med'];
  const totals=items.map(k=>gs.prod[k]).reduce((a,b)=>a+b,0);
  showToast(facility==='smith'?`工房：剣×${gs.prod.sword} 衝車×${gs.prod.siege_w} を確定`:`薬房：回復薬×${gs.prod.med} を確定`);
}

// ── 輸送タブ ──
function selectTransTab(key){
  document.querySelectorAll('[id^="ttab-"]').forEach(b=>b.classList.remove('active'));
  const btn=document.getElementById('ttab-'+key);if(btn)btn.classList.add('active');
  document.querySelectorAll('.tp-tab-content').forEach(c=>{
    c.classList.remove('active');
    // clear stuck inline styles from older phase-residue fix
    c.style.removeProperty('display');
  });
  const tc=document.getElementById('tp-'+key);if(tc)tc.classList.add('active');
}
function selectMeans(prince,means,btn){
  gs.transport[prince]=gs.transport[prince]||{};gs.transport[prince].means=means;
  document.querySelectorAll('#means-'+prince+' .means-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const caps={jinput:1,cart:2,boat:4};
  const eta={weapon:{jinput:4,cart:4,boat:3},siege:{jinput:5,cart:5}};
  const cap=caps[means]||1,t=((eta[prince]||{})[means])||5;
  const ti=document.getElementById('tinfo-'+prince);if(ti)ti.textContent=btn.textContent+' 積載'+cap+'荷　到着予定 '+t+'T後';
  const go=document.getElementById('go-'+prince);if(go)go.disabled=false;
}
function changeQty(prince,item,delta){
  const key=prince+'_'+item;
  // 輸送フェーズでは完成品在庫（inProdは含まない）
  const avail=item==='sword'?gs.stock.sword:item==='siege_w'?gs.stock.siege_w:gs.inv.food;
  qtys[key]=Math.max(0,Math.min(avail,(qtys[key]||0)+delta));
  const el=document.getElementById('qty-'+prince+'-'+item);if(el)el.textContent=qtys[key];
}
function goTransport(prince){
  gs.transport[prince]=gs.transport[prince]||{};gs.transport[prince].done=true;
  const btn=document.getElementById('go-'+prince);
  if(btn){btn.textContent='✓ 出発済み';btn.className='go-btn done-btn';btn.disabled=true;}
  showToast(PNAMES[prince]+'への輸送を出発させました');
}
function updateStockBar(){
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  // 輸送フェーズでは inProd（生産中）は来T完成として表示、今Tは使用不可
  set('tr-stk-sword',gs.stock.sword);  set('tr-inp-sword',gs.inProd.sword);
  set('tr-stk-siege_w',gs.stock.siege_w);set('tr-inp-siege_w',gs.inProd.siege_w);
  set('tr-stk-med',gs.stock.med);      set('tr-inp-med',gs.inProd.med);
  set('tr-stk-food',gs.inv.food);
  // 輸送パネル内の在庫表示も更新
  const ws=document.getElementById('ts-weapon-stk');if(ws)ws.textContent=gs.stock.sword;
  const wi=document.getElementById('ts-weapon-inp');if(wi)wi.textContent=gs.inProd.sword;
  const ss=document.getElementById('ts-siege-stk');if(ss)ss.textContent=gs.stock.siege_w;
  const si2=document.getElementById('ts-siege-inp');if(si2)si2.textContent=gs.inProd.siege_w;
}

// ── 出立システム ──
function getAvailForPrep(key){
  const q=CFG.prep_quests[key];
  if(q.item==='food')return gs.inv.food;
  if(q.item==='sword')return gs.stock.sword;
  if(q.item==='siege_w')return gs.stock.siege_w;
  return 0;
}
function changePrepQty(key,delta){
  if(gs.prepDone[key])return;
  const q=CFG.prep_quests[key];
  const avail=getAvailForPrep(key);
  const nv=Math.max(0,Math.min(Math.min(avail,q.qty),(gs.prepQty[key]||0)+delta));
  gs.prepQty[key]=nv;
  const el=document.getElementById('prep-qty-'+key);if(el)el.textContent=nv;
  const btn=document.getElementById('hand-btn-'+key);if(btn)btn.disabled=(nv===0);
  const si=document.getElementById('prep-stock-'+key);
  if(si)si.innerHTML=`現庫: <b>${avail}</b>　必要: ${q.qty}　選択: <b>${nv}</b>`;
}
function handDeliver(key){
  if(gs.prepDone[key])return;
  const q=CFG.prep_quests[key];
  const qty=gs.prepQty[key]||0;if(qty<=0)return;
  if(q.item==='food')gs.inv.food-=qty;
  else if(q.item==='sword')gs.stock.sword-=qty;
  else if(q.item==='siege_w')gs.stock.siege_w-=qty;
  const trustGain=qty>=q.qty?q.trust_reward:Math.floor(q.trust_reward*qty/q.qty);
  gs.trust[key]=Math.min(100,gs.trust[key]+trustGain);
  if(qty>=q.qty){
    gs.prepDone[key]=true;
    const pi=document.getElementById('prep-info-'+key);if(pi)pi.textContent='✓ 準備依頼を完了しました！';
    const hb=document.getElementById('hand-btn-'+key);if(hb){hb.textContent='✓ 手渡し済み';hb.className='hand-btn done';hb.disabled=true;}
  }
  showToast(PNAMES[key]+'への手渡し（信頼度 +'+trustGain+'）');
  updateHeaderDisplay();updateStockBar();updatePrinceBar();checkSortieConditions();updateTabLabels();
}
function checkSortieConditions(){
  PKEYS.forEach(key=>{
    if(gs.sortied[key])return;
    const canSortie=gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold;
    const area=document.getElementById('sortie-area-'+key);
    const btn=document.getElementById('sortie-btn-'+key);
    if(!area||!btn)return;
    area.style.display=canSortie?'block':'none';
    btn.style.display=(canSortie&&!gs.sortieDoneThisTurn)?'block':'none';
  });
}
function sortie(key){
  if(gs.sortieDoneThisTurn){showToast('このターンはすでに出立させています');return;}
  if(!gs.prepDone[key]||gs.trust[key]<CFG.sortie_trust_threshold)return;
  gs.sortied[key]=true;gs.sortieDoneThisTurn=true;
  const btn=document.getElementById('sortie-btn-'+key);if(btn)btn.style.display='none';
  const done=document.getElementById('sortie-done-'+key);if(done)done.style.display='block';
  PKEYS.forEach(k=>{if(k!==key){const b=document.getElementById('sortie-btn-'+k);if(b)b.style.display='none';}});
  document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(el=>el.style.display='');
  showToast('⚑ '+PNAMES[key]+'が出立！マップに登場');
  updatePrinceBar();updateTabLabels();
}

// ── フェーズ遷移 ──
function goToMgmt(){// goToMgmt hardened
  closeOverlay();
  setPhase('management');
  // cancel any pending letter re-open
  if(typeof gs!=='undefined') gs.phase='management';
  var ov=document.getElementById('overlay');
  if(ov){ ov.classList.remove('on'); ov.style.display=''; }
}
function goToTransport(){
  // 生産指示を確定し素材を消費（完成品には入れない）
  gs.inv.iron=Math.max(0,(Number(gs.inv.iron)||0)-(Number(gs.prod.sword)||0));
  gs.inv.wood=Math.max(0,(Number(gs.inv.wood)||0)-(Number(gs.prod.siege_w)||0)*2);
  gs.inv.herb=Math.max(0,(Number(gs.inv.herb)||0)-(Number(gs.prod.med)||0));
  gs.inProd.sword+=gs.prod.sword;
  gs.inProd.siege_w+=gs.prod.siege_w;
  gs.inProd.med+=gs.prod.med;
  updateHeaderDisplay();setPhase('transport');
}
function goToResult(){
  // 結果フェーズで生産完了 → 完成品在庫へ
  gs.stock.sword+=gs.inProd.sword;
  gs.stock.siege_w+=gs.inProd.siege_w;
  gs.stock.med+=gs.inProd.med;
  gs.inProd={sword:0,siege_w:0,med:0};
  setPhase('result');
}
function goToNextTurn(){
  gs.turn++;gs.season=(gs.season+1)%4;if(gs.season===0)gs.year++;
  gs.choices={};
  gs.prod={sword:0,siege_w:0,med:0};
  gs.transport={};
  gs.prepQty={food:0,horse:0,siege:0,weapon:0};
  gs.sortieDoneThisTurn=false;
  gs.kengen={shingen:null,kenjou:null};
  // UIリセット
  ['sword','siege_w','med'].forEach(k=>{const e=document.getElementById('prod-'+k);if(e)e.textContent=0;});
  ['prod-smith-used','prod-pharm-used','prod-鉄-cost','prod-wood-cost','prod-herb-cost'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=0;});
  document.querySelectorAll('.kg-opt').forEach(b=>b.classList.remove('chosen'));
  const kr=document.getElementById('kg-result');if(kr)kr.textContent='';
  [0,1,2,3].forEach(i=>{const d=document.getElementById('lp-'+i);if(d)d.classList.remove('done');});
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('turn-num',gs.turn);set('season-txt',SEASONS[gs.season]);
  Object.keys(qtys).forEach(k=>delete qtys[k]);
  showToast('T'+gs.turn+'・'+SEASONS[gs.season]+'開始');
  updatePrinceBar();updateInvDisplay();updateTabLabels();
  autoSave();
  setPhase('letter');openLetterOverlay();
}

// ── 結果画面 ──
function buildResultScreen(){
  // メインログ
  const log=document.getElementById('result-log');
  if(log){
    const lines=[];
    lines.push({t:'── T'+gs.turn+' '+SEASONS[gs.season]+' 終了 ──',c:'log-accent'});
    if(gs.sortieDoneThisTurn){
      const k=PKEYS.find(k=>gs.sortied[k]);
      if(k)lines.push({t:'⚑ '+PNAMES[k]+'が出立し、マップに登場',c:'log-accent'});
    }
    const nextSeason=SEASONS[(gs.season+1)%4];
    lines.push({t:'次ターン：T'+(gs.turn+1)+'・'+nextSeason+'へ',c:'log-info'});
    log.innerHTML='';
    lines.forEach((l,i)=>{
      const d=document.createElement('div');d.className='log-line '+l.c;d.textContent=l.t;
      log.appendChild(d);setTimeout(()=>d.classList.add('show'),i*180);
    });
  }
  // 生産結果（今T生産指示 → inProdに移動済み）
  const prod=document.getElementById('result-prod');
  if(prod){
    let html='';
    if(gs.stock.sword>0||gs.stock.siege_w>0||gs.stock.med>0){
      html+=`<div style="color:var(--green)">✓ 完成品在庫：剣${gs.stock.sword}・衝車${gs.stock.siege_w}・回復薬${gs.stock.med}</div>`;
    }
    if(gs.inProd.sword>0)  html+=`<div>⚒ 剣★1 ×${gs.inProd.sword}　生産中（来T完成）</div>`;
    if(gs.inProd.siege_w>0)html+=`<div>⚒ 衝車★1 ×${gs.inProd.siege_w}　生産中（来T完成）</div>`;
    if(gs.inProd.med>0)    html+=`<div>🧪 回復薬★1 ×${gs.inProd.med}　生産中（来T完成）</div>`;
    prod.innerHTML=html||'<span style="color:var(--faded)">（生産指示なし）</span>';
  }
  // 輸送結果
  const trans=document.getElementById('result-trans');
  if(trans){
    let html='';
    PKEYS.forEach(key=>{
      if(gs.transport[key]&&gs.transport[key].done)html+=`<div>🚚 ${PNAMES[key]}（${PDIRS[key]}）へ輸送を出発</div>`;
    });
    PKEYS.forEach(key=>{
      if(gs.prepDone[key])html+=`<div style="color:var(--green)">📦 ${PNAMES[key]}へ準備品を手渡し済み</div>`;
    });
    trans.innerHTML=html||'<span style="color:var(--faded)">（輸送なし）</span>';
  }
  // 謁見結果
  const kng=document.getElementById('result-kengen');
  if(kng){
    const labels={鉄:'鉄増産',wood:'木材増産',food_mat:'兵糧増産',horse_find:'名馬探索',commend:'王子を褒める',
      potion:'回復薬を献上',gold100:'100両を献上',gold300:'300両を献上'};
    let html='';
    if(gs.kengen.shingen)html+=`<div>📜 進言：<b>${labels[gs.kengen.shingen]||gs.kengen.shingen}</b>　→ 次ターンより有効</div>`;
    if(gs.kengen.kenjou) html+=`<div>🎁 献上：<b>${labels[gs.kengen.kenjou]||gs.kengen.kenjou}</b>　→ 次ターンより有効</div>`;
    kng.innerHTML=html||'<span style="color:var(--faded)">（謁見なし）</span>';
  }
  // 信頼度
  const tlog=document.getElementById('trust-log');
  if(tlog){
    let html='<table style="width:100%;font-size:12px;border-collapse:collapse">';
    PKEYS.forEach(key=>{
      const t=gs.trust[key];
      const pct=Math.min(100,t);
      const status=gs.sortied[key]?'出立済み':gs.prepDone[key]&&t>=CFG.sortie_trust_threshold?'出立可能':gs.prepDone[key]?'準備完了':'準備中';
      const sc=gs.sortied[key]?'var(--green)':gs.prepDone[key]&&t>=CFG.sortie_trust_threshold?'var(--gold)':'var(--faded)';
      html+=`<tr style="border-bottom:1px dashed var(--dim)">
        <td style="padding:4px 0;font-family:'Noto Serif JP',serif;color:${PCOLORS[key]}">${PNAMES[key]}</td>
        <td>信頼度 <b>${t}</b>/100
          <span class="trust-bar-wrap"><span class="trust-bar-fill" style="width:${pct}%"></span></span></td>
        <td style="color:${sc};font-size:11px">${status}</td>
      </tr>`;
    });
    html+='</table>';
    tlog.innerHTML=html;
  }
  // 次ターンボタン
  const nb=document.getElementById('next-turn-btn');
  if(nb)nb.textContent='T'+(gs.turn+1)+'・'+SEASONS[(gs.season+1)%4]+'へ進む ▶';
}

// ── 上部バー ──
function updatePrinceBar(){
  PKEYS.forEach(key=>{
    const req=document.getElementById('pc-req-'+key);
    const sub=document.getElementById('pc-sub-'+key);
    const dlEl=document.getElementById('pc-dl-'+key);
    if(!req)return;
    const t=gs.trust[key];
    const q=CFG.prep_quests[key];
    if(gs.sortied[key]){
      req.textContent='出立済み・輸送中';
      if(sub)sub.textContent='ノード1・依頼受付中';
      const ord=CFG.orders[key];
      if(dlEl&&ord){
        const urg=ord.deadline<=6?'urg':'';
        dlEl.innerHTML=`<div class="pc-dl-badge ${urg}">納期<br><b>${ord.deadline}</b>T</div>`;
      }
    }else if(gs.prepDone[key]){
      req.textContent='準備完了　信頼度'+t+'/100';
      if(sub)sub.textContent=t>=CFG.sortie_trust_threshold?'出立可能！':'あと'+(CFG.sortie_trust_threshold-t)+'で出立可';
      if(dlEl)dlEl.innerHTML='';
    }else{
      req.textContent='準備：'+((q&&q.label)?q.label:((q&&q.item)?q.item:''))+(q&&q.qty!=null?('×'+q.qty):'');
      if(sub)sub.textContent='信頼度'+t+'/100';
      if(dlEl)dlEl.innerHTML='';
    }
  });
}

// ── 輸送UI更新 ──
function updateTransportUI(){
  PKEYS.forEach(key=>{
    const pp=document.getElementById('prep-panel-'+key);
    const nt=document.getElementById('normal-trans-'+key);
    const sa=document.getElementById('sortie-area-'+key);
    if(gs.sortied[key]){
      if(pp)pp.style.display='none';if(sa)sa.style.display='none';if(nt)nt.style.display='block';
    }else{
      if(pp)pp.style.display='block';if(nt)nt.style.display='none';
      if(sa)sa.style.display=gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold?'block':'none';
    }
    const hb=document.getElementById('hand-btn-'+key);
    if(hb&&gs.prepDone[key]){hb.textContent='✓ 手渡し済み';hb.className='hand-btn done';hb.disabled=true;}
    const si=document.getElementById('prep-stock-'+key);
    if(si&&!gs.prepDone[key]){const q=CFG.prep_quests[key];si.innerHTML=`現庫: <b>${getAvailForPrep(key)}</b>　必要: ${q.qty}`;}
    const qel=document.getElementById('prep-qty-'+key);if(qel)qel.textContent=0;
    checkSortieConditions();
  });
}

// ── マップ ──
function showMapCard(key){
  const card=document.getElementById('map-card');
  document.getElementById('mc-title').textContent=PNAMES[key]+'（'+PDIRS[key]+'）';
  document.getElementById('mc-title').style.color=PCOLORS[key];
  const t=gs.trust[key];
  document.getElementById('mc-body').innerHTML=
    (gs.sortied[key]?'<b>出立済み</b>・ノード1<br>':'<b>出立前</b>・準備中<br>')+
    `信頼度：${t}/100`;
  card.classList.add('on');
}
function toggleConvoy(el){
  const isOpen=el.classList.contains('open');
  document.querySelectorAll('.convoy-wrap').forEach(c=>c.classList.remove('open'));
  if(!isOpen)el.classList.add('open');
}

// ── 共通 ──
function updateHeaderDisplay(){
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('h-gold',gs.gold);set('h-iron',gs.inv.iron);set('h-wood',gs.inv.wood);
  set('h-niter',gs.inv.niter);set('h-herb',gs.inv.herb);set('h-food',gs.inv.food);
}
function updateInvDisplay(){
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  // iron key is 'iron' (not 鉄) — blank market stock was from gs.inv.鉄
  set('inv-iron',gs.inv.iron);set('inv-wood',gs.inv.wood);set('inv-niter',gs.inv.niter);
  set('inv-herb',gs.inv.herb);set('inv-food',gs.inv.food);set('inv-med',gs.stock.med);
  set('stk-sword',gs.stock.sword);set('stk-siege_w',gs.stock.siege_w);set('stk-med',gs.stock.med);
  set('inp-sword',gs.inProd.sword);set('inp-siege_w',gs.inProd.siege_w);set('inp-med',gs.inProd.med);
}
let toastTm;
function showToast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('on');
  clearTimeout(toastTm);toastTm=setTimeout(()=>t.classList.remove('on'),2200);
}

// ── セーブ／ロード（localStorage） ──
const SAVE_VERSION=1;
const SAVE_SLOTS=[1,2,3];
const SAVE_AUTO_KEY='mou_isso_auto';
let saveModalMode='save';

function slotKey(n){return 'mou_isso_slot'+n;}
function deepClone(o){return JSON.parse(JSON.stringify(o));}
function buildSavePayload(label){
  return {
    version:SAVE_VERSION,
    savedAt:new Date().toISOString(),
    label:label||'',
    gs:deepClone(gs),
    qtys:deepClone(qtys),
  };
}
function readSlot(key){
  try{
    const raw=localStorage.getItem(key);
    if(!raw)return null;
    const data=JSON.parse(raw);
    if(!data||typeof data!=='object'||!data.gs)return null;
    return data;
  }catch(e){return null;}
}
function writeSlot(key,data){
  try{
    localStorage.setItem(key,JSON.stringify(data));
    return true;
  }catch(e){
    showToast('セーブに失敗しました（容量不足など）');
    return false;
  }
}
function formatSaveMeta(data){
  if(!data||!data.gs)return '';
  const g=data.gs;
  const season=SEASONS[g.season]||'?';
  const sortied=PKEYS.filter(k=>g.sortied&&g.sortied[k]).length;
  const when=data.savedAt?new Date(data.savedAt).toLocaleString('ja-JP'):'日時不明';
  return when+'\nT'+g.turn+'・'+season+'　金'+g.gold+'両　出立'+sortied+'/4　phase:'+(g.phase||'?');
}
function openSaveModal(mode){
  saveModalMode=mode;
  const ov=document.getElementById('save-overlay');
  const title=document.getElementById('save-modal-title');
  const note=document.getElementById('save-mode-note');
  if(title)title.textContent=mode==='save'?'セーブ':'ロード';
  if(note)note.textContent=mode==='save'
    ?'スロットを選んで現在の進行状況をセーブします（上書き可）。'
    :'スロットを選んで進行状況を復元します。いまの未セーブの進行は失われます。';
  hideImportArea();
  renderSaveSlots();
  if(ov)ov.classList.add('on');
}
function closeSaveModal(){
  const ov=document.getElementById('save-overlay');
  if(ov)ov.classList.remove('on');
  hideImportArea();
}
function renderSaveSlots(){
  const list=document.getElementById('save-slot-list');
  if(!list)return;
  let html='';
  const entries=[];
  SAVE_SLOTS.forEach(n=>entries.push({key:slotKey(n),title:'スロット '+n,n}));
  if(saveModalMode==='load')entries.push({key:SAVE_AUTO_KEY,title:'自動セーブ',n:null});
  entries.forEach(ent=>{
    const data=readSlot(ent.key);
    const empty=!data;
    const meta=empty?'':formatSaveMeta(data);
    if(saveModalMode==='save'&&ent.n!=null){
      html+='<button type="button" class="save-slot'+(empty?' empty':'')+'" onclick="saveToSlot('+ent.n+')">'
        +'<div class="save-slot-title">'+ent.title+'</div>'
        +(empty?'<div class="save-slot-empty">（空き）</div>':'<div class="save-slot-meta">'+meta.replace(/\n/g,'<br>')+'</div>')
        +'</button>';
    }else if(saveModalMode==='load'){
      if(empty){
        html+='<button type="button" class="save-slot empty" disabled style="cursor:default;opacity:.5">'
          +'<div class="save-slot-title">'+ent.title+'</div>'
          +'<div class="save-slot-empty">（データなし）</div></button>';
      }else{
        html+='<button type="button" class="save-slot" onclick="loadFromSlot(\''+ent.key+'\')">'
          +'<div class="save-slot-title">'+ent.title+'</div>'
          +'<div class="save-slot-meta">'+meta.replace(/\n/g,'<br>')+'</div></button>';
      }
    }
  });
  list.innerHTML=html;
}
function saveToSlot(n){
  const key=slotKey(n);
  const existing=readSlot(key);
  if(existing&&!confirm('スロット '+n+' に上書きセーブしますか？'))return;
  const payload=buildSavePayload('Slot '+n);
  if(writeSlot(key,payload)){
    showToast('スロット '+n+' にセーブしました');
    closeSaveModal();
  }
}
function autoSave(){
  const payload=buildSavePayload('auto');
  writeSlot(SAVE_AUTO_KEY,payload);
}
function loadFromSlot(key){
  const data=readSlot(key);
  if(!data){showToast('セーブデータがありません');return;}
  if(!confirm('このデータをロードしますか？\nいまの進行は失われます。'))return;
  applySaveData(data);
  closeSaveModal();
  showToast('ロードしました（T'+gs.turn+'・'+(SEASONS[gs.season]||'')+'）');
}
function applySaveData(data){
  if(!data||!data.gs){showToast('セーブデータが読み取れません');return false;}
  const loaded=deepClone(data.gs);
  Object.keys(gs).forEach(k=>delete gs[k]);
  Object.assign(gs,loaded);
  gs.inv=gs.inv||{iron:0,wood:0,niter:0,herb:0,food:0};
  gs.stock=gs.stock||{sword:0,siege_w:0,med:0};
  gs.inProd=gs.inProd||{sword:0,siege_w:0,med:0};
  gs.prod=gs.prod||{sword:0,siege_w:0,med:0};
  gs.buy=gs.buy||{};
  gs.sellQ=gs.sellQ||{};
  gs.transport=gs.transport||{};
  gs.choices=gs.choices||{};
  gs.kengen=gs.kengen||{shingen:null,kenjou:null};
  gs.trust=gs.trust||{food:0,horse:0,siege:0,weapon:0};
  gs.prepDone=gs.prepDone||{food:false,horse:false,siege:false,weapon:false};
  gs.sortied=gs.sortied||{food:false,horse:false,siege:false,weapon:false};
  gs.prepQty=gs.prepQty||{food:0,horse:0,siege:0,weapon:0};
  if(gs.sortieDoneThisTurn===undefined)gs.sortieDoneThisTurn=false;
  if(!gs.phase)gs.phase='letter';
  Object.keys(qtys).forEach(k=>delete qtys[k]);
  Object.assign(qtys,deepClone(data.qtys||{}));
  refreshAllUIFromGs();
  return true;
}
function refreshAllUIFromGs(){
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('turn-num',gs.turn);set('season-txt',SEASONS[gs.season]||'');
  PKEYS.forEach(key=>{
    document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(el=>{
      el.style.display=gs.sortied[key]?'':'none';
    });
  });
  ['sword','siege_w','med'].forEach(k=>set('prod-'+k,gs.prod[k]||0));
  set('prod-smith-used',(gs.prod.sword||0)+(gs.prod.siege_w||0));
  set('prod-pharm-used',gs.prod.med||0);
  set('prod-iron-cost',gs.prod.sword||0);
  set('prod-wood-cost',(gs.prod.siege_w||0)*2);
  set('prod-herb-cost',gs.prod.med||0);
  Object.keys(CFG.prices||{}).forEach(r=>{
    set('buy-'+r,gs.buy[r]||0);
    set('sell-'+r,gs.sellQ[r]||0);
  });
  updateTradeTotals();
  document.querySelectorAll('.kg-opt').forEach(b=>b.classList.remove('chosen'));
  const kgSel=document.getElementById('kg-commend-sel');
  if(kgSel)kgSel.classList.remove('show');
  ['shingen','kenjou'].forEach(type=>{
    const val=gs.kengen[type];
    if(!val)return;
    const box=document.getElementById('kg-'+type);
    if(!box)return;
    box.querySelectorAll('.kg-opt').forEach(btn=>{
      const m=btn.getAttribute('onclick')||'';
      if(m.indexOf("'"+val+"'")>=0||m.indexOf('"'+val+'"')>=0)btn.classList.add('chosen');
    });
    if(type==='shingen'&&val==='commend'&&kgSel)kgSel.classList.add('show');
  });
  const labels={鉄:'鉄増産',wood:'木材増産',food_mat:'兵糧増産',horse_find:'名馬探索',commend:'王子を褒める',
    potion:'回復薬を献上',gold100:'100両を献上',gold300:'300両を献上'};
  const kr=document.getElementById('kg-result');
  if(kr)kr.textContent=
    (gs.kengen.shingen?'進言：'+(labels[gs.kengen.shingen]||gs.kengen.shingen)+'　':'')+
    (gs.kengen.kenjou?'献上：'+(labels[gs.kengen.kenjou]||gs.kengen.kenjou):'');
  const dotMap={food:0,horse:1,siege:2,weapon:3};
  PKEYS.forEach(key=>{
    const d=document.getElementById('lp-'+dotMap[key]);
    if(d)d.classList.toggle('done',gs.choices[key]!==undefined);
  });
  Object.keys(qtys).forEach(k=>{
    const parts=k.split('_');
    if(parts.length<2)return;
    const prince=parts[0];
    const item=parts.slice(1).join('_');
    const el=document.getElementById('qty-'+prince+'-'+item);
    if(el)el.textContent=qtys[k]||0;
  });
  PKEYS.forEach(key=>{
    const t=gs.transport[key];
    const meansRow=document.getElementById('means-'+key);
    if(meansRow){
      meansRow.querySelectorAll('.means-btn').forEach(b=>{
        b.classList.remove('active');
        if(t&&t.means){
          const m=b.getAttribute('onclick')||'';
          if(m.indexOf("'"+t.means+"'")>=0)b.classList.add('active');
        }
      });
    }
    const go=document.getElementById('go-'+key);
    if(go){
      if(t&&t.done){
        go.textContent='✓ 出発済み';go.className='go-btn done-btn';go.disabled=true;
      }else{
        go.textContent='Go → 出発';go.className='go-btn';go.disabled=!(t&&t.means);
      }
    }
    const pqty=gs.prepQty[key]||0;
    const pqEl=document.getElementById('prep-qty-'+key);
    if(pqEl)pqEl.textContent=pqty;
    const hb=document.getElementById('hand-btn-'+key);
    const pi=document.getElementById('prep-info-'+key);
    if(gs.prepDone[key]){
      if(hb){hb.textContent='✓ 手渡し済み';hb.className='hand-btn done';hb.disabled=true;}
      if(pi)pi.textContent='✓ 準備依頼を完了しました！';
    }else{
      if(hb){hb.textContent='手渡しする';hb.className='hand-btn';hb.disabled=(pqty===0);}
      if(pi){
        const q=CFG.prep_quests[key];
        pi.textContent='準備品を手渡すと信頼度が上がります（+'+q.trust_reward+'）';
      }
    }
    const sa=document.getElementById('sortie-area-'+key);
    const sbtn=document.getElementById('sortie-btn-'+key);
    const sdone=document.getElementById('sortie-done-'+key);
    if(gs.sortied[key]){
      if(sa)sa.style.display='block';
      if(sbtn)sbtn.style.display='none';
      if(sdone)sdone.style.display='block';
    }else{
      if(sdone)sdone.style.display='none';
    }
  });
  updateHeaderDisplay();
  updateInvDisplay();
  updateStockBar();
  updatePrinceBar();
  updateTabLabels();
  updateTransportUI();
  checkSortieConditions();
  renderAllLetters();
  checkLettersDone();
  const phase=gs.phase||'letter';
  setPhase(phase);
  if(phase==='letter')openLetterOverlay();
  else closeOverlay();
}
async function exportSave(){
  const payload=buildSavePayload('export');
  const text=JSON.stringify(payload,null,2);
  try{
    if(navigator.clipboard&&navigator.clipboard.writeText){
      await navigator.clipboard.writeText(text);
      showToast('セーブデータをコピーしました');
      return;
    }
  }catch(e){}
  showImportArea();
  const ta=document.getElementById('save-import-ta');
  if(ta){ta.value=text;ta.select();}
  showToast('コピーできなかったので下に表示しました');
}
function showImportArea(){
  const a=document.getElementById('save-import-area');
  if(a)a.classList.add('show');
  const ta=document.getElementById('save-import-ta');
  if(ta&&saveModalMode==='load')ta.value='';
}
function hideImportArea(){
  const a=document.getElementById('save-import-area');
  if(a)a.classList.remove('show');
}
function importSave(){
  const ta=document.getElementById('save-import-ta');
  if(!ta)return;
  let data;
  try{data=JSON.parse(ta.value.trim());}
  catch(e){showToast('貼り付けたデータが読み取れません');return;}
  if(!data||!data.gs){showToast('セーブデータとして使えません');return;}
  if(!confirm('貼り付けたデータで復元しますか？'))return;
  if(applySaveData(data)){
    closeSaveModal();
    showToast('データを読み込んでロードしました');
  }
}




// ═══ External data merge + letter/order/node system ═══
(function mergeGameData(){
  if(typeof GAME_DATA==='undefined'||!GAME_DATA)return;
  if(GAME_DATA.prices)CFG.prices=GAME_DATA.prices;
  if(GAME_DATA.prep_quests)CFG.prep_quests=GAME_DATA.prep_quests;
  if(GAME_DATA.orders)CFG.orders=GAME_DATA.orders;
  if(GAME_DATA.node_orders)CFG.node_orders=GAME_DATA.node_orders;
  if(GAME_DATA.letters)CFG.letterPool=GAME_DATA.letters;
  if(GAME_DATA.remind_after_turns!=null)CFG.remind_after_turns=GAME_DATA.remind_after_turns;
})();
if(!CFG.node_orders)CFG.node_orders={};
if(!CFG.letterPool)CFG.letterPool=CFG.letters||{};
if(CFG.remind_after_turns==null)CFG.remind_after_turns=3;

// extend gs
gs.node={food:0,horse:0,siege:0,weapon:0};
gs.order={food:null,horse:null,siege:null,weapon:null};
gs.orderMissTurns={food:0,horse:0,siege:0,weapon:0};
gs.letterFlags={used:{},serial:{},justEntered:{food:false,horse:false,siege:false,weapon:false}};
gs.activeLetter={};

function emptyOrderMap(){return {food:null,horse:null,siege:null,weapon:null};}
function emptyNumMap(){return {food:0,horse:0,siege:0,weapon:0};}
function emptyBoolMap(){return {food:false,horse:false,siege:false,weapon:false};}

function getNodeOrder(key,node){
  const tree=CFG.node_orders&&CFG.node_orders[key];
  if(!tree)return null;
  return tree[String(node)]||tree[node]||null;
}
function setOrderForNode(key,node){
  const od=getNodeOrder(key,node);
  if(!od){gs.order[key]=null;return;}
  gs.order[key]={
    label:od.label,
    items:(od.items||[]).map(it=>({...it})),
    deadline:od.deadline,
    deadlineMax:od.deadline,
    carts:od.carts||1,
    node:node
  };
  gs.orderMissTurns[key]=0;
}
function orderLabel(key){
  return (gs.order[key]&&gs.order[key].label)||(CFG.orders[key]&&CFG.orders[key].item_label)||'—';
}
function fillTemplate(s,key){
  if(!s)return '';
  const od=gs.order[key]||{};
  return String(s)
    .replace(/\{\{order_label\}\}/g,od.label||orderLabel(key))
    .replace(/\{\{deadline\}\}/g,String(od.deadline!=null?od.deadline:(CFG.orders[key]&&CFG.orders[key].deadline)||'?'))
    .replace(/\{\{node\}\}/g,String(gs.node[key]||0));
}

function matchWhen(when,key){
  if(!when)return true;
  const node=gs.node[key]||0;
  const trust=gs.trust[key]||0;
  const miss=gs.orderMissTurns[key]||0;
  if(when.node!=null&&node!==when.node)return false;
  if(when.node_gte!=null&&node<when.node_gte)return false;
  if(when.node_lte!=null&&node>when.node_lte)return false;
  if(when.trust_gte!=null&&trust<when.trust_gte)return false;
  if(when.trust_lt!=null&&trust>=when.trust_lt)return false;
  if(when.miss_turns_gte!=null&&miss<when.miss_turns_gte)return false;
  if(when.on_node_enter&&!gs.letterFlags.justEntered[key])return false;
  if(when.once&&gs.letterFlags.used[when._id||''])return false;
  if(when.serial!=null){
    const step=gs.letterFlags.serial[when.serial]||0;
    if(step!==(when.step||0))return false;
  }
  if(when.fallback)return true;
  return true;
}

function pickLetterEntry(key,kind){
  const pool=(CFG.letterPool[key]&&CFG.letterPool[key][kind])||[];
  const candidates=[];
  for(const raw of pool){
    const e={...raw,when:{...(raw.when||{})}};
    e.when._id=e.id;
    if(e.when.once&&gs.letterFlags.used[e.id])continue;
    // fallback only if nothing else — handle later
    if(e.when.fallback)continue;
    if(!matchWhen(e.when,key))continue;
    candidates.push(e);
  }
  candidates.sort((a,b)=>(b.priority||0)-(a.priority||0));
  if(candidates.length)return candidates[0];
  // fallback
  for(const raw of pool){
    if(raw.when&&raw.when.fallback)return raw;
  }
  // legacy CFG.letters
  const leg=CFG.letters&&CFG.letters[key];
  if(leg){
    const block=gs.sortied[key]?leg.sortied:leg.prep;
    if(kind==='demand')return {id:'legacy_d',body:block.demand_body,priority:1};
    return {id:'legacy_p',intro:block.personal_intro,body:block.personal_body,choices:block.choices,priority:1};
  }
  return null;
}

function consumeLetterFlags(key,entry){
  if(!entry)return;
  if(entry.when&&entry.when.once&&entry.id)gs.letterFlags.used[entry.id]=true;
  if(entry.id)gs.letterFlags.used[entry.id]=true;
  if(entry.when&&entry.when.serial!=null){
    const s=entry.when.serial;
    gs.letterFlags.serial[s]=(gs.letterFlags.serial[s]||0)+1;
  }
  // clear justEntered after personal+demand rendered for this turn open
}

function getLetterBundle(key){
  const demand=pickLetterEntry(key,'demand');
  const personal=pickLetterEntry(key,'personal');
  return {
    demand_body:fillTemplate((demand&&(demand.body||demand.demand_body))||'',key),
    personal_intro:(personal&&(personal.intro||personal.personal_intro))||'',
    personal_body:fillTemplate((personal&&(personal.body||personal.personal_body))||'',key),
    choices:(personal&&personal.choices)||[{icon:'📋',text:'「承知しました」',trust:1}],
    _demandId:demand&&demand.id,
    _personalId:personal&&personal.id,
    _demand:demand,
    _personal:personal
  };
}

// override getLetter / renderLetter
function getLetter(key){
  return getLetterBundle(key);
}
function renderLetter(key){
  const ld=getLetter(key);
  gs.activeLetter[key]={demandId:ld._demandId,personalId:ld._personalId,personal:ld._personal,demand:ld._demand};
  const node=gs.node[key]||0;
  const fromLabel=node>=1
    ? (PNAMES[key]+'（'+PDIRS[key]+'）ノード'+node+'より')
    : (PNAMES[key]+'（出立前・準備依頼）');
  const dem=document.getElementById('lt-'+key+'-demand');
  if(dem)dem.innerHTML='<div class="letter-block"><div class="letter-from">'+fromLabel+'</div><div class="letter-text">'+ld.demand_body+'</div></div>';
  const gm=document.getElementById('girl-msg-'+key);
  if(gm)gm.textContent=ld.personal_intro;
  const pb=document.getElementById('personal-body-'+key);
  if(pb)pb.innerHTML='<div class="letter-block"><div class="letter-text">'+ld.personal_body+'</div></div>';
  renderChoices(key,ld.choices);
}

function renderAllLetters(){
  PKEYS.forEach(key=>renderLetter(key));
  // after rendering, mark node-enter letters consumed for next turn (not mid-turn)
  updateTabLabels();
  checkLettersDone();
}

function markLettersConsumedForTurn(){
  PKEYS.forEach(key=>{
    const a=gs.activeLetter[key];
    if(!a)return;
    if(a.demand)consumeLetterFlags(key,a.demand);
    if(a.personal)consumeLetterFlags(key,a.personal);
    gs.letterFlags.justEntered[key]=false;
  });
}

// Letter phase complete: always enabled, confirm if incomplete
function checkLettersDone(){
  const btn=document.getElementById('ph-letter-complete');
  if(btn)btn.disabled=false;
}
function tryGoToMgmt(){
  const all=PKEYS.every(k=>gs.choices[k]!==undefined);
  if(!all){
    if(!confirm('すべての返信が終わっていませんが大丈夫ですか？'))return;
  }
  markLettersConsumedForTurn();
  goToMgmt();
}

// sortie: node 1 + order
function sortie(key){
  if(gs.sortieDoneThisTurn){showToast('このターンはすでに出立させています');return;}
  if(!gs.prepDone[key]||gs.trust[key]<CFG.sortie_trust_threshold)return;
  gs.sortied[key]=true;
  gs.sortieDoneThisTurn=true;
  gs.node[key]=1;
  gs.letterFlags.justEntered[key]=true;
  setOrderForNode(key,1);
  const btn=document.getElementById('sortie-btn-'+key);if(btn)btn.style.display='none';
  const done=document.getElementById('sortie-done-'+key);if(done)done.style.display='block';
  PKEYS.forEach(k=>{if(k!==key){const b=document.getElementById('sortie-btn-'+k);if(b)b.style.display='none';}});
  document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(el=>el.style.display='');
  showToast('⚑ '+PNAMES[key]+'が出立！ノード1へ');
  updatePrinceBar();updateTabLabels();updateTransportUI();
}

// patch updateTabLabels node text
const _updateTabLabelsOrig=typeof updateTabLabels==='function'?updateTabLabels:null;
function updateTabLabels(){
  PKEYS.forEach(key=>{
    const req=document.getElementById('ltab-req-'+key);
    const dl=document.getElementById('ltab-dl-'+key);
    const tab=document.getElementById('ptab-'+key);
    const chk=document.getElementById('tab-check-'+key);
    if(chk)chk.textContent=(gs.choices[key]!==undefined)?'☑ ':'';
    const t=gs.trust[key];
    const node=gs.node[key]||0;
    if(gs.sortied[key]||node>=1){
      if(req)req.textContent=orderLabel(key);
      if(dl)dl.textContent='ノード'+node;
      if(tab)tab.classList.remove('urg-tab');
    }else if(gs.prepDone[key]){
      if(req)req.textContent='準備完了';if(dl)dl.textContent='信頼'+t+'/100';
      if(tab)tab.classList.toggle('urg-tab',t>=CFG.sortie_trust_threshold);
    }else{
      const q=CFG.prep_quests[key];
      if(req)req.textContent='準備:'+((q&&q.label)?q.label:((q&&q.item)?q.item:''))+(q&&q.qty!=null?('×'+q.qty):'');
      if(dl)dl.textContent='信頼'+t+'/100';
    }
  });
  const ks=document.getElementById('kg-summary-tab');
  if(ks){
    const parts=[];
    if(gs.kengen.shingen)parts.push('進言✓');
    if(gs.kengen.kenjou)parts.push('献上✓');
    ks.textContent=parts.length?parts.join(' '):'進言/献上';
  }
}

function updatePrinceBar(){
  PKEYS.forEach(key=>{
    const req=document.getElementById('pc-req-'+key);
    const sub=document.getElementById('pc-sub-'+key);
    const dlEl=document.getElementById('pc-dl-'+key);
    if(!req)return;
    const t=gs.trust[key];
    const q=CFG.prep_quests[key];
    const node=gs.node[key]||0;
    if(gs.sortied[key]||node>=1){
      req.textContent=orderLabel(key);
      if(sub)sub.textContent='ノード'+node+'・依頼受付中';
      const od=gs.order[key];
      const deadline=od?od.deadline:(CFG.orders[key]&&CFG.orders[key].deadline);
      if(dlEl&&deadline!=null){
        const urg=deadline<=6?'urg':'';
        dlEl.innerHTML='<div class="pc-dl-badge '+urg+'">納期<br><b>'+deadline+'</b>T</div>';
      }
    }else if(gs.prepDone[key]){
      req.textContent='準備完了　信頼度'+t+'/100';
      if(sub)sub.textContent=t>=CFG.sortie_trust_threshold?'出立可能！':'あと'+(CFG.sortie_trust_threshold-t)+'で出立可';
      if(dlEl)dlEl.innerHTML='';
    }else{
      req.textContent='準備：'+((q&&q.label)?q.label:((q&&q.item)?q.item:''))+(q&&q.qty!=null?('×'+q.qty):'');
      if(sub)sub.textContent='信頼度'+t+'/100';
      if(dlEl)dlEl.innerHTML='';
    }
  });
}

function stockForItem(id){
  if(id==='food')return gs.inv.food;
  if(id==='sword')return gs.stock.sword;
  if(id==='siege_w')return gs.stock.siege_w;
  if(id==='med')return gs.stock.med;
  if(id==='crossbow2')return gs.stock.sword; // placeholder until crafted type exists
  return 0;
}

function updateTransportUI(){
  PKEYS.forEach(key=>{
    const pp=document.getElementById('prep-panel-'+key);
    const nt=document.getElementById('normal-trans-'+key);
    const sa=document.getElementById('sortie-area-'+key);
    const node=gs.node[key]||0;
    if(gs.sortied[key]||node>=1){
      if(pp)pp.style.display='none';if(sa)sa.style.display='none';if(nt)nt.style.display='block';
      // dynamic order summary
      let sum=document.getElementById('order-sum-'+key);
      if(nt&&!sum){
        sum=document.createElement('div');
        sum.id='order-sum-'+key;
        sum.className='tp-info';
        sum.style.marginBottom='8px';
        nt.insertBefore(sum,nt.firstChild);
      }
      if(sum){
        const od=gs.order[key];
        if(od){
          sum.innerHTML='<b>ノード'+node+' 依頼</b>：'+od.label+'　納期残 <b>'+od.deadline+'</b>T';
        }else sum.textContent='依頼なし';
      }
      // request remaining badge
      const reqEl=document.getElementById('ts-'+key+'-req');
      if(reqEl&&gs.order[key]&&gs.order[key].items&&gs.order[key].items[0]){
        reqEl.textContent=gs.order[key].items[0].qty;
      }
      const stk=document.getElementById('ts-'+key+'-stk');
      if(stk&&gs.order[key]&&gs.order[key].items&&gs.order[key].items[0]){
        stk.textContent=stockForItem(gs.order[key].items[0].id);
      }
      // rename item if weapon node1 uses sword
      if(key==='weapon'){
        const nameEl=nt&&nt.querySelector('.item-name');
        if(nameEl&&gs.order[key]&&gs.order[key].items&&gs.order[key].items[0]){
          nameEl.textContent=gs.order[key].items[0].label||'剣 ★1';
        }
      }
    }else{
      if(pp)pp.style.display='block';if(nt)nt.style.display='none';
      if(sa)sa.style.display=gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold?'block':'none';
    }
    const hb=document.getElementById('hand-btn-'+key);
    if(hb&&gs.prepDone[key]){hb.textContent='✓ 手渡し済み';hb.className='hand-btn done';hb.disabled=true;}
    const si=document.getElementById('prep-stock-'+key);
    if(si&&!gs.prepDone[key]){const q=CFG.prep_quests[key];si.innerHTML='現庫: <b>'+getAvailForPrep(key)+'</b>　必要: '+q.qty;}
    const qel=document.getElementById('prep-qty-'+key);if(qel)qel.textContent=gs.prepQty[key]||0;
    checkSortieConditions();
  });
}

// goToNextTurn: tick deadlines + miss turns (assignment to avoid hoist bugs)
var __goToNextTurnBase=goToNextTurn;
goToNextTurn=function(){
  PKEYS.forEach(key=>{
    if((gs.node[key]||0)>=1&&gs.order[key]){
      if(gs.order[key].deadline>0)gs.order[key].deadline--;
      const tr=gs.transport[key];
      if(!(tr&&tr.done))gs.orderMissTurns[key]=(gs.orderMissTurns[key]||0)+1;
      else gs.orderMissTurns[key]=0;
    }
  });
  __goToNextTurnBase();
  if(!gs.node)gs.node=emptyNumMap();
  if(!gs.order)gs.order=emptyOrderMap();
  if(!gs.orderMissTurns)gs.orderMissTurns=emptyNumMap();
  if(!gs.letterFlags)gs.letterFlags={used:{},serial:{},justEntered:emptyBoolMap()};
  if(!gs.activeLetter)gs.activeLetter={};
  if(!gs.letterFlags.justEntered)gs.letterFlags.justEntered=emptyBoolMap();
  /* justEntered clear deferred */ PKEYS.forEach(key=>{});
  updatePrinceBar();updateTabLabels();
};

// applySaveData field defaults
var __applySaveDataBase=applySaveData;
applySaveData=function(data){
  const ok=__applySaveDataBase(data);
  gs.node=gs.node||emptyNumMap();
  gs.order=gs.order||emptyOrderMap();
  gs.orderMissTurns=gs.orderMissTurns||emptyNumMap();
  gs.letterFlags=gs.letterFlags||{used:{},serial:{},justEntered:emptyBoolMap()};
  if(!gs.letterFlags.used)gs.letterFlags.used={};
  if(!gs.letterFlags.serial)gs.letterFlags.serial={};
  if(!gs.letterFlags.justEntered)gs.letterFlags.justEntered=emptyBoolMap();
  gs.activeLetter=gs.activeLetter||{};
  PKEYS.forEach(key=>{
    if(gs.sortied[key]&&!(gs.node[key]>0)){
      gs.node[key]=1;
      if(!gs.order[key])setOrderForNode(key,1);
    }
  });
  updatePrinceBar();updateTabLabels();updateTransportUI();
  return ok;
};

// market stock display for food_mat id + force iron from gs.inv.iron
var __updateInvDisplayBase=updateInvDisplay;
updateInvDisplay=function(){
  __updateInvDisplayBase();
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('inv-food_mat',gs.inv.food);
  set('inv-iron', gs.inv.iron!=null?gs.inv.iron:0);
};

// override function declarations that were defined earlier in the same script
getLetter=getLetter;
// re-bind critical overrides as assignments after function declarations above
var __renderLetterImpl=renderLetter;
var __renderAllLettersImpl=renderAllLetters;
var __sortieImpl=sortie;
var __updateTabLabelsImpl=updateTabLabels;
var __updatePrinceBarImpl=updatePrinceBar;
var __updateTransportUIImpl=updateTransportUI;
var __checkLettersDoneImpl=checkLettersDone;
// function declarations already overwrote globals; ensure names exist

// wire letter complete button on DOM ready (override onclick)
document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.getElementById('ph-letter-complete');
  if(btn){
    btn.disabled=false;
    btn.setAttribute('onclick','tryGoToMgmt()');
  }
});



// ═══ Transport/Node fix (safe addon) ═══
// v3 bugfix: build_cells ETA, convoy HTML popup, phase hide, sortie-turn lock
(function(){
'use strict';
var UI_STRINGS = Object.assign({}, window.UI_STRINGS||{});
if(typeof CONVOY_ICON_SIZE==='undefined') var CONVOY_ICON_SIZE=56;
var ROUTE_COLOR={weapon:'#a63a2c',siege:'#5a4a7d',horse:'#41756c',food:'#a07417'};
var MEANS_SPEED={jinput:1, cart:1, boat:3, horse:2, wagon:2}; // マス/T
var MEANS_CAP={jinput:1, cart:2, boat:4, horse:2, wagon:4};
var MEANS_LABEL={jinput:'人足', cart:'荷車', boat:'船', horse:'馬', wagon:'馬車'};

function S(key, fb){ return (UI_STRINGS&&UI_STRINGS[key])||fb||key; }

function ensureState(){
  if(!gs.node)gs.node={food:0,horse:0,siege:0,weapon:0};
  if(!gs.order)gs.order={food:null,horse:null,siege:null,weapon:null};
  if(!gs.orderMissTurns)gs.orderMissTurns={food:0,horse:0,siege:0,weapon:0};
  if(!gs.orderLocked)gs.orderLocked={food:false,horse:false,siege:false,weapon:false};
  if(!gs.cleared)gs.cleared={food:[],horse:[],siege:[],weapon:[]};
  if(!gs.convoys)gs.convoys=[];
  if(gs.ranchHorses==null)gs.ranchHorses=0;
  if(!gs.sortieAvailableTurn)gs.sortieAvailableTurn={food:null,horse:null,siege:null,weapon:null};
  if(!gs.sortieTurn)gs.sortieTurn={food:null,horse:null,siege:null,weapon:null};
  if(!gs.letterFlags)gs.letterFlags={used:{},serial:{},justEntered:{food:false,horse:false,siege:false,weapon:false}};
  if(!gs.letterFlags.justEntered)gs.letterFlags.justEntered={food:false,horse:false,siege:false,weapon:false};
  if(!gs.tech)gs.tech={};
  if(gs.portersMax==null)gs.portersMax=4;
}
ensureState();

function isMeansUnlocked(m){
  ensureState();
  if(m==='jinput')return true;
  if(m==='cart')return (gs.cleared.food||[]).indexOf(1)>=0;
  if(m==='boat')return (gs.cleared.food||[]).indexOf(2)>=0;
  if(m==='horse')return (gs.ranchHorses||0)>0;
  if(m==='wagon')return (gs.cleared.horse||[]).indexOf(2)>=0 && isMeansUnlocked('cart') && (gs.ranchHorses||0)>0;
  return false;
}
function meansUnlockHint(m){
  if(m==='cart')return S('means_locked_cart','兵糧ルート ノード1撃破で解禁');
  if(m==='boat')return S('means_locked_boat','兵糧ルート ノード2撃破で解禁');
  if(m==='horse')return S('means_locked_horse','牧場で馬を所有すると解禁');
  if(m==='wagon')return S('means_locked_wagon','馬ルート ノード2撃破＋荷車＋馬で解禁');
  return '';
}
function portersBusy(){
  ensureState();
  var n=0;
  (gs.convoys||[]).forEach(function(cv){
    if(cv.means!=='jinput')return;
    if(cv.porters!=null) n+=cv.porters;
    else n+=(cv.cargo||[]).reduce(function(s,c){return s+(c.qty||0);},0);
  });
  return n;
}
function portersFree(){
  ensureState();
  var max=gs.portersMax!=null?gs.portersMax:4;
  return Math.max(0,max-portersBusy());
}
/** 今回の出発で使える積載上限 */
function meansCap(means){
  if(means==='jinput') return portersFree(); // 1人=1荷、空き人数が上限
  return MEANS_CAP[means]||1;
}


function getNodeOrderDef(key,node){
  var tree=(CFG.node_orders&&CFG.node_orders[key])||(typeof GAME_DATA!=='undefined'&&GAME_DATA.node_orders&&GAME_DATA.node_orders[key]);
  if(!tree)return null;
  return tree[String(node)]||null;
}
function setOrderForNode(key,node,force){
  ensureState();
  if(!force&&gs.orderLocked[key]&&gs.order[key]&&gs.order[key].node===node)return;
  var od=getNodeOrderDef(key,node);
  if(!od){gs.order[key]=null;gs.orderLocked[key]=false;return;}
  gs.order[key]={
    label:od.label,
    items:(od.items||[]).map(function(it){return {id:it.id,label:it.label,qty:it.qty,delivered:0};}),
    deadline:od.deadline,
    deadlineMax:od.deadline,
    node:node
  };
  gs.orderMissTurns[key]=0;
  gs.orderLocked[key]=true;
}
function orderLabel(key){
  return (gs.order[key]&&gs.order[key].label)||((CFG.orders&&CFG.orders[key]&&CFG.orders[key].item_label)||'—');
}

/** 首都→ノード(1-based)のマス数 = build_cells の node cell.no */
function masToTarget(route, node1){
  if(typeof masToNode==='function') return masToNode(route, node1);
  return 2;
}
function speedOf(means){ return MEANS_SPEED[means]||1; }
function etaFor(route, node1, means){
  var mas=masToTarget(route, node1||1);
  var sp=speedOf(means);
  return Math.max(1, Math.ceil(mas/sp));
}

// --- pieces ---
function positionPieceAtNode(key){
  ensureState();
  var node=gs.node[key]||0;
  var piece=document.querySelector('.piece[data-route="'+key+'"]');
  if(!piece)return;
  if(node<1){piece.style.display='none';return;}
  piece.style.display='';
  var list=(typeof MAP_CELLS!=='undefined'&&MAP_CELLS.cells[key])||[];
  var c=list.find(function(x){return x.node&&x.nidx===node-1;});
  if(!c)return;
  var w=parseFloat(piece.getAttribute('width')||135);
  piece.setAttribute('x',String(c.x-w/2));
  piece.setAttribute('y',String(c.y-w*0.72));
}
function positionAllPieces(){PKEYS.forEach(positionPieceAtNode);}

// --- node visuals ---
function refreshMapNodes(){
  ensureState();
  document.querySelectorAll('g.node').forEach(function(g){
    var route=g.getAttribute('data-route');
    var idx=parseInt(g.getAttribute('data-idx'),10);
    if(!route||isNaN(idx))return;
    if(g.querySelector('image'))return;
    var list=(typeof MAP_CELLS!=='undefined'&&MAP_CELLS.cells[route])||[];
    var cell=list.find(function(x){return x.node&&x.nidx===idx;});
    var cx=cell?cell.x:0, cy=cell?cell.y:0;
    var color=ROUTE_COLOR[route]||'#888';
    var cur=gs.node[route]||0;
    var curIdx=cur>=1?cur-1:-1;
    var cleared=(gs.cleared[route]||[]).indexOf(idx+1)>=0;
    var isCurrent=curIdx===idx;
    var num=String(idx+1);
    var html='';
    if(isCurrent){
      html='<circle cx="'+cx+'" cy="'+cy+'" r="57" fill="none" stroke="'+color+'" stroke-width="6" opacity="0.9"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="43" fill="#efe4c8" stroke="#2f2619" stroke-width="3.5"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="38" fill="none" stroke="'+color+'" stroke-width="6" opacity="0.95"/>'+
        '<text x="'+cx+'" y="'+(cy+13)+'" text-anchor="middle" font-size="38" font-weight="bold" fill="#4a3b26">'+num+'</text>';
    }else if(cleared){
      html='<circle cx="'+cx+'" cy="'+cy+'" r="43" fill="'+color+'" stroke="#2f2619" stroke-width="3.5"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="38" fill="none" stroke="#e8dcc0" stroke-width="6" opacity="0.95"/>'+
        '<text x="'+cx+'" y="'+(cy+13)+'" text-anchor="middle" font-size="34" font-weight="bold" fill="#efe4c8">✓</text>';
    }else{
      html='<circle cx="'+cx+'" cy="'+cy+'" r="43" fill="#efe4c8" stroke="#2f2619" stroke-width="3.5"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="38" fill="none" stroke="'+color+'" stroke-width="6" opacity="0.95"/>'+
        '<circle cx="'+cx+'" cy="'+cy+'" r="29" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-dasharray="7 8" opacity="0.85"/>'+
        '<text x="'+cx+'" y="'+(cy+13)+'" text-anchor="middle" font-size="38" font-weight="bold" fill="#4a3b26">'+num+'</text>';
    }
    g.innerHTML=html;
  });
}

function stockOf(id){
  if(id==='food')return gs.inv.food||0;
  if(id==='sword')return gs.stock.sword||0;
  if(id==='siege_w')return gs.stock.siege_w||0;
  if(id==='med')return gs.stock.med||0;
  if(id==='horse')return gs.ranchHorses||0;
  if(id==='crossbow2')return 0; // 未解禁の代替在庫なし（表示0）
  return 0;
}
function takeStock(id,q){
  if(id==='food')gs.inv.food=Math.max(0,(gs.inv.food||0)-q);
  else if(id==='sword')gs.stock.sword=Math.max(0,(gs.stock.sword||0)-q);
  else if(id==='siege_w')gs.stock.siege_w=Math.max(0,(gs.stock.siege_w||0)-q);
  else if(id==='med')gs.stock.med=Math.max(0,(gs.stock.med||0)-q);
  else if(id==='horse')gs.ranchHorses=Math.max(0,(gs.ranchHorses||0)-q);
}

function canTransportThisTurn(key){
  ensureState();
  if((gs.node[key]||0)<1)return false;
  // 出立したターンは送れない
  if(gs.sortieTurn[key]!=null && gs.turn<=gs.sortieTurn[key])return false;
  return true;
}

function rebuildMeans(key){
  var nt=document.getElementById('normal-trans-'+key); if(!nt)return;
  var row=document.getElementById('means-'+key);
  if(!row){ row=document.createElement('div'); row.id='means-'+key; row.className='means-row'; nt.insertBefore(row, nt.firstChild); }
  var list=[
    {id:'jinput',t:'人足（空き'+portersFree()+'/'+(gs.portersMax||4)+'・各1荷）'},
    {id:'cart',t:'荷車（積載2）'},
    {id:'boat',t:'船（積載4）'},
    {id:'horse',t:'馬（積載2）'},
    {id:'wagon',t:'馬車（積載4）'}
  ];
  var html='';
  list.forEach(function(o){
    if(isMeansUnlocked(o.id)){
      html+='<button type="button" class="means-btn" onclick="selectMeans(\''+key+'\',\''+o.id+'\',this)">'+o.t+'</button>';
    }else{
      html+='<button type="button" class="means-btn" disabled title="'+meansUnlockHint(o.id)+'" style="opacity:.4">'+o.t+'🔒</button>';
    }
  });
  row.innerHTML=html;
  if(!document.getElementById('tinfo-'+key)){
    var info=document.createElement('div'); info.className='tp-info'; info.id='tinfo-'+key;
    info.textContent='輸送手段を選択（初期は人足のみ）';
    nt.appendChild(info);
  }
  if(!document.getElementById('go-'+key)){
    var go=document.createElement('button');
    go.className='go-btn'; go.id='go-'+key; go.disabled=true;
    go.textContent='Go → 出発';
    go.onclick=function(){goTransport(key);};
    nt.appendChild(go);
  }
  var cur=gs.transport[key]&&gs.transport[key].means;
  if(cur){
    row.querySelectorAll('.means-btn:not([disabled])').forEach(function(b){
      if((b.getAttribute('onclick')||'').indexOf("'"+cur+"'")>=0)b.classList.add('active');
    });
  }
}

selectMeans=function(prince,means,btn){
  if(!isMeansUnlocked(means)){showToast(meansUnlockHint(means)||'未解禁');return;}
  if(!canTransportThisTurn(prince)){showToast(S('transport_after_sortie_hint','出立したターンは輸送できません'));return;}
  gs.transport[prince]=gs.transport[prince]||{};
  gs.transport[prince].means=means;
  document.querySelectorAll('#means-'+prince+' .means-btn').forEach(function(b){b.classList.remove('active');});
  if(btn)btn.classList.add('active');
  var node=gs.node[prince]||1;
  var eta=etaFor(prince,node,means);
  var cap=meansCap(means);
  var ti=document.getElementById('tinfo-'+prince);
  if(ti){
    var extra=(means==='jinput')?(' 空き'+portersFree()+'/'+(gs.portersMax||4)+'人'):'';
    ti.textContent=(MEANS_LABEL[means]||means)+' 上限'+cap+extra+'　あと'+eta+'T（ノード'+node+'）';
  }
  var go=document.getElementById('go-'+prince);
  if(go){go.disabled=false; go.className='go-btn';}
};

function ensureOrderUI(key){
  var nt=document.getElementById('normal-trans-'+key); if(!nt)return;
  // remove static weapon/siege item rows left from template (弩固定など)
  Array.prototype.slice.call(nt.querySelectorAll('.item-row')).forEach(function(el){
    if(!el.closest('#titems-'+key)) el.remove();
  });
  var sum=document.getElementById('order-sum-'+key);
  if(!sum){ sum=document.createElement('div'); sum.id='order-sum-'+key; sum.className='tp-info'; sum.style.marginBottom='8px'; nt.insertBefore(sum, nt.firstChild); }
  var od=gs.order[key]; var node=gs.node[key]||0;
  if(od){
    var prog=(od.items||[]).map(function(it){return it.label+':'+(it.delivered||0)+'/'+it.qty;}).join('　');
    sum.innerHTML='<b>ノード'+node+' 依頼</b>：'+od.label+'　納期残 <b>'+od.deadline+'</b>T<br><small>'+prog+'</small>';
  }else sum.textContent='依頼なし';
  var box=document.getElementById('titems-'+key);
  if(!box){ box=document.createElement('div'); box.id='titems-'+key; var means=document.getElementById('means-'+key); if(means)means.after(box); else nt.appendChild(box); }
  if(!od||!od.items){box.innerHTML='';return;}
  var html='';
  od.items.forEach(function(it){
    var qk=key+'_'+it.id;
    if(typeof qtys!=='undefined'&&qtys[qk]==null)qtys[qk]=0;
    var q=(typeof qtys!=='undefined'?qtys[qk]:0)||0;
    html+='<div class="item-row"><div class="item-info"><div class="item-name">'+it.label+
      '</div><div class="item-stock">現庫:<b>'+stockOf(it.id)+'</b> 依頼:'+it.qty+' 到着済:'+(it.delivered||0)+
      '</div></div><div class="item-qty-large">'+
      '<button class="qty-btn-lg" onclick="changeQty(\''+key+'\',\''+it.id+'\',-1)">－</button>'+
      '<span class="qty-val-lg" id="qty-'+key+'-'+it.id+'">'+q+'</span>'+
      '<button class="qty-btn-lg" onclick="changeQty(\''+key+'\',\''+it.id+'\',1)">＋</button></div></div>';
  });
  box.innerHTML=html;
}

changeQty=function(prince,item,delta){
  var key=prince+'_'+item;
  var avail=stockOf(item);
  var means=gs.transport[prince]&&gs.transport[prince].means;
  var nv=Math.max(0,(qtys[key]||0)+delta);
  var other=0;
  Object.keys(qtys).forEach(function(k){ if(k.indexOf(prince+'_')===0&&k!==key) other+=(qtys[k]||0); });
  var capMax=999;
  if(means==='jinput') capMax=portersFree();
  else if(means) capMax=MEANS_CAP[means]||1;
  if(other+nv>capMax) nv=Math.max(0,capMax-other);
  if(nv>avail) nv=avail;
  qtys[key]=nv;
  var el=document.getElementById('qty-'+prince+'-'+item); if(el)el.textContent=qtys[key];
};

function iconHref(means){
  var I=(typeof TRANSPORT_ICONS!=='undefined'&&TRANSPORT_ICONS)||{};
  return I[means]||I.jinput||'';
}

/** HTML overlay convoys on #map-wrap (percent of 1100 viewBox) */
function renderConvoys(){
  ensureState();
  var wrap=document.getElementById('map-wrap'); if(!wrap)return;
  if(getComputedStyle(wrap).position==='static') wrap.style.position='relative';
  var layer=document.getElementById('convoy-html-layer');
  if(!layer){
    layer=document.createElement('div');
    layer.id='convoy-html-layer';
    layer.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:12;';
    wrap.appendChild(layer);
  }
  layer.innerHTML='';
  (gs.convoys||[]).forEach(function(cv){
    var node=cv.targetNode||gs.node[cv.route]||1;
    var pos;
    if(typeof posForConvoy==='function'){
      pos=posForConvoy(cv.route, node, cv.eta, cv.etaMax);
    }else{
      pos={x:500,y:500};
    }
    // viewBox 0 0 1100 1100 → percent
    var left=(pos.x/1100)*100;
    var top=(pos.y/1100)*100;
    var color=ROUTE_COLOR[cv.route]||'#333';
    var cargo=(cv.cargo||[]).map(function(c){return c.label+'×'+c.qty;}).join('、');
    var title=(MEANS_LABEL[cv.means]||cv.means)+' → '+(PNAMES[cv.route]||cv.route)+'（'+(PDIRS[cv.route]||'')+'）';
    var href=iconHref(cv.means);
    var el=document.createElement('div');
    el.className='convoy-wrap open';
    el.style.cssText='left:'+left+'%;top:'+top+'%;transform:translate(-50%,-50%);pointer-events:auto;';
    el.innerHTML=
      '<div class="convoy-icon" style="border-color:'+color+'">'+(href?'<img src="'+href+'" style="width:28px;height:28px;object-fit:contain">':'📦')+'</div>'+
      '<div class="convoy-popup" style="display:block">'+
      '<div class="cb-title" style="color:'+color+'">'+title+'</div>'+
      '<div>'+cargo+'</div>'+
      '<div style="color:'+color+';font-weight:700">あと '+cv.eta+'T</div></div>';
    layer.appendChild(el);
  });
}

function markNodeCleared(key,node){
  ensureState();
  if((gs.cleared[key]||[]).indexOf(node)<0) gs.cleared[key].push(node);
  if(key==='food'&&node===1)showToast('🔓 荷車が解禁されました');
  if(key==='food'&&node===2)showToast('🔓 船が解禁されました');
  if(key==='horse'&&node===2)showToast('🔓 馬車技術が解禁されました');
  refreshMapNodes();
}
function checkOrderComplete(key){
  var od=gs.order[key]; if(!od||!od.items)return;
  if(od.items.every(function(it){return (it.delivered||0)>=it.qty;})){
    var node=od.node||gs.node[key]||1;
    markNodeCleared(key,node);
    gs.orderLocked[key]=false;
    /* trust grant patched */
    if(!od._trustGranted){
      var tr=20;
      try{
        var conf=CFG.node_orders&&CFG.node_orders[key]&&CFG.node_orders[key][String(node)];
        if(conf&&conf.trust_reward!=null) tr=conf.trust_reward;
        else tr = (node>=4?20:15);
      }catch(e){ tr=(node>=4?20:15); }
      gs.trust[key]=Math.min(100,(gs.trust[key]||0)+tr);
      od._trustGranted=true;
      showToast('✓ '+PNAMES[key]+' ノード'+node+' 依頼完納（信頼 +'+tr+'）');
    } else {
      showToast('✓ '+PNAMES[key]+' ノード'+node+' 依頼完納（撃破/クリア）');
    }
  }
}

goTransport=function(prince){
  ensureState();
  if(gs.phase&&gs.phase!=='transport'){showToast('輸送フェーズではありません');return;}
  if(!canTransportThisTurn(prince)){
    showToast(S('transport_after_sortie_hint','出立したターンは輸送できません。翌ターンから送れます'));
    return;
  }
  var means=gs.transport[prince]&&gs.transport[prince].means;
  if(!means||!isMeansUnlocked(means)){showToast('輸送手段を選んでください（初期は人足のみ）');return;}
  var od=gs.order[prince];
  var cargo=[]; var total=0;
  if(od&&od.items){
    od.items.forEach(function(it){
      var q=qtys[prince+'_'+it.id]||0;
      if(q>0){cargo.push({id:it.id,label:it.label,qty:q});total+=q;}
    });
  }
  if(total<=0){showToast('送る数量を指定してください');return;}
  var cap=meansCap(means);
  if(means==='jinput'){
    var free=portersFree();
    if(free<=0){showToast('人足が全員出払っています（最大'+(gs.portersMax||4)+'人）');return;}
    if(total>free){showToast('人足が足りません（空き'+free+'人・送ろうとした数'+total+'）');return;}
  }else if(total>cap){
    showToast('積載超過（最大'+cap+'）');return;
  }
  cargo.forEach(function(c){takeStock(c.id,c.qty);});
  var node=gs.node[prince]||1;
  var eta=etaFor(prince,node,means);
  var portersUsed=(means==='jinput')?total:0;
  gs.convoys.push({
    id:'cv_'+prince+'_'+Date.now(),
    route:prince, means:means, cargo:cargo,
    eta:eta, etaMax:eta, targetNode:node, porters:portersUsed
  });
  gs.transport[prince]=gs.transport[prince]||{};
  gs.transport[prince].done=true;
  gs.orderMissTurns[prince]=0;
  Object.keys(qtys).forEach(function(k){if(k.startsWith(prince+'_'))qtys[k]=0;});
  var btn=document.getElementById('go-'+prince);
  if(btn){btn.textContent='✓ 出発済み';btn.className='go-btn done-btn';btn.disabled=true;}
  updateHeaderDisplay();updateInvDisplay();updateStockBar();
  ensureOrderUI(prince);renderConvoys();
  showToast(PNAMES[prince]+'へ出発（あと'+eta+'T）');
};

function tickConvoys(){
  ensureState();
  var left=[];
  (gs.convoys||[]).forEach(function(cv){
    cv.eta-=1;
    if(cv.eta<=0){
      var od=gs.order[cv.route];
      if(od&&od.items){
        (cv.cargo||[]).forEach(function(c){
          var it=od.items.find(function(x){return x.id===c.id;});
          if(it)it.delivered=(it.delivered||0)+c.qty;
        });
      }
      showToast('📦 '+PNAMES[cv.route]+'に荷物が到着');
      checkOrderComplete(cv.route);
    }else left.push(cv);
  });
  gs.convoys=left;
  renderConvoys();
}

// --- sortie ---
function updateSortieReadyFlags(){
  ensureState();
  PKEYS.forEach(function(key){
    if(gs.sortied[key])return;
    var ready=gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold;
    if(ready&&gs.sortieAvailableTurn[key]==null){
      gs.sortieAvailableTurn[key]=gs.turn+1;
    }
  });
}
checkSortieConditions=function(){
  ensureState();
  updateSortieReadyFlags();
  PKEYS.forEach(function(key){
    if(gs.sortied[key])return;
    var area=document.getElementById('sortie-area-'+key);
    var btn=document.getElementById('sortie-btn-'+key);
    if(!area||!btn)return;
    var ready=gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold;
    var can=ready&&gs.sortieAvailableTurn[key]!=null&&gs.turn>=gs.sortieAvailableTurn[key]&&!gs.sortieDoneThisTurn;
    area.style.display=ready?'block':'none';
    btn.style.display=can?'block':'none';
  });
};

var __handDeliver=typeof handDeliver==='function'?handDeliver:null;
if(__handDeliver){
  handDeliver=function(key){
    __handDeliver(key);
    if(key==='horse'&&gs.prepDone[key]&&!gs._horsePrepGranted){
      gs.ranchHorses=(gs.ranchHorses||0)+2; gs._horsePrepGranted=true;
    }
    updateSortieReadyFlags(); checkSortieConditions();
  };
}
var __selectChoice=typeof selectChoice==='function'?selectChoice:null;
if(__selectChoice){
  selectChoice=function(key,idx,trust,btn){
    __selectChoice(key,idx,trust,btn);
    updateSortieReadyFlags(); checkSortieConditions();
  };
}

sortie=function(key){
  ensureState();
  if(gs.sortieDoneThisTurn){showToast('このターンはすでに出立させています');return;}
  if(!gs.prepDone[key]||gs.trust[key]<CFG.sortie_trust_threshold)return;
  if(gs.sortieAvailableTurn[key]==null||gs.turn<gs.sortieAvailableTurn[key]){
    showToast(S('sortie_next_turn_hint','出立は準備完了の翌ターンからです'));return;
  }
  if(!confirm(S('sortie_confirm','出立時には他の皇子の出立には手が回らなくなりますがよろしいですか？')))return;
  gs.sortied[key]=true;
  gs.sortieDoneThisTurn=true;
  gs.sortieTurn[key]=gs.turn; // このターンは輸送不可
  gs.node[key]=1;
  gs.letterFlags.justEntered[key]=true;
  gs.orderLocked[key]=false;
  setOrderForNode(key,1,true);
  // safety: never crossbow on N1
  if(key==='weapon'&&gs.order[key]){
    gs.order[key].items=(gs.order[key].items||[]).filter(function(it){return it.id!=='crossbow2';});
    if(!gs.order[key].items.length){
      gs.order[key].items=[{id:'sword',label:'剣★1',qty:4,delivered:0}];
      gs.order[key].label='剣★1×4';
    }
  }
  var btn=document.getElementById('sortie-btn-'+key); if(btn)btn.style.display='none';
  var done=document.getElementById('sortie-done-'+key); if(done)done.style.display='block';
  PKEYS.forEach(function(k){ if(k!==key){ var b=document.getElementById('sortie-btn-'+k); if(b)b.style.display='none'; }});
  document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(function(el){el.style.display='';});
  positionPieceAtNode(key); refreshMapNodes();
  showToast('⚑ '+PNAMES[key]+' 出立 → ノード1（輸送は翌ターンから）');
  updatePrinceBar(); updateTabLabels(); updateTransportUI();
};

updatePrinceBar=function(){
  ensureState();
  PKEYS.forEach(function(key){
    var req=document.getElementById('pc-req-'+key);
    var sub=document.getElementById('pc-sub-'+key);
    var dlEl=document.getElementById('pc-dl-'+key);
    if(!req)return;
    var t=gs.trust[key];
    var q=CFG.prep_quests[key];
    var node=gs.node[key]||0;
    if(node>=1){
      req.textContent=orderLabel(key);
      if(sub)sub.textContent='ノード'+node+((gs.cleared[key]||[]).indexOf(node)>=0?'・クリア済':'・依頼中');
      var od=gs.order[key];
      if(dlEl&&od){
        var urg=od.deadline<=3?'urg':'';
        dlEl.innerHTML='<div class="pc-dl-badge '+urg+'">納期<br><b>'+od.deadline+'</b>T</div>';
      }
    }else if(gs.prepDone[key]&&t>=CFG.sortie_trust_threshold){
      var av=gs.sortieAvailableTurn[key];
      req.textContent='出立準備完了';
      if(sub)sub.textContent=(av!=null&&gs.turn>=av)?'出立可能（今ターン）':'出立は翌ターンから';
      if(dlEl)dlEl.innerHTML='';
    }else if(gs.prepDone[key]){
      req.textContent='準備完了　信頼'+t+'/100';
      if(sub)sub.textContent='あと'+(CFG.sortie_trust_threshold-t)+'で出立可';
      if(dlEl)dlEl.innerHTML='';
    }else{
      req.textContent='準備：'+((q&&q.label)?q.label:((q&&q.item)?q.item:''))+(q&&q.qty!=null?('×'+q.qty):'');
      if(sub)sub.textContent='信頼度'+t+'/100';
      if(dlEl)dlEl.innerHTML='';
    }
  });
};

updateTabLabels=function(){
  ensureState();
  PKEYS.forEach(function(key){
    var req=document.getElementById('ltab-req-'+key);
    var dl=document.getElementById('ltab-dl-'+key);
    var tab=document.getElementById('ptab-'+key);
    var chk=document.getElementById('tab-check-'+key);
    if(chk)chk.textContent=(gs.choices[key]!==undefined)?'☑ ':'';
    var t=gs.trust[key];
    var node=gs.node[key]||0;
    if(node>=1){
      if(req)req.textContent=orderLabel(key);
      if(dl)dl.textContent='ノード'+node;
      if(tab)tab.classList.remove('urg-tab');
    }else if(gs.prepDone[key]){
      if(req)req.textContent='準備完了'; if(dl)dl.textContent='信頼'+t+'/100';
      if(tab)tab.classList.toggle('urg-tab',t>=CFG.sortie_trust_threshold);
    }else{
      var q=CFG.prep_quests[key];
      if(req)req.textContent='準備:'+((q&&q.label)?q.label:((q&&q.item)?q.item:''))+(q&&q.qty!=null?('×'+q.qty):'');
      if(dl)dl.textContent='信頼'+t+'/100';
    }
  });
  var ks=document.getElementById('kg-summary-tab');
  if(ks){
    var parts=[];
    if(gs.kengen&&gs.kengen.shingen)parts.push('進言✓');
    if(gs.kengen&&gs.kengen.kenjou)parts.push('献上✓');
    ks.textContent=parts.length?parts.join(' '):'進言/献上';
  }
};

// hide transport UI outside transport phase
var __setPhase=typeof setPhase==='function'?setPhase:null;
if(__setPhase){
  setPhase=function(p){
    __setPhase(p);
    gs.phase=p;
    var st=document.getElementById('sec-transport');
    var sr=document.getElementById('sec-result');
    var sm=document.getElementById('sec-management');
    if(st) st.style.display=(p==='transport')?'block':'none';
    if(sr) sr.style.display=(p==='result')?'block':'none';
    if(sm) sm.style.display=(p==='management')?'block':'none';
    if(p!=='transport'){
      // force hide any leftover
      if(st) st.style.display='none';
    }
    if(p==='transport') updateTransportUI();
    renderConvoys();
  };
}

updateTransportUI=function(){
  ensureState();
  if(gs.phase&&gs.phase!=='transport'){
    var st=document.getElementById('sec-transport');
    if(st) st.style.display='none';
    return;
  }
  PKEYS.forEach(function(key){
    var pp=document.getElementById('prep-panel-'+key);
    var nt=document.getElementById('normal-trans-'+key);
    var sa=document.getElementById('sortie-area-'+key);
    var node=gs.node[key]||0;
    if(node>=1){
      if(pp)pp.style.display='none';
      if(sa)sa.style.display='none';
      if(nt){
        nt.style.display='block';
        rebuildMeans(key);
        ensureOrderUI(key);
        var go=document.getElementById('go-'+key);
        var ti=document.getElementById('tinfo-'+key);
        if(!canTransportThisTurn(key)){
          if(ti)ti.textContent=S('transport_after_sortie_hint','出立したターンは輸送できません。翌ターンから送れます');
          if(go){go.disabled=true; go.textContent='翌ターンから輸送可';}
          // disable means
          var row=document.getElementById('means-'+key);
          if(row) row.querySelectorAll('.means-btn').forEach(function(b){b.disabled=true; b.style.opacity='.4';});
        }else if(gs.transport[key]&&gs.transport[key].done){
          if(go){go.textContent='✓ 出発済み';go.className='go-btn done-btn';go.disabled=true;}
        }
      }
    }else{
      if(pp)pp.style.display='block';
      if(nt)nt.style.display='none';
      if(sa)sa.style.display=(gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold)?'block':'none';
    }
    var hb=document.getElementById('hand-btn-'+key);
    if(hb&&gs.prepDone[key]){hb.textContent='✓ 手渡し済み';hb.className='hand-btn done';hb.disabled=true;}
    checkSortieConditions();
  });
  renderConvoys();
  /* ranch buy UI removed — horses v1 safe */
};

window.buyRanchHorse=function(){ showToast('馬は買えません。牧場の迷い馬や進言で手に入ります'); };

// letter demand continuity
var __renderLetter=typeof renderLetter==='function'?renderLetter:null;
if(__renderLetter){
  renderLetter=function(key){
    __renderLetter(key);
    ensureState();
    if((gs.node[key]||0)>=1&&gs.order[key]&&!(gs.letterFlags.justEntered&&gs.letterFlags.justEntered[key])){
      var dem=document.getElementById('lt-'+key+'-demand');
      if(dem){
        var od=gs.order[key];
        var miss=gs.orderMissTurns[key]||0;
        var from=PNAMES[key]+'（'+PDIRS[key]+'）ノード'+gs.node[key]+'より';
        var body=miss>=(CFG.remind_after_turns||3)
          ? ('……荷が届かぬ。催促する。\n\n【催促・継続】'+od.label+'　納期残：'+od.deadline+'ターン')
          : ('前線より。依頼は継続中（新規ではない）。\n\n【継続依頼】'+od.label+'　納期残：'+od.deadline+'ターン');
        dem.innerHTML='<div class="letter-block"><div class="letter-from">'+from+'</div><div class="letter-text">'+body+'</div></div>';
      }
    }
  };
}

var __goNext=goToNextTurn;
goToNextTurn=function(){
  ensureState();
  PKEYS.forEach(function(key){
    if((gs.node[key]||0)>=1&&gs.order[key]){
      if(gs.order[key].deadline>0)gs.order[key].deadline--;
      var tr=gs.transport[key];
      if(!(tr&&tr.done))gs.orderMissTurns[key]=(gs.orderMissTurns[key]||0)+1;
      else gs.orderMissTurns[key]=0;
    }
  });
  tickConvoys();
  __goNext();
  ensureState();
  /* justEntered clear moved to letter phase end — see pendingEnter */ PKEYS.forEach(function(k){});
  updateSortieReadyFlags();
  updatePrinceBar(); updateTabLabels();
  refreshMapNodes(); positionAllPieces(); renderConvoys();
};

var __apply=typeof applySaveData==='function'?applySaveData:null;
if(__apply){
  applySaveData=function(data){
    var ok=__apply(data);
    ensureState();
    PKEYS.forEach(function(key){
      if(gs.sortied[key]&&!(gs.node[key]>0)){
        gs.node[key]=1;
        if(!gs.order[key]){gs.orderLocked[key]=false;setOrderForNode(key,1,true);}
      }
      // fix bad crossbow orders on node 1
      if(key==='weapon'&&gs.node[key]===1&&gs.order[key]&&gs.order[key].items){
        if(gs.order[key].items.some(function(it){return it.id==='crossbow2';})){
          setOrderForNode(key,1,true);
        }
      }
    });
    updatePrinceBar();updateTabLabels();updateTransportUI();
    refreshMapNodes();positionAllPieces();renderConvoys();
    return ok;
  };
}

function bootAddon(){
  ensureState();
  ['food','horse','siege','weapon'].forEach(function(key){
    var nt=document.getElementById('normal-trans-'+key);
    if(!nt)return;
    if(nt.querySelector('p')&&!document.getElementById('means-'+key)) nt.innerHTML='';
  });
  PKEYS.forEach(function(key){
    if((gs.node[key]||0)<1)
      document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(function(el){el.style.display='none';});
  });
  refreshMapNodes(); positionAllPieces(); renderConvoys();
  updateSortieReadyFlags(); checkSortieConditions();
  var btn=document.getElementById('ph-letter-complete');
  if(btn){ btn.disabled=false; btn.setAttribute('onclick','tryGoToMgmt()'); }
  // hide transport if not in that phase
  if(gs.phase&&gs.phase!=='transport'){
    var st=document.getElementById('sec-transport');
    if(st) st.style.display='none';
  }
}
document.addEventListener('DOMContentLoaded',function(){ setTimeout(bootAddon,0); });
if(document.readyState!=='loading') setTimeout(bootAddon,0);
})();


// ═══ UI polish (sync_ui) ═══
(function(){
'use strict';
// re-bind strings from window (json sync)
if(typeof window.UI_STRINGS==='object'&&window.UI_STRINGS){
  if(typeof UI_STRINGS==='undefined') var UI_STRINGS={};
  Object.assign(UI_STRINGS, window.UI_STRINGS);
}
if(typeof GAME_DATA!=='undefined'&&GAME_DATA){
  if(GAME_DATA.ui_strings) Object.assign(UI_STRINGS||(window.UI_STRINGS={}), GAME_DATA.ui_strings);
  if(GAME_DATA.facility_lines) CFG.facility_lines=GAME_DATA.facility_lines;
  if(GAME_DATA.mat_labels) CFG.mat_labels=GAME_DATA.mat_labels;
  if(GAME_DATA.letters) CFG.letterPool=GAME_DATA.letters;
}
if(!CFG.mat_labels) CFG.mat_labels={iron:'鉄',wood:'木材',niter:'硝石',herb:'薬草',food:'兵糧',food_mat:'兵糧',med:'回復薬',sword:'剣',siege_w:'衝車'};
if(!CFG.facility_lines) CFG.facility_lines={};

function matLabel(k){ return (CFG.mat_labels&&CFG.mat_labels[k])||k; }

// --- 1) phase panels: only one section visible ---
var __setPhase2 = setPhase;
setPhase = function(p){
  __setPhase2(p);
  gs.phase = p;
  var sm=document.getElementById('sec-management');
  var st=document.getElementById('sec-transport');
  var sr=document.getElementById('sec-result');
  if(sm) sm.style.display = (p==='management') ? 'block' : 'none';
  if(st) st.style.display = (p==='transport') ? 'block' : 'none';
  if(sr) sr.style.display = (p==='result') ? 'block' : 'none';
  // hide any stray transport ph-complete if not transport
  if(p!=='transport' && st){
    st.style.display='none';
  }
  if(p==='result'){
    showPendingUnlockModal();
  }
  if(p==='transport' && typeof updateTransportUI==='function') updateTransportUI();
  if(typeof renderConvoys==='function') renderConvoys();
};

// --- 2) convoy icon transparent bg ---
var styleEl=document.getElementById('polish-convoy-css');
if(!styleEl){
  styleEl=document.createElement('style');
  styleEl.id='polish-convoy-css';
  styleEl.textContent=
    '.convoy-icon{background:transparent!important;box-shadow:none;}'+
    '.convoy-icon img{background:transparent;object-fit:contain;}'+
    '#unlock-modal-overlay{display:none;position:fixed;inset:0;z-index:90;background:rgba(8,5,2,.75);align-items:center;justify-content:center;padding:16px;}'+
    '#unlock-modal-overlay.on{display:flex;}'+
    '#unlock-modal{background:var(--paper,#f2ead8);border:3px solid var(--ink,#1a1207);border-radius:8px;max-width:400px;width:92%;padding:16px 18px;box-shadow:0 8px 24px rgba(0,0,0,.5);}'+
    '#unlock-modal h3{font-family:Noto Serif JP,serif;margin:0 0 10px;font-size:16px;letter-spacing:2px;}'+
    '#unlock-modal p{font-size:13px;line-height:1.8;margin:0 0 14px;white-space:pre-line;}'+
    '#unlock-modal button{display:block;width:100%;padding:10px;font-family:Noto Serif JP,serif;font-weight:700;background:linear-gradient(#d8b13a,#b58f1d);border:2px solid #b8860b;border-radius:4px;cursor:pointer;}';
  document.head.appendChild(styleEl);
}

// --- 3) in-transit qty ---
function inTransitQty(route, itemId){
  var n=0;
  (gs.convoys||[]).forEach(function(cv){
    if(cv.route!==route)return;
    (cv.cargo||[]).forEach(function(c){ if(c.id===itemId) n+=(c.qty||0); });
  });
  return n;
}

// wrap ensureOrderUI if exists
if(typeof ensureOrderUI==='function'){
  var __ensureOrderUI = ensureOrderUI;
  ensureOrderUI = function(key){
    __ensureOrderUI(key);
    var box=document.getElementById('titems-'+key);
    var od=gs.order&&gs.order[key];
    if(!box||!od||!od.items)return;
    // rebuild stock line with 輸送中
    var html='';
    od.items.forEach(function(it){
      var qk=key+'_'+it.id;
      if(typeof qtys!=='undefined'&&qtys[qk]==null)qtys[qk]=0;
      var q=(typeof qtys!=='undefined'?qtys[qk]:0)||0;
      var tr=inTransitQty(key,it.id);
      var avail=(typeof stockOf==='function')?stockOf(it.id):0;
      html+='<div class="item-row"><div class="item-info"><div class="item-name">'+it.label+
        '</div><div class="item-stock">現庫:<b>'+avail+'</b> 依頼:'+it.qty+
        ' 到着済:'+(it.delivered||0)+
        (tr>0?(' <span style="color:var(--accent)">輸送中:'+tr+'</span>'):'')+
        '</div></div><div class="item-qty-large">'+
        '<button class="qty-btn-lg" onclick="changeQty(\''+key+'\',\''+it.id+'\',-1)">－</button>'+
        '<span class="qty-val-lg" id="qty-'+key+'-'+it.id+'">'+q+'</span>'+
        '<button class="qty-btn-lg" onclick="changeQty(\''+key+'\',\''+it.id+'\',1)">＋</button></div></div>';
    });
    box.innerHTML=html;
  };
}

// --- 4) Go button text fix ---
if(typeof updateTransportUI==='function'){
  var __updTr = updateTransportUI;
  updateTransportUI = function(){
    // phase guard first
    if(gs.phase && gs.phase!=='transport'){
      var st=document.getElementById('sec-transport');
      if(st) st.style.display='none';
      return;
    }
    __updTr();
    PKEYS.forEach(function(key){
      var go=document.getElementById('go-'+key);
      if(!go)return;
      var can = (typeof canTransportThisTurn==='function') ? canTransportThisTurn(key) : true;
      var done = gs.transport[key]&&gs.transport[key].done;
      var node = (gs.node&&gs.node[key])||0;
      if(node<1)return;
      if(done){
        go.textContent = (UI_STRINGS&&UI_STRINGS.go_done)||'✓ 出発済み';
        go.className='go-btn done-btn';
        go.disabled=true;
      }else if(!can){
        go.textContent = (UI_STRINGS&&UI_STRINGS.go_wait_next)||'翌ターンから輸送可';
        go.disabled=true;
        go.className='go-btn';
      }else{
        go.textContent = (UI_STRINGS&&UI_STRINGS.go_depart)||'Go → 出発';
        go.disabled = !(gs.transport[key]&&gs.transport[key].means);
        go.className='go-btn';
      }
    });
  };
}

// canTransportThisTurn: sortieTurn strict >
if(typeof canTransportThisTurn==='function'){
  // redefine clearly
  canTransportThisTurn = function(key){
    if(typeof ensureState==='function') ensureState();
    if((gs.node[key]||0)<1) return false;
    if(gs.sortieTurn && gs.sortieTurn[key]!=null){
      // 出立ターンと同じターンは不可。翌ターン(turn > sortieTurn)から可
      if(gs.turn <= gs.sortieTurn[key]) return false;
    }
    return true;
  };
}

// --- 5) unlock modal ---
if(!gs.pendingUnlocks) gs.pendingUnlocks=[];
function queueUnlock(msgKey, fallback){
  if(!gs.pendingUnlocks) gs.pendingUnlocks=[];
  var msg = (typeof S==='function'?S(msgKey,fallback):null) || (UI_STRINGS&&UI_STRINGS[msgKey]) || fallback;
  if(gs.pendingUnlocks.indexOf(msg)<0) gs.pendingUnlocks.push(msg);
}
if(typeof markNodeCleared==='function'){
  var __mnc = markNodeCleared;
  markNodeCleared = function(key,node){
    var beforeFood1=(gs.cleared.food||[]).indexOf(1)>=0;
    var beforeFood2=(gs.cleared.food||[]).indexOf(2)>=0;
    var beforeHorse2=(gs.cleared.horse||[]).indexOf(2)>=0;
    __mnc(key,node);
    if(key==='food'&&node===1&&!beforeFood1) queueUnlock('unlock_cart','荷車が解禁されました。');
    if(key==='food'&&node===2&&!beforeFood2) queueUnlock('unlock_boat','船が解禁されました。');
    if(key==='horse'&&node===2&&!beforeHorse2) queueUnlock('unlock_wagon','馬車が解禁されました。');
  };
}
function showPendingUnlockModal(){
  if(!gs.pendingUnlocks||!gs.pendingUnlocks.length)return;
  var ov=document.getElementById('unlock-modal-overlay');
  if(!ov){
    ov=document.createElement('div');
    ov.id='unlock-modal-overlay';
    ov.innerHTML='<div id="unlock-modal"><h3 id="unlock-modal-title"></h3><p id="unlock-modal-body"></p><button type="button" id="unlock-modal-ok"></button></div>';
    document.body.appendChild(ov);
    document.getElementById('unlock-modal-ok').onclick=function(){
      gs.pendingUnlocks.shift();
      if(gs.pendingUnlocks.length) showPendingUnlockModal();
      else ov.classList.remove('on');
    };
  }
  document.getElementById('unlock-modal-title').textContent=(UI_STRINGS&&UI_STRINGS.unlock_popup_title)||'解禁のお知らせ';
  document.getElementById('unlock-modal-body').textContent=gs.pendingUnlocks[0];
  document.getElementById('unlock-modal-ok').textContent=(UI_STRINGS&&UI_STRINGS.unlock_ok)||'OK';
  ov.classList.add('on');
}
window.showPendingUnlockModal=showPendingUnlockModal;

// --- 6) facility random lines ---
function pickFacilityLine(key){
  var arr=(CFG.facility_lines&&CFG.facility_lines[key])||(GAME_DATA&&GAME_DATA.facility_lines&&GAME_DATA.facility_lines[key])||[];
  if(!arr.length)return null;
  return arr[Math.floor(Math.random()*arr.length)];
}
function applyFacilityLine(cardId, lineKey){
  var card=document.getElementById(cardId);
  if(!card)return;
  var bubble=card.querySelector('.bubble');
  if(!bubble)return;
  var line=pickFacilityLine(lineKey);
  if(!line)return;
  // keep small note if present
  var small=bubble.querySelector('small');
  var note=small?small.outerHTML:'';
  bubble.innerHTML=line+(note?('<br>'+note):'');
}
if(typeof openCard==='function'){
  var __openCard=openCard;
  openCard=function(name){
    __openCard(name);
    if(name==='market') applyFacilityLine('card-market','market');
    if(name==='smith') applyFacilityLine('card-smith','smith');
    if(name==='pharmacy') applyFacilityLine('card-pharmacy','pharmacy');
    if(name==='ranch') applyFacilityLine('card-ranch','ranch');
  };
}

// --- 7) Japanese recipe costs in management tables ---
function localizeRecipeTables(){
  document.querySelectorAll('#card-smith .mgmt-table td.res-price, #card-pharmacy .mgmt-table td.res-price').forEach(function(td){
    var t=td.textContent||'';
    // replace english keys
    Object.keys(CFG.mat_labels||{}).forEach(function(k){
      var re=new RegExp('\\b'+k+'\\b','gi');
      t=t.replace(re, CFG.mat_labels[k]);
    });
    // 鉄×1 style without word boundary in JP mix
    t=t.replace(/鉄/gi,'鉄').replace(/wood/gi,'木材').replace(/herb/gi,'薬草').replace(/niter/gi,'硝石');
    td.textContent=t;
  });
}
document.addEventListener('DOMContentLoaded', function(){ setTimeout(localizeRecipeTables, 50); });
if(document.readyState!=='loading') setTimeout(localizeRecipeTables, 50);

// also when opening smith/pharmacy
if(typeof openCard==='function'){
  var __oc2=openCard;
  openCard=function(name){
    __oc2(name);
    if(name==='smith'||name==='pharmacy') setTimeout(localizeRecipeTables,0);
  };
}

console.log('[sync_ui polish] ready');
})();



// ═══ item / cmd icon helpers ═══
window.ITEM_ICON_FOOD = "data:image/png;base64,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";
window.CMD_ICON_TRANSPORT = "data:image/png;base64,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";
(function(){
'use strict';
if(window.__iconSwapDone) return;
window.__iconSwapDone = true;
// ensureOrderUI rows for food get icon
if(typeof ensureOrderUI==='function'){
  var __eou = ensureOrderUI;
  ensureOrderUI = function(key){
    __eou(key);
    var box=document.getElementById('titems-'+key);
    if(!box) return;
    box.querySelectorAll('.item-row').forEach(function(row){
      if(row.querySelector('img')) return;
      var name=(row.querySelector('.item-name')||{}).textContent||'';
      if(name.indexOf('兵糧')>=0 && window.ITEM_ICON_FOOD){
        var img=document.createElement('img');
        img.src=window.ITEM_ICON_FOOD;
        img.alt='兵糧';
        row.insertBefore(img, row.firstChild);
      }
    });
  };
}
// if transport cmd still emoji (hot reload edge), fix
document.addEventListener('DOMContentLoaded', function(){
  var btn=document.getElementById('cmd-transport');
  if(btn && window.CMD_ICON_TRANSPORT && !btn.querySelector('img')){
    var ph=btn.querySelector('.cmd-ph');
    if(ph){
      var img=document.createElement('img');
      img.src=window.CMD_ICON_TRANSPORT;
      img.alt='輸送';
      ph.replaceWith(img);
    }
  }
});
console.log('[icon swap] food=potion★5, transport=cart');
})();

// ═══ map under panels + yellow corner hints ═══
(function(){
'use strict';
if(window.__mapYellowHints) return;
window.__mapYellowHints = true;

function clearYellowHints(){
  document.querySelectorAll('.hint-y').forEach(function(el){
    el.classList.remove('hint-y');
  });
}

function applyYellowHints(phase){
  clearYellowHints();
  var p = phase || (typeof gs!=='undefined' && gs.phase) || 'letter';
  if(p==='letter'){
    document.querySelectorAll('#ov-inner .tab-btn-5').forEach(function(b){
      b.classList.add('hint-y');
    });
    document.querySelectorAll('#ov-inner .ltab').forEach(function(b){
      b.classList.add('hint-y');
    });
  }else if(p==='management'){
    ['cmd-market','cmd-smith','cmd-ranch','cmd-pharmacy'].forEach(function(id){
      var b=document.getElementById(id);
      if(b && !b.classList.contains('disabled')) b.classList.add('hint-y');
    });
  }
}
window.applyYellowHints = applyYellowHints;

function showPhaseCompleteRows(p){
  var am=document.getElementById('ph-actions-mgmt');
  var at=document.getElementById('ph-actions-trans');
  var ar=document.getElementById('ph-actions-result');
  if(am){ am.classList.toggle('show', p==='management'); am.style.display = p==='management' ? 'flex' : 'none'; }
  if(at){ at.classList.toggle('show', p==='transport'); at.style.display = p==='transport' ? 'flex' : 'none'; }
  if(ar){ ar.classList.toggle('show', p==='result'); ar.style.display = p==='result' ? 'flex' : 'none'; }
  // also hide any other ph-actions that look like transport complete while in management
  document.querySelectorAll('.ph-actions').forEach(function(row){
    if(row.id==='ph-actions-mgmt'||row.id==='ph-actions-trans'||row.id==='ph-actions-result'||row.id==='ph-actions-letter') return;
    if(row.querySelector && row.querySelector('#ph-letter-complete')) return;
    var txt=row.textContent||'';
    if(txt.indexOf('輸送フェーズ')>=0){
      row.style.display = (p==='management') ? 'flex' : 'none';
      return;
    }
    if(txt.indexOf('ターン終了')>=0){
      row.style.display = (p==='transport') ? 'flex' : 'none';
      return;
    }
    if(txt.indexOf('次のターン')>=0 || txt.indexOf('へ進む')>=0){
      row.style.display = (p==='result') ? 'flex' : 'none';
      return;
    }
  });
}
window.showPhaseCompleteRows = showPhaseCompleteRows;


// wrap setPhase lightly
if(typeof setPhase==='function'){
  var __setPhaseBase = setPhase;
  setPhase = function(p){
    __setPhaseBase(p);
    if(p==='management'){
      if(typeof openCard==='function') openCard('market');
      var cm=document.getElementById('cmd-market');
      if(cm){
        document.querySelectorAll('#cmd-bar .cmd-btn').forEach(function(b){ b.classList.remove('active'); });
        cm.classList.add('active');
      }
    }
    applyYellowHints(p);
    showPhaseCompleteRows(p);
  };
}

// after letter open / tab change, re-apply letter frames
if(typeof openLetterOverlay==='function'){
  var __openLetterBase = openLetterOverlay;
  openLetterOverlay = function(){
    __openLetterBase();
    setTimeout(function(){ applyYellowHints('letter'); }, 0);
  };
}
if(typeof selectTab==='function'){
  var __selectTabBase = selectTab;
  selectTab = function(key){
    __selectTabBase(key);
    if(typeof gs!=='undefined' && gs.phase==='letter'){
      setTimeout(function(){ applyYellowHints('letter'); }, 0);
    }
  };
}
if(typeof selectLetterTab==='function'){
  var __selectLetterTabBase = selectLetterTab;
  selectLetterTab = function(prince, tab){
    __selectLetterTabBase(prince, tab);
    if(typeof gs!=='undefined' && gs.phase==='letter'){
      setTimeout(function(){ applyYellowHints('letter'); }, 0);
    }
  };
}

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    var __p=(typeof gs!=='undefined' && gs.phase) || 'letter'; applyYellowHints(__p); if(typeof showPhaseCompleteRows==='function') showPhaseCompleteRows(__p);
  }, 30);
});

console.log('[map+yellow] ready');
})();


// ═══ Horses v1 safe (on v0.6.1 base) ═══
window.HORSE_DATA = {"rankTable":{"1":{"speed":1,"capacity":1},"2":{"speed":2,"capacity":1},"3":{"speed":2,"capacity":2},"4":{"speed":3,"capacity":1},"5":{"speed":3,"capacity":2}},"strayStar2Chance":0.28,"names":["胡瓜","南瓜","茄子","大根","人参","蕪","葱","里芋","牛蒡","蓮根","柿","栗","柚子","苺","桃","綿飴","鏡餅","団子","羊羹","最中","大福","金平糖","求肥","柏餅","水羊羹"],"traits":["食いしん坊","臆病","好奇心旺盛","のんびり","負けず嫌い","人懐こい","慎重","陽気"],"strings":{"stray_title":"迷い馬","stray_body":"牧場の前に迷い馬がいます。雄と雌、それぞれ1頭に餌をやって引き取れます。選ばなかった馬は逃げてしまいます。","stray_confirm":"この2頭を引き取る","stray_need_both":"雄と雌を1頭ずつ選んでください","stray_done":"迷い馬を2頭引き取りました","stray_fled":"選ばれなかった馬は草原へ逃げていきました","list_empty":"まだ馬がいません。迷い馬や進言で手に入ります。","bubble_default":"…牧場の馬たちを見ていきます。","bubble_after_stray":"…この子たち、筋が良さそうです。大事にしましょう。","horse_find_ok":"名馬探索：{name}（★{star}）が牧場に加わりました","sex_m":"雄","sex_f":"雌","status_ranch":"牧場","status_paired":"つがい","status_transit":"輸送中","status_gifted":"献上済"}};
(function(){
'use strict';
if(window.__horsesV1Safe) return;
window.__horsesV1Safe = true;
try{ /* horses safe wrap */

var HD = window.HORSE_DATA || {};
var RANK_TABLE = HD.rankTable || {
  '1':{speed:1,capacity:1},'2':{speed:2,capacity:1},'3':{speed:2,capacity:2},
  '4':{speed:3,capacity:1},'5':{speed:3,capacity:2}
};
var NAMES = HD.names || ['胡瓜','南瓜','綿飴'];
var TRAITS = HD.traits || ['のんびり'];
var STR = HD.strings || {};
var STAR2 = HD.strayStar2Chance != null ? HD.strayStar2Chance : 0.28;
var _hid = 1;
var _stray = { m:[], f:[], pickM:null, pickF:null };

function S(k, fb){ return STR[k] || fb || k; }
function ensureHorseState(){
  if(!gs.horses) gs.horses = [];
  if(!gs.ranch) gs.ranch = { introDone:false, maxPairs:1, pairs:[], shippingUnlocked:false };
  if(gs.ranch.introDone == null) gs.ranch.introDone = false;
  gs.ranchHorses = gs.horses.filter(function(x){
    return x.status==='ranch' || x.status==='paired' || x.status==='transit';
  }).length;
}
function displayStar(rank){
  var s = Math.floor(Number(rank)||1);
  if(s<1)s=1; if(s>5)s=5; return s;
}
function statsForRank(rank){
  var st = displayStar(rank);
  var t = RANK_TABLE[String(st)] || {speed:1,capacity:1};
  return { star:st, speed:t.speed, capacity:t.capacity };
}
window.statsForRank = statsForRank;
window.displayStar = displayStar;
window.RANK_TABLE = RANK_TABLE;
function randomName(){
  ensureHorseState();
  var used = {};
  gs.horses.forEach(function(hh){ used[hh.name]=1; });
  var pool = NAMES.filter(function(n){ return !used[n]; });
  if(!pool.length) pool = NAMES.slice();
  return pool[Math.floor(Math.random()*pool.length)];
}
function randomTrait(){ return TRAITS[Math.floor(Math.random()*TRAITS.length)]; }
function rollRank(){ return Math.random() < STAR2 ? 2 : 1; }
function makeHorse(opts){
  opts = opts || {};
  var rank = opts.rank != null ? opts.rank : 1;
  var st = statsForRank(rank);
  return {
    id: opts.id || ('h_'+(_hid++)+'_'+Date.now().toString(36)),
    name: opts.name || randomName(),
    sex: opts.sex || 'm',
    rank: Math.round(rank*10)/10,
    speed: st.speed,
    capacity: st.capacity,
    status: opts.status || 'ranch',
    bornTurn: opts.bornTurn != null ? opts.bornTurn : (gs.turn||1),
    shippableFromTurn: null,
    pairId: null,
    winterFood: 0,
    winterMed: 0,
    trait: opts.trait || randomTrait(),
    source: opts.source || 'unknown'
  };
}
function addHorse(opts){
  ensureHorseState();
  var horse = makeHorse(opts);
  gs.horses.push(horse);
  ensureHorseState();
  return horse;
}
function ownedRanch(){
  ensureHorseState();
  return gs.horses.filter(function(x){ return x.status==='ranch'; });
}
function hasHorseMeans(){
  ensureHorseState();
  return gs.horses.some(function(x){ return x.status==='ranch' || x.status==='transit'; });
}

function renderRanchHorseList(){
  ensureHorseState();
  var box = document.getElementById('ranch-horse-list');
  if(!box) return;
  var list = gs.horses.filter(function(x){
    return x.status==='ranch'||x.status==='paired'||x.status==='transit';
  });
  if(!list.length){
    box.innerHTML = '<div class="ranch-empty">'+S('list_empty','まだ馬がいません。')+'</div>';
    return;
  }
  var html = '<table class="ranch-horse-table"><thead><tr>'+
    '<th>名前</th><th>性</th><th>★</th><th>速</th><th>容</th><th>性質</th><th>状態</th></tr></thead><tbody>';
  list.forEach(function(hh){
    var st = statsForRank(hh.rank);
    html += '<tr><td class="name">'+hh.name+'</td><td>'+(hh.sex==='f'?'雌':'雄')+
      '</td><td>'+st.star+'</td><td>'+st.speed+'</td><td>'+st.capacity+
      '</td><td>'+(hh.trait||'—')+'</td><td>'+S('status_'+hh.status, hh.status)+'</td></tr>';
  });
  html += '</tbody></table>';
  box.innerHTML = html;
}
window.renderRanchHorseList = renderRanchHorseList;

function setRanchBubble(text){
  var card = document.getElementById('card-ranch');
  if(!card) return;
  var bubble = card.querySelector('.bubble');
  if(!bubble) return;
  var small = bubble.querySelector('small');
  var note = small ? small.outerHTML : '';
  bubble.innerHTML = text + (note ? '<br>'+note : '');
}

function openStrayHorseEvent(){ window.openStrayHorseEvent = openStrayHorseEvent;

  ensureHorseState();
  if(gs.ranch.introDone) return;
  _stray.m = [makeHorse({sex:'m',rank:rollRank(),source:'stray'}), makeHorse({sex:'m',rank:rollRank(),source:'stray'})];
  _stray.f = [makeHorse({sex:'f',rank:rollRank(),source:'stray'}), makeHorse({sex:'f',rank:rollRank(),source:'stray'})];
  var seen={};
  [_stray.m[0],_stray.m[1],_stray.f[0],_stray.f[1]].forEach(function(hh){
    var g=0; while(seen[hh.name]&&g++<20) hh.name=randomName(); seen[hh.name]=1;
  });
  _stray.pickM = null; _stray.pickF = null;
  var title=document.getElementById('hs-title');
  var desc=document.getElementById('hs-desc');
  if(title) title.textContent=S('stray_title','迷い馬');
  if(desc) desc.textContent=S('stray_body','牧場の前に迷い馬がいます…');
  paintRow('hs-males', _stray.m, 'm');
  paintRow('hs-females', _stray.f, 'f');
  var btn=document.getElementById('hs-confirm');
  if(btn){ btn.disabled=true; }
  var ov=document.getElementById('horse-stray-overlay');
  if(ov) ov.classList.add('on');
}
function paintRow(id, arr, sex){
  var row=document.getElementById(id); if(!row) return;
  row.innerHTML='';
  arr.forEach(function(hh, idx){
    var st=statsForRank(hh.rank);
    var card=document.createElement('div');
    card.className='hs-card';
    card.innerHTML='<div class="hs-name">'+hh.name+'</div><div class="hs-meta">★'+st.star+'　速'+st.speed+'　容'+st.capacity+'</div><div class="hs-meta">'+(hh.trait||'')+'</div>';
    card.onclick=function(){ selectStray(sex, idx); };
    row.appendChild(card);
  });
}
function selectStray(sex, idx){
  if(sex==='m') _stray.pickM=idx; else _stray.pickF=idx;
  document.querySelectorAll('#hs-males .hs-card').forEach(function(c,i){ c.classList.toggle('selected', _stray.pickM===i); });
  document.querySelectorAll('#hs-females .hs-card').forEach(function(c,i){ c.classList.toggle('selected', _stray.pickF===i); });
  var btn=document.getElementById('hs-confirm');
  if(btn) btn.disabled = !(_stray.pickM!=null && _stray.pickF!=null);
}
window.confirmStrayHorses = function(){
  ensureHorseState();
  if(_stray.pickM==null||_stray.pickF==null){
    showToast(S('stray_need_both','雄と雌を1頭ずつ選んでください')); return;
  }
  var keepM=_stray.m[_stray.pickM], keepF=_stray.f[_stray.pickF];
  keepM.status='ranch'; keepF.status='ranch';
  gs.horses.push(keepM, keepF);
  gs.ranch.introDone=true;
  ensureHorseState();
  var ov=document.getElementById('horse-stray-overlay');
  if(ov) ov.classList.remove('on');
  showToast(S('stray_done','迷い馬を2頭引き取りました'));
  setTimeout(function(){ showToast(S('stray_fled','選ばれなかった馬は逃げていきました')); }, 700);
  setRanchBubble(S('bubble_after_stray','…この子たち、筋が良さそうです。'));
  renderRanchHorseList();
  if(typeof updateTransportUI==='function') updateTransportUI();
};

function grantHorseFind(){
  var horse=addHorse({ sex: Math.random()<0.5?'m':'f', rank:rollRank(), source:'horse_find' });
  showToast(S('horse_find_ok','名馬探索：{name}（★{star}）')
    .replace('{name}',horse.name).replace('{star}',String(displayStar(horse.rank))));
  renderRanchHorseList();
  return horse;
}

// means unlock
var __imu = (typeof window.isMeansUnlocked==='function') ? window.isMeansUnlocked : (typeof isMeansUnlocked==='function' ? isMeansUnlocked : null);
window.isMeansUnlocked = function(m){
  ensureHorseState();
  if(m==='horse') return hasHorseMeans();
  if(m==='wagon'){
    var cartOk = __imu ? __imu('cart') : false;
    return !!(gs.cleared&&gs.cleared.horse&&gs.cleared.horse.indexOf(2)>=0) && cartOk && hasHorseMeans();
  }
  return __imu ? __imu(m) : false;
};
var __stockOf = (typeof window.stockOf==='function') ? window.stockOf : (typeof stockOf==='function' ? stockOf : null);
window.stockOf = function(id){
  if(id==='food'||id==='food_mat') return (gs.inv&&gs.inv.food)||0;
  if(id==='sword') return (gs.stock&&gs.stock.sword)||0;
  if(id==='siege_w') return (gs.stock&&gs.stock.siege_w)||0;
  if(id==='med') return (gs.stock&&gs.stock.med)||0;

  if(id==='horse'){ ensureHorseState(); return ownedRanch().length; }
  return __stockOf ? __stockOf(id) : 0;
};
var __takeStock = (typeof window.takeStock==='function') ? window.takeStock : (typeof takeStock==='function' ? takeStock : null);
window.takeStock = function(id,q){
  if(id==='horse') return; // never consume horses
  if(__takeStock) __takeStock(id,q);
};

window.buyRanchHorse = function(){
  showToast('馬は買えません。牧場の迷い馬や進言で手に入ります');
};

// prep multi
function ensurePrepQtyHorse(){
  if(!gs.prepQtyHorse || typeof gs.prepQtyHorse!=='object') gs.prepQtyHorse={food:0,med:0};
}
window.changePrepQtyHorse = function(item, delta){
  if(gs.prepDone&&gs.prepDone.horse) return;
  ensurePrepQtyHorse();
  var need = item==='med'?1:4;
  var avail = item==='med'?(gs.stock.med||0):(gs.inv.food||0);
  var cur = gs.prepQtyHorse[item]||0;
  var nv = Math.max(0, Math.min(Math.min(avail,need), cur+delta));
  gs.prepQtyHorse[item]=nv;
  var el=document.getElementById('prep-qty-horse-'+item);
  if(el) el.textContent=nv;
  var si=document.getElementById('prep-stock-horse-'+item);
  if(si) si.innerHTML='現庫: <b>'+avail+'</b>　必要: '+need+'　選択: <b>'+nv+'</b>';
  var btn=document.getElementById('hand-btn-horse');
  if(btn) btn.disabled = !((gs.prepQtyHorse.food||0)>=4 && (gs.prepQtyHorse.med||0)>=1);
};
window.handDeliverHorse = function(){
  if(gs.prepDone&&gs.prepDone.horse) return;
  ensurePrepQtyHorse();
  if((gs.prepQtyHorse.food||0)<4 || (gs.prepQtyHorse.med||0)<1){
    showToast('兵糧×4と回復薬×1が必要です'); return;
  }
  if((gs.inv.food||0)<4 || (gs.stock.med||0)<1){ showToast('在庫が足りません'); return; }
  gs.inv.food-=4; gs.stock.med-=1;
  gs.trust.horse=Math.min(100,(gs.trust.horse||0)+3);
  gs.prepDone.horse=true;
  var pi=document.getElementById('prep-info-horse');
  if(pi) pi.textContent='✓ 準備依頼を完了しました！（兵糧×4・回復薬×1）';
  var hb=document.getElementById('hand-btn-horse');
  if(hb){ hb.textContent='✓ 手渡し済み'; hb.className='hand-btn done'; hb.disabled=true; }
  showToast((typeof PNAMES!=='undefined'?PNAMES.horse:'騎馬次')+'への手渡し（信頼度 +3）');
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updateStockBar==='function') updateStockBar();
  if(typeof updatePrinceBar==='function') updatePrinceBar();
  if(typeof checkSortieConditions==='function') checkSortieConditions();
  if(typeof updateTabLabels==='function') updateTabLabels();
};
var __hand = (typeof window.handDeliver==='function') ? window.handDeliver : (typeof handDeliver==='function' ? handDeliver : null);
if(__hand){
  window.handDeliver = function(key){
    if(key==='horse'){ handDeliverHorse(); return; }
    __hand(key);
  };
}
var __cpq = (typeof window.changePrepQty==='function') ? window.changePrepQty : (typeof changePrepQty==='function' ? changePrepQty : null);
if(__cpq){
  window.changePrepQty = function(key, delta){
    if(key==='horse') return;
    __cpq(key, delta);
  };
}
if(typeof CFG!=='undefined'){
  CFG.prep_quests = CFG.prep_quests || {};
  CFG.prep_quests.horse = {
    items:[{item:'food',label:'兵糧',qty:4},{item:'med',label:'回復薬',qty:1}],
    label:'兵糧×4・回復薬×1', trust_reward:3
  };
}

// openCard: ranch only — do NOT wrap setPhase
var __oc = (typeof window.openCard==='function') ? window.openCard : (typeof openCard==='function' ? openCard : null);
if(__oc){
  window.openCard = function(name){
    __oc(name);
    var buy=document.getElementById('ranch-horse-btn');
    if(buy&&buy.parentNode) buy.parentNode.remove();
    if(name==='ranch'){
      ensureHorseState();
      renderRanchHorseList();
      if(!gs.ranch.introDone) setTimeout(openStrayHorseEvent, 60);
      else setRanchBubble(S('bubble_default','…牧場の馬たちを見ていきます。'));
    }
  };
}

// updateTransportUI: strip buy btn + refresh prep labels — chain only
var __utu = (typeof window.updateTransportUI==='function') ? window.updateTransportUI : (typeof updateTransportUI==='function' ? updateTransportUI : null);
if(__utu){
  window.updateTransportUI = function(){
    __utu();
    var buy=document.getElementById('ranch-horse-btn');
    if(buy&&buy.parentNode) buy.parentNode.remove();
    ensurePrepQtyHorse();
    var af=gs.inv.food||0, am=gs.stock.med||0;
    var sf=document.getElementById('prep-stock-horse-food');
    var sm=document.getElementById('prep-stock-horse-med');
    if(sf) sf.innerHTML='現庫: <b>'+af+'</b>　必要: 4　選択: <b>'+(gs.prepQtyHorse.food||0)+'</b>';
    if(sm) sm.innerHTML='現庫: <b>'+am+'</b>　必要: 1　選択: <b>'+(gs.prepQtyHorse.med||0)+'</b>';
    var pf=document.getElementById('prep-qty-horse-food');
    var pm=document.getElementById('prep-qty-horse-med');
    if(pf) pf.textContent=gs.prepQtyHorse.food||0;
    if(pm) pm.textContent=gs.prepQtyHorse.med||0;
  };
}

// goToNextTurn: horse_find + return transit
var __gn = (typeof window.goToNextTurn==='function') ? window.goToNextTurn : (typeof goToNextTurn==='function' ? goToNextTurn : null);
if(__gn){
  window.goToNextTurn = function(){
    ensureHorseState();
    if(gs.kengen && gs.kengen.shingen==='horse_find') grantHorseFind();
    gs.horses.forEach(function(hh){ if(hh.status==='transit') hh.status='ranch'; });
    ensureHorseState();
    __gn();
    gs.prepQtyHorse={food:0,med:0};
    renderRanchHorseList();
  };
}

var __br = (typeof window.buildResultScreen==='function') ? window.buildResultScreen : (typeof buildResultScreen==='function' ? buildResultScreen : null);
if(__br){
  window.buildResultScreen = function(){
    __br();
    if(gs.kengen && gs.kengen.shingen==='horse_find'){
      var kng=document.getElementById('result-kengen');
      if(kng) kng.innerHTML += '<div style="color:var(--green)">🐎 名馬探索：次ターン開始時に牧場へ馬が加わります</div>';
    }
  };
}

var __as = (typeof window.applySaveData==='function') ? window.applySaveData : (typeof applySaveData==='function' ? applySaveData : null);
if(__as){
  window.applySaveData = function(data){
    var ok=__as(data);
    ensureHorseState();
    renderRanchHorseList();
    return ok;
  };
}

// IMPORTANT: do not re-wrap setPhase / showPhaseCompleteRows
// Only ensure buy UI gone on boot
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    ensureHorseState();
    var buy=document.getElementById('ranch-horse-btn');
    if(buy&&buy.parentNode) buy.parentNode.remove();
    renderRanchHorseList();
  }, 40);
});

console.log('[horses v1 safe] ready on v0.6.1 base');
}catch(err){ console.error('[horses v1 safe] FAILED', err); }
})();


// ═══ bugfix on v0.6.1 (letter/ranch/stock/letters) ═══
(function(){
'use strict';
if(window.__v061BugFix) return;
window.__v061BugFix = true;
try{ /* bugfix wrap */

// stockOf: never lose food/med/sword
(function(){
  var base = (typeof stockOf==='function') ? stockOf : null;
  stockOf = function(id){
    try{
      if(id==='food' || id==='food_mat') return (gs.inv && gs.inv.food) || 0;
      if(id==='sword') return (gs.stock && gs.stock.sword) || 0;
      if(id==='siege_w') return (gs.stock && gs.stock.siege_w) || 0;
      if(id==='med') return (gs.stock && gs.stock.med) || 0;
      if(id==='horse'){
        if(gs.horses && gs.horses.length){
          return gs.horses.filter(function(x){ return x.status==='ranch'; }).length;
        }
        return gs.ranchHorses || 0;
      }
      if(base) return base(id);
    }catch(e){ console.warn('stockOf', e); }
    return 0;
  };
})();

// stockForItem too
if(typeof stockForItem==='function'){
  stockForItem = function(id){
    return (typeof stockOf==='function') ? stockOf(id) : 0;
  };
}

// openLetter always opens overlay first
var __olo = window.openLetterOverlay || openLetterOverlay;
window.openLetterOverlay = function(){
  var ov=document.getElementById('overlay');
  if(ov){ ov.classList.add('on'); ov.style.display='block'; ov.style.visibility='visible'; }
  try{ __olo(); }catch(e){
    console.warn('openLetterOverlay inner', e);
    try{ if(typeof selectTab==='function') selectTab('food'); }catch(e2){}
  }
  if(ov && !ov.classList.contains('on')) ov.classList.add('on');
};

// Force letter on boot (multiple times — survives other handlers)
function forceLetterOpen(){
  try{
    if(typeof gs!=='undefined' && gs.phase && gs.phase!=='letter') return;
    if(typeof openLetterOverlay==='function') openLetterOverlay();
    else if(typeof window.openLetterOverlay==='function') window.openLetterOverlay();
  }catch(e){ console.warn('forceLetterOpen', e); }
}
document.addEventListener('DOMContentLoaded', function(){
  forceLetterOpen();
  setTimeout(forceLetterOpen, 0);
  setTimeout(forceLetterOpen, 50);
  setTimeout(forceLetterOpen, 200);
});
if(document.readyState!=='loading'){
  setTimeout(forceLetterOpen, 0);
  setTimeout(forceLetterOpen, 100);
}

// Ranch stray: robust open
function tryOpenStray(){
  try{
    if(typeof ensureHorseState==='function') ensureHorseState();
    else {
      if(!gs.horses) gs.horses=[];
      if(!gs.ranch) gs.ranch={introDone:false};
    }
    if(gs.ranch && gs.ranch.introDone) return;
    if(typeof openStrayHorseEvent==='function') openStrayHorseEvent();
    else console.warn('openStrayHorseEvent missing');
  }catch(e){ console.error('tryOpenStray', e); }
}

// Wrap openCard again (outermost) for ranch
if(typeof openCard==='function'){
  var __ocFix = openCard;
  openCard = function(name){
    __ocFix(name);
    if(name==='ranch'){
      setTimeout(tryOpenStray, 30);
      setTimeout(function(){
        if(typeof renderRanchHorseList==='function') renderRanchHorseList();
        if(typeof changePrepQtyHorse==='function'){
          // no-op refresh stocks on ranch visit
        }
      }, 40);
    }
  };
}

// cmdClick also
if(typeof cmdClick==='function'){
  var __cc = cmdClick;
  cmdClick = function(name){
    __cc(name);
    if(name==='ranch' && gs.phase==='management') setTimeout(tryOpenStray, 40);
  };
}

// Refresh horse prep stocks when opening transport / horse tab
if(typeof selectTransTab==='function'){
  var __stt = selectTransTab;
  selectTransTab = function(key){
    __stt(key);
    if(typeof updateTransportUI==='function') updateTransportUI();
    // force prep stock labels
    try{
      var af=(gs.inv&&gs.inv.food)||0, am=(gs.stock&&gs.stock.med)||0;
      var sf=document.getElementById('prep-stock-horse-food');
      var sm=document.getElementById('prep-stock-horse-med');
      if(sf) sf.innerHTML='現庫: <b>'+af+'</b>　必要: 4';
      if(sm) sm.innerHTML='現庫: <b>'+am+'</b>　必要: 1';
    }catch(e){}
  };
}

// When phase → transport, refresh stocks
if(typeof setPhase==='function'){
  var __spFix = setPhase;
  setPhase = function(p){
    __spFix(p);
    if(p==='letter') setTimeout(function(){ if(gs.phase==='letter') forceLetterOpen(); }, 0);
    if(p==='transport'){
      setTimeout(function(){
        if(typeof updateTransportUI==='function') updateTransportUI();
        var af=(gs.inv&&gs.inv.food)||0, am=(gs.stock&&gs.stock.med)||0;
        var sf=document.getElementById('prep-stock-horse-food');
        var sm=document.getElementById('prep-stock-horse-med');
        if(sf) sf.innerHTML='現庫: <b>'+af+'</b>　必要: 4';
        if(sm) sm.innerHTML='現庫: <b>'+am+'</b>　必要: 1';
      }, 20);
    }
  };
}

console.log('[v061 bugfix] letter/ranch/stock');
}catch(err){ console.error('[v061 bugfix] FAILED', err); }
})();

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.node').forEach(n=>n.addEventListener('click',()=>showMapCard(n.dataset.route)));
  document.querySelectorAll('.piece').forEach(p=>p.addEventListener('click',()=>showMapCard(p.dataset.route)));
  document.querySelectorAll('.sc').forEach(c=>c.addEventListener('click',()=>showMapCard(c.dataset.route)));
  document.querySelectorAll('.ship').forEach(s=>s.addEventListener('click',()=>{
    document.getElementById('mc-title').textContent='水路（船）';
    document.getElementById('mc-title').style.color='#3f7d9e';
    document.getElementById('mc-body').innerHTML='⚓ 河港間を短縮輸送';
    document.getElementById('map-card').classList.add('on');
  }));
  document.getElementById('mc-close').addEventListener('click',()=>document.getElementById('map-card').classList.remove('on'));
  PKEYS.forEach(key=>{
    if(!gs.sortied[key])
      document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(el=>el.style.display='none');
  });
  updateHeaderDisplay();try{setPhase('letter');}catch(e){}try{openLetterOverlay();}catch(e){var ov=document.getElementById('overlay');if(ov)ov.classList.add('on');}
});

// ═══ FINAL letter boot (must run) ═══
(function(){
  function bootLetter(){
    try{
      if(typeof gs!=='undefined' && gs.phase && gs.phase!=='letter') return;
      var ov=document.getElementById('overlay');
      if(ov){ ov.classList.add('on'); ov.style.display='block'; }
      if(typeof openLetterOverlay==='function') openLetterOverlay();
      else if(typeof window.openLetterOverlay==='function') window.openLetterOverlay();
    }catch(e){ console.warn('FINAL letter boot', e); }
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', function(){
      bootLetter();
      setTimeout(bootLetter, 30);
      setTimeout(bootLetter, 150);
    });
  } else {
    bootLetter();
    setTimeout(bootLetter, 30);
  }
  console.log('[FINAL letter boot] registered');
})();


// ═══ phase UI residue fix ═══
(function(){
'use strict';
if(window.__phaseResidueFix) return;
window.__phaseResidueFix = true;

function hideEl(el){
  if(!el) return;
  el.style.setProperty('display','none','important');
  el.classList.remove('show','active','on');
}
function showEl(el, display){
  if(!el) return;
  el.style.setProperty('display', display||'block', 'important');
}

function syncPhaseUI(p){
  p = p || (typeof gs!=='undefined' && gs.phase) || 'letter';
  if(document.body){
    document.body.classList.remove('phase-letter','phase-management','phase-transport','phase-result');
    document.body.classList.add('phase-'+p);
  }
  var sm=document.getElementById('sec-management');
  var st=document.getElementById('sec-transport');
  var sr=document.getElementById('sec-result');

  // sections
  if(p==='management'){ showEl(sm,'block'); hideEl(st); hideEl(sr); }
  else if(p==='transport'){ hideEl(sm); showEl(st,'block'); hideEl(sr); }
  else if(p==='result'){ hideEl(sm); hideEl(st); showEl(sr,'block'); }
  else { // letter or other
    hideEl(sm); hideEl(st); hideEl(sr);
  }

  // complete rows
  var am=document.getElementById('ph-actions-mgmt');
  var at=document.getElementById('ph-actions-trans');
  var ar=document.getElementById('ph-actions-result');
  hideEl(am); hideEl(at); hideEl(ar);
  if(p==='management'){ if(am){ am.classList.add('show'); showEl(am,'flex'); } }
  if(p==='transport'){ if(at){ at.classList.add('show'); showEl(at,'flex'); } }
  if(p==='result'){ if(ar){ ar.classList.add('show'); showEl(ar,'flex'); } }

  // Do NOT set inline display on .tp-tab-content — that breaks selectTransTab
  // (class .active uses CSS display; inline !important wins and freezes the panel).
  // Hiding #sec-transport parent is enough outside transport phase.
  if(p==='transport'){
    document.querySelectorAll('.tp-tab-content').forEach(function(el){
      el.style.removeProperty('display');
    });
  }

  // step bar classes (visual)
  var steps=['letter','management','transport','result'];
  document.querySelectorAll('.step').forEach(function(s,i){
    s.classList.remove('active','done');
    var idx=steps.indexOf(p);
    if(i<idx) s.classList.add('done');
    else if(i===idx) s.classList.add('active');
  });
}
window.syncPhaseUI = syncPhaseUI;

// chain setPhase outermost
if(typeof setPhase==='function' || typeof window.setPhase==='function'){
  var __spRes = window.setPhase || setPhase;
  window.setPhase = function(p){
    __spRes(p);
    try{ syncPhaseUI(p); }catch(e){ console.warn('syncPhaseUI', e); }
  };
  if(typeof setPhase==='function') setPhase = window.setPhase;
}

// also after goToMgmt / goToTransport / goToResult
['goToMgmt','goToTransport','goToResult','goToNextTurn'].forEach(function(fn){
  var f = window[fn] || (typeof eval==='function' ? null : null);
  try{ f = window[fn]; }catch(e){}
  if(typeof window[fn]==='function'){
    var orig = window[fn];
    window[fn] = function(){
      var r = orig.apply(this, arguments);
      try{ syncPhaseUI(gs.phase); }catch(e){}
      return r;
    };
  }
});

// boot
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){ syncPhaseUI(gs.phase||'letter'); }, 60);
  setTimeout(function(){ syncPhaseUI(gs.phase||'letter'); }, 250);
});

console.log('[phase residue] sync ready');
})();


// ═══ Horses v2 seasonal + bugfixes ═══
(function(){
'use strict';
if(window.__horsesV2) return;
window.__horsesV2 = true;

// sanitize inv numbers (NaN iron etc.) — MUST NOT call updateHeaderDisplay (infinite loop)
function sanitizeInv(){
  if(!gs.inv) gs.inv={iron:5,wood:5,niter:0,herb:4,food:8};
  ['iron','wood','niter','herb','food'].forEach(function(k){
    var v=Number(gs.inv[k]);
    if(!isFinite(v)) gs.inv[k]=(k==='iron'||k==='wood')?5:(k==='food'?8:(k==='herb'?4:0));
    else gs.inv[k]=v;
  });
  // DO NOT call updateHeaderDisplay here (was infinite recursion)
}
sanitizeInv();

function prepQuestLabel(q){
  if(!q) return '';
  if(q.label && q.qty==null) return q.label; // multi-item form already full label
  if(q.label && q.qty!=null) return q.label+'×'+q.qty;
  if(q.items && q.items.length){
    return q.items.map(function(it){ return (it.label||it.item)+'×'+it.qty; }).join('・');
  }
  return '';
}
window.prepQuestLabel = prepQuestLabel;

// Patch prince bar / tab labels on next update
function fixPrepLabelsNow(){
  try{
    if(typeof updatePrinceBar==='function'){
      // re-run inner logic for non-sortied non-done
      PKEYS.forEach(function(key){
        if(gs.sortied[key]||gs.prepDone[key]) return;
        var q=CFG.prep_quests&&CFG.prep_quests[key];
        var lab=prepQuestLabel(q);
        var req=document.getElementById('pc-req-'+key);
        if(req && lab) req.textContent='準備：'+lab;
        var lreq=document.getElementById('ltab-req-'+key);
        if(lreq && lab) lreq.textContent='準備:'+lab;
      });
    }
  }catch(e){}
}

// Wrap updatePrinceBar / updateTabLabels lightly
if(typeof updatePrinceBar==='function'){
  var __upb = updatePrinceBar;
  window.updatePrinceBar = function(){
    __upb();
    fixPrepLabelsNow();
  };
  updatePrinceBar = window.updatePrinceBar;
}
if(typeof updateTabLabels==='function'){
  var __utl = updateTabLabels;
  window.updateTabLabels = function(){
    __utl();
    fixPrepLabelsNow();
  };
  updateTabLabels = window.updateTabLabels;
}
if(typeof updateHeaderDisplay==='function'){
  var __uhd = updateHeaderDisplay;
  window.updateHeaderDisplay = function(){
    sanitizeInv();
    __uhd();
  };
  updateHeaderDisplay = window.updateHeaderDisplay;
}

// ── Seasonal state ──
function ensureRanchSeason(){
  if(!gs.ranch) gs.ranch={introDone:false,maxPairs:1,pairs:[],shippingUnlocked:false};
  if(!gs.horses) gs.horses=[];
  if(gs.ranch.yearIndex==null) gs.ranch.yearIndex=0;
  if(gs.ranch.maxPairs==null) gs.ranch.maxPairs=1;
  if(!gs.ranch.pairs) gs.ranch.pairs=[];
  if(gs.ranch.shippingUnlocked==null) gs.ranch.shippingUnlocked=false;
  if(gs.ranch.summerAnnounced==null) gs.ranch.summerAnnounced=false;
  if(gs.ranch.autumnCoupled==null) gs.ranch.autumnCoupled=false;
  if(gs.ranch.winterFoodDone==null) gs.ranch.winterFoodDone=false;
  if(gs.ranch.winterMedDone==null) gs.ranch.winterMedDone=false;
  if(gs.ranch.winterFed==null) gs.ranch.winterFed=false; gs.ranch.winterFoodDone=false; gs.ranch.winterMedDone=false; // legacy
  if(gs.ranch.pendingFoals==null) gs.ranch.pendingFoals=0;
  if(gs.ranch.seasonLog==null) gs.ranch.seasonLog=[];
}
function seasonName(){ return (typeof SEASONS!=='undefined'?SEASONS[gs.season]:['春','夏','秋','冬'][gs.season])||'?'; }
function displayStar(rank){
  var s=Math.floor(Number(rank)||1); if(s<1)s=1; if(s>5)s=5; return s;
}
function statsForRank(rank){
  var table=(window.HORSE_DATA&&window.HORSE_DATA.rankTable)||{
    '1':{speed:1,capacity:1},'2':{speed:2,capacity:1},'3':{speed:2,capacity:2},
    '4':{speed:3,capacity:1},'5':{speed:3,capacity:2}
  };
  var st=displayStar(rank);
  var t=table[String(st)]||{speed:1,capacity:1};
  return {star:st,speed:t.speed,capacity:t.capacity};
}
function ranchAdults(){
  ensureRanchSeason();
  return gs.horses.filter(function(hh){
    return (hh.status==='ranch'||hh.status==='paired') && !hh.isFoal;
  });
}
function ranchMales(){ return ranchAdults().filter(function(h){return h.sex==='m' && h.status==='ranch';}); }
function ranchFemales(){ return ranchAdults().filter(function(h){return h.sex==='f' && h.status==='ranch';}); }

function setSeasonMsg(html){
  var el=document.getElementById('ranch-season-msg');
  if(el) el.innerHTML=html||'';
}
function renderSeasonBar(){
  ensureRanchSeason();
  var bar=document.getElementById('ranch-season-bar');
  if(!bar) return;
  var ship=gs.ranch.shippingUnlocked?'出荷可':'出荷は最初の秋以降';
  bar.textContent='季節：'+seasonName()+'（T'+gs.turn+'）　つがい枠:'+gs.ranch.maxPairs+'　'+ship+
    '　馬'+(gs.horses?gs.horses.filter(function(x){return x.status!=='gifted'&&x.status!=='lost';}).length:0)+'頭';
}

function renderSeasonActions(){
  ensureRanchSeason();
  var box=document.getElementById('ranch-season-actions');
  if(!box) return;
  box.innerHTML='';
  var s=gs.season; // 0春 1夏 2秋 3冬

  if(s===2){ // 秋: coupling
    var males=ranchMales(), females=ranchFemales();
    if(males.length && females.length && !gs.ranch.autumnCoupled){
      var row=document.createElement('div');
      row.className='ranch-pair-row';
      row.innerHTML='<span>つがい:</span>'+
        '<select id="pair-male"></select><span>×</span><select id="pair-female"></select>'+
        '<button type="button" id="btn-pair-confirm" class="btn-pair-confirm btn-prod-start">カップリング確定</button>';
      box.appendChild(row);
      var sm=document.getElementById('pair-male');
      var sf=document.getElementById('pair-female');
      males.forEach(function(hh){
        var o=document.createElement('option'); o.value=hh.id;
        o.textContent=hh.name+' ★'+displayStar(hh.rank)+' 雄'; sm.appendChild(o);
      });
      females.forEach(function(hh){
        var o=document.createElement('option'); o.value=hh.id;
        o.textContent=hh.name+' ★'+displayStar(hh.rank)+' 雌'; sf.appendChild(o);
      });
      document.getElementById('btn-pair-confirm').onclick=function(){
        confirmCouple(sm.value, sf.value);
      };
      setSeasonMsg('秋です。つがいを組むと輸送・献上に使えません。翌春に仔馬が生まれます。');
    } else if(gs.ranch.autumnCoupled){
      setSeasonMsg('今秋のカップリングは確定済みです。つがいの馬は輸送不可です。');
    } else {
      setSeasonMsg('秋ですが、つがいにできる雄雌がいません。');
    }
  } else if(s===3){ // 冬: feed BOTH independently
    var b1=document.createElement('button');
    b1.textContent=gs.ranch.winterFoodDone ? '✓ 兵糧は与えた' : '全馬に兵糧をやる（1頭1兵糧）';
    b1.disabled=!!gs.ranch.winterFoodDone;
    b1.onclick=function(){ winterFeedFood(); };
    var b2=document.createElement('button');
    b2.textContent=gs.ranch.winterMedDone ? '✓ 回復薬は与えた' : 'つがいに回復薬（仔の★+0.5）';
    b2.disabled=!!gs.ranch.winterMedDone;
    b2.onclick=function(){ winterFeedMed(); };
    box.appendChild(b1); box.appendChild(b2);
    var msg='冬です。<strong>兵糧と回復薬は両方</strong>与えられます（どちらか一方でも可）。';
    msg+=' 薬は<strong>翌春の仔馬のランクだけ</strong>上がります。';
    if(gs.ranch.winterFoodDone) msg+='（兵糧済）';
    if(gs.ranch.winterMedDone) msg+='（薬済）';
    setSeasonMsg(msg);
  } else if(s===0){
    setSeasonMsg('春です。仔馬が生まれる季節です（結果フェーズ／ターン進行で反映）。');
  } else if(s===1){
    setSeasonMsg('夏です。仔馬の成長とステータスが判明します。1年目は出荷準備の話が出ます。');
  }
}

function confirmCouple(maleId, femaleId){
  ensureRanchSeason();
  if(gs.season!==2){ showToast('カップリングは秋のみです'); return; }
  if(gs.ranch.pairs.length >= gs.ranch.maxPairs){
    showToast('つがい枠がいっぱいです（'+gs.ranch.maxPairs+'）'); return;
  }
  var m=gs.horses.find(function(h){return h.id===maleId;});
  var f=gs.horses.find(function(h){return h.id===femaleId;});
  if(!m||!f||m.sex!=='m'||f.sex!=='f'){ showToast('雄と雌を選んでください'); return; }
  if(m.status!=='ranch'||f.status!=='ranch'){ showToast('その馬はつがいにできません'); return; }
  if(!confirm(m.name+' と '+f.name+' をつがいにしますか？\nこの2頭は輸送・献上に使えません。')) return;
  var pid='pair_'+Date.now().toString(36);
  m.status='paired'; f.status='paired'; m.pairId=pid; f.pairId=pid;
  gs.ranch.pairs.push({id:pid, maleId:m.id, femaleId:f.id, medBonus:0});
  gs.ranch.autumnCoupled=true;
  showToast('カップリング確定：'+m.name+'×'+f.name);
  if(typeof renderRanchHorseList==='function') renderRanchHorseList();
  renderSeasonBar(); renderSeasonActions();
}

function winterFeedFood(){
  ensureRanchSeason();
  if(gs.ranch.winterFoodDone){ showToast('今冬の兵糧は済みです'); return; }
  var list=gs.horses.filter(function(h){ return h.status==='ranch'||h.status==='paired'; });
  var need=list.length;
  if(need<=0){ showToast('馬がいません'); return; }
  if((gs.inv.food||0)<need){ showToast('兵糧が足りません（必要'+need+'）'); return; }
  gs.inv.food-=need;
  list.forEach(function(h){ h.winterFood=(h.winterFood||0)+1; });
  gs.ranch.winterFoodDone=true;
  showToast('全馬に兵糧を与えました（-'+need+'）');
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  renderSeasonActions();
}
function winterFeedMed(){
  ensureRanchSeason();
  if(gs.ranch.winterMedDone){ showToast('今冬の回復薬は済みです'); return; }
  var pairs=gs.ranch.pairs||[];
  if(!pairs.length){ showToast('つがいがいません'); return; }
  var need=pairs.length;
  if((gs.stock.med||0)<need){ showToast('回復薬が足りません（つがい1組につき1）'); return; }
  gs.stock.med-=need;
  pairs.forEach(function(p){ p.medBonus=(p.medBonus||0)+0.5; });
  gs.ranch.winterMedDone=true;
  showToast('つがいに回復薬を与えました（仔の★+0.5予定）');
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updateStockBar==='function') updateStockBar();
  renderSeasonActions();
}
window.confirmCouple=confirmCouple;
window.winterFeedFood=winterFeedFood;
window.winterFeedMed=winterFeedMed;

function randomName(){
  var names=(window.HORSE_DATA&&window.HORSE_DATA.names)||['胡瓜','南瓜','綿飴'];
  var used={}; (gs.horses||[]).forEach(function(h){used[h.name]=1;});
  var pool=names.filter(function(n){return !used[n];});
  if(!pool.length) pool=names.slice();
  return pool[Math.floor(Math.random()*pool.length)];
}
function makeFoal(pair){
  var m=gs.horses.find(function(h){return h.id===pair.maleId;});
  var f=gs.horses.find(function(h){return h.id===pair.femaleId;});
  var rMin=Math.min(m?m.rank:1, f?f.rank:1);
  var rMax=Math.max(m?m.rank:1, f?f.rank:1);
  var base=rMin + Math.random()*(rMax-rMin+0.01);
  var rank=Math.round((base+(pair.medBonus||0))*10)/10;
  if(rank<1) rank=1; if(rank>5) rank=5;
  var st=statsForRank(rank);
  return {
    id:'h_f_'+Date.now().toString(36)+'_'+Math.floor(Math.random()*999),
    name:randomName(),
    sex: Math.random()<0.5?'m':'f',
    rank:rank,
    speed:st.speed, capacity:st.capacity,
    status:'ranch',
    bornTurn:gs.turn,
    isFoal:true,
    grewUp:false,
    shippableFromTurn:null,
    pairId:null,
    winterFood:0, winterMed:0,
    trait:(window.HORSE_DATA&&window.HORSE_DATA.traits)?window.HORSE_DATA.traits[Math.floor(Math.random()*window.HORSE_DATA.traits.length)]:'のんびり',
    source:'birth'
  };
}

// Run seasonal events when season advances (hook goToNextTurn)
function onSeasonChange(prevSeason, newSeason){
  ensureRanchSeason();
  var logs=[];
  // Leaving winter (3) → spring (0): births
  if(prevSeason===3 && newSeason===0){
    var born=[];
    (gs.ranch.pairs||[]).forEach(function(pair){
      var n=1+(Math.random()<0.7?1:0); // 1 or 2 (70% twin)
      for(var i=0;i<n;i++){
        var foal=makeFoal(pair);
        gs.horses.push(foal);
        born.push(foal.name+'★'+displayStar(foal.rank));
      }
      // unpair parents back to ranch
      var m=gs.horses.find(function(h){return h.id===pair.maleId;});
      var f=gs.horses.find(function(h){return h.id===pair.femaleId;});
      if(m){ m.status='ranch'; m.pairId=null; }
      if(f){ f.status='ranch'; f.pairId=null; }
    });
    gs.ranch.pairs=[];
    gs.ranch.autumnCoupled=false;
    gs.ranch.winterFed=false;
    if(born.length){
      logs.push('春：仔馬が生まれました（'+born.join('、')+'）');
    } else if(gs.ranch.yearIndex>0){
      logs.push('春：今年は仔馬がいませんでした');
    }
    gs.ranch.yearIndex=(gs.ranch.yearIndex||0)+1;
  }
  // Summer: foals grow
  if(newSeason===1){
    var grew=[];
    gs.horses.forEach(function(hh){
      if(hh.isFoal && !hh.grewUp){
        hh.grewUp=true;
        hh.isFoal=false;
        var st=statsForRank(hh.rank);
        hh.speed=st.speed; hh.capacity=st.capacity;
        grew.push(hh.name+'（★'+displayStar(hh.rank)+' 速'+st.speed+' 容'+st.capacity+'）');
      }
    });
    if(grew.length) logs.push('夏：仔馬が成長しステータスが判明（'+grew.join('、')+'）');
    // Year 1 summer: announce shipping next season
    if(!gs.ranch.shippingUnlocked && !gs.ranch.summerAnnounced){
      gs.ranch.summerAnnounced=true;
      logs.push('夏：牧場の娘「もうすぐ牧場から出られる子がいます…来季（秋）から輸送・献上の準備ができます」');
      gs.ranch.pendingShipUnlock=true;
    }
  }
  // Autumn: unlock shipping if pending
  if(newSeason===2){
    if(gs.ranch.pendingShipUnlock || gs.ranch.summerAnnounced){
      if(!gs.ranch.shippingUnlocked){
        gs.ranch.shippingUnlocked=true;
        gs.horses.forEach(function(hh){
          if(hh.status==='ranch' && hh.shippableFromTurn==null) hh.shippableFromTurn=gs.turn;
        });
        logs.push('秋：馬の出荷が解禁されました（輸送・献上に使えます。つがい中は除く）');
      }
    }
    gs.ranch.autumnCoupled=false;
    logs.push('秋：カップリングの季節です。牧場でつがいを組んでください。');
  }
  if(newSeason===3){
    gs.ranch.winterFed=false;
    logs.push('冬：兵糧と回復薬を与えられます（薬は仔のランクのみ上昇）。');
  }
  gs.ranch.seasonLog = (gs.ranch.seasonLog||[]).concat(logs).slice(-20);
  gs._ranchSeasonNotes = logs;
  if(typeof renderRanchHorseList==='function') renderRanchHorseList();
  renderSeasonBar(); renderSeasonActions();
}

// Hook goToNextTurn
(function(){
  var orig = window.goToNextTurn || (typeof goToNextTurn==='function'?goToNextTurn:null);
  if(!orig) return;
  window.goToNextTurn = function(){
    ensureRanchSeason();
    sanitizeInv();
    var prevSeason = gs.season;
    // return transit horses
    (gs.horses||[]).forEach(function(hh){ if(hh.status==='transit') hh.status='ranch'; });
    // horse_find before clear
    if(gs.kengen && gs.kengen.shingen==='horse_find' && typeof grantHorseFind==='function'){
      try{ grantHorseFind(); }catch(e){}
    }
    var r = orig.apply(this, arguments);
    // after turn++ season advanced
    try{ onSeasonChange(prevSeason, gs.season); }catch(e){ console.warn('onSeasonChange', e); }
    sanitizeInv();
    fixPrepLabelsNow();
    return r;
  };
  if(typeof goToNextTurn==='function') goToNextTurn = window.goToNextTurn;
})();

// Result screen: show ranch season notes
(function(){
  var orig = window.buildResultScreen || (typeof buildResultScreen==='function'?buildResultScreen:null);
  if(!orig) return;
  window.buildResultScreen = function(){
    orig.apply(this, arguments);
    var notes = gs._ranchSeasonNotes || (gs.ranch && gs.ranch.seasonLog && gs.ranch.seasonLog.slice(-3)) || [];
    if(!notes.length) return;
    var log=document.getElementById('result-log');
    if(log){
      notes.forEach(function(t){
        var d=document.createElement('div');
        d.className='log-line log-info show';
        d.textContent='🐎 '+t;
        log.appendChild(d);
      });
    }
    // also ranch-related in transport result area if empty-ish
  };
  if(typeof buildResultScreen==='function') buildResultScreen = window.buildResultScreen;
})();

// hasHorseMeans: only shippable unlocked adults for transport means (after unlock)
(function(){
  if(typeof window.isMeansUnlocked!=='function' && typeof isMeansUnlocked!=='function') return;
  var prev = window.isMeansUnlocked || isMeansUnlocked;
  window.isMeansUnlocked = function(m){
    if(m==='horse'){
      ensureRanchSeason();
      // Phase A compatibility: if not unlocked yet, still allow if any ranch horse (user may be early game)
      // Spec: shipping after first autumn. Means unlock when shippingUnlocked && free horse.
      if(!gs.ranch.shippingUnlocked){
        // still unlock means icon if own horses (can prepare); actual use limited later
        return (gs.horses||[]).some(function(h){ return h.status==='ranch'||h.status==='transit'; });
      }
      return (gs.horses||[]).some(function(h){ return h.status==='ranch'; });
    }
    return prev(m);
  };
  if(typeof isMeansUnlocked==='function') isMeansUnlocked = window.isMeansUnlocked;
})();

// openCard ranch: render season UI
(function(){
  var prev = window.openCard || (typeof openCard==='function'?openCard:null);
  if(!prev) return;
  window.openCard = function(name){
    prev(name);
    if(name==='ranch'){
      ensureRanchSeason();
      sanitizeInv();
      renderSeasonBar();
      renderSeasonActions();
      if(typeof renderRanchHorseList==='function') renderRanchHorseList();
    }
  };
  if(typeof openCard==='function') openCard = window.openCard;
})();

// boot
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    sanitizeInv();
    ensureRanchSeason();
    fixPrepLabelsNow();
    renderSeasonBar();
    renderSeasonActions();
  }, 80);
});

console.log('[horses v2] seasonal + NaN/label fixes');
})();


// ═══ critical fix stack+letter ═══
(function(){
'use strict';
if(window.__critFix) return;
window.__critFix = true;

// Horse prep letter always shows food+med text until sortied
var horsePrepBody = '出立の前に、兵糧と薬を少し分けてくれ。\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可';
var __rl = window.renderLetter || (typeof renderLetter==='function' ? renderLetter : null);
if(__rl){
  window.renderLetter = function(key){
    __rl(key);
    try{
      if(key==='horse' && !(gs.sortied && gs.sortied.horse) && !((gs.node&&gs.node.horse)>0)){
        var dem=document.getElementById('lt-horse-demand');
        if(dem){
          dem.innerHTML='<div class="letter-block"><div class="letter-from">騎馬次（出立前・準備依頼）</div><div class="letter-text">'+horsePrepBody.replace(/\\n/g,'\n')+'</div></div>';
        }
      }
    }catch(e){}
  };
  if(typeof renderLetter==='function') renderLetter = window.renderLetter;
}

// Also patch getLetterBundle / pickLetterEntry data if present
if(typeof CFG!=='undefined'){
  if(CFG.letters && CFG.letters.horse && CFG.letters.horse.prep){
    CFG.letters.horse.prep.demand_body = horsePrepBody.replace(/\\n/g,'\n');
  }
  if(CFG.letterPool && CFG.letterPool.horse && CFG.letterPool.horse.demand){
    CFG.letterPool.horse.demand.forEach(function(e){
      if(e.id==='horse_prep' || (e.when && e.when.node===0)){
        e.body = horsePrepBody.replace(/\\n/g,'\n');
      }
    });
  }
}

// goToTransport: never throw on NaN
var __gt = window.goToTransport || (typeof goToTransport==='function' ? goToTransport : null);
if(__gt){
  window.goToTransport = function(){
    try{
      if(gs.inv){
        ['iron','wood','niter','herb','food'].forEach(function(k){
          var v=Number(gs.inv[k]);
          if(!isFinite(v)) gs.inv[k]=0;
        });
      }
      if(gs.prod){
        ['sword','siege_w','med'].forEach(function(k){
          var v=Number(gs.prod[k]);
          if(!isFinite(v)) gs.prod[k]=0;
        });
      }
    }catch(e){}
    return __gt.apply(this, arguments);
  };
  if(typeof goToTransport==='function') goToTransport = window.goToTransport;
}

// refresh inv display after load
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    try{
      if(typeof sanitizeInv==='function') sanitizeInv();
      if(typeof updateInvDisplay==='function') updateInvDisplay();
      if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
      if(typeof renderAllLetters==='function') renderAllLetters();
    }catch(e){ console.warn('crit boot', e); }
  }, 100);
});

console.log('[crit fix] stack/letter/transport/inv-iron');
})();


// ═══ horse letter force (bedtime) ═══
(function(){
'use strict';
if(window.__horseLetterForce) return;
window.__horseLetterForce = true;
var BODY = '出立の前に、兵糧と薬を少し分けてくれ。\n【出立準備依頼】兵糧×4・回復薬×1　輸送フェーズで手渡し可';
function forceHorsePrepLetter(){
  try{
    if(!gs || (gs.sortied && gs.sortied.horse) || ((gs.node&&gs.node.horse)>0)) return;
    var dem=document.getElementById('lt-horse-demand');
    if(!dem) return;
    dem.innerHTML='<div class="letter-block"><div class="letter-from">騎馬次（出立前・準備依頼）</div>'+
      '<div class="letter-text" style="white-space:pre-line">'+BODY.replace(/\\n/g,'\n')+'</div></div>';
  }catch(e){}
}
// Patch data sources
function patchLetterData(){
  try{
    if(CFG.letters&&CFG.letters.horse&&CFG.letters.horse.prep){
      CFG.letters.horse.prep.demand_body=BODY.replace(/\\n/g,'\n');
    }
    if(CFG.letterPool&&CFG.letterPool.horse&&CFG.letterPool.horse.demand){
      CFG.letterPool.horse.demand.forEach(function(e){
        if(e.id==='horse_prep'||(e.when&&e.when.node===0&&!e.when.node_gte)){
          e.body=BODY.replace(/\\n/g,'\n');
        }
      });
    }
    if(typeof GAME_DATA!=='undefined'&&GAME_DATA.letters&&GAME_DATA.letters.horse&&GAME_DATA.letters.horse.demand){
      GAME_DATA.letters.horse.demand.forEach(function(e){
        if(e.id==='horse_prep'||(e.when&&e.when.node===0&&!e.when.node_gte)){
          e.body=BODY.replace(/\\n/g,'\n');
        }
      });
    }
  }catch(e){}
}
patchLetterData();

var __rAll = window.renderAllLetters || (typeof renderAllLetters==='function'?renderAllLetters:null);
if(__rAll){
  window.renderAllLetters=function(){
    patchLetterData();
    __rAll();
    forceHorsePrepLetter();
  };
  if(typeof renderAllLetters==='function') renderAllLetters=window.renderAllLetters;
}
var __st = window.selectTab || (typeof selectTab==='function'?selectTab:null);
if(__st){
  window.selectTab=function(key){
    __st(key);
    if(key==='horse') setTimeout(forceHorsePrepLetter, 0);
  };
  if(typeof selectTab==='function') selectTab=window.selectTab;
}
var __olo = window.openLetterOverlay || (typeof openLetterOverlay==='function'?openLetterOverlay:null);
if(__olo){
  window.openLetterOverlay=function(){
    patchLetterData();
    __olo();
    setTimeout(forceHorsePrepLetter, 0);
    setTimeout(forceHorsePrepLetter, 50);
  };
  if(typeof openLetterOverlay==='function') openLetterOverlay=window.openLetterOverlay;
}
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){ patchLetterData(); forceHorsePrepLetter(); }, 120);
});
console.log('[horse letter force] ready');
})();


// ═══ transport residue hard ═══
(function(){
'use strict';
if(window.__transHard) return;
window.__transHard = true;
function hardHideTransport(){
  var st=document.getElementById('sec-transport');
  var at=document.getElementById('ph-actions-trans');
  if(st){ st.style.setProperty('display','none','important'); }
  if(at){ at.style.setProperty('display','none','important'); at.classList.remove('show'); }
  // if any tp content leaked outside (broken DOM), hide active non-hidden parents
  document.querySelectorAll('.tp-tab-content').forEach(function(el){
    if(!st || !st.contains(el)){
      el.style.setProperty('display','none','important');
      el.classList.remove('active');
    }
  });
}
function hardShowTransport(){
  var st=document.getElementById('sec-transport');
  if(st) st.style.setProperty('display','block','important');
  document.querySelectorAll('.tp-tab-content').forEach(function(el){
    el.style.removeProperty('display');
  });
}
var prev = window.syncPhaseUI;
if(typeof prev==='function'){
  window.syncPhaseUI = function(p){
    prev(p);
    p = p || (gs&&gs.phase) || 'letter';
    if(p!=='transport') hardHideTransport();
    else hardShowTransport();
  };
}
// also on every phase button click paths
document.addEventListener('click', function(ev){
  var t=ev.target;
  if(!t) return;
  var txt=(t.textContent||'');
  if(txt.indexOf('輸送フェーズへ')>=0 || txt.indexOf('ターン終了')>=0 || txt.indexOf('次のターン')>=0 || txt.indexOf('経営フェーズ')>=0){
    setTimeout(function(){
      if(gs.phase!=='transport') hardHideTransport();
    }, 0);
    setTimeout(function(){
      if(gs.phase!=='transport') hardHideTransport();
    }, 50);
  }
}, true);
console.log('[transport hard hide] ready');
})();


// ═══ Market economy + audience staff ═══
window.MARKET_ECON = {"adviceCostGold":300,"labels":{"iron":"鉄","wood":"木材","niter":"硝石","herb":"薬草","food_mat":"兵糧","food":"兵糧","med":"回復薬","sword":"剣★1","siege_w":"衝車★1","gold":"金"},"baseBuy":{"iron":20,"wood":12,"niter":25,"herb":15,"food_mat":18,"med":999,"sword":999,"siege_w":999},"baseSell":{"iron":18,"wood":11,"niter":22,"herb":13,"food_mat":16,"med":30,"sword":45,"siege_w":55},"shopStart":{"iron":12,"wood":14,"niter":8,"herb":10,"food_mat":16,"med":0,"sword":0,"siege_w":0},"shopCapBase":{"iron":20,"wood":24,"niter":16,"herb":20,"food_mat":30,"med":6,"sword":0,"siege_w":0},"seasonRestock":{"0":{"herb":6,"food_mat":-2},"1":{"herb":6,"food_mat":-2},"2":{"food_mat":14,"herb":-1},"3":{"wood":8,"food_mat":-3,"herb":-2}},"productSell":{"sword":{"unlockedBy":"smith","buyable":false},"siege_w":{"unlockedBy":"smith","buyable":false},"med":{"unlockedBy":"pharmacy","buyable":false}},"horseSellByStar":{"1":80,"2":150,"3":280,"4":480,"5":800},"marketLines":[{"when":"autumn_food","text":"秋は兵糧がだぶついてます。買値、だいぶ下がりましたよ。"},{"when":"spring_herb","text":"春ですもの、薬草が市場に出回り始めてます。"},{"when":"summer_herb","text":"夏の薬草は質がいいんです。店にも積み増しました。"},{"when":"winter_wood","text":"冬は木材の入荷が増えます。暖炉の季節ですから。"},{"when":"low_stock","text":"在庫が薄い品は値上がり気味です。買いすぎ注意ですよ。"},{"when":"high_stock","text":"店が満杯気味の品はお安くしてます。まとめ買い、いかが？"},{"when":"product","text":"工房・薬房の完成品、買い取りますよ。解禁された品だけ並びます。"},{"when":"generic","text":"相場は動いてます。括弧の中が前期との差です。"},{"when":"generic","text":"同じ季節のうちの転売は損しやすいです。安い季節に仕入れて、足りない季節に出すと…ね。"},{"when":"generic","text":"回復薬は当店では販売してません。売るだけです。"},{"when":"generic","text":"兵糧は秋に仕入れが楽になります。覚えておいてください。"},{"when":"generic","text":"王様への進言は300両かかります。工房と薬と馬で稼いでくださいね。"}],"seasonStockDelta":{"0":{"herb":6,"food_mat":-2},"1":{"herb":6,"food_mat":-2},"2":{"food_mat":14,"herb":-1},"3":{"wood":8,"food_mat":-3,"herb":-2}},"shopMin":{"iron":2,"wood":2,"niter":1,"herb":2,"food_mat":4,"med":0,"sword":0,"siege_w":0},"ambientDelta":0,"priceMultMin":0.55,"priceMultMax":1.55,"sellToBuyRatio":0.9};
(function(){
'use strict';
if(window.__marketEcon) return;
window.__marketEcon = true;

var ME = window.MARKET_ECON || {};
var KEYS = ['iron','wood','niter','herb','food_mat','med'];
var LABELS = {iron:'鉄',wood:'木材',niter:'硝石',herb:'薬草',food_mat:'兵糧',med:'回復薬'};

function invKey(r){ return r==='food_mat' ? 'food' : r; }

function ensureMarket(){
  if(!gs.market){
    gs.market = {
      shop: Object.assign({}, ME.shopStart||{}),
      shopCap: Object.assign({}, ME.shopCapBase||{}),
      priceBuy: Object.assign({}, ME.baseBuy||{}),
      priceSell: Object.assign({}, ME.baseSell||{}),
      prevBuy: Object.assign({}, ME.baseBuy||{}),
      marketLv: 0
    };
  }
  if(!gs.facility){
    gs.facility = { smithStaff:0, pharmStaff:0, smithStaffMax:0, pharmStaffMax:0, marketLv:0, stableExtra:0 };
  }
  // IMPORTANT: do not call refreshFacilityUnlockCaps here if it calls ensureMarket (stack overflow)
  if(!ensureMarket._locking){
    ensureMarket._locking = true;
    try{ refreshFacilityUnlockCaps(); }finally{ ensureMarket._locking = false; }
  }
}

function clearedMax(route){
  var arr = (gs.cleared && gs.cleared[route]) || [];
  var m = 0;
  arr.forEach(function(n){ if(n>m) m=n; });
  // also treat current node-1 as progress if deeper
  var node = (gs.node && gs.node[route]) || 0;
  // cleared nodes are 1-based indices that were beaten
  return Math.max(m, 0);
}
/** staff slots unlocked by route breakthrough: N1→1, N2→2, N3→3 max 2 for +6 frames? user: N1 keeps unlock. 1人=+3枠, 1人ずつ. max 2 staff from N1 and N2? or N1 N2 N3 = 3?
 * Plan: N1→1人, N2→2人, N3→ still 2 or 3. User said 1人ずつ with N1. I'll do max 2: N1=1, N2+=1 (N3 no extra) OR N1=1 N2=2 N3=3.
 * "1人ずつ解放" + N1 included → N1 first person, N2 second. Cap 2. N3 no third to avoid 3*3=9 too much? User wondered 3 slots per person is a lot. max 2 staff.
 */
function staffUnlockMax(route){
  var cm = clearedMax(route);
  if(cm >= 2) return 2;
  if(cm >= 1) return 1;
  return 0;
}
function refreshFacilityUnlockCaps(){
  if(!gs.facility){
    gs.facility = { smithStaff:0, pharmStaff:0, smithStaffMax:0, pharmStaffMax:0, marketLv:0, stableExtra:0 };
  }
  if(!gs.market){
    gs.market = {
      shop: Object.assign({}, ME.shopStart||{}),
      shopCap: Object.assign({}, ME.shopCapBase||{}),
      priceBuy: Object.assign({}, ME.baseBuy||{}),
      priceSell: Object.assign({}, ME.baseSell||{}),
      prevBuy: Object.assign({}, ME.baseBuy||{})
    };
  }
  gs.facility.smithStaffMax = staffUnlockMax('siege');
  gs.facility.pharmStaffMax = staffUnlockMax('weapon');
  var foodMax = staffUnlockMax('food'); // market levels
  gs.facility.marketLvMax = foodMax;
  gs.facility.stableExtraMax = staffUnlockMax('horse');
  if(gs.facility.smithStaff > gs.facility.smithStaffMax) gs.facility.smithStaff = gs.facility.smithStaffMax;
  if(gs.facility.pharmStaff > gs.facility.pharmStaffMax) gs.facility.pharmStaff = gs.facility.pharmStaffMax;
  if((gs.facility.marketLv||0) > (gs.facility.marketLvMax||0)) gs.facility.marketLv = gs.facility.marketLvMax;
  if((gs.facility.stableExtra||0) > (gs.facility.stableExtraMax||0)) gs.facility.stableExtra = gs.facility.stableExtraMax;
  // apply market cap bonus
  var baseCap = ME.shopCapBase || {};
  KEYS.forEach(function(k){
    var b = baseCap[k]||10;
    gs.market.shopCap[k] = b + (gs.facility.marketLv||0)*8;
  });
  // ranch pairs
  if(gs.ranch){
    gs.ranch.maxPairs = 1 + (gs.facility.stableExtra||0);
  }
}

function smithCap(){ ensureMarket(); return 3 + (gs.facility.smithStaff||0)*3; }
function pharmCap(){ ensureMarket(); return 3 + (gs.facility.pharmStaff||0)*3; }
window.smithCap = smithCap;
window.pharmCap = pharmCap;

function priceFromStock(res){
  /* priceFromStock season-arb */
  if(typeof window.priceFromStock==='function' && window.priceFromStock!==priceFromStock){
    return window.priceFromStock(res);
  }
  var baseB = (ME.baseBuy&&ME.baseBuy[res])||20;
  var baseS = (ME.baseSell&&ME.baseSell[res])||16;
  if(res==='med') return {buy:999, sell:baseS};
  var cap = (gs.market.shopCap&&gs.market.shopCap[res])||20;
  var shop = (gs.market.shop&&gs.market.shop[res])||0;
  var ratio = cap>0 ? shop/cap : 0.5;
  if(ratio<0)ratio=0; if(ratio>1)ratio=1;
  var multMin = (ME.priceMultMin!=null)?ME.priceMultMin:0.55;
  var multMax = (ME.priceMultMax!=null)?ME.priceMultMax:1.55;
  var mult = multMax - ratio*(multMax-multMin);
  var buy = Math.max(1, Math.round(baseB * mult));
  var sratio = (ME.sellToBuyRatio!=null)?ME.sellToBuyRatio:0.9;
  var baseRatio = baseB>0 ? baseS/baseB : sratio;
  var useRatio = Math.min(sratio, baseRatio);
  if(useRatio>=1) useRatio=0.9;
  var sell = Math.max(1, Math.round(buy * useRatio));
  if(sell >= buy) sell = Math.max(1, buy-1);
  return {buy:buy, sell:sell};
}

function recomputePrices(savePrev){
  ensureMarket();
  if(savePrev){
    gs.market.prevBuy = Object.assign({}, gs.market.priceBuy||{});
  }
  KEYS.forEach(function(r){
    var p = priceFromStock(r);
    gs.market.priceBuy[r] = p.buy;
    gs.market.priceSell[r] = p.sell;
    // sync CFG.prices for existing calc
    if(CFG.prices && CFG.prices[r]){
      CFG.prices[r].buy = p.buy;
      CFG.prices[r].sell = p.sell;
    }
  });
}

function seasonRestock(){
  ensureMarket();
  var table = ME.seasonRestock || {};
  var add = table[String(gs.season)] || {};
  Object.keys(add).forEach(function(k){
    var cap = gs.market.shopCap[k]||20;
    gs.market.shop[k] = Math.min(cap, (gs.market.shop[k]||0) + add[k]);
  });
  // small ambient restock for all
  KEYS.forEach(function(k){
    if(k==='med') return;
    var cap = gs.market.shopCap[k]||20;
    gs.market.shop[k] = Math.min(cap, (gs.market.shop[k]||0) + 1);
  });
}

function deltaStr(res){
  var cur = (gs.market.priceBuy&&gs.market.priceBuy[res])||0;
  var prev = (gs.market.prevBuy&&gs.market.prevBuy[res]);
  if(prev==null) return '';
  var d = cur - prev;
  if(d===0) return '（±0）';
  return d>0 ? '（+'+d+'）' : '（'+d+'）';
}

function refreshMarketUI(){
  ensureMarket();
  recomputePrices(false);
  KEYS.forEach(function(r){
    var shopEl = document.getElementById('shop-'+r);
    var invEl = document.getElementById(r==='food_mat'?'inv-food_mat':(r==='med'?'inv-med':'inv-'+r));
    var priceEl = document.getElementById('price-'+r);
    if(shopEl){
      if(r==='med') shopEl.textContent = '—';
      else shopEl.textContent = String(gs.market.shop[r]!=null?gs.market.shop[r]:0);
    }
    if(invEl){
      if(r==='med') invEl.textContent = String(gs.stock.med||0);
      else if(r==='food_mat') invEl.textContent = String(gs.inv.food||0);
      else invEl.textContent = String(gs.inv[r]||0);
    }
    if(priceEl){
      if(r==='med') priceEl.textContent = '売'+gs.market.priceSell.med+'両';
      else {
        var d = deltaStr(r);
        priceEl.innerHTML = '売'+gs.market.priceSell[r]+'両 買'+gs.market.priceBuy[r]+'両'+
          (d ? ' <span style="color:var(--faded);font-size:10px">'+d+'</span>' : '');
      }
    }
  });
  // capacity labels
  var sc=document.getElementById('prod-smith-cap'); if(sc) sc.textContent=String(smithCap());
  var pc=document.getElementById('prod-pharm-cap'); if(pc) pc.textContent=String(pharmCap());
  var ss=document.getElementById('smith-staff-n'); if(ss) ss.textContent=String(gs.facility.smithStaff||0);
  var ps=document.getElementById('pharm-staff-n'); if(ps) ps.textContent=String(gs.facility.pharmStaff||0);
  // advice buttons enabled state
  refreshAdviceButtons();
  refreshMarketBubble();
}
window.refreshMarketUI = refreshMarketUI;

function refreshAdviceButtons(){
  ensureMarket();
  refreshFacilityUnlockCaps();
  function setBtn(id, ok, tip){
    var b=document.getElementById(id);
    if(!b) return;
    b.disabled = !ok;
    b.style.opacity = ok ? '1' : '0.35';
    b.title = tip || '';
  }
  setBtn('kg-staff-smith',
    (gs.facility.smithStaffMax||0) > (gs.facility.smithStaff||0),
    '兵器ルート突破数で解放（現在最大'+gs.facility.smithStaffMax+'人／雇用'+gs.facility.smithStaff+'）');
  setBtn('kg-staff-pharm',
    (gs.facility.pharmStaffMax||0) > (gs.facility.pharmStaff||0),
    '武器ルート突破で解放（最大'+gs.facility.pharmStaffMax+'）');
  setBtn('kg-market-up',
    (gs.facility.marketLvMax||0) > (gs.facility.marketLv||0),
    '兵糧ルート突破で解放（強化Lv'+gs.facility.marketLv+'/'+gs.facility.marketLvMax+'）');
  setBtn('kg-stable-up',
    (gs.facility.stableExtraMax||0) > (gs.facility.stableExtra||0),
    '馬ルート突破で解放（追加つがい枠'+gs.facility.stableExtra+'/'+gs.facility.stableExtraMax+'）');
}

function refreshMarketBubble(){
  var card=document.getElementById('card-market');
  if(!card) return;
  var bubble=card.querySelector('.bubble');
  if(!bubble) return;
  var lines = ME.marketLines || [];
  var season = gs.season;
  var candidates = [];
  lines.forEach(function(L){
    if(L.when==='generic') candidates.push(L.text);
    if(L.when==='spring_herb' && season===0) candidates.push(L.text);
    if(L.when==='summer_herb' && season===1) candidates.push(L.text);
    if(L.when==='autumn_food' && season===2) candidates.push(L.text);
    if(L.when==='winter_wood' && season===3) candidates.push(L.text);
    if(L.when==='low_stock'){
      var low = KEYS.some(function(k){ return k!=='med' && (gs.market.shop[k]||0) < 4; });
      if(low) candidates.push(L.text);
    }
    if(L.when==='high_stock'){
      var hi = KEYS.some(function(k){
        if(k==='med') return false;
        var cap=gs.market.shopCap[k]||1;
        return (gs.market.shop[k]||0) > cap*0.75;
      });
      if(hi) candidates.push(L.text);
    }
  });
  if(!candidates.length) candidates.push('相場は動いています。');
  var text = candidates[Math.floor(Math.random()*candidates.length)];
  bubble.textContent = text;
}

// Override buy/sell/confirmTrade
window.buy = function(res, delta){
  ensureMarket();
  recomputePrices(false);
  var pBuy = gs.market.priceBuy[res];
  if(pBuy>=999) return;
  var cur = gs.buy[res]||0;
  var nv = Math.max(0, cur+delta);
  if(delta>0){
    var shop = gs.market.shop[res]||0;
    if(nv > shop) nv = shop; // can't buy more than shop
    // gold check
    var cost = 0;
    Object.keys(gs.buy||{}).forEach(function(r){
      if(r===res) return;
      cost += (gs.buy[r]||0)*(gs.market.priceBuy[r]||0);
    });
    cost += nv * pBuy;
    var income = 0;
    Object.keys(gs.sellQ||{}).forEach(function(r){
      income += (gs.sellQ[r]||0)*(gs.market.priceSell[r]||0);
    });
    if(gs.gold - cost + income < 0) return;
  }
  gs.buy[res]=nv;
  var el=document.getElementById('buy-'+res); if(el) el.textContent=nv;
  if(typeof updateTradeTotals==='function') updateTradeTotals();
};

window.sell = function(res, delta){
  ensureMarket();
  recomputePrices(false);
  var avail = res==='med' ? (gs.stock.med||0) : (gs.inv[invKey(res)]||0);
  var nv = Math.max(0, Math.min(avail, (gs.sellQ[res]||0)+delta));
  gs.sellQ[res]=nv;
  var el=document.getElementById('sell-'+res); if(el) el.textContent=nv;
  if(typeof updateTradeTotals==='function') updateTradeTotals();
};

window.calcBuyCost = function(){
  ensureMarket();
  return Object.entries(gs.buy||{}).reduce(function(s, e){
    return s + e[1]*(gs.market.priceBuy[e[0]]||CFG.prices[e[0]]&&CFG.prices[e[0]].buy||0);
  }, 0);
};
window.calcSellIncome = function(){
  ensureMarket();
  return Object.entries(gs.sellQ||{}).reduce(function(s, e){
    return s + e[1]*(gs.market.priceSell[e[0]]||0);
  }, 0);
};
window.calcTradeNet = function(){ return window.calcSellIncome() - window.calcBuyCost(); };

window.confirmTrade = function(){
  ensureMarket();
  recomputePrices(false);
  var net = window.calcTradeNet();
  if(gs.gold + net < 0){ showToast('金が足りません'); return; }
  // validate shop stock
  for(var r in gs.buy){
    if((gs.buy[r]||0) > (gs.market.shop[r]||0)){ showToast('店の在庫が足りません'); return; }
  }
  gs.gold += net;
  Object.keys(gs.buy||{}).forEach(function(r){
    var q = gs.buy[r]||0;
    if(!q) return;
    gs.market.shop[r] = Math.max(0, (gs.market.shop[r]||0) - q);
    if(r==='food_mat') gs.inv.food = (gs.inv.food||0) + q;
    else gs.inv[r] = (gs.inv[r]||0) + q;
  });
  Object.keys(gs.sellQ||{}).forEach(function(r){
    var q = gs.sellQ[r]||0;
    if(!q) return;
    if(r==='med') gs.stock.med = Math.max(0, (gs.stock.med||0)-q);
    else if(r==='food_mat') gs.inv.food = Math.max(0, (gs.inv.food||0)-q);
    else gs.inv[r] = Math.max(0, (gs.inv[r]||0)-q);
    if(r!=='med'){
      var cap = gs.market.shopCap[r]||20;
      gs.market.shop[r] = Math.min(cap, (gs.market.shop[r]||0) + q);
    }
  });
  gs.buy={}; gs.sellQ={};
  Object.keys(CFG.prices||{}).forEach(function(r){
    ['buy-','sell-'].forEach(function(pre){
      var e=document.getElementById(pre+r); if(e) e.textContent=0;
    });
  });
  // 前期比はターン進行時のみ更新（売買では prevBuy を上書きしない）
  recomputePrices(false);
  if(typeof updateTradeTotals==='function') updateTradeTotals();
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updateInvDisplay==='function') updateInvDisplay();
  refreshMarketUI();
  showToast('売買を確定しました');
};

// produce uses dynamic cap
var __produce = window.produce || (typeof produce==='function'?produce:null);
if(__produce){
  // replace produce entirely lightly
}
window.produce = function(item, delta){
  ensureMarket();
  var isPharma = item==='med';
  var cap = isPharma ? pharmCap() : smithCap();
  var group = isPharma ? ['med'] : ['sword','siege_w'];
  var used = group.reduce(function(s,k){ return s+(gs.prod[k]||0); }, 0);
  var nv = (gs.prod[item]||0) + delta;
  if(nv<0 || used+delta>cap) return;
  var ironNeed = (gs.prod.sword||0) + (item==='sword'?delta:0);
  var woodNeed = ((gs.prod.siege_w||0) + (item==='siege_w'?delta:0))*2;
  var herbNeed = (gs.prod.med||0) + (item==='med'?delta:0);
  if(!isPharma && (ironNeed>(gs.inv.iron||0) || woodNeed>(gs.inv.wood||0))) return;
  if(isPharma && herbNeed>(gs.inv.herb||0)) return;
  gs.prod[item]=nv;
  var set=function(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; };
  set('prod-'+item, nv);
  set('prod-smith-used', (gs.prod.sword||0)+(gs.prod.siege_w||0));
  set('prod-pharm-used', gs.prod.med||0);
  set('prod-smith-cap', smithCap());
  set('prod-pharm-cap', pharmCap());
  set('prod-鉄-cost', gs.prod.sword||0);
  set('prod-iron-cost', gs.prod.sword||0);
  set('prod-wood-cost', (gs.prod.siege_w||0)*2);
  set('prod-herb-cost', gs.prod.med||0);
};
if(typeof produce==='function') produce = window.produce;

// kgPick labels + pending apply next turn
var SHINGEN_LABELS = {
  iron:'鉄増産', wood:'木材増産', food_mat:'兵糧増産', horse_find:'名馬探索',
  staff_smith:'工房に人を増やす', staff_pharm:'薬房に人を増やす',
  market_up:'市場を強化', stable_up:'厩舎を拡張', commend:'王子を褒める'
};

var __kg = window.kgPick || (typeof kgPick==='function'?kgPick:null);
window.kgPick = function(type, val, btn){
  ensureMarket();
  refreshFacilityUnlockCaps();
  if(type==='kenjou'){ showToast('献上は廃止されました'); return; }
  if(val==='staff_smith'){
    if((gs.facility.smithStaff||0) >= (gs.facility.smithStaffMax||0)){
      showToast('工房の人員はこれ以上増やせません（兵器ルート突破が必要）'); return;
    }
  }
  if(val==='staff_pharm'){
    if((gs.facility.pharmStaff||0) >= (gs.facility.pharmStaffMax||0)){
      showToast('薬房の人員はこれ以上増やせません（武器ルート突破が必要）'); return;
    }
  }
  if(val==='market_up'){
    if((gs.facility.marketLv||0) >= (gs.facility.marketLvMax||0)){
      showToast('市場強化は兵糧ルート突破が必要です'); return;
    }
  }
  if(val==='stable_up'){
    if((gs.facility.stableExtra||0) >= (gs.facility.stableExtraMax||0)){
      showToast('厩舎拡張は馬ルート突破が必要です'); return;
    }
  }
  if(__kg) __kg(type, val, btn);
  else {
    gs.kengen = gs.kengen || {};
    gs.kengen[type]=val;
  }
  // update result text
  var kr=document.getElementById('kg-result');
  if(kr && gs.kengen && gs.kengen.shingen){
    kr.textContent = '進言：'+(SHINGEN_LABELS[gs.kengen.shingen]||gs.kengen.shingen)+'　→ 次ターンより有効';
  }
};
if(typeof kgPick==='function') kgPick = window.kgPick;

function applyPendingAdvice(){
  ensureMarket();
  var v = gs.kengen && gs.kengen.shingen;
  if(!v) return;
  refreshFacilityUnlockCaps();
  if(v==='staff_smith' && (gs.facility.smithStaff||0) < (gs.facility.smithStaffMax||0)){
    gs.facility.smithStaff = (gs.facility.smithStaff||0)+1;
    showToast('工房の人員+1（枠'+smithCap()+'）');
  }
  if(v==='staff_pharm' && (gs.facility.pharmStaff||0) < (gs.facility.pharmStaffMax||0)){
    gs.facility.pharmStaff = (gs.facility.pharmStaff||0)+1;
    showToast('薬房の人員+1（枠'+pharmCap()+'）');
  }
  if(v==='market_up' && (gs.facility.marketLv||0) < (gs.facility.marketLvMax||0)){
    gs.facility.marketLv = (gs.facility.marketLv||0)+1;
    refreshFacilityUnlockCaps();
    showToast('市場を強化しました（店在庫上限アップ）');
  }
  if(v==='stable_up' && (gs.facility.stableExtra||0) < (gs.facility.stableExtraMax||0)){
    gs.facility.stableExtra = (gs.facility.stableExtra||0)+1;
    if(gs.ranch) gs.ranch.maxPairs = 1 + gs.facility.stableExtra;
    showToast('厩舎を拡張しました（つがい枠'+(1+gs.facility.stableExtra)+'）');
  }
}

// goToNextTurn: season market + advice apply
(function(){
  var orig = window.goToNextTurn || (typeof goToNextTurn==='function'?goToNextTurn:null);
  if(!orig) return;
  window.goToNextTurn = function(){
    ensureMarket();
    applyPendingAdvice();
    var r = orig.apply(this, arguments);
    // after turn advance
    try{
      ensureMarket();
      seasonRestock();
      recomputePrices(true);
      refreshMarketUI();
    }catch(e){ console.warn('market turn', e); }
    return r;
  };
  if(typeof goToNextTurn==='function') goToNextTurn = window.goToNextTurn;
})();

// openCard market refresh
(function(){
  var prev = window.openCard || (typeof openCard==='function'?openCard:null);
  if(!prev) return;
  window.openCard = function(name){
    prev(name);
    if(name==='market' || name==='smith' || name==='pharmacy'){
      ensureMarket();
      refreshMarketUI();
    }
  };
  if(typeof openCard==='function') openCard = window.openCard;
})();

// updateInvDisplay also refresh market columns
(function(){
  var prev = window.updateInvDisplay || (typeof updateInvDisplay==='function'?updateInvDisplay:null);
  if(!prev) return;
  window.updateInvDisplay = function(){
    prev();
    try{ refreshMarketUI(); }catch(e){}
  };
  if(typeof updateInvDisplay==='function') updateInvDisplay = window.updateInvDisplay;
})();

// buildResultScreen: advice labels + horse seasonal reports
(function(){
  var prev = window.buildResultScreen || (typeof buildResultScreen==='function'?buildResultScreen:null);
  if(!prev) return;
  window.buildResultScreen = function(){
    prev.apply(this, arguments);
    // kengen labels
    var kng=document.getElementById('result-kengen');
    if(kng && gs.kengen && gs.kengen.shingen){
      var lab = SHINGEN_LABELS[gs.kengen.shingen] || gs.kengen.shingen;
      kng.innerHTML = '<div>📜 進言：<b>'+lab+'</b>　→ 次ターンより有効</div>';
    } else if(kng && (!gs.kengen || !gs.kengen.shingen)){
      // leave previous
    }
    // Horse result reports (end-of-season perspective: current season is the one that just "ended" for report)
    // When buildResult runs, season is still current turn's season before goToNextTurn
    try{
      var log = document.getElementById('result-log');
      if(!log || !gs.ranch) return;
      var s = gs.season;
      var notes = [];
      if(s===1){ // 夏の結果
        notes.push('🐎 馬も元気だ。そろそろ番を考えてあげよう。');
      } else if(s===2){ // 秋の結果
        if(gs.ranch.autumnCoupled || (gs.ranch.pairs&&gs.ranch.pairs.length)){
          notes.push('🐎 馬の夫婦は仲良さそうだ。今度、食料と薬を与えてみよう。');
        } else {
          notes.push('🐎 今秋は番を組まなかった。牧場は静かだ。');
        }
      } else if(s===3){ // 冬の結果
        var parts=[];
        if(gs.ranch.winterFoodDone) parts.push('兵糧');
        if(gs.ranch.winterMedDone) parts.push('回復薬');
        if(parts.length) notes.push('🐎 餌として'+parts.join('と')+'を与えた。');
        else notes.push('🐎 今冬は特別な餌やりをしなかった。');
      } else if(s===0){
        // spring result often after births already logged by v2
      }
      notes.forEach(function(t){
        var d=document.createElement('div');
        d.className='log-line log-info show';
        d.textContent=t;
        log.appendChild(d);
      });
    }catch(e){}
  };
  if(typeof buildResultScreen==='function') buildResultScreen = window.buildResultScreen;
})();

// Suppress old v2 spring/autumn pushy logs somewhat — leave them, result adds clearer ones

// init
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    ensureMarket();
    recomputePrices(true);
    refreshMarketUI();
  }, 90);
});
if(document.readyState!=='loading'){
  setTimeout(function(){ ensureMarket(); recomputePrices(true); refreshMarketUI(); }, 90);
}

console.log('[market+audience] ready');
})();


// ═══ kengen UI + market stack fix + goToMgmt ═══
(function(){
'use strict';
if(window.__kengenUiFix) return;
window.__kengenUiFix = true;

// --- UI_SETTINGS (editable labels) ---
window.UI_SETTINGS = window.UI_SETTINGS || {
  label_staff_smith: '工房増員',
  label_staff_pharm: '薬房増員',
  label_market_up: '市場強化',
  label_stable_up: '厩舎拡張',
  effect_boost: '効果：店の{mat}在庫を約1年分（季節補充×4）増やす',
  effect_staff_smith: '効果：工房の生産枠+3　条件：攻三城が戦線を突破時に解放',
  effect_staff_pharm: '効果：薬房の生産枠+3　条件：武刃四が戦線を突破時に解放',
  effect_market_up: '効果：店在庫の上限アップ　条件：兵糧太が戦線を突破時に解放',
  effect_stable_up: '効果：つがい枠+1　条件：騎馬次が戦線を突破時に解放',
  effect_horse_find: '効果：次ターン開始時、牧場に馬（★1〜2）が1頭加わる',
  effect_commend: '効果：選んだ皇子の信頼度+10',
  cond_locked_prefix: '（未解放）'
};

function applyUiSettingLabels(){
  var U = window.UI_SETTINGS || {};
  function setTxt(id, t){ var e=document.getElementById(id); if(e && t) e.textContent=t; }
  setTxt('kg-label-staff-smith', U.label_staff_smith);
  setTxt('kg-label-staff-pharm', U.label_staff_pharm);
  setTxt('kg-label-market-up', U.label_market_up);
  setTxt('kg-label-stable-up', U.label_stable_up);
  setTxt('kg-eff-staff-smith', U.effect_staff_smith);
  setTxt('kg-eff-staff-pharm', U.effect_staff_pharm);
  setTxt('kg-eff-market-up', U.effect_market_up);
  setTxt('kg-eff-stable-up', U.effect_stable_up);
}

// --- Break ensureMarket <-> refreshFacilityUnlockCaps loop ---
if(typeof ensureMarket === 'function' || typeof window.ensureMarket === 'function'){
  // redefine carefully if market module exists
}
// Patch by wrapping after market loads - replace recursive calls
// We re-define the two functions if MARKET_ECON present
if(window.__marketEcon || window.MARKET_ECON){
  var ME = window.MARKET_ECON || {};
  var KEYS = ['iron','wood','niter','herb','food_mat','med'];

  function clearedMax(route){
    var arr = (gs.cleared && gs.cleared[route]) || [];
    var m = 0;
    arr.forEach(function(n){ if(n>m) m=n; });
    return m;
  }
  function staffUnlockMax(route){
    var cm = clearedMax(route);
    if(cm >= 2) return 2;
    if(cm >= 1) return 1;
    return 0;
  }

  window.refreshFacilityUnlockCaps = function(){
    if(!gs.facility){
      gs.facility = { smithStaff:0, pharmStaff:0, smithStaffMax:0, pharmStaffMax:0, marketLv:0, stableExtra:0 };
    }
    if(!gs.market){
      // minimal market without calling ensureMarket
      gs.market = {
        shop: Object.assign({}, ME.shopStart||{}),
        shopCap: Object.assign({}, ME.shopCapBase||{}),
        priceBuy: Object.assign({}, ME.baseBuy||{}),
        priceSell: Object.assign({}, ME.baseSell||{}),
        prevBuy: Object.assign({}, ME.baseBuy||{})
      };
    }
    gs.facility.smithStaffMax = staffUnlockMax('siege');
    gs.facility.pharmStaffMax = staffUnlockMax('weapon');
    gs.facility.marketLvMax = staffUnlockMax('food');
    gs.facility.stableExtraMax = staffUnlockMax('horse');
    if(gs.facility.smithStaff > gs.facility.smithStaffMax) gs.facility.smithStaff = gs.facility.smithStaffMax;
    if(gs.facility.pharmStaff > gs.facility.pharmStaffMax) gs.facility.pharmStaff = gs.facility.pharmStaffMax;
    if((gs.facility.marketLv||0) > (gs.facility.marketLvMax||0)) gs.facility.marketLv = gs.facility.marketLvMax;
    if((gs.facility.stableExtra||0) > (gs.facility.stableExtraMax||0)) gs.facility.stableExtra = gs.facility.stableExtraMax;
    var baseCap = ME.shopCapBase || {};
    KEYS.forEach(function(k){
      var b = baseCap[k]||10;
      if(!gs.market.shopCap) gs.market.shopCap = {};
      gs.market.shopCap[k] = b + (gs.facility.marketLv||0)*8;
    });
    if(gs.ranch) gs.ranch.maxPairs = 1 + (gs.facility.stableExtra||0);
  };

  window.ensureMarket = function(){
    if(!gs.market){
      gs.market = {
        shop: Object.assign({}, ME.shopStart||{}),
        shopCap: Object.assign({}, ME.shopCapBase||{}),
        priceBuy: Object.assign({}, ME.baseBuy||{}),
        priceSell: Object.assign({}, ME.baseSell||{}),
        prevBuy: Object.assign({}, ME.baseBuy||{}),
        marketLv: 0
      };
    }
    if(!gs.facility){
      gs.facility = { smithStaff:0, pharmStaff:0, smithStaffMax:0, pharmStaffMax:0, marketLv:0, stableExtra:0 };
    }
    // call unlock once — does NOT call ensureMarket again
    window.refreshFacilityUnlockCaps();
  };

  // year restock amount for one resource = sum of seasonal table for that key * 4 seasons approx
  function yearRestockAmount(res){
    var table = ME.seasonRestock || {};
    var total = 0;
    Object.keys(table).forEach(function(s){
      if(table[s][res]) total += table[s][res];
    });
    // also ambient +1 * 4
    if(res !== 'med') total += 4;
    // if resource not in seasonal table (iron, niter), give a base pack
    if(total <= 4){
      if(res==='iron') total = 12;
      else if(res==='niter') total = 8;
      else if(res==='wood') total = 8+4;
      else if(res==='herb') total = 6*2+4;
      else if(res==='food_mat') total = 12+4;
    }
    return total;
  }
  window.yearRestockAmount = yearRestockAmount;

  function applyBoostShop(res){
    window.ensureMarket();
    if(res==='med') return;
    var key = res === 'food' ? 'food_mat' : res;
    var amt = yearRestockAmount(key);
    var cap = (gs.market.shopCap && gs.market.shopCap[key]) || 99;
    gs.market.shop[key] = Math.min(cap, (gs.market.shop[key]||0) + amt);
    if(typeof recomputePrices==='function') recomputePrices(false);
    else if(typeof window.recomputePrices==='function') window.recomputePrices(false);
    showToast((LABELS_MAT[key]||key)+'の店在庫 +'+amt+'（約1年分）');
  }
  var LABELS_MAT = {iron:'鉄',wood:'木材',niter:'硝石',herb:'薬草',food_mat:'兵糧'};

  // Override applyPendingAdvice to include boost + commend
  window.applyPendingAdvice = function(){
    window.ensureMarket();
    var v = gs.kengen && gs.kengen.shingen;
    if(!v) return;
    window.refreshFacilityUnlockCaps();
    if(v==='iron'||v==='wood'||v==='niter'||v==='herb'||v==='food_mat'){
      applyBoostShop(v);
    }
    if(v==='staff_smith' && (gs.facility.smithStaff||0) < (gs.facility.smithStaffMax||0)){
      gs.facility.smithStaff = (gs.facility.smithStaff||0)+1;
      showToast('工房増員（枠'+(3+gs.facility.smithStaff*3)+'）');
    }
    if(v==='staff_pharm' && (gs.facility.pharmStaff||0) < (gs.facility.pharmStaffMax||0)){
      gs.facility.pharmStaff = (gs.facility.pharmStaff||0)+1;
      showToast('薬房増員（枠'+(3+gs.facility.pharmStaff*3)+'）');
    }
    if(v==='market_up' && (gs.facility.marketLv||0) < (gs.facility.marketLvMax||0)){
      gs.facility.marketLv = (gs.facility.marketLv||0)+1;
      window.refreshFacilityUnlockCaps();
      showToast('市場を強化しました');
    }
    if(v==='stable_up' && (gs.facility.stableExtra||0) < (gs.facility.stableExtraMax||0)){
      gs.facility.stableExtra = (gs.facility.stableExtra||0)+1;
      if(gs.ranch) gs.ranch.maxPairs = 1 + gs.facility.stableExtra;
      showToast('厩舎拡張（つがい枠'+(1+gs.facility.stableExtra)+'）');
    }
    if(v==='commend'){
      var sel = document.getElementById('kg-commend-sel');
      var pk = (gs.kengen && gs.kengen.commendTarget) || (sel && sel.value) || 'food';
      if(gs.trust && pk in gs.trust){
        gs.trust[pk] = Math.min(100, (gs.trust[pk]||0)+10);
        showToast((typeof PNAMES!=='undefined'&&PNAMES[pk]?PNAMES[pk]:pk)+'の信頼度 +10');
      }
    }
    if(v==='horse_find' && typeof grantHorseFind==='function'){
      // still granted in other hooks; skip double if already
    }
  };

  // refreshAdviceButtons with locked class + effect text
  window.refreshAdviceButtons = function(){
    window.ensureMarket();
    window.refreshFacilityUnlockCaps();
    applyUiSettingLabels();
    function setLock(id, unlocked, lockedReason){
      var b=document.getElementById(id);
      if(!b) return;
      b.disabled = !unlocked;
      b.classList.toggle('locked-opt', !unlocked);
      b.style.opacity = unlocked ? '1' : '0.45';
      var eff = b.querySelector('.kg-effect');
      if(eff && !unlocked && lockedReason){
        // keep base effect, ensure condition visible
        if(eff.textContent.indexOf('条件：')<0){
          eff.textContent += '　'+lockedReason;
        }
      }
    }
    setLock('kg-staff-smith', (gs.facility.smithStaffMax||0)>(gs.facility.smithStaff||0),
      '条件：攻三城が戦線を突破時に解放');
    setLock('kg-staff-pharm', (gs.facility.pharmStaffMax||0)>(gs.facility.pharmStaff||0),
      '条件：武刃四が戦線を突破時に解放');
    setLock('kg-market-up', (gs.facility.marketLvMax||0)>(gs.facility.marketLv||0),
      '条件：兵糧太が戦線を突破時に解放');
    setLock('kg-stable-up', (gs.facility.stableExtraMax||0)>(gs.facility.stableExtra||0),
      '条件：騎馬次が戦線を突破時に解放');
  };
}

// kgPick: store commend target, no recursion
window.kgPick = function(type, val, btn){
  try{
    if(type==='kenjou'){ showToast('献上は廃止されました'); return; }
    if(typeof window.ensureMarket==='function') window.ensureMarket();
    if(typeof window.refreshFacilityUnlockCaps==='function') window.refreshFacilityUnlockCaps();

    if(val==='staff_smith' && gs.facility && (gs.facility.smithStaff||0) >= (gs.facility.smithStaffMax||0)){
      showToast('工房増員は未解放か上限です（攻三城の戦線突破が必要）'); return;
    }
    if(val==='staff_pharm' && gs.facility && (gs.facility.pharmStaff||0) >= (gs.facility.pharmStaffMax||0)){
      showToast('薬房増員は未解放か上限です（武刃四の戦線突破が必要）'); return;
    }
    if(val==='market_up' && gs.facility && (gs.facility.marketLv||0) >= (gs.facility.marketLvMax||0)){
      showToast('市場強化は未解放か上限です（兵糧太の戦線突破が必要）'); return;
    }
    if(val==='stable_up' && gs.facility && (gs.facility.stableExtra||0) >= (gs.facility.stableExtraMax||0)){
      showToast('厩舎拡張は未解放か上限です（騎馬次の戦線突破が必要）'); return;
    }

    gs.kengen = gs.kengen || {shingen:null, kenjou:null};
    gs.kengen[type] = val;
    if(val==='commend'){
      var sel=document.getElementById('kg-commend-sel');
      gs.kengen.commendTarget = sel ? sel.value : 'food';
    }

    document.querySelectorAll('#kg-shingen .kg-opt').forEach(function(b){
      b.classList.remove('chosen');
      var sub=b.querySelector('.kg-sub');
      if(sub) sub.classList.remove('show');
    });
    if(btn){
      btn.classList.add('chosen');
      var sub2=btn.querySelector('.kg-sub');
      if(sub2) sub2.classList.add('show');
    }
    // show commend select when chosen
    var csel=document.getElementById('kg-commend-sel');
    if(csel){
      if(val==='commend') csel.classList.add('show');
      else csel.classList.remove('show');
    }

    var labels = {
      iron:'鉄増産', wood:'木材増産', food_mat:'兵糧増産', herb:'薬草増産', horse_find:'名馬探索',
      staff_smith:(window.UI_SETTINGS&&window.UI_SETTINGS.label_staff_smith)||'工房増員',
      staff_pharm:(window.UI_SETTINGS&&window.UI_SETTINGS.label_staff_pharm)||'薬房増員',
      market_up:(window.UI_SETTINGS&&window.UI_SETTINGS.label_market_up)||'市場強化',
      stable_up:(window.UI_SETTINGS&&window.UI_SETTINGS.label_stable_up)||'厩舎拡張',
      commend:'皇子を褒める'
    };
    var kr=document.getElementById('kg-result');
    if(kr){
      var extra = '';
      if(val==='commend' && gs.kengen.commendTarget && typeof PNAMES!=='undefined'){
        extra = '（'+ (PNAMES[gs.kengen.commendTarget]||gs.kengen.commendTarget) +'）';
      }
      kr.textContent = '進言：'+(labels[val]||val)+extra+'　→ 次ターンより有効';
    }
  }catch(e){
    console.error('kgPick', e);
    showToast('進言の選択でエラー');
  }
};

// Hard goToMgmt / tryGoToMgmt (no stack)
window.goToMgmt = function(){
  try{
    if(typeof closeOverlay==='function') closeOverlay();
    var ov=document.getElementById('overlay');
    if(ov){ ov.classList.remove('on'); ov.style.display='none'; ov.style.visibility='hidden'; }
    gs.phase = 'management';
    if(typeof setPhase==='function') setPhase('management');
    else if(typeof window.setPhase==='function') window.setPhase('management');
  }catch(e){
    console.error('goToMgmt', e);
    gs.phase='management';
    try{ setPhase('management'); }catch(e2){}
  }
};
window.tryGoToMgmt = function(){
  try{
    var all = true;
    if(typeof PKEYS!=='undefined'){
      all = PKEYS.every(function(k){ return gs.choices && gs.choices[k]!==undefined; });
    }
    if(!all){
      if(!confirm('すべての返信が終わっていませんが大丈夫ですか？')) return;
    }
    if(typeof markLettersConsumedForTurn==='function') markLettersConsumedForTurn();
    window.goToMgmt();
  }catch(e){
    console.error('tryGoToMgmt', e);
    window.goToMgmt();
  }
};
// wire button
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    applyUiSettingLabels();
    if(typeof window.refreshAdviceButtons==='function') window.refreshAdviceButtons();
    var btn=document.getElementById('ph-letter-complete');
    if(btn){
      btn.disabled=false;
      btn.onclick = function(ev){ if(ev) ev.preventDefault(); window.tryGoToMgmt(); };
      btn.setAttribute('onclick','tryGoToMgmt()');
    }
  }, 50);
  setTimeout(function(){
    if(typeof window.refreshAdviceButtons==='function') window.refreshAdviceButtons();
  }, 200);
});

// commend select change updates target
document.addEventListener('change', function(ev){
  if(ev.target && ev.target.id==='kg-commend-sel'){
    if(gs.kengen) gs.kengen.commendTarget = ev.target.value;
  }
});

console.log('[kengen UI fix] ready');
})();


// ═══ advice cost + product/horse sell ═══
(function(){
'use strict';
if(window.__adviceSellFix) return;
window.__adviceSellFix = true;

var ME = window.MARKET_ECON || {};
var RAW_KEYS = ['iron','wood','niter','herb','food_mat','med'];
var PROD_KEYS = ['sword','siege_w','med'];
var ALL_TRADE = ['iron','wood','niter','herb','food_mat','med','sword','siege_w'];

function adviceCost(){
  var c = (window.MARKET_ECON && window.MARKET_ECON.adviceCostGold);
  if(c==null) c = 300;
  return c|0;
}

function matLabel(k){
  var L = (window.MARKET_ECON && window.MARKET_ECON.labels) || {};
  if(L[k]) return L[k];
  var fallback = {iron:'鉄',wood:'木材',niter:'硝石',herb:'薬草',food_mat:'兵糧',food:'兵糧',med:'回復薬',sword:'剣★1',siege_w:'衝車★1'};
  return fallback[k]||k;
}

/** 生産物が市場で売れるか（施設が経営で使える＝解禁済み） */
function isProductSellUnlocked(item){
  // 現時点: 工房・薬房は経営フェーズ開始から利用可。将来は unlock フラグを見る
  var meta = (window.MARKET_ECON && window.MARKET_ECON.productSell && window.MARKET_ECON.productSell[item]) || null;
  if(meta && meta.unlockedBy === 'smith'){
    // 工房レシピが存在する＝解禁
    var rs = (typeof CFG!=='undefined' && CFG.recipes_smith) || (window.GAME_DATA && window.GAME_DATA.recipes_smith) || {};
    return !!rs[item] || item==='sword' || item==='siege_w';
  }
  if(meta && meta.unlockedBy === 'pharmacy'){
    var rp = (typeof CFG!=='undefined' && CFG.recipes_pharmacy) || (window.GAME_DATA && window.GAME_DATA.recipes_pharmacy) || {};
    return !!rp[item] || item==='med';
  }
  // default: known products
  if(item==='sword'||item==='siege_w'||item==='med') return true;
  return false;
}
window.isProductSellUnlocked = isProductSellUnlocked;

function stockOf(res){
  if(res==='med') return gs.stock && gs.stock.med || 0;
  if(res==='sword') return gs.stock && gs.stock.sword || 0;
  if(res==='siege_w') return gs.stock && gs.stock.siege_w || 0;
  if(res==='food_mat') return gs.inv && gs.inv.food || 0;
  return gs.inv && gs.inv[res] || 0;
}

function deductStock(res, q){
  if(res==='med') gs.stock.med = Math.max(0, (gs.stock.med||0)-q);
  else if(res==='sword') gs.stock.sword = Math.max(0, (gs.stock.sword||0)-q);
  else if(res==='siege_w') gs.stock.siege_w = Math.max(0, (gs.stock.siege_w||0)-q);
  else if(res==='food_mat') gs.inv.food = Math.max(0, (gs.inv.food||0)-q);
  else gs.inv[res] = Math.max(0, (gs.inv[res]||0)-q);
}

// price for products: fixed baseSell (not shop-ratio) unless recompute includes them
function productSellPrice(res){
  var ME2 = window.MARKET_ECON || {};
  if(gs.market && gs.market.priceSell && gs.market.priceSell[res]!=null)
    return gs.market.priceSell[res];
  return (ME2.baseSell && ME2.baseSell[res]) || 0;
}

// wrap ensureMarket to init product prices
var _ens = window.ensureMarket;
window.ensureMarket = function(){
  if(typeof _ens==='function') _ens();
  else if(typeof ensureMarket==='function' && ensureMarket!==window.ensureMarket) ensureMarket();
  if(!gs.market) return;
  var ME2 = window.MARKET_ECON || {};
  ['sword','siege_w','med'].forEach(function(k){
    if(gs.market.priceSell[k]==null) gs.market.priceSell[k] = (ME2.baseSell&&ME2.baseSell[k])||0;
    if(gs.market.priceBuy[k]==null) gs.market.priceBuy[k] = 999;
    if(gs.market.shop[k]==null) gs.market.shop[k] = 0;
  });
  if(!gs.stock) gs.stock = {sword:0,siege_w:0,med:0};
  if(gs.stock.sword==null) gs.stock.sword=0;
  if(gs.stock.siege_w==null) gs.stock.siege_w=0;
  if(gs.stock.med==null) gs.stock.med=0;
};

// recomputePrices: keep product sell at base (fixed)
var _recomp = window.recomputePrices;
window.recomputePrices = function(savePrev){
  if(typeof _recomp==='function') _recomp(savePrev);
  var ME2 = window.MARKET_ECON || {};
  if(gs.market && gs.market.priceSell){
    ['sword','siege_w','med'].forEach(function(k){
      gs.market.priceSell[k] = (ME2.baseSell&&ME2.baseSell[k])||gs.market.priceSell[k]||0;
      gs.market.priceBuy[k] = 999;
    });
  }
};

// sell override with products
window.sell = function(res, delta){
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  if(typeof window.recomputePrices==='function') window.recomputePrices(false);
  if(PROD_KEYS.indexOf(res)>=0 && !isProductSellUnlocked(res)){
    showToast(matLabel(res)+'はまだ売却解禁されていません');
    return;
  }
  var avail = stockOf(res);
  var nv = Math.max(0, Math.min(avail, (gs.sellQ[res]||0)+delta));
  gs.sellQ = gs.sellQ || {};
  gs.sellQ[res]=nv;
  var el=document.getElementById('sell-'+res); if(el) el.textContent=nv;
  if(typeof updateTradeTotals==='function') updateTradeTotals();
  else if(typeof window.updateTradeTotals==='function') window.updateTradeTotals();
};

window.calcSellIncome = function(){
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  var sum = 0;
  Object.keys(gs.sellQ||{}).forEach(function(r){
    var q = gs.sellQ[r]||0;
    if(!q) return;
    var p;
    if(r==='sword'||r==='siege_w'||r==='med') p = productSellPrice(r);
    else p = (gs.market.priceSell&&gs.market.priceSell[r])||0;
    sum += q * p;
  });
  return sum;
};

window.calcBuyCost = function(){
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  var sum = 0;
  Object.keys(gs.buy||{}).forEach(function(r){
    var q = gs.buy[r]||0;
    if(!q) return;
    if(r==='sword'||r==='siege_w'||r==='med') return; // not buyable
    sum += q * ((gs.market.priceBuy&&gs.market.priceBuy[r])||0);
  });
  return sum;
};

window.calcTradeNet = function(){
  return window.calcSellIncome() - window.calcBuyCost();
};

window.confirmTrade = function(){
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  if(typeof window.recomputePrices==='function') window.recomputePrices(false);
  var net = window.calcTradeNet();
  if(gs.gold + net < 0){ showToast('金が足りません'); return; }
  for(var r in (gs.buy||{})){
    if((gs.buy[r]||0) > (gs.market.shop[r]||0)){ showToast('店の在庫が足りません'); return; }
  }
  // validate sells
  for(var r2 in (gs.sellQ||{})){
    var q2 = gs.sellQ[r2]||0;
    if(q2 > stockOf(r2)){ showToast('所持が足りません'); return; }
    if(PROD_KEYS.indexOf(r2)>=0 && !isProductSellUnlocked(r2)){ showToast('未解禁の品は売れません'); return; }
  }
  gs.gold += net;
  Object.keys(gs.buy||{}).forEach(function(r){
    var q = gs.buy[r]||0;
    if(!q) return;
    gs.market.shop[r] = Math.max(0, (gs.market.shop[r]||0) - q);
    if(r==='food_mat') gs.inv.food = (gs.inv.food||0) + q;
    else gs.inv[r] = (gs.inv[r]||0) + q;
  });
  Object.keys(gs.sellQ||{}).forEach(function(r){
    var q = gs.sellQ[r]||0;
    if(!q) return;
    deductStock(r, q);
    // raw mats return to shop; products do not stock the shop
    if(r!=='med' && r!=='sword' && r!=='siege_w'){
      var cap = gs.market.shopCap[r]||20;
      gs.market.shop[r] = Math.min(cap, (gs.market.shop[r]||0) + q);
    }
  });
  gs.buy={}; gs.sellQ={};
  ALL_TRADE.forEach(function(r){
    ['buy-','sell-'].forEach(function(pre){
      var e=document.getElementById(pre+r); if(e) e.textContent=0;
    });
  });
  if(typeof window.recomputePrices==='function') window.recomputePrices(false);
  if(typeof updateTradeTotals==='function') updateTradeTotals();
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updateInvDisplay==='function') updateInvDisplay();
  if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
  showToast('売買を確定しました');
};

// refreshMarketUI: product rows
var _rmui = window.refreshMarketUI;
window.refreshMarketUI = function(){
  if(typeof _rmui==='function') _rmui();
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  PROD_KEYS.forEach(function(r){
    if(r==='med'){
      // already handled; still refresh inv
      var invEl = document.getElementById('inv-med');
      if(invEl) invEl.textContent = String(gs.stock.med||0);
      var priceEl = document.getElementById('price-med');
      if(priceEl) priceEl.textContent = '売'+productSellPrice('med')+'両';
      return;
    }
    var row = document.getElementById('row-prod-'+r);
    var unlocked = isProductSellUnlocked(r);
    if(row){
      row.classList.toggle('locked-row', !unlocked);
      row.style.display = unlocked ? '' : 'none';
    }
    var invEl2 = document.getElementById('inv-'+r);
    if(invEl2) invEl2.textContent = String(stockOf(r));
    var shopEl = document.getElementById('shop-'+r);
    if(shopEl) shopEl.textContent = '—';
    var priceEl2 = document.getElementById('price-'+r);
    if(priceEl2) priceEl2.textContent = unlocked ? ('売'+productSellPrice(r)+'両') : '未解禁';
  });
  var note = document.getElementById('kg-cost-note');
  if(note) note.textContent = '費用：金'+adviceCost()+'両（1ターン1回分。選び直しは追加料金なし／市場・工房・薬房の操作は無料）';
};

// ── 進言コスト（成功して選択が確定したときだけ課金。1ターン1回） ──
var _kgPick = window.kgPick;
window.kgPick = function(type, val, btn){
  try{
    if(type==='kenjou'){ showToast('献上は廃止されました'); return; }
    gs.kengen = gs.kengen || {shingen:null, kenjou:null};
    var cost = adviceCost();
    var paidBefore = !!gs.kengen.paidThisTurn;
    if(type==='shingen' && val && !paidBefore){
      if((gs.gold||0) < cost){
        showToast('進言には金'+cost+'両が必要です（所持'+(gs.gold||0)+'両）');
        return;
      }
    }
    if(typeof _kgPick==='function') _kgPick(type, val, btn);
    // ロック等で選ばれなかった場合は課金しない
    if(type==='shingen' && val && gs.kengen && gs.kengen.shingen===val && !paidBefore && !gs.kengen.paidThisTurn){
      gs.gold = (gs.gold||0) - cost;
      gs.kengen.paidThisTurn = true;
      if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
      showToast('進言の費用 '+cost+'両 を納めました');
    }
  }catch(e){
    console.error('kgPick cost', e);
    if(typeof _kgPick==='function') try{ _kgPick(type, val, btn); }catch(e2){}
  }
};

// reset paid flag on turn advance (after advice applied)
(function(){
  var orig = window.goToNextTurn;
  if(!orig) return;
  window.goToNextTurn = function(){
    var r = orig.apply(this, arguments);
    try{
      if(gs.kengen) gs.kengen.paidThisTurn = false;
    }catch(e){}
    return r;
  };
})();

// ── 馬売却 ──
function horseSellPrice(hh){
  var st = (typeof statsForRank==='function') ? statsForRank(hh.rank) : {star: Math.floor(hh.rank||1)};
  var star = st.star || Math.max(1, Math.floor(hh.rank||1));
  var table = (window.MARKET_ECON && window.MARKET_ECON.horseSellByStar) || {};
  return table[String(star)] || table[star] || (star*80);
}
window.horseSellPrice = horseSellPrice;

window.sellHorse = function(horseId){
  try{
    if(typeof ensureHorseState==='function') ensureHorseState();
    if(!gs.ranch || !gs.ranch.shippingUnlocked){
      showToast('馬の売却は最初の秋以降（出荷解禁後）です');
      return;
    }
    var hh = (gs.horses||[]).find(function(x){ return x.id===horseId; });
    if(!hh){ showToast('馬が見つかりません'); return; }
    if(hh.status==='paired'){ showToast('つがい中の馬は売れません'); return; }
    if(hh.status==='transit'){ showToast('輸送中の馬は売れません'); return; }
    if(hh.status!=='ranch'){ showToast('牧場にいる馬だけ売れます'); return; }
    var price = horseSellPrice(hh);
    if(!confirm(hh.name+'（★'+((typeof statsForRank==='function'?statsForRank(hh.rank).star:Math.floor(hh.rank)))+'）を '+price+'両 で売りますか？')) return;
    gs.horses = gs.horses.filter(function(x){ return x.id!==horseId; });
    // clear pair if any
    if(gs.ranch && gs.ranch.pairs){
      gs.ranch.pairs = gs.ranch.pairs.filter(function(p){
        return p.m!==horseId && p.f!==horseId;
      });
    }
    gs.gold = (gs.gold||0) + price;
    if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
    if(typeof renderRanchHorseList==='function') renderRanchHorseList();
    if(typeof window.renderRanchHorseList==='function') window.renderRanchHorseList();
    if(typeof refreshRanchUI==='function') refreshRanchUI();
    showToast(hh.name+'を売却（+'+price+'両）');
  }catch(e){
    console.error('sellHorse', e);
    showToast('売却に失敗しました');
  }
};

// enhance ranch list with sell button
var _rr = window.renderRanchHorseList;
window.renderRanchHorseList = function(){
  if(typeof ensureHorseState==='function') ensureHorseState();
  var box = document.getElementById('ranch-horse-list');
  if(!box){
    if(typeof _rr==='function') return _rr();
    return;
  }
  var list = (gs.horses||[]).filter(function(x){
    return x.status==='ranch'||x.status==='paired'||x.status==='transit';
  });
  if(!list.length){
    box.innerHTML = '<div class="ranch-empty">まだ馬がいません。</div>';
    return;
  }
  var canShip = !!(gs.ranch && gs.ranch.shippingUnlocked);
  var html = '<table class="ranch-horse-table"><thead><tr>'+
    '<th>名前</th><th>性</th><th>★</th><th>速</th><th>容</th><th>性質</th><th>状態</th><th>売却</th></tr></thead><tbody>';
  list.forEach(function(hh){
    var st = (typeof statsForRank==='function') ? statsForRank(hh.rank) : {star:Math.floor(hh.rank||1),speed:'?',capacity:'?'};
    var statusLabel = hh.status;
    if(typeof S==='function') statusLabel = S('status_'+hh.status, hh.status);
    else {
      var map = {ranch:'牧場',paired:'つがい',transit:'輸送中'};
      statusLabel = map[hh.status]||hh.status;
    }
    var price = horseSellPrice(hh);
    var canSell = canShip && hh.status==='ranch';
    var btn = canSell
      ? ('<button type="button" class="hs-sell-btn" onclick="sellHorse(\''+String(hh.id).replace(/'/g,'')+'\')">'+price+'両</button>')
      : '<button type="button" class="hs-sell-btn" disabled title="'+(canShip?'売却不可':'出荷解禁後')+'">—</button>';
    html += '<tr><td class="name">'+hh.name+'</td><td>'+(hh.sex==='f'?'雌':'雄')+
      '</td><td>'+st.star+'</td><td>'+st.speed+'</td><td>'+st.capacity+
      '</td><td>'+(hh.trait||'—')+'</td><td>'+statusLabel+'</td><td>'+btn+'</td></tr>';
  });
  html += '</tbody></table>';
  if(!canShip){
    html += '<div style="font-size:11px;color:var(--faded);margin-top:6px">馬の売却は最初の秋（出荷解禁）以降です。つがい中・輸送中は売れません。</div>';
  }
  box.innerHTML = html;
};

console.log('[advice+sell] ready cost='+adviceCost());
})();


// ═══ ranch sell bind (个体列表出售) ═══
(function(){
'use strict';
if(window.__ranchSellBind) return;
window.__ranchSellBind = true;

// 価格表（market_economy.json の horseSellByStar と同じ）
function horseSellPrice(hh){
  var st = (typeof statsForRank==='function') ? statsForRank(hh.rank) : {star: Math.max(1, Math.floor(hh.rank||1))};
  var star = st.star || Math.max(1, Math.floor(hh.rank||1));
  var table = (window.MARKET_ECON && window.MARKET_ECON.horseSellByStar) || {1:80,2:150,3:280,4:480,5:800};
  return table[String(star)] != null ? table[String(star)] : (table[star] != null ? table[star] : star*80);
}
window.horseSellPrice = horseSellPrice;

window.sellHorse = function(horseId){
  try{
    if(typeof ensureHorseState==='function') ensureHorseState();
    if(!gs.ranch || !gs.ranch.shippingUnlocked){
      showToast('馬の売却は最初の秋以降（出荷解禁後）です');
      return;
    }
    var hh = (gs.horses||[]).find(function(x){ return x.id===horseId; });
    if(!hh){ showToast('馬が見つかりません'); return; }
    if(hh.status==='paired'){ showToast('つがい中の馬は売れません'); return; }
    if(hh.status==='transit'){ showToast('輸送中の馬は売れません'); return; }
    if(hh.status!=='ranch'){ showToast('牧場にいる馬だけ売れます'); return; }
    var star = (typeof statsForRank==='function') ? statsForRank(hh.rank).star : Math.floor(hh.rank||1);
    var price = horseSellPrice(hh);
    if(!confirm(hh.name+'（★'+star+'）を '+price+'両 で売りますか？\n※市場ではなく牧場からの売却です')) return;
    gs.horses = gs.horses.filter(function(x){ return x.id!==horseId; });
    if(gs.ranch && gs.ranch.pairs){
      gs.ranch.pairs = (gs.ranch.pairs||[]).filter(function(p){
        return p && p.m!==horseId && p.f!==horseId && p.male!==horseId && p.female!==horseId;
      });
    }
    // つがい状態の相手が残っていれば ranch に戻す（安全側）
    (gs.horses||[]).forEach(function(x){
      if(x.status==='paired' && x.pairWith===horseId){
        x.status='ranch';
        delete x.pairWith;
      }
    });
    gs.gold = (gs.gold||0) + price;
    if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
    // 必ず売却付きリストを再描画
    if(typeof window.renderRanchHorseList==='function') window.renderRanchHorseList();
    try{ renderRanchHorseList = window.renderRanchHorseList; }catch(e){}
    showToast(hh.name+'を売却（+'+price+'両）');
  }catch(e){
    console.error('sellHorse', e);
    showToast('売却に失敗しました');
  }
};

window.renderRanchHorseList = function(){
  if(typeof ensureHorseState==='function') ensureHorseState();
  var box = document.getElementById('ranch-horse-list');
  if(!box) return;
  var list = (gs.horses||[]).filter(function(x){
    return x.status==='ranch'||x.status==='paired'||x.status==='transit';
  });
  if(!list.length){
    box.innerHTML = '<div class="ranch-empty">まだ馬がいません。</div>';
    return;
  }
  var canShip = !!(gs.ranch && gs.ranch.shippingUnlocked);
  var html = '<table class="ranch-horse-table"><thead><tr>'+
    '<th>名前</th><th>性</th><th>★</th><th>速</th><th>容</th><th>性質</th><th>状態</th><th>売却</th></tr></thead><tbody>';
  list.forEach(function(hh){
    var st = (typeof statsForRank==='function') ? statsForRank(hh.rank) : {star:Math.floor(hh.rank||1),speed:'?',capacity:'?'};
    var map = {ranch:'牧場',paired:'つがい',transit:'輸送中'};
    var statusLabel = map[hh.status]||hh.status;
    if(typeof S==='function'){
      try{ statusLabel = S('status_'+hh.status, statusLabel); }catch(e){}
    }
    var price = horseSellPrice(hh);
    var canSell = canShip && hh.status==='ranch';
    var tip = !canShip ? '出荷解禁後（最初の秋以降）' : (hh.status!=='ranch' ? '牧場にいるときだけ売却可' : (price+'両で売却'));
    var btn = canSell
      ? ('<button type="button" class="hs-sell-btn" onclick="sellHorse(\''+String(hh.id).replace(/'/g,'')+'\')">'+price+'両</button>')
      : ('<button type="button" class="hs-sell-btn" disabled title="'+tip+'">—</button>');
    html += '<tr><td class="name">'+hh.name+'</td><td>'+(hh.sex==='f'?'雌':'雄')+
      '</td><td>'+st.star+'</td><td>'+st.speed+'</td><td>'+st.capacity+
      '</td><td>'+(hh.trait||'—')+'</td><td>'+statusLabel+'</td><td>'+btn+'</td></tr>';
  });
  html += '</tbody></table>';
  if(!canShip){
    html += '<div style="font-size:11px;color:var(--faded);margin-top:6px">馬の売却は牧場の個体リストから行います。最初の秋（出荷解禁）以降に「売却」ボタンが有効になります。つがい中・輸送中は売れません。</div>';
  }else{
    html += '<div style="font-size:11px;color:var(--faded);margin-top:6px">売却は市場ではなく、この牧場リストから行います（★別の定価）。</div>';
  }
  box.innerHTML = html;
};

// 同一スクリプト内の裸の renderRanchHorseList() 呼び出しも新実装を使う
try{ renderRanchHorseList = window.renderRanchHorseList; }catch(e){}

// openCard('ranch') で必ず再描画
(function(){
  var prev = window.openCard;
  if(typeof prev!=='function') return;
  window.openCard = function(name){
    var r = prev.apply(this, arguments);
    if(name==='ranch'){
      try{ renderRanchHorseList = window.renderRanchHorseList; }catch(e){}
      if(typeof window.renderRanchHorseList==='function') window.renderRanchHorseList();
    }
    return r;
  };
  try{ openCard = window.openCard; }catch(e){}
})();

// DOM 後でも再バインド
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    try{ renderRanchHorseList = window.renderRanchHorseList; }catch(e){}
    if(typeof window.renderRanchHorseList==='function') window.renderRanchHorseList();
  }, 100);
});

console.log('[ranch sell bind] ready');
})();


// ═══ UI polish kengen/market/ranch ═══
(function(){
'use strict';
if(window.__uiPolishKengenMarketRanch) return;
window.__uiPolishKengenMarketRanch = true;

var DEFAULT_RANK = {
  '1':{speed:1,capacity:1},
  '2':{speed:2,capacity:1},
  '3':{speed:2,capacity:2},
  '4':{speed:3,capacity:1},
  '5':{speed:3,capacity:2}
};

function adviceCost(){
  var c = window.MARKET_ECON && window.MARKET_ECON.adviceCostGold;
  return (c!=null ? c : 300)|0;
}

// ── export horse stats globally (fix ? display) ──
window.getRankTable = function(){
  if(window.RANK_TABLE) return window.RANK_TABLE;
  var HD = window.HORSE_DATA || {};
  return HD.rankTable || DEFAULT_RANK;
};
window.displayStar = window.displayStar || function(rank){
  var s = Math.floor(Number(rank)||1);
  if(s<1)s=1; if(s>5)s=5; return s;
};
window.statsForRank = function(rank){
  if(typeof statsForRank==='function' && statsForRank !== window.statsForRank){
    try{ return statsForRank(rank); }catch(e){}
  }
  var st = window.displayStar(rank);
  var t = window.getRankTable()[String(st)] || DEFAULT_RANK[String(st)] || {speed:1,capacity:1};
  return { star:st, speed:t.speed, capacity:t.capacity };
};

// ── 進言: 費用表示 + 1選択で他ロック ──
function paintKengenCostsAndLocks(){
  var cost = adviceCost();
  var root = document.getElementById('kg-shingen');
  if(!root) return;
  var chosen = gs.kengen && gs.kengen.shingen;
  var paid = gs.kengen && gs.kengen.paidThisTurn;
  root.querySelectorAll('.kg-opt').forEach(function(btn){
    var val = btn.getAttribute('data-val');
    // cost line
    var costEl = btn.querySelector('.kg-cost');
    if(!costEl){
      costEl = document.createElement('span');
      costEl.className = 'kg-cost kg-cost-on-btn';
      var eff = btn.querySelector('.kg-effect');
      if(eff && eff.nextSibling) btn.insertBefore(costEl, eff.nextSibling);
      else if(eff) eff.after(costEl);
      else btn.appendChild(costEl);
    }
    if(paid && chosen){
      if(val===chosen) costEl.textContent = '費用：'+cost+'両（支払い済み）';
      else costEl.textContent = '（他の進言を選択済み）';
    }else{
      costEl.textContent = '費用：金'+cost+'両';
    }
    // lock others after one pick
    var isChosen = chosen && val===chosen;
    var lockOther = !!(chosen && !isChosen);
    btn.classList.toggle('kg-locked-other', lockOther);
    btn.classList.toggle('chosen', !!isChosen);
    if(lockOther){
      btn.disabled = true;
    }else if(btn.classList.contains('locked-opt')){
      // keep unlock-condition disabled
      btn.disabled = true;
    }else{
      btn.disabled = false;
    }
  });
  var note = document.getElementById('kg-cost-note');
  if(note){
    if(chosen){
      note.textContent = '進言を選択済み（費用 '+cost+'両）。このターンは変更できません。効果は次ターンから。';
    }else{
      note.textContent = '進言は1つだけ選べます。費用は各 '+cost+'両（ボタンに表示）。未選択なら費用はかかりません。';
    }
  }
}
window.paintKengenCostsAndLocks = paintKengenCostsAndLocks;

// wrap kgPick: no re-pick after first successful choice; show cost before pay
var _kg = window.kgPick;
window.kgPick = function(type, val, btn){
  try{
    if(type==='kenjou'){ showToast('献上は廃止されました'); return; }
    gs.kengen = gs.kengen || {shingen:null,kenjou:null};
    // already chosen this turn → lock
    if(type==='shingen' && gs.kengen.shingen && gs.kengen.paidThisTurn){
      if(gs.kengen.shingen !== val){
        showToast('このターンはすでに進言を選びました（変更不可）');
      }
      paintKengenCostsAndLocks();
      return;
    }
    if(type==='shingen' && gs.kengen.shingen && !gs.kengen.paidThisTurn && gs.kengen.shingen !== val){
      // edge: selected without pay — still lock change if we want strict; allow change until paid
    }
    var cost = adviceCost();
    var willPay = type==='shingen' && val && !gs.kengen.paidThisTurn;
    if(willPay && (gs.gold||0) < cost){
      showToast('進言には金'+cost+'両が必要です（所持'+(gs.gold||0)+'両）');
      return;
    }
    // call previous
    if(typeof _kg==='function') _kg(type, val, btn);
    else {
      gs.kengen[type]=val;
    }
    // if selection stuck and unpaid, charge once
    if(type==='shingen' && val && gs.kengen.shingen===val && !gs.kengen.paidThisTurn){
      gs.gold = (gs.gold||0) - cost;
      gs.kengen.paidThisTurn = true;
      if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
      showToast('進言「'+val+'」を選択（−'+cost+'両）');
    }
    paintKengenCostsAndLocks();
  }catch(e){
    console.error('kgPick polish', e);
    if(typeof _kg==='function') try{_kg(type,val,btn);}catch(e2){}
  }
};

// ── 市場: 前期比（ターン単位）・初期同期 ──
function matLabel(k){
  var L = (window.MARKET_ECON && window.MARKET_ECON.labels) || {};
  return L[k] || k;
}

/** 初期金・所持・店在庫をデータと一致させる（不足時のみ補完。既存セーブは触らない） */
window.syncStartResourcesIfNeeded = function(){
  var start = (typeof CFG!=='undefined' && CFG.start) || (window.GAME_DATA && window.GAME_DATA.start) || {};
  if(gs.gold==null) gs.gold = start.gold!=null ? start.gold : 1000;
  if(!gs.inv) gs.inv = {};
  ['iron','wood','niter','herb','food'].forEach(function(k){
    if(gs.inv[k]==null && start[k]!=null) gs.inv[k]=start[k];
  });
  if(!gs.stock) gs.stock = {};
  // 剣の初期は0に統一
  if(gs.stock.sword==null) gs.stock.sword = (start.sword!=null?start.sword:0);
  if(gs.stock.siege_w==null) gs.stock.siege_w = start.siege_w!=null?start.siege_w:0;
  if(gs.stock.med==null) gs.stock.med = start.med!=null?start.med:0;
  if(typeof window.ensureMarket==='function') window.ensureMarket();
  // 店在庫: 市場未初期化時のみ shopStart
  if(gs.market && !gs.market._shopInitedFromJson){
    var ME = window.MARKET_ECON || {};
    var ss = ME.shopStart || {};
    Object.keys(ss).forEach(function(k){
      if(gs.market.shop[k]==null) gs.market.shop[k]=ss[k];
    });
    // 初回は前期=今期（±0表示用に prev を記録）
    if(!gs.market.prevBuy || !Object.keys(gs.market.prevBuy).length){
      gs.market.prevBuy = Object.assign({}, gs.market.priceBuy||ME.baseBuy||{});
    }
    gs.market._shopInitedFromJson = true;
  }
};

// delta display helper
function formatDelta(d){
  if(d==null || isNaN(d)) return '<span class="price-delta-zero">（前期比 —）</span>';
  if(d===0) return '<span class="price-delta-zero">（前期比 ±0）</span>';
  if(d>0) return '<span class="price-delta-up">（前期比 +'+d+'）</span>';
  return '<span class="price-delta-down">（前期比 '+d+'）</span>';
}

var _deltaStr = (typeof window.deltaStr==='function') ? window.deltaStr : (typeof deltaStr==='function'?deltaStr:null);
window.deltaStr = function(res){
  var cur = (gs.market && gs.market.priceBuy && gs.market.priceBuy[res])||0;
  var prev = gs.market && gs.market.prevBuy ? gs.market.prevBuy[res] : null;
  if(prev==null) return '（前期比 —）';
  var d = cur - prev;
  if(d===0) return '（前期比 ±0）';
  return d>0 ? '（前期比 +'+d+'）' : '（前期比 '+d+'）';
};

// wrap refreshMarketUI for clearer 前期比
var _rm = window.refreshMarketUI;
window.refreshMarketUI = function(){
  try{ window.syncStartResourcesIfNeeded(); }catch(e){}
  if(typeof _rm==='function') _rm();
  // repaint price cells with 前期比 label (buy side)
  var KEYS = ['iron','wood','niter','herb','food_mat'];
  KEYS.forEach(function(r){
    var priceEl = document.getElementById('price-'+r);
    if(!priceEl || !gs.market) return;
    var buy = gs.market.priceBuy && gs.market.priceBuy[r];
    var sell = gs.market.priceSell && gs.market.priceSell[r];
    var prev = gs.market.prevBuy && gs.market.prevBuy[r];
    var d = (prev!=null && buy!=null) ? (buy - prev) : null;
    priceEl.innerHTML = '売'+sell+'両 買'+buy+'両 '+formatDelta(d);
  });
  // products
  ['sword','siege_w','med'].forEach(function(r){
    var priceEl = document.getElementById('price-'+r);
    if(!priceEl || !gs.market) return;
    var sell = (gs.market.priceSell && gs.market.priceSell[r]) ||
      (window.MARKET_ECON && window.MARKET_ECON.baseSell && window.MARKET_ECON.baseSell[r]) || 0;
    priceEl.textContent = '売'+sell+'両';
    var invEl = document.getElementById(r==='med'?'inv-med':'inv-'+r);
    if(invEl){
      var v = r==='med' ? (gs.stock.med||0) : (gs.stock[r]||0);
      invEl.textContent = String(v);
    }
  });
  paintKengenCostsAndLocks();
};

// confirmTrade: 前期比を売買で上書きしない
var _ct = window.confirmTrade;
window.confirmTrade = function(){
  var savedPrev = gs.market && gs.market.prevBuy ? Object.assign({}, gs.market.prevBuy) : null;
  if(typeof _ct==='function') _ct();
  if(gs.market && savedPrev){
    gs.market.prevBuy = savedPrev; // restore 前期 (turn-based)
  }
  if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
};

// goToNextTurn: after market season, ensure prev is from before recompute
(function(){
  var orig = window.goToNextTurn;
  if(typeof orig!=='function') return;
  window.goToNextTurn = function(){
    // snapshot prices as "前期" before restock+recompute happens in other hooks
    try{
      if(typeof window.ensureMarket==='function') window.ensureMarket();
      if(gs.market && gs.market.priceBuy){
        gs.market.prevBuy = Object.assign({}, gs.market.priceBuy);
      }
    }catch(e){}
    var r = orig.apply(this, arguments);
    try{
      if(gs.kengen){
        // new turn: allow new advice
        gs.kengen.paidThisTurn = false;
        // keep shingen until applyPendingAdvice consumes it — other code may clear
      }
      paintKengenCostsAndLocks();
      if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
    }catch(e){}
    return r;
  };
})();

// recomputePrices(true) should set prev BEFORE changing — ensure order
var _re = window.recomputePrices;
window.recomputePrices = function(savePrev){
  if(savePrev && gs.market && gs.market.priceBuy){
    gs.market.prevBuy = Object.assign({}, gs.market.priceBuy);
  }
  if(typeof _re==='function'){
    // call with false to avoid double-save if original also saves
    return _re.call(this, false);
  }
};

// ── 牧場リスト: 速さ/容量 + 正しい数値 ──
window.renderRanchHorseList = function(){
  if(typeof ensureHorseState==='function') ensureHorseState();
  var box = document.getElementById('ranch-horse-list');
  if(!box) return;
  var list = (gs.horses||[]).filter(function(x){
    return x.status==='ranch'||x.status==='paired'||x.status==='transit';
  });
  if(!list.length){
    box.innerHTML = '<div class="ranch-empty">まだ馬がいません。</div>';
    return;
  }
  var canShip = !!(gs.ranch && gs.ranch.shippingUnlocked);
  var html = '<table class="ranch-horse-table"><thead><tr>'+
    '<th>名前</th><th>性</th><th>★</th><th>速さ</th><th>容量</th><th>性質</th><th>状態</th><th>売却</th></tr></thead><tbody>';
  list.forEach(function(hh){
    var st = window.statsForRank(hh.rank);
    var map = {ranch:'牧場',paired:'つがい',transit:'輸送中'};
    var statusLabel = map[hh.status]||hh.status;
    var price = (typeof window.horseSellPrice==='function') ? window.horseSellPrice(hh) : (st.star*80);
    var canSell = canShip && hh.status==='ranch';
    var tip = !canShip ? '出荷解禁後（最初の秋以降）' : (hh.status!=='ranch' ? '牧場にいるときだけ売却可' : (price+'両で売却'));
    var btn = canSell
      ? ('<button type="button" class="hs-sell-btn" onclick="sellHorse(\''+String(hh.id).replace(/'/g,'')+'\')">'+price+'両</button>')
      : ('<button type="button" class="hs-sell-btn" disabled title="'+tip+'">—</button>');
    html += '<tr><td class="name">'+(hh.name||'?')+'</td><td>'+(hh.sex==='f'?'雌':'雄')+
      '</td><td>'+st.star+'</td><td>'+st.speed+'</td><td>'+st.capacity+
      '</td><td>'+(hh.trait||'—')+'</td><td>'+statusLabel+'</td><td>'+btn+'</td></tr>';
  });
  html += '</tbody></table>';
  html += '<div style="font-size:11px;color:var(--faded);margin-top:6px">売却は牧場の個体リストから（市場には並びません）。出荷解禁後に有効。</div>';
  box.innerHTML = html;
};
try{ renderRanchHorseList = window.renderRanchHorseList; }catch(e){}

// openCard hooks
(function(){
  var prev = window.openCard;
  if(typeof prev!=='function') return;
  window.openCard = function(name){
    var r = prev.apply(this, arguments);
    if(name==='ranch'){
      try{ renderRanchHorseList = window.renderRanchHorseList; }catch(e){}
      window.renderRanchHorseList();
    }
    if(name==='market'){
      if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
    }
    if(name==='letter' || name==='kengen'){
      paintKengenCostsAndLocks();
    }
    return r;
  };
  try{ openCard = window.openCard; }catch(e){}
})();

// letter tab kengen
var _sel = window.selectTab;
if(typeof _sel==='function'){
  window.selectTab = function(key){
    var r = _sel.apply(this, arguments);
    if(key==='kengen') paintKengenCostsAndLocks();
    return r;
  };
  try{ selectTab = window.selectTab; }catch(e){}
}

// boot
function bootPolish(){
  try{
    // force sword start 0 for brand-new state only when stock looks like old default 2 and no progress
    if(gs && gs.stock && gs.stock.sword===2 && (gs.turn===0||gs.turn===1) && !gs.sortieDoneThisTurn){
      // don't auto-zero mid-game saves with 2 swords earned — only if never produced?
      // User asked initial = 0. Safer: only if total turns early and no production history
      if(!gs.inProd || ((gs.inProd.sword||0)+(gs.stock.siege_w||0)===gs.stock.siege_w)){
        // leave existing saves; new games get 0 from CFG
      }
    }
    window.syncStartResourcesIfNeeded();
    paintKengenCostsAndLocks();
    if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
  }catch(e){ console.warn('boot polish', e); }
}
document.addEventListener('DOMContentLoaded', function(){ setTimeout(bootPolish, 120); });
setTimeout(bootPolish, 400);

console.log('[ui polish kengen/market/ranch] ready');
})();


// ═══ letters simplify + trust rewards + advice now ═══
(function(){
'use strict';
if(window.__lettersTrustAdviceFix) return;
window.__lettersTrustAdviceFix = true;

var PKEYS2 = window.PKEYS || ['food','horse','siege','weapon'];
var TRUST_N0 = 4;
var TRUST_N123 = 15;
var TRUST_N4 = 20;

function ensureCfgTrustRewards(){
  try{
    if(typeof CFG==='undefined') return;
    if(CFG.prep_quests){
      PKEYS2.forEach(function(k){
        if(CFG.prep_quests[k]) CFG.prep_quests[k].trust_reward = TRUST_N0;
      });
    }
    if(CFG.node_orders){
      PKEYS2.forEach(function(k){
        var tree=CFG.node_orders[k]; if(!tree) return;
        ['1','2','3','4'].forEach(function(n){
          if(tree[n]) tree[n].trust_reward = (n==='4'?TRUST_N4:TRUST_N123);
        });
      });
    }
    // letters pool from GAME_DATA if updated
    if(typeof GAME_DATA!=='undefined' && GAME_DATA.letters){
      CFG.letterPool = GAME_DATA.letters;
      CFG.letters = GAME_DATA.letters;
    }
  }catch(e){ console.warn('ensureCfgTrustRewards', e); }
}
ensureCfgTrustRewards();

// ── order complete trust ──
function grantOrderTrust(key, node){
  var n = Number(node)||1;
  var gain = n>=4 ? TRUST_N4 : TRUST_N123;
  // prefer data
  try{
    var od = CFG.node_orders && CFG.node_orders[key] && CFG.node_orders[key][String(n)];
    if(od && od.trust_reward!=null) gain = od.trust_reward;
  }catch(e){}
  gs.trust[key] = Math.min(100, (gs.trust[key]||0) + gain);
  return gain;
}

var _coc = window.checkOrderComplete || (typeof checkOrderComplete==='function'?checkOrderComplete:null);
window.checkOrderComplete = function(key){
  var od=gs.order&&gs.order[key];
  var already = od && od._trustGranted;
  if(typeof _coc==='function') _coc(key);
  else if(typeof checkOrderComplete==='function' && checkOrderComplete!==window.checkOrderComplete) checkOrderComplete(key);
  // if completed and not yet granted
  od=gs.order&&gs.order[key];
  if(od && od.items && od.items.every(function(it){return (it.delivered||0)>=it.qty;})){
    if(!od._trustGranted && !already){
      var node=od.node||gs.node[key]||1;
      var g=grantOrderTrust(key, node);
      od._trustGranted = true;
      showToast('✓ '+(typeof PNAMES!=='undefined'?PNAMES[key]:key)+' ノード'+node+' 完納（信頼 +'+g+'）');
      if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
      if(typeof updatePrinceBar==='function') updatePrinceBar();
      if(typeof updateTabLabels==='function') updateTabLabels();
    }
  }
};
try{ checkOrderComplete = window.checkOrderComplete; }catch(e){}

// prep always uses CFG trust_reward (=4)
var _hd = window.handDeliver || (typeof handDeliver==='function'?handDeliver:null);
// leave handDeliver; prep trust_reward already 4 via CFG

// ── mail state ──
function ensureMail(){
  if(!gs.mail) gs.mail = {};
  PKEYS2.forEach(function(k){
    if(!gs.mail[k]) gs.mail[k] = { hasNew:false, lastExchange:null, lastDemand:null };
  });
  if(!gs.letterFlags) gs.letterFlags={used:{},serial:{},justEntered:{food:false,horse:false,siege:false,weapon:false}};
  if(!gs.activeLetter) gs.activeLetter={};
  if(!gs.choices) gs.choices={};
}

function letterDisabled(e){
  return !e || e.disabled === true;
}

function matchWhen2(when, key){
  if(!when) return true;
  if(when.fallback) return false; // never auto for "new"
  var node=gs.node[key]||0;
  var trust=gs.trust[key]||0;
  if(when.node!=null && node!==when.node) return false;
  if(when.node_gte!=null && node<when.node_gte) return false;
  if(when.node_lte!=null && node>when.node_lte) return false;
  if(when.trust_gte!=null && trust<when.trust_gte) return false;
  if(when.trust_lt!=null && trust>=when.trust_lt) return false;
  if(when.on_node_enter && !gs.letterFlags.justEntered[key]) return false;
  if(when.once && gs.letterFlags.used[when._id||when.id||'']) return false;
  // N0 intro: node 0 without on_node_enter — show until once used
  if(when.node===0 && when.once && gs.letterFlags.used[when._id||'']) return false;
  return true;
}

function poolKind(key, kind){
  var pool = (CFG.letterPool && CFG.letterPool[key] && CFG.letterPool[key][kind])
    || (CFG.letters && CFG.letters[key] && CFG.letters[key][kind])
    || [];
  return pool;
}

function pickNewEntry(key, kind){
  var pool = poolKind(key, kind);
  var cands = [];
  pool.forEach(function(raw){
    if(letterDisabled(raw)) return;
    if(raw.when && raw.when.fallback) return;
    var e = Object.assign({}, raw, { when: Object.assign({}, raw.when||{}) });
    e.when._id = e.id;
    if(e.when.once && gs.letterFlags.used[e.id]) return;
    if(!matchWhen2(e.when, key)) return;
    cands.push(e);
  });
  cands.sort(function(a,b){ return (b.priority||0)-(a.priority||0); });
  return cands[0] || null;
}

function recomputeMailFlags(){
  ensureMail();
  PKEYS2.forEach(function(key){
    var pers = pickNewEntry(key, 'personal');
    // hasNew if personal needs reply and not yet chosen for this letter id this phase
    var has = !!pers;
    if(has && gs.choices[key] && gs.choices[key].letterId === pers.id){
      has = false; // already replied
    }
    // if choice exists without letterId (legacy), treat as replied for this turn only if no new higher priority
    if(has && gs.choices[key] && gs.choices[key].letterId == null && gs.choices[key].idx!=null){
      // still has new letter of different id
      if(pers && !gs.letterFlags.used[pers.id]) has = true;
    }
    gs.mail[key].hasNew = has;
    gs.mail[key].pendingPersonal = pers;
    gs.mail[key].pendingDemand = pickNewEntry(key, 'demand');
  });
}
window.recomputeMailFlags = recomputeMailFlags;

function fillTemplate2(s, key){
  if(!s) return '';
  if(typeof fillTemplate==='function') return fillTemplate(s, key);
  var od=gs.order&&gs.order[key]||{};
  return String(s)
    .replace(/{{order_label}}/g, od.label||'')
    .replace(/{{deadline}}/g, String(od.deadline!=null?od.deadline:'?'))
    .replace(/{{node}}/g, String(gs.node[key]||0));
}

window.renderLetter = function(key){
  ensureMail();
  recomputeMailFlags();
  var mail = gs.mail[key];
  var demEl = document.getElementById('lt-'+key+'-demand');
  var gm = document.getElementById('girl-msg-'+key);
  var pb = document.getElementById('personal-body-'+key);
  var area = document.getElementById('choices-area-'+key);

  // ── 文官 demand ──
  var dem = mail.pendingDemand;
  var demBody, demFrom;
  if(dem){
    demBody = fillTemplate2(dem.body, key);
    demFrom = '文官より（ノード'+(gs.node[key]||0)+'）';
    mail.lastDemand = { body: demBody, node: gs.node[key]||0, fromLabel: demFrom, id: dem.id };
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].demand = dem;
    gs.activeLetter[key].demandId = dem.id;
  } else if(mail.lastDemand){
    demBody = mail.lastDemand.body;
    demFrom = mail.lastDemand.fromLabel || ('文官より（ノード'+(mail.lastDemand.node!=null?mail.lastDemand.node:(gs.node[key]||0))+'・再掲）');
  } else {
    // archive from order label
    var od = gs.order&&gs.order[key];
    demFrom = '文官より';
    demBody = od
      ? ('このノードの依頼：'+od.label+'（納期残 '+(od.deadline!=null?od.deadline:'?')+'T）\n※新しい文官報告はありません。輸送画面でも確認できます。')
      : '新しい文官報告はありません。';
  }
  if(demEl){
    demEl.innerHTML = '<div class="letter-block"><div class="letter-from">'+demFrom+'</div>'+
      (dem?'':'<div class="mail-archive-note">（このノードの記録）</div>')+
      '<div class="letter-text">'+demBody.replace(/\n/g,'<br>')+'</div></div>';
  }

  // ── 娘 personal ──
  if(mail.hasNew && mail.pendingPersonal){
    var pe = mail.pendingPersonal;
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].personal = pe;
    gs.activeLetter[key].personalId = pe.id;
    if(gm) gm.textContent = pe.intro || '娘からの手紙です。';
    if(pb) pb.innerHTML = '<div class="letter-block"><div class="letter-text">'+(pe.body||'').replace(/\n/g,'<br>')+'</div></div>';
    if(typeof renderChoices==='function') renderChoices(key, pe.choices||defaultChoicesRuntime());
    else if(area){
      // minimal choices
      renderChoicesLocal(key, pe.choices||defaultChoicesRuntime(), pe.id);
    }
  } else {
    // archive
    var ex = mail.lastExchange;
    if(gm) gm.textContent = ex ? '前回のやりとりはこんなでした。' : 'まだ娘とのやりとりはありません。';
    if(pb){
      if(ex){
        pb.innerHTML = '<div class="mail-archive-note">前回のやりとり</div>'+
          '<div class="letter-block"><div class="letter-text">'+(ex.body||'').replace(/\n/g,'<br>')+'</div></div>'+
          (ex.choiceText ? '<div class="letter-block" style="margin-top:8px"><div class="letter-from">あなたの返事</div><div class="letter-text">'+ex.choiceText+'</div></div>' : '');
      } else {
        pb.innerHTML = '<div class="letter-block"><div class="letter-text">（記録なし）</div></div>';
      }
    }
    if(area) area.innerHTML = '';
    // clear active personal so consume won't re-mark wrongly
    if(gs.activeLetter[key]) gs.activeLetter[key].personal = null;
  }
  updateMailTabStyles();
};

function defaultChoicesRuntime(){
  return [
    {icon:'📋', text:'「承知しました」', trust:0},
    {icon:'🤝', text:'「気にかけています」', trust:0}
  ];
}
function renderChoicesLocal(key, opts, letterId){
  var area=document.getElementById('choices-area-'+key); if(!area) return;
  var chosen=gs.choices[key];
  var html='<div class="choices-wrap"><div class="choices-label">返事を選んでください（取り消し不可）</div>';
  opts.forEach(function(o,i){
    var sel=(chosen!==undefined&&chosen.idx===i)?'selected':'';
    html+='<button type="button" class="choice-btn '+sel+'" data-i="'+i+'">'+
      '<span class="choice-icon">'+(o.icon||'')+'</span><div>'+o.text+
      (o.trust?('<span class="trust-hint">✦ 信頼度 +'+o.trust+'</span>'):'')+
      '</div></button>';
  });
  html+='</div>';
  area.innerHTML=html;
  area.querySelectorAll('.choice-btn').forEach(function(btn){
    btn.onclick=function(){
      var i=parseInt(btn.getAttribute('data-i'),10);
      window.selectChoice(key, i, opts[i].trust||0, btn, letterId, opts[i].text);
    };
  });
}

// wrap selectChoice
var _sc = window.selectChoice || (typeof selectChoice==='function'?selectChoice:null);
window.selectChoice = function(key, idx, trust, el, letterId, choiceText){
  ensureMail();
  if(!gs.mail[key] || !gs.mail[key].hasNew){
    showToast('いま返信が必要な手紙はありません');
    return;
  }
  if(gs.choices[key]!==undefined) return;
  var pe = gs.mail[key].pendingPersonal;
  var lid = letterId || (pe && pe.id) || (gs.activeLetter[key]&&gs.activeLetter[key].personalId);
  var body = pe && pe.body;
  var intro = pe && pe.intro;
  var ctext = choiceText;
  if(!ctext && pe && pe.choices && pe.choices[idx]) ctext = pe.choices[idx].text;
  if(typeof _sc==='function'){
    _sc(key, idx, trust, el);
  } else {
    gs.choices[key]={idx:idx, trust:trust};
    gs.trust[key]=Math.min(100,(gs.trust[key]||0)+(trust||0));
    if(el) el.classList.add('selected');
  }
  gs.choices[key] = Object.assign({}, gs.choices[key]||{}, { letterId: lid, choiceText: ctext });
  gs.mail[key].lastExchange = {
    intro: intro,
    body: body,
    choiceText: ctext,
    trustDelta: trust||0,
    letterId: lid,
    turn: gs.turn
  };
  gs.mail[key].hasNew = false;
  updateMailTabStyles();
  if(typeof updateTabLabels==='function') updateTabLabels();
  if(typeof updatePrinceBar==='function') updatePrinceBar();
};
try{ selectChoice = window.selectChoice; }catch(e){}

// wrap renderChoices used by old code
var _rc = window.renderChoices || (typeof renderChoices==='function'?renderChoices:null);
window.renderChoices = function(key, opts){
  var pe = gs.mail && gs.mail[key] && gs.mail[key].pendingPersonal;
  var lid = pe && pe.id;
  if(!opts) opts = defaultChoicesRuntime();
  // use local that hooks letterId
  renderChoicesLocal(key, opts, lid);
};
try{ renderChoices = window.renderChoices; }catch(e){}

function updateMailTabStyles(){
  ensureMail();
  recomputeMailFlags();
  PKEYS2.forEach(function(key){
    var tab=document.getElementById('ptab-'+key);
    if(!tab) return;
    tab.classList.toggle('mail-new', !!(gs.mail[key]&&gs.mail[key].hasNew));
  });
}
window.updateMailTabStyles = updateMailTabStyles;

var _utl = window.updateTabLabels || (typeof updateTabLabels==='function'?updateTabLabels:null);
window.updateTabLabels = function(){
  if(typeof _utl==='function') _utl();
  updateMailTabStyles();
};
try{ updateTabLabels = window.updateTabLabels; }catch(e){}

window.renderAllLetters = function(){
  ensureMail();
  recomputeMailFlags();
  PKEYS2.forEach(function(k){ window.renderLetter(k); });
  updateMailTabStyles();
  if(typeof checkLettersDone==='function') checkLettersDone();
};
try{ renderAllLetters = window.renderAllLetters; }catch(e){}

// tryGoToMgmt hard block
window.tryGoToMgmt = function(){
  ensureMail();
  recomputeMailFlags();
  var pending = PKEYS2.filter(function(k){
    return gs.mail[k] && gs.mail[k].hasNew && gs.choices[k]===undefined;
  });
  if(pending.length){
    var msg = '返信していない手紙があります';
    if(typeof showToast==='function') showToast(msg);
    alert(msg);
    return;
  }
  if(typeof markLettersConsumedForTurn==='function') markLettersConsumedForTurn();
  // also mark used personal once
  PKEYS2.forEach(function(k){
    var a=gs.activeLetter&&gs.activeLetter[k];
    if(a&&a.personal&&a.personal.id){
      gs.letterFlags.used[a.personal.id]=true;
    }
    if(a&&a.demand&&a.demand.id){
      gs.letterFlags.used[a.demand.id]=true;
    }
    if(gs.letterFlags) gs.letterFlags.justEntered[k]=false;
  });
  if(typeof window.goToMgmt==='function') window.goToMgmt();
  else if(typeof goToMgmt==='function') goToMgmt();
};
try{ tryGoToMgmt = window.tryGoToMgmt; }catch(e){}

// ── 進言: 今季から即時 ──
function applyAdviceNow(){
  if(typeof window.applyPendingAdvice==='function') window.applyPendingAdvice();
  else if(typeof applyPendingAdvice==='function') applyPendingAdvice();
  // horse find if pending
  if(gs.kengen && gs.kengen.shingen==='horse_find' && typeof grantHorseFind==='function' && !gs.kengen._horseGranted){
    try{ grantHorseFind(); gs.kengen._horseGranted=true; }catch(e){}
  }
}

var _kg = window.kgPick;
window.kgPick = function(type, val, btn){
  if(typeof _kg==='function') _kg(type, val, btn);
  // after successful pay+select
  if(type==='shingen' && gs.kengen && gs.kengen.shingen===val && gs.kengen.paidThisTurn && !gs.kengen.appliedThisTurn){
    applyAdviceNow();
    gs.kengen.appliedThisTurn = true;
    // clear pending so next turn hook won't re-apply
    // keep shingen for display; set applied flag checked in applyPendingAdvice wrap
    var kr=document.getElementById('kg-result');
    if(kr){
      kr.textContent = (kr.textContent||'').replace(/次ターンより有効/g,'今季から有効（適用済み）');
      if(kr.textContent.indexOf('今季')<0) kr.textContent += '　→ 今季から有効（適用済み）';
    }
    if(typeof showToast==='function') showToast('進言の効果を今季から適用しました');
  }
};

// prevent double apply on goToNextTurn
var _apa = window.applyPendingAdvice;
window.applyPendingAdvice = function(){
  if(gs.kengen && gs.kengen.appliedThisTurn && gs.kengen._appliedValues===gs.kengen.shingen){
    return; // already applied this selection
  }
  var before = gs.kengen && gs.kengen.shingen;
  if(typeof _apa==='function') _apa();
  if(gs.kengen && before){
    gs.kengen.appliedThisTurn = true;
    gs.kengen._appliedValues = before;
  }
};

// goToNextTurn: reset kengen pay/apply flags for new season; do not re-apply old
(function(){
  var orig = window.goToNextTurn;
  if(typeof orig!=='function') return;
  window.goToNextTurn = function(){
    // skip applyPendingAdvice re-fire if already applied: temporarily mark
    if(gs.kengen && gs.kengen.appliedThisTurn){
      gs.kengen.shingen = null; // consumed
      gs.kengen.paidThisTurn = false;
      gs.kengen.appliedThisTurn = false;
      gs.kengen._appliedValues = null;
      gs.kengen._horseGranted = false;
      gs.kengen.commendTarget = null;
    }
    // clear choices for new letter phase
    gs.choices = {};
    var r = orig.apply(this, arguments);
    ensureCfgTrustRewards();
    ensureMail();
    // after turn, recompute mail
    setTimeout(function(){
      recomputeMailFlags();
      if(typeof window.renderAllLetters==='function') window.renderAllLetters();
      updateMailTabStyles();
    }, 50);
    return r;
  };
})();

// kengen note DOM
function fixKengenNote(){
  var el=document.querySelector('.kengen-note');
  if(el) el.textContent='進言は1つ選べます（今季から有効）\n！献上品が高いのでご利用は計画的に！';
  // use br
  if(el) el.innerHTML='進言は1つ選べます（今季から有効）<br>！献上品が高いのでご利用は計画的に！';
  var note=document.getElementById('kg-cost-note');
  if(note && note.textContent.indexOf('次ターン')>=0){
    note.textContent=note.textContent.replace(/次ターン/g,'今季');
  }
}

// open letter phase
var _sp = window.setPhase;
if(typeof _sp==='function'){
  window.setPhase = function(p){
    var r=_sp.apply(this, arguments);
    if(p==='letter'){
      ensureCfgTrustRewards();
      ensureMail();
      recomputeMailFlags();
      if(typeof window.renderAllLetters==='function') window.renderAllLetters();
      fixKengenNote();
    }
    return r;
  };
  try{ setPhase = window.setPhase; }catch(e){}
}

// boot
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    ensureCfgTrustRewards();
    ensureMail();
    fixKengenNote();
    recomputeMailFlags();
    if(gs.phase==='letter' && typeof window.renderAllLetters==='function') window.renderAllLetters();
    updateMailTabStyles();
    var btn=document.getElementById('ph-letter-complete');
    if(btn){
      btn.onclick=function(ev){ if(ev) ev.preventDefault(); window.tryGoToMgmt(); };
      btn.setAttribute('onclick','tryGoToMgmt()');
    }
  }, 150);
});

console.log('[letters+trust+advice] ready N0='+TRUST_N0+' N1-3='+TRUST_N123+' N4='+TRUST_N4);
})();


// ═══ mail yellow + node enter + button polish ═══
(function(){
'use strict';
if(window.__mailYellowNodeBtn) return;
window.__mailYellowNodeBtn = true;

var PK = window.PKEYS || ['food','horse','siege','weapon'];

function ensureMailFlags(){
  if(!gs.letterFlags) gs.letterFlags = { used:{}, serial:{}, justEntered:{}, pendingEnter:{} };
  if(!gs.letterFlags.used) gs.letterFlags.used = {};
  if(!gs.letterFlags.justEntered) gs.letterFlags.justEntered = {};
  if(!gs.letterFlags.pendingEnter) gs.letterFlags.pendingEnter = {};
  if(!gs.mail) gs.mail = {};
  PK.forEach(function(k){
    if(!gs.mail[k]) gs.mail[k] = { hasNew:false, lastExchange:null, lastDemand:null };
    if(gs.letterFlags.pendingEnter[k]==null) gs.letterFlags.pendingEnter[k] = null;
  });
  if(!gs.choices) gs.choices = {};
  if(!gs.activeLetter) gs.activeLetter = {};
}

/** ノード到達メール用。justEnteredはターン進行で消えるので pendingEnter を正とする */
function setPendingEnter(key, node){
  ensureMailFlags();
  gs.letterFlags.pendingEnter[key] = node;
  gs.letterFlags.justEntered[key] = true; // 互換
}

function clearPendingEnter(key){
  ensureMailFlags();
  gs.letterFlags.pendingEnter[key] = null;
  gs.letterFlags.justEntered[key] = false;
}

function letterDisabled(e){ return !e || e.disabled === true; }

function matchWhenMail(when, key){
  if(!when) return true;
  if(when.fallback) return false;
  ensureMailFlags();
  var node = gs.node[key]||0;
  var trust = gs.trust[key]||0;
  var pend = gs.letterFlags.pendingEnter[key];

  if(when.node!=null && node!==when.node) return false;
  if(when.node_gte!=null && node<when.node_gte) return false;
  if(when.node_lte!=null && node>when.node_lte) return false;
  if(when.trust_gte!=null && trust<when.trust_gte) return false;
  if(when.trust_lt!=null && trust>=when.trust_lt) return false;

  if(when.on_node_enter){
    // 到達したノード番号が pending と一致するときだけ
    if(pend==null) return false;
    if(when.node!=null && pend!==when.node) return false;
    if(when.node==null && when.node_gte!=null && pend<when.node_gte) return false;
    if(when.node==null && when.node_gte==null && pend==null) return false;
  }

  var id = when._id || when.id || '';
  if(when.once && id && gs.letterFlags.used[id]) return false;
  // node enter letters also once-per-arrival: mark used by id
  if(when.on_node_enter && id && gs.letterFlags.used[id]) return false;

  return true;
}

function poolKind(key, kind){
  return (CFG.letterPool && CFG.letterPool[key] && CFG.letterPool[key][kind])
    || (CFG.letters && CFG.letters[key] && CFG.letters[key][kind])
    || (typeof GAME_DATA!=='undefined' && GAME_DATA.letters && GAME_DATA.letters[key] && GAME_DATA.letters[key][kind])
    || [];
}

function pickNewEntry(key, kind){
  var pool = poolKind(key, kind);
  var cands = [];
  pool.forEach(function(raw){
    if(letterDisabled(raw)) return;
    if(raw.when && raw.when.fallback) return;
    var e = Object.assign({}, raw, { when: Object.assign({}, raw.when||{}) });
    e.when._id = e.id;
    if(e.id && gs.letterFlags.used[e.id]) return;
    if(!matchWhenMail(e.when, key)) return;
    cands.push(e);
  });
  cands.sort(function(a,b){ return (b.priority||0)-(a.priority||0); });
  return cands[0] || null;
}

function recomputeMailFlags(){
  ensureMailFlags();
  PK.forEach(function(key){
    var pers = pickNewEntry(key, 'personal');
    var has = false;
    if(pers){
      // already replied this letter id this phase
      if(gs.choices[key] && gs.choices[key].letterId === pers.id) has = false;
      else if(gs.letterFlags.used[pers.id]) has = false;
      else has = true;
    }
    gs.mail[key].hasNew = has;
    gs.mail[key].pendingPersonal = has ? pers : null;
    gs.mail[key].pendingDemand = pickNewEntry(key, 'demand');
  });
}
window.recomputeMailFlags = recomputeMailFlags;

function updateMailTabStyles(){
  ensureMailFlags();
  recomputeMailFlags();
  PK.forEach(function(key){
    var tab = document.getElementById('ptab-'+key);
    if(!tab) return;
    var on = !!(gs.mail[key] && gs.mail[key].hasNew);
    tab.classList.toggle('mail-new', on);
    // 出立可能の urg-tab は黄色枠に使わない（クラスは残して文字色のみ）
    if(on) tab.classList.remove('urg-tab');
  });
}
window.updateMailTabStyles = updateMailTabStyles;

function fillT(s, key){
  if(!s) return '';
  if(typeof fillTemplate==='function') return fillTemplate(s, key);
  var od = (gs.order&&gs.order[key])||{};
  return String(s)
    .replace(/{{order_label}}/g, od.label||'')
    .replace(/{{deadline}}/g, String(od.deadline!=null?od.deadline:'?'))
    .replace(/{{node}}/g, String(gs.node[key]||0));
}

window.renderLetter = function(key){
  ensureMailFlags();
  recomputeMailFlags();
  var mail = gs.mail[key];
  var demEl = document.getElementById('lt-'+key+'-demand');
  var gm = document.getElementById('girl-msg-'+key);
  var pb = document.getElementById('personal-body-'+key);
  var area = document.getElementById('choices-area-'+key);

  // demand 文官
  var dem = mail.pendingDemand;
  var demBody, demFrom;
  if(dem){
    demBody = fillT(dem.body, key);
    demFrom = '文官より（ノード'+(gs.node[key]||0)+' 新規）';
    mail.lastDemand = { body:demBody, node:gs.node[key]||0, fromLabel:demFrom, id:dem.id };
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].demand = dem;
    gs.activeLetter[key].demandId = dem.id;
  } else if(mail.lastDemand){
    demBody = mail.lastDemand.body;
    demFrom = (mail.lastDemand.fromLabel||'文官より') + '・再掲';
  } else {
    var od = gs.order&&gs.order[key];
    demFrom = '文官より';
    demBody = od
      ? ('このノードの依頼：'+od.label+'（納期残 '+(od.deadline!=null?od.deadline:'?')+'T）\n※新しい文官報告はありません。')
      : '新しい文官報告はありません。';
  }
  if(demEl){
    demEl.innerHTML = '<div class="letter-block"><div class="letter-from">'+demFrom+'</div>'+
      (!dem?'<div class="mail-archive-note">（このノードの記録）</div>':'')+
      '<div class="letter-text">'+String(demBody).replace(/\n/g,'<br>').replace(/\n/g,'<br>')+'</div></div>';
  }

  // personal 娘
  if(mail.hasNew && mail.pendingPersonal){
    var pe = mail.pendingPersonal;
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].personal = pe;
    gs.activeLetter[key].personalId = pe.id;
    if(gm) gm.textContent = pe.intro || '娘からの手紙です。';
    if(pb) pb.innerHTML = '<div class="letter-block"><div class="letter-text">'+String(pe.body||'').replace(/\n/g,'<br>')+'</div></div>';
    renderChoicesMail(key, pe.choices||defaultCh(), pe.id);
  } else {
    var ex = mail.lastExchange;
    if(gm) gm.textContent = ex ? '前回のやりとりはこんなでした。' : 'まだ娘とのやりとりはありません。';
    if(pb){
      if(ex){
        pb.innerHTML = '<div class="mail-archive-note">前回のやりとり</div>'+
          '<div class="letter-block"><div class="letter-text">'+String(ex.body||'').replace(/\n/g,'<br>')+'</div></div>'+
          (ex.choiceText?'<div class="letter-block" style="margin-top:8px"><div class="letter-from">あなたの返事</div><div class="letter-text">'+ex.choiceText+'</div></div>':'');
      } else {
        pb.innerHTML = '<div class="letter-block"><div class="letter-text">（記録なし）</div></div>';
      }
    }
    if(area) area.innerHTML = '';
  }
  updateMailTabStyles();
};

function defaultCh(){
  return [{icon:'📋',text:'「承知しました」',trust:0},{icon:'🤝',text:'「気にかけています」',trust:0}];
}
function renderChoicesMail(key, opts, letterId){
  var area=document.getElementById('choices-area-'+key); if(!area) return;
  var chosen=gs.choices[key];
  var html='<div class="choices-wrap"><div class="choices-label">返事を選んでください（取り消し不可）</div>';
  opts.forEach(function(o,i){
    var sel=(chosen&&chosen.idx===i)?'selected':'';
    html+='<button type="button" class="choice-btn '+sel+'" data-i="'+i+'">'+
      '<span class="choice-icon">'+(o.icon||'')+'</span><div>'+o.text+
      (o.trust?('<span class="trust-hint">✦ 信頼度 +'+o.trust+'</span>'):'')+'</div></button>';
  });
  html+='</div>';
  area.innerHTML=html;
  area.querySelectorAll('.choice-btn').forEach(function(btn){
    btn.onclick=function(){
      var i=parseInt(btn.getAttribute('data-i'),10);
      window.selectChoice(key, i, opts[i].trust||0, btn, letterId, opts[i].text);
    };
  });
}

window.selectChoice = function(key, idx, trust, el, letterId, choiceText){
  ensureMailFlags();
  recomputeMailFlags();
  if(!gs.mail[key] || !gs.mail[key].hasNew){
    showToast('いま返信が必要な手紙はありません');
    return;
  }
  if(gs.choices[key]!==undefined) return;
  var pe = gs.mail[key].pendingPersonal;
  var lid = letterId || (pe && pe.id);
  var body = pe && pe.body;
  var intro = pe && pe.intro;
  var ctext = choiceText || (pe && pe.choices && pe.choices[idx] && pe.choices[idx].text) || '';

  gs.choices[key] = { idx:idx, trust:trust||0, letterId:lid, choiceText:ctext };
  gs.trust[key] = Math.min(100, (gs.trust[key]||0) + (trust||0));
  if(el){
    var area=document.getElementById('choices-area-'+key);
    if(area) area.querySelectorAll('.choice-btn').forEach(function(b){ b.classList.remove('selected'); });
    el.classList.add('selected');
  }

  // 消費: once / node-enter を即 used に（黄色解除の本命）
  if(lid) gs.letterFlags.used[lid] = true;
  if(pe && pe.when && pe.when.on_node_enter){
    clearPendingEnter(key);
  }
  // 文官 demand も同じ到達なら同時消費
  var dem = gs.mail[key].pendingDemand;
  if(dem && dem.id){
    gs.letterFlags.used[dem.id] = true;
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].demand = dem;
  }

  gs.mail[key].lastExchange = {
    intro:intro, body:body, choiceText:ctext, trustDelta:trust||0, letterId:lid, turn:gs.turn
  };
  gs.mail[key].hasNew = false;
  gs.mail[key].pendingPersonal = null;

  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updatePrinceBar==='function') updatePrinceBar();
  updateMailTabStyles();
  // 再描画でアーカイブ表示に
  window.renderLetter(key);
  showToast((typeof PNAMES!=='undefined'?PNAMES[key]:key)+'へ返信しました');
};

window.renderAllLetters = function(){
  ensureMailFlags();
  recomputeMailFlags();
  PK.forEach(function(k){ window.renderLetter(k); });
  updateMailTabStyles();
};
try{ renderAllLetters = window.renderAllLetters; }catch(e){}

window.tryGoToMgmt = function(){
  ensureMailFlags();
  recomputeMailFlags();
  var pending = PK.filter(function(k){ return gs.mail[k] && gs.mail[k].hasNew; });
  if(pending.length){
    var msg = '返信していない手紙があります';
    if(typeof showToast==='function') showToast(msg);
    alert(msg);
    return;
  }
  // 未使用の demand だけ消費（personal は返信時に済）
  PK.forEach(function(k){
    var dem = gs.mail[k] && gs.mail[k].pendingDemand;
    if(dem && dem.id) gs.letterFlags.used[dem.id] = true;
    // pendingEnter は返信で消えている想定。残っていればクリア
    // 新規が無いのに残っている enter は消化
    if(!gs.mail[k].hasNew) clearPendingEnter(k);
  });
  if(typeof markLettersConsumedForTurn==='function'){
    try{ markLettersConsumedForTurn(); }catch(e){}
  }
  PK.forEach(function(k){ if(gs.letterFlags) gs.letterFlags.justEntered[k]=false; });
  if(typeof window.goToMgmt==='function') window.goToMgmt();
  else if(typeof goToMgmt==='function') goToMgmt();
};
try{ tryGoToMgmt = window.tryGoToMgmt; }catch(e){}

// sortie: set pendingEnter
function wrapSortie(){
  var prev = window.sortie;
  if(typeof prev!=='function' && typeof sortie==='function') prev = sortie;
  if(typeof prev!=='function') return;
  window.sortie = function(key){
    var r = prev.apply(this, arguments);
    // after sortie node should be 1
    if(gs.sortied && gs.sortied[key]){
      setPendingEnter(key, gs.node[key]||1);
      console.log('[mail] pendingEnter', key, gs.letterFlags.pendingEnter[key]);
    }
    return r;
  };
  try{ sortie = window.sortie; }catch(e){}
}
wrapSortie();

// 完納後に次ノードへ進め、到達メール用 pendingEnter をセット（1回だけ）
var _coc = window.checkOrderComplete;
window.checkOrderComplete = function(key){
  if(typeof _coc==='function') _coc(key);
  var od = gs.order && gs.order[key];
  if(!od || !od.items) return;
  if(!od.items.every(function(it){ return (it.delivered||0)>=it.qty; })) return;
  if(od._nodeAdvanced) return;
  var n = od.node || gs.node[key] || 1;
  var next = n + 1;
  if(next > 4) return;
  od._nodeAdvanced = true;
  gs.node[key] = next;
  if(typeof setOrderForNode==='function') setOrderForNode(key, next);
  setPendingEnter(key, next);
  showToast((typeof PNAMES!=='undefined'?PNAMES[key]:key)+' がノード'+next+'へ（次の手紙で報告）');
  if(typeof refreshMapNodes==='function') refreshMapNodes();
};
try{ checkOrderComplete = window.checkOrderComplete; }catch(e){}

// CRITICAL: do not wipe pendingEnter / justEntered on turn advance before letter phase
(function(){
  var orig = window.goToNextTurn;
  if(typeof orig!=='function') return;
  window.goToNextTurn = function(){
    ensureMailFlags();
    // snapshot pending enter
    var snap = {};
    PK.forEach(function(k){ snap[k] = gs.letterFlags.pendingEnter[k]; });
    var r = orig.apply(this, arguments);
    // restore if something cleared them
    ensureMailFlags();
    PK.forEach(function(k){
      if(snap[k]!=null){
        gs.letterFlags.pendingEnter[k] = snap[k];
        gs.letterFlags.justEntered[k] = true;
      }
    });
    gs.choices = {}; // new letter phase
    setTimeout(function(){
      recomputeMailFlags();
      if(typeof window.renderAllLetters==='function') window.renderAllLetters();
      updateMailTabStyles();
    }, 60);
    return r;
  };
})();

// updateTabLabels: don't leave mail-new wrong; re-apply mail styles after
var _ut = window.updateTabLabels;
window.updateTabLabels = function(){
  if(typeof _ut==='function') _ut();
  updateMailTabStyles();
};
try{ updateTabLabels = window.updateTabLabels; }catch(e){}

// setPhase letter
var _sp = window.setPhase;
if(typeof _sp==='function'){
  window.setPhase = function(p){
    var r = _sp.apply(this, arguments);
    if(p==='letter'){
      ensureMailFlags();
      recomputeMailFlags();
      if(typeof window.renderAllLetters==='function') window.renderAllLetters();
      updateMailTabStyles();
      var btn=document.getElementById('ph-letter-complete');
      if(btn){
        btn.onclick=function(ev){ if(ev) ev.preventDefault(); window.tryGoToMgmt(); };
        btn.setAttribute('onclick','tryGoToMgmt()');
      }
    }
    return r;
  };
  try{ setPhase = window.setPhase; }catch(e){}
}

// ranch couple button polish after render
var _rsa = window.renderSeasonActions;
if(typeof _rsa==='function' || typeof renderSeasonActions==='function'){
  var prev = window.renderSeasonActions || renderSeasonActions;
  window.renderSeasonActions = function(){
    prev.apply(this, arguments);
    var b = document.getElementById('btn-pair-confirm');
    if(b){
      b.classList.add('btn-pair-confirm','btn-prod-start');
      b.style.background = '';
      b.style.color = '';
      b.style.fontSize = '';
      b.style.padding = '';
    }
    // enlarge any season action buttons
    var box = document.getElementById('ranch-season-actions');
    if(box){
      box.querySelectorAll('button').forEach(function(btn){
        btn.classList.add('btn-pair-confirm');
      });
    }
  };
  try{ renderSeasonActions = window.renderSeasonActions; }catch(e){}
}

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    ensureMailFlags();
    recomputeMailFlags();
    updateMailTabStyles();
    if(gs.phase==='letter' && typeof window.renderAllLetters==='function') window.renderAllLetters();
  }, 200);
});

console.log('[mail yellow+node+btn] ready');
})();


// ═══ tab [新着！] + pendingEnter + action buttons ═══
(function(){
'use strict';
if(window.__tabShinchoFix) return;
window.__tabShinchoFix = true;

var PK = window.PKEYS || ['food','horse','siege','weapon'];
var NODE_LOC = {0:'出立待ち', 1:'戦地壱', 2:'戦地弐', 3:'戦地参', 4:'敵城'};

function ensureMailFlags(){
  if(!gs.letterFlags) gs.letterFlags = { used:{}, serial:{}, justEntered:{}, pendingEnter:{} };
  if(!gs.letterFlags.used) gs.letterFlags.used = {};
  if(!gs.letterFlags.justEntered) gs.letterFlags.justEntered = {};
  if(!gs.letterFlags.pendingEnter) gs.letterFlags.pendingEnter = {};
  if(!gs.mail) gs.mail = {};
  PK.forEach(function(k){
    if(!gs.mail[k]) gs.mail[k] = { hasNew:false, lastExchange:null, lastDemand:null };
    if(gs.letterFlags.pendingEnter[k]===undefined) gs.letterFlags.pendingEnter[k] = null;
  });
  if(!gs.choices) gs.choices = {};
  if(!gs.activeLetter) gs.activeLetter = {};
}

function setPendingEnter(key, node){
  ensureMailFlags();
  gs.letterFlags.pendingEnter[key] = node;
  gs.letterFlags.justEntered[key] = true;
}
function clearPendingEnter(key){
  ensureMailFlags();
  gs.letterFlags.pendingEnter[key] = null;
  gs.letterFlags.justEntered[key] = false;
}

function letterDisabled(e){ return !e || e.disabled === true; }

function matchWhenMail(when, key){
  if(!when) return true;
  if(when.fallback) return false;
  ensureMailFlags();
  var node = gs.node[key]||0;
  var trust = gs.trust[key]||0;
  var pend = gs.letterFlags.pendingEnter[key];
  if(when.node!=null && node!==when.node) return false;
  if(when.node_gte!=null && node<when.node_gte) return false;
  if(when.node_lte!=null && node>when.node_lte) return false;
  if(when.trust_gte!=null && trust<when.trust_gte) return false;
  if(when.trust_lt!=null && trust>=when.trust_lt) return false;
  if(when.on_node_enter){
    if(pend==null) return false;
    if(when.node!=null && pend!==when.node) return false;
    if(when.node==null && when.node_gte!=null && pend<when.node_gte) return false;
  }
  var id = when._id || when.id || '';
  if(id && gs.letterFlags.used[id]) return false;
  if(when.once && id && gs.letterFlags.used[id]) return false;
  return true;
}

function poolKind(key, kind){
  return (CFG.letterPool && CFG.letterPool[key] && CFG.letterPool[key][kind])
    || (CFG.letters && CFG.letters[key] && CFG.letters[key][kind])
    || (typeof GAME_DATA!=='undefined' && GAME_DATA.letters && GAME_DATA.letters[key] && GAME_DATA.letters[key][kind])
    || [];
}

function pickNewEntry(key, kind){
  var pool = poolKind(key, kind);
  var cands = [];
  pool.forEach(function(raw){
    if(letterDisabled(raw)) return;
    if(raw.when && raw.when.fallback) return;
    var e = Object.assign({}, raw, { when: Object.assign({}, raw.when||{}) });
    e.when._id = e.id;
    if(e.id && gs.letterFlags.used[e.id]) return;
    if(!matchWhenMail(e.when, key)) return;
    cands.push(e);
  });
  cands.sort(function(a,b){ return (b.priority||0)-(a.priority||0); });
  return cands[0] || null;
}

function recomputeMailFlags(){
  ensureMailFlags();
  PK.forEach(function(key){
    var pers = pickNewEntry(key, 'personal');
    var has = false;
    if(pers){
      if(gs.letterFlags.used[pers.id]) has = false;
      else if(gs.choices[key] && gs.choices[key].letterId === pers.id) has = false;
      else has = true;
    }
    gs.mail[key].hasNew = has;
    gs.mail[key].pendingPersonal = has ? pers : null;
    gs.mail[key].pendingDemand = pickNewEntry(key, 'demand');
  });
}
window.recomputeMailFlags = recomputeMailFlags;

function locationLabel(key){
  if(!gs.sortied || !gs.sortied[key]) return '出立待ち';
  var n = (gs.node && gs.node[key]) || 1;
  if(n < 0) n = 0;
  if(n > 4) n = 4;
  return NODE_LOC[n] || ('ノード'+n);
}

/** 枠の黄色は付けない。文言だけ更新 */
function updateMailTabStyles(){
  ensureMailFlags();
  recomputeMailFlags();
  PK.forEach(function(key){
    var tab = document.getElementById('ptab-'+key);
    if(tab) tab.classList.remove('mail-new'); // 黄色枠を使わない
    var req = document.getElementById('ltab-req-'+key);
    var dl = document.getElementById('ltab-dl-'+key);
    var loc = locationLabel(key);
    var hasNew = !!(gs.mail[key] && gs.mail[key].hasNew);
    if(req){
      // 1行目: 状態のみ（準備：〜 は出さない）
      req.textContent = loc;
    }
    if(dl){
      if(hasNew){
        dl.textContent = '[新着！]';
        dl.classList.add('tab-shincho');
      } else {
        dl.textContent = '';
        dl.classList.remove('tab-shincho');
      }
    }
    var chk = document.getElementById('tab-check-'+key);
    if(chk) chk.textContent = (gs.choices[key]!==undefined) ? '☑ ' : '';
  });
}
window.updateMailTabStyles = updateMailTabStyles;

// 完全上書き: 従来の2行「準備」「出立待ち」をやめる
window.updateTabLabels = function(){
  updateMailTabStyles();
  // 謁見タブ
  var ks = document.getElementById('kg-summary-tab');
  if(ks){
    var parts = [];
    if(gs.kengen && gs.kengen.shingen) parts.push('進言✓');
    ks.textContent = parts.length ? parts.join(' ') : '進言';
  }
};
try{ updateTabLabels = window.updateTabLabels; }catch(e){}

function fillT(s, key){
  if(!s) return '';
  if(typeof fillTemplate==='function') return fillTemplate(s, key);
  var od = (gs.order&&gs.order[key])||{};
  return String(s)
    .replace(/{{order_label}}/g, od.label||'')
    .replace(/{{deadline}}/g, String(od.deadline!=null?od.deadline:'?'))
    .replace(/{{node}}/g, String(gs.node[key]||0));
}

function defaultCh(){
  return [{icon:'📋',text:'「承知しました」',trust:0},{icon:'🤝',text:'「気にかけています」',trust:0}];
}

function renderChoicesMail(key, opts, letterId){
  var area=document.getElementById('choices-area-'+key); if(!area) return;
  var chosen=gs.choices[key];
  var html='<div class="choices-wrap"><div class="choices-label">返事を選んでください（取り消し不可）</div>';
  opts.forEach(function(o,i){
    var sel=(chosen&&chosen.idx===i)?'selected':'';
    html+='<button type="button" class="choice-btn '+sel+'" data-i="'+i+'">'+
      '<span class="choice-icon">'+(o.icon||'')+'</span><div>'+o.text+
      (o.trust?('<span class="trust-hint">✦ 信頼度 +'+o.trust+'</span>'):'')+'</div></button>';
  });
  html+='</div>';
  area.innerHTML=html;
  area.querySelectorAll('.choice-btn').forEach(function(btn){
    btn.onclick=function(){
      var i=parseInt(btn.getAttribute('data-i'),10);
      window.selectChoice(key, i, opts[i].trust||0, btn, letterId, opts[i].text);
    };
  });
}

window.renderLetter = function(key){
  ensureMailFlags();
  recomputeMailFlags();
  var mail = gs.mail[key];
  var demEl = document.getElementById('lt-'+key+'-demand');
  var gm = document.getElementById('girl-msg-'+key);
  var pb = document.getElementById('personal-body-'+key);
  var area = document.getElementById('choices-area-'+key);

  var dem = mail.pendingDemand;
  var demBody, demFrom;
  if(dem){
    demBody = fillT(dem.body, key);
    demFrom = '文官より（ノード'+(gs.node[key]||0)+'）';
    mail.lastDemand = { body:demBody, node:gs.node[key]||0, fromLabel:demFrom, id:dem.id };
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].demand = dem;
    gs.activeLetter[key].demandId = dem.id;
  } else if(mail.lastDemand){
    demBody = mail.lastDemand.body;
    demFrom = (mail.lastDemand.fromLabel||'文官より')+'・再掲';
  } else {
    var od = gs.order&&gs.order[key];
    demFrom = '文官より';
    demBody = od
      ? ('このノードの依頼：'+od.label+'（納期残 '+(od.deadline!=null?od.deadline:'?')+'T）')
      : '新しい文官報告はありません。';
  }
  if(demEl){
    demEl.innerHTML = '<div class="letter-block"><div class="letter-from">'+demFrom+'</div>'+
      '<div class="letter-text">'+String(demBody).replace(/\n/g,'<br>')+'</div></div>';
  }

  if(mail.hasNew && mail.pendingPersonal){
    var pe = mail.pendingPersonal;
    gs.activeLetter[key] = gs.activeLetter[key]||{};
    gs.activeLetter[key].personal = pe;
    gs.activeLetter[key].personalId = pe.id;
    if(gm) gm.textContent = pe.intro || '娘からの手紙です。';
    if(pb) pb.innerHTML = '<div class="letter-block"><div class="letter-text">'+String(pe.body||'').replace(/\n/g,'<br>')+'</div></div>';
    renderChoicesMail(key, pe.choices||defaultCh(), pe.id);
  } else {
    var ex = mail.lastExchange;
    if(gm) gm.textContent = ex ? '前回のやりとりはこんなでした。' : 'まだ娘とのやりとりはありません。';
    if(pb){
      if(ex){
        pb.innerHTML = '<div class="mail-archive-note">前回のやりとり</div>'+
          '<div class="letter-block"><div class="letter-text">'+String(ex.body||'').replace(/\n/g,'<br>')+'</div></div>'+
          (ex.choiceText?'<div class="letter-block" style="margin-top:8px"><div class="letter-from">あなたの返事</div><div class="letter-text">'+ex.choiceText+'</div></div>':'');
      } else {
        pb.innerHTML = '<div class="letter-block"><div class="letter-text">（記録なし）</div></div>';
      }
    }
    if(area) area.innerHTML = '';
  }
  updateMailTabStyles();
};

window.selectChoice = function(key, idx, trust, el, letterId, choiceText){
  ensureMailFlags();
  recomputeMailFlags();
  if(!gs.mail[key] || !gs.mail[key].hasNew){
    showToast('いま返信が必要な手紙はありません');
    return;
  }
  if(gs.choices[key]!==undefined) return;
  var pe = gs.mail[key].pendingPersonal;
  var lid = letterId || (pe && pe.id);
  var body = pe && pe.body;
  var intro = pe && pe.intro;
  var ctext = choiceText || (pe && pe.choices && pe.choices[idx] && pe.choices[idx].text) || '';
  gs.choices[key] = { idx:idx, trust:trust||0, letterId:lid, choiceText:ctext };
  gs.trust[key] = Math.min(100, (gs.trust[key]||0)+(trust||0));
  if(el){
    var area=document.getElementById('choices-area-'+key);
    if(area) area.querySelectorAll('.choice-btn').forEach(function(b){ b.classList.remove('selected'); });
    el.classList.add('selected');
  }
  if(lid) gs.letterFlags.used[lid] = true;
  if(pe && pe.when && pe.when.on_node_enter) clearPendingEnter(key);
  var dem = gs.mail[key].pendingDemand;
  if(dem && dem.id) gs.letterFlags.used[dem.id] = true;
  gs.mail[key].lastExchange = { intro:intro, body:body, choiceText:ctext, trustDelta:trust||0, letterId:lid, turn:gs.turn };
  gs.mail[key].hasNew = false;
  gs.mail[key].pendingPersonal = null;
  if(typeof updateHeaderDisplay==='function') updateHeaderDisplay();
  if(typeof updatePrinceBar==='function') updatePrinceBar();
  window.renderLetter(key);
  showToast((typeof PNAMES!=='undefined'?PNAMES[key]:key)+'へ返信しました');
};

window.renderAllLetters = function(){
  ensureMailFlags();
  recomputeMailFlags();
  PK.forEach(function(k){ window.renderLetter(k); });
  updateMailTabStyles();
};
try{ renderAllLetters = window.renderAllLetters; }catch(e){}

window.tryGoToMgmt = function(){
  ensureMailFlags();
  recomputeMailFlags();
  var pending = PK.filter(function(k){ return gs.mail[k] && gs.mail[k].hasNew; });
  if(pending.length){
    var msg = '返信していない手紙があります';
    if(typeof showToast==='function') showToast(msg);
    alert(msg);
    return;
  }
  PK.forEach(function(k){
    var dem = gs.mail[k] && gs.mail[k].pendingDemand;
    if(dem && dem.id) gs.letterFlags.used[dem.id] = true;
    if(!gs.mail[k].hasNew) clearPendingEnter(k);
  });
  if(typeof markLettersConsumedForTurn==='function'){
    try{ markLettersConsumedForTurn(); }catch(e){}
  }
  if(typeof window.goToMgmt==='function') window.goToMgmt();
  else if(typeof goToMgmt==='function') goToMgmt();
};
try{ tryGoToMgmt = window.tryGoToMgmt; }catch(e){}

// sortie → pendingEnter
(function(){
  var prev = window.sortie;
  if(typeof prev!=='function' && typeof sortie==='function') prev = sortie;
  if(typeof prev!=='function') return;
  window.sortie = function(key){
    var r = prev.apply(this, arguments);
    if(gs.sortied && gs.sortied[key]){
      setPendingEnter(key, gs.node[key]||1);
      console.log('[mail] pendingEnter after sortie', key, gs.letterFlags.pendingEnter[key]);
    }
    if(typeof window.updateTabLabels==='function') window.updateTabLabels();
    return r;
  };
  try{ sortie = window.sortie; }catch(e){}
})();

// goToNextTurn: preserve pendingEnter
(function(){
  var orig = window.goToNextTurn;
  if(typeof orig!=='function') return;
  window.goToNextTurn = function(){
    ensureMailFlags();
    var snap = {};
    PK.forEach(function(k){ snap[k] = gs.letterFlags.pendingEnter[k]; });
    var r = orig.apply(this, arguments);
    ensureMailFlags();
    PK.forEach(function(k){
      if(snap[k]!=null){
        gs.letterFlags.pendingEnter[k] = snap[k];
        gs.letterFlags.justEntered[k] = true;
      }
    });
    gs.choices = {};
    setTimeout(function(){
      recomputeMailFlags();
      if(typeof window.renderAllLetters==='function') window.renderAllLetters();
      updateMailTabStyles();
    }, 60);
    return r;
  };
})();

// setPhase letter
(function(){
  var _sp = window.setPhase;
  if(typeof _sp!=='function') return;
  window.setPhase = function(p){
    var r = _sp.apply(this, arguments);
    if(p==='letter'){
      ensureMailFlags();
      recomputeMailFlags();
      if(typeof window.renderAllLetters==='function') window.renderAllLetters();
      updateMailTabStyles();
      var btn=document.getElementById('ph-letter-complete');
      if(btn){
        btn.onclick=function(ev){ if(ev) ev.preventDefault(); window.tryGoToMgmt(); };
        btn.setAttribute('onclick','tryGoToMgmt()');
      }
    }
    return r;
  };
  try{ setPhase = window.setPhase; }catch(e){}
})();

// ranch couple button style after render
(function(){
  var prev = window.renderSeasonActions || (typeof renderSeasonActions==='function'?renderSeasonActions:null);
  if(!prev) return;
  window.renderSeasonActions = function(){
    prev.apply(this, arguments);
    var b = document.getElementById('btn-pair-confirm');
    if(b){
      b.className = 'btn-pair-confirm btn-prod-start';
      b.textContent = b.textContent || 'カップリング確定';
    }
  };
  try{ renderSeasonActions = window.renderSeasonActions; }catch(e){}
})();

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    ensureMailFlags();
    // 起動時に全タブから mail-new を除去
    PK.forEach(function(k){
      var t=document.getElementById('ptab-'+k);
      if(t) t.classList.remove('mail-new');
    });
    recomputeMailFlags();
    updateMailTabStyles();
    if(gs.phase==='letter' && typeof window.renderAllLetters==='function') window.renderAllLetters();
  }, 180);
});

console.log('[tab shincho] ready — no yellow frame, [新着！] text only');
})();


// ═══ market season + trust prep text + red shincho ═══
(function(){
'use strict';
if(window.__marketSeasonUiFix) return;
window.__marketSeasonUiFix = true;

var ME = window.MARKET_ECON || {};
var RAW_KEYS = ['iron','wood','niter','herb','food_mat','med'];

function mcfg(){ return window.MARKET_ECON || ME || {}; }

// ① 新着赤（CSSでも指定。JSで再適用）
function styleShinchoRed(){
  // nothing dynamic beyond class tab-shincho
}

// ② 輸送説明文を trust_reward と同期
function syncPrepTrustLabels(){
  try{
    if(typeof CFG==='undefined' || !CFG.prep_quests) return;
    var PK = window.PKEYS || ['food','horse','siege','weapon'];
    PK.forEach(function(key){
      var q = CFG.prep_quests[key];
      if(!q) return;
      var tr = q.trust_reward!=null ? q.trust_reward : 4;
      var el = document.getElementById('prep-info-'+key);
      if(!el) return;
      if(key==='horse'){
        el.textContent = '兵糧×4と回復薬×1を手渡すと信頼度+'+tr+'。薬は冬の牧場でも大事…';
      } else {
        el.textContent = '準備品を手渡すと信頼度が上がります（+'+tr+'）';
      }
    });
  }catch(e){ console.warn('syncPrepTrustLabels', e); }
}
window.syncPrepTrustLabels = syncPrepTrustLabels;

// 価格: 在庫比で倍率。同季は常に売＜買（季節またぎで利益）
window.priceFromStock = function(res){
  var M = mcfg();
  var baseB = (M.baseBuy && M.baseBuy[res]) || 20;
  var baseS = (M.baseSell && M.baseSell[res]) || Math.round(baseB * 0.9);
  if(res==='med' || res==='sword' || res==='siege_w'){
    return { buy: 999, sell: baseS };
  }
  var cap = (gs.market.shopCap && gs.market.shopCap[res]) || 20;
  var shop = (gs.market.shop && gs.market.shop[res]) || 0;
  var ratio = cap > 0 ? shop / cap : 0.5;
  if(ratio < 0) ratio = 0;
  if(ratio > 1) ratio = 1;
  var multMin = M.priceMultMin != null ? M.priceMultMin : 0.55;
  var multMax = M.priceMultMax != null ? M.priceMultMax : 1.55;
  // ratio0 → max, ratio1 → min
  var mult = multMax - ratio * (multMax - multMin);
  var buy = Math.max(1, Math.round(baseB * mult));
  // 同季スプレッド: 売 = 買 × sellToBuyRatio（既定0.9）かつ 必ず buy 未満
  var sratio = M.sellToBuyRatio != null ? M.sellToBuyRatio : 0.9;
  // base の比率も加味
  var baseRatio = baseB > 0 ? baseS / baseB : sratio;
  var useRatio = Math.min(sratio, baseRatio);
  if(useRatio >= 1) useRatio = 0.9;
  var sell = Math.max(1, Math.round(buy * useRatio));
  if(sell >= buy) sell = Math.max(1, buy - 1);
  return { buy: buy, sell: sell };
};

window.recomputePrices = function(savePrev){
  if(typeof ensureMarket==='function') ensureMarket();
  else if(typeof window.ensureMarket==='function') window.ensureMarket();
  if(!gs.market) return;
  if(savePrev){
    gs.market.prevBuy = Object.assign({}, gs.market.priceBuy || {});
  }
  var keys = RAW_KEYS.slice();
  keys.forEach(function(r){
    var p = window.priceFromStock(r);
    if(!gs.market.priceBuy) gs.market.priceBuy = {};
    if(!gs.market.priceSell) gs.market.priceSell = {};
    gs.market.priceBuy[r] = p.buy;
    gs.market.priceSell[r] = p.sell;
    if(typeof CFG!=='undefined' && CFG.prices && CFG.prices[r]){
      CFG.prices[r].buy = p.buy;
      CFG.prices[r].sell = p.sell;
    }
  });
  // products fixed sell
  ['sword','siege_w','med'].forEach(function(r){
    var M = mcfg();
    if(gs.market.priceSell) gs.market.priceSell[r] = (M.baseSell&&M.baseSell[r])||gs.market.priceSell[r]||0;
    if(gs.market.priceBuy) gs.market.priceBuy[r] = 999;
  });
};

// ④ 季節増減 + 最低在庫
window.applySeasonStockDelta = function(){
  if(typeof ensureMarket==='function') ensureMarket();
  else if(typeof window.ensureMarket==='function') window.ensureMarket();
  var M = mcfg();
  var table = M.seasonStockDelta || M.seasonRestock || {};
  var add = table[String(gs.season)] || {};
  var mins = M.shopMin || {};
  Object.keys(add).forEach(function(k){
    var cap = (gs.market.shopCap && gs.market.shopCap[k]) || 20;
    var min = mins[k] != null ? mins[k] : 0;
    var next = (gs.market.shop[k] || 0) + add[k];
    if(next > cap) next = cap;
    if(next < min) next = min;
    gs.market.shop[k] = next;
  });
  // ambient
  var amb = M.ambientDelta;
  if(amb == null) amb = 0;
  if(amb !== 0){
    RAW_KEYS.forEach(function(k){
      if(k==='med'||k==='sword'||k==='siege_w') return;
      var cap = (gs.market.shopCap && gs.market.shopCap[k]) || 20;
      var min = mins[k] != null ? mins[k] : 0;
      var next = (gs.market.shop[k] || 0) + amb;
      if(next > cap) next = cap;
      if(next < min) next = min;
      gs.market.shop[k] = next;
    });
  }
  // clamp all to min/max
  RAW_KEYS.forEach(function(k){
    if(gs.market.shop[k]==null) return;
    var cap = (gs.market.shopCap && gs.market.shopCap[k]) || 20;
    var min = mins[k] != null ? mins[k] : 0;
    if(gs.market.shop[k] > cap) gs.market.shop[k] = cap;
    if(gs.market.shop[k] < min) gs.market.shop[k] = min;
  });
};
// alias
window.seasonRestock = function(){ window.applySeasonStockDelta(); };
if(typeof seasonRestock==='function'){
  try{ seasonRestock = window.seasonRestock; }catch(e){}
}

// ⑤ ターン進行: 前期保存 → 季節在庫 → 今季価格
(function(){
  var orig = window.goToNextTurn;
  if(typeof orig!=='function') return;
  window.goToNextTurn = function(){
    try{
      if(typeof window.ensureMarket==='function') window.ensureMarket();
      // 1) 前期価格（季節変動前）
      if(gs.market && gs.market.priceBuy){
        gs.market.prevBuy = Object.assign({}, gs.market.priceBuy);
      }
    }catch(e){}
    var r = orig.apply(this, arguments);
    try{
      // 他フックが seasonRestock/recompute していても、順序を保証してやり直す
      if(typeof window.applySeasonStockDelta==='function') window.applySeasonStockDelta();
      if(typeof window.recomputePrices==='function') window.recomputePrices(false);
      if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
    }catch(e){ console.warn('market turn order', e); }
    try{ syncPrepTrustLabels(); }catch(e){}
    return r;
  };
})();

// openCard transport/market
(function(){
  var prev = window.openCard;
  if(typeof prev!=='function') return;
  window.openCard = function(name){
    var r = prev.apply(this, arguments);
    if(name==='transport' || name==='market'){
      syncPrepTrustLabels();
    }
    if(name==='market' && typeof window.refreshMarketUI==='function'){
      try{ window.recomputePrices(false); window.refreshMarketUI(); }catch(e){}
    }
    return r;
  };
  try{ openCard = window.openCard; }catch(e){}
})();

// setPhase transport
(function(){
  var _sp = window.setPhase;
  if(typeof _sp!=='function') return;
  window.setPhase = function(p){
    var r = _sp.apply(this, arguments);
    if(p==='transport' || p==='management'){
      syncPrepTrustLabels();
    }
    return r;
  };
  try{ setPhase = window.setPhase; }catch(e){}
})();

// confirmTrade: 売買後も min を割らない
(function(){
  var prev = window.confirmTrade;
  if(typeof prev!=='function') return;
  window.confirmTrade = function(){
    var r = prev.apply(this, arguments);
    try{
      var M = mcfg();
      var mins = M.shopMin || {};
      RAW_KEYS.forEach(function(k){
        if(!gs.market || gs.market.shop[k]==null) return;
        var min = mins[k]!=null ? mins[k] : 0;
        var cap = (gs.market.shopCap&&gs.market.shopCap[k])||20;
        if(gs.market.shop[k] < min) gs.market.shop[k] = min;
        if(gs.market.shop[k] > cap) gs.market.shop[k] = cap;
      });
      if(typeof window.recomputePrices==='function') window.recomputePrices(false);
      if(typeof window.refreshMarketUI==='function') window.refreshMarketUI();
    }catch(e){}
    return r;
  };
})();

document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){
    syncPrepTrustLabels();
    styleShinchoRed();
    try{
      if(typeof window.ensureMarket==='function') window.ensureMarket();
      if(typeof window.recomputePrices==='function') window.recomputePrices(false);
    }catch(e){}
  }, 120);
});

console.log('[market season+ui] ready — red shincho, prep trust labels, seasonal delta+min, price after stock');
})();

