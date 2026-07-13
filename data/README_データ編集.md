# データ編集ガイド（data/）

詳細な手順・トラブルシュートは親フォルダの  
**[docs/データ同期とメンテナンス.md](../docs/データ同期とメンテナンス.md)**  
を正とします。

## 最短コマンド

```bat
cd /d C:\Users\kzawa\Downloads\Grok
"C:\Program Files\nodejs\node.exe" data\repair_market_embed.js
```

または `..\sync_market.bat` / `..\sync_all.bat`。

## 主な正本

| ファイル | 内容 |
|----------|------|
| `market_economy.json` | 市場価格・季節在庫・進言費用 |
| `game-data.js` | 依頼・信頼・手紙・初期値 |
| `letters.json` | 手紙プール |
| `horses.json` | 馬 |
| `build_map_cells.js` | マップ座標の定義（再計算） |
| `map_cells.js` | 座標の生成結果 |
| `ui_strings.json` | UI 短文 |
| `fix_*.js` | 機能パッチ（HTML に適用） |

## 注意

- JSON だけ直しても **同期しないと HTML に入りません**  
- キーは小文字（`iron`）  
- プレイは **`../mou_isso_v0_6_1.html`**  
- マップ座標の式と表: [docs/マップ座標の計算.md](../docs/マップ座標の計算.md)  
