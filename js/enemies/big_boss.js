/**
 * ビッグ・ボス (巨大・耐久5)
 */
class BigBossEnemy extends ShieldEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage);
        this.id = 'BIG_BOSS';
        this.name = 'ビッグ・ボス';
        this.color = '#ffaa00';
        this.speed = (2.0 * 0.65) * gameSpeed;
        this.size = 42;
        this.hp = 5;
        this.maxHp = 5;
    }
}
