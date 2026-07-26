/**
 * ぴよぴよヒヨコ (ふっくら2段モチモチボディ・パタパタ翼・立体くちばし・チョコン尾羽・アホ毛)
 */
class ChickenEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CHICKEN', name: 'ぴよぴよヒヨコ', color: '#ffe600', shape: 'chick', speedRatio: 1.0, size: 17, hp: 1
        });
        this.wingAngle = Math.random() * Math.PI * 2;
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        const perpX = -dy / dist;
        const perpY = dx / dist;
        // ひよこ特有の「ちょこちょこ」跳ねるリズム歩行
        const hop = Math.sin(dist * 0.28) * 3.0;

        this.x += (dx / dist) * this.speed + perpX * hop;
        this.y += (dy / dist) * this.speed + perpY * hop;
        this.wingAngle += 0.3;

        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. おしりのチョコンとした尾羽 (ぴょこん)
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 13, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. チョコンとついた小さな翼 (パタパタアニメーション)
        const wingYOffset = Math.sin(this.wingAngle) * 2.5;
        ctx.fillStyle = '#ffdb1a';
        ctx.shadowColor = 'rgba(255, 230, 0, 0.4)';
        ctx.shadowBlur = 6;

        // 左羽
        ctx.beginPath();
        ctx.ellipse(this.x - 13, this.y + 3 + wingYOffset, 4, 7, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        // 右羽
        ctx.beginPath();
        ctx.ellipse(this.x + 13, this.y + 3 + wingYOffset, 4, 7, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // 3. オレンジの小さなちょこん足 (2本)
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x - 4, this.y + 12); ctx.lineTo(this.x - 6, this.y + 17);
        ctx.moveTo(this.x + 4, this.y + 12); ctx.lineTo(this.x + 6, this.y + 17);
        ctx.stroke();

        // 4. ひよこモチモチ2段体型 (下部ふっくらおなか ＋ 上部まるまるお顔)
        // 胴体 (ふっくらおなか)
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y + 4, 13, 0, Math.PI * 2);
        ctx.fill();

        // お顔 (まんまる頭)
        ctx.beginPath();
        ctx.arc(this.x, this.y - 4, 11, 0, Math.PI * 2);
        ctx.fill();

        // 5. 頭の上のふわふわアホ毛 (チョコンと2本)
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x - 1, this.y - 14);
        ctx.quadraticCurveTo(this.x - 5, this.y - 20, this.x - 3, this.y - 22);
        ctx.moveTo(this.x + 1, this.y - 14);
        ctx.quadraticCurveTo(this.x + 4, this.y - 19, this.x + 3, this.y - 21);
        ctx.stroke();

        // 6. ほんのりピンクのほっぺた (チーク 💕)
        ctx.fillStyle = 'rgba(255, 99, 132, 0.55)';
        ctx.beginPath();
        ctx.arc(this.x - 7.5, this.y - 2, 3.2, 0, Math.PI * 2);
        ctx.arc(this.x + 7.5, this.y - 2, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // 7. つぶらな大きい黒目 ＋ ハイライト (パッチリキュート)
        ctx.fillStyle = '#0a0d14';
        ctx.beginPath();
        ctx.arc(this.x - 4.5, this.y - 6, 2.5, 0, Math.PI * 2);
        ctx.arc(this.x + 4.5, this.y - 6, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 白目ハイライト (キラキラ)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 5.5, this.y - 7, 1.0, 0, Math.PI * 2);
        ctx.arc(this.x + 3.5, this.y - 7, 1.0, 0, Math.PI * 2);
        ctx.fill();

        // 8. ぽっこり立体三角形のくちばし (上くちばし ＋ 下くちばし)
        ctx.fillStyle = '#ff6600';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        // 上くちばし
        ctx.moveTo(this.x - 4, this.y - 3);
        ctx.lineTo(this.x + 4, this.y - 3);
        ctx.lineTo(this.x, this.y + 3);
        ctx.closePath();
        ctx.fill();

        // 下くちばし (ぷっくり影)
        ctx.fillStyle = '#e65c00';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 2.0, 0, Math.PI);
        ctx.fill();

        ctx.restore();

        // 9. 被弾エフェクト / HPバー
        this.drawHitEffect(ctx);
        this.drawHpBar(ctx);
    }
}
