/**
 * にゃんこフェスティバル (トコトコ気まぐれ移動・横ゆらゆらしっぽ・ニャ〜オSE)
 */
class CatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT', name: 'にゃんこフェスティバル', color: '#ffb3cc', shape: 'cat', speedRatio: 1.05, size: 15, hp: 1
        });
        this.tailAngle = Math.random() * Math.PI * 2;
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        // 猫特有のすばしっこいトコトコ気まぐれステップ
        const perpX = -dy / dist;
        const perpY = dx / dist;
        const step = Math.sin(dist * 0.35) * 2.2;

        this.x += (dx / dist) * this.speed + perpX * step;
        this.y += (dy / dist) * this.speed + perpY * step;
        this.tailAngle += 0.18;

        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. ゆらゆら横しっぽ (右横からぴょこんと立ち上がってゆらゆら揺れるキュートな横しっぽ！)
        ctx.strokeStyle = '#ff99bb';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#ff99bb';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const tailSwing = Math.sin(this.tailAngle) * 6;
        const tailTipX = this.x + 20 + tailSwing;
        const tailTipY = this.y - 5 + Math.cos(this.tailAngle) * 4;

        ctx.moveTo(this.x + 10, this.y + 5); // 右横の付け根
        ctx.quadraticCurveTo(this.x + 20, this.y + 8, tailTipX, tailTipY); // 横に伸びるしっぽ！
        ctx.stroke();

        // 2. 猫の頭 (メインの円)
        ctx.fillStyle = '#ffb3cc';
        ctx.shadowColor = '#ff99bb';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 3. 三角お耳 (外側アウター)
        ctx.fillStyle = '#ff99bb';
        ctx.beginPath();
        // 左耳
        ctx.moveTo(this.x - 14, this.y - 4);
        ctx.lineTo(this.x - 10, this.y - 18);
        ctx.lineTo(this.x - 2, this.y - 10);
        // 右耳
        ctx.moveTo(this.x + 14, this.y - 4);
        ctx.lineTo(this.x + 10, this.y - 18);
        ctx.lineTo(this.x + 2, this.y - 10);
        ctx.fill();

        // 内側インナー耳 (ピンク)
        ctx.fillStyle = '#ff6699';
        ctx.beginPath();
        ctx.moveTo(this.x - 11, this.y - 6); ctx.lineTo(this.x - 9, this.y - 14); ctx.lineTo(this.x - 4, this.y - 9);
        ctx.moveTo(this.x + 11, this.y - 6); ctx.lineTo(this.x + 9, this.y - 14); ctx.lineTo(this.x + 4, this.y - 9);
        ctx.fill();

        // 4. つぶらな黒目 + ハイライト白目
        ctx.fillStyle = '#05070e';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 2.5, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 3, 0.9, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 3, 0.9, 0, Math.PI * 2);
        ctx.fill();

        // 5. 小さなピンクのお鼻 & ωの口元
        ctx.fillStyle = '#ff3366';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#662233';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x - 1.8, this.y + 3.5, 1.8, 0, Math.PI * 0.85);
        ctx.arc(this.x + 1.8, this.y + 3.5, 1.8, 0.15 * Math.PI, Math.PI);
        ctx.stroke();

        // 6. 白くて可愛いおヒゲ (左右6本)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        // 左ヒゲ
        ctx.moveTo(this.x - 8, this.y + 1); ctx.lineTo(this.x - 18, this.y - 1);
        ctx.moveTo(this.x - 8, this.y + 3); ctx.lineTo(this.x - 18, this.y + 4);
        ctx.moveTo(this.x - 8, this.y + 5); ctx.lineTo(this.x - 17, this.y + 9);
        // 右ヒゲ
        ctx.moveTo(this.x + 8, this.y + 1); ctx.lineTo(this.x + 18, this.y - 1);
        ctx.moveTo(this.x + 8, this.y + 3); ctx.lineTo(this.x + 18, this.y + 4);
        ctx.moveTo(this.x + 8, this.y + 5); ctx.lineTo(this.x + 17, this.y + 9);
        ctx.stroke();

        ctx.restore();
    }
}
