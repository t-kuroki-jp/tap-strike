/**
 * シンデレラウミウシ (CinderellaSeaSlugEnemy extends SeaSlugEnemy)
 * 幻想的でエレガントなラベンダーパープル ＋ ゴールド＆ホワイトのゴージャスなフチライン！
 */
class CinderellaSeaSlugEnemy extends SeaSlugEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SEA_SLUG_CINDERELLA',
            name: 'シンデレラウミウシ',
            color: '#b388ff',
            speedRatio: 0.82
        });
    }

    drawMantlePattern(ctx) {
        ctx.shadowBlur = 0;

        // 1. ゴージャスなゴールドフチ
        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 2.6;
        const ripple = Math.sin(this.ripplePhase) * 3.5;

        ctx.beginPath();
        ctx.arc(0, -this.size * 0.7, this.size * 0.55, Math.PI, 0);
        ctx.quadraticCurveTo(this.size * 0.75 + ripple, 0, this.size * 0.5, this.size * 0.6);
        ctx.quadraticCurveTo(ripple * 0.8, this.size * 1.25, -this.size * 0.5, this.size * 0.6);
        ctx.quadraticCurveTo(-this.size * 0.75 - ripple, 0, -this.size * 0.55, -this.size * 0.7);
        ctx.stroke();

        // 2. 内側のホワイトフチ
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // 背中中央のパープルグラデーションライン
        ctx.fillStyle = '#7c4dff';
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 10, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawGillPlume(ctx) {
        // 黄金色に輝く二次鰓
        super.drawGillPlume(ctx, '#ffaa00', '#ffffff');
    }

    drawRhinophores(ctx) {
        // 黄金色に輝くエレガント触角
        super.drawRhinophores(ctx, '#ffaa00', '#ffffff');
    }
}
