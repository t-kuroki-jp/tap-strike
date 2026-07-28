/**
 * ハチワレはちちゃん (HachiwareCatEnemy extends CatEnemy)
 */
class HachiwareCatEnemy extends CatEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT_HACHIWARE',
            name: 'ハチワレはちちゃん',
            color: '#1a1a1a',
            tailColor: '#1a1a1a',
            speedRatio: 1.0,
            size: 15,
            hp: 1,
            behavior: 'wave',
            behaviorConfig: { frequency: 0.3, amplitude: 2.0 }
        });
    }

    drawHeadBase(ctx) {
        // 白い頭ベース
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#1a1a1a';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    drawCatPattern(ctx) {
        ctx.shadowBlur = 0;

        // 1. 額のハチワレ「八の字」漆黒パッチ (#1a1a1a)
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 7);
        ctx.lineTo(this.x - 14, this.y - 2);
        ctx.lineTo(this.x - 14, this.y - 15);
        ctx.lineTo(this.x + 14, this.y - 15);
        ctx.lineTo(this.x + 14, this.y - 2);
        ctx.closePath();
        ctx.fill();

        // 2. 漆黒の三角耳 (#1a1a1a)
        ctx.beginPath();
        ctx.moveTo(this.x - 14, this.y - 4);
        ctx.lineTo(this.x - 8, this.y - 18);
        ctx.lineTo(this.x - 1, this.y - 11);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 1, this.y - 11);
        ctx.lineTo(this.x + 8, this.y - 18);
        ctx.lineTo(this.x + 14, this.y - 4);
        ctx.closePath();
        ctx.fill();

        // ピンクのお耳の中
        ctx.fillStyle = '#ffb7c5';
        ctx.beginPath();
        ctx.moveTo(this.x - 12, this.y - 6);
        ctx.lineTo(this.x - 8, this.y - 15);
        ctx.lineTo(this.x - 4, this.y - 10);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 4, this.y - 10);
        ctx.lineTo(this.x + 8, this.y - 15);
        ctx.lineTo(this.x + 12, this.y - 6);
        ctx.closePath();
        ctx.fill();
    }

    // 参考写真再現: 本物ハチワレお目め (澄んだアクアグリーン) ＆ ナチュラルピンクのお鼻・口元
    drawFaceFeatures(ctx) {
        super.drawFaceFeatures(ctx, '#f4a896', '#8a706c');
    }

    drawEyes(ctx) {
        super.drawEyes(ctx, '#2ecc71', '#0f381e'); // お写真通りのリアルで綺麗なエメラルドグリーン目
    }
}
