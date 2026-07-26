/**
 * ハチワレねこ (額が美しい八の字に割れた白×ダークブルーネイビー柄 ＋ ゴールドアンバー瞳)
 */
class HachiwareCatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT_HACHIWARE', name: 'ハチワレねこ', color: '#2a3b5c', shape: 'cat_hachiware', speedRatio: 1.05, size: 15, hp: 1
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

        // 1. ハチワレのゆらゆら横しっぽ (ダークネイビー＆先白)
        ctx.strokeStyle = '#2a3b5c';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(42, 59, 92, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const tailSwing = Math.sin(this.tailAngle) * 6;
        const tailTipX = this.x + 20 + tailSwing;
        const tailTipY = this.y - 5 + Math.cos(this.tailAngle) * 4;

        ctx.moveTo(this.x + 10, this.y + 5);
        ctx.quadraticCurveTo(this.x + 20, this.y + 8, tailTipX, tailTipY);
        ctx.stroke();

        // 先端が白
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(tailTipX - 3, tailTipY + 1);
        ctx.lineTo(tailTipX, tailTipY);
        ctx.stroke();

        // 2. 猫の頭 (下地ベースカラー: 純白 #ffffff)
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // ★3. ハチワレの代名詞！「八の字」の頭部ダークブルーパターン（額から耳にかけて八に割れた模様）
        ctx.fillStyle = '#2a3b5c';
        ctx.beginPath();
        // 左側の八の字模様 (耳からおでこ中央へ向かって八の字にカット)
        ctx.moveTo(this.x, this.y - 6);
        ctx.lineTo(this.x - 14, this.y - 4);
        ctx.lineTo(this.x - 11, this.y - 18);
        ctx.lineTo(this.x - 2, this.y - 11);
        ctx.closePath();
        ctx.fill();

        // 右側の八の字模様
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 6);
        ctx.lineTo(this.x + 14, this.y - 4);
        ctx.lineTo(this.x + 11, this.y - 18);
        ctx.lineTo(this.x + 2, this.y - 11);
        ctx.closePath();
        ctx.fill();

        // 4. 内側耳 (ピンク)
        ctx.fillStyle = '#ff99bb';
        ctx.beginPath();
        ctx.moveTo(this.x - 11, this.y - 6); ctx.lineTo(this.x - 9, this.y - 14); ctx.lineTo(this.x - 4, this.y - 9);
        ctx.moveTo(this.x + 11, this.y - 6); ctx.lineTo(this.x + 9, this.y - 14); ctx.lineTo(this.x + 4, this.y - 9);
        ctx.fill();

        // 5. ハチワレのつぶらなゴールド・アンバー瞳
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 2.7, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 2.7, 0, Math.PI * 2);
        ctx.fill();

        // 縦スリット瞳孔
        ctx.fillStyle = '#05070e';
        ctx.beginPath();
        ctx.ellipse(this.x - 5, this.y - 2, 1.0, 2.4, 0, 0, Math.PI * 2);
        ctx.ellipse(this.x + 5, this.y - 2, 1.0, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // キラキラハイライト
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 3, 0.8, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 3, 0.8, 0, Math.PI * 2);
        ctx.fill();

        // 6. 小さなぷっくりピンクのお鼻 & ωの口元
        ctx.fillStyle = '#ff4d88';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#2a3b5c';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x - 1.8, this.y + 3.5, 1.8, 0, Math.PI * 0.85);
        ctx.arc(this.x + 1.8, this.y + 3.5, 1.8, 0.15 * Math.PI, Math.PI);
        ctx.stroke();

        // 7. 黒くてキュートなおヒゲ (左右6本)
        ctx.strokeStyle = '#2a3b5c';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(this.x - 8, this.y + 1); ctx.lineTo(this.x - 18, this.y - 1);
        ctx.moveTo(this.x - 8, this.y + 3); ctx.lineTo(this.x - 18, this.y + 4);
        ctx.moveTo(this.x - 8, this.y + 5); ctx.lineTo(this.x - 17, this.y + 9);
        ctx.moveTo(this.x + 8, this.y + 1); ctx.lineTo(this.x + 18, this.y - 1);
        ctx.moveTo(this.x + 8, this.y + 3); ctx.lineTo(this.x + 18, this.y + 4);
        ctx.moveTo(this.x + 8, this.y + 5); ctx.lineTo(this.x + 17, this.y + 9);
        ctx.stroke();

        ctx.restore();
    }
}
