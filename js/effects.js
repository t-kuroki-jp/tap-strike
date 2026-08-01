/**
 * 背景ビジュアルエフェクト（Visual Effects）のレジストリ・プラグイン管理クラス
 */
class VisualEffectManager {
    constructor() {
        this.effects = {};
        this.initDefaultEffects();
    }

    /**
     * 標準組込ビジュアルエフェクトの登録
     */
    initDefaultEffects() {
        // 1. 🫧 浮遊水泡アクアリウムエフェクト (ウミウシ等)
        this.registerEffect('bubble', {
            start: () => {
                if (typeof uiManager !== 'undefined') uiManager.toggleBubbleEffect(true);
            },
            stop: () => {
                if (typeof uiManager !== 'undefined') uiManager.toggleBubbleEffect(false);
            }
        });

        // 2. 🌸 満開夜桜吹雪エフェクト (夜桜の舞等)
        this.registerEffect('sakura', {
            start: () => {
                if (typeof uiManager !== 'undefined') uiManager.toggleSakuraEffect(true);
            },
            stop: () => {
                if (typeof uiManager !== 'undefined') uiManager.toggleSakuraEffect(false);
            }
        });

        // 3. 🌈 七色サイバーレインボー背景 (レインボーチェイサー等)
        this.registerEffect('rainbow', {
            start: () => {
                if (typeof uiManager !== 'undefined') uiManager.toggleRainbowEffect(true);
            },
            stop: () => {
                if (typeof uiManager !== 'undefined') uiManager.toggleRainbowEffect(false);
            }
        });
    }

    /**
     * 新しいカスタムエフェクトを動的登録するプラグインAPI
     * @param {string} name - エフェクト識別ID
     * @param {Object} effectObj - { start: Function, stop: Function }
     */
    registerEffect(name, effectObj) {
        if (effectObj && typeof effectObj.start === 'function' && typeof effectObj.stop === 'function') {
            this.effects[name] = effectObj;
        }
    }

    /**
     * テーマ設定オブジェクトからエフェクト配列を抽出し、一括有効化/停止
     * @param {Object} theme - ステージのテーマオブジェクト
     */
    applyEffects(theme = {}) {
        const activeEffects = new Set();

        // 汎用配列 effects: ["bubble", "sakura"] から読み込み
        if (Array.isArray(theme.effects)) {
            theme.effects.forEach(e => activeEffects.add(e));
        }

        // 旧フラグ形式（後換性フォールバック）
        if (theme.bubbleEffect) activeEffects.add('bubble');
        if (theme.sakuraEffect) activeEffects.add('sakura');
        if (theme.rainbow) activeEffects.add('rainbow');

        // 1. まず全てのエフェクトを安全に停止
        Object.values(this.effects).forEach(e => e.stop());

        // 2. 指定されたアクティブエフェクトのみを一括起動！
        activeEffects.forEach(name => {
            if (this.effects[name]) {
                this.effects[name].start();
            }
        });
    }

    /**
     * すべてのエフェクトを停止（ステージ終了・リセット用）
     */
    stopAll() {
        Object.values(this.effects).forEach(e => e.stop());
    }
}

const effectManager = new VisualEffectManager();
