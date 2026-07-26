/**
 * エネミーファクトリー (生成管理)
 */
class EnemyFactory {
    static create(canvas, gameSpeed, stage) {
        const pool = stage ? stage.enemyPool : [{ id: 'CHASER', weight: 1.0 }];
        const pickedId = this.pickWeightedId(pool);

        switch (pickedId) {
            case 'SPEEDER': return new SpeederEnemy(canvas, gameSpeed, stage);
            case 'GLITCH': return new GlitchEnemy(canvas, gameSpeed, stage);
            case 'CURVE': return new CurveEnemy(canvas, gameSpeed, stage);
            case 'SHIELD': return new ShieldEnemy(canvas, gameSpeed, stage);
            case 'BIG_BOSS': return new BigBossEnemy(canvas, gameSpeed, stage);
            case 'HEAL': return new HealEnemy(canvas, gameSpeed, stage);
            case 'DONT_TAP': return new DontTapEnemy(canvas, gameSpeed, stage);
            case 'CHICKEN': return new ChickenEnemy(canvas, gameSpeed, stage);
            case 'CAT': return new CatEnemy(canvas, gameSpeed, stage);
            case 'SUSHI': return new SushiEnemy(canvas, gameSpeed, stage);
            case 'BOMB': return new BombEnemy(canvas, gameSpeed, stage);
            case 'MOAI': return new MoaiEnemy(canvas, gameSpeed, stage);
            default: return new ChaserEnemy(canvas, gameSpeed, stage);
        }
    }

    static pickWeightedId(pool) {
        if (!pool || pool.length === 0) return 'CHASER';
        let totalWeight = pool.reduce((sum, item) => sum + (item.weight || 1), 0);
        let rand = Math.random() * totalWeight;
        for (let item of pool) {
            if (rand < (item.weight || 1)) return item.id;
            rand -= (item.weight || 1);
        }
        return pool[0].id;
    }
}
