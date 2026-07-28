/**
 * イチゴミルクウミウシ (StrawberrySeaSlugEnemy extends SeaSlugEnemy)
 * スイートなイチゴミルクピンクのボディ ＋ 赤い果肉ポツポツ模様 ＋ 濃いイチゴレッドの触角・二次鰓！
 */
class StrawberrySeaSlugEnemy extends SeaSlugEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SEA_SLUG_STRAWBERRY',
            name: 'イチゴミルクウミウシ',
            color: '#ffb3c6',
            speedRatio: 0.85
        });
    }

    drawMantlePattern(ctx) {
        ctx.shadowBlur = 0;

        // 1. 白と赤のイチゴフチ
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.4;
        const ripple = Math.sin(this.ripplePhase) * 3.5;

        ctx.beginPath();
        ctx.arc(0, -this.size * 0.7, this.size * 0.55, Math.PI, 0);
        ctx.quadraticCurveTo(this.size * 0.75 + ripple, 0, this.size * 0.5, this.size * 0.6);
        ctx.quadraticCurveTo(ripple * 0.8, this.size * 1.25, -this.size * 0.5, this.size * 0.6);
        ctx.quadraticCurveTo(-this.size * 0.75 - ripple, 0, -this.size * 0.55, -this.size * 0.7);
        ctx.stroke();

        // 2. イチゴの果肉ポツポツ粒模様
        ctx.fillStyle = '#ff0055';
        const dots = [
            { x: -6, y: -4, r: 1.6 },
            { x: 6, y: -3, r: 1.8 },
            { x: -3, y: 5, r: 1.5 },
            { x: 4, y: 7, r: 1.7 },
            { x: 0, y: -9, r: 1.4 },
            { x: 0, y: 9, r: 1.5 }
        ];

        dots.forEach(d => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawGillPlume(ctx) {
        // 濃いルビーレッドの二次鰓
        super.drawGillPlume(ctx, '#ff0044', '#ffffff');
    }

    drawRhinophores(ctx) {
        // 濃いイチゴレッドの触角
        super.drawRhinophores(ctx, '#ff0044', '#ffffff');
    }
}
