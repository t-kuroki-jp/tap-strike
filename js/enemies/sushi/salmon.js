/**
 * サーモン (SalmonSushiEnemy extends SushiEnemy)
 */
class SalmonSushiEnemy extends SushiEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SUSHI_SALMON',
            name: 'サーモン寿司',
            color: '#ff6633',
            sushiType: 'salmon'
        });
    }

    drawNeta(ctx) {
        // サーモン (トロサーモンオレンジ ＋ 綺麗な白脂スジ ＋ ツヤ光沢)
        ctx.fillStyle = '#ff6633';
        ctx.shadowColor = '#ff6633';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(-13, -7.5, 26, 15, 6);
        ctx.fill();

        // サーモンの美しいトロ脂スジ (白・クリーム色の太め筋)
        ctx.strokeStyle = 'rgba(255, 255, 235, 0.85)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(-8, -6); ctx.lineTo(-4, 6);
        ctx.moveTo(-3, -6); ctx.lineTo(1, 6);
        ctx.moveTo(2, -6); ctx.lineTo(6, 6);
        ctx.moveTo(7, -6); ctx.lineTo(10, 3);
        ctx.stroke();

        // トロサーモンのツヤ光沢
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.ellipse(-3, -4, 4.5, 1.8, -Math.PI / 8, 0, Math.PI * 2);
        ctx.fill();
    }
}
