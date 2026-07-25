# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: 完全モジュール化（CSS/JS分離）× 2層パラメータデータ駆動アーキテクチャ

---

## 2. ディレクトリ & モジュール構造

```text
tap-strike/
├── index.html           # エントリーポイント (約40行のクリーンなHTML)
├── css/
│   └── style.css        # 全スタイリング・ネオンアニメーション
├── js/
│   ├── audio.js         # Web Audio API / BGM再生管理 (AudioEngine)
│   ├── loader.js        # 各種JSONフェッチ・パラメータ合成 (DataLoader)
│   ├── entities.js      # Enemy / Particle / Shockwave クラス定義
│   └── game.js          # メインゲームエンジン・状態管理・描画ループ (Game)
├── variations/          # バリエーションJSON群
│   ├── list.json
│   ├── neon_standard.json
│   ├── cyber_speed.json
│   └── purple_trick.json
├── bgm/                 # BGM音源 (.mp3)
├── enemies.json         # 敵マスタ定義
├── difficulties.json    # 難易度マスタ定義
├── SPECIFICATION.md
└── README.md
```

---

## 3. 難易度マスタ仕様 (`difficulties.json`)

難易度（EASY / NORMAL / HARD）ごとのデフォルト設定を一括管理：
- `EASY`: HP 3 / リング径 70 / クールダウン 120ms
- `NORMAL`: HP 2 / リング径 60 / クールダウン 150ms
- `HARD`: HP 1 / リング径 50 / クールダウン 180ms

---

## 4. バリエーション設定仕様 (`variations/*.json`)

テーマ色、BGM、出現エネミープールに特化。必要に応じて `gameplay`, `player`, `visuals` の個別値をオーバーライド可能。

---

## 5. 敵マスタ定義 (`enemies.json`)

- **`CHASER`**: クリムゾン・チェイサー（基本型）
- **`SPEEDER`**: ボルト・スピーダー（高速型）
- **`GLITCH`**: ファントム・グリッチ（減速フェイント型）
