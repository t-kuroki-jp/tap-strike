/**
 * ノーツ出撃リズムパターン（Spawn Patterns）のレジストリ・プラグイン管理クラス
 */
class SpawnPatternRegistry {
    constructor() {
        // [1 = ノーツ出撃, 0 = 休符] のパターン定義テーブル
        this.patterns = {
            // 日本伝統の三三七拍子 (3拍 + 休 + 3拍 + 休休 + 7拍連打 + 休休休休 = 20ステップ)
            san_san_nana: [
                1, 1, 1, 0,       // タン・タン・タン・休
                1, 1, 1, 0, 0,    // タン・タン・タン・休・休
                1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 // タンタンタンタンタンタンタン・休休休休
            ],
            // 4/4拍子の裏打ち (裏拍出撃)
            backbeat: [0, 1, 0, 1],
            // 3拍子 (ワルツ)
            waltz: [1, 0, 0],
            // 4拍連打 ＋ 4拍休符
            burst: [1, 1, 1, 1, 0, 0, 0, 0]
        };
    }

    /**
     * 指定されたパターン名と現在のステップ数から、ノーツを出撃させるべきかを判定
     * @param {string} patternName - パターン識別ID
     * @param {number} stepIndex - 現在の経過ステップ数
     * @returns {boolean} 出撃すべきなら true
     */
    shouldSpawn(patternName, stepIndex) {
        if (!patternName || !this.patterns[patternName]) {
            return true; // パターン指定がないか未知のパターンなら通常毎ステップ出撃
        }

        const pattern = this.patterns[patternName];
        const step = stepIndex % pattern.length;
        return pattern[step] === 1;
    }

    /**
     * 新しいカスタムパターンを動的追加（拡張用API）
     */
    registerPattern(name, patternArray) {
        if (Array.isArray(patternArray)) {
            this.patterns[name] = patternArray;
        }
    }
}

const patternRegistry = new SpawnPatternRegistry();
