# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: 難易度マスタ × バリエーション設計の2層データ駆動アーキテクチャ

---

## 2. 難易度マスタ仕様 (`difficulties.json`)

難易度（EASY / NORMAL / HARD）ごとのデフォルトのゲームルール・パラメータを共通管理します。

```json
{
  "EASY": {
    "name": "かんたん",
    "player": { "maxHp": 3, "missPenaltyDuration": 12 },
    "gameplay": { "targetRadius": 70, "hitWindow": 30, "tapCooldown": 120, "speedIncrement": 0.005, "baseScore": 100 },
    "visuals": { "particleCount": 20, "bgScrollSpeed": "4s" }
  },
  "NORMAL": {
    "name": "ふつう",
    "player": { "maxHp": 2, "missPenaltyDuration": 15 },
    "gameplay": { "targetRadius": 60, "hitWindow": 25, "tapCooldown": 150, "speedIncrement": 0.008, "baseScore": 150 },
    "visuals": { "particleCount": 16, "bgScrollSpeed": "2.5s" }
  },
  "HARD": {
    "name": "むずかしい",
    "player": { "maxHp": 1, "missPenaltyDuration": 20 },
    "gameplay": { "targetRadius": 50, "hitWindow": 20, "tapCooldown": 180, "speedIncrement": 0.012, "baseScore": 200 },
    "visuals": { "particleCount": 24, "bgScrollSpeed": "1.8s" }
  }
}
```

---

## 3. バリエーション設定仕様 (`variations/*.json`)

バリエーションファイルは「テーマ色・BGM・敵の出現構成」などの個性・世界観の設定に専念します。
※必要に応じて `gameplay`, `player`, `visuals` 内の数値を個別に指定することで、難易度デフォルト値を上書き（Override）可能です。

```json
{
  "id": "neon_standard",
  "name": "ネオン・スタンダード",
  "difficulty": "EASY",
  "description": "基本の「クリムゾン・チェイサー」のみが出現するテンポの良い初心者向けバリエーション",
  "bgm": "bgm/Magenta_Pulse.mp3",
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

---

## 4. 敵マスタ定義 (`enemies.json`)

- **`CHASER`**: クリムゾン・チェイサー（基本直線型）
- **`SPEEDER`**: ボルト・スピーダー（高速突入型）
- **`GLITCH`**: ファントム・グリッチ（リング手前減速フェイント型）

---

## 5. データ保存 (LocalStorage)

各バリエーションごとにハイスコアを個別に管理・保存：
- キー名: `bestScore_${variationId}`
