/**
 * シメサバ・アジ (MackerelSushiEnemy extends SushiEnemy)
 */
class MackerelSushiEnemy extends SushiEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SUSHI_MACKEREL',
            name: 'シメサバ寿司',
            color: '#0088cc',
            sushiType: 'mackerel'
        });
    }

    drawNeta(ctx) {
        // アジ・サバ (青皮 ＋ 切れ込み ＋ 生姜ネギ)
        ctx.fillStyle = '#2b6b99';
        ctx.shadowColor = '#2b6b99';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(-13, -7.5, 26, 15, 6);
        ctx.fill();

        ctx.fillStyle = '#e6f2ff';
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#22cc55';
        ctx.beginPath();
        ctx.arc(-3, -2, 2.0, 0, Math.PI * 2);
        ctx.arc(3, 1, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffdd44';
        ctx.beginPath();
        ctx.arc(1, -3, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}
