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
            const data = await listRes.json();
            const filePaths = Array.isArray(data) ? data : Object.values(data).flat();

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
            targetRadius: stage.targetRadius ?? g.targetRadius ?? CONFIG.PLAYER.DEFAULT_TARGET_RADIUS,
            maxHp: stage.maxHp ?? p.maxHp ?? CONFIG.PLAYER.DEFAULT_MAX_HP,
            baseScore: stage.baseScore ?? g.baseScore ?? CONFIG.GAME.DEFAULT_BASE_SCORE,
            speedIncrement: stage.speedIncrement ?? g.speedIncrement ?? CONFIG.GAME.DEFAULT_SPEED_INCREMENT,
            hitWindow: stage.hitWindow ?? g.hitWindow ?? CONFIG.HIT.DEFAULT_HIT_WINDOW_PX,
            missPenaltyDuration: stage.missPenaltyDuration ?? p.missPenaltyDuration ?? CONFIG.HIT.DEFAULT_MISS_PENALTY_TICKS,
            particleCount: stage.particleCount ?? v.particleCount ?? CONFIG.GAME.DEFAULT_PARTICLE_COUNT,
            tapCooldown: stage.tapCooldown ?? g.tapCooldown ?? CONFIG.HIT.DEFAULT_TAP_COOLDOWN_MS,
            bgScrollSpeed: stage.bgScrollSpeed ?? v.bgScrollSpeed ?? CONFIG.GAME.DEFAULT_BG_SCROLL_SPEED
        };
    }

    getResolvedParams(stage) {
        if (!stage) return this.getDefaultParams();
        const stageId = typeof stage === 'string' ? stage : stage.id;
        return this.getMergedParams(stageId);
    }

    getDefaultParams() {
        return {
            targetRadius: CONFIG.PLAYER.DEFAULT_TARGET_RADIUS,
            maxHp: CONFIG.PLAYER.DEFAULT_MAX_HP,
            baseScore: CONFIG.GAME.DEFAULT_BASE_SCORE,
            speedIncrement: CONFIG.GAME.DEFAULT_SPEED_INCREMENT,
            hitWindow: CONFIG.HIT.DEFAULT_HIT_WINDOW_PX,
            missPenaltyDuration: CONFIG.HIT.DEFAULT_MISS_PENALTY_TICKS,
            particleCount: CONFIG.GAME.DEFAULT_PARTICLE_COUNT,
            tapCooldown: CONFIG.HIT.DEFAULT_TAP_COOLDOWN_MS,
            bgScrollSpeed: CONFIG.GAME.DEFAULT_BG_SCROLL_SPEED
        };
    }
}

const dataLoader = new DataLoader();
