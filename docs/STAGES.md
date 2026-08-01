# 『Tap Strike』 全ステージ ＆ JSON スキーマ仕様書 (Stages Catalog & Schema Guidelines)

---

## 1. 概要 (Overview)

本ドキュメントは『Tap Strike』に登場する全ステージの構成リスト、および新しいステージを作成・追加する際の **JSON スキーマ規格（記載ルール標準）** を一元管理する仕様書です。

ステージ設定はデータ駆動（Data-Driven Architecture）となっており、マスター登録簿 `stages/index.json` を起点として `stages/` ディレクトリ配下の各ステージ JSON ファイルが読み込まれます。

---

## 2. 🎛️ 難易度マスター規格 (`stages/index.json`)

全ステージの統合マニフェストファイル `stages/index.json` は、全コースの登録リスト (`stages`) と、各難易度（EASY / NORMAL / HARD / FUNNY）の **標準デフォルトパラメータ (`params`)** および **標準カラーテーマ (`theme`)** を一元管理します。

```json
{
  "EASY": {
    "params": {
      "gameSpeed": 0.85,          // 初期ゲーム速度
      "spawnRate": 230,           // ノーツ出撃タイマー(ms)
      "targetRadius": 60,         // 判定リングサイズ(px)
      "maxHp": 3,                 // プレイヤー初期最大HP
      "hitWindow": 24,            // HIT判定の許容ピクセル幅(px)
      "tapCooldown": 50,          // タップクールダウン(ms)
      "speedIncrement": 0.008,    // ノーツ撃破ごとの加速量
      "baseScore": 10             // 1体撃破あたりの基礎獲得スコア
    },
    "theme": {
      "bgGlow": "rgba(0, 240, 255, 0.25)",
      "gridColor": "rgba(0, 240, 255, 0.3)",
      "ringColor": "#00f0ff",
      "playerColor": "#00f0ff"
    },
    "stages": [
      "stages/easy/straight_circle.json"
    ]
  }
}
```

### 📌 全難易度共通標準 `params` 一覧表

| 難易度 | ゲーム速度 (`gameSpeed`) | 出撃タイマー (`spawnRate`) | 初期HP (`maxHp`) | 判定リング半径 (`targetRadius`) | 当たり判定幅 (`hitWindow`) | 連打CD (`tapCooldown`) | 撃破加速量 (`speedIncrement`) | 基礎スコア (`baseScore`) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **EASY** | `0.85` | `230ms` | `3` | `60px` | `24px` | `50ms` | `0.008` | `10` |
| **NORMAL** | `0.85` | `210ms` | `3` | `60px` | `24px` | `50ms` | `0.008` | `10` |
| **HARD** | `0.85` | `160ms` | `3` | `60px` | `24px` | `50ms` | `0.008` | `10` |
| **FUNNY** | `0.85` | `230ms` | `3` | `60px` | `24px` | `50ms` | `0.008` | `10` |

### 🎨 難易度別標準 `theme` (ビジュアルカラー) 一覧表

個別ステージで `theme` が省略された場合、本マスタ定義の標準ネオンカラーが全自動でマージ適用されます。

| 難易度 | 中央グロー発光 (`bgGlow`) | 背景グリッド線 (`gridColor`) | 判定リング発光色 (`ringColor`) | プレイヤーリング色 (`playerColor`) | メインイメージ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **EASY** | `rgba(0, 240, 255, 0.25)` | `rgba(0, 240, 255, 0.3)` | `#00f0ff` | `#00f0ff` | ネオンシアンブルー |
| **NORMAL** | `rgba(0, 240, 255, 0.25)` | `rgba(0, 240, 255, 0.3)` | `#00f0ff` | `#00f0ff` | ネオンシアンブルー |
| **HARD** | `rgba(255, 0, 85, 0.25)` | `rgba(255, 0, 85, 0.3)` | `#ff0055` | `#ff0055` | 危険・挑戦のビビッドレッド |
| **FUNNY** | `rgba(255, 170, 51, 0.25)` | `rgba(255, 170, 51, 0.3)` | `#ffaa33` | `#ffaa33` | お祭り・ポップオレンジ |

> 💡 **FUNNY モードの `NEW!` バッジ ＆ 表示順仕様**:
> マスター登録簿 `stages/index.json` の `"FUNNY"` 内 `stages` 配列に書かれた並び順そのままで画面に表示され、**一番上（先頭 3 ステージ）に自動で金色の `NEW!` バッジ** が付与されます。新しいステージを `stages/index.json` の `"FUNNY"` 内 `stages` 配列の先頭（上）に追加していく運用です。日付等の手書き属性は一切不要です。

---

## 3. 📐 個別ステージ JSON 標準スキーマ規格 (Standard Stage Schema)

新しいステージを作成・編集する際、個別のステージ JSON が持つべき基本的な標準プロパティは **以下の 5 つのみ** です。共通の物理パラメータ (`params` / `spawnRate`) やカラーテーマ (`theme`) は `stages/index.json` のマスタから自動補填されるため省略可能です（特殊な演出・ペース・色の時のみ指定してオーバーライドします）。

```json
{
  "id": "straight_circle",
  "name": "ストレート・サークル",
  "difficulty": "EASY",
  "description": "🔴 赤色のネオン正円ノーツ！画面外から判定リングへ一直線にアプローチ！",
  "enemyPool": [
    { "id": "CHASER", "behavior": "straight" }
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
| **`enemyPool`** | `array` | **必須** | ステージで出撃するエネミーノーツの抽選プール。 | `[{ "id": "CHASER", "weight": 1 }]` |
| **`spawnRate`** | `number` | *任意* | ノーツ出撃タイマー（ミリ秒）。省略時はマスタ難易度定義を適用。 | `230` (標準) / `160` (高速) |
| **`spawnPattern`**| `string` | *任意* | 特殊ノーツ出現リズムパターン指定。 | `"san_san_nana"` (三三七拍子) |
| **`theme`** | `object` | *任意* | ステージ固有の特別カラーテーマ ＆ ビジュアル演出フラグ。 | 下記参照 |
| ↳ **`bgGlow`** | `string` | *任意* | キャンバス中央の円形グラデーション背景グロー発光色 (`rgba`)。 | `"rgba(0, 240, 255, 0.25)"` |
| ↳ **`gridColor`** | `string` | *任意* | キャンバス全域の放射状背景グリッドライン描画色 (`rgba`)。 | `"rgba(0, 240, 255, 0.3)"` |
| ↳ **`ringColor`** | `string` | *任意* | 判定ターゲットリング外枠のネオン発光カラーコード (HEX)。 | `"#00f0ff"` |
| ↳ **`playerColor`** | `string` | *任意* | 自機プレイヤー判定リングのメインカラーコード (HEX)。 | `"#00f0ff"` |
| ↳ **`effects`** | `array` | *任意* | 背景ビジュアルエフェクトプラグイン指定配列 (`"bubble"`, `"sakura"`, `"rainbow"` 等)。 | `["bubble"]` / `["sakura"]` |
| **`params`** | `object` | *任意* | ステージ固有の特別物理パラメータ（省略時はマスタ定義を自動適用）。 | 下記参照 |
| ↳ **`gameSpeed`**| `number` | *任意* | ステージ開始時の初期ゲームスクロール速度。 | `0.85` (標準) / `0.9` (やや高速) |
| ↳ **`speedIncrement`**| `number`| *任意* | ノーツ 1 体撃破ごとの加速上昇量。 | `0.008` (標準) |
| ↳ **`targetRadius`**| `number`| *任意* | 判定ターゲットリングの半径（ピクセル）。 | `60` |
| ↳ **`maxHp`** | `number` | *任意* | プレイヤーの最大ライフ（ハート数）。 | `3` |
| ↳ **`hitWindow`** | `number` | *任意* | HIT判定許容ピクセル幅。 | `24` |
| ↳ **`tapCooldown`**| `number`| *任意* | 連打タップのクールダウンミリ秒。 | `50` |
| ↳ **`baseScore`**| `number` | *任意* | ノーツ 1 体あたりの基礎獲得スコア。 | `100` |

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

## 7. 🤪 FUNNY モード ステージ全 12 種カタログ

賑やかで可愛い動物、回転寿司、満開夜桜、花火、お祭りテーマが目白押しのバラエティコースです。

| # | ID | ステージ名 | 出現エネミー Pool | テーマ・お楽しみ要素 | テーマカラー | BGM |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| 1 | `sea_slug_paradise`| **海の宝石ウミウシパラダイス**| `SEA_SLUG` | ウミウシ全8種 ✕ 水泡アクアリウム 🐚 | 深海ブルー | `Petals_on_the_Controller.mp3` |
| 2 | `sakura_blossom` | **満開の夜桜乱舞** | `SAKURA_PETAL` | 画面下部で本物の桜が満開に咲き乱れる 🌸 | 夜桜紫 | `Petals_on_the_Controller.mp3` |
| 3 | `summer_fireworks`| **たまや〜！夏の大輪花火**| `FIREWORK` | 夜空にドカンと大輪の花火が咲き誇る 🎆 | 黄金 | `Sharp_Suits_on_the_Avenue.mp3` |
| 4 | `rotating_sushi` | **天下無敵の回転寿司** | `SUSHI` | マグロ・サーモン・エビ・たまご回転寿司 🍣 | 朱赤 | `Under_The_Hammer.mp3` |
| 5 | `trick_festival` | **トリッキー・フェスティバル！**| `GLITCH`, `CURVE`, `SINE_WAVE`, `GHOST`| ドントタップ・バリア・減速・公転カオス 🎪| 紫 | `Magenta_Pulse.mp3` |
| 6 | `dangerous_survival`| **デンジャラス・サバイバル**| `CHASER`, `BOMB`| 爆弾 ✕ サバイバル 💣 | 危険赤 | `Under_The_Hammer.mp3` |
| 7 | `dog_march` | **わんわん大行進！** | `DOG` | 尻尾フリフリ元気な柴犬大行進 🐕 | 橙 | `Sharp_Suits_on_the_Avenue.mp3` |
| 8 | `cat_festival` | **ネコ・フェスティバル** | `CAT` | ニャーとトコトコ歩くねこ大集合 🐱 | 桃 | `Petals_on_the_Controller.mp3` |
| 9 | `chicken_panic` | **ヒヨコ・パニック** | `CHICKEN` | チョコチョコ歩くぴよぴよヒヨコ 🐥 | 黄 | `Petals_on_the_Controller.mp3` |
| 10 | `animal_parade` | **どうぶつ大行進♪** | `CAT`, `CHICKEN`, `DOG`, `BEE`, `FROG`| ねこ・ヒヨコ・柴犬・蜂・蛙が全員集合 🐾| 橙 | `Under_The_Hammer.mp3` |
| 11 | `rainbow_chaser` | **レインボー・チェイサー**| `CHASER` | 画面背景全域が七色に変色 🌈 | 紫(レインボー) | `Cyan_Square_Error.mp3` |
| 12 | `san_san_nana` | **三・三・七拍子** | `CHASER` | 和風手拍子リズムスポーン 👏 (`san_san_nana`)| 橙 | `Blood_and_Bamboo.mp3` |

---

## 8. 新規ステージ追加手順ガイド (How to Add New Stage)

新しいステージを作成してゲームに組み込む手順は以下の **2 ステップ** です。

1. **ステージ JSON ファイルの作成**:
   - `stages/[難易度フォルダ]/[stage_id].json` を作成し、本ドキュメント第3項の標準 JSON スキーマに従って保存します。
2. **マスターリスト (`stages/index.json`) への登録**:
   - `stages/index.json` の該当難易度（例: `"FUNNY"`）の `stages` 配列に、作成したファイルの相対パス（例: `"stages/funny/my_new_stage.json"`）を追加します。
