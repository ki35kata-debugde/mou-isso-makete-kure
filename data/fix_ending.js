/**
 * fix_ending.js — エンディング＋最終手紙＋納期切れ撤退/死亡
 *
 * 適用内容:
 *  1) 敵城完納で最終手紙（文官宛demand＋娘宛personal）。信頼度80/100の手紙が
 *     競合する場合はそちらが先（priority 60 > 50、既存#5繰越機構で翌ターン送り）
 *  2) 4通の最終手紙(personal)すべてに返信 → エンディング（trust 100=結婚 /
 *     80-99=いい雰囲気 / <80=凱旋のみ、gold 5000両で文官エピローグ分岐）
 *  3) 納期切れ（残0Tのターンが終了）→ 1ノード撤退。戦地壱からは出立待ちへ。
 *     撤退のたび 1/5 で王子死亡 → ゲームオーバー
 *  4) 既存手紙の字句修正: 「便」→「荷」11箇所、炉子の選択肢を平和な建造へ
 *
 * 実行: "C:\Program Files\nodejs\node.exe" data\fix_ending.js
 * 対象: mou_isso_v0_6_1.html / index.html / data/game-data.js（字句修正のみ）
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HTMLS = ['mou_isso_v0_6_1.html', 'index.html'].map(f => path.join(ROOT, f));
const GAMEDATA = path.join(__dirname, 'game-data.js');

const BEGIN = '<!-- ═══ ENDING PATCH BEGIN ═══ -->';
const END = '<!-- ═══ ENDING PATCH END ═══ -->';

// ── 4) 既存手紙の字句修正（ユーザー指定・承認済み） ──
const TEXT_FIXES = [
  ['次便は急ぎ届けよ', '次の荷は急ぎ届けよ'],
  ['次便は兵の命を左右する', '次の荷は兵の命を左右する'],
  ['最後の便を確実に届け', '最後の荷を確実に届け'],
  ['初便の補給は、貴殿の目を頼りにする', '初めの荷は、貴殿の目を頼りにする'],
  ['初便は多めに積みます。未知の土地は誤差が出ます', '初めの荷は多めに積みます。未知の土地は誤差が出ます'],
  ['次便で補正します', '次の荷で補正します'],
  ['次の便も、貴殿の数字で兵を守ってくれ', '次の荷も、貴殿の数字で兵を守ってくれ'],
  ['次の便に人参を入れておきます', '次の荷に人参を入れておきます'],
  ['次便は鋼板を多めに送れ', '次の荷は鋼板を多めに送れ'],
  ['次の便も同じ炉で頼みたい', '次の荷も同じ炉で頼みたい'],
  ['次便で送ります', '次の荷で送ります'],
  ['帰還したら新型兵器を一緒に作りましょう', '帰還したら、今度は橋や水車を一緒に作りましょう'],
  // ── 矛盾修正（2026-07-18 ユーザー承認） ──
  // #1+#2 鋼剣→名剣、武刃四は回復薬を受け取らない（兄想いの表現へ）
  ['弩と鋼剣を頼む。それと回復薬を多めに。俺のじゃない、兵のだ。', '弩と名剣を頼む。回復薬はいらん。兄上たちには足りているのか？優先してそっちへ回せ。'],
  ['剣も鋼剣も、ありったけ寄越せ', '剣も名剣も、ありったけ寄越せ'],
  // #3 兵糧一万→五石（準備依頼の兵糧×5と整合）
  ['兵糧一万、誤差なく整えよ', '兵糧五石、誤差なく整えよ'],
  // #4 荷車（未解禁）→水 →（2026-07-18再修正）厳しい行軍表現へ
  ['他国の道は狭いらしい。荷車を減らすな。', '厳しい行軍になる。水を切らすな。'],
  ['他国の道は乾くらしい。水を切らすな。', '厳しい行軍になる。水を切らすな。'],
  // 兵糧太・戦地参：「笑いながら」→友を亡くしても耐える兵・これ以上失いたくない
  ['兵たちは私の粥を笑いながら食べている。味は薄いが、笑い声があるだけで温かく感じる。', '兵たちは黙って粥を食べている。友を亡くした者も、涙を見せず健気に耐えている。\\n……これ以上、誰も失いたくない。'],
  ['粥の味より「笑い声」を描くの、兵糧太様らしいです', '友を亡くしても耐える兵たちを、私たちの荷が支えるんですね…'],
  // 施設セリフの古い記述を現仕様へ（2026-07-18）
  ['冬は寒いので……兵糧と回復薬、多めにあげたいです。', '冬は寒いので……兵糧、多めにあげたいです。'],
  ['……回復薬をあげると、生まれてくる仔馬が元気になるそうです。楽しみです。', '……冬に兵糧をあげると、生まれてくる仔馬が元気になるそうです。楽しみです。'],
  ['いらっしゃいませ。売買の相場は今日も安定しています。薬の売却もお受けします。', 'いらっしゃいませ。相場は季節で動きます。お薬や武具の完成品も、売却お受けしますよ。'],
  ['衝車も剣も、丁寧に仕上げますよ！', '剣でも衝車でも、どんな注文も丁寧に仕上げますよ！'],
  ['毒にも薬にも……いえ、薬だけ作ります。', '毒にも薬にも……ふふ、最近は半々かもしれません。'],
  // #5 投石機は試作品扱い（解禁ツリーとの整合）
  ['投石機の腕木の反発力が弱い。支点の摩耗が原因だ。', '投石機の試作品を組んだが、腕木の反発力が弱い。支点の摩耗が原因だ。'],
  ['荒野の入口で新型投石機を試した。', '荒野の入口で投石機の試作品を試した。'],
];

// 信頼度80手紙の最良選択肢を +2 → +10 に（褒める進言+10と合わせて100=結婚ラインへ届く）
const TRUST80_BEST = [
  '「では次の計算書には御守りの印を押しておきますね」',      // food_trust_80
  '「帰還したら新しい絵を描きます。その仔の絵も」',          // horse_trust_80
  '「その調子です！次は雲の形もお願いします！」',            // siege_trust_80
  '「その約束、覚えておきます。破ったら薬代十倍です」',      // weapon_trust_80
];

function applyTrust80Fixes(src, label) {
  let out = src;
  TRUST80_BEST.forEach(text => {
    const esc = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('("text":\\s*"' + esc + '",\\s*"trust":\\s*)2', 'g');
    const before = out;
    out = out.replace(re, '$110');
    if (before === out) {
      if (new RegExp('("text":\\s*"' + esc + '",\\s*"trust":\\s*)10').test(out)) return; // 適用済み
      console.warn('  [warn] ' + label + ': trust80選択肢が見つからず: ' + text.slice(0, 12) + '…');
    } else {
      console.log('  [fix] ' + label + ': trust80最良選択肢 +2→+10: ' + text.slice(0, 12) + '…');
    }
  });
  return out;
}

function applyTextFixes(src, label) {
  let out = src;
  TEXT_FIXES.forEach(([from, to]) => {
    if (out.includes(to) && !out.includes(from)) return; // 適用済み
    const n = out.split(from).length - 1;
    if (n === 0) { console.warn('  [warn] ' + label + ': 見つからず: ' + from); return; }
    out = out.split(from).join(to);
    console.log('  [fix] ' + label + ': "' + from.slice(0, 14) + '…" ×' + n);
  });
  return out;
}

// ── ランタイムパッチ本体 ──
const PATCH_JS = String.raw`
(function(){
if(window.__endingPatch) return; window.__endingPatch = true;

var PK = (typeof PKEYS!=='undefined') ? PKEYS : ['food','horse','siege','weapon'];
var PN = (typeof PNAMES!=='undefined') ? PNAMES : {food:'兵糧太',horse:'騎馬次',siege:'攻三城',weapon:'武刃四'};
var DN = {food:'秤目', horse:'鞍馬', siege:'炉子', weapon:'芍薬'};
var LOC = {0:'出立待ち',1:'戦地壱',2:'戦地弐',3:'戦地参',4:'敵城'};

function ES(){ // ensure ending state
  if(typeof gs==='undefined') return false;
  if(!gs.castleCleared) gs.castleCleared = {};
  return true;
}

/* ══════════ 1) 最終手紙をプールへ注入 ══════════ */

var FINAL_LETTERS = {
  food: {
    demand: {
      id:'final_food_d', priority:50,
      when:{ castle_cleared:true, node_gte:4, once:true },
      body:'敵城、陥落した。東の戦は終わった。\n貴殿の荷は、一度も絶えなかった。兵が飢えずに戦を終えられたのは、貴殿の算段があってのことだ。\n長きにわたる補給の労、深く感謝する。都に戻り次第、私の口から礼を言わせてほしい。'
    },
    personal: {
      id:'final_food_p', priority:50,
      when:{ castle_cleared:true, node_gte:4, once:true },
      intro:'……おかえりなさい、って書きますね。それと、これからは兵糧以外の料理も心を込めて作ろうと思います。……練習しますから、笑わないでください',
      body:'秤目殿。終わった。敵城は落ちた。\n出立の日、数字の外側を知りたいと書いたのを覚えているか。\n見つけたよ。飯を炊く煙、荷を引く者の背中、収穫を祝う他国の民の歌。数字の裏には、いつも人がいた。\n貴殿の計算書が、その人たちと私を繋いでいてくれた。\n都に戻る。今度は帳簿越しではなく、市場で会いたい。貴殿の隣で、数字の外側の話がしたい。',
      choices:[
        // 褒めるなしでも婚礼に届くよう最良+5（最終前〜95想定 → 100）
        { icon:'🏮', text:'「市場でお待ちしています。とっておきの話を仕入れてあります」', trust:5 },
        { icon:'📖', text:'「帳簿は綺麗に締めておきます。安心して帰ってきてください」', trust:1 },
        { icon:'📦', text:'「道中お気をつけて。荷崩れにはご注意を」', trust:0 }
      ]
    }
  },
  horse: {
    demand: {
      id:'final_horse_d', priority:50,
      when:{ castle_cleared:true, node_gte:4, once:true },
      body:'城、落ちた。馬はみな無事だ。\n貴殿の荷は速く、確かだった。助かった。\n感謝する。以上。'
    },
    personal: {
      id:'final_horse_p', priority:50,
      when:{ castle_cleared:true, node_gte:4, once:true },
      intro:'……本文より、追伸のほうが長いです。ふふ。……はい。待ってます',
      body:'勝った。\n馬と、貴方のおかげだ。以上。\n\n追伸。\n荒野で拾った例の仔馬を、連れて帰る。\n道々、こいつに貴方の牧場の話を聞かせている。文で読んだだけの牧場なのに、なぜか懐かしい。\n帰ったら、真っ先に牧場へ行く。馬を返しに、ではない。……貴方に、会いに。',
      choices:[
        { icon:'🌾', text:'「厩を掃除して、干し草を山にして待っています。……私も、です」', trust:5 },
        { icon:'🐴', text:'「仔馬たちに教えておきますね。もうすぐ帰ってくるよ、って」', trust:1 },
        { icon:'🙏', text:'「帰り道も、馬の脚をよく見てあげてください」', trust:0 }
      ]
    }
  },
  siege: {
    demand: {
      id:'final_siege_d', priority:50,
      when:{ castle_cleared:true, node_gte:4, once:true },
      body:'投石機の第三射で城門が砕けた。計算どおりだ。\n貴殿の送った部材は、最後の一本まで狂いがなかった。\n兵站は戦の半分だと、この遠征で知った。貴殿はその半分を担いきった。礼を言う。'
    },
    personal: {
      id:'final_siege_p', priority:50,
      when:{ castle_cleared:true, node_gte:4, once:true },
      intro:'橋！いいですね！百年と言わず二百年もつやつ、私たちなら作れますよ！ああ、早く図面が見たいです！',
      body:'炉子殿。城は落ちた。君の焼き入れた鋼は、最後まで鳴りが良かった。\nそれでな、帰る道すがら、ずっと考えていたことがある。\n俺は兵器を作るのが好きなのだと思っていた。だが違った。君と作るのが好きだったのだ。\n次は壊すものではなく、残るものを作りたい。まずは城下の川に、大きな橋を架ける。人が渡り、荷が渡り、百年残る橋だ。\n図面はもう描き始めている。君の意見が要る。早く見せたい。',
      choices:[
        { icon:'🌉', text:'「橋の袂に鍛冶場を建てましょう！釘も金具も全部うちで打ちます！」', trust:5 },
        { icon:'🔥', text:'「図面、楽しみにしています。炉の火を落とさず待ってますね」', trust:1 },
        { icon:'📋', text:'「まずは無事に帰ってきてください。話はそれからです」', trust:0 }
      ]
    }
  },
  weapon: {
    demand: {
      id:'final_weapon_d', priority:50,
      when:{ castle_cleared:true, node_gte:4, once:true },
      body:'終わったぜ、補給係殿。\nあんたの荷が一度でも遅れてたら、俺の伝説に傷がついてた。感謝しといてやる。\n……いや、やめだ。素直に言う。あんたの荷が、兵の命を繋いだ。助かった。\n礼は都で。酒でも酌み交わそうや。'
    },
    personal: {
      id:'final_weapon_p', priority:50,
      when:{ castle_cleared:true, node_gte:4, once:true },
      intro:'割引はしません。……でも、お帰りなさいの薬湯は、タダにしてあげます。特別ですよ',
      body:'芍薬へ。\n終わったぞ。\n兄上らは誰も欠けてない。兵もだ。……なあ、俺、間に合っただろ。\nそなたの薬、最後までほとんど使わなかった。俺に敵う奴はいなかったからな。\n……嘘だ。二回使った。よく効いた。\n帰ったら例の席で、薬代の割引交渉といこうか。',
      choices:[
        { icon:'🍵', text:'「交渉の席、用意しておきます。いつもの薬房で、いつもの席で」', trust:5 },
        { icon:'💰', text:'「二回も使ったなら定価です。むしろ割増です」', trust:1 },
        { icon:'😊', text:'「皆さんご無事で何よりです。お疲れさまでした」', trust:0 }
      ]
    }
  }
};

function injectFinalLetters(){
  if(typeof GAME_DATA==='undefined' || !GAME_DATA.letters) return;
  PK.forEach(function(k){
    var slot = GAME_DATA.letters[k];
    if(!slot) return;
    if(!slot.demand) slot.demand = [];
    if(!slot.personal) slot.personal = [];
    var f = FINAL_LETTERS[k];
    if(f && !slot.demand.some(function(e){ return e && e.id===f.demand.id; })) slot.demand.push(f.demand);
    if(f && !slot.personal.some(function(e){ return e && e.id===f.personal.id; })) slot.personal.push(f.personal);
  });
  // CFG.letterPool が別オブジェクトの場合にも反映
  if(typeof CFG!=='undefined' && CFG.letterPool && CFG.letterPool!==GAME_DATA.letters){
    PK.forEach(function(k){
      var slot = CFG.letterPool[k]; if(!slot) return;
      if(!slot.demand) slot.demand = [];
      if(!slot.personal) slot.personal = [];
      var f = FINAL_LETTERS[k];
      if(f && !slot.demand.some(function(e){ return e && e.id===f.demand.id; })) slot.demand.push(f.demand);
      if(f && !slot.personal.some(function(e){ return e && e.id===f.personal.id; })) slot.personal.push(f.personal);
    });
  }
}
injectFinalLetters();

// 依頼タブの「文官より（ノードN）」ヘッダを非表示（皇子からの手紙なので不自然）
(function(){
  var st = document.createElement('style');
  st.textContent = '#lt-food-demand .letter-from,#lt-horse-demand .letter-from,#lt-siege-demand .letter-from,#lt-weapon-demand .letter-from{display:none}';
  document.head.appendChild(st);
})();

// when.castle_cleared 条件を判定に追加（#5等の後続 matchWhen 上書き後も末尾で再ラップ必須）
(function(){
  var orig = window.matchWhenMail;
  if(typeof orig!=='function') return;
  window.matchWhenMail = function(when, key){
    if(when && when.castle_cleared){
      if(!ES() || !gs.castleCleared || !gs.castleCleared[key]) return false;
      if(!gs.castleClearedTurn) gs.castleClearedTurn = {};
      var cturn = (gs.castleClearedTurn[key]!=null) ? Number(gs.castleClearedTurn[key]) : null;
      // 陥落ターンは不可・翌ターンから（信頼80と競合時は priority で80が先）
      if(cturn!=null && Number(gs.turn||0) <= cturn) return false;
    }
    return orig.apply(this, arguments);
  };
  try{ matchWhenMail = window.matchWhenMail; }catch(e){}
})();

/* ══════════ 2) 敵城完納フラグ（ノード4依頼の完納時のみ） ══════════ */

(function(){
  var orig = window.advanceAfterOrderComplete;
  if(typeof orig!=='function') return;
  window.advanceAfterOrderComplete = function(key){
    var od = (typeof gs!=='undefined' && gs.order) ? gs.order[key] : null;
    var orderNode = od && (od.node!=null ? od.node : ((gs.node&&gs.node[key])||0));
    var wasFull = !!(od && od.items && od.items.length &&
      od.items.every(function(it){ return (it.delivered||0) >= (it.qty||0); }));
    var r = orig.apply(this, arguments);
    try{
      // 敵城(ノード4)依頼の完納時のみ。node=4 で依頼nullの雑多な状態では立てない
      if(ES() && wasFull && Number(orderNode)===4 && !gs.castleCleared[key]){
        gs.castleCleared[key] = true;
        if(!gs.castleClearedTurn) gs.castleClearedTurn = {};
        gs.castleClearedTurn[key] = Number(gs.turn||0);
        if(gs.letterFlags){
          gs.letterFlags.pendingEnter[key] = null;
          gs.letterFlags.justEntered[key] = false;
        }
        if(typeof window.pushTurnEvent==='function')
          window.pushTurnEvent('🏯 '+PN[key]+'が敵城を陥落させた！', 'accent');
      }
    }catch(e){ console.warn('ending castle flag', e); }
    return r;
  };
  try{ advanceAfterOrderComplete = window.advanceAfterOrderComplete; }catch(e){}
})();

/* ══════════ エンディング／ゲームオーバー画面 ══════════ */

function allFinalReplied(){
  if(!ES() || !gs.letterFlags || !gs.letterFlags.used) return false;
  return PK.every(function(k){ return !!gs.letterFlags.used['final_'+k+'_p']; });
}

function injectEndingOverlay(){
  if(document.getElementById('ending-overlay')) return;
  var st = document.createElement('style');
  st.textContent =
    '#ending-overlay{display:none;position:fixed;inset:0;z-index:200;background:#0c0803;color:#f2ead8;flex-direction:column;align-items:center;justify-content:center;padding:24px 18px;text-align:center;overflow-y:auto}'+
    '#ending-overlay.on{display:flex}'+
    '#ending-art{position:absolute;inset:0;background-size:cover;background-position:center top;background-repeat:no-repeat;opacity:.25;pointer-events:none}'+
    '#ending-overlay>*:not(#ending-art){position:relative;z-index:1}'+
    '#ending-title{font-family:"Noto Serif JP",serif;font-size:24px;letter-spacing:6px;color:#d8b13a;margin:0 0 20px;white-space:pre-line}'+
    '#ending-body{font-family:"Noto Serif JP",serif;font-size:15px;line-height:2.1;max-width:560px;white-space:pre-line;text-align:left;margin:0 auto}'+
    '#ending-next{margin-top:28px;font-size:13px;color:#b8a67d;animation:endingBlink 1.6s infinite}'+
    '#ending-btnrow{margin-top:30px;display:none}'+
    '#ending-btnrow button{padding:12px 34px;font-family:"Noto Serif JP",serif;font-weight:700;font-size:15px;background:linear-gradient(#d8b13a,#b58f1d);border:2px solid #b8860b;border-radius:4px;cursor:pointer;color:#1a1207}'+
    '@keyframes endingBlink{0%,100%{opacity:.25}50%{opacity:1}}';
  document.head.appendChild(st);
  var html =
    '<div id="ending-overlay">'+
      '<div id="ending-art"></div>'+
      '<h2 id="ending-title"></h2>'+
      '<div id="ending-body"></div>'+
      '<div id="ending-next">▼ 画面をタップで次へ</div>'+
      '<div id="ending-btnrow"><button type="button" onclick="location.reload()">タイトルへ戻る</button></div>'+
    '</div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

var __endingPages = [];
var __endingIdx = 0;
function renderEndingPage(){
  var p = __endingPages[__endingIdx];
  if(!p) return;
  var t = document.getElementById('ending-title');
  var b = document.getElementById('ending-body');
  var n = document.getElementById('ending-next');
  var r = document.getElementById('ending-btnrow');
  if(t) t.textContent = p.title || '';
  if(b) b.textContent = p.body || '';
  var last = (__endingIdx >= __endingPages.length-1);
  if(n) n.style.display = last ? 'none' : 'block';
  if(r) r.style.display = last ? 'block' : 'none';
}
function getTitleArt(){
  try{
    var el = document.getElementById('title-art');
    if(el && el.style.backgroundImage && el.style.backgroundImage!=='none') return el.style.backgroundImage;
  }catch(e){}
  try{ if(typeof TITLE_ART!=='undefined' && TITLE_ART) return 'url("'+TITLE_ART+'")'; }catch(e){}
  return '';
}

function showPages(pages, withArt){
  injectEndingOverlay();
  __endingPages = pages;
  __endingIdx = 0;
  var ov = document.getElementById('ending-overlay');
  var art = document.getElementById('ending-art');
  if(art) art.style.backgroundImage = withArt ? getTitleArt() : '';
  ov.classList.add('on');
  if(!ov.__bound){
    ov.__bound = true;
    ov.addEventListener('click', function(ev){
      if(ev.target && ev.target.tagName==='BUTTON') return;
      if(__endingIdx < __endingPages.length-1){ __endingIdx++; renderEndingPage(); }
    });
  }
  renderEndingPage();
}

/* ── エンディング本文（文官目線・コミカル） ── */

var ENDING_TEXT = {
  intro: { title:'天下統一',
    body:'四方の敵城、ことごとく陥落。戦は、終わった。\n\n執務室で私は筆を置いた。\n明日から、あの山のような依頼書が来ない。納期がない。催促がない。\n……静かだ。静かすぎて、少し怖い。' },
  pair: {
    food: {
      married:'兵糧太様は帰還の翌日、正装で我が家に現れた。娘・秤目との婚姻の申し込みであった。\n口上は帳簿のように整然としていたが、耳まで赤かった。秤目は算盤を置いて、静かに頷いた。\n婚礼の宴の献立は、秤目が自ら作ると言い出した。……誰も止められなかった。\n当日、椀の中身は謎であったが、兵糧太様は全部食べた。大した男である。',
      close:'兵糧太様と秤目の文通は、戦が終わっても続いている。\n近ごろ市場に、身分を隠した若君が通っているらしい。娘は素知らぬ顔で相場の話をしている。\n……嫁に行かれたら、寂しくなるなぁ。',
      plain:'兵糧太様は都に凱旋し、変わらず兵站の帳簿と睨み合っておられる。国は安泰である。'
    },
    horse: {
      married:'騎馬次様の婚姻の申し込みは一行であった。「娘御を。以上」\n……以上、ではない。親には色々あるのだ。詳しく聞かせてもらった。\n語られた言葉は短かったが、連れてこられた仔馬が娘によく懐いているのを見て、全てわかってしまった。\n鞍馬は嫁入りの日、馬で行った。花嫁が笑って駆けていくのを、私は笑って、少し泣いて見送った。',
      close:'騎馬次様から、相変わらず短い手紙が牧場に届く。追伸ばかりが、少しずつ長くなっている。\n返事を書く娘は、ずっと口元が緩んでいる。\n……嫁に行かれたら、寂しくなるなぁ。',
      plain:'騎馬次様は北の平原で馬と駆けておられる。良い馬が育てば、また短い文が来るだろう。'
    },
    siege: {
      married:'攻三城様は婚姻の申し込みに、図面を持ってきた。新居の図面である。気が早い。\n炉と鍛冶場が母屋より大きいのはどうかと思ったが、炉子は図面を一目見て「三日で組めます！」と叫んだ。\n決まりである。親の出る幕はなかった。\n二人はいま、城下の川に橋を架けている。夫婦喧嘩も図面の上でやるらしい。平和なものだ。',
      close:'攻三城様と炉子は、橋の図面をやり取りしている。手紙というより、もう共同事業である。\n工房から娘の楽しそうな鎚の音が聞こえるたび、思う。\n……嫁に行かれたら、寂しくなるなぁ。',
      plain:'攻三城様は西の城の修復を指揮しておられる。壊した城を、今度は直しているそうだ。'
    },
    weapon: {
      married:'武刃四様は夜、屋根から婚姻を申し込みに来た。玄関から入れと言ったら、翌日は行商人に化けて来た。\n三日目にようやく正面から来たので、認めた。\n芍薬は「薬代の踏み倒しを見張るためです」と言って嫁いでいったが、嫁入り道具の中に、揃いの薬湯の茶碗が二つ、そっと入っているのを私は見た。',
      close:'武刃四様は今日も薬房に現れる。変装はしているが、もう常連は皆知っている。\n娘の毒舌が、心なしか甘い。\n……嫁に行かれたら、寂しくなるなぁ。',
      plain:'武刃四様は南の守りを一手に引き受け、今日も「俺に敵う奴はいない」と笑っておられる。事実なので、誰も逆らわない。'
    }
  },
  all80:'それにしても、四人の娘の机には、それぞれ文箱が増えた。\n中身は聞かないのが親の務めである。だが、返事を書く娘たちの横顔が、みな同じ顔をしているのはどういうことか。\n四人いっぺんに嫁に行かれたら……私は誰と飯を食えばいいのだ。',
  allMarried:'気づけば、娘が四人とも王家に嫁いだ。義理の息子が、四人とも王子である。\n王様は「これで貴様も身内よ」と豪快に笑っておられた。\n家の中が、静かになった。……静かすぎる。\n誰か、私と飯を食ってくれ。いや、めでたい。めでたいのだが。',
  rich:'ところで、戦時中の相場の読みが当たりに当たり、我が家の蔵には五千両を超える蓄えがある。\n過労の褒美と思えば悪くない。隠居して、市場の隅で小さな茶屋でも開こうか。\n……と言ったら、王様に「統一後の行政もお前がやるのだ」と言われた。\n茶屋は、当分先のようである。',
  poor:'ところで、我が家の蔵は空に近い。天下を統一した国の兵站責任者が、である。\n荷代、餌代、薬代……帳簿は正直だ。全部、前線に消えた。\n……と嘆いていたら、王様に「統一後の行政もお前がやるのだ」と言われた。\nまずは給金の交渉から始めようと思う。'
};

function buildEndingPages(){
  var pages = [];
  pages.push(ENDING_TEXT.intro);
  var married = 0, over80 = 0;
  PK.forEach(function(k){
    var t = (gs.trust && gs.trust[k]) || 0;
    var v;
    if(t>=100){ v = ENDING_TEXT.pair[k].married; married++; over80++; }
    else if(t>=80){ v = ENDING_TEXT.pair[k].close; over80++; }
    else { v = ENDING_TEXT.pair[k].plain; }
    pages.push({ title: PN[k]+'と'+DN[k], body: v });
  });
  if(married>=4) pages.push({ title:'文官の独り言', body: ENDING_TEXT.allMarried });
  else if(over80>=4) pages.push({ title:'文官の独り言', body: ENDING_TEXT.all80 });
  pages.push({ title:'その後', body: ((gs.gold||0)>=5000) ? ENDING_TEXT.rich : ENDING_TEXT.poor });
  var turn = gs.turn || '?';
  pages.push({ title:'もういっそ敗けてくれ\n―完―',
    body:'天下統一まで：'+turn+'ターン\n婚礼：'+married+'組\n\nこの国の勝利は、あなたの算段が支えました。' });
  return pages;
}

window.showEndingScreen = function(){
  if(window.__endingShown) return;
  window.__endingShown = true;
  try{ showPages(buildEndingPages(), true); }
  catch(e){ console.warn('showEndingScreen', e); window.__endingShown = false; }
};

/* ── ゲームオーバー ── */

var LAST_WORDS = {
  food:'「兵に、粥を。……最後まで、行き渡らせよ」',
  horse:'「馬は……返す。良い、旅だった」',
  siege:'「図面は残る。……誰かが、続きを頼む」',
  weapon:'「わりぃ……先に一人で、終わらせるつもりだったんだがな」'
};

window.showGameOverScreen = function(key){
  if(window.__endingShown) return;
  window.__endingShown = true;
  try{
    showPages([
      { title: PN[key]+'、戦死', body: LAST_WORDS[key] },
      { title:'ゲームオーバー',
        body: PN[key]+'は、帰らなかった。\n\n訃報の竹簡を置き、私は筆を置いた。\n責任を取り、職を辞する。\n'+DN[key]+'には、まだ伝えられずにいる。' }
    ]);
  }catch(e){ console.warn('showGameOverScreen', e); window.__endingShown = false; }
};

/* ══════════ 返信検知 → エンディング ══════════ */

(function(){
  var orig = window.selectChoice;
  if(typeof orig!=='function') return;
  window.selectChoice = function(key, idx, trust, el, letterId, choiceText){
    var r = orig.apply(this, arguments);
    try{
      var lid = (gs.choices && gs.choices[key] && gs.choices[key].letterId) || '';
      if(/^final_(food|horse|siege|weapon)_p$/.test(lid) && allFinalReplied()){
        setTimeout(function(){ window.showEndingScreen(); }, 900);
      }
    }catch(e){ console.warn('ending reply check', e); }
    return r;
  };
  try{ selectChoice = window.selectChoice; }catch(e){}
})();

/* ══════════ 3) 納期切れ：撤退＋1/5死亡（＋エンディング保険） ══════════ */

function doRetreat(key){
  var node = (gs.node && gs.node[key]) || 0;
  var dest = node - 1;
  var msg;
  if(dest <= 0){
    gs.node[key] = 0;
    gs.sortied[key] = false;
    gs.order[key] = null;
    if(gs.orderLocked) gs.orderLocked[key] = false;
    if(gs.orderMissTurns) gs.orderMissTurns[key] = 0;
    if(gs.transport && gs.transport[key]) delete gs.transport[key];
    msg = '⚠ '+PN[key]+'は納期に間に合わず、都まで撤退した。再び出立の準備が必要だ…';
  } else {
    gs.node[key] = dest;
    var so = window.setOrderForNode || (typeof setOrderForNode==='function' ? setOrderForNode : null);
    if(so) so(key, dest, true);
    msg = '⚠ '+PN[key]+'は納期に間に合わず、'+(LOC[dest]||('戦地'+dest))+'へ撤退した…';
  }
  return msg;
}

(function(){
  var orig = window.goToNextTurn;
  if(typeof orig!=='function') return;
  window.goToNextTurn = function(){
    // エンディング保険（selectChoice経由で出なかった場合）
    try{
      if(allFinalReplied()){ window.showEndingScreen(); return; }
    }catch(e){}

    // 納期切れ検出（残0Tのターンが終了した時点）
    var expired = [];
    try{
      if(ES()){
        PK.forEach(function(k){
          if(gs.sortied && gs.sortied[k] && (gs.node[k]||0)>=1 && gs.order[k] && (gs.order[k].deadline||0)<=0){
            expired.push(k);
          }
        });
      }
    }catch(e){}

    var r = orig.apply(this, arguments);

    if(expired.length){
      try{
        var deadKey = null;
        var msgs = [];
        expired.forEach(function(k){
          msgs.push(doRetreat(k));
          if(!deadKey && Math.random() < 0.2) deadKey = k;
        });
        msgs.forEach(function(m){
          if(typeof window.pushTurnEvent==='function') window.pushTurnEvent(m, 'danger');
          if(typeof showToast==='function') showToast(m.replace(/^⚠ /,''));
        });
        // UI 反映
        try{ if(typeof positionAllPieces==='function') positionAllPieces(); }catch(e){}
        try{ if(typeof refreshMapNodes==='function') refreshMapNodes(); }catch(e){}
        try{ if(typeof window.updatePrinceBar==='function') window.updatePrinceBar(); }catch(e){}
        try{ if(typeof window.recomputeMailFlags==='function') window.recomputeMailFlags(); }catch(e){}
        try{ if(typeof window.renderLetter==='function') expired.forEach(function(k){ window.renderLetter(k); }); }catch(e){}
        if(deadKey){
          setTimeout(function(){ window.showGameOverScreen(deadKey); }, 400);
        }
      }catch(e){ console.warn('deadline retreat', e); }
    }
    return r;
  };
  try{ goToNextTurn = window.goToNextTurn; }catch(e){}
})();

console.log('[ending] ready');
})();
`;

// ── 適用 ──
function nowStamp() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
}

// 構文チェック（パッチ本体のみ）
try { new Function(PATCH_JS); }
catch (e) { console.error('PATCH_JS 構文エラー: ' + e.message); process.exit(1); }

const BLOCK = '\n' + BEGIN + '\n<script>\n' + PATCH_JS + '\n</script>\n' + END + '\n';

// game-data.js（字句修正のみ）
{
  let src = fs.readFileSync(GAMEDATA, 'utf8');
  const out = applyTrust80Fixes(applyTextFixes(src, 'game-data.js'), 'game-data.js');
  if (out !== src) {
    fs.copyFileSync(GAMEDATA, GAMEDATA + '.bak_ending_' + nowStamp());
    fs.writeFileSync(GAMEDATA, out, 'utf8');
    console.log('game-data.js: 字句修正を書き込み');
  } else {
    console.log('game-data.js: 変更なし（適用済み）');
  }
}

// 両 HTML
HTMLS.forEach(file => {
  const label = path.basename(file);
  let h = fs.readFileSync(file, 'utf8');
  const bak = file + '.bak_ending_' + nowStamp();
  fs.copyFileSync(file, bak);

  h = applyTrust80Fixes(applyTextFixes(h, label), label);

  // 旧パッチブロック除去（再実行対応）
  const bi = h.indexOf(BEGIN);
  if (bi >= 0) {
    const ei = h.indexOf(END, bi);
    if (ei >= 0) {
      h = h.slice(0, bi) + h.slice(ei + END.length);
      console.log('  [info] ' + label + ': 旧 ENDING パッチを差し替え');
    }
  }

  if (h.includes('</body>')) h = h.replace('</body>', BLOCK + '</body>');
  else h += BLOCK;

  fs.writeFileSync(file, h, 'utf8');
  console.log(label + ': 適用完了（backup: ' + path.basename(bak) + '）');
});

console.log('DONE: ending patch applied');
