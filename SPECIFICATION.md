# Tap Strike (秒殺！1ボタンアクション) ゲーム仕様書

## 1. 概要
- **タイトル**: Tap Strike (秒殺！1ボタンアクション)
- **ジャンル**: 1ボタン・ハイスピード・タイミングアクション
- **プラットフォーム**: Webブラウザ (PC / スマートフォン対応)
- **特徴**: 1ファイル1バリエーションJSON & 敵マスタ外部化 (`enemies.json`) によるデータ駆動アーキテクチャ

---

## 2. ゲームルール & 操作方法
### 基本ルール
1. 画面中央の自機に向かって、360度全方位から敵（エネミー）が接近してきます。
2. 自機の周囲に表示されている「判定リング」に敵が重なるタイミングで画面を**タップ**または**クリック**します。
3. タイミングよくヒットすると敵を撃破し、スコアとコンボが加算されます。
4. 敵が自機（中心点）に到達するとゲームオーバーになります。

---

## 3. 敵マスタ定義 (`enemies.json`)

すべての敵の種類・名前・カラー・形状・移動動作（behavior）は `enemies.json` で統一管理されます。

```json
{
  "CHASER": {
    "name": "クリムゾン・チェイサー",
    "description": "標準的なスピードでまっすぐ接近してくる基本型エネミー",
    "color": "#ff0055",
    "shape": "circle",
    "speedRatio": 1.0,
    "size": 12,
    "behavior": "straight"
  },
  "SPEEDER": {
    "name": "ボルト・スピーダー",
    "description": "高スピードで突入してくる小型の高速型エネミー",
    "color": "#ffcc00",
    "shape": "circle",
    "speedRatio": 1.5,
    "size": 9,
    "behavior": "straight"
  },
  "GLITCH": {
    "name": "ファントム・グリッチ",
    "description": "リング直前で一瞬減速しタイミングを外してくる幻影エネミー",
    "color": "#aa00ff",
    "shape": "square",
    "speedRatio": 1.2,
    "size": 13,
    "behavior": "feint"
  }
}
```

---

## 4. バリエーション管理システム (1ファイル1バリエーション仕様)

`variations/` ディレクトリ内に配置された各 JSON ファイルを動的に読み込み、テーマ（カラー・背景グラデーション）、BGM、出現エネミープール（`id`と`weight`）、スポーン速度をゲームに動的適用します。

### バリエーションJSON 例
```json
{
  "id": "cyber_speed",
  "name": "サイバー・スピード",
  "difficulty": "NORMAL",
  "description": "「クリムゾン・チェイサー」と高速の「ボルト・スピーダー」が組み合わさったスピーディーなバリエーション",
  "bgm": "bgm/Cyan_Square_Error.mp3",
  "theme": {
    "bgGlow": "rgba(0, 255, 136, 0.25)",
    "gridColor": "rgba(0, 255, 136, 0.3)",
    "ringColor": "#00ff88",
    "playerColor": "#00ff88"
  },
  "enemyPool": [
    { "id": "CHASER", "weight": 0.7 },
    { "id": "SPEEDER", "weight": 0.3 }
  ],
  "spawnRate": 187
}
```

---

## 5. データ保存 (LocalStorage)

各バリエーションごとにベストスコアを個別記録します：
- キー名: `bestScore_${variationId}`

---

## 6. 新しい敵やバリエーションの追加手順

1. **新しい敵を追加したい場合**: `enemies.json` に新しい敵のID（例: `"SHIELD"`）とパラメータ（名前・色・形状・スピード・動作）を追加。
2. **新しいバリエーションを追加したい場合**: `variations/` に新規JSONを作成し、出現させたい敵IDと重み（`weight`）を指定後、`variations/list.json` にパスを追加。
