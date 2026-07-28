/**
 * イカ (SquidSushiEnemy extends SushiEnemy)
 */
class SquidSushiEnemy extends SushiEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SUSHI_SQUID',
            name: 'イカ寿司',
            color: '#ffffff',
            sushiType: 'squid'
        });
    }

    drawNeta(ctx) {
        // イカ (白い身 ＋ 鹿の子包丁切り込み)
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(-13, -7.5, 26, 15, 6);
        ctx.fill();

        ctx.strokeStyle = '#d4e6f1';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-8, -5); ctx.lineTo(-4, 5);
        ctx.moveTo(-2, -5); ctx.lineTo(2, 5);
        ctx.moveTo(4, -5); ctx.lineTo(8, 5);
        ctx.moveTo(-4, -5); ctx.lineTo(-8, 5);
        ctx.moveTo(2, -5); ctx.lineTo(-2, 5);
        ctx.moveTo(8, -5); ctx.lineTo(4, 5);
        ctx.stroke();

        ctx.fillStyle = 'rgba(34, 187, 85, 0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}
