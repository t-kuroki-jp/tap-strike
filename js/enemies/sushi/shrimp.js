/**
 * エビ (ShrimpSushiEnemy extends SushiEnemy)
 */
class ShrimpSushiEnemy extends SushiEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SUSHI_SHRIMP',
            name: 'エビ寿司',
            color: '#ff7733',
            sushiType: 'shrimp'
        });
    }

    drawNeta(ctx) {
        // エビ (蒸しエビ ＋ 尾)
        ctx.fillStyle = '#e63900';
        ctx.beginPath();
        ctx.moveTo(-12, -2); ctx.lineTo(-17, -7); ctx.lineTo(-15, 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff7733';
        ctx.shadowColor = '#ff7733';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(-12, -7.5, 24, 15, 6);
        ctx.fill();

        ctx.fillStyle = '#e63900';
        ctx.beginPath();
        ctx.roundRect(-12, -7.5, 6, 15, 3);
        ctx.roundRect(-2, -7.5, 6, 15, 3);
        ctx.roundRect(8, -7.5, 4, 15, 3);
        ctx.fill();
    }
}
