/**
 * ぴよぴよヒヨコ (跳ね移動・自律ピヨピヨSE)
 */
class ChickenEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CHICKEN', name: 'ぴよぴよヒヨコ', color: '#ffe600', shape: 'chick', speedRatio: 1.0, size: 14, hp: 1
        });
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
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#05070e';
        ctx.beginPath();
        ctx.arc(this.x - 4, this.y - 3, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 3, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(this.x - 3, this.y + 1);
        ctx.lineTo(this.x + 3, this.y + 1);
        ctx.lineTo(this.x, this.y + 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    playChickSound() {
        audioEngine.playTone({ type: 'sine', startFreq: 1600, endFreq: 3200, duration: 0.06, volume: 0.4 });
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playChickSound();
        game.createParticles(this.x, this.y, '#ffe600');
        game.ringPulse = 14;
        game.ringColor = '#ffe600';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ffe600'));
        return true;
    }
}
