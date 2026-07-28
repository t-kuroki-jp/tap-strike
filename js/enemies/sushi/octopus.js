/**
 * タコ (OctopusSushiEnemy extends SushiEnemy)
 */
class OctopusSushiEnemy extends SushiEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SUSHI_OCTOPUS',
            name: 'タコ寿司',
            color: '#cc2255',
            sushiType: 'octopus'
        });
    }

    drawNeta(ctx) {
        // タコ (赤皮 ＋ 白身 ＋ 吸盤)
        ctx.fillStyle = '#cc2255';
        ctx.shadowColor = '#cc2255';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(-13, -7.5, 26, 15, 6);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(0, 0, 11, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff88aa';
        ctx.beginPath();
        ctx.arc(-7, -2, 2.5, 0, Math.PI * 2);
        ctx.arc(0, -3, 2.5, 0, Math.PI * 2);
        ctx.arc(7, -2, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
}
