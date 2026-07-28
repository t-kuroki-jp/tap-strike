/**
 * みつばち (Bee / 旋回アプローチ / つぶらな黒目 ＋ ハイライト)
 */
class BeeEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'BEE', name: 'みつばち', color: '#ffcc00', shape: 'bee', speedRatio: 0.9, size: 15, hp: 1,
            behavior: 'spiral'
        });
        this.wingAngle = 0;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        // パタパタ羽ばたく高速ツイン翼アニメーション
        this.wingAngle = Math.sin(Date.now() / 40) * 0.5;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;

        const s = this.size;

        // 1. 左右のパタパタ透明ツイン翼 (Back)
        ctx.save();
        ctx.fillStyle = 'rgba(200, 240, 255, 0.75)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 8;

        // 左翼
        ctx.beginPath();
        ctx.ellipse(-s * 0.85, -s * 0.3, s * 0.75, s * 0.4, -0.4 + this.wingAngle, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 右翼
        ctx.beginPath();
        ctx.ellipse(s * 0.85, -s * 0.3, s * 0.75, s * 0.4, 0.4 - this.wingAngle, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. 黄色と黒のしましまボディ
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.85, s * 1.05, 0, 0, Math.PI * 2);
        ctx.fill();

        // 黒いしましま模様 (2本)
        ctx.fillStyle = '#111111';
        ctx.fillRect(-s * 0.8, -s * 0.25, s * 1.6, s * 0.25);
        ctx.fillRect(-s * 0.75, s * 0.2, s * 1.5, s * 0.25);

        // 3. 触角 ( Antennae )
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-s * 0.3, -s * 0.9);
        ctx.quadraticCurveTo(-s * 0.5, -s * 1.4, -s * 0.6, -s * 1.3);
        ctx.moveTo(s * 0.3, -s * 0.9);
        ctx.quadraticCurveTo(s * 0.5, -s * 1.4, s * 0.6, -s * 1.3);
        ctx.stroke();

        // 4. 柴犬・ひよことお揃いの「愛くるしいつぶらな黒目 ＋ ハイライト」
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(-s * 0.38, -s * 0.45, 3.2, 0, Math.PI * 2);
        ctx.arc(s * 0.38, -s * 0.45, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // 目の白いハイライト
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-s * 0.43, -s * 0.52, 1.1, 0, Math.PI * 2);
        ctx.arc(s * 0.33, -s * 0.52, 1.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
