/**
 * エネミーファクトリー (生成管理 ＆ プラグインレジストリ ＆ ダイナミック Behavior 適用)
 */
class EnemyFactory {
    static registry = {};
    static metadataList = [];
    static initialized = false;

    /**
     * 新しいエネミーノーツの生成クラス/生成関数を動的登録するプラグイン API
     * @param {string} id - エネミーID (例: 'CHASER', 'CAT', 'SUSHI')
     * @param {Function|Class} target - 生成関数または Enemy の基底クラス
     * @param {Object} [customMeta] - 図鑑表示用の特別メタデータ（省略時はクラスの static metadata を自動採用）
     */
    static register(id, target, customMeta = null) {
        if (!id) return;

        let meta = customMeta;

        if (typeof target === 'function') {
            // クラス自身が静的 createRandom を持つ場合 (例: CatEnemy, SushiEnemy, SeaSlugEnemy)
            if (typeof target.createRandom === 'function') {
                this.registry[id] = (canvas, gameSpeed, stage) => target.createRandom(canvas, gameSpeed, stage);
                if (!meta && Object.prototype.hasOwnProperty.call(target, 'metadata')) {
                    meta = target.metadata;
                }
            }
            // 通常の Enemy 継承クラス
            else if (target.prototype && target.prototype.draw) {
                this.registry[id] = (canvas, gameSpeed, stage) => new target(canvas, gameSpeed, stage);
                if (!meta && Object.prototype.hasOwnProperty.call(target, 'metadata')) {
                    meta = target.metadata;
                }
            } else {
                this.registry[id] = target;
            }
        }

        if (meta) {
            // 図鑑リストの重複登録防止
            const existingIdx = this.metadataList.findIndex(m => m.id === id);
            if (existingIdx >= 0) {
                this.metadataList[existingIdx] = meta;
            } else {
                this.metadataList.push(meta);
            }
        }
    }

    /**
     * 登録された全エネミーの図鑑メタデータを取得（図鑑画面の動的自動生成用）
     */
    static getAllMetadata() {
        this.initDefaults();
        return this.metadataList;
    }

    /**
     * 標準組込エネミーノーツの一括レジストリ登録
     */
    static initDefaults() {
        if (this.initialized) return;
        this.initialized = true;

        // 1. 幾何学ノーツ群
        this.register('CHASER', StraightCircleEnemy);
        this.register('SPEEDER', BoltStellarEnemy);
        this.register('GLITCH', GlitchTetraEnemy);
        this.register('CURVE', CurveTriEnemy);
        this.register('SINE_WAVE', WaveDiaEnemy);
        this.register('CROSS', ReturnAngleEnemy);
        this.register('GHOST', ShadowCrossEnemy);
        this.register('HEXAGON', FreezeHexaEnemy);
        this.register('RING_NOTE', OrbitOctaEnemy);
        this.register('PENTAGON', BoundPentaEnemy);

        // 2. アイテム・ギミックノーツ群
        this.register('HEAL', HealEnemy);
        this.register('BOMB', BombEnemy);
        this.register('FIREWORK', FireworkEnemy);
        this.register('SAKURA_PETAL', SakuraPetalEnemy);

        // 3. ネコファミリー群
        this.register('CAT_MIKE', MikeCatEnemy);
        this.register('CAT_KIJITORA', KijitoraCatEnemy);
        this.register('CAT_HACHIWARE', HachiwareCatEnemy);
        this.register('CAT', CatEnemy);

        // 4. どうぶつ仲間たち (柴犬, ヒヨコ, 蜂, 蛙)
        this.register('CHICKEN', ChickenEnemy);
        this.register('DOG', DogEnemy);
        this.register('BEE', BeeEnemy);
        this.register('FROG', FrogEnemy);

        // 5. 特選回転寿司群
        this.register('SUSHI_TUNA', TunaSushiEnemy);
        this.register('SUSHI_SALMON', SalmonSushiEnemy);
        this.register('SUSHI_SHRIMP', ShrimpSushiEnemy);
        this.register('SUSHI_EGG', EggSushiEnemy);
        this.register('SUSHI_MACKEREL', MackerelSushiEnemy);
        this.register('SUSHI_OCTOPUS', OctopusSushiEnemy);
        this.register('SUSHI_SQUID', SquidSushiEnemy);
        this.register('SUSHI_KAPPA', KappaRollSushiEnemy);
        this.register('SUSHI', SushiEnemy);

        // 6. ウミウシパラダイス全8種群
        this.register('SEA_SLUG_BLUE', BlueSeaSlugEnemy);
        this.register('SEA_SLUG_JORUNNA', JorunnaSeaSlugEnemy);
        this.register('SEA_SLUG_PIKACHU', PikachuSeaSlugEnemy);
        this.register('SEA_SLUG_STRAWBERRY', StrawberrySeaSlugEnemy);
        this.register('SEA_SLUG_CINDERELLA', CinderellaSeaSlugEnemy);
        this.register('SEA_SLUG_GLAUCUS', GlaucusSeaSlugEnemy);
        this.register('SEA_SLUG_MIZORE', MizoreSeaSlugEnemy);
        this.register('SEA_SLUG_KOMPEITO', KompeitoSeaSlugEnemy);
        this.register('SEA_SLUG', SeaSlugEnemy);
    }

    /**
     * 出撃プールからノーツを抽選し、動的適用属性を適用して生成
     */
    static create(canvas, gameSpeed, stage) {
        this.initDefaults();

        const pool = stage ? stage.enemyPool : [{ id: 'CHASER', weight: 1.0 }];
        const pickedItem = this.pickWeightedItem(pool);
        const pickedId = typeof pickedItem === 'string' ? pickedItem : pickedItem.id;

        let enemy;
        const factoryFn = this.registry[pickedId];

        if (typeof factoryFn === 'function') {
            enemy = factoryFn(canvas, gameSpeed, stage);
        } else {
            // 未知のIDまたはフォールバック
            enemy = new StraightCircleEnemy(canvas, gameSpeed, stage);
        }

        // ★ ステージデータ(JSON)の enemyPool で指定された behavior や hp などの属性を動的に適用！
        if (enemy && pickedItem && typeof pickedItem === 'object') {
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

    /**
     * 重み付きランダム抽選
     */
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
