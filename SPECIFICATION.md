# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: FUNNY 7大ステージ ＆ スマホ最適化ポーズ・爆速リトライ機能搭載 (`v13.0.0`)

---

## 2. ディレクトリ & モジュール構造

```text
tap-strike/
├── index.html                  # 4フラットモーダルコンテナ (モード、ステージ、ゲームオーバー、ポーズ)
├── css/
│   └── style.css               # モーダル・ネオンアニメーション・ポーズボタンCSS
├── js/
│   ├── audio.js                # 汎用Web Audio APIトーンシンセサイザー / BGM再生管理
│   ├── loader.js               # ステージ・難易度JSONフェッチおよびパラメータ合成
│   ├── entities.js             # Particle, Shockwave 視覚演出
│   ├── game.js                 # メインゲームエンジン・一元モーダル・ポーズ・リトライ管理
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
│       └── firework.js         # 🎆 打ち上げ花火玉
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
│       └── summer_fireworks.json# 「たまや〜！夏の大輪花火」
├── bgm/                        # BGM音源 (.mp3)
│   └── Matsuri_High.mp3        # 夏の大輪花火用お祭りBGM
├── stages.json                 # 全ステージ相対パス一覧
├── difficulties.json           # 難易度マスタ定義
├── SPECIFICATION.md
└── README.md
```
