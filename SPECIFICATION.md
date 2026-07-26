# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: FUNNY 7大ステージ搭載 (モアイ像、ひよこ、レインボー、三・三・七拍子、ネコ、お寿司、爆発) (`v10.0.0`)

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
│   ├── entities.js             # Particle, Shockwave 視覚演出
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
│       ├── chicken.js          # 🐥 ぴよぴよヒヨコ
│       ├── cat.js              # 🐱 にゃんこフェスティバル
│       ├── sushi.js            # 🍣 回転マグロ寿司
│       ├── bomb.js             # 💥 メガ・ボム
│       └── moai.js             # 🗿 ジャイアント・モアイ (NEW!)
├── stages/                     # モードごとに分類されたステージJSON
│   ├── easy/                   # EASYモード用
│   ├── normal/                 # NORMALモード用
│   ├── hard/                   # HARDモード用
│   └── funny/                  # FUNNYモード用
│       ├── chicken_panic.json  # 「ヒヨコ・パニック」
│       ├── rainbow_chaser.json # 「レインボー・チェイサー」
│       ├── san_san_nana.json   # 「三・三・七拍子」
│       ├── cat_festival.json   # 「ネコ・フェスティバル」
│       ├── rotating_sushi.json # 「回転マグロ寿司」
│       ├── bomb_party.json     # 「爆発まつり」
│       └── giant_moai.json     # 「ジャイアント・モアイ」 (NEW!)
├── bgm/                        # BGM音源 (.mp3)
├── stages.json                 # 全ステージ相対パス一覧
├── difficulties.json           # 難易度マスタ定義
├── SPECIFICATION.md
└── README.md
```
