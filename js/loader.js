/**
 * JSON定義（難易度、敵マスタ、バリエーション）の非同期取得およびパラメータ合成管理クラス
 */
class DataLoader {
    constructor() {
        this.enemiesMaster = {};
        this.difficultiesMaster = {};
        this.variations = [];
    }

    async loadAll() {
        await this.loadEnemies();
        await this.loadDifficulties();
        await this.loadVariations();
    }

    async loadEnemies() {
        try {
            const res = await fetch(`enemies.json?t=${Date.now()}`);
            this.enemiesMaster = await res.json();
        } catch (e) {
            console.error('Failed to load enemies.json', e);
        }
    }

    async loadDifficulties() {
        try {
            const res = await fetch(`difficulties.json?t=${Date.now()}`);
            this.difficultiesMaster = await res.json();
        } catch (e) {
            console.error('Failed to load difficulties.json', e);
        }
    }

    async loadVariations() {
        try {
            const listRes = await fetch(`variations.json?t=${Date.now()}`);
            const filePaths = await listRes.json();

            this.variations = [];
            for (const path of filePaths) {
                try {
                    const varRes = await fetch(`${path}?t=${Date.now()}`);
                    const varData = await varRes.json();
                    this.variations.push(varData);
                } catch (e) {
                    console.error(`Failed to load variation at ${path}`, e);
                }
            }
        } catch (e) {
            console.error('Failed to load variations list', e);
        }
    }

    /**
     * 難易度デフォルト設定とバリエーション個別設定を合成
     */
    getResolvedParams(variation) {
        if (!variation) return {};
        const diffDef = this.difficultiesMaster[variation.difficulty] || {};

        return {
            targetRadius: variation.gameplay?.targetRadius ?? diffDef.gameplay?.targetRadius ?? 60,
            hitWindow: variation.gameplay?.hitWindow ?? diffDef.gameplay?.hitWindow ?? 25,
            tapCooldown: variation.gameplay?.tapCooldown ?? diffDef.gameplay?.tapCooldown ?? 180,
            speedIncrement: variation.gameplay?.speedIncrement ?? diffDef.gameplay?.speedIncrement ?? 0.008,
            baseScore: variation.gameplay?.baseScore ?? diffDef.gameplay?.baseScore ?? 100,
            maxHp: variation.player?.maxHp ?? diffDef.player?.maxHp ?? 1,
            missPenaltyDuration: variation.player?.missPenaltyDuration ?? diffDef.player?.missPenaltyDuration ?? 18,
            particleCount: variation.visuals?.particleCount ?? diffDef.visuals?.particleCount ?? 12,
            bgScrollSpeed: variation.visuals?.bgScrollSpeed ?? diffDef.visuals?.bgScrollSpeed ?? '3s'
        };
    }
}

const dataLoader = new DataLoader();
