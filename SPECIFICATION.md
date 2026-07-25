# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: 完全モジュール化（CSS/JS分離）× 日付メタデータソート機能付き2層パラメータデータ駆動アーキテクチャ

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
│   └── game.js          # メインゲームエンジン・状態管理・描画ループ・日付ソート (Game)
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

## 3. バリエーション設定仕様 (`variations/*.json`)

日付管理項目（`createdAt`, `updatedAt`）を含むバリエーションデータのフルスキーマ：

```json
{
  "id": "neon_standard",
  "name": "ネオン・スタンダード",
  "difficulty": "EASY",
  "description": "基本の「クリムゾン・チェイサー」のみが出現するテンポの良い初心者向けバリエーション",
  "bgm": "bgm/Magenta_Pulse.mp3",
  "createdAt": "2026-07-25",
  "updatedAt": "2026-07-25",
  "theme": {
    "bgGlow": "rgba(0, 240, 255, 0.25)",
    "gridColor": "rgba(0, 240, 255, 0.3)",
    "ringColor": "#00f0ff",
    "playerColor": "#00f0ff"
  },
  "enemyPool": [
    { "id": "CHASER", "weight": 1.0 }
  ],
  "spawnRate": 220
}
```

- **日付ソート機能**: 各難易度グループ内で `updatedAt` / `createdAt` の最新順に自動整列してカード描画されます。

---

## 4. 難易度マスタ仕様 (`difficulties.json`)

- `EASY`: HP 3 / リング径 70 / クールダウン 120ms
- `NORMAL`: HP 2 / リング径 60 / クールダウン 150ms
- `HARD`: HP 1 / リング径 50 / クールダウン 180ms

---

## 5. 敵マスタ定義 (`enemies.json`)

- **`CHASER`**: クリムゾン・チェイサー（基本型）
- **`SPEEDER`**: ボルト・スピーダー（高速型）
- **`GLITCH`**: ファントム・グリッチ（減速フェイント型）

---

## 6. データ保存 (LocalStorage)

各バリエーションごとにハイスコアを個別に管理・保存：
- キー名: `bestScore_${variationId}`
