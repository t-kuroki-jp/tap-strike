/**
 * コンペイトウウミウシ (KompeitoSeaSlugEnemy extends SeaSlugEnemy)
 * お菓子の金平糖（コンペイトウ）のようなビビッドオレンジ＆トロピカルイエローの突起ボディ！
 */
class KompeitoSeaSlugEnemy extends SeaSlugEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SEA_SLUG_KOMPEITO',
            name: 'コンペイトウウミウシ',
            color: '#ff6f00',
            speedRatio: 0.86
        });
    }

    drawMantlePattern(ctx) {
        ctx.shadowBlur = 0;

        // トロピカルイエローのコンペイトウ突起フチ
        ctx.strokeStyle = '#ffee58';
        ctx.lineWidth = 2.4;
        const ripple = Math.sin(this.ripplePhase) * 3.5;

        ctx.beginPath();
        ctx.arc(0, -this.size * 0.7, this.size * 0.55, Math.PI, 0);
        ctx.quadraticCurveTo(this.size * 0.75 + ripple, 0, this.size * 0.5, this.size * 0.6);
        ctx.quadraticCurveTo(ripple * 0.8, this.size * 1.25, -this.size * 0.5, this.size * 0.6);
        ctx.quadraticCurveTo(-this.size * 0.75 - ripple, 0, -this.size * 0.55, -this.size * 0.7);
        ctx.stroke();

        // 金平糖のつノ突起模様
        ctx.fillStyle = '#ffab00';
        const spikes = [
            { x: -6, y: -4, r: 2.2 },
            { x: 6, y: -3, r: 2.4 },
            { x: -4, y: 5, r: 2.0 },
            { x: 4, y: 6, r: 2.2 },
            { x: 0, y: -9, r: 1.8 }
        ];

        spikes.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawGillPlume(ctx) {
        // ビビッドマゼンタの二重二次鰓
        super.drawGillPlume(ctx, '#d500f9', '#ffffff');
    }

    drawRhinophores(ctx) {
        // ビビッドマゼンタのツノ触角
        super.drawRhinophores(ctx, '#d500f9', '#ffffff');
    }
}
