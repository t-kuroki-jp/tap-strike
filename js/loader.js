/**
 * ステージおよび難易度マスター（stages/index.json）の非同期取得・パラメータ合成管理クラス
 */
class DataLoader {
    constructor() {
        this.master = {};
        this.stages = [];
        this.isLoaded = false;
        this.loadingPromise = null;
    }

    async loadAll(forceReload = false) {
        if (this.isLoaded && !forceReload) return;
        if (this.loadingPromise && !forceReload) return this.loadingPromise;

        this.loadingPromise = (async () => {
            await this.loadMasterAndStages();
            this.isLoaded = true;
            this.loadingPromise = null;
        })();

        return this.loadingPromise;
    }

    async loadMasterAndStages() {
        try {
            const res = await fetch(`stages/index.json?t=${Date.now()}`);
            this.master = await res.json();

            const fileEntries = [];
            Object.entries(this.master).forEach(([diffKey, diff]) => {
                if (Array.isArray(diff.stages)) {
                    diff.stages.forEach(path => {
                        fileEntries.push({ path, defaultDiff: diffKey });
                    });
                }
            });

            const stagePromises = fileEntries.map(async ({ path, defaultDiff }) => {
                try {
                    const stageRes = await fetch(`${path}?t=${Date.now()}`);
                    const stageData = await stageRes.json();
                    if (stageData && !stageData.difficulty) {
                        stageData.difficulty = defaultDiff;
                    }
                    return stageData;
                } catch (e) {
                    console.error(`Failed to load stage at ${path}`, e);
                    return null;
                }
            });

            const loadedStages = await Promise.all(stagePromises);
            this.stages = loadedStages.filter(s => s !== null);
        } catch (e) {
            console.error('Failed to load stages/index.json', e);
        }
    }

    getMergedParams(stageId) {
        const stage = this.stages.find(s => s.id === stageId) || {};
        const diffMaster = this.master[stage.difficulty] || {};
        const defaultParams = diffMaster.params || {};

        return Object.assign(
            {},
            this.getDefaultParams(),
            defaultParams,
            stage.params || {}
        );
    }

    getMergedTheme(stageOrId) {
        const stage = typeof stageOrId === 'string' 
            ? (this.stages.find(s => s.id === stageOrId) || {}) 
            : (stageOrId || {});
            
        const diffMaster = this.master[stage.difficulty] || {};
        const defaultTheme = diffMaster.theme || {};

        return Object.assign(
            {},
            defaultTheme,
            stage.theme || {}
        );
    }

    getResolvedParams(stage) {
        if (!stage) return this.getDefaultParams();
        const stageId = typeof stage === 'string' ? stage : stage.id;
        return this.getMergedParams(stageId);
    }

    getDefaultParams() {
        return {
            gameSpeed: 0.85,
            spawnRate: CONFIG.GAME.DEFAULT_SPAWN_RATE_MS,
            targetRadius: CONFIG.PLAYER.DEFAULT_TARGET_RADIUS,
            maxHp: CONFIG.PLAYER.DEFAULT_MAX_HP,
            baseScore: CONFIG.GAME.DEFAULT_BASE_SCORE,
            speedIncrement: CONFIG.GAME.DEFAULT_SPEED_INCREMENT,
            hitWindow: CONFIG.HIT.DEFAULT_HIT_WINDOW_PX,
            missPenaltyDuration: CONFIG.HIT.DEFAULT_MISS_PENALTY_TICKS,
            particleCount: CONFIG.GAME.DEFAULT_PARTICLE_COUNT,
            tapCooldown: CONFIG.HIT.DEFAULT_TAP_COOLDOWN_MS
        };
    }
}

const dataLoader = new DataLoader();
