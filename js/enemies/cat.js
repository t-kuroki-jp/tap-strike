/**
 * にゃんこフェスティバル (ネコ顔・自律ニャーSE)
 */
class CatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT', name: 'にゃんこフェスティバル', color: '#ff99bb', shape: 'cat', speedRatio: 1.0, size: 14, hp: 1
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#ff99bb';
        ctx.shadowColor = '#ff99bb';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x - 12, this.y - 6); ctx.lineTo(this.x - 6, this.y - 15); ctx.lineTo(this.x - 2, this.y - 8);
        ctx.moveTo(this.x + 12, this.y - 6); ctx.lineTo(this.x + 6, this.y - 15); ctx.lineTo(this.x + 2, this.y - 8);
        ctx.fill();

        ctx.fillStyle = '#05070e';
        ctx.beginPath();
        ctx.arc(this.x - 4, this.y - 2, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    playCatSound() {
        audioEngine.playTone({ type: 'triangle', startFreq: 900, endFreq: 1500, duration: 0.2, volume: 0.4 });
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playCatSound();
        game.createParticles(this.x, this.y, '#ff99bb');
        game.ringPulse = 16;
        game.ringColor = '#ff99bb';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ff99bb'));
        return true;
    }
}
