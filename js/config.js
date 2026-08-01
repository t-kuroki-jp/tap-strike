/**
 * タップストライク 共通設定・定数モジュール (CONFIG)
 * マジックナンバーやデフォルトパラメータを一箇所で一括管理
 */
const CONFIG = Object.freeze({
    // 判定パラメータ (Hit Windows)
    HIT: {
        PERFECT_WINDOW_PX: 8,          // PERFECT判定の許容誤差(px)
        DEFAULT_HIT_WINDOW_PX: 25,      // 通常HIT判定の許容誤差(px)
        DEFAULT_TAP_COOLDOWN_MS: 80,    // 連打防止タップクールダウン(ms)
        DEFAULT_MISS_PENALTY_TICKS: 10  // ミス時の赤発光・ペナルティ維持フレーム数
    },

    // プレイヤー & 判定リングデフォルト値
    PLAYER: {
        DEFAULT_RADIUS: 20,            // 自機コア半径(px)
        DEFAULT_TARGET_RADIUS: 60,     // 判定リング基本半径(px)
        DEFAULT_MAX_HP: 3,             // 基本最大HP
        DEFAULT_COLOR: '#00f0ff'       // 基本テーマカラー
    },

    // ゲーム物理 & グラフィック設定
    GAME: {
        DEFAULT_BASE_SCORE: 100,
        DEFAULT_SPEED_INCREMENT: 0.01,
        DEFAULT_PARTICLE_COUNT: 18,
        DEFAULT_SPAWN_RATE_MS: 187,
        CANVAS_MAX_WIDTH: 500
    }
});
