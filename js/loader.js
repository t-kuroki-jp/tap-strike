/**
 * JSON定義（難易度、敵マスタ、ステージ）の非同期取得およびパラメータ合成管理クラス
 */
class DataLoader {
    constructor() {
        this.enemiesMaster = {};
        this.difficultiesMaster = {};
        this.stages = [];
        this.isLoaded = false;
        this.loadingPromise = null;
    }

    async loadAll() {
        if (this.isLoaded) return;
        if (this.loadingPromise) return this.loadingPromise;

        this.loadingPromise = (async () => {
            await Promise.all([
                this.loadEnemies(),
                this.loadDifficulties(),
                this.loadStages()
            ]);
            this.isLoaded = true;
        })();

        return this.loadingPromise;
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

    async loadStages() {
        try {
            const listRes = await fetch(`stages.json?t=${Date.now()}`);
            const filePaths = await listRes.json();

            const stagePromises = filePaths.map(async (path) => {
                try {
                    const stageRes = await fetch(`${path}?t=${Date.now()}`);
                    return await stageRes.json();
                } catch (e) {
                    console.error(`Failed to load stage at ${path}`, e);
                    return null;
                }
            });

            const results = await Promise.all(stagePromises);
            this.stages = results.filter(s => s !== null);
        } catch (e) {
            console.error('Failed to load stages list', e);
        }
    }

    /**
     * 難易度デフォルト設定とステージ個別設定を合成
     */
    getResolvedParams(stage) {
        if (!stage) return {};
        const diffDef = this.difficultiesMaster[stage.difficulty] || {};

        return {
            targetRadius: stage.gameplay?.targetRadius ?? diffDef.gameplay?.targetRadius ?? 65,
            hitWindow: stage.gameplay?.hitWindow ?? diffDef.gameplay?.hitWindow ?? 25,
            tapCooldown: stage.gameplay?.tapCooldown ?? diffDef.gameplay?.tapCooldown ?? 120,
            speedIncrement: stage.gameplay?.speedIncrement ?? diffDef.gameplay?.speedIncrement ?? 0.008,
            baseScore: stage.gameplay?.baseScore ?? diffDef.gameplay?.baseScore ?? 100,
            maxHp: stage.player?.maxHp ?? diffDef.player?.maxHp ?? 3,
            missPenaltyDuration: stage.player?.missPenaltyDuration ?? diffDef.player?.missPenaltyDuration ?? 12,
            particleCount: stage.visuals?.particleCount ?? diffDef.visuals?.particleCount ?? 16,
            bgScrollSpeed: stage.visuals?.bgScrollSpeed ?? diffDef.visuals?.bgScrollSpeed ?? '3s'
        };
    }
}

const dataLoader = new DataLoader();
