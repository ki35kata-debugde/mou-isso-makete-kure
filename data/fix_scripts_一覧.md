# fix_*.js 適用状況一覧（監査結果）

`data/fix_*.js` は元々32本あったが、監査の結果**11本は「実行不可／危険／完全に無効化済み」**と判定され、
2026-07-14 に削除した。残り21本は**すでに適用済みで、その結果が現在のHTMLに焼き込まれている**
「実行済みパッチの記録」として保持している。

**このファイルの目的:** どれが適用済みで再実行不要か、どれが再実行すると危険かを一覧化し、
うっかり `node data/fix_xxx.js` を実行して壊さないようにするための参照表。

（調査日: 2026-07-13。削除: 2026-07-14。`mou_isso_v0_6_1.html` の末尾にある
`console.log('[xxx] ready')` マーカーと各スクリプトの中身を突き合わせて判定）

## 見方

- **現状**: そのスクリプトの効果が今のHTMLに入っているか
- **結論**: 「適用済み・再実行不要（安全）」→ 既に効果が入っており、再度実行してもガード処理で何も起きない

## 削除したファイル（11本）

| ファイル名 | 削除理由 |
|---|---|
| `fix_porters.js` | `C:/Users/kzawa/Downloads/Grok/mou_isso_v0_6.html` をハードコード。このフォルダでは実行不可。効果（人足最大4人）は現在のHTMLに既に別途実装済み（`gs.portersMax`まわり） |
| `fix_ui_layout.js` | 同上のハードコードパス＋対象ファイル(`mou_isso_v0_6.html`)自体が存在せず二重に実行不可 |
| `fix_breakthrough_timing.js` | 対象ファイルが存在せず実行不可。機能は `fix_node_advance_piece.js` / `fix_n2_advance_and_transport_ui.js` に置き換え済み |
| `fix_gameplay.js` | 対象ファイルが存在せず実行不可。しかも実行すると`game-data.js`/`letters.json`だけ先に書き換わる副作用があり危険 |
| `fix_layout_letter_v2.js` | 対象ファイルが存在せず実行不可。「手紙自動オープン」は現行の `forceLetterOpen()` がより強力に実装済み |
| `fix_letter_content.js` | 対象ファイルが存在せず実行不可。「空表示防止」は現行の `openLetterOverlay()`（1631行）が同期的にレンダリングしてから開くため、この問題は現在発生しないことを確認済み |
| `fix_letter_hints.js` | 対象ファイルが存在せず実行不可。「角枠ヒント」は後発の `applyYellowHints`（`[map+yellow] ready`パッチ）で同等以上に実装済み |
| `fix_letter_btn_visibility.js` | 対象ファイルが存在せず実行不可。効果（`id="ph-actions-letter"`）は既に現HTMLに存在（v0.6時代からの引き継ぎ） |
| `fix_phase_buttons.js` | 対象ファイルが存在せず実行不可。効果（`ph-actions-mgmt/trans/result` id、`showPhaseCompleteRows`）は既に現HTMLに存在 |
| `fix_ranch_list_dom.js` | 対象ファイルが存在せず実行不可。効果（`id="ranch-horse-list"`）は既に現HTMLに存在 |
| `fix_unlock_popup_and_horse_select.js` | 唯一「未適用」だったが、実行すると `goTransport`/`isMeansUnlocked`/`buildMeans` を旧ロジックで上書きし、適用済みの現行馬輸送システム(`fix_horse_prince_transport.js`等)を破壊する危険あり。なお「解禁ポップアップ」自体は`gs.pendingUnlocks`まわりとして既に別途実装済みで、このスクリプトなしでも機能している |

**手紙内容(表示・自動オープン・レンダリング)を入れ替える系の3本
（`fix_layout_letter_v2.js` / `fix_letter_content.js` / `fix_letter_hints.js`）について:**
狙っていた効果はすべて後発の実装（`forceLetterOpen`、同期レンダリング、`applyYellowHints`）に
置き換わって現役で動いていることを確認済みなので、**作り直しは不要**と判断した。もし実際に
「手紙が空で表示される」「手紙の中身が古いまま」等の症状が出ているなら、それは別の原因なので
具体的な症状を教えてほしい（このドキュメントの判断が現状と食い違っている可能性があるため）。

## 現存する21本（適用済み・記録として保持）

| ファイル名 | 内容(一言) | 現状 | 注意点 |
|---|---|---|---|
| fix_advice_cost_and_sell.js | 進言コスト(金300)・生産物/馬の市場売却解禁・MARKET_ECON同期 | 適用済み・再実行不要（安全） | 二重適用リスクなし |
| fix_crossbow_catapult.js | 弩★2・投石機★3の生産実装（レシピ・解禁条件・アイコン・市場売却） | 適用済み・再実行不要（安全・マーカーガードあり） | 2026-07-14追加。解禁: 弩=兵器or武器N1、投石機=兵器N2 |
| fix_mgmt_phase_popups.js | 進言効果適用時のポップアップキュー＋経営フェーズ入場時にも解禁ポップアップ表示 | 適用済み・再実行不要（安全） | 2026-07-14追加。従来は結果フェーズのみ表示だった |
| fix_letter_autotab_and_advice_cost.js | 手紙フェーズを新着皇子タブで自動起動（無ければ進言タブ）／進言費用を褒める300両・他150両に分離 | 適用済み・再実行不要（安全） | 2026-07-15追加 |
| fix_bedtime_polish.js | 冬季に兵糧+薬両方許可／馬手紙の準備依頼文を強制表示／輸送UI残留を強く隠す／仔馬1〜2頭化 | 適用済み・再実行不要（安全） | ガードあり |
| fix_crit_stack_letter.js | sanitizeInv無限再帰修正／inv-iron表示／馬の準備依頼文固定／NaN対策 | 適用済み・再実行不要（安全） | 自己修復ロジックあり |
| fix_eta_winter_tp_ui.js | ETA計算(masToNode)／冬季結果表示簡素化／輸送UI文言整理 | 適用済み・再実行不要（安全） | |
| fix_foal_popup_and_price_cap.js | 春の仔馬誕生ポップアップ／市場価格±25%上限 | 適用済み・再実行不要（安全） | ※価格計算は後日 seasonPriceDelta 方式に変更済み（本ファイルの役目の一部は上書き） |
| fix_horse_prince_transport.js | 馬王子は輸送手段なしで馬を選んで自走／他王子は「馬」廃止・馬車導入 | 適用済み・再実行不要（安全） | |
| fix_kengen_ui_and_stack.js | 進言UI効果表示・条件表示／goToMgmtスタックオーバーフロー対策 | 適用済み・再実行不要（安全） | |
| fix_letter_confirm_proceed.js | 手紙未返信で経営フェーズへ進む際に確認ダイアログ表示 | 適用済み・再実行不要（安全） | 最も安全な設計（冒頭で即終了） |
| fix_letter_phase_guard.js | forceLetterOpen/bootLetter/goToMgmtのフェーズガード強化 | 適用済み・再実行不要（安全） | 2回目は対象パターン不一致で自然にno-op |
| fix_letters_simplify_and_trust_rewards.js | 依頼成功時の信頼度加算(N0=+4,N1-3=+15,N4=+20)・進言即時適用・手紙簡素化 | 適用済み・再実行不要（安全） | game-data.js/letters.json も書き換え対象 |
| fix_mail_yellow_node_buttons.js | 新着[新着！]表示・ノード到着メール永続化・ボタン装飾 | 適用済み・再実行不要（安全） | |
| fix_market_season_and_ui.js | 新着表示赤字化・trust_reward同期・季節変動売買価格・季節在庫増減 | 適用済み・再実行不要（安全） | |
| fix_n2_advance_and_transport_ui.js | N1クリア→N2進軍バグ修正・輸送UI整理 | 適用済み・再実行不要（安全） | fix_horse_prince_transport.js に依存 |
| fix_node_advance_piece.js | N1クリア→N2進軍＋マップ駒移動をcheckOrderComplete一本化 | 適用済み・再実行不要（安全） | |
| fix_phase_ui_residue.js | フェーズ切替時のUI残留を非表示・openStrayHorseEventのwindow公開 | 適用済み・再実行不要（安全） | 各ステップにガードあり |
| fix_ranch_sell_bind.js | 牧場馬一覧の再バインド・売却ボタン確実表示 | 適用済み・再実行不要（安全） | |
| fix_strict_and_boot.js | 既存ブロックのstrictモード対応・最終手紙起動保証 | 適用済み・再実行不要（安全） | |
| fix_tab_shincho_and_buttons.js | タブの黄色枠廃止→[新着！]テキスト表示・ボタン大型化 | 適用済み・再実行不要（安全） | |
| fix_ui_polish_kengen_market_ranch.js | 進言費用表示・市場価格前期比表示・剣初期在庫0・牧場ステータス修正 | 適用済み・再実行不要（安全） | |
| fix_v061_bugs.js | 手紙常時オープン化・馬王子手紙修正・迷い馬イベント確実発火・stockOf(food)保護 | 適用済み・再実行不要（安全） | |
| fix_v061_letters_prep.js | 馬の出立準備依頼を「馬×2頭」→「兵糧×4・回復薬×1」に変更 | 適用済み・再実行不要（安全） | 全置換が冪等 |

## 新しいロジックを追加したいとき

`fix_*.js` は基本的に**使い捨て・実行済み**。新機能や追加のバグ修正が必要な場合は、
既存のどれかを再実行するのではなく、`docs/引継ぎガイド.md` §6「変更の入れ方」に従って
**新しい `data/fix_自分の機能.js` を作成**し、独自の `window.__myFlag` ガードと
`console.log('[xxx] ready')` マーカーを付けること。
