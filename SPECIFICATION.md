# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: 完全モジュール化 × 3フラットモーダルUI × BIG_BOSS & DONT_TAP ギミック搭載 (`v4.2.0`)

---

## 2. ディレクトリ & モジュール構造

```text
tap-strike/
├── index.html                  # 3フラットモーダルコンテナを含むエントリーポイント
├── css/
│   └── style.css               # モーダル・ネオンアニメーションCSS
├── js/
│   ├── audio.js                # Web Audio API / BGM再生管理 (AudioEngine)
│   ├── loader.js               # 各種JSONフェッチ・パラメータ合成 (DataLoader)
│   ├── entities.js             # Enemy / Particle / Shockwave / FloatingText
│   └── game.js                 # メインゲームエンジン・一元モーダル管理 (Game)
├── stages/                     # モードごとに分類されたステージJSON
│   ├── easy/                   # EASYモード用（単一エネミー特訓・入門）
│   │   ├── normal_chaser.json  # 「ノーマル・チェイサー」
│   │   ├── spiral_curve.json   # 「スパイラル・カーブ」
│   │   ├── shield_break.json   # 「シールド・ブレイク」
│   │   ├── phantom_glitch.json # 「ファントム・グリッチ」
│   │   ├── bolt_speeder.json   # 「ボルト・スピーダー」
│   │   ├── big_boss.json       # 「ビッグ・ボス」 (NEW!)
│   │   └── dont_tap.json       # 「スルー・マスター」 (NEW!)
│   ├── normal/                 # NORMALモード用（ギミック複合）
│   │   ├── neon_standard.json  # 「ネオン・スタンダード」
│   │   └── purple_trick.json   # 「パープル・トリック・ナイト」
│   └── hard/                   # HARDモード用（激ムズ高密度）
│       └── bolt_overdrive.json # 「ボルト・オーバードライブ」
├── bgm/                        # BGM音源 (.mp3)
├── stages.json                 # 全ステージ相対パス一覧
├── enemies.json                # 敵マスタ定義 (BIG_BOSS, DONT_TAP含む)
├── difficulties.json           # 難易度マスタ定義
├── SPECIFICATION.md
└── README.md
```

---

## 3. 難易度マスタ仕様 (`difficulties.json`)

- 全難易度基本一律ルール: **HP 3** / **リング径 65**（自機操作感をブレさせず統一）
- 難易度の差は **「出現エネミーの組み合わせ」** と **「出現間隔 (spawnRate)」** で表現
- 任意でステージJSONによる個別の `maxHp` / `targetRadius` オーバーライド可能
