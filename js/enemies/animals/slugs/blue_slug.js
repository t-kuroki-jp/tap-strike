/**
 * アオウミウシ (BlueSeaSlugEnemy extends SeaSlugEnemy)
 * ウミウシ界の王道。鮮やかなロイヤルブルーの外套膜 ＋ 黄色/ホワイトのフチ取りライン ＋ 赤オレンジのフサフサ二次鰓！
 */
class BlueSeaSlugEnemy extends SeaSlugEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SEA_SLUG_BLUE',
            name: 'アオウミウシ',
            color: '#0055ff',
            speedRatio: 0.85
        });
    }

    drawMantlePattern(ctx) {
        ctx.shadowBlur = 0;

        // 1. 外套膜の外周に沿う鮮やかな黄色・ゴールドフチライン
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 2.4;
        const ripple = Math.sin(this.ripplePhase) * 3.5;

        ctx.beginPath();
        ctx.arc(0, -this.size * 0.7, this.size * 0.55, Math.PI, 0);
        ctx.quadraticCurveTo(this.size * 0.75 + ripple, 0, this.size * 0.5, this.size * 0.6);
        ctx.quadraticCurveTo(ripple * 0.8, this.size * 1.25, -this.size * 0.5, this.size * 0.6);
        ctx.quadraticCurveTo(-this.size * 0.75 - ripple, 0, -this.size * 0.55, -this.size * 0.7);
        ctx.stroke();

        // 2. 背中中央の白いライン模様
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.4);
        ctx.lineTo(0, this.size * 0.2);
        ctx.stroke();
    }

    drawGillPlume(ctx) {
        // 鮮やかな赤オレンジのフサフサ鰓 ＋ 白コア
        super.drawGillPlume(ctx, '#ff4400', '#ffffff');
    }

    drawRhinophores(ctx) {
        // 鮮やかな赤オレンジの触角 ＋ 白い先ポッチ
        super.drawRhinophores(ctx, '#ff4400', '#ffffff');
    }
}
