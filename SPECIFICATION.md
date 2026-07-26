# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: サウンドカプセル化 ＆ 1敵1ファイル完全モジュール化アーキテクチャ ＆ FUNNY 6大ステージ搭載 (`v8.1.0`)

---

## 2. ディレクトリ & モジュール構造

```text
tap-strike/
├── index.html                  # 3フラットモーダルコンテナを含むエントリーポイント
├── css/
│   └── style.css               # モーダル・ネオンアニメーションCSS
├── js/
│   ├── audio.js                # 汎用Web Audio APIトーンシンセサイザー / BGM再生管理
│   ├── loader.js               # ステージ・難易度JSONフェッチおよびパラメータ合成
│   ├── entities.js             # Particle, Shockwave, FloatingText 視覚演出
│   ├── game.js                 # メインゲームエンジン・一元モーダル管理
│   └── enemies/                # 自立型エネミーモジュール群 (サウンド完全カプセル化)
│       ├── enemy.js            # 基底 Enemy クラス
│       ├── enemy_factory.js    # EnemyFactory 生成管理
│       ├── chaser.js           # クリムゾン・チェイサー
│       ├── speeder.js          # ボルト・スピーダー
│       ├── glitch.js           # ファントム・グリッチ
│       ├── curve.js            # スパイラル・スピナー
│       ├── shield.js           # シールド・クラッシャー
│       ├── big_boss.js         # ビッグ・ボス
│       ├── heal.js             # ライフ・ポッド
│       ├── dont_tap.js         # スルー・ファントム
│       ├── chicken.js          # 🐥 ぴよぴよヒヨコ (自立ピヨピヨSE)
│       ├── cat.js              # 🐱 にゃんこフェスティバル (自立ニャーSE)
│       ├── sushi.js            # 🍣 回転マグロ寿司 (自立和風SE)
│       └── bomb.js             # 💥 メガ・ボム (自立爆発SE)
├── stages/                     # モードごとに分類されたステージJSON
│   ├── easy/                   # EASYモード用
│   ├── normal/                 # NORMALモード用
│   ├── hard/                   # HARDモード用
│   └── funny/                  # FUNNYモード用
├── bgm/                        # BGM音源 (.mp3)
├── stages.json                 # 全ステージ相対パス一覧
├── difficulties.json           # 難易度マスタ定義
├── SPECIFICATION.md
└── README.md
```
