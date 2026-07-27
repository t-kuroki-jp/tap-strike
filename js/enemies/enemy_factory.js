/**
 * エネミーファクトリー (生成管理 ＆ ステージ別 Behavior ダイナミック適用)
 */
class EnemyFactory {
    static create(canvas, gameSpeed, stage) {
        const pool = stage ? stage.enemyPool : [{ id: 'CHASER', weight: 1.0 }];
        const pickedItem = this.pickWeightedItem(pool);
        const pickedId = typeof pickedItem === 'string' ? pickedItem : pickedItem.id;

        let enemy;
        switch (pickedId) {
            case 'SPEEDER': enemy = new SpeederEnemy(canvas, gameSpeed, stage); break;
            case 'GLITCH': enemy = new GlitchEnemy(canvas, gameSpeed, stage); break;
            case 'CURVE': enemy = new CurveEnemy(canvas, gameSpeed, stage); break;
            case 'SINE_WAVE': enemy = new SineWaveEnemy(canvas, gameSpeed, stage); break;
            case 'CROSS': enemy = new CrossEnemy(canvas, gameSpeed, stage); break;
            case 'GHOST': enemy = new GhostEnemy(canvas, gameSpeed, stage); break;
            case 'HEXAGON': enemy = new HexagonEnemy(canvas, gameSpeed, stage); break;
            case 'RING_NOTE': enemy = new RingEnemy(canvas, gameSpeed, stage); break;
            case 'PENTAGON': enemy = new PentagonEnemy(canvas, gameSpeed, stage); break;
            case 'HEAL': enemy = new HealEnemy(canvas, gameSpeed, stage); break;
            case 'CAT': enemy = new CatEnemy(canvas, gameSpeed, stage); break;
            case 'CHICKEN': enemy = new ChickenEnemy(canvas, gameSpeed, stage); break;
            case 'DOG': enemy = new DogEnemy(canvas, gameSpeed, stage); break;
            case 'BEE': enemy = new BeeEnemy(canvas, gameSpeed, stage); break;
            case 'FROG': enemy = new FrogEnemy(canvas, gameSpeed, stage); break;
            case 'CAT_KIJITORA': enemy = new KijitoraCatEnemy(canvas, gameSpeed, stage); break;
            case 'CAT_HACHIWARE': enemy = new HachiwareCatEnemy(canvas, gameSpeed, stage); break;
            case 'SUSHI': enemy = new SushiEnemy(canvas, gameSpeed, stage); break;
            case 'BOMB': enemy = new BombEnemy(canvas, gameSpeed, stage); break;
            case 'FIREWORK': enemy = new FireworkEnemy(canvas, gameSpeed, stage); break;
            default: enemy = new ChaserEnemy(canvas, gameSpeed, stage); break;
        }

        // ★ ステージデータ(JSON)の enemyPool で指定された behavior や hp などの属性を動的に適用！
        if (pickedItem && typeof pickedItem === 'object') {
            if (pickedItem.behavior) {
                enemy.behavior = BehaviorFactory.create(pickedItem.behavior, pickedItem.behaviorConfig || {});
            }
            if (pickedItem.hp) {
                enemy.hp = pickedItem.hp;
                enemy.maxHp = pickedItem.hp;
            }
        }

        return enemy;
    }

    static pickWeightedItem(pool) {
        if (!pool || pool.length === 0) return { id: 'CHASER' };
        let totalWeight = pool.reduce((sum, item) => sum + (item.weight || 1), 0);
        let rand = Math.random() * totalWeight;
        for (let item of pool) {
            if (rand < (item.weight || 1)) return item;
            rand -= (item.weight || 1);
        }
        return pool[0];
    }
}
