/**
 * メガボム (画面大爆発・自律爆発SE)
 */
class BombEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'BOMB', name: 'メガ・ボム', color: '#ff2200', shape: 'bomb', speedRatio: 1.0, size: 14, hp: 1
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#ff2200';
        ctx.shadowColor = '#ff2200';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x + 6, this.y - this.size - 8);
        ctx.stroke();
        ctx.restore();
    }

    playBombSound() {
        if (window.audioEngine) {
            audioEngine.playTone({ type: 'sawtooth', startFreq: 300, endFreq: 40, duration: 0.35, volume: 0.6 });
        }
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playBombSound();
        for (let b = 0; b < 4; b++) {
            game.createParticles(this.x, this.y, '#ff2200');
            game.createParticles(this.x, this.y, '#ffe600');
            game.createParticles(this.x, this.y, '#ffffff');
        }
        game.ringPulse = 35;
        game.ringColor = '#ff3300';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo * 2;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ff3300'));
        return true;
    }
}
