# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: 完全モジュール化（CSS/JS分離）× 3フラットモーダルUI（v2.0.0）× 2層パラメータデータ駆動アーキテクチャ

---

## 2. モーダルUI構造 (v2.0.0)

1. **`#modal-mode-select`** (モード選択)
2. **`#modal-variation-select`** (バリエーション選択)
3. **`#modal-game-over`** (ゲームオーバー)

---

## 3. ディレクトリ & モジュール構造

```text
tap-strike/
├── index.html           # 3フラットモーダルコンテナを含むクリーンなエントリーポイント
├── css/
│   └── style.css        # モーダル・ネオンアニメーションCSS
├── js/
│   ├── audio.js         # Web Audio API / BGM再生管理 (AudioEngine)
│   ├── loader.js        # 各種JSONフェッチ・パラメータ合成 (DataLoader)
│   ├── entities.js      # Enemy / Particle / Shockwave クラス定義
│   └── game.js          # メインゲームエンジン・一元モーダル管理 (Game)
├── variations/          # 純粋なバリエーションJSONファイル
│   ├── neon_standard.json
│   ├── cyber_speed.json
│   ├── purple_trick.json
│   ├── sharp_suits.json
│   └── midnight_porch.json # 新規追加: ミッドナイト・ポーチ・ライト (EASY)
├── bgm/                 # BGM音源 (.mp3)
│   ├── Cyan_Square_Error.mp3
│   ├── Magenta_Pulse.mp3
│   ├── Sharp_Suits_on_the_Avenue.mp3
│   └── Midnight_Porch_Light.mp3
├── variations.json      # 全バリエーション一覧リスト
├── enemies.json         # 敵マスタ定義
├── difficulties.json    # 難易度マスタ定義
├── SPECIFICATION.md
└── README.md
```

---

## 4. 難易度マスタ仕様 (`difficulties.json`)

- `EASY`: HP 3 / リング径 70 / クールダウン 120ms
- `NORMAL`: HP 2 / リング径 60 / クールダウン 150ms
- `HARD`: HP 1 / リング径 50 / クールダウン 180ms
