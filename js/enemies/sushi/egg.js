/**
 * たまご (EggSushiEnemy extends SushiEnemy)
 */
class EggSushiEnemy extends SushiEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SUSHI_EGG',
            name: 'たまご寿司',
            color: '#ffcc00',
            sushiType: 'egg'
        });
    }

    drawNeta(ctx) {
        // たまご (厚焼き玉子 ＋ 海苔帯)
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(-13, -8, 26, 16, 5);
        ctx.fill();

        ctx.fillStyle = '#111822';
        ctx.shadowBlur = 0;
        ctx.fillRect(-3.5, -8.5, 7, 17);
    }
}
