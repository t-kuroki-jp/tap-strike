/**
 * 猫ファミリー基底クラス (CatEnemy)
 * 猫共通の気まぐれゆらゆら歩行・しっぽスイング・リアル曲線耳・顔パーツなどの共通処理を一元管理
 */
class CatEnemy extends Enemy {
    static metadata = { id: 'CAT', name: 'にゃんこファミリー', tag: 'トコトコ歩行', desc: '白猫・茶トラ・ハチワレ。しっぽを振って気まぐれ散歩！', color: '#ffccaa' };

    static createRandom(canvas, gameSpeed, stage) {
        const catClasses = [MikeCatEnemy, KijitoraCatEnemy, HachiwareCatEnemy];
        const RandomCatClass = catClasses[Math.floor(Math.random() * catClasses.length)];
        return new RandomCatClass(canvas, gameSpeed, stage);
    }
    constructor(canvas, gameSpeed, stage, config = {}) {
        super(canvas, gameSpeed, stage, {
            id: config.id || 'CAT',
            name: config.name || '三毛猫みけちゃん',
            color: config.color || '#fff5f0',
            shape: 'cat',
            speedRatio: config.speedRatio || 1.05,
            size: config.size || 15,
            hp: config.hp || 1,
            behavior: config.behavior || 'wave',
            behaviorConfig: config.behaviorConfig || { frequency: 0.35, amplitude: 2.2 }
        });

        this.tailAngle = Math.random() * Math.PI * 2;
        this.tailColor = config.tailColor || this.color;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        this.tailAngle += 0.18;
        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. ゆらゆら横しっぽ (共通黄金バランス 15.0px)
        this.drawTail(ctx);

        // 2. 猫の頭ベース
        this.drawHeadBase(ctx);

        // 3. 各猫の固有ブチ・トラ・ハチワレ模様 (子クラスでオーバーライド)
        this.drawCatPattern(ctx);

        // 4. 猫共通の目・鼻・口元・髭
        this.drawFaceFeatures(ctx);

        ctx.restore();
        this.drawShieldLayer(ctx);
    }

    // 1. ゆらゆら横しっぽ描画
    drawTail(ctx) {
        ctx.strokeStyle = this.tailColor;
        ctx.lineWidth = 3.8;
        ctx.lineCap = 'round';
        ctx.shadowColor = this.tailColor;
        ctx.shadowBlur = 5;
        ctx.beginPath();

        const tailSwing = Math.sin(this.tailAngle) * 3.8;
        const tailTipX = this.x + 15.0 + tailSwing;
        const tailTipY = this.y - 2.5 + Math.cos(this.tailAngle) * 2.5;

        ctx.moveTo(this.x + 8, this.y + 5);
        ctx.quadraticCurveTo(this.x + 14, this.y + 6.5, tailTipX, tailTipY);
        ctx.stroke();
    }

    // 2. 猫の頭ベース
    drawHeadBase(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // 3. 各猫固有の模様描画 (子クラスでオーバーライド)
    drawCatPattern(ctx) {
        // デフォルト模様なし
    }

    // 4. 猫共通の目・鼻・口元・髭
    drawFaceFeatures(ctx, noseColor = '#f4a896', mouthColor = '#8a706c') {
        // 目
        this.drawEyes(ctx);

        // お鼻 (優しいリアルピンク)
        ctx.shadowBlur = 0;
        ctx.fillStyle = noseColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y + 3.2, 1.4, 0, Math.PI * 2);
        ctx.fill();

        // 鼻〜口の人中縦ライン ＆ にっこり口元 (ナチュラルカラー)
        ctx.strokeStyle = mouthColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        // 縦ライン
        ctx.moveTo(this.x, this.y + 4.2);
        ctx.lineTo(this.x, this.y + 5.5);
        // 口元カーブ
        ctx.moveTo(this.x - 2.2, this.y + 5.5);
        ctx.quadraticCurveTo(this.x - 1.1, this.y + 7.0, this.x, this.y + 5.5);
        ctx.quadraticCurveTo(this.x + 1.1, this.y + 7.0, this.x + 2.2, this.y + 5.5);
        ctx.stroke();

        // 白いひげ
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(this.x - 8, this.y + 2);
        ctx.lineTo(this.x - 19, this.y);
        ctx.moveTo(this.x - 8, this.y + 4);
        ctx.lineTo(this.x - 18, this.y + 7);

        ctx.moveTo(this.x + 8, this.y + 2);
        ctx.lineTo(this.x + 19, this.y);
        ctx.moveTo(this.x + 8, this.y + 4);
        ctx.lineTo(this.x + 18, this.y + 7);
        ctx.stroke();
    }

    drawEyes(ctx, irisColor = '#2ecc71', pupilColor = '#0f381e') {
        ctx.shadowBlur = 0;
        ctx.fillStyle = irisColor;
        ctx.beginPath();
        ctx.arc(this.x - 5.5, this.y - 1, 3.2, 0, Math.PI * 2);
        ctx.arc(this.x + 5.5, this.y - 1, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = pupilColor;
        ctx.beginPath();
        ctx.arc(this.x - 5.5, this.y - 1, 1.6, 0, Math.PI * 2);
        ctx.arc(this.x + 5.5, this.y - 1, 1.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6.5, this.y - 2, 0.9, 0, Math.PI * 2);
        ctx.arc(this.x + 4.5, this.y - 2, 0.9, 0, Math.PI * 2);
        ctx.fill();
    }
}
