"""
もういっそ敗けてくれ v0.6 生成スクリプト
使い方: python3 gen_v06.py
必要: assets_cache.pkl (assets/フォルダから生成済み)
出力: /mnt/user-data/outputs/mou_isso_v0_6.html
"""
import pickle, re, json

with open('/home/claude/assets_cache.pkl','rb') as f:
    I, MAP_SVG = pickle.load(f)

def clean_map_svg(svg: str) -> str:
    """マップ見た目の試作用クリーンアップ。
    - animateMotion の運送デモ駒を削除
    - ノードの二重丸（pulse）を削除
    - 完了ノードの ✓ を通常番号表示に
    """
    # 1) animateMotion を含む <g>…</g> を削除
    while True:
        am = svg.find('<animateMotion')
        if am < 0:
            break
        g_start = svg.rfind('<g', 0, am)
        if g_start < 0:
            break
        # 対応する </g> を depth で探す
        i, depth = g_start, 0
        end = -1
        while i < len(svg):
            if svg.startswith('<g', i) and (i + 2 >= len(svg) or svg[i + 2] in ' >\n\r'):
                depth += 1
                i += 2
                continue
            if svg.startswith('</g>', i):
                depth -= 1
                i += 4
                if depth == 0:
                    end = i
                    break
                continue
            i += 1
        if end < 0:
            break
        svg = svg[:g_start] + svg[end:]

    # 2) pulse 二重丸
    svg = re.sub(r'<circle\b[^>]*class="pulse"[^>]*/?>', '', svg)

    # 3) ✓ ノード → 番号ノード
    route_colors = {
        'weapon': '#a63a2c', 'siege': '#5a4a7d',
        'horse': '#41756c', 'food': '#a07417',
    }
    def _fix_check_node(m):
        g = m.group(0)
        if '✓' not in g:
            return g
        idx_m = re.search(r'data-idx="(\d+)"', g)
        route_m = re.search(r'data-route="([^"]+)"', g)
        idx = int(idx_m.group(1)) if idx_m else 0
        route = route_m.group(1) if route_m else 'weapon'
        color = route_colors.get(route, '#a63a2c')
        cxy = re.search(r'<circle\s+cx="([^"]+)"\s+cy="([^"]+)"', g)
        cx = cxy.group(1) if cxy else '0'
        cy = cxy.group(2) if cxy else '0'
        try:
            y_text = str(float(cy) + 13)
        except ValueError:
            y_text = cy
        num = str(idx + 1)
        return (
            f'<g class="node" data-route="{route}" data-idx="{idx}" style="cursor:pointer">'
            f'<circle cx="{cx}" cy="{cy}" r="43" fill="#efe4c8" stroke="#2f2619" stroke-width="3.5"/>'
            f'<circle cx="{cx}" cy="{cy}" r="38" fill="none" stroke="{color}" stroke-width="6" opacity="0.95"/>'
            f'<circle cx="{cx}" cy="{cy}" r="29" fill="none" stroke="{color}" stroke-width="2.5" stroke-dasharray="7 8" opacity="0.85"/>'
            f'<text x="{cx}" y="{y_text}" text-anchor="middle" font-size="38" font-weight="bold" fill="#4a3b26">{num}</text></g>'
        )
    svg = re.sub(
        r'<g class="node"[^>]*>.*?</g>',
        _fix_check_node,
        svg,
        flags=re.DOTALL,
    )
    return svg

MAP_SVG = clean_map_svg(MAP_SVG)


def load_external_data():
    """data/ 配下の JSON を読み込み CONFIG にマージ"""
    import os
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    def _load(name):
        p = os.path.join(base, name)
        if not os.path.isfile(p):
            return None
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    m = _load('market.json')
    o = _load('orders.json')
    L = _load('letters.json')
    if m and 'prices' in m:
        CONFIG['prices'] = m['prices']
    if o:
        if 'prep' in o:
            CONFIG['prep_quests'] = o['prep']
        if 'nodes' in o:
            CONFIG['node_orders'] = o['nodes']
        CONFIG['remind_after_turns'] = o.get('remind_after_turns', 3)
        # legacy orders from node 1
        CONFIG['orders'] = {
            k: {'item_label': v['1']['label'], 'deadline': v['1']['deadline']}
            for k, v in o.get('nodes', {}).items() if '1' in v
        }
    if L:
        CONFIG['letter_pool'] = L
    # write game-data.js for HTML
    if os.path.isdir(base):
        gd = {
            'prices': CONFIG.get('prices'),
            'prep_quests': CONFIG.get('prep_quests'),
            'orders': CONFIG.get('orders'),
            'node_orders': CONFIG.get('node_orders'),
            'remind_after_turns': CONFIG.get('remind_after_turns', 3),
            'letters': CONFIG.get('letter_pool') or CONFIG.get('letters'),
        }
        with open(os.path.join(base, 'game-data.js'), 'w', encoding='utf-8') as f:
            f.write('window.GAME_DATA = ' + json.dumps(gd, ensure_ascii=False, indent=2) + ';\n')


PKEYS = ['food','horse','siege','weapon']

# ════════════════════════════════════════════════
# CONFIG — ここを編集してゲームバランスを調整
# ════════════════════════════════════════════════
CONFIG = {
    # 初期リソース
    "start": {
        "gold": 1000,
        "iron": 5,
        "wood": 5,
        "niter": 0,
        "herb": 4,
        "food": 8,
        "sword": 2,      # 完成品在庫（剣）
        "siege_w": 0,
        "med": 0,
    },

    # 市場価格
    "prices": {
        "iron":     {"buy": 20,  "sell": 16,  "label": "鉄"},
        "wood":     {"buy": 12,  "sell": 9,   "label": "木材"},
        "niter":    {"buy": 25,  "sell": 20,  "label": "硝石"},
        "herb":     {"buy": 15,  "sell": 12,  "label": "薬草"},
        "food_mat": {"buy": 18,  "sell": 14,  "label": "兵糧"},
        "med":      {"buy": 999, "sell": 30,  "label": "回復薬"},  # buy=999は購入不可
    },

    # 出立準備依頼（輸送フェーズで手渡し）
    "prep_quests": {
        "food":   {"item": "food",    "label": "兵糧",    "qty": 5, "trust_reward": 3},
        "horse":  {"item": "horse",   "label": "★1馬",   "qty": 2, "trust_reward": 3},
        "siege":  {"item": "siege_w", "label": "衝車★1", "qty": 2, "trust_reward": 2},
        "weapon": {"item": "sword",   "label": "剣★1",   "qty": 2, "trust_reward": 2},
    },

    # 出立条件
    "sortie_trust_threshold": 5,

    # 正式依頼（出立後、ターン1から開始）
    "orders": {
        "food":   {"item_label": "兵糧×20",   "deadline": 8},
        "horse":  {"item_label": "良馬×3頭",  "deadline": 10},
        "siege":  {"item_label": "弩★1×4",   "deadline": 9},
        "weapon": {"item_label": "弩★2×4",   "deadline": 6},
    },

    # 生産レシピ（工房）
    "recipes_smith": {
        "sword":   {"label": "剣 ★1",   "cost": {"iron": 1}, "slots": 1},
        "siege_w": {"label": "衝車 ★1", "cost": {"wood": 2}, "slots": 1},
    },
    # 生産レシピ（薬房）
    "recipes_pharmacy": {
        "med": {"label": "回復薬 ★1", "cost": {"herb": 1}, "slots": 1},
    },
    "smith_capacity": 3,
    "pharmacy_capacity": 3,

    # 手紙本文（ターンで切り替え: prep=出立前, sortied=出立後）
    "letters": {
        "food": {
            "prep": {
                "demand_body": "兵糧三千。不足は一升たりとも許さぬ。\n【出立準備依頼】兵糧×5　輸送フェーズで手渡し可",
                "personal_intro": "王子からです。今回は少し長い手紙ですよ、父上。",
                "personal_body": "先日の市価の報告、受け取った。そなたの読みは正確だ。\n\nひとつ聞く。出立前夜、兵に何を食わせれば士気が上がると思う。勝算より、飯の話が聞きたい。",
                "choices": [
                    {"icon": "🍚", "text": "「白米に干し魚。腹が満ちれば足が動きます。数字より胃袋です」", "trust": 2},
                    {"icon": "📊", "text": "「現在庫から最適な配給量を計算します」と数字で返す", "trust": 1},
                    {"icon": "😅", "text": "「…また少し焦がしました」と関係のないことを書く", "trust": 0}
                ]
            },
            "sortied": {
                "demand_body": "到着した。思ったより速かった。\nこの先、兵糧が要る。送ってくれ。\n\n【依頼】兵糧×20　納期：8ターン後",
                "personal_intro": "到着の報告が来ましたよ。父上、良かったですね。",
                "personal_body": "前線の飯は不味い。やはりそなたの言う通りだった。\n\n次の荷が届いたら、少し余分に干し魚を頼む。",
                "choices": [
                    {"icon": "🐟", "text": "「干し魚、多めに用意しておきます」", "trust": 2},
                    {"icon": "📋", "text": "「承知しました。兵糧の手配を急ぎます」", "trust": 1}
                ]
            }
        },
        "horse": {
            "prep": {
                "demand_body": "馬。良いのを。以上。\n【出立準備依頼】★1馬×2頭　輸送フェーズで手渡し可",
                "personal_intro": "…馬の王子からです。今回も短いですが、絵が描いてあります。",
                "personal_body": "今年は仔馬を何頭見た。栗毛の仔が一頭。良い目をしていた。\n［馬の絵：下手だが丁寧に描かれている］\n\n朝は冷える。羽織れ。",
                "choices": [
                    {"icon": "🎨", "text": "絵で返す　─　同じ栗毛の仔馬を丁寧に描いて送る", "trust": 2},
                    {"icon": "📝", "text": "「栗毛の仔馬、こちらでも記録しておきます」と返す", "trust": 1},
                    {"icon": "📋", "text": "「準備の馬2頭を揃えます」と事務的に返す", "trust": 0}
                ]
            },
            "sortied": {
                "demand_body": "着いた。馬も元気だ。\n\n【依頼】良馬×3頭　納期：10ターン後",
                "personal_intro": "着いたみたいです。馬のことしか書いてないけど。",
                "personal_body": "北の草は違う。馬が喜んでいる。\n\nそちらの仔馬はどうなった。",
                "choices": [
                    {"icon": "🐴", "text": "「仔馬は元気です。もうすぐ★2になりそうです」", "trust": 2},
                    {"icon": "📝", "text": "「こちらも無事です。良馬の手配を進めます」", "trust": 1}
                ]
            }
        },
        "siege": {
            "prep": {
                "demand_body": "衝車、二台。できるだけ早く。以下、設計図を添付した。\n【出立準備依頼】衝車★1×2　輸送フェーズで手渡し可",
                "personal_intro": "来ました！今回の図面、前回より格段に複雑で——でも面白い！",
                "personal_body": "── 設計図 v0.1（衝車・改良型）──\n車軸径：4寸。外装板：杉材3分厚。前部衝角：鋳鉄30斤。\n補強箇所は図面の通り。読めるか。",
                "choices": [
                    {"icon": "✨", "text": "「読めます。前部衝角、幅を広げると食い込みが改善されるかと」と改良案を返す", "trust": 2},
                    {"icon": "🔨", "text": "「了解しました。2台、取りかかります」", "trust": 1}
                ]
            },
            "sortied": {
                "demand_body": "陣を構えた。衝車の調子は良い。\n次の攻城には弩も要る。\n\n【依頼】弩★1×4　納期：9ターン後",
                "personal_intro": "陣を構えたそうです。設計図の改良案、採用されたみたいで嬉しいです。",
                "personal_body": "前部衝角の改良、正解だった。炉子の案がなければ今頃困っていた。\n\n次は弩の設計図を送る。また読んでくれ。",
                "choices": [
                    {"icon": "📐", "text": "「楽しみにしています！設計図、待ってます」", "trust": 2},
                    {"icon": "🔩", "text": "「弩の製作、準備しておきます」", "trust": 1}
                ]
            }
        },
        "weapon": {
            "prep": {
                "demand_body": "「弩を四挺、至急送れ。★2以上のものを選べ。期限を守れぬならば、その首で詫びろ」\n\n依頼：弩★2×4　納期：6ターン後",
                "personal_intro": "父上、また来ましたよ武刃四からの手紙。今回は……少し様子が違います。",
                "personal_body": "愛しの職人殿〜、武器の王子でございます。\nいや、そんな名前じゃないんだけどね。うちの薬房、評判いいって聞いたよ。期待してる。\n\nあと俺、山道は慣れてるから。一番早く終わらせてみせる。誰より先に。",
                "choices": [
                    {"icon": "⚡", "text": "「早く終わらせれば誰も死なないと？ずいぶん自信家ですね」と切り返す", "trust": 2},
                    {"icon": "💊", "text": "「ご期待に沿えるよう精進します」と返す", "trust": 1},
                    {"icon": "📋", "text": "必要な薬の品目を確認して事務的に返す", "trust": 0}
                ]
            },
            "sortied": {
                "demand_body": "山道、余裕だった。約束通り一番乗りだ。\n\n【依頼】弩★2×4　納期：6ターン後（継続）",
                "personal_intro": "一番乗りだって自慢してます、父上。まあ……格好いいですけど。",
                "personal_body": "薬、効いたよ。山道でちょっと足をやったけど、一日で治った。\n\nありがとう。……って言うの、恥ずかしいんだけど。",
                "choices": [
                    {"icon": "💊", "text": "「お役に立てて何よりです。無理しないでください」", "trust": 2},
                    {"icon": "😄", "text": "「一番乗り、おめでとうございます」と素直に祝う", "trust": 1}
                ]
            }
        }
    }
}

load_external_data()

# ════════════════════════════════════════════════
# 以下はゲームロジック・UI生成（通常は編集不要）
# ════════════════════════════════════════════════

PRINCES = [
    {'key':'food',   'name':'兵糧太', 'title':'兵糧の王子', 'dir':'東', 'color':'#a07417', 'textcol':'#c09030', 'girl':'秤目',  'girl_key':'food'},
    {'key':'horse',  'name':'騎馬次', 'title':'馬の王子',   'dir':'北', 'color':'#41756c', 'textcol':'#60a090', 'girl':'鞍馬',  'girl_key':'horse'},
    {'key':'siege',  'name':'攻三城', 'title':'兵器の王子', 'dir':'西', 'color':'#5a4a7d', 'textcol':'#9080c0', 'girl':'炉子',  'girl_key':'siege'},
    {'key':'weapon', 'name':'武刃四', 'title':'武器の王子', 'dir':'南', 'color':'#a63a2c', 'textcol':'#e06050', 'girl':'芍薬',  'girl_key':'weapon'},
]

# CSS
CSS = """
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700&family=Noto+Sans+JP:wght@300;400;500&display=swap');
:root{--paper:#f2ead8;--ink:#1a1207;--faded:#5a4a2a;--accent:#8b2c2c;--gold:#b8860b;--border:#c4a96a;--panel:#ece3cc;--dim:#d4c99a;--green:#3a6a3a;--wood:#3a2f1f;--paper2:#fdf6e3}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--ink);font-family:'Noto Sans JP',sans-serif;color:var(--ink);min-height:100vh;display:flex;flex-direction:column;align-items:center}
#hdr{width:100%;background:var(--ink);color:var(--paper);padding:7px 12px;display:flex;align-items:center;gap:8px;border-bottom:2px solid var(--gold);font-size:12px;flex-wrap:wrap;position:sticky;top:0;z-index:100}
.title-sm{font-family:'Noto Serif JP',serif;font-size:13px;color:var(--gold);letter-spacing:2px;flex-shrink:0}
.pills{display:flex;gap:4px;flex-wrap:wrap}
.pill{background:#2a1f0a;border:1px solid var(--border);color:var(--dim);padding:2px 6px;border-radius:2px;font-size:11px}
.pill b{color:var(--gold)}
#turn-badge{margin-left:auto;font-family:'Noto Serif JP',serif;color:var(--paper);font-size:12px;flex-shrink:0}
.phase-badge{background:var(--accent);color:var(--paper);font-size:10px;padding:2px 8px;border-radius:2px;letter-spacing:1px}
#app{width:100%;max-width:780px;display:flex;flex-direction:column}
/* 王子バー */
#prince-bar{display:grid;grid-template-columns:repeat(4,1fr);background:#2a1f0a;border-bottom:2px solid var(--gold)}
.pc{display:flex;gap:5px;align-items:center;padding:6px 5px;border-right:1px solid #3a2f0a;cursor:pointer;transition:background .15s}
.pc:last-child{border-right:none}.pc:hover{background:#3a2f0a}
.pc img.crest{width:34px;height:34px;flex:0 0 auto}
.pc-info{min-width:0;flex:1}
.pc-name{font-size:9.5px;color:var(--paper);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:'Noto Serif JP',serif}
.pc-req{font-size:9px;color:#cbbb96;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
.pc-sub{font-size:8.5px;color:var(--dim);margin-top:1px}
.pc-dl-badge{flex:0 0 auto;font-size:9px;background:#4a2a1a;color:var(--paper);border:1px solid var(--accent);border-radius:3px;padding:2px 6px;text-align:center;line-height:1.4;min-width:34px}
.pc-dl-badge b{font-size:14px;display:block;color:var(--gold);font-family:'Noto Serif JP',serif}
.pc-dl-badge.urg{background:var(--accent);border-color:#c04030}.pc-dl-badge.urg b{color:#fff}
/* マップ */
#map-wrap{position:relative;width:100%}
#map-wrap svg{display:block;width:100%;height:auto}
.convoy-wrap{position:absolute;cursor:pointer;z-index:10}
.convoy-icon{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.6);border:3px solid;background:var(--paper2)}
.convoy-popup{display:none;position:absolute;bottom:42px;left:50%;transform:translateX(-50%);background:var(--paper2);border:2px solid var(--ink);border-radius:6px;padding:6px 10px;font-size:11.5px;line-height:1.7;white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,.5);z-index:15;min-width:140px}
.convoy-popup::after{content:'';position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:var(--ink)}
.convoy-wrap.open .convoy-popup{display:block}
.cb-title{font-weight:700;font-family:'Noto Serif JP',serif;margin-bottom:2px}
#map-card{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);width:min(92%,360px);background:var(--paper);border:3px solid var(--ink);border-radius:6px;padding:10px 12px;box-shadow:0 6px 18px rgba(0,0,0,.6);display:none;z-index:15}
#map-card.on{display:block}
#map-card h3{font-size:13px;border-bottom:2px solid currentColor;padding-bottom:3px;margin-bottom:6px;font-family:'Noto Serif JP',serif}
#map-card p{font-size:12px;line-height:1.8}
#mc-close{position:absolute;top:5px;right:7px;border:none;background:none;font-size:17px;cursor:pointer;color:var(--ink)}
/* ステップバー */
.step-bar{display:flex;background:var(--panel);border-top:1px solid var(--border);border-bottom:2px solid var(--border)}
.step{flex:1;text-align:center;padding:6px 2px;font-size:11px;color:var(--faded);border-right:1px solid var(--border);font-family:'Noto Serif JP',serif;letter-spacing:1px}
.step:last-child{border-right:none}
.step.active{background:var(--accent);color:var(--paper);font-weight:500}
.step.done{background:var(--dim);color:var(--ink)}
/* コマンドバー */
#cmd-bar{display:flex;background:linear-gradient(#2c2314,var(--wood));border-bottom:2px solid #191308;width:100%}
.cmd-btn{flex:1;border:none;background:none;font-family:'Noto Serif JP',serif;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 2px;color:var(--paper);font-size:10px;letter-spacing:.05em;border-right:1px solid #483c28;transition:background .15s}
.cmd-btn:last-child{border-right:none}
.cmd-btn:hover:not(.disabled){background:rgba(201,162,39,.15)}
.cmd-btn.disabled{opacity:.3;pointer-events:none}
.cmd-btn.active{background:rgba(201,162,39,.25);color:var(--gold)}
.cmd-btn img{width:42px;height:42px;object-fit:contain;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))}
.cmd-ph{width:42px;height:42px;border:2px dashed #6b5a3a;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:18px;color:#8a7550}
#phase-panel{width:100%;background:var(--paper)}
/* セーブロード */
#save-overlay{display:none;position:fixed;inset:0;z-index:80;background:rgba(8,5,2,.88);align-items:center;justify-content:center;padding:16px}
#save-overlay.on{display:flex}
.save-modal{width:min(96%,420px);background:var(--paper);border:3px solid var(--ink);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.55);overflow:hidden}
.save-modal-head{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--panel);border-bottom:2px solid var(--border);font-family:'Noto Serif JP',serif;font-size:15px;letter-spacing:2px}
.save-modal-close{border:none;background:none;font-size:18px;cursor:pointer;color:var(--ink);line-height:1}
.save-modal-body{padding:12px 14px 16px}
.save-mode-note{font-size:11.5px;color:var(--faded);margin-bottom:10px;line-height:1.6}
.save-slot{display:flex;flex-direction:column;gap:4px;padding:10px;margin-bottom:8px;background:var(--paper2);border:2px solid var(--border);border-radius:6px;cursor:pointer;transition:border-color .15s,background .15s;text-align:left;width:100%;font-family:inherit;color:inherit}
.save-slot:hover{border-color:var(--gold);background:#f8efd8}
.save-slot.empty{opacity:.75}
.save-slot-title{font-family:'Noto Serif JP',serif;font-size:13px;font-weight:700}
.save-slot-meta{font-size:11px;color:var(--faded);line-height:1.5}
.save-slot-empty{font-size:11px;color:var(--faded);font-style:italic}
.save-extra{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)}
.save-extra button{flex:1;min-width:110px;font-family:'Noto Serif JP',serif;font-size:11px;padding:7px 8px;border:1px solid var(--border);background:var(--panel);border-radius:3px;cursor:pointer;color:var(--ink)}
.save-extra button:hover{border-color:var(--gold);background:var(--dim)}
#save-import-area{display:none;margin-top:10px}
#save-import-area.show{display:block}
#save-import-ta{width:100%;min-height:90px;font-size:11px;font-family:monospace;padding:8px;border:1px solid var(--border);border-radius:4px;resize:vertical;background:var(--paper2);color:var(--ink)}
.save-import-actions{display:flex;gap:6px;margin-top:6px}
.save-import-actions button{flex:1;font-family:'Noto Serif JP',serif;font-size:12px;padding:7px;border:none;border-radius:3px;cursor:pointer}
.btn-import-ok{background:var(--green);color:var(--paper)}
.btn-import-cancel{background:var(--dim);color:var(--ink)}
/* オーバーレイ */
#overlay{display:none;position:fixed;inset:0;z-index:50;background:rgba(8,5,2,.94);overflow-y:auto}
#overlay.on{display:block}
#ov-inner{max-width:700px;margin:0 auto;padding:0 0 40px;background:var(--paper);min-height:100%}
/* 5タブバー（王子×4＋謁見） */
.tab-bar-5{display:flex;border-bottom:3px solid var(--ink)}
.tab-btn-5{flex:1;padding:6px 2px;font-family:'Noto Serif JP',serif;font-size:9.5px;background:#2a1f0a;color:#cbbb96;border:none;border-right:1px solid #191308;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;transition:background .15s;text-align:center;min-width:0}
.tab-btn-5:last-child{border-right:none}
.tab-btn-5 img{width:26px;height:26px}
.tab-pname{font-size:9px;line-height:1.2;font-family:'Noto Serif JP',serif}
.tab-check{color:var(--green);font-weight:700;margin-right:1px}
.tab-req{font-size:8px;color:#8a7a5a;line-height:1.2}
.tab-dl{font-size:8px;color:var(--dim);line-height:1.2}
.tab-btn-5.active{background:var(--paper);color:var(--ink);border-bottom:3px solid var(--gold);margin-bottom:-3px}
.tab-btn-5.active .tab-req{color:var(--faded)}.tab-btn-5.active .tab-dl{color:var(--accent)}
.tab-btn-5.urg-tab .tab-dl{color:#e06050}
.tab-kengen{background:#2a1f0a !important}
.tab-btn-5.active.tab-kengen{background:var(--paper) !important}
.tab-content{background:var(--paper);padding:12px;display:none}
.tab-content.active{display:block}
/* 依頼/娘サブタブ */
.ltabs{display:flex;margin-bottom:10px;border:2px solid var(--ink);border-radius:4px;overflow:hidden}
.ltab{flex:1;padding:6px;font-family:'Noto Serif JP',serif;font-size:12.5px;border:none;background:#2a1f0a;color:#cbbb96;cursor:pointer;text-align:center;transition:background .15s}
.ltab.active{background:var(--paper);color:var(--ink);font-weight:700}
.letter-block{background:var(--paper2);border:1px solid var(--border);padding:10px 12px;margin-bottom:8px;border-radius:4px}
.letter-from{font-size:10px;color:var(--faded);margin-bottom:4px;letter-spacing:1px}
.letter-text{font-family:'Noto Serif JP',serif;font-size:13px;line-height:2;white-space:pre-line}
.demand{color:var(--accent);font-weight:700}
.girl-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px}
.girl-row img{width:68px;flex:0 0 auto}
.bubble{background:var(--panel);border:2px solid var(--border);border-radius:8px;padding:8px 10px;font-size:12px;line-height:1.8;flex:1}
.choices-wrap{display:flex;flex-direction:column;gap:6px;margin-top:10px}
.choices-label{font-size:11px;color:var(--faded);margin-bottom:4px;font-weight:700;letter-spacing:1px}
.choice-btn{background:var(--panel);border:1px solid var(--border);padding:8px 10px;text-align:left;font-family:'Noto Serif JP',serif;font-size:12px;cursor:pointer;color:var(--ink);display:flex;gap:8px;align-items:flex-start;border-radius:3px;transition:background .15s}
.choice-btn:hover{background:var(--dim);border-color:var(--gold)}
.choice-btn.selected{background:#d4aa70;border-color:var(--accent);pointer-events:none}
.choice-icon{font-size:14px;flex-shrink:0}
.trust-hint{display:none;font-size:10px;color:var(--green);margin-top:2px}
.choice-btn.selected .trust-hint{display:block}
.lp-bar{display:flex;gap:10px;padding:6px 12px;background:var(--panel);border-bottom:1px solid var(--border);flex-wrap:wrap;font-size:11px;color:var(--faded)}
.lp-item{display:flex;align-items:center;gap:4px}
.lp-dot{width:8px;height:8px;border-radius:50%;background:var(--dim);flex-shrink:0}
.lp-dot.done{background:var(--green)}
/* 謁見（タブ内に収まる） */
.kengen-note{font-size:11.5px;color:var(--faded);margin-bottom:10px}
.kengen-group{margin-bottom:12px}
.kengen-group-label{font-family:'Noto Serif JP',serif;font-size:12px;color:var(--ink);font-weight:700;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid var(--border)}
.kg-opts{display:flex;gap:6px;flex-wrap:wrap}
.kg-opt{font-size:13px;padding:6px 12px;border-radius:3px;border:1px solid var(--border);background:var(--panel);cursor:pointer;transition:all .15s;font-family:'Noto Sans JP',sans-serif}
.kg-opt:hover{border-color:var(--gold)}
.kg-opt.chosen{border-color:var(--gold);background:#d4aa70;font-weight:700}
.kg-sub{font-size:11px;margin-top:5px;padding:4px 7px;border:1px solid var(--border);background:var(--paper);color:var(--ink);border-radius:3px;display:none}
.kg-sub.show{display:block}
#kg-result{font-size:11.5px;color:var(--faded);margin-top:8px;padding:6px 8px;background:var(--panel);border-radius:3px;min-height:30px}
.ph-complete{display:block;width:calc(100% - 24px);margin:10px 12px;padding:12px;font-family:'Noto Serif JP',serif;font-size:14px;font-weight:700;letter-spacing:2px;background:linear-gradient(#d8b13a,#b58f1d);border:2px solid var(--gold);border-radius:4px;color:#241d11;cursor:pointer;transition:filter .15s}
.ph-complete:hover{filter:brightness(1.1)}.ph-complete:disabled{opacity:.4;cursor:default}
.ph-actions{display:flex;align-items:stretch;gap:8px;margin:10px 12px;width:calc(100% - 24px)}
.ph-actions .ph-complete{flex:1;width:auto;margin:0;min-width:0}
.ph-save-btn{flex:0 0 auto;min-width:72px;padding:8px 10px;font-family:'Noto Serif JP',serif;font-size:12px;font-weight:700;letter-spacing:1px;background:var(--panel);border:2px solid var(--border);border-radius:4px;color:var(--ink);cursor:pointer;transition:background .15s,border-color .15s}
.ph-save-btn:hover{background:var(--dim);border-color:var(--gold)}
/* 経営 */
.mgmt-section{padding:12px}
.card{background:var(--paper2);border:1px solid var(--border);border-radius:4px;margin-bottom:12px;overflow:hidden;display:none}
.card.show{display:block}
.card-head{background:var(--panel);border-bottom:1px solid var(--border);padding:7px 12px;font-family:'Noto Serif JP',serif;font-size:13px;color:var(--faded);letter-spacing:2px;display:flex;align-items:center;gap:8px}
.card-head img{width:32px;height:32px}
.card-body{padding:10px 12px}
.mgmt-table{width:100%;border-collapse:collapse;font-size:12px}
.mgmt-table th{text-align:left;font-size:10px;color:var(--faded);font-weight:400;padding:3px 5px;border-bottom:1px solid var(--dim)}
.mgmt-table td{padding:5px;border-bottom:1px dashed var(--dim);vertical-align:middle}
.mgmt-table tr:last-child td{border-bottom:none}
.qty-ctrl{display:flex;align-items:center;gap:4px}
.qty-btn{width:22px;height:22px;background:var(--panel);border:1px solid var(--border);cursor:pointer;font-size:13px;color:var(--ink);display:flex;align-items:center;justify-content:center;border-radius:2px;transition:background .15s}
.qty-btn:hover{background:var(--dim)}
.qty-num{min-width:20px;text-align:center;font-family:'Noto Serif JP',serif;font-size:13px}
.res-price{font-size:10px;color:var(--gold)}
.locked{opacity:.35;font-size:11px;color:var(--faded)}
.inprod-badge{display:inline-block;background:#5a3a0a;color:#e8c87a;font-size:10px;padding:1px 5px;border-radius:2px;margin-left:4px}
.trade-summary{font-size:11px;color:var(--faded);padding:6px 0;display:flex;gap:14px;flex-wrap:wrap}
.trade-summary b{color:var(--ink)}
.prod-summary{font-size:11px;color:var(--faded);margin-top:6px}
.btn-sm{font-family:'Noto Serif JP',serif;font-size:12px;padding:6px 14px;background:var(--accent);color:var(--paper);border:none;border-radius:3px;cursor:pointer;margin-top:8px}
.btn-prod-start{font-family:'Noto Serif JP',serif;font-size:12px;padding:6px 14px;background:var(--green);color:var(--paper);border:none;border-radius:3px;cursor:pointer;margin-top:8px;margin-left:6px}
/* 在庫バー */
.stock-bar{background:var(--panel);border-bottom:1px solid var(--border);padding:6px 12px;font-size:11px;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.sb-title{font-family:'Noto Serif JP',serif;color:var(--gold);font-size:10px;letter-spacing:1px;flex-shrink:0}
.sb-item{color:var(--faded)}.sb-item b{color:var(--ink)}
.sb-inprod{color:var(--faded);font-size:10px}
/* 輸送 */
.tp-tab-content{display:none}.tp-tab-content.active{display:block}
.tp-title{font-size:13px;padding:8px 12px;background:var(--panel);border-bottom:1px solid var(--border);font-family:'Noto Serif JP',serif;color:var(--ink)}
.tp-inner{padding:12px}
.prep-panel{background:#fffbf0;border:1px solid var(--border);border-radius:4px;padding:10px;margin-bottom:10px}
.prep-header{font-family:'Noto Serif JP',serif;font-size:12px;color:var(--faded);margin-bottom:8px;letter-spacing:1px}
.prep-info{font-size:11px;color:var(--faded);margin:6px 0}
.hand-btn{display:block;width:100%;padding:8px;font-family:'Noto Serif JP',serif;font-size:13px;font-weight:700;background:var(--green);color:var(--paper);border:none;border-radius:3px;cursor:pointer;margin-top:6px;letter-spacing:1px}
.hand-btn:disabled{opacity:.35;cursor:default}
.hand-btn.done{background:#888;pointer-events:none}
.sortie-area{margin:10px 0}
.sortie-btn{display:block;width:100%;padding:12px;font-family:'Noto Serif JP',serif;font-size:14px;font-weight:700;background:linear-gradient(135deg,#8b2c2c,#c04030);color:#fff;border:2px solid #e05040;border-radius:4px;cursor:pointer;letter-spacing:2px;animation:pulse-sortie 1.5s ease-in-out infinite}
@keyframes pulse-sortie{0%,100%{box-shadow:0 0 0 0 rgba(200,60,40,.4)}50%{box-shadow:0 0 0 8px rgba(200,60,40,0)}}
.sortie-done{font-size:12px;color:var(--green);font-weight:700;padding:8px;text-align:center;background:#e8f5e8;border:1px solid var(--green);border-radius:3px}
.item-row{display:flex;align-items:center;gap:8px;padding:6px;background:var(--panel);border-radius:3px;margin-bottom:5px}
.item-row img{width:36px;height:36px;object-fit:contain;flex:0 0 auto}
.item-info{flex:1;min-width:0}
.item-name{font-weight:700;font-size:13px;font-family:'Noto Serif JP',serif}
.item-stock{font-size:10.5px;color:var(--faded);margin-top:2px}
.item-qty-large{display:flex;align-items:center;gap:8px;margin-left:auto;flex:0 0 auto}
.qty-btn-lg{width:30px;height:30px;border-radius:4px;border:2px solid var(--border);background:var(--paper);font-size:18px;cursor:pointer;font-weight:700;display:flex;align-items:center;justify-content:center;transition:background .15s;flex:0 0 auto}
.qty-btn-lg:hover{background:var(--dim)}
.qty-val-lg{min-width:32px;text-align:center;font-weight:700;font-size:18px;font-family:'Noto Serif JP',serif}
.tp-info{background:#e8dfc0;border-radius:3px;padding:6px 10px;font-size:11px;color:var(--faded);margin-top:6px}
.go-btn{display:block;width:100%;margin-top:6px;padding:8px;font-family:'Noto Serif JP',serif;font-size:13px;font-weight:700;background:var(--gold);border:none;border-radius:3px;cursor:pointer;color:var(--wood);letter-spacing:1px}
.go-btn:disabled{opacity:.35;cursor:default}
.go-btn.done-btn{background:#4a7a4a;color:var(--paper)}
.means-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.means-btn{font-size:12px;padding:6px 12px;border-radius:3px;border:1px solid var(--border);background:var(--panel);cursor:pointer;transition:all .15s;font-family:'Noto Sans JP',sans-serif}
.means-btn:hover{border-color:var(--gold)}.means-btn.active{border-color:var(--gold);background:#d4aa70;font-weight:700}
/* 結果 */
.result-panel{padding:12px}
.result-log{background:#1a1207;border:1px solid var(--border);padding:12px;font-family:'Noto Serif JP',serif;color:var(--paper);font-size:13px;line-height:2.2;min-height:60px;border-radius:4px;margin-bottom:10px}
.log-line{opacity:0;transition:opacity .3s}.log-line.show{opacity:1}
.log-ok{color:#6abd6a}.log-warn{color:#e8a84a}.log-accent{color:var(--gold)}.log-info{color:#7ab8d8}
.result-section{background:var(--paper2);border:1px solid var(--border);border-radius:4px;margin-bottom:10px;overflow:hidden}
.result-section-head{background:var(--panel);border-bottom:1px solid var(--border);padding:6px 12px;font-family:'Noto Serif JP',serif;font-size:12px;color:var(--faded);letter-spacing:1px}
.result-section-body{padding:10px 12px;font-size:12px;line-height:2}
.trust-bar-wrap{background:var(--dim);border-radius:2px;height:6px;width:80px;display:inline-block;margin-left:6px;vertical-align:middle}
.trust-bar-fill{height:6px;border-radius:2px;background:var(--gold);transition:width .5s}
#toast{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:var(--ink);color:var(--paper);font-size:12px;padding:7px 16px;border-radius:999px;opacity:0;transition:opacity .3s;pointer-events:none;z-index:200;border:1px solid var(--gold)}
#toast.on{opacity:.95}
@media(max-width:500px){.pc img.crest{width:28px;height:28px}.cmd-btn img,.cmd-ph{width:34px;height:34px}}
"""

# ── HTML部品生成

def build_prince_bar():
    html=''
    for p in PRINCES:
        html+=f'''<div class="pc" onclick="showMapCard('{p['key']}')">
  <img class="crest" src="{I[f'crest_{p["key"]}']}" alt="">
  <div class="pc-info">
    <div class="pc-name" style="color:{p['textcol']}">{p['name']}（{p['dir']}）</div>
    <div class="pc-req" id="pc-req-{p['key']}">準備中</div>
    <div class="pc-sub" id="pc-sub-{p['key']}">出立待ち</div>
  </div>
  <div id="pc-dl-{p['key']}"></div>
</div>'''
    return html

def build_5tab_bar():
    # 王子4 + 謁見1
    html='<div class="tab-bar-5">'
    for i,p in enumerate(PRINCES):
        act=' active' if i==0 else ''
        html+=f'''<button class="tab-btn-5{act}" id="ptab-{p['key']}" onclick="selectTab('{p['key']}')">
  <img src="{I[f'crest_{p["key"]}']}" alt="">
  <span class="tab-pname" style="color:{p['textcol']}"><span class="tab-check" id="tab-check-{p['key']}"></span>{p['name']}</span>
  <span class="tab-req" id="ltab-req-{p['key']}">準備中</span>
  <span class="tab-dl" id="ltab-dl-{p['key']}">出立待ち</span>
</button>'''
    # 謁見タブ
    html+=f'''<button class="tab-btn-5 tab-kengen" id="ptab-kengen" onclick="selectTab('kengen')">
  <span style="font-size:18px">🏯</span>
  <span class="tab-pname" style="color:var(--gold)">謁見</span>
  <span class="tab-req" id="kg-summary-tab">進言/献上</span>
  <span class="tab-dl">任意</span>
</button>'''
    html+='</div>'
    return html

def build_letter_shells():
    html=''
    for p in PRINCES:
        key=p['key']
        from_prep=f'{p["name"]}（{p["title"]}）→ 主人公宛 【出立前・準備依頼】'
        from_sort=f'{p["name"]}（{p["title"]}）→ 主人公宛 【ノード1より】'
        girl_names={'food':'秤目','horse':'鞍馬','siege':'炉子','weapon':'芍薬'}
        html+=f'''<div id="lc-{key}" class="tab-content">
  <div class="ltabs">
    <button class="ltab active" onclick="selectLetterTab('{key}','demand')">📋 依頼</button>
    <button class="ltab" onclick="selectLetterTab('{key}','personal')">✉ 娘への手紙</button>
  </div>
  <div id="lt-{key}-demand"></div>
  <div id="lt-{key}-personal" style="display:none">
    <div class="girl-row">
      <img src="{I[f'girl_{key}']}" alt="{girl_names[key]}">
      <div class="bubble" id="girl-msg-{key}"></div>
    </div>
    <div id="personal-body-{key}"></div>
    <div id="choices-area-{key}"></div>
  </div>
</div>'''
    # 謁見タブ
    commend_opts=''.join(f'<option value="{p["key"]}">{p["name"]}</option>' for p in PRINCES)
    html+=f'''<div id="lc-kengen" class="tab-content">
  <div class="kengen-note">進言・献上の選択（次ターンから有効、確定ボタン不要）</div>
  <div class="kengen-group">
    <div class="kengen-group-label">進 言</div>
    <div class="kg-opts" id="kg-shingen">
      <button class="kg-opt" onclick="kgPick('shingen','iron',this)">鉄増産</button>
      <button class="kg-opt" onclick="kgPick('shingen','wood',this)">木材増産</button>
      <button class="kg-opt" onclick="kgPick('shingen','food_mat',this)">兵糧増産</button>
      <button class="kg-opt" onclick="kgPick('shingen','horse_find',this)">名馬探索</button>
      <button class="kg-opt" onclick="kgPick('shingen','commend',this)">王子を褒める
        <select class="kg-sub" id="kg-commend-sel" onclick="event.stopPropagation()">{commend_opts}</select>
      </button>
    </div>
  </div>
  <div class="kengen-group">
    <div class="kengen-group-label">献 上</div>
    <div class="kg-opts" id="kg-kenjou">
      <button class="kg-opt" onclick="kgPick('kenjou','potion',this)">回復薬</button>
      <button class="kg-opt" onclick="kgPick('kenjou','gold100',this)">100両</button>
      <button class="kg-opt" onclick="kgPick('kenjou','gold300',this)">300両</button>
    </div>
  </div>
  <div id="kg-result"></div>
</div>'''
    return html

def build_trans_content(p):
    key=p['key']
    pq=CONFIG['prep_quests'][key]
    img_map={'food':'mat_stone','horse':'horse_1','siege_w':'ammo_1','sword':'wepon_1'}
    img_key=img_map.get(pq['item'],'mat_iron')
    prep=f'''<div class="prep-panel" id="prep-panel-{key}">
  <div class="prep-header">📦 出立準備依頼（手渡し・即時）</div>
  <div class="item-row">
    <img src="{I[img_key]}" alt="">
    <div class="item-info">
      <div class="item-name">{pq['label']}</div>
      <div class="item-stock" id="prep-stock-{key}">現庫: <b>0</b>　必要: {pq['qty']}</div>
    </div>
    <div class="item-qty-large">
      <button class="qty-btn-lg" onclick="changePrepQty('{key}',-1)">－</button>
      <span class="qty-val-lg" id="prep-qty-{key}">0</span>
      <button class="qty-btn-lg" onclick="changePrepQty('{key}',1)">＋</button>
    </div>
  </div>
  <div class="prep-info" id="prep-info-{key}">準備品を手渡すと信頼度が上がります（+{pq['trust_reward']}）</div>
  <button class="hand-btn" id="hand-btn-{key}" onclick="handDeliver('{key}')" disabled>手渡しする</button>
</div>
<div class="sortie-area" id="sortie-area-{key}" style="display:none">
  <button class="sortie-btn" id="sortie-btn-{key}" onclick="sortie('{key}')" style="display:none">
    ⚑ {p['name']}を出立させる
  </button>
  <div class="sortie-done" id="sortie-done-{key}" style="display:none">✓ 出立済み（マップに登場）</div>
</div>'''

    # 通常輸送（出立後）
    if key=='siege':
        normal=f'''<div class="means-row" id="means-{key}">
  <button class="means-btn" onclick="selectMeans('{key}','jinput',this)">人足（積載1）</button>
  <button class="means-btn" onclick="selectMeans('{key}','cart',this)">荷車（積載2）</button>
</div>
<div class="item-row">
  <img src="{I['ammo_1']}" alt="">
  <div class="item-info"><div class="item-name">衝車 ★1</div>
  <div class="item-stock" id="ts-{key}-stock">現庫: <b id="ts-{key}-stk">0</b>　<span class="sb-inprod">生産中: <span id="ts-{key}-inp">0</span>（来T完成）</span>　<span style="color:var(--accent)">依頼残: <span id="ts-{key}-req">0</span></span></div></div>
  <div class="item-qty-large">
    <button class="qty-btn-lg" onclick="changeQty('{key}','siege_w',-1)">－</button>
    <span class="qty-val-lg" id="qty-{key}-siege_w">0</span>
    <button class="qty-btn-lg" onclick="changeQty('{key}','siege_w',1)">＋</button>
  </div>
</div>
<div class="tp-info" id="tinfo-{key}">輸送手段を選択してください</div>
<button class="go-btn" disabled id="go-{key}" onclick="goTransport('{key}')">Go → 出発</button>'''
    elif key=='weapon':
        normal=f'''<div class="means-row" id="means-{key}">
  <button class="means-btn" onclick="selectMeans('{key}','jinput',this)">人足（積載1）</button>
  <button class="means-btn" onclick="selectMeans('{key}','cart',this)">荷車（積載2）</button>
  <button class="means-btn" onclick="selectMeans('{key}','boat',this)">船（積載4）</button>
</div>
<div class="item-row">
  <img src="{I['wepon_2']}" alt="">
  <div class="item-info"><div class="item-name">弩 ★2</div>
  <div class="item-stock">現庫: <b id="ts-{key}-stk">2</b>　<span class="sb-inprod">生産中: <span id="ts-{key}-inp">0</span>（来T完成）</span>　<span style="color:var(--accent)">依頼残: <span id="ts-{key}-req">4</span></span></div></div>
  <div class="item-qty-large">
    <button class="qty-btn-lg" onclick="changeQty('{key}','sword',-1)">－</button>
    <span class="qty-val-lg" id="qty-{key}-sword">0</span>
    <button class="qty-btn-lg" onclick="changeQty('{key}','sword',1)">＋</button>
  </div>
</div>
<div class="tp-info" id="tinfo-{key}">輸送手段を選択してください</div>
<button class="go-btn" disabled id="go-{key}" onclick="goTransport('{key}')">Go → 出発</button>'''
    else:
        normal='<p style="font-size:12px;color:var(--faded);padding:4px 0">出立後、各ターンの依頼に応じて輸送します。</p>'

    return f'''<div id="tp-{key}" class="tp-tab-content">
  <div class="tp-title" style="border-left:4px solid {p['color']}">{p['title']}（{p['dir']}）</div>
  <div class="tp-inner">
    {prep}
    <div class="normal-trans" id="normal-trans-{key}" style="display:none">{normal}</div>
  </div>
</div>'''

def build_trans_tab_btns():
    html=''
    for i,p in enumerate(PRINCES):
        act=' active' if i==0 else ''
        html+=f'''<button class="tab-btn-5{act}" id="ttab-{p['key']}" onclick="selectTransTab('{p['key']}')">
  <img src="{I[f'crest_{p["key"]}']}" alt="">
  <span class="tab-pname" style="color:{p['textcol']}">{p['name']}</span>
</button>'''
    return html

# HTMLセクション生成
def build_mgmt():
    rows_market=''
    for res,pd in CONFIG['prices'].items():
        buy_cell=f'<td><div class="qty-ctrl"><button class="qty-btn" onclick="buy(\'{res}\',-1)">−</button><div class="qty-num" id="buy-{res}">0</div><button class="qty-btn" onclick="buy(\'{res}\',1)">＋</button></div></td>'
        sell_cell=f'<td><div class="qty-ctrl"><button class="qty-btn" onclick="sell(\'{res}\',-1)">−</button><div class="qty-num" id="sell-{res}">0</div><button class="qty-btn" onclick="sell(\'{res}\',1)">＋</button></div></td>'
        if pd['buy']>=999: buy_cell='<td class="locked">購入不可</td>'
        inv_key=res if res!='food_mat' else 'food'
        inv_id=f'inv-{res}' if res!='med' else 'inv-med'
        price_txt = f'売{pd["sell"]}両 買{pd["buy"]}両' if pd['buy']<999 else f'売{pd["sell"]}両'
        rows_market+=f'<tr><td>{pd["label"]}</td><td id="{inv_id}">0</td><td class="res-price">{price_txt}</td>{buy_cell}{sell_cell}</tr>'
    
    recipes_smith=''
    for item,rd in CONFIG['recipes_smith'].items():
        cost_str='・'.join(f'{k}×{v}' for k,v in rd['cost'].items())
        recipes_smith+=f'<tr><td>{rd["label"]}</td><td class="res-price">{cost_str}</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="produce(\'{item}\',-1)">−</button><div class="qty-num" id="prod-{item}">0</div><button class="qty-btn" onclick="produce(\'{item}\',1)">＋</button></div></td></tr>'
    
    recipes_pharm=''
    for item,rd in CONFIG['recipes_pharmacy'].items():
        cost_str='・'.join(f'{k}×{v}' for k,v in rd['cost'].items())
        recipes_pharm+=f'<tr><td>{rd["label"]}</td><td class="res-price">{cost_str}</td><td><div class="qty-ctrl"><button class="qty-btn" onclick="produce(\'{item}\',-1)">−</button><div class="qty-num" id="prod-{item}">0</div><button class="qty-btn" onclick="produce(\'{item}\',1)">＋</button></div></td></tr>'

    return f"""<div id="sec-management" style="display:none">
<div class="mgmt-section">
  <div class="card" id="card-market">
    <div class="card-head"><img src="{I['bld_market']}" alt="">市場 ─ 売買（秤目が管理）</div>
    <div class="card-body">
      <div class="girl-row" style="margin-bottom:10px"><img src="{I['girl_food']}" alt="秤目" style="width:54px">
        <div class="bubble" style="font-size:11px">いらっしゃいませ。売買の相場は今日も安定しています。薬の売却もお受けします。</div></div>
      <table class="mgmt-table">
        <tr><th>品目</th><th>在庫</th><th>価格</th><th>購入</th><th>売却</th></tr>
        {rows_market}
      </table>
      <div class="trade-summary">購入計：<b><span id="buy-total">0</span>両</b>　売却益：<b><span id="sell-total">0</span>両</b>　差引：<b><span id="net-total">0</span>両</b></div>
      <div><button class="btn-sm" onclick="confirmTrade()">売買を確定</button></div>
    </div>
  </div>
  <div class="card" id="card-smith">
    <div class="card-head"><img src="{I['bld_smith']}" alt="">鍛冶工房 ─ 生産（1T・{CONFIG['smith_capacity']}枠）</div>
    <div class="card-body">
      <div class="girl-row" style="margin-bottom:8px"><img src="{I['girl_siege']}" alt="炉子" style="width:54px">
        <div class="bubble" style="font-size:11px">図面、もう読み終わりました！まずは生産を指示してください。<br><small style="color:var(--faded)">※生産品は結果フェーズで完成し、翌ターンから輸送可能です</small></div></div>
      <div style="font-size:11px;color:var(--faded);margin-bottom:8px">完成品在庫：剣 <b id="stk-sword">2</b>　衝車 <b id="stk-siege_w">0</b>
        <span class="inprod-badge">生産中：剣<span id="inp-sword">0</span> 衝車<span id="inp-siege_w">0</span></span></div>
      <table class="mgmt-table">
        <tr><th>品目</th><th>レシピ</th><th>生産数</th></tr>
        {recipes_smith}
      </table>
      <div class="prod-summary">枠：<span id="prod-smith-used">0</span>/{CONFIG['smith_capacity']}　鉄消費：<span id="prod-iron-cost">0</span>　木材消費：<span id="prod-wood-cost">0</span></div>
      <div><button class="btn-prod-start" onclick="startProduction('smith')">生産開始！</button></div>
    </div>
  </div>
  <div class="card" id="card-pharmacy">
    <div class="card-head"><img src="{I['bld_pharmacy']}" alt="">薬房 ─ 生産（1T・{CONFIG['pharmacy_capacity']}枠）</div>
    <div class="card-body">
      <div class="girl-row" style="margin-bottom:8px"><img src="{I['girl_weapon']}" alt="芍薬" style="width:54px">
        <div class="bubble" style="font-size:11px">どんどん指示してください。<br><small style="color:var(--faded)">※生産品は結果フェーズで完成し、翌ターンから輸送可能です</small></div></div>
      <div style="font-size:11px;color:var(--faded);margin-bottom:8px">完成品在庫：回復薬 <b id="stk-med">0</b>
        <span class="inprod-badge">生産中：<span id="inp-med">0</span></span></div>
      <table class="mgmt-table">
        <tr><th>品目</th><th>レシピ</th><th>生産数</th></tr>
        {recipes_pharm}
      </table>
      <div class="prod-summary">枠：<span id="prod-pharm-used">0</span>/{CONFIG['pharmacy_capacity']}　薬草消費：<span id="prod-herb-cost">0</span></div>
      <div><button class="btn-prod-start" onclick="startProduction('pharmacy')">生産開始！</button></div>
    </div>
  </div>
  <div class="card" id="card-ranch">
    <div class="card-head"><img src="{I['bld_ranch']}" alt="">牧場（鞍馬が管理）</div>
    <div class="card-body">
      <div class="girl-row"><img src="{I['girl_horse']}" alt="鞍馬" style="width:54px">
        <div class="bubble" style="font-size:11px">…今朝の仔馬、足が速そうです。<br><small style="color:var(--faded)">（牧場機能は次の試作で実装予定）</small></div></div>
    </div>
  </div>
  <div class="ph-actions">
    <button class="ph-complete" onclick="goToTransport()">フェーズ完了 ▶ 輸送フェーズへ</button>
    <button type="button" class="ph-save-btn" onclick="openSaveModal('save')">💾 セーブ</button>
    <button type="button" class="ph-save-btn" onclick="openSaveModal('load')">📂 ロード</button>
  </div>
</div>
</div>"""

# ── JavaScript生成
config_js = json.dumps(CONFIG, ensure_ascii=False, indent=2)

JS = f"""
const CFG = {config_js};

const PKEYS=['food','horse','siege','weapon'];
const PNAMES={{food:'兵糧太',horse:'騎馬次',siege:'攻三城',weapon:'武刃四'}};
const PDIRS={{food:'東',horse:'北',siege:'西',weapon:'南'}};
const PCOLORS={{food:'#a07417',horse:'#41756c',siege:'#5a4a7d',weapon:'#a63a2c'}};
const SEASONS=['春','夏','秋','冬'];
// 運送駒の表示サイズ（旧デモ animateMotion 駒 width≈50–58 に合わせる。王子 .piece とは別）
const CONVOY_ICON_SIZE=56;
const qtys={{}};

const gs={{
  phase:'letter', turn:1, year:1, season:0,
  gold:CFG.start.gold,
  inv:{{iron:CFG.start.iron,wood:CFG.start.wood,niter:CFG.start.niter,herb:CFG.start.herb,food:CFG.start.food}},
  stock:{{sword:CFG.start.sword,siege_w:CFG.start.siege_w,med:CFG.start.med}},
  inProd:{{sword:0,siege_w:0,med:0}},  // 生産中（翌T完成）
  buy:{{}}, sellQ:{{}},
  prod:{{sword:0,siege_w:0,med:0}},    // 今T指示分
  transport:{{}}, choices:{{}}, kengen:{{shingen:null,kenjou:null}},
  trust:{{food:0,horse:0,siege:0,weapon:0}},
  prepDone:{{food:false,horse:false,siege:false,weapon:false}},
  sortied:{{food:false,horse:false,siege:false,weapon:false}},
  prepQty:{{food:0,horse:0,siege:0,weapon:0}},
  sortieDoneThisTurn:false,
}};

// ── フェーズ ──
function setPhase(p){{
  gs.phase=p;
  const LBL={{letter:'手紙',management:'経営',transport:'輸送',result:'結果'}};
  document.getElementById('phase-badge').textContent=LBL[p]||p;
  const steps=['letter','management','transport','result'];
  document.querySelectorAll('.step').forEach((s,i)=>{{
    s.classList.remove('active','done');
    const idx=steps.indexOf(p);
    if(i<idx)s.classList.add('done');else if(i===idx)s.classList.add('active');
  }});
  document.querySelectorAll('.cmd-btn').forEach(b=>{{
    b.classList.remove('active','disabled');
    const id=b.id;
    if(p==='letter'){{
      if(['cmd-market','cmd-smith','cmd-ranch','cmd-pharmacy','cmd-transport'].includes(id))b.classList.add('disabled');
      if(id==='cmd-letter')b.classList.add('active');
    }}else if(p==='management'){{
      if(['cmd-letter','cmd-transport'].includes(id))b.classList.add('disabled');
    }}else if(p==='transport'){{
      if(['cmd-letter','cmd-market','cmd-smith','cmd-ranch','cmd-pharmacy'].includes(id))b.classList.add('disabled');
      if(id==='cmd-transport')b.classList.add('active');
    }}else{{document.querySelectorAll('.cmd-btn').forEach(b=>b.classList.add('disabled'));}}
  }});
  ['management','transport','result'].forEach(sec=>{{
    document.getElementById('sec-'+sec).style.display=(p===sec)?'block':'none';
  }});
  if(p==='management'){{openCard(null);updateInvDisplay();}}
  if(p==='transport'){{selectTransTab('food');updateStockBar();updateTransportUI();}}
  if(p==='result')buildResultScreen();
}}

// ── 手紙オーバーレイ ──
function openLetterOverlay(){{
  renderAllLetters();
  document.getElementById('overlay').classList.add('on');
  selectTab('food');
}}
function closeOverlay(){{document.getElementById('overlay').classList.remove('on');}}

// ── 手紙レンダリング ──
function renderAllLetters(){{
  PKEYS.forEach(key=>renderLetter(key));
  updateTabLabels();
  checkLettersDone();
}}
function getLetter(key){{
  const ld=CFG.letters[key];
  return gs.sortied[key]?ld.sortied:ld.prep;
}}
function renderLetter(key){{
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
}}
function renderChoices(key,opts){{
  const area=document.getElementById('choices-area-'+key);if(!area)return;
  const chosen=gs.choices[key];
  let html='<div class="choices-wrap"><div class="choices-label">返事を選んでください（取り消し不可）</div>';
  opts.forEach((o,i)=>{{
    const sel=(chosen!==undefined&&chosen.idx===i)?'selected':'';
    html+=`<button class="choice-btn ${{sel}}" onclick="selectChoice('${{key}}',${{i}},${{o.trust}},this)">
      <span class="choice-icon">${{o.icon}}</span>
      <div>${{o.text}}<span class="trust-hint">✦ 信頼度 +${{o.trust}}</span></div></button>`;
  }});
  html+='</div>';
  area.innerHTML=html;
}}
function updateTabLabels(){{
  PKEYS.forEach(key=>{{
    const req=document.getElementById('ltab-req-'+key);
    const dl=document.getElementById('ltab-dl-'+key);
    const tab=document.getElementById('ptab-'+key);
    const chk=document.getElementById('tab-check-'+key);
    if(chk)chk.textContent=(gs.choices[key]!==undefined)?'☑ ':'';
    const t=gs.trust[key];
    if(gs.sortied[key]){{
      if(req)req.textContent='出立済';if(dl)dl.textContent='ノード1';
      if(tab)tab.classList.remove('urg-tab');
    }}else if(gs.prepDone[key]){{
      if(req)req.textContent='準備完了';if(dl)dl.textContent='信頼'+t+'/100';
      if(tab)tab.classList.toggle('urg-tab',t>=CFG.sortie_trust_threshold);
    }}else{{
      const q=CFG.prep_quests[key];
      if(req)req.textContent='準備:'+q.label+'×'+q.qty;
      if(dl)dl.textContent='信頼'+t+'/100';
    }}
  }});
  // 謁見タブのサマリー
  const ks=document.getElementById('kg-summary-tab');
  if(ks){{
    const parts=[];
    if(gs.kengen.shingen)parts.push('進言✓');
    if(gs.kengen.kenjou)parts.push('献上✓');
    ks.textContent=parts.length?parts.join(' '):'進言/献上';
  }}
}}

// ── 5タブ切り替え ──
function selectTab(key){{
  document.querySelectorAll('[id^="ptab-"]').forEach(b=>b.classList.remove('active'));
  const btn=document.getElementById('ptab-'+key);if(btn)btn.classList.add('active');
  document.querySelectorAll('#ov-inner .tab-content').forEach(c=>c.classList.remove('active'));
  const lc=document.getElementById('lc-'+key);if(lc)lc.classList.add('active');
}}
function selectLetterTab(prince,tab){{
  ['demand','personal'].forEach(t=>{{
    const el=document.getElementById('lt-'+prince+'-'+t);if(el)el.style.display=(t===tab)?'block':'none';
  }});
  document.querySelectorAll('#lc-'+prince+' .ltab').forEach((b,i)=>{{
    b.classList.toggle('active',(i===0&&tab==='demand')||(i===1&&tab==='personal'));
  }});
}}
function selectChoice(key,idx,trust,btn){{
  if(gs.choices[key]!==undefined)return;
  gs.choices[key]={{idx,trust}};
  document.querySelectorAll('#choices-area-'+key+' .choice-btn').forEach((b,i)=>b.classList.toggle('selected',i===idx));
  gs.trust[key]=Math.min(100,gs.trust[key]+trust);
  const dotMap={{food:0,horse:1,siege:2,weapon:3}};
  const dot=document.getElementById('lp-'+dotMap[key]);if(dot)dot.classList.add('done');
  checkLettersDone();showToast('返事を選びました（取り消し不可）');
  updatePrinceBar();checkSortieConditions();updateTabLabels();
}}
function checkLettersDone(){{
  const all=PKEYS.every(k=>gs.choices[k]!==undefined);
  const btn=document.getElementById('ph-letter-complete');if(btn)btn.disabled=!all;
}}

// ── 謁見 ──
function kgPick(type,val,btn){{
  gs.kengen[type]=val;
  document.querySelectorAll('#kg-'+type+' .kg-opt').forEach(b=>b.classList.remove('chosen'));
  btn.classList.add('chosen');
  if(val==='commend'){{const s=document.getElementById('kg-commend-sel');if(s)s.classList.add('show');}}
  const labels={{iron:'鉄増産',wood:'木材増産',food_mat:'兵糧増産',horse_find:'名馬探索',commend:'王子を褒める',
    potion:'回復薬を献上',gold100:'100両を献上',gold300:'300両を献上'}};
  document.getElementById('kg-result').textContent=
    (gs.kengen.shingen?'進言：'+(labels[gs.kengen.shingen]||gs.kengen.shingen)+'　':'')+
    (gs.kengen.kenjou?'献上：'+(labels[gs.kengen.kenjou]||gs.kengen.kenjou):'');
  updateTabLabels();
}}

// ── 経営カード ──
function openCard(name){{
  ['market','smith','pharmacy','ranch'].forEach(n=>{{
    const el=document.getElementById('card-'+n);if(el)el.classList.toggle('show',n===name);
  }});
}}
function cmdClick(name){{
  if(gs.phase==='management')openCard(name);
  else if(gs.phase==='letter')openLetterOverlay();
}}

// ── 売買 ──
function buy(res,delta){{
  const p=CFG.prices[res];if(!p||p.buy>=999)return;
  const nv=Math.max(0,(gs.buy[res]||0)+delta);
  if(delta>0&&gs.gold-calcBuyCost()+calcSellIncome()-p.buy<0)return;
  gs.buy[res]=nv;const el=document.getElementById('buy-'+res);if(el)el.textContent=nv;
  updateTradeTotals();
}}
function sell(res,delta){{
  const p=CFG.prices[res];if(!p)return;
  const avail=res==='med'?gs.stock.med:(gs.inv[res==='food_mat'?'food':res]||0);
  const nv=Math.max(0,Math.min(avail,(gs.sellQ[res]||0)+delta));
  gs.sellQ[res]=nv;const el=document.getElementById('sell-'+res);if(el)el.textContent=nv;
  updateTradeTotals();
}}
function calcBuyCost(){{return Object.entries(gs.buy||{{}}).reduce((s,[r,q])=>s+q*(CFG.prices[r]?.buy||0),0);}}
function calcSellIncome(){{return Object.entries(gs.sellQ||{{}}).reduce((s,[r,q])=>s+q*(CFG.prices[r]?.sell||0),0);}}
function calcTradeNet(){{return calcSellIncome()-calcBuyCost();}}
function updateTradeTotals(){{
  const b=calcBuyCost(),s=calcSellIncome(),net=s-b;
  const set=(id,v)=>{{const e=document.getElementById(id);if(e)e.textContent=v;}};
  set('buy-total',b);set('sell-total',s);
  const ne=document.getElementById('net-total');
  if(ne){{ne.textContent=(net>=0?'+':'')+net;ne.style.color=net>=0?'var(--green)':'var(--accent)';}}
}}
function confirmTrade(){{
  if(gs.gold+calcTradeNet()<0){{showToast('金が足りません');return;}}
  gs.gold+=calcTradeNet();
  for(const[r,q]of Object.entries(gs.buy||{{}})){{if(r==='food_mat')gs.inv.food+=q;else gs.inv[r]=(gs.inv[r]||0)+q;}}
  for(const[r,q]of Object.entries(gs.sellQ||{{}})){{
    if(r==='food_mat')gs.inv.food=Math.max(0,gs.inv.food-q);
    else if(r==='med')gs.stock.med=Math.max(0,gs.stock.med-q);
    else gs.inv[r]=Math.max(0,(gs.inv[r]||0)-q);
  }}
  gs.buy={{}};gs.sellQ={{}};
  Object.keys(CFG.prices).forEach(r=>{{
    ['buy-','sell-'].forEach(pre=>{{const e=document.getElementById(pre+r);if(e)e.textContent=0;}});
  }});
  updateTradeTotals();updateHeaderDisplay();updateInvDisplay();showToast('売買を確定しました');
}}

// ── 生産（今ターン指示、結果フェーズで完成） ──
function produce(item,delta){{
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
  const set=(id,v)=>{{const e=document.getElementById(id);if(e)e.textContent=v;}};
  set('prod-'+item,nv);
  set('prod-smith-used',gs.prod.sword+gs.prod.siege_w);
  set('prod-pharm-used',gs.prod.med);
  set('prod-iron-cost',gs.prod.sword);
  set('prod-wood-cost',gs.prod.siege_w*2);
  set('prod-herb-cost',gs.prod.med);
}}
function startProduction(facility){{
  const items=facility==='smith'?['sword','siege_w']:['med'];
  const totals=items.map(k=>gs.prod[k]).reduce((a,b)=>a+b,0);
  showToast(facility==='smith'?`工房：剣×${{gs.prod.sword}} 衝車×${{gs.prod.siege_w}} を確定`:`薬房：回復薬×${{gs.prod.med}} を確定`);
}}

// ── 輸送タブ ──
function selectTransTab(key){{
  document.querySelectorAll('[id^="ttab-"]').forEach(b=>b.classList.remove('active'));
  const btn=document.getElementById('ttab-'+key);if(btn)btn.classList.add('active');
  document.querySelectorAll('.tp-tab-content').forEach(c=>c.classList.remove('active'));
  const tc=document.getElementById('tp-'+key);if(tc)tc.classList.add('active');
}}
function selectMeans(prince,means,btn){{
  gs.transport[prince]=gs.transport[prince]||{{}};gs.transport[prince].means=means;
  document.querySelectorAll('#means-'+prince+' .means-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const caps={{jinput:1,cart:2,boat:4}};
  const eta={{weapon:{{jinput:4,cart:4,boat:3}},siege:{{jinput:5,cart:5}}}};
  const cap=caps[means]||1,t=((eta[prince]||{{}})[means])||5;
  const ti=document.getElementById('tinfo-'+prince);if(ti)ti.textContent=btn.textContent+' 積載'+cap+'荷　到着予定 '+t+'T後';
  const go=document.getElementById('go-'+prince);if(go)go.disabled=false;
}}
function changeQty(prince,item,delta){{
  const key=prince+'_'+item;
  // 輸送フェーズでは完成品在庫（inProdは含まない）
  const avail=item==='sword'?gs.stock.sword:item==='siege_w'?gs.stock.siege_w:gs.inv.food;
  qtys[key]=Math.max(0,Math.min(avail,(qtys[key]||0)+delta));
  const el=document.getElementById('qty-'+prince+'-'+item);if(el)el.textContent=qtys[key];
}}
function goTransport(prince){{
  gs.transport[prince]=gs.transport[prince]||{{}};gs.transport[prince].done=true;
  const btn=document.getElementById('go-'+prince);
  if(btn){{btn.textContent='✓ 出発済み';btn.className='go-btn done-btn';btn.disabled=true;}}
  showToast(PNAMES[prince]+'への輸送を出発させました');
}}
function updateStockBar(){{
  const set=(id,v)=>{{const e=document.getElementById(id);if(e)e.textContent=v;}};
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
}}

// ── 出立システム ──
function getAvailForPrep(key){{
  const q=CFG.prep_quests[key];
  if(q.item==='food')return gs.inv.food;
  if(q.item==='sword')return gs.stock.sword;
  if(q.item==='siege_w')return gs.stock.siege_w;
  return 0;
}}
function changePrepQty(key,delta){{
  if(gs.prepDone[key])return;
  const q=CFG.prep_quests[key];
  const avail=getAvailForPrep(key);
  const nv=Math.max(0,Math.min(Math.min(avail,q.qty),(gs.prepQty[key]||0)+delta));
  gs.prepQty[key]=nv;
  const el=document.getElementById('prep-qty-'+key);if(el)el.textContent=nv;
  const btn=document.getElementById('hand-btn-'+key);if(btn)btn.disabled=(nv===0);
  const si=document.getElementById('prep-stock-'+key);
  if(si)si.innerHTML=`現庫: <b>${{avail}}</b>　必要: ${{q.qty}}　選択: <b>${{nv}}</b>`;
}}
function handDeliver(key){{
  if(gs.prepDone[key])return;
  const q=CFG.prep_quests[key];
  const qty=gs.prepQty[key]||0;if(qty<=0)return;
  if(q.item==='food')gs.inv.food-=qty;
  else if(q.item==='sword')gs.stock.sword-=qty;
  else if(q.item==='siege_w')gs.stock.siege_w-=qty;
  const trustGain=qty>=q.qty?q.trust_reward:Math.floor(q.trust_reward*qty/q.qty);
  gs.trust[key]=Math.min(100,gs.trust[key]+trustGain);
  if(qty>=q.qty){{
    gs.prepDone[key]=true;
    const pi=document.getElementById('prep-info-'+key);if(pi)pi.textContent='✓ 準備依頼を完了しました！';
    const hb=document.getElementById('hand-btn-'+key);if(hb){{hb.textContent='✓ 手渡し済み';hb.className='hand-btn done';hb.disabled=true;}}
  }}
  showToast(PNAMES[key]+'への手渡し（信頼度 +'+trustGain+'）');
  updateHeaderDisplay();updateStockBar();updatePrinceBar();checkSortieConditions();updateTabLabels();
}}
function checkSortieConditions(){{
  PKEYS.forEach(key=>{{
    if(gs.sortied[key])return;
    const canSortie=gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold;
    const area=document.getElementById('sortie-area-'+key);
    const btn=document.getElementById('sortie-btn-'+key);
    if(!area||!btn)return;
    area.style.display=canSortie?'block':'none';
    btn.style.display=(canSortie&&!gs.sortieDoneThisTurn)?'block':'none';
  }});
}}
function sortie(key){{
  if(gs.sortieDoneThisTurn){{showToast('このターンはすでに出立させています');return;}}
  if(!gs.prepDone[key]||gs.trust[key]<CFG.sortie_trust_threshold)return;
  gs.sortied[key]=true;gs.sortieDoneThisTurn=true;
  const btn=document.getElementById('sortie-btn-'+key);if(btn)btn.style.display='none';
  const done=document.getElementById('sortie-done-'+key);if(done)done.style.display='block';
  PKEYS.forEach(k=>{{if(k!==key){{const b=document.getElementById('sortie-btn-'+k);if(b)b.style.display='none';}}}});
  document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(el=>el.style.display='');
  showToast('⚑ '+PNAMES[key]+'が出立！マップに登場');
  updatePrinceBar();updateTabLabels();
}}

// ── フェーズ遷移 ──
function goToMgmt(){{closeOverlay();setPhase('management');}}
function goToTransport(){{
  // 生産指示を確定し素材を消費（完成品には入れない）
  gs.inv.iron-=gs.prod.sword;
  gs.inv.wood-=gs.prod.siege_w*2;
  gs.inv.herb-=gs.prod.med;
  gs.inProd.sword+=gs.prod.sword;
  gs.inProd.siege_w+=gs.prod.siege_w;
  gs.inProd.med+=gs.prod.med;
  updateHeaderDisplay();setPhase('transport');
}}
function goToResult(){{
  // 結果フェーズで生産完了 → 完成品在庫へ
  gs.stock.sword+=gs.inProd.sword;
  gs.stock.siege_w+=gs.inProd.siege_w;
  gs.stock.med+=gs.inProd.med;
  gs.inProd={{sword:0,siege_w:0,med:0}};
  setPhase('result');
}}
function goToNextTurn(){{
  gs.turn++;gs.season=(gs.season+1)%4;if(gs.season===0)gs.year++;
  gs.choices={{}};
  gs.prod={{sword:0,siege_w:0,med:0}};
  gs.transport={{}};
  gs.prepQty={{food:0,horse:0,siege:0,weapon:0}};
  gs.sortieDoneThisTurn=false;
  gs.kengen={{shingen:null,kenjou:null}};
  // UIリセット
  ['sword','siege_w','med'].forEach(k=>{{const e=document.getElementById('prod-'+k);if(e)e.textContent=0;}});
  ['prod-smith-used','prod-pharm-used','prod-iron-cost','prod-wood-cost','prod-herb-cost'].forEach(id=>{{const e=document.getElementById(id);if(e)e.textContent=0;}});
  document.querySelectorAll('.kg-opt').forEach(b=>b.classList.remove('chosen'));
  const kr=document.getElementById('kg-result');if(kr)kr.textContent='';
  [0,1,2,3].forEach(i=>{{const d=document.getElementById('lp-'+i);if(d)d.classList.remove('done');}});
  const set=(id,v)=>{{const e=document.getElementById(id);if(e)e.textContent=v;}};
  set('turn-num',gs.turn);set('season-txt',SEASONS[gs.season]);
  Object.keys(qtys).forEach(k=>delete qtys[k]);
  showToast('T'+gs.turn+'・'+SEASONS[gs.season]+'開始');
  updatePrinceBar();updateInvDisplay();updateTabLabels();
  autoSave();
  setPhase('letter');openLetterOverlay();
}}

// ── 結果画面 ──
function buildResultScreen(){{
  // メインログ
  const log=document.getElementById('result-log');
  if(log){{
    const lines=[];
    lines.push({{t:'── T'+gs.turn+' '+SEASONS[gs.season]+' 終了 ──',c:'log-accent'}});
    if(gs.sortieDoneThisTurn){{
      const k=PKEYS.find(k=>gs.sortied[k]);
      if(k)lines.push({{t:'⚑ '+PNAMES[k]+'が出立し、マップに登場',c:'log-accent'}});
    }}
    const nextSeason=SEASONS[(gs.season+1)%4];
    lines.push({{t:'次ターン：T'+(gs.turn+1)+'・'+nextSeason+'へ',c:'log-info'}});
    log.innerHTML='';
    lines.forEach((l,i)=>{{
      const d=document.createElement('div');d.className='log-line '+l.c;d.textContent=l.t;
      log.appendChild(d);setTimeout(()=>d.classList.add('show'),i*180);
    }});
  }}
  // 生産結果（今T生産指示 → inProdに移動済み）
  const prod=document.getElementById('result-prod');
  if(prod){{
    let html='';
    if(gs.stock.sword>0||gs.stock.siege_w>0||gs.stock.med>0){{
      html+=`<div style="color:var(--green)">✓ 完成品在庫：剣${{gs.stock.sword}}・衝車${{gs.stock.siege_w}}・回復薬${{gs.stock.med}}</div>`;
    }}
    if(gs.inProd.sword>0)  html+=`<div>⚒ 剣★1 ×${{gs.inProd.sword}}　生産中（来T完成）</div>`;
    if(gs.inProd.siege_w>0)html+=`<div>⚒ 衝車★1 ×${{gs.inProd.siege_w}}　生産中（来T完成）</div>`;
    if(gs.inProd.med>0)    html+=`<div>🧪 回復薬★1 ×${{gs.inProd.med}}　生産中（来T完成）</div>`;
    prod.innerHTML=html||'<span style="color:var(--faded)">（生産指示なし）</span>';
  }}
  // 輸送結果
  const trans=document.getElementById('result-trans');
  if(trans){{
    let html='';
    PKEYS.forEach(key=>{{
      if(gs.transport[key]&&gs.transport[key].done)html+=`<div>🚚 ${{PNAMES[key]}}（${{PDIRS[key]}}）へ輸送を出発</div>`;
    }});
    PKEYS.forEach(key=>{{
      if(gs.prepDone[key])html+=`<div style="color:var(--green)">📦 ${{PNAMES[key]}}へ準備品を手渡し済み</div>`;
    }});
    trans.innerHTML=html||'<span style="color:var(--faded)">（輸送なし）</span>';
  }}
  // 謁見結果
  const kng=document.getElementById('result-kengen');
  if(kng){{
    const labels={{iron:'鉄増産',wood:'木材増産',food_mat:'兵糧増産',horse_find:'名馬探索',commend:'王子を褒める',
      potion:'回復薬を献上',gold100:'100両を献上',gold300:'300両を献上'}};
    let html='';
    if(gs.kengen.shingen)html+=`<div>📜 進言：<b>${{labels[gs.kengen.shingen]||gs.kengen.shingen}}</b>　→ 次ターンより有効</div>`;
    if(gs.kengen.kenjou) html+=`<div>🎁 献上：<b>${{labels[gs.kengen.kenjou]||gs.kengen.kenjou}}</b>　→ 次ターンより有効</div>`;
    kng.innerHTML=html||'<span style="color:var(--faded)">（謁見なし）</span>';
  }}
  // 信頼度
  const tlog=document.getElementById('trust-log');
  if(tlog){{
    let html='<table style="width:100%;font-size:12px;border-collapse:collapse">';
    PKEYS.forEach(key=>{{
      const t=gs.trust[key];
      const pct=Math.min(100,t);
      const status=gs.sortied[key]?'出立済み':gs.prepDone[key]&&t>=CFG.sortie_trust_threshold?'出立可能':gs.prepDone[key]?'準備完了':'準備中';
      const sc=gs.sortied[key]?'var(--green)':gs.prepDone[key]&&t>=CFG.sortie_trust_threshold?'var(--gold)':'var(--faded)';
      html+=`<tr style="border-bottom:1px dashed var(--dim)">
        <td style="padding:4px 0;font-family:'Noto Serif JP',serif;color:${{PCOLORS[key]}}">${{PNAMES[key]}}</td>
        <td>信頼度 <b>${{t}}</b>/100
          <span class="trust-bar-wrap"><span class="trust-bar-fill" style="width:${{pct}}%"></span></span></td>
        <td style="color:${{sc}};font-size:11px">${{status}}</td>
      </tr>`;
    }});
    html+='</table>';
    tlog.innerHTML=html;
  }}
  // 次ターンボタン
  const nb=document.getElementById('next-turn-btn');
  if(nb)nb.textContent='T'+(gs.turn+1)+'・'+SEASONS[(gs.season+1)%4]+'へ進む ▶';
}}

// ── 上部バー ──
function updatePrinceBar(){{
  PKEYS.forEach(key=>{{
    const req=document.getElementById('pc-req-'+key);
    const sub=document.getElementById('pc-sub-'+key);
    const dlEl=document.getElementById('pc-dl-'+key);
    if(!req)return;
    const t=gs.trust[key];
    const q=CFG.prep_quests[key];
    if(gs.sortied[key]){{
      req.textContent='出立済み・輸送中';
      if(sub)sub.textContent='ノード1・依頼受付中';
      const ord=CFG.orders[key];
      if(dlEl&&ord){{
        const urg=ord.deadline<=6?'urg':'';
        dlEl.innerHTML=`<div class="pc-dl-badge ${{urg}}">納期<br><b>${{ord.deadline}}</b>T</div>`;
      }}
    }}else if(gs.prepDone[key]){{
      req.textContent='準備完了　信頼度'+t+'/100';
      if(sub)sub.textContent=t>=CFG.sortie_trust_threshold?'出立可能！':'あと'+(CFG.sortie_trust_threshold-t)+'で出立可';
      if(dlEl)dlEl.innerHTML='';
    }}else{{
      req.textContent='準備：'+q.label+'×'+q.qty;
      if(sub)sub.textContent='信頼度'+t+'/100';
      if(dlEl)dlEl.innerHTML='';
    }}
  }});
}}

// ── 輸送UI更新 ──
function updateTransportUI(){{
  PKEYS.forEach(key=>{{
    const pp=document.getElementById('prep-panel-'+key);
    const nt=document.getElementById('normal-trans-'+key);
    const sa=document.getElementById('sortie-area-'+key);
    if(gs.sortied[key]){{
      if(pp)pp.style.display='none';if(sa)sa.style.display='none';if(nt)nt.style.display='block';
    }}else{{
      if(pp)pp.style.display='block';if(nt)nt.style.display='none';
      if(sa)sa.style.display=gs.prepDone[key]&&gs.trust[key]>=CFG.sortie_trust_threshold?'block':'none';
    }}
    const hb=document.getElementById('hand-btn-'+key);
    if(hb&&gs.prepDone[key]){{hb.textContent='✓ 手渡し済み';hb.className='hand-btn done';hb.disabled=true;}}
    const si=document.getElementById('prep-stock-'+key);
    if(si&&!gs.prepDone[key]){{const q=CFG.prep_quests[key];si.innerHTML=`現庫: <b>${{getAvailForPrep(key)}}</b>　必要: ${{q.qty}}`;}}
    const qel=document.getElementById('prep-qty-'+key);if(qel)qel.textContent=0;
    checkSortieConditions();
  }});
}}

// ── マップ ──
function showMapCard(key){{
  const card=document.getElementById('map-card');
  document.getElementById('mc-title').textContent=PNAMES[key]+'（'+PDIRS[key]+'）';
  document.getElementById('mc-title').style.color=PCOLORS[key];
  const t=gs.trust[key];
  document.getElementById('mc-body').innerHTML=
    (gs.sortied[key]?'<b>出立済み</b>・ノード1<br>':'<b>出立前</b>・準備中<br>')+
    `信頼度：${{t}}/100`;
  card.classList.add('on');
}}
function toggleConvoy(el){{
  const isOpen=el.classList.contains('open');
  document.querySelectorAll('.convoy-wrap').forEach(c=>c.classList.remove('open'));
  if(!isOpen)el.classList.add('open');
}}

// ── 共通 ──
function updateHeaderDisplay(){{
  const set=(id,v)=>{{const e=document.getElementById(id);if(e)e.textContent=v;}};
  set('h-gold',gs.gold);set('h-iron',gs.inv.iron);set('h-wood',gs.inv.wood);
  set('h-niter',gs.inv.niter);set('h-herb',gs.inv.herb);set('h-food',gs.inv.food);
}}
function updateInvDisplay(){{
  const set=(id,v)=>{{const e=document.getElementById(id);if(e)e.textContent=v;}};
  set('inv-iron',gs.inv.iron);set('inv-wood',gs.inv.wood);set('inv-niter',gs.inv.niter);
  set('inv-herb',gs.inv.herb);set('inv-food',gs.inv.food);set('inv-med',gs.stock.med);
  set('stk-sword',gs.stock.sword);set('stk-siege_w',gs.stock.siege_w);set('stk-med',gs.stock.med);
  set('inp-sword',gs.inProd.sword);set('inp-siege_w',gs.inProd.siege_w);set('inp-med',gs.inProd.med);
}}
let toastTm;
function showToast(msg){{
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('on');
  clearTimeout(toastTm);toastTm=setTimeout(()=>t.classList.remove('on'),2200);
}}

// ── セーブ／ロード（localStorage） ──
const SAVE_VERSION=1;
const SAVE_SLOTS=[1,2,3];
const SAVE_AUTO_KEY='mou_isso_auto';
let saveModalMode='save';

function slotKey(n){{return 'mou_isso_slot'+n;}}
function deepClone(o){{return JSON.parse(JSON.stringify(o));}}
function buildSavePayload(label){{
  return {{
    version:SAVE_VERSION,
    savedAt:new Date().toISOString(),
    label:label||'',
    gs:deepClone(gs),
    qtys:deepClone(qtys),
  }};
}}
function readSlot(key){{
  try{{
    const raw=localStorage.getItem(key);
    if(!raw)return null;
    const data=JSON.parse(raw);
    if(!data||typeof data!=='object'||!data.gs)return null;
    return data;
  }}catch(e){{return null;}}
}}
function writeSlot(key,data){{
  try{{
    localStorage.setItem(key,JSON.stringify(data));
    return true;
  }}catch(e){{
    showToast('セーブに失敗しました（容量不足など）');
    return false;
  }}
}}
function formatSaveMeta(data){{
  if(!data||!data.gs)return '';
  const g=data.gs;
  const season=SEASONS[g.season]||'?';
  const sortied=PKEYS.filter(k=>g.sortied&&g.sortied[k]).length;
  const when=data.savedAt?new Date(data.savedAt).toLocaleString('ja-JP'):'日時不明';
  return when+'\\nT'+g.turn+'・'+season+'　金'+g.gold+'両　出立'+sortied+'/4　phase:'+(g.phase||'?');
}}
function openSaveModal(mode){{
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
}}
function closeSaveModal(){{
  const ov=document.getElementById('save-overlay');
  if(ov)ov.classList.remove('on');
  hideImportArea();
}}
function renderSaveSlots(){{
  const list=document.getElementById('save-slot-list');
  if(!list)return;
  let html='';
  const entries=[];
  SAVE_SLOTS.forEach(n=>entries.push({{key:slotKey(n),title:'スロット '+n,n}}));
  if(saveModalMode==='load')entries.push({{key:SAVE_AUTO_KEY,title:'自動セーブ',n:null}});
  entries.forEach(ent=>{{
    const data=readSlot(ent.key);
    const empty=!data;
    const meta=empty?'':formatSaveMeta(data);
    if(saveModalMode==='save'&&ent.n!=null){{
      html+=`<button type="button" class="save-slot${{empty?' empty':''}}" onclick="saveToSlot(${{ent.n}})">
        <div class="save-slot-title">${{ent.title}}</div>
        ${{empty?'<div class="save-slot-empty">（空き）</div>':'<div class="save-slot-meta">'+meta.replace(/\\n/g,'<br>')+'</div>'}}
      </button>`;
    }}else if(saveModalMode==='load'){{
      if(empty){{
        html+=`<button type="button" class="save-slot empty" disabled style="cursor:default;opacity:.5">
          <div class="save-slot-title">${{ent.title}}</div>
          <div class="save-slot-empty">（データなし）</div>
        </button>`;
      }}else{{
        html+=`<button type="button" class="save-slot" onclick="loadFromSlot('${{ent.key}}')">
          <div class="save-slot-title">${{ent.title}}</div>
          <div class="save-slot-meta">${{meta.replace(/\\n/g,'<br>')}}</div>
        </button>`;
      }}
    }}
  }});
  list.innerHTML=html;
}}
function saveToSlot(n){{
  const key=slotKey(n);
  const existing=readSlot(key);
  if(existing&&!confirm('スロット '+n+' に上書きセーブしますか？'))return;
  const payload=buildSavePayload('Slot '+n);
  if(writeSlot(key,payload)){{
    showToast('スロット '+n+' にセーブしました');
    closeSaveModal();
  }}
}}
function autoSave(){{
  const payload=buildSavePayload('auto');
  writeSlot(SAVE_AUTO_KEY,payload);
}}
function loadFromSlot(key){{
  const data=readSlot(key);
  if(!data){{showToast('セーブデータがありません');return;}}
  if(!confirm('このデータをロードしますか？\\nいまの進行は失われます。'))return;
  applySaveData(data);
  closeSaveModal();
  showToast('ロードしました（T'+gs.turn+'・'+(SEASONS[gs.season]||'')+'）');
}}
function applySaveData(data){{
  if(!data||!data.gs){{showToast('セーブデータが読み取れません');return false;}}
  const loaded=deepClone(data.gs);
  Object.keys(gs).forEach(k=>delete gs[k]);
  Object.assign(gs,loaded);
  // 欠落フィールドの補完
  gs.inv=gs.inv||{{iron:0,wood:0,niter:0,herb:0,food:0}};
  gs.stock=gs.stock||{{sword:0,siege_w:0,med:0}};
  gs.inProd=gs.inProd||{{sword:0,siege_w:0,med:0}};
  gs.prod=gs.prod||{{sword:0,siege_w:0,med:0}};
  gs.buy=gs.buy||{{}};
  gs.sellQ=gs.sellQ||{{}};
  gs.transport=gs.transport||{{}};
  gs.choices=gs.choices||{{}};
  gs.kengen=gs.kengen||{{shingen:null,kenjou:null}};
  gs.trust=gs.trust||{{food:0,horse:0,siege:0,weapon:0}};
  gs.prepDone=gs.prepDone||{{food:false,horse:false,siege:false,weapon:false}};
  gs.sortied=gs.sortied||{{food:false,horse:false,siege:false,weapon:false}};
  gs.prepQty=gs.prepQty||{{food:0,horse:0,siege:0,weapon:0}};
  if(gs.sortieDoneThisTurn===undefined)gs.sortieDoneThisTurn=false;
  if(!gs.phase)gs.phase='letter';
  Object.keys(qtys).forEach(k=>delete qtys[k]);
  Object.assign(qtys,deepClone(data.qtys||{{}}));
  refreshAllUIFromGs();
  return true;
}}
function refreshAllUIFromGs(){{
  const set=(id,v)=>{{const e=document.getElementById(id);if(e)e.textContent=v;}};
  set('turn-num',gs.turn);set('season-txt',SEASONS[gs.season]||'');
  // マップ駒
  PKEYS.forEach(key=>{{
    document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(el=>{{
      el.style.display=gs.sortied[key]?'':'none';
    }});
  }});
  // 生産指示UI
  ['sword','siege_w','med'].forEach(k=>set('prod-'+k,gs.prod[k]||0));
  set('prod-smith-used',(gs.prod.sword||0)+(gs.prod.siege_w||0));
  set('prod-pharm-used',gs.prod.med||0);
  set('prod-iron-cost',gs.prod.sword||0);
  set('prod-wood-cost',(gs.prod.siege_w||0)*2);
  set('prod-herb-cost',gs.prod.med||0);
  // 売買UI
  Object.keys(CFG.prices||{{}}).forEach(r=>{{
    set('buy-'+r,gs.buy[r]||0);
    set('sell-'+r,gs.sellQ[r]||0);
  }});
  updateTradeTotals();
  // 謁見UI
  document.querySelectorAll('.kg-opt').forEach(b=>b.classList.remove('chosen'));
  const kgSel=document.getElementById('kg-commend-sel');
  if(kgSel)kgSel.classList.remove('show');
  ['shingen','kenjou'].forEach(type=>{{
    const val=gs.kengen[type];
    if(!val)return;
    const box=document.getElementById('kg-'+type);
    if(!box)return;
    box.querySelectorAll('.kg-opt').forEach(btn=>{{
      const m=btn.getAttribute('onclick')||'';
      if(m.indexOf("'"+val+"'")>=0||m.indexOf('"'+val+'"')>=0)btn.classList.add('chosen');
    }});
    if(type==='shingen'&&val==='commend'&&kgSel)kgSel.classList.add('show');
  }});
  const labels={{iron:'鉄増産',wood:'木材増産',food_mat:'兵糧増産',horse_find:'名馬探索',commend:'王子を褒める',
    potion:'回復薬を献上',gold100:'100両を献上',gold300:'300両を献上'}};
  const kr=document.getElementById('kg-result');
  if(kr)kr.textContent=
    (gs.kengen.shingen?'進言：'+(labels[gs.kengen.shingen]||gs.kengen.shingen)+'　':'')+
    (gs.kengen.kenjou?'献上：'+(labels[gs.kengen.kenjou]||gs.kengen.kenjou):'');
  // 手紙進捗ドット
  const dotMap={{food:0,horse:1,siege:2,weapon:3}};
  PKEYS.forEach(key=>{{
    const d=document.getElementById('lp-'+dotMap[key]);
    if(d)d.classList.toggle('done',gs.choices[key]!==undefined);
  }});
  // 輸送数量UI
  Object.keys(qtys).forEach(k=>{{
    const parts=k.split('_');
    if(parts.length<2)return;
    const prince=parts[0];
    const item=parts.slice(1).join('_');
    const el=document.getElementById('qty-'+prince+'-'+item);
    if(el)el.textContent=qtys[k]||0;
  }});
  // 輸送 Go / means / 準備
  PKEYS.forEach(key=>{{
    const t=gs.transport[key];
    const meansRow=document.getElementById('means-'+key);
    if(meansRow){{
      meansRow.querySelectorAll('.means-btn').forEach(b=>{{
        b.classList.remove('active');
        if(t&&t.means){{
          const m=b.getAttribute('onclick')||'';
          if(m.indexOf("'"+t.means+"'")>=0)b.classList.add('active');
        }}
      }});
    }}
    const go=document.getElementById('go-'+key);
    if(go){{
      if(t&&t.done){{
        go.textContent='✓ 出発済み';go.className='go-btn done-btn';go.disabled=true;
      }}else{{
        go.textContent='Go → 出発';go.className='go-btn';go.disabled=!(t&&t.means);
      }}
    }}
    const pqty=gs.prepQty[key]||0;
    const pqEl=document.getElementById('prep-qty-'+key);
    if(pqEl)pqEl.textContent=pqty;
    const hb=document.getElementById('hand-btn-'+key);
    const pi=document.getElementById('prep-info-'+key);
    if(gs.prepDone[key]){{
      if(hb){{hb.textContent='✓ 手渡し済み';hb.className='hand-btn done';hb.disabled=true;}}
      if(pi)pi.textContent='✓ 準備依頼を完了しました！';
    }}else{{
      if(hb){{hb.textContent='手渡しする';hb.className='hand-btn';hb.disabled=(pqty===0);}}
      if(pi){{
        const q=CFG.prep_quests[key];
        pi.textContent='準備品を手渡すと信頼度が上がります（+'+q.trust_reward+'）';
      }}
    }}
    const sa=document.getElementById('sortie-area-'+key);
    const sbtn=document.getElementById('sortie-btn-'+key);
    const sdone=document.getElementById('sortie-done-'+key);
    if(gs.sortied[key]){{
      if(sa)sa.style.display='block';
      if(sbtn)sbtn.style.display='none';
      if(sdone)sdone.style.display='block';
    }}else{{
      if(sdone)sdone.style.display='none';
    }}
  }});
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
}}
async function exportSave(){{
  const payload=buildSavePayload('export');
  const text=JSON.stringify(payload,null,2);
  try{{
    if(navigator.clipboard&&navigator.clipboard.writeText){{
      await navigator.clipboard.writeText(text);
      showToast('セーブデータをコピーしました');
      return;
    }}
  }}catch(e){{}}
  showImportArea();
  const ta=document.getElementById('save-import-ta');
  if(ta){{ta.value=text;ta.select();}}
  showToast('コピーできなかったので下に表示しました');
}}
function showImportArea(){{
  const a=document.getElementById('save-import-area');
  if(a)a.classList.add('show');
  const ta=document.getElementById('save-import-ta');
  if(ta&&saveModalMode==='load')ta.value='';
}}
function hideImportArea(){{
  const a=document.getElementById('save-import-area');
  if(a)a.classList.remove('show');
}}
function importSave(){{
  const ta=document.getElementById('save-import-ta');
  if(!ta)return;
  let data;
  try{{data=JSON.parse(ta.value.trim());}}
  catch(e){{showToast('貼り付けたデータが読み取れません');return;}}
  if(!data||!data.gs){{showToast('セーブデータとして使えません');return;}}
  if(!confirm('貼り付けたデータで復元しますか？'))return;
  if(applySaveData(data)){{
    closeSaveModal();
    showToast('データを読み込んでロードしました');
  }}
}}

document.addEventListener('DOMContentLoaded',()=>{{
  document.querySelectorAll('.node').forEach(n=>n.addEventListener('click',()=>showMapCard(n.dataset.route)));
  document.querySelectorAll('.piece').forEach(p=>p.addEventListener('click',()=>showMapCard(p.dataset.route)));
  document.querySelectorAll('.sc').forEach(c=>c.addEventListener('click',()=>showMapCard(c.dataset.route)));
  document.querySelectorAll('.ship').forEach(s=>s.addEventListener('click',()=>{{
    document.getElementById('mc-title').textContent='水路（船）';
    document.getElementById('mc-title').style.color='#3f7d9e';
    document.getElementById('mc-body').innerHTML='⚓ 河港間を短縮輸送';
    document.getElementById('map-card').classList.add('on');
  }}));
  document.getElementById('mc-close').addEventListener('click',()=>document.getElementById('map-card').classList.remove('on'));
  PKEYS.forEach(key=>{{
    if(!gs.sortied[key])
      document.querySelectorAll('.piece[data-route="'+key+'"]').forEach(el=>el.style.display='none');
  }});
  updateHeaderDisplay();setPhase('letter');openLetterOverlay();
}});
"""

# 組み立て
PRINCE_BAR=build_prince_bar()
TAB5=build_5tab_bar()
LETTER_SHELLS=build_letter_shells()
TRANS_TAB_BTNS=build_trans_tab_btns()
TRANS_CONTENTS=''.join(build_trans_content(p) for p in PRINCES)
MGMT_HTML=build_mgmt()

TRANSPORT_HTML=f"""<div id="sec-transport" style="display:none">
<div class="stock-bar">
  <span class="sb-title">完成品在庫</span>
  <span class="sb-item">剣：<b id="tr-stk-sword">2</b><span class="inprod-badge">生産中<span id="tr-inp-sword">0</span></span></span>
  <span class="sb-item">衝車：<b id="tr-stk-siege_w">0</b><span class="inprod-badge">生産中<span id="tr-inp-siege_w">0</span></span></span>
  <span class="sb-item">回復薬：<b id="tr-stk-med">0</b><span class="inprod-badge">生産中<span id="tr-inp-med">0</span></span></span>
  <span class="sb-item">兵糧：<b id="tr-stk-food">8</b></span>
  <span style="font-size:10px;color:var(--faded);margin-left:auto">生産中→来T完成</span>
</div>
<div class="tab-bar-5" style="border-bottom:3px solid var(--ink)">{TRANS_TAB_BTNS}</div>
{TRANS_CONTENTS}
<div class="ph-actions">
<button class="ph-complete" onclick="goToResult()">フェーズ完了 ▶ ターン終了</button>
<button type="button" class="ph-save-btn" onclick="openSaveModal('save')">💾 セーブ</button>
<button type="button" class="ph-save-btn" onclick="openSaveModal('load')">📂 ロード</button>
</div>
</div>"""

RESULT_HTML="""<div id="sec-result" style="display:none">
<div class="result-panel">
  <div class="result-section"><div class="result-section-head">📜 このターンの出来事</div>
    <div class="result-section-body"><div class="result-log" id="result-log"></div></div></div>
  <div class="result-section"><div class="result-section-head">⚒ 生産（工房・薬房）</div>
    <div class="result-section-body" id="result-prod"></div></div>
  <div class="result-section"><div class="result-section-head">🚚 輸送</div>
    <div class="result-section-body" id="result-trans"></div></div>
  <div class="result-section"><div class="result-section-head">🏯 謁見の結果</div>
    <div class="result-section-body" id="result-kengen"></div></div>
  <div class="result-section"><div class="result-section-head">👑 王子との信頼度</div>
    <div class="result-section-body" id="trust-log"></div></div>
  <div class="ph-actions">
    <button class="ph-complete" id="next-turn-btn" onclick="goToNextTurn()">次のターンへ ▶</button>
    <button type="button" class="ph-save-btn" onclick="openSaveModal('save')">💾 セーブ</button>
    <button type="button" class="ph-save-btn" onclick="openSaveModal('load')">📂 ロード</button>
  </div>
</div>
</div>"""

# デモ用の荷車・人足アイコンは非表示（輸送システム実装時に動的生成する）
CONVOYS=""

HTML=f"""<!DOCTYPE html>
<html lang="ja"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>もういっそ敗けてくれ v0.6</title>
<style>{CSS}</style>
</head><body>
<div id="hdr">
  <div class="title-sm">もういっそ敗けてくれ</div>
  <div class="pills">
    <div class="pill">金：<b id="h-gold">1000</b>両</div>
    <div class="pill">鉄：<b id="h-iron">5</b></div>
    <div class="pill">木：<b id="h-wood">5</b></div>
    <div class="pill">硝：<b id="h-niter">0</b></div>
    <div class="pill">草：<b id="h-herb">4</b></div>
    <div class="pill">糧：<b id="h-food">8</b></div>
  </div>
  <div id="turn-badge">T<span id="turn-num">1</span>・<span id="season-txt">春</span></div>
  <span class="phase-badge" id="phase-badge">手紙</span>
</div>
<div id="app">
<div id="prince-bar">{PRINCE_BAR}</div>
<div id="map-wrap">
{MAP_SVG}
{CONVOYS}
  <div id="map-card"><button id="mc-close">✕</button><h3 id="mc-title"></h3><p id="mc-body"></p></div>
</div>
<div class="step-bar">
  <div class="step active">手紙</div><div class="step">経営</div>
  <div class="step">輸送</div><div class="step">結果</div>
</div>
<div id="cmd-bar">
  <button class="cmd-btn active" id="cmd-letter" onclick="openLetterOverlay()">
    <div class="cmd-ph">✉</div><span>手紙</span></button>
  <button class="cmd-btn disabled" id="cmd-market" onclick="cmdClick('market')">
    <img src="{I['bld_market']}" alt=""><span>市場</span></button>
  <button class="cmd-btn disabled" id="cmd-smith" onclick="cmdClick('smith')">
    <img src="{I['bld_smith']}" alt=""><span>工房</span></button>
  <button class="cmd-btn disabled" id="cmd-ranch" onclick="cmdClick('ranch')">
    <img src="{I['bld_ranch']}" alt=""><span>牧場</span></button>
  <button class="cmd-btn disabled" id="cmd-pharmacy" onclick="cmdClick('pharmacy')">
    <img src="{I['bld_pharmacy']}" alt=""><span>薬房</span></button>
  <button class="cmd-btn disabled" id="cmd-transport" onclick="setPhase('transport')">
    <div class="cmd-ph">🚚</div><span>輸送</span></button>
</div>
<div id="phase-panel">
{MGMT_HTML}
{TRANSPORT_HTML}
{RESULT_HTML}
</div>
</div>
<div id="overlay">
<div id="ov-inner">
  <div class="lp-bar">
    <div class="lp-item"><div class="lp-dot" id="lp-0"></div><span>兵糧太</span></div>
    <div class="lp-item"><div class="lp-dot" id="lp-1"></div><span>騎馬次</span></div>
    <div class="lp-item"><div class="lp-dot" id="lp-2"></div><span>攻三城</span></div>
    <div class="lp-item"><div class="lp-dot" id="lp-3"></div><span>武刃四</span></div>
    <span style="margin-left:auto;font-size:10px;color:var(--faded)">全員の返事を選ぶと次へ</span>
  </div>
  {TAB5}
  {LETTER_SHELLS}
  <div class="ph-actions">
    <button class="ph-complete" id="ph-letter-complete" disabled onclick="goToMgmt()">フェーズ完了 ▶ 経営フェーズへ</button>
    <button type="button" class="ph-save-btn" onclick="openSaveModal('save')">💾 セーブ</button>
    <button type="button" class="ph-save-btn" onclick="openSaveModal('load')">📂 ロード</button>
  </div>
</div>
</div>
<div id="save-overlay" onclick="if(event.target===this)closeSaveModal()">
  <div class="save-modal" role="dialog" aria-modal="true">
    <div class="save-modal-head">
      <span id="save-modal-title">セーブ</span>
      <button type="button" class="save-modal-close" onclick="closeSaveModal()" aria-label="閉じる">✕</button>
    </div>
    <div class="save-modal-body">
      <div class="save-mode-note" id="save-mode-note"></div>
      <div id="save-slot-list"></div>
      <div class="save-extra">
        <button type="button" onclick="exportSave()">データをコピー</button>
        <button type="button" onclick="showImportArea()">データを貼り付け</button>
      </div>
      <div id="save-import-area">
        <textarea id="save-import-ta" placeholder="セーブデータをここに貼り付け…"></textarea>
        <div class="save-import-actions">
          <button type="button" class="btn-import-ok" onclick="importSave()">読み込む</button>
          <button type="button" class="btn-import-cancel" onclick="hideImportArea()">キャンセル</button>
        </div>
      </div>
    </div>
  </div>
</div>
<div id="toast"></div>
<script>{JS}</script>
</body></html>"""

out='/mnt/user-data/outputs/mou_isso_v0_6.html'
with open(out,'w',encoding='utf-8') as f:
    f.write(HTML)

import re
divs=len(re.findall(r'<div\b',HTML))
cdivs=len(re.findall(r'</div>',HTML))
print(f"Written: {len(HTML)//1024}KB  div:{divs}/{cdivs}  → {out}")
