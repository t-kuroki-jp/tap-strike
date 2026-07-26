/**
 * キジトラねこ (透き通る薄いオリーブライム瞳 ＋ 口元〜顎の白いふっくら毛 ＋ 繊細なタビー模様)
 */
class KijitoraCatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT_KIJITORA', name: 'キジトラねこ', color: '#9c7344', shape: 'cat_kijitora', speedRatio: 1.08, size: 15, hp: 1
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
        ctx.strokeStyle = '#9c7344';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(156, 115, 68, 0.4)';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const tailSwing = Math.sin(this.tailAngle) * 6;
        const tailTipX = this.x + 20 + tailSwing;
        const tailTipY = this.y - 5 + Math.cos(this.tailAngle) * 4;

        ctx.moveTo(this.x + 10, this.y + 5);
        ctx.quadraticCurveTo(this.x + 20, this.y + 8, tailTipX, tailTipY);
        ctx.stroke();

        // しっぽのトラ縞
        ctx.strokeStyle = '#3b2612';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(this.x + 14, this.y + 6); ctx.lineTo(this.x + 15, this.y + 2);
        ctx.moveTo(this.x + 18, this.y + 5); ctx.lineTo(this.x + 19, this.y + 1);
        ctx.stroke();

        // 2. 猫の頭 (ベース: キジトラブラウン)
        ctx.fillStyle = '#9c7344';
        ctx.shadowColor = 'rgba(156, 115, 68, 0.5)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // ★3. 口元〜顎にかけての広めの白い毛 (参考画像に忠実な口周りの白さ！)
        ctx.fillStyle = '#fbf9f2';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 6, 8.5, 6.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 4. 三角お耳 (キジトラブラウン)
        ctx.fillStyle = '#805b33';
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

        // 内側耳 (薄ピンク)
        ctx.fillStyle = '#f2b3c4';
        ctx.beginPath();
        ctx.moveTo(this.x - 11, this.y - 6); ctx.lineTo(this.x - 9, this.y - 14); ctx.lineTo(this.x - 4, this.y - 9);
        ctx.moveTo(this.x + 11, this.y - 6); ctx.lineTo(this.x + 9, this.y - 14); ctx.lineTo(this.x + 4, this.y - 9);
        ctx.fill();

        // 5. 額のM字模様＆目周りのタビー縞模様 (ダークブラウン)
        ctx.strokeStyle = '#38220f';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        // 額のM字
        ctx.moveTo(this.x, this.y - 13); ctx.lineTo(this.x, this.y - 7);
        ctx.moveTo(this.x - 4, this.y - 12); ctx.lineTo(this.x - 2, me => {}); ctx.lineTo(this.x - 2, this.y - 7);
        ctx.moveTo(this.x + 4, this.y - 12); ctx.lineTo(this.x + 2, this.y - 7);
        // 目尻のアイライン模様
        ctx.moveTo(this.x - 9, this.y - 4); ctx.lineTo(this.x - 14, this.y - 2);
        ctx.moveTo(this.x + 9, this.y - 4); ctx.lineTo(this.x + 14, this.y - 2);
        ctx.stroke();

        // ★6. 薄く透き通るような明るいオリーブイエローグリーンの瞳 (参考画像に忠実！)
        ctx.fillStyle = '#b5ce5d';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 2.9, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 2.9, 0, Math.PI * 2);
        ctx.fill();

        // 縦スリット瞳孔
        ctx.fillStyle = '#141412';
        ctx.beginPath();
        ctx.ellipse(this.x - 5, this.y - 2, 1.1, 2.5, 0, 0, Math.PI * 2);
        ctx.ellipse(this.x + 5, this.y - 2, 1.1, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // キラキラハイライト
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 3.2, 0.8, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 3.2, 0.8, 0, Math.PI * 2);
        ctx.fill();

        // 7. ピンクブラウンの小さいお鼻 (参考画像のリアルな鼻色)
        ctx.fillStyle = '#a85d43';
        ctx.beginPath();
        ctx.moveTo(this.x - 1.8, this.y + 1);
        ctx.lineTo(this.x + 1.8, this.y + 1);
        ctx.lineTo(this.x, this.y + 3.2);
        ctx.closePath();
        ctx.fill();

        // 口元ωライン
        ctx.strokeStyle = '#4a2c17';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x - 1.8, this.y + 4.2, 1.8, 0, Math.PI * 0.85);
        ctx.arc(this.x + 1.8, this.y + 4.2, 1.8, 0.15 * Math.PI, Math.PI);
        ctx.stroke();

        // 8. 白くて長いおヒゲ
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(this.x - 7, this.y + 3); ctx.lineTo(this.x - 18, this.y + 1);
        ctx.moveTo(this.x - 7, this.y + 4.5); ctx.lineTo(this.x - 18, this.y + 5.5);
        ctx.moveTo(this.x - 7, this.y + 6); ctx.lineTo(this.x - 17, this.y + 10);
        ctx.moveTo(this.x + 7, this.y + 3); ctx.lineTo(this.x + 18, this.y + 1);
        ctx.moveTo(this.x + 7, this.y + 4.5); ctx.lineTo(this.x + 18, this.y + 5.5);
        ctx.moveTo(this.x + 7, this.y + 6); ctx.lineTo(this.x + 17, this.y + 10);
        ctx.stroke();

        ctx.restore();
    }
}
