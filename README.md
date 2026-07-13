# もういっそ敗けてくれ

ターン制の補給・内政シミュレーションです。

---

## すぐ遊ぶ

1. **`mou_isso_v0_6_1.html`** をブラウザで開く（Chrome / Edge 推奨）  
2. ゲームデータを更新したあとは **Ctrl+F5**

```
C:\Users\kzawa\Downloads\Grok\mou_isso_v0_6_1.html
```

---

## ドキュメント（必読）

| ファイル | 内容 |
|----------|------|
| [docs/引継ぎガイド.md](docs/引継ぎガイド.md) | **引継ぎの入口**。構成・仕様要約・初日チェック |
| [docs/仕様書_実装版_v0_6_1.md](docs/仕様書_実装版_v0_6_1.md) | 実装に合わせた詳細仕様 |
| [docs/説明書_プレイヤー向け_v0_6_1.md](docs/説明書_プレイヤー向け_v0_6_1.md) | 遊び方 |
| [docs/データ同期とメンテナンス.md](docs/データ同期とメンテナンス.md) | **JSON 変更の反映手順** |
| [docs/マップ座標の計算.md](docs/マップ座標の計算.md) | **マス座標の式と全マス表** |
| [docs/README.md](docs/README.md) | docs 索引 |
| `mou_isso_makete_kure_仕様書_v0_7.md` | 初期デザイン（差分あり・実装が正） |

---

## マップ座標について

ノードや輸送経路のマスは、王都と4ルートの折れ線から **計算で生成**しています。

- 計算の正本: `data/build_map_cells.js`  
- 生成結果: `data/map_cells.js`  
- **解説と全マスの (x,y) 表:** [docs/マップ座標の計算.md](docs/マップ座標の計算.md)

```bat
"C:\Program Files\nodejs\node.exe" data\build_map_cells.js
```

---

## JSON を変えたときの反映（要約）

詳しくは [docs/データ同期とメンテナンス.md](docs/データ同期とメンテナンス.md)。

### 市場・価格・季節

1. `data/market_economy.json` を編集  
2. 次のいずれかを実行  
   - `sync_market.bat` をダブルクリック  
   - または  
     ```bat
     "C:\Program Files\nodejs\node.exe" data\repair_market_embed.js
     ```  
3. ブラウザで **Ctrl+F5**

### 依頼・信頼・手紙

- `data/game-data.js` / `data/letters.json`  
- 対応する `data/fix_letters_*.js` 等を実行（ドキュメント参照）

### マップ

- `data/build_map_cells.js` を編集 → 上記コマンドで再生成

---

## 開発メモ

- ロジック追加は `data/fix_*.js` で HTML 末尾にパッチを足す方式が多い  
- 実行前に `mou_isso_v0_6_1.html.bak_*` が作られることが多い  
- `mou-isso/` は Vite 実験用で **本線ではない**  
- 古い HTML は `old/` や各種 `.bak_*`

---

## 引継ぎ

**[docs/引継ぎガイド.md](docs/引継ぎガイド.md)** を最初から最後まで読んでください。  
仕様・メンテ・マップ・初日チェックリストがまとまっています。
