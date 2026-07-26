# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: 完全JSクラス自立型オブジェクト指向アーキテクチャ ＆ FUNNY 6大ステージ搭載 (`v7.1.0`)

---

## 2. ディレクトリ & モジュール構造

```text
tap-strike/
├── index.html                  # 3フラットモーダルコンテナを含むエントリーポイント
├── css/
│   └── style.css               # モーダル・ネオンアニメーションCSS
├── js/
│   ├── audio.js                # Web Audio API / SE・BGM再生管理
│   ├── loader.js               # ステージ・難易度JSONフェッチおよびパラメータ合成
│   ├── entities.js             # 自立型Enemyクラス群 (全12種) / EnemyFactory / Particle
│   └── game.js                 # メインゲームエンジン・一元モーダル管理
├── stages/                     # モードごとに分類されたステージJSON
│   ├── easy/                   # EASYモード用
│   │   ├── normal_chaser.json
│   │   ├── spiral_curve.json
│   │   ├── shield_break.json
│   │   ├── phantom_glitch.json
│   │   ├── bolt_speeder.json
│   │   ├── big_boss.json
│   │   └── dont_tap.json
│   ├── normal/                 # NORMALモード用
│   │   ├── neon_standard.json
│   │   └── purple_trick.json
│   ├── hard/                   # HARDモード用
│   │   └── bolt_overdrive.json
│   └── funny/                  # FUNNYモード用
│       ├── chicken_panic.json  # 「ヒヨコ・パニック」
│       ├── rainbow_chaser.json # 「レインボー・チェイサー」
│       ├── san_san_nana.json   # 「三・三・七拍子」
│       ├── cat_festival.json   # 「ネコ・フェスティバル」
│       ├── rotating_sushi.json # 「回転マグロ寿司」
│       └── bomb_party.json     # 「爆発まつり」
├── bgm/                        # BGM音源 (.mp3)
├── stages.json                 # 全ステージ相対パス一覧
├── difficulties.json           # 難易度マスタ定義
├── SPECIFICATION.md
└── README.md
```
