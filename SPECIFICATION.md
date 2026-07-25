# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: 完全モジュール化（CSS/JS分離）× 2段階UIメニュー（モード選択 ➔ バリエーション選択）× 2層パラメータデータ駆動アーキテクチャ

---

## 2. 画面フロー & UIナビゲーション

1. **モード選択画面 (`#mode-select-view`)**:
   - `EASY モード` (🟢), `NORMAL モード` (🔵), `HARD モード` (🔴) の大きなナビゲーションボタンを配置。
2. **バリエーション選択画面 (`#variation-select-view`)**:
   - 選択されたモード内のバリエーションカード一覧を最新日付順（`updatedAt` / `createdAt` 降順）で描画。
   - 左上に `⬅ モード選択に戻る` ボタンを常置。

---

## 3. ディレクトリ & モジュール構造

```text
tap-strike/
├── index.html           # 2段階UIコンテナを含むクリーンなエントリーポイント
├── css/
│   └── style.css        # モード選択ボタン・ネオンアニメーションCSS
├── js/
│   ├── audio.js         # Web Audio API / BGM再生管理 (AudioEngine)
│   ├── loader.js        # 各種JSONフェッチ・パラメータ合成 (DataLoader)
│   ├── entities.js      # Enemy / Particle / Shockwave クラス定義
│   └── game.js          # メインゲームエンジン・2段階UIナビゲーション (Game)
├── variations/          # バリエーションJSON群
│   ├── list.json
│   ├── neon_standard.json
│   ├── cyber_speed.json
│   ├── purple_trick.json
│   └── sharp_suits.json
├── bgm/                 # BGM音源 (.mp3)
├── enemies.json         # 敵マスタ定義
├── difficulties.json    # 難易度マスタ定義
├── SPECIFICATION.md
└── README.md
```

---

## 4. バリエーション設定仕様 (`variations/*.json`)

- 日付管理項目: `"createdAt"`, `"updatedAt"`
- 各バリエーションは固有のテーマ、BGM、出現エネミープールを保持。
- 難易度デフォルト（`difficulties.json`）を個別パラメータで上書き可能。

---

## 5. データ保存 (LocalStorage)

各バリエーションごとにハイスコアを個別記録：
- キー名: `bestScore_${variationId}`
