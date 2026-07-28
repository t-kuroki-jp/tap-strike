/**
 * ウデフリツノザヤウミウシ (PikachuSeaSlugEnemy extends SeaSlugEnemy)
 * 通称「ピカチュウウミウシ」。鮮やかなイエローボディ ＋ 先端が黒青のグラデーションツノ触角！
 */
class PikachuSeaSlugEnemy extends SeaSlugEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SEA_SLUG_PIKACHU',
            name: 'ピカチュウウミウシ',
            color: '#ffcc00',
            speedRatio: 0.9
        });
    }

    drawMantlePattern(ctx) {
        ctx.shadowBlur = 0;

        // 鮮やかなブルーのライン（背中両側の青ライン）
        ctx.strokeStyle = '#0055ff';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(-7, -8); ctx.lineTo(-7, 8);
        ctx.moveTo(7, -8); ctx.lineTo(7, 8);
        ctx.stroke();

        // 黒いアクセント点
        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
        ctx.fill();
    }

    drawGillPlume(ctx) {
        // 先端が黒青の鮮やかな鰓
        super.drawGillPlume(ctx, '#0044cc', '#ffcc00');
    }

    drawRhinophores(ctx) {
        // ピカチュウの耳のような黒先端のイエローツノ触角
        super.drawRhinophores(ctx, '#0033aa', '#ffcc00');
    }
}
