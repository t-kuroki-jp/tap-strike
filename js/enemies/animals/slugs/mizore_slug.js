/**
 * ミゾレウミウシ (MizoreSeaSlugEnemy extends SeaSlugEnemy)
 * 透き通るライムグリーン〜アイスブルーのボディ ＋ 粉雪のような白いミゾレ点々 ＋ ターコイズブルーの触角！
 */
class MizoreSeaSlugEnemy extends SeaSlugEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SEA_SLUG_MIZORE',
            name: 'ミゾレウミウシ',
            color: '#64ffda',
            speedRatio: 0.84
        });
    }

    drawMantlePattern(ctx) {
        ctx.shadowBlur = 0;

        // 白い雪・ミゾレフチ
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.4;
        const ripple = Math.sin(this.ripplePhase) * 3.5;

        ctx.beginPath();
        ctx.arc(0, -this.size * 0.7, this.size * 0.55, Math.PI, 0);
        ctx.quadraticCurveTo(this.size * 0.75 + ripple, 0, this.size * 0.5, this.size * 0.6);
        ctx.quadraticCurveTo(ripple * 0.8, this.size * 1.25, -this.size * 0.5, this.size * 0.6);
        ctx.quadraticCurveTo(-this.size * 0.75 - ripple, 0, -this.size * 0.55, -this.size * 0.7);
        ctx.stroke();

        // 粉雪ミゾレのポツポツ模様
        ctx.fillStyle = '#ffffff';
        const dots = [
            { x: -5, y: -5, r: 1.5 },
            { x: 5, y: -4, r: 1.6 },
            { x: -4, y: 3, r: 1.3 },
            { x: 4, y: 5, r: 1.4 },
            { x: 0, y: -8, r: 1.2 },
            { x: 0, y: 8, r: 1.4 }
        ];

        dots.forEach(d => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawGillPlume(ctx) {
        // ターコイズブルーの二次鰓
        super.drawGillPlume(ctx, '#00b0ff', '#ffffff');
    }

    drawRhinophores(ctx) {
        // ターコイズブルーの美しい触角
        super.drawRhinophores(ctx, '#00b0ff', '#ffffff');
    }
}
