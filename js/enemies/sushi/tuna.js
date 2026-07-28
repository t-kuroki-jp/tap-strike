/**
 * マグロ (TunaSushiEnemy extends SushiEnemy)
 */
class TunaSushiEnemy extends SushiEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SUSHI_TUNA',
            name: 'マグロ寿司',
            color: '#ff2a3b',
            sushiType: 'tuna'
        });
    }

    drawNeta(ctx) {
        // マグロ (赤身 ＋ 白スジ)
        ctx.fillStyle = '#ff2a3b';
        ctx.shadowColor = '#ff2a3b';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(-13, -7.5, 26, 15, 6);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-7, -5); ctx.lineTo(-4, 5);
        ctx.moveTo(-1, -5); ctx.lineTo(2, 5);
        ctx.moveTo(5, -5); ctx.lineTo(8, 5);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.ellipse(-4, -4, 4, 1.8, -Math.PI / 8, 0, Math.PI * 2);
        ctx.fill();
    }
}
