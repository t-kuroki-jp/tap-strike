/**
 * アオミノウミウシ / ブルードラゴン (GlaucusSeaSlugEnemy extends SeaSlugEnemy)
 * 海の青い龍！ヒレ状の羽翼（ヒダ突起）が広がったSFファンタジー感あふれる超人気ウミウシ！
 */
class GlaucusSeaSlugEnemy extends SeaSlugEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SEA_SLUG_GLAUCUS',
            name: 'アオミノウミウシ (ブルードラゴン)',
            color: '#00d2ff',
            speedRatio: 0.9
        });
    }

    drawBodyShape(ctx) {
        const ripple = Math.sin(this.ripplePhase) * 3.0;

        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#002266'; // ディープダークブルーの腹部
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // ブルードラゴン特有の左右に広がるヒレ翼（6本の羽状突起）
        ctx.fillStyle = '#00d2ff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.4;

        const wings = [
            { angle: -Math.PI / 3, len: 26 },
            { angle: Math.PI / 3, len: 26 },
            { angle: -Math.PI / 1.5, len: 20 },
            { angle: Math.PI / 1.5, len: 20 },
            { angle: -Math.PI / 1.2, len: 14 },
            { angle: Math.PI / 1.2, len: 14 }
        ];

        wings.forEach(w => {
            ctx.save();
            ctx.rotate(w.angle + (ripple * 0.05));
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(w.len * 0.5, -4);
            ctx.lineTo(w.len, 0);
            ctx.lineTo(w.len * 0.5, 4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        });

        // 中央のメタリックブルーボディ
        ctx.fillStyle = '#00d2ff';
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 18, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawMantlePattern(ctx) {
        // メタリックシルバーライン
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(0, 14);
        ctx.stroke();
    }

    drawGillPlume(ctx) {
        // ブルードラゴン専用のシアン青グラデーション鰓
        super.drawGillPlume(ctx, '#00f0ff', '#ffffff');
    }

    drawRhinophores(ctx) {
        // ドラゴンのツノ風角
        super.drawRhinophores(ctx, '#00d2ff', '#ffffff');
    }
}
