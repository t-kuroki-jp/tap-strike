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
        const stage = this.stages.find(s => s.id === stageId);
        if (!stage) return null;

        const difficulty = this.difficultiesMaster[stage.difficulty] || {};

        return {
            baseScore: stage.baseScore ?? difficulty.baseScore ?? 100,
            speedIncrement: stage.speedIncrement ?? difficulty.speedIncrement ?? 0.05,
            hitWindow: stage.hitWindow ?? difficulty.hitWindow ?? 35,
            missPenaltyDuration: stage.missPenaltyDuration ?? difficulty.missPenaltyDuration ?? 40,
            particleCount: stage.particleCount ?? difficulty.particleCount ?? 12,
            tapCooldown: stage.tapCooldown ?? difficulty.tapCooldown ?? 80
        };
    }
}

const dataLoader = new DataLoader();
