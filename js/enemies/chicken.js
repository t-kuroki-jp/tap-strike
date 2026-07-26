/**
 * ぴよぴよヒヨコ (パタパタ羽ばたき・頭のアホ毛・ピンクのチーク・立体くちばし・ピヨッSE)
 */
class ChickenEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CHICKEN', name: 'ぴよぴよヒヨコ', color: '#ffe600', shape: 'chick', speedRatio: 1.0, size: 15, hp: 1
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
        const hop = Math.sin(dist * 0.2) * 2.5;

        this.x += (dx / dist) * this.speed + perpX * hop;
        this.y += (dy / dist) * this.speed + perpY * hop;
        this.wingAngle += 0.25;

        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. パタパタ羽ばたく翼 (両側)
        const wingYOffset = Math.sin(this.wingAngle) * 3;
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 6;

        // 左翼
        ctx.beginPath();
        ctx.ellipse(this.x - 14, this.y + wingYOffset, 6, 9, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        // 右翼
        ctx.beginPath();
        ctx.ellipse(this.x + 14, this.y + wingYOffset, 6, 9, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // 2. 小さなオレンジの足 (2本)
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x - 5, this.y + 12); ctx.lineTo(this.x - 7, this.y + 18);
        ctx.moveTo(this.x + 5, this.y + 12); ctx.lineTo(this.x + 7, this.y + 18);
        ctx.stroke();

        // 3. ひよこ本体 (ふわふわイエローの丸)
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 4. 頭の上のピヨンと立つ可愛いアホ毛 (2本)
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x - 2, this.y - this.size);
        ctx.quadraticCurveTo(this.x - 6, this.y - this.size - 8, this.x - 4, this.y - this.size - 10);
        ctx.moveTo(this.x + 1, this.y - this.size);
        ctx.quadraticCurveTo(this.x + 4, this.y - this.size - 8, this.x + 5, this.y - this.size - 9);
        ctx.stroke();

        // 5. ほんのりピンクのチーク (ほっぺた 💕)
        ctx.fillStyle = 'rgba(255, 102, 153, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x - 9, this.y + 2, 3.5, 0, Math.PI * 2);
        ctx.arc(this.x + 9, this.y + 2, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // 6. つぶらな黒目 + キラキラ白目ハイライト
        ctx.fillStyle = '#05070e';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 3, 2.3, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 3, 2.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 4, 0.8, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 4, 0.8, 0, Math.PI * 2);
        ctx.fill();

        // 7. ぷっくり立体オレンジくちばし
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(this.x - 3.5, this.y);
        ctx.lineTo(this.x + 3.5, this.y);
        ctx.lineTo(this.x, this.y + 5.5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    playChickSound() {
        audioEngine.playTone({ type: 'sine', startFreq: 1800, endFreq: 3400, duration: 0.07, volume: 0.4 });
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playChickSound();
        game.createParticles(this.x, this.y, '#ffe600');
        game.createParticles(this.x, this.y, '#ffffff');
        game.ringPulse = 16;
        game.ringColor = '#ffe600';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ffe600'));
        return true;
    }
}
