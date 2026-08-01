# 『Tap Strike』 全ステージ ＆ JSON スキーマ仕様書 (Stages Catalog & Schema Guidelines)

---

## 1. 概要 (Overview)

本ドキュメントは『Tap Strike』に登場する全ステージの構成リスト、および新しいステージを作成・追加する際の **JSON スキーマ規格（記載ルール標準）** を一元管理する仕様書です。

ステージ設定はデータ駆動（Data-Driven Architecture）となっており、マスター登録簿 `stages/index.json` を起点として `stages/` ディレクトリ配下の各ステージ JSON ファイルが読み込まれます。

---

## 2. 🎛️ 難易度マスター規格 (`stages/index.json`)

全ステージの統合マニフェストファイル `stages/index.json` は、全コースの登録リスト (`stages`) と、各難易度（EASY / NORMAL / HARD / FUNNY）の **標準デフォルトパラメータ (`params`)** を一元管理します。

```json
{
  "EASY": {
    "params": {
      "gameSpeed": 0.85,          // 初期ゲーム速度
      "targetRadius": 65,         // 判定リングのデフォルト基本サイズ(px)
      "maxHp": 3,                 // プレイヤー初期最大HP
      "hitWindow": 25,            // HIT判定の許容ピクセル幅(px)
      "tapCooldown": 120,         // 連打防止タップクールダウン(ms)
      "speedIncrement": 0.005,    // ノーツ撃破ごとの加速量
      "baseScore": 100,           // 1体撃破あたりの基礎獲得スコア
      "missPenaltyDuration": 10,  // ミス時の赤発光維持フレーム数
      "particleCount": 20         // タップ成功時の爆発エフェクト粒子数
    },
    "stages": [
      "stages/easy/straight_circle.json"
    ]
  }
}
```

### 📌 全難易度共通標準 `params` 一覧表

現在ゲーム性のベース（物理・操作感）を全モードで心地よく統一するため、全難易度で以下の標準パラメータが共通適用されます。難易度差はノーツの組み合わせ・出撃密度・複合軌道ギミックで表現されます。

| 難易度 | ゲーム速度 (`gameSpeed`) | 初期HP (`maxHp`) | 判定リング半径 (`targetRadius`) | 当たり判定幅 (`hitWindow`) | 連打CD (`tapCooldown`) | 撃破加速量 (`speedIncrement`) | 基礎スコア (`baseScore`) | 粒子数 (`particleCount`) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **EASY** | `0.85` | `3` | `60px` | `24px` | `50ms` | `0.008` | `10` | `18` |
| **NORMAL** | `0.85` | `3` | `60px` | `24px` | `50ms` | `0.008` | `10` | `18` |
| **HARD** | `0.85` | `3` | `60px` | `24px` | `50ms` | `0.008` | `10` | `18` |
| **FUNNY** | `0.85` | `3` | `60px` | `24px` | `50ms` | `0.008` | `10` | `18` |

> 💡 **FUNNY モードの `NEW!` バッジ ＆ 表示順仕様**:
> マスター登録簿 `stages/index.json` の `"FUNNY"` 内 `stages` 配列に書かれた並び順そのままで画面に表示され、**一番上（先頭 3 ステージ）に自動で金色の `NEW!` バッジ** が付与されます。新しいステージを `stages/index.json` の `"FUNNY"` 内 `stages` 配列の先頭（上）に追加していく運用です。日付等の手書き属性は一切不要です。

---

## 3. 📐 個別ステージ JSON 標準スキーマ規格 (Standard Stage Schema)

新しいステージを作成・編集する際は、必ず以下の **標準 JSON スキーマ規格（必須プロパティ）** に従って記述します。

```json
{
  "id": "stage_id",
  "name": "ステージ表示名",
  "difficulty": "EASY | NORMAL | HARD | FUNNY",
  "description": "絵文字 ＋ ステージ特徴説明テキスト",
  "bgm": "bgm/ファイル名.mp3",
  "spawnRate": 230,
  "theme": {
    "bgGlow": "rgba(R, G, B, 0.25)",
    "gridColor": "rgba(R, G, B, 0.3)",
    "ringColor": "#HEX",
    "playerColor": "#HEX"
  },
  "params": {
    "gameSpeed": 0.85,
    "targetRadius": 60,
    "maxHp": 3,
    "tapCooldown": 50,
    "baseScore": 10
  },
  "enemyPool": [
    { "id": "ENEMY_ID", "weight": 1.0 }
  ]
}
```

### 📌 プロパティ詳細定義一覧

| プロパティ名 | 型 | 必須/任意 | 説明・仕様 | 推奨値 / 例 |
| :--- | :---: | :---: | :--- | :--- |
| **`id`** | `string` | **必須** | ステージを一義識別するユニーク ID。 | `"straight_circle"` |
| **`name`** | `string` | **必須** | UIやモード選択画面に表示されるステージ名。 | `"ストレート・サークル"` |
| **`difficulty`** | `string` | **必須** | `"EASY"`, `"NORMAL"`, `"HARD"`, `"FUNNY"` のいずれか。 | `"EASY"` |
| **`description`** | `string` | **必須** | アイコン絵文字から始まるステージ特徴・攻略の解説文。 | `"🔴 ネオン正円ノーツ！..."` |
| **`bgm`** | `string` | **必須** | ループ再生される BGM ファイル相対パス。 | `"bgm/Sharp_Suits_on_the_Avenue.mp3"` |
| **`spawnRate`** | `number` | **必須** | ノーツ出撃チェック間隔タイマー（ミリ秒）。値が小さいほど高密度。 | `230` (標準) / `160` (高速) |
| **`spawnPattern`**| `string` | *任意* | 特殊スポーンパターン指定（例: `"san_san_nana"`）。 | `"san_san_nana"` |
| **`targetScore`** | `number` | *任意* | ステージクリアの目標スコア（オプショナル）。 | `500` |
| **`theme`** | `object` | **必須** | ステージ固有のネオンビジュアルカラーテーマ。 | 下記参照 |
| ↳ **`bgGlow`** | `string` | **必須** | キャンバス中央の背景グロー発光色 (`rgba`)。 | `"rgba(0, 240, 255, 0.25)"` |
| ↳ **`gridColor`** | `string` | **必須** | 全方位背景グリッドライン描画色 (`rgba`)。 | `"rgba(0, 240, 255, 0.3)"` |
| ↳ **`ringColor`** | `string` | **必須** | 判定ターゲットリングの発光カラーコード。 | `"#00f0ff"` |
| ↳ **`playerColor`** | `string` | **必須** | 自機プレイヤー判定リングのメインカラーコード。 | `"#00f0ff"` |
| ↳ **`rainbow`** | `boolean`| *任意* | `true` の場合、画面背景全域が七色レインボーに変色。 | `true` |
| **`params`** | `object` | **必須** | ゲーム難易度パラメータ調整値（省略時は `index.json` の `defaults` から自動補填）。 | 下記参照 |
| ↳ **`gameSpeed`**| `number` | **必須** | ステージ開始時の初期ゲームスクロール速度。 | `0.85` (標準) / `1.1` (高速) |
| ↳ **`speedIncrement`**| `number`| *任意* | ノーツ 1 体撃破ごとの加速上昇量。 | `0.008` (標準) |
| ↳ **`targetRadius`**| `number`| **必須** | 判定ターゲットリングの半径（ピクセル）。 | `60` |
| ↳ **`maxHp`** | `number` | **必須** | プレイヤーの最大ライフ（ハート数）。 | `3` |
| ↳ **`hitWindow`** | `number` | *任意* | HIT判定許容ピクセル幅。 | `24` |
| ↳ **`tapCooldown`**| `number`| **必須** | 連打タップのクールダウンミリ秒。 | `50` |
| ↳ **`baseScore`**| `number` | **必須** | ノーツ 1 体あたりの基礎獲得スコア。 | `10` |
| **`enemyPool`** | `array` | **必須** | ステージで出撃するエネミーノーツの抽選プール。 | `[{ "id": "CHASER", "weight": 1 }]` |

---

## 4. 🟢 EASY モード ステージ全 10 種カタログ

幾何学ノーツの全 10 種類の移動 Behavior を 1 ステージずつ安全に学習できる完全チュートリアルコースです。

| # | ID | ステージ名 | 出現エネミー Pool | 主な Behavior ギミック | テーマカラー | BGM |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| 1 | `straight_circle` | **ストレート・サークル** | `CHASER` | `straight` (直線直進) | 🔴 `#ff3366` | `Sharp_Suits_on_the_Avenue.mp3` |
| 2 | `bolt_stellar` | **ボルト・ステラ** | `SPEEDER` | `straight` (★星型 1.45倍高速) | ⚡ `#ffff33` | `Under_The_Hammer.mp3` |
| 3 | `glitch_tetra` | **グリッチ・テトラ** | `GLITCH` | `glitch` (正方形 手前減速) | 👾 `#cc00ff` | `Magenta_Pulse.mp3` |
| 4 | `curve_tri` | **カーブ・トライ** | `CURVE` | `spiral` (正三角形 旋回カーブ) | 🌀 `#ff9900` | `Cyan_Square_Error.mp3` |
| 5 | `wave_dia` | **ウェイブ・ダイヤ** | `SINE_WAVE` | `wave` (ひし形 S字サイン波) | 🌊 `#00ffcc` | `Petals_on_the_Controller.mp3` |
| 6 | `return_angle` | **リターン・アングル** | `CROSS` | `boomerang` (L字 Uターン引き返し) | 🪃 `#d2691e` | `Under_The_Hammer.mp3` |
| 7 | `shadow_cross` | **シャドウ・クロス** | `GHOST` | `stealth` (4角手裏剣 隠密・透明化)| 👻 `#aaff66` | `Midnight_Porch_Light.mp3` |
| 8 | `freeze_hexa` | **フリーズ・ヘキサ** | `HEXAGON` | `freeze` (正六角形 手前1秒停止)| ⏸️ `#00ccff` | `Cyan_Square_Error.mp3` |
| 9 | `orbit_octa` | **オービット・オクタ** | `RING_NOTE` | `orbit` (正八角形 大円弧公転) | 🔷 `#3355ff` | `Cyan_Square_Error.mp3` |
| 10 | `bound_penta` | **バウンド・ペンタ** | `PENTAGON` | `bound` (正五角形 ジグザグステップ)| 🦘 `#00ff66` | `Magenta_Pulse.mp3` |

---

## 5. 🔵 NORMAL モード ステージ全 6 種カタログ

複合軌道、シールド（HP2）、ボス（HP5連打）、ドントタップなどの実戦ギミックに挑む標準コースです。

| # | ID | ステージ名 | 出現エネミー Pool | 主な難易度要素・テーマ | テーマカラー | BGM |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| 1 | `neon_duo` | **ネオン・デュオ** | `CHASER`, `SPEEDER` | 直進 ✕ 高速★星型の交錯 | シアン | `Sharp_Suits_on_the_Avenue.mp3` |
| 2 | `wave_curve` | **ウェイブ & カーブ** | `CURVE`, `SINE_WAVE` | 旋回 ✕ S字波状のダブル曲線 | シアン | `Cyan_Square_Error.mp3` |
| 3 | `shield_break` | **シールド・ブレイク** | `CHASER`, `CHASER(hp:2)` | 初登場！HP2耐久バリアシールド | シアン | `Under_The_Hammer.mp3` |
| 4 | `barrier_tricks` | **バリア・トリックス** | `GLITCH`, `CROSS`, `CHASER(hp:2)`| 減速 ✕ Uターン ✕ 耐久シールド | 紫 | `Magenta_Pulse.mp3` |
| 5 | `stealth_orbit` | **シャドウ・オービット**| `RING_NOTE`, `GHOST`, `CHASER(hp:2)`| 公転 ✕ 透明化 ✕ 耐久シールド | 紺 | `Midnight_Porch_Light.mp3` |
| 6 | `allstar_normal` | **オールスター・ノーマル**| 全幾何学10種 ✕ シールド | NORMALモード総決算オールスター | シアン | `Under_The_Lanterns.mp3` |

---

## 6. 🔴 HARD モード ステージカタログ

| # | ID | ステージ名 | 出現エネミー Pool | 主な難易度要素・テーマ | テーマカラー | BGM |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| 1 | `bolt_overdrive` | **ボルト・オーバードライブ**| `CHASER`, `SPEEDER`, `SHIELD`| 爆速高密度アプローチ ✕ 激ムズ | 濃赤 | `Magenta_Pulse.mp3` |

---

## 7. 🤪 FUNNY モード ステージ全 13 種カタログ

賑やかで可愛い動物、回転寿司、満開夜桜、花火、お祭りテーマが目白押しのバラエティコースです。

| # | ID | ステージ名 | 出現エネミー Pool | テーマ・お楽しみ要素 | テーマカラー | BGM |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| 1 | `rotating_sushi` | **天下無敵の回転寿司** | `SUSHI` | マグロ・サーモン・エビ・たまご回転寿司 🍣 | 朱赤 | `Under_The_Hammer.mp3` |
| 2 | `trick_festival` | **トリッキー・フェスティバル！**| `CHASER`, `SPEEDER`, `GLITCH`, `CROSS`, `CHASER(hp:2)`| ドントタップ・バリア・減速・公転カオス 🎪| 紫 | `Magenta_Pulse.mp3` |
| 3 | `dangerous_survival`| **デンジャラス・サバイバル**| `HEAL`, `BOMB`, `FIREWORK`, `CAT`, `CHASER`| 爆弾 ✕ 回復ハート ✕ 花火サバイバル 💣 | 危険赤 | `Under_The_Lanterns.mp3` |
| 4 | `sea_slug_paradise`| **海の宝石ウミウシパラダイス**| `SEA_SLUG` | ウミウシ全8種 ✕ 水泡アクアリウム 🐚 | 深海ブルー | `Petals_on_the_Controller.mp3` |
| 5 | `sakura_blossom` | **満開の夜桜乱舞** | `SAKURA_PETAL` | 画面下部で本物の桜が満開に咲き乱れる 🌸 | 夜桜紫 | `Petals_on_the_Controller.mp3` |
| 6 | `summer_fireworks`| **たまや〜！夏の大輪花火**| `FIREWORK` | 夜空にドカンと大輪の花火が咲き誇る 🎆 | 黄金 | `Blood_and_Bamboo.mp3` |
| 7 | `dog_march` | **わんわん大行進！** | `DOG` | 尻尾フリフリ元気な柴犬大行進 🐕 | 橙 | `Under_The_Hammer.mp3` |
| 8 | `cat_festival` | **ネコ・フェスティバル** | `CAT` | ニャーとトコトコ歩くねこ大集合 🐱 | 桃 | `Petals_on_the_Controller.mp3` |
| 9 | `chicken_panic` | **ヒヨコ・パニック** | `CHICKEN` | チョコチョコ歩くぴよぴよヒヨコ 🐥 | 黄 | `Petals_on_the_Controller.mp3` |
| 10 | `animal_parade` | **どうぶつ大行進♪** | `CAT`, `CHICKEN`, `DOG`, `BEE`, `FROG`| ねこ・ヒヨコ・柴犬・蜂・蛙が全員集合 🐾| 橙 | `Under_The_Hammer.mp3` |
| 11 | `rainbow_chaser` | **レインボー・チェイサー**| `CHASER` | 画面背景全域が七色に変色 🌈 | 紫(レインボー) | `Cyan_Square_Error.mp3` |
| 12 | `san_san_nana` | **三・三・七拍子** | `CHASER` | 和風手拍子リズムスポーン 👏 (`san_san_nana`)| 橙 | `Blood_and_Bamboo.mp3` |
| 13 | `real_cats` | **リアルねこ集会** | `CAT` | リアルな茶トラ ＆ ハチワレねこ 🐾 | ブラウン | `Under_The_Lanterns.mp3` |

---

## 8. 新規ステージ追加手順ガイド (How to Add New Stage)

新しいステージを作成してゲームに組み込む手順は以下の **2 ステップ** です。

1. **ステージ JSON ファイルの作成**:
   - `stages/[難易度フォルダ]/[stage_id].json` を作成し、本ドキュメント第3項の標準 JSON スキーマに従って保存します。
2. **マスターリスト (`stages/index.json`) への登録**:
   - `stages/index.json` の該当難易度（例: `"FUNNY"`）の `stages` 配列に、作成したファイルの相対パス（例: `"stages/funny/my_new_stage.json"`）を追加します。
