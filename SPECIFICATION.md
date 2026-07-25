# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: 完全パラメータ駆動（Data-Driven）による無限ゲームバリエーション設計

---

## 2. バリエーション設定パラメータ仕様 (`variations/*.json`)

1つのJSONファイルに以下の全パラメータを定義することで、ソースコードを変更せずに無限の異なるゲーム性・ルールを生み出すことができます。

```json
{
  "id": "neon_standard",
  "name": "ネオン・スタンダード",
  "difficulty": "EASY",
  "description": "大きな判定リングとHP 3つの初心者安心バリエーション！基本敵のみ出現。",
  "bgm": "bgm/Magenta_Pulse.mp3",
  "gameplay": {
    "targetRadius": 70,       // 判定リングのサイズ (px)
    "hitWindow": 30,          // 判定の甘さ (px)
    "tapCooldown": 120,       // タップ連打クールダウン (ms)
    "speedIncrement": 0.005,  // 敵撃破ごとの加速率
    "baseScore": 100          // 基本スコア
  },
  "player": {
    "maxHp": 3,               // プレイヤーの最大HP (ライフ数)
    "missPenaltyDuration": 12 // ミス時の操作不能フレーム数
  },
  "visuals": {
    "particleCount": 20,      // 撃破時パーティクル量
    "bgScrollSpeed": "4s"     // 背景グリッドの流れるスピード
  },
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

## 3. 敵マスタ定義 (`enemies.json`)

`enemies.json` で定義された敵タイプを `id` で指定します：
- **`CHASER`**: クリムゾン・チェイサー（基本直線型）
- **`SPEEDER`**: ボルト・スピーダー（高速突入型）
- **`GLITCH`**: ファントム・グリッチ（リング手前減速フェイント型）

---

## 4. データ保存 (LocalStorage)

各バリエーションごとにハイスコアを個別に管理・保存：
- キー名: `bestScore_${variationId}`

---

## 5. 無限バリエーション作成手順

1. `variations/` に新しい JSON ファイルを作成します。
2. `gameplay`, `player`, `visuals`, `theme`, `enemyPool` の値を自由に変更してオリジナルゲームを作成します。
3. `variations/list.json` にそのパスを追加します。
