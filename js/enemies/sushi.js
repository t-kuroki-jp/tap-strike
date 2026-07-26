/**
 * 回転マグロ寿司 (公転移動)
 */
class SushiEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SUSHI', name: '回転マグロ寿司', color: '#ff3344', shape: 'sushi', speedRatio: 1.1, size: 15, hp: 1
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
        const orbit = Math.sin(dist * 0.05) * 4.0;

        this.x += (dx / dist) * this.speed + perpX * orbit;
        this.y += (dy / dist) * this.speed + perpY * orbit;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(this.x - 14, this.y - 4, 28, 12, 4);
        ctx.fill();

        ctx.fillStyle = '#ff3344';
        ctx.shadowColor = '#ff3344';
        ctx.beginPath();
        ctx.roundRect(this.x - 15, this.y - 10, 30, 10, 5);
        ctx.fill();
        ctx.restore();
    }

    onHit(game, touchX, touchY, isPerfect) {
        audioEngine.playSushiSound();
        game.createParticles(this.x, this.y, '#ff3344');
        game.ringPulse = 16;
        game.ringColor = '#ff3344';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ff3344'));
        return true;
    }
}
