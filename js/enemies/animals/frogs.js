/**
 * カエル (Frog / つぶらな黒目 ＋ ハイライト ＋ ゲコッと鳴き袋 ＆ 跳躍)
 */
class FrogEnemy extends Enemy {
    static metadata = { id: 'FROG', name: 'かえるさん', tag: '一瞬停止', desc: '手前でピタッと1秒止まって「だるまさんが転んだ」！', color: '#00ff66' };
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'FROG', name: 'かえるさん', color: '#00ff66', shape: 'frog', speedRatio: 0.95, size: 13.5, hp: 1,
            behavior: 'freeze'
        });
        this.pouchScale = 0;
        this.hopOffset = 0;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        // 1. ゲコゲコッと息に合わせてプク〜ッと膨らむ喉の鳴き袋アニメーション
        this.pouchScale = Math.max(0, Math.sin(Date.now() / 130)) * 0.55;

        // 2. ぴょんぴょん跳躍ステップ
        this.hopOffset = Math.abs(Math.sin(Date.now() / 90)) * 5;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        // ぴょんぴょん跳ねる跳躍オフセット
        ctx.translate(this.x, this.y - this.hopOffset);

        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;

        const s = this.size;

        // 1. カエルの折りたたんだ可愛い後ろ足 (左右)
        ctx.fillStyle = '#00cc55';
        ctx.beginPath();
        ctx.ellipse(-s * 0.95, s * 0.3, s * 0.4, s * 0.65, -0.6, 0, Math.PI * 2);
        ctx.ellipse(s * 0.95, s * 0.3, s * 0.4, s * 0.65, 0.6, 0, Math.PI * 2);
        ctx.fill();

        // 2. 体の丸 (緑)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 1, s * 0.95, 0, Math.PI * 2);
        ctx.fill();

        // 3. ゲコッとプク〜ッと膨らむ喉の鳴き袋 (クリームイエロー)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffee';
        ctx.beginPath();
        const pouchR = s * (0.45 + this.pouchScale);
        ctx.arc(0, s * 0.4, pouchR, 0, Math.PI * 2);
        ctx.fill();

        // 4. ぽっこり飛び出た二つの大きなお目め (上部)
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(-s * 0.6, -s * 0.6, s * 0.52, 0, Math.PI * 2);
        ctx.arc(s * 0.6, -s * 0.6, s * 0.52, 0, Math.PI * 2);
        ctx.fill();

        // 白目とつぶらな黒目 ＋ ハイライト (柴犬・ひよことお揃いデザイン)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-s * 0.6, -s * 0.6, s * 0.35, 0, Math.PI * 2);
        ctx.arc(s * 0.6, -s * 0.6, s * 0.35, 0, Math.PI * 2);
        ctx.fill();

        // つぶらな黒目
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(-s * 0.6, -s * 0.6, 2.6, 0, Math.PI * 2);
        ctx.arc(s * 0.6, -s * 0.6, 2.6, 0, Math.PI * 2);
        ctx.fill();

        // 目の白いハイライト
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-s * 0.65, -s * 0.65, 1.0, 0, Math.PI * 2);
        ctx.arc(s * 0.55, -s * 0.65, 1.0, 0, Math.PI * 2);
        ctx.fill();

        // 5. にっこり口元
        ctx.strokeStyle = '#004411';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.45, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        ctx.restore();
    }
}
