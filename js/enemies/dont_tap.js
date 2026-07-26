/**
 * スルー・ファントム (タップ禁止逆判定)
 */
class DontTapEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'DONT_TAP', name: 'スルー・ファントム', color: '#ff0055', shape: 'cross', speedRatio: 1.0, size: 14, hp: 1
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.lineWidth = 4;
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(this.x - this.size, this.y - this.size);
        ctx.lineTo(this.x + this.size, this.y + this.size);
        ctx.moveTo(this.x + this.size, this.y - this.size);
        ctx.lineTo(this.x - this.size, this.y + this.size);
        ctx.stroke();
        ctx.restore();
    }

    onHit(game, touchX, touchY, isPerfect) {
        // タップしたらミス！
        audioEngine.playMissSound();
        game.combo = 0;
        game.ringPulse = 8;
        game.ringColor = '#ff0055';
        game.missPenaltyTimer = game.params.missPenaltyDuration;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ff0055'));
        game.createParticles(this.x, this.y, '#ff0055');
        this.hp = 0;
        return true;
    }

    onReachCenter(game) {
        // スルー成功！加点
        game.createParticles(this.x, this.y, this.color);
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        audioEngine.playHitSound();
        game.updateUI();
    }
}
