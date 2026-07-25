# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: 完全モジュール化（CSS/JS分離）× 2段階UIメニュー（モード選択 ➔ バリエーション選択）× 2層パラメータデータ駆動アーキテクチャ

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
│   └── game.js          # メインゲームエンジン・2段階UIナビゲーション (Game)
├── variations/          # 純粋なバリエーションJSONファイルのみ格納
│   ├── neon_standard.json
│   ├── cyber_speed.json
│   ├── purple_trick.json
│   └── sharp_suits.json
├── bgm/                 # BGM音源 (.mp3)
├── variations.json      # 全バリエーション一覧リスト
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
  "id": "sharp_suits",
  "name": "シャープ・スーツ・アベニュー",
  "difficulty": "EASY",
  "description": "スタイリッシュなビートに乗ってテンポよく撃破していくノリノリのEASYバリエーション",
  "bgm": "bgm/Sharp_Suits_on_the_Avenue.mp3",
  "createdAt": "2026-07-26",
  "updatedAt": "2026-07-26",
  "theme": {
    "bgGlow": "rgba(255, 170, 0, 0.25)",
    "gridColor": "rgba(255, 200, 0, 0.3)",
    "ringColor": "#ffaa00",
    "playerColor": "#ffaa00"
  },
  "enemyPool": [
    { "id": "CHASER", "weight": 0.8 },
    { "id": "SPEEDER", "weight": 0.2 }
  ],
  "spawnRate": 210
}
```

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
