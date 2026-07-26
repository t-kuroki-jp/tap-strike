/**
 * ハチワレねこ (漆黒のブラック頭部 ＋ 参考画像通りの美しい八の字ホワイトパターン ＋ 薄イエローグリーン瞳)
 */
class HachiwareCatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT_HACHIWARE', name: 'ハチワレねこ', color: '#16161c', shape: 'cat_hachiware', speedRatio: 1.05, size: 15, hp: 1
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

        // 1. ハチワレのゆらゆら横しっぽ (漆黒 ＋ 先端ホワイト)
        ctx.strokeStyle = '#16161c';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(22, 22, 28, 0.6)';
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

        // ★2. 猫の頭 (黒い部分がしっかり覆う漆黒ベース: #16161c)
        ctx.fillStyle = '#16161c';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 3. 三角お耳 (漆黒)
        ctx.fillStyle = '#16161c';
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

        // 内側耳 (淡いピンク)
        ctx.fillStyle = '#f2a6b8';
        ctx.beginPath();
        ctx.moveTo(this.x - 11, this.y - 6); ctx.lineTo(this.x - 9, this.y - 14); ctx.lineTo(this.x - 4, this.y - 9);
        ctx.moveTo(this.x + 11, this.y - 6); ctx.lineTo(this.x + 9, this.y - 14); ctx.lineTo(this.x + 4, this.y - 9);
        ctx.fill();

        // ★4. 参考画像通りの美しい「八の字」ホワイトパターン (額から鼻筋〜口元・顎下にかけて白が美しく切り込む)
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 8); // 額の中央から八の字スタート
        ctx.lineTo(this.x - 5, this.y - 2); // 左目内側を通る
        ctx.lineTo(this.x - 10, this.y + 8); // 左頬・顎下へ広がる
        ctx.lineTo(this.x + 10, this.y + 8); // 右頬・顎下へ広がる
        ctx.lineTo(this.x + 5, this.y - 2); // 右目内側を通る
        ctx.closePath();
        ctx.fill();

        // 5. 参考画像に忠実な薄いオリーブイエローグリーンの瞳
        ctx.fillStyle = '#b0ce57';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 2.8, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 2.8, 0, Math.PI * 2);
        ctx.fill();

        // 縦スリット瞳孔
        ctx.fillStyle = '#0a0b0e';
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

        // 6. 参考画像のような可愛いピンクのお鼻 (サーモンピンク)
        ctx.fillStyle = '#e8788c';
        ctx.beginPath();
        ctx.moveTo(this.x - 1.8, this.y + 1);
        ctx.lineTo(this.x + 1.8, this.y + 1);
        ctx.lineTo(this.x, this.y + 3.2);
        ctx.closePath();
        ctx.fill();

        // 口元ωライン
        ctx.strokeStyle = '#2d2e38';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x - 1.8, this.y + 4.2, 1.8, 0, Math.PI * 0.85);
        ctx.arc(this.x + 1.8, this.y + 4.2, 1.8, 0.15 * Math.PI, Math.PI);
        ctx.stroke();

        // 7. 白くてキュートなおヒゲ (左右6本)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(this.x - 8, this.y + 2); ctx.lineTo(this.x - 18, this.y);
        ctx.moveTo(this.x - 8, this.y + 4); ctx.lineTo(this.x - 18, me => {}); ctx.lineTo(this.x - 18, this.y + 5);
        ctx.moveTo(this.x - 8, this.y + 6); ctx.lineTo(this.x - 17, this.y + 10);
        ctx.moveTo(this.x + 8, this.y + 2); ctx.lineTo(this.x + 18, this.y);
        ctx.moveTo(this.x + 8, this.y + 4); ctx.lineTo(this.x + 18, this.y + 5);
        ctx.moveTo(this.x + 8, this.y + 6); ctx.lineTo(this.x + 17, this.y + 10);
        ctx.stroke();

        ctx.restore();
    }
}
