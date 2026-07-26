/**
 * JSON定義（難易度、ステージ）の非同期取得およびパラメータ合成管理クラス
 */
class DataLoader {
    constructor() {
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
                this.loadDifficulties(),
                this.loadStages()
            ]);
            this.isLoaded = true;
        })();

        return this.loadingPromise;
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

            const loadedStages = await Promise.all(stagePromises);
            this.stages = loadedStages.filter(s => s !== null);
        } catch (e) {
            console.error('Failed to load stages.json', e);
        }
    }

    getMergedParams(stageId) {
        const stage = this.stages.find(s => s.id === stageId) || {};
        const difficulty = this.difficultiesMaster[stage.difficulty] || {};
        const p = difficulty.player || {};
        const g = difficulty.gameplay || {};
        const v = difficulty.visuals || {};

        return {
            targetRadius: stage.targetRadius ?? g.targetRadius ?? 65,
            maxHp: stage.maxHp ?? p.maxHp ?? 3,
            baseScore: stage.baseScore ?? g.baseScore ?? 100,
            speedIncrement: stage.speedIncrement ?? g.speedIncrement ?? 0.01,
            hitWindow: stage.hitWindow ?? g.hitWindow ?? 25,
            missPenaltyDuration: stage.missPenaltyDuration ?? p.missPenaltyDuration ?? 10,
            particleCount: stage.particleCount ?? v.particleCount ?? 18,
            tapCooldown: stage.tapCooldown ?? g.tapCooldown ?? 80,
            bgScrollSpeed: stage.bgScrollSpeed ?? v.bgScrollSpeed ?? '3s'
        };
    }

    getResolvedParams(stage) {
        if (!stage) return this.getDefaultParams();
        const stageId = typeof stage === 'string' ? stage : stage.id;
        return this.getMergedParams(stageId);
    }

    getDefaultParams() {
        return {
            targetRadius: 65,
            maxHp: 3,
            baseScore: 100,
            speedIncrement: 0.01,
            hitWindow: 25,
            missPenaltyDuration: 10,
            particleCount: 18,
            tapCooldown: 80,
            bgScrollSpeed: '3s'
        };
    }
}

const dataLoader = new DataLoader();
