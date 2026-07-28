/**
 * ゴマフビロードウミウシ (JorunnaSeaSlugEnemy extends SeaSlugEnemy)
 * 通称「ウミウシウサギ / ゴマちゃん」。モコモコ真っ白な体に黒ポツポツ点模様、黒いウサギ耳触角！
 */
class JorunnaSeaSlugEnemy extends SeaSlugEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SEA_SLUG_JORUNNA',
            name: 'ゴマフビロードウミウシ',
            color: '#f8f9fa',
            speedRatio: 0.8
        });
    }

    drawMantlePattern(ctx) {
        ctx.shadowBlur = 0;

        // ゴマフ（黒いぽつぽつ点々模様）
        ctx.fillStyle = '#111111';
        const dots = [
            { x: -7, y: -5, r: 1.8 },
            { x: 7, y: -4, r: 2.0 },
            { x: -4, y: 4, r: 1.6 },
            { x: 5, y: 6, r: 1.9 },
            { x: 0, y: -10, r: 1.5 },
            { x: 0, y: 10, r: 1.7 },
            { x: -8, y: 3, r: 1.5 }
        ];

        dots.forEach(d => {
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawGillPlume(ctx) {
        // ウサギウミウシ特有のシックな黒/ダークグレーの鰓
        super.drawGillPlume(ctx, '#222222', '#ffffff');
    }

    drawRhinophores(ctx) {
        // ウサギの耳のような漆黒の触角 ＋ 白先端
        super.drawRhinophores(ctx, '#111111', '#ffffff');
    }
}
