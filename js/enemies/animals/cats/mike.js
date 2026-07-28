/**
 * 三毛猫みけちゃん (MikeCatEnemy extends CatEnemy)
 */
class MikeCatEnemy extends CatEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT_MIKE',
            name: '三毛猫みけちゃん',
            color: '#fff5f0',
            tailColor: '#fff5f0',
            speedRatio: 1.05,
            size: 15,
            hp: 1,
            behavior: 'wave',
            behaviorConfig: { frequency: 0.35, amplitude: 2.2 }
        });
    }

    drawCatPattern(ctx) {
        ctx.shadowBlur = 0;

        // 1. 本物の三毛猫ブチ模様 (左頭に茶トラ模様, 右頭に黒ブチ模様)
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.arc(this.x - 7, this.y - 6, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y - 5, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // 2. リアルな曲線ねこ耳
        // 左耳 (茶トラ側)
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.moveTo(this.x - 14, this.y - 3);
        ctx.quadraticCurveTo(this.x - 13, this.y - 14, this.x - 7, this.y - 18);
        ctx.quadraticCurveTo(this.x - 3, this.y - 13, this.x - 1, this.y - 10);
        ctx.closePath();
        ctx.fill();

        // 右耳 (黒ブチ側)
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.moveTo(this.x + 1, this.y - 10);
        ctx.quadraticCurveTo(this.x + 3, this.y - 13, this.x + 7, this.y - 18);
        ctx.quadraticCurveTo(this.x + 13, this.y - 14, this.x + 14, this.y - 3);
        ctx.closePath();
        ctx.fill();

        // 3. ピンクのお耳の中
        ctx.fillStyle = '#ffb7c5';
        ctx.beginPath();
        ctx.moveTo(this.x - 12, this.y - 5);
        ctx.quadraticCurveTo(this.x - 11, this.y - 12, this.x - 7, this.y - 15);
        ctx.quadraticCurveTo(this.x - 4, this.y - 11, this.x - 3, this.y - 8);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 3, this.y - 8);
        ctx.quadraticCurveTo(this.x + 4, this.y - 11, this.x + 7, this.y - 15);
        ctx.quadraticCurveTo(this.x + 11, this.y - 12, this.x + 12, this.y - 5);
        ctx.closePath();
        ctx.fill();
    }
}
