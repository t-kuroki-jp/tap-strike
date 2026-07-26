# 『Tap Strike』 仕様書・全エネミー & Behavior パラメータ完全カタログ

---

## 1. ゲーム概要 (Game Architecture)

『Tap Strike』は、画面外から中心の「判定リング」に向かってアプローチしてくるノーツ（エネミー）を、タイミング良くタップして破壊する円形全方位リズム・タップゲームです。

### モード体系 (Difficulty Modes)
- 🟢 **EASY モード**: 全 9 種類の移動 Behavior（行動ロジック）を純粋な幾何学ノーツで 1 ステージずつ安全に学べるチュートリアルコース。
- 🔵 **NORMAL モード**: 高速ノーツ、シールド（HP2）、ボス（HP5連打）、ドントタップ（禁止ノーツ）などのゲームルールギミックに挑戦する標準コース。
- 🔴 **HARD モード**: 幾何学ノーツ ✕ 複雑な複合 Behavior の高難易度オーバードライブコース。
- 🤪 **FUNNY モード**: ひよこ、ネコファミリー、回転寿司、花火などの賑やかなキャラクターやテーマ別のお楽しみお祭りコース。

---

## 2. 移動 Behavior (行動ロジック) コンポーネント一覧

`js/behaviors.js` にて単一責任コンポーネントとして一元管理されている全 9 種類の移動アルゴリズムです。

| ID | 名称 | 動作アルゴリズム | 適用ステージ（EASY例） |
| :--- | :--- | :--- | :--- |
| **`straight`** | 直線アプローチ | 画面外から中心の判定リングへ直進 | 🔴 チェイサー / ⚡ スピーダー |
| **`spiral`** | 旋回アプローチ | 中心の周りを渦を巻いて螺旋状に接近 | 🌀 スパイラル・スピナー |
| **`glitch`** | 直前減速 | 判定リングの手前で一瞬ググッと減速 | 👾 ファントム・グリッチ |
| **`wave`** | 波状運動 (S字) | S字サイン波でウネウネ・トコトコ揺れて接近 | 🔷 サイン・ウェイバー |
| **`boomerang`**| ブーメラン・フェイント | 判定手前で外側へすーっと退避後、倍速突入 | 🪃 ブーメラン・クロス |
| **`stealth`** | ステルス・透明化 | 途中で完全に姿を消し、判定直前で実体化 | 🥷 ステルス・ゴースト |
| **`freeze`** | フリーズ・一時停止 | 判定手前で「ピタッ」と1秒停止後ダッシュ | ⏸️ フリーズ・ヘキサ |
| **`orbit`** | オービット・公転 | 判定リングの周りを360度一周ダンス後突入 | 🧲 オービット・リング |
| **`bound`** | バウンド・屈折 | 判定手前で1回だけ「カクッ」と折れ曲がり突入 | 🦘 バウンド・ペンタ |

---

## 3. 全エネミー & ノーツ種類 パラメータ一覧表

全エネミーは `js/enemies/` 配下にカテゴリ別（1カテゴリ1ファイル）でモジュール化されています。

### 🔷 A. サイバー幾何学ノーツ (`js/enemies/geometric.js`)
EASY 〜 HARD モードで登場する、純粋でスタイリッシュなネオン幾何学ノーツ群です。

| エネミー ID | 名称 | 視認デザイン | デフォルト Behavior | スピード比 (`speedRatio`) | HP | 特徴・役割 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`CHASER`** | チェイサー | 🔴 赤色・円形 (丸) | `straight` | `1.0` | 1 | 基本の直進ノーツ。チュートリアル第1弾。 |
| **`SPEEDER`** | スピーダー | ⚡ 黄色・稲妻 (ボルト) | `straight` | `1.5` | 1 | 高速直進ノーツ。NORMALモードでスピード感を体感。 |
| **`GLITCH`** | グリッチ | 👾 紫色・正方形 (四角) | `glitch` | `1.1` | 1 | 手前で減速するトリックノーツ。 |
| **`CURVE`** | スピナー | 🌀 オレンジ・正三角形 | `spiral` | `0.9` | 1 | 螺旋状に回って入ってくる旋回ノーツ。 |
| **`SINE_WAVE`**| サイン・ウェイバー| 🔷 シアン・ひし形 (ダイア) | `wave` | `1.0` | 1 | S字サイン波でゆったり揺れる波状ノーツ。 |
| **`CROSS`** | ブーメラン・クロス| 🪃 ピンク・直角L字 | `boomerang` | `0.95` | 1 | 高速回転しながら手前で引き返すブーメランノーツ。 |
| **`GHOST`** | ステルス・ゴースト| 🥷 ライム・円形塗り | `stealth` | `1.0` | 1 | 途中で透明化して直前に実体化するゴーストノーツ。 |
| **`HEXAGON`** | フリーズ・ヘキサ | ⏸️ シアン・正六角形 | `freeze` | `0.95` | 1 | 判定手前で1秒間ピタッと完全停止するノーツ。 |
| **`RING_NOTE`**| オービット・リング| 🧲 黄色・円環 (リング) | `orbit` | `0.9` | 1 | 判定リングの周りをくるりと360度ダンスするノーツ。|
| **`PENTAGON`** | バウンド・ペンタ | 🦘 グリーン・正五角形 | `bound` | `0.9` | 1 | 判定手前でカクッと90度折れ曲がるバウンドノーツ。 |

---

### 🛡️ B. 特殊・ルールギミックノーツ (各種独立モジュール)
NORMAL モードで登場する、特別なルールや打撃耐性を備えたギミックノーツです。

| エネミー ID | 名称 | ファイル | デフォルト Behavior | スピード比 | HP | 特徴・ルール |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`SHIELD`** | シールド | `shield.js` | `straight` | `0.85` | **2** | 2回タップが必要な青色シールド耐久ノーツ。 |
| **`BIG_BOSS`** | ビッグボス | `big_boss.js` | `straight` | `0.6` | **5** | 巨大紫ボス！判定リング到達前に5連打で撃破！ |
| **`DONT_TAP`** | ドントタップ | `dont_tap.js` | `straight` | `0.8` | 1 | **タップ禁止！** 叩くと即ゲームオーバー。見送り必須。 |
| **`HEAL`** | ヒーラー | `heal.js` | `straight` | `1.0` | 1 | 叩くとライフ回復（ボーナスノーツ）。 |

---

### 🐱 🍣 C. バラエティ・キャラクターノーツ (FUNNYモード専用)
FUNNY モードで登場する、賑やかで可愛いテーマ別キャラクターノーツです。

| エネミー ID | 名称 | ファイル | デフォルト Behavior | スピード比 | HP | 特徴・お楽しみ要素 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`CHICKEN`** | ひよこ | `chicken.js` | `wave` | `0.9` | 1 | チョコチョコ羽をはためかせて歩くぴよぴよヒヨコ。 |
| **`CAT`** | にゃんこ | `cat.js` | `wave` | `0.9` | 1 | 白猫・茶トラ・ハチワレ。しっぽを振り振り歩く！ |
| **`SUSHI`** | 回転寿司 | `sushi.js` | `straight` | `0.8` | 1 | マグロ・サーモン・エビ・たまご等全8種。自転回転寿司！|
| **`BOMB`** | ダイナマイト | `bomb.js` | `straight` | `1.0` | 1 | 爆弾ノーツ。 |
| **`FIREWORK`** | 打上花火 | `firework.js` | `straight` | `1.0` | 1 | タップすると美しく大輪の花火が打ち上がる！ |

---

## 4. 全ステージ構成リスト (`stages.json`)

### 🟢 EASY モード (全9動作・完全幾何学チュートリアル)
1. `stages/easy/normal_chaser.json` ➔ 🔴 丸ノーツ (直進)
2. `stages/easy/spiral_curve.json` ➔ 🌀 三角ノーツ (旋回)
3. `stages/easy/phantom_glitch.json` ➔ 👾 四角ノーツ (直前減速)
4. `stages/easy/sine_wave.json` ➔ 🔷 ひし形ノーツ (波状)
5. `stages/easy/boomerang_cross.json` ➔ 🪃 L字ノーツ (ブーメラン)
6. `stages/easy/stealth_ghost.json` ➔ 🥷 ゴーストノーツ (ステルス)
7. `stages/easy/freeze_hexa.json` ➔ ⏸️ 六角形ノーツ (フリーズ)
8. `stages/easy/orbit_ring.json` ➔ 🧲 リングノーツ (オービット)
9. `stages/easy/bound_penta.json` ➔ 🦘 五角形ノーツ (バウンド)

### 🔵 NORMAL モード (スピード＆ルールギミック)
1. `stages/normal/neon_standard.json` ➔ 標準総合
2. `stages/normal/purple_trick.json` ➔ 幾何学混合
3. `stages/normal/bolt_speeder.json` ➔ ⚡ 高速スピーダー
4. `stages/normal/shield_break.json` ➔ 🛡️ HP2 シールド
5. `stages/normal/big_boss.json` ➔ 👑 HP5 連打ボス
6. `stages/normal/dont_tap.json` ➔ 💀 タップ禁止ルール

### 🔴 HARD モード (高難易度オーバードライブ)
1. `stages/hard/bolt_overdrive.json` ➔ 爆速高難易度

### 🤪 FUNNY モード (キャラクター＆トリッキーフェスティバル)
1. `stages/funny/chicken_panic.json` ➔ 🐥 ひよこパニック
2. `stages/funny/cat_festival.json` ➔ 🐱 ねこちゃん大集合
3. `stages/funny/real_cats.json` ➔ 🐾 リアルキャッツ
4. `stages/funny/rotating_sushi.json` ➔ 🍣 天下無敵の回転寿司
5. `stages/funny/summer_fireworks.json` ➔ 🎆 たまや～！大輪の打ち上げ花火
6. `stages/funny/trick_festival.json` ➔ 🎪 トリッキー・フェスティバル！

---

## 5. モジュール構造とディレクトリレイアウト

```
tap-strike/
├── SPECIFICATION.md          (本仕様書)
├── stages.json               (難易度別全ステージリスト)
├── index.html                (メインHTML・スクリプト読み込み)
├── js/
│   ├── game.js               (メインゲームループ・キャンバス描画・入力判定)
│   ├── behaviors.js          (全9種類 Behavior コンポーネント & BehaviorFactory)
│   ├── audio.js              (SE / BGM 音響WebAudioマネージャー)
│   ├── loader.js             (画像・ステージJSONローダー)
│   ├── entities.js           (プレイヤー判定リング・パーティクルエフェクト)
│   └── enemies/
│       ├── enemy.js          (敵の基底抽象クラス Enemy)
│       ├── geometric.js      (サイバー幾何学ノーツ全10種一括集約)
│       ├── shield.js         (HP2 シールドノーツ)
│       ├── big_boss.js       (HP5 ボスノーツ)
│       ├── dont_tap.js       (タップ禁止ノーツ)
│       ├── heal.js           (ライフ回復ノーツ)
│       ├── chicken.js        (ひよこ)
│       ├── cat.js            (ネコファミリー全種集約)
│       ├── sushi.js          (回転寿司全8種集約)
│       ├── bomb.js           (ダイナマイト)
│       ├── firework.js       (打ち上げ花火)
│       └── enemy_factory.js  (エネミー動的生成 ＆ Behavior動的適用工場)
└── stages/                   (各モードの JSON ステージ定義ファイル群)
```
