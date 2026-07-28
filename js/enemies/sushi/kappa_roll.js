/**
 * かっぱ巻き (KappaRollSushiEnemy extends SushiEnemy)
 */
class KappaRollSushiEnemy extends SushiEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SUSHI_KAPPA',
            name: 'かっぱ巻き',
            color: '#22aa44',
            sushiType: 'kappa_roll'
        });
    }

    drawNeta(ctx) {
        // ★ かっぱ巻き (真上から見た均等な 4切れ巻き寿司)
        const rolls = [
            { x: -5.5, y: -5.5 },
            { x: 5.5, y: -5.5 },
            { x: -5.5, y: 5.5 },
            { x: 5.5, y: 5.5 }
        ];

        rolls.forEach(r => {
            ctx.save();
            ctx.translate(r.x, r.y);

            ctx.fillStyle = '#0d2113';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
            ctx.shadowBlur = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 5.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fffdf7';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(0, 0, 4.3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#22cc55';
            ctx.beginPath();
            ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#aaff66';
            ctx.beginPath();
            ctx.arc(-0.6, -0.6, 0.7, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        });
    }
}
