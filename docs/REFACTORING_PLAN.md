# 『Tap Strike』 リファクタリング & 設計改善計画書 (Refactoring Plan)

---

## 🎯 概要 (Overview)

EASY・NORMAL モードの全ステージおよび基本10大ノーツ動作のシステム開発が一段落したこのタイミングで、**コードの保守性・視認性・拡張性・バグ予防** を目的としたリファクタリング計画を策定します。

---

## 🧐 現状のコード分析 & 主な課題 (Current System Analysis)

| 対象コンポーネント | 現状の実装 | 潜在的課題 / 懸念点 |
| :--- | :--- | :--- |
| **`js/game.js`** | ゲームエンジン（描画ループ・判定）と UI制御（DOM操作・モーダル切替・図鑑HTML生成）が同一クラスに同居（640行超） | 責務の混在によりコードが肥大化。UI変更時にゲームエンジン側を汚損するリスクがある。 |
| **状態管理 (State Management)** | `isGameStarted`, `isGameOver`, `isPaused` の 3 つの分散 boolean フラグ | 不正な状態（例: ポーズ中にゲームオーバー判定が重複発火）などのフラグ不整合バグのリスク。 |
| **パラメータ & 定数** | PERFECT判定幅 (`8px`), 判定リング半径 (`60px`), 出現距離等のマジックナンバーがコード各所に散在 | バランス調整時に複数ファイルを横断して修正が必要になる。 |
| **タイマー & スポーン同期** | `setInterval` による定時間ノーツスポーン処理 | ブラウザのタブ非アクティブ化時やポーズ復帰時にアニメーションフレームとの同期ズレが生じるリスク。 |

---

## 🚀 提案する 4つのリファクタリングフェーズ (Refactoring Phases)

### 🔷 Phase 1: 責務の分離 (Separation of Concerns - `UIManager` 導入)
`game.js` から DOM / UI 制御ロジックを分離し、独立した `UIManager` (`js/ui.js`) に委譲します。

- **`js/ui.js` の役割**:
  - モーダル表示切替 (`showModal`, `hideAllModals`)
  - ステージ選択カードの動的生成 (`renderStageMenu`)
  - キャラクター図鑑カードの動的生成 (`renderCharacterList`)
  - スコア / コンボ / HP の HUD 表示更新 (`updateUI`)
- **効果**: `game.js` は純粋な物理更新・ヒット判定・Canvas描画に集中し、可読性とテスト容易性が大幅向上。

---

### 🔷 Phase 2: 状態管理の一元化 (State Machine - `GameState` 導入)
散在する boolean フラグを排除し、単一の `GameState` enum による明確なステートマシンへ刷新します。

- **定義する GameState**:
  - `GameState.MODE_SELECT` (モード選択画面)
  - `GameState.STAGE_SELECT` (ステージ選択画面)
  - `GameState.CHARACTER_LIST` (キャラクター図鑑)
  - `GameState.PLAYING` (ゲームプレイ中)
  - `GameState.PAUSED` (一時停止中)
  - `GameState.GAME_OVER` (ゲームオーバー)
- **効果**: 不正な遷移や不整合状態の発生を 100% 構造的に遮断。

---

### 🔷 Phase 3: 定数・設定モジュールの集約 (`CONFIG` 導入)
マジックナンバー（直書き数値）を `js/config.js` へ一括集約します。

- **集約項目**:
  - 判定パラメータ: `PERFECT_WINDOW_PX: 8`, `DEFAULT_HIT_WINDOW: 25`
  - プレイヤー初期値: `DEFAULT_PLAYER_RADIUS: 20`, `DEFAULT_TARGET_RADIUS: 60`
  - 敵スポーン: `SPAWN_DISTANCE_RATIO: 0.6`
- **効果**: 全体の難易度調整やシステムパラメータ変更が 1 つのファイルで一発完結。

---

### 🔷 Phase 4: タイマー & 音声同期の堅牢化 (Robust Timer & Spawn Sync)
- **内容**:
  - `setInterval` の呼び出しおよび破棄 (`clearInterval`) をステート変更時と100%連動させ、ポーズ復帰時にノーツが重なってスポーンする挙動を防止。
  - Web Audio API (`audioEngine`) との連携ロジックをよりクリアにカプセル化。

---

## 📋 リファクタリング実施ロードマップ (Action Plan)

1. [x] **Phase 1: `js/ui.js` の作成** (DOM / モーダル操作 / HUD制御の完全切り出し)
2. [x] **Phase 2: `js/game.js` の状態管理一元化** (`GameState` Enum 導入による堅牢なステート遷移)
3. [x] **Phase 3: `js/config.js` の作成** (判定幅・基本半径・描画最大幅などの定数集約)
4. [x] **Phase 4: タイマー & バックグラウンド保護堅牢化** (`visibilitychange` 自動ポーズ & 重複破棄)
5. [x] **全フェーズ動作検証 & GitHub Push** (EASY / NORMAL ステージの完全正常動作確認完了)

---
