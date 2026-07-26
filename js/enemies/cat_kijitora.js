/**
 * キジトラねこ (ブラウンベージュベース ＋ ダークブラウンのトラ縞模様 ＋ エメラルドグリーン瞳)
 */
class KijitoraCatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT_KIJITORA', name: 'キジトラねこ', color: '#d9a05b', shape: 'cat_kijitora', speedRatio: 1.08, size: 15, hp: 1
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
        const step = Math.sin(dist * 0.35) * 2.3;

        this.x += (dx / dist) * this.speed + perpX * step;
        this.y += (dy / dist) * this.speed + perpY * step;
        this.tailAngle += 0.18;

        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. キジトラの縞模様ゆらゆら横しっぽ
        ctx.strokeStyle = '#c48946';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(217, 160, 91, 0.5)';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const tailSwing = Math.sin(this.tailAngle) * 6;
        const tailTipX = this.x + 20 + tailSwing;
        const tailTipY = this.y - 5 + Math.cos(this.tailAngle) * 4;

        ctx.moveTo(this.x + 10, this.y + 5);
        ctx.quadraticCurveTo(this.x + 20, this.y + 8, tailTipX, tailTipY);
        ctx.stroke();

        // しっぽのトラ縞模様
        ctx.strokeStyle = '#5a3d1e';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(this.x + 14, this.y + 6); ctx.lineTo(this.x + 15, this.y + 2);
        ctx.moveTo(this.x + 18, this.y + 5); ctx.lineTo(this.x + 19, this.y + 1);
        ctx.stroke();

        // 2. 猫の頭 (キジトラのベースカラー: ウォームブラウンベージュ)
        ctx.fillStyle = '#d9a05b';
        ctx.shadowColor = 'rgba(217, 160, 91, 0.6)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 3. 三角お耳
        ctx.fillStyle = '#c48946';
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

        // 内側耳 (ピンク)
        ctx.fillStyle = '#ff99bb';
        ctx.beginPath();
        ctx.moveTo(this.x - 11, this.y - 6); ctx.lineTo(this.x - 9, this.y - 14); ctx.lineTo(this.x - 4, this.y - 9);
        ctx.moveTo(this.x + 11, this.y - 6); ctx.lineTo(this.x + 9, this.y - 14); ctx.lineTo(this.x + 4, this.y - 9);
        ctx.fill();

        // ★4. キジトラ特有の頭頂部＆額のダークブラウントラ縞模様（M字模様）
        ctx.strokeStyle = '#4a3016';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        // 額のM字中央縞
        ctx.moveTo(this.x, this.y - 13); ctx.lineTo(this.x, this.y - 6);
        ctx.moveTo(this.x - 4, this.y - 12); ctx.lineTo(this.x - 2, this.y - 7);
        ctx.moveTo(this.x + 4, this.y - 12); ctx.lineTo(this.x + 2, this.y - 7);
        // 頬のトラ縞模様
        ctx.moveTo(this.x - 13, this.y - 2); ctx.lineTo(this.x - 8, this.y - 1);
        ctx.moveTo(this.x - 13, this.y + 2); ctx.lineTo(this.x - 8, this.y + 2);
        ctx.moveTo(this.x + 13, this.y - 2); ctx.lineTo(this.x + 8, this.y - 1);
        ctx.moveTo(this.x + 13, this.y + 2); ctx.lineTo(this.x + 8, this.y + 2);
        ctx.stroke();

        // 5. キジトラのつぶらなエメラルドグリーン瞳
        ctx.fillStyle = '#00cc66';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 2.8, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 2.8, 0, Math.PI * 2);
        ctx.fill();

        // 縦スリット瞳孔
        ctx.fillStyle = '#05070e';
        ctx.beginPath();
        ctx.ellipse(this.x - 5, this.y - 2, 1.1, 2.5, 0, 0, Math.PI * 2);
        ctx.ellipse(this.x + 5, this.y - 2, 1.1, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // キラキラハイライト
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 3, 0.8, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 3, 0.8, 0, Math.PI * 2);
        ctx.fill();

        // 6. 小さなピンクのお鼻 & ωの口元
        ctx.fillStyle = '#ff6699';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#4a3016';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x - 1.8, this.y + 3.5, 1.8, 0, Math.PI * 0.85);
        ctx.arc(this.x + 1.8, this.y + 3.5, 1.8, 0.15 * Math.PI, Math.PI);
        ctx.stroke();

        // 7. 白くて可愛いおヒゲ
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.2;
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
