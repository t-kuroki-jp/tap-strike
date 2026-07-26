# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: 完全モジュール化 × 3フラットモーダルUI × ステージ別管理構造 (`v3.0.0`)

---

## 2. ディレクトリ & モジュール構造

```text
tap-strike/
├── index.html           # 3フラットモーダルコンテナを含むエントリーポイント
├── css/
│   └── style.css        # モーダル・ネオンアニメーションCSS
├── js/
│   ├── audio.js         # Web Audio API / BGM再生管理 (AudioEngine)
│   ├── loader.js        # 各種JSONフェッチ・パラメータ合成 (DataLoader)
│   ├── entities.js      # Enemy / Particle / Shockwave クラス定義
│   └── game.js          # メインゲームエンジン・一元モーダル管理 (Game)
├── stages/              # モードごとに分類されたステージJSON
│   ├── easy/            # EASYモード用（単一エネミー特訓・入門）
│   │   ├── chaser.json  # 直進敵 100%
│   │   ├── curve.json   # ウネウネ軌道敵 100%
│   │   ├── shield.json  # 2回タップ重装甲敵 100%
│   │   ├── glitch.json  # 減速フェイント敵 100%
│   │   └── speeder.json # 高速敵 100%
│   ├── normal/          # NORMALモード用（ギミック複合）
│   │   ├── standard.json
│   │   └── trick.json
│   └── hard/            # HARDモード用（激ムズ高密度）
│       └── overdrive.json
├── bgm/                 # BGM音源 (.mp3)
├── stages.json          # 全ステージ相対パス一覧
├── enemies.json         # 敵マスタ定義
├── difficulties.json    # 難易度マスタ定義
├── SPECIFICATION.md
└── README.md
```

---

## 3. 難易度マスタ仕様 (`difficulties.json`)

- 全難易度基本一律ルール: **HP 3** / **リング径 65**（自機操作感をブレさせず統一）
- 難易度の差は **「出現エネミーの組み合わせ」** と **「出現間隔 (spawnRate)」** で表現
- 任意でステージJSONによる個別の `maxHp` / `targetRadius` オーバーライド可能
