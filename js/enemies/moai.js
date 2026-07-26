/**
 * ジャイアント・モアイ (超巨大無表情モアイ・重厚ゴツン寺院SE)
 */
class MoaiEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'MOAI', name: 'ジャイアント・モアイ', color: '#8899aa', shape: 'moai', speedRatio: 0.75, size: 28, hp: 1
        });
    }

    draw(ctx) {
        ctx.save();

        // 1. モアイベース顔影
        ctx.fillStyle = '#667788';
        ctx.shadowColor = '#8899aa';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(this.x - 18, this.y - 28, 36, 56, 8);
        ctx.fill();

        // 2. モアイ表面構造 (灰色石像)
        ctx.fillStyle = '#8899aa';
        ctx.beginPath();
        ctx.roundRect(this.x - 16, this.y - 26, 32, 52, 6);
        ctx.fill();

        // 3. 突き出た大きなオデコ・眉
        ctx.fillStyle = '#aabbcc';
        ctx.beginPath();
        ctx.rect(this.x - 14, this.y - 22, 28, 6);
        ctx.fill();

        // 4. 深い無表情の窪んだ目 (黒穴)
        ctx.fillStyle = '#223344';
        ctx.beginPath();
        ctx.rect(this.x - 12, this.y - 14, 8, 4);
        ctx.rect(this.x + 4, this.y - 14, 8, 4);
        ctx.fill();

        // 5. 巨大で突き出たモアイの鼻
        ctx.fillStyle = '#bbccdd';
        ctx.beginPath();
        ctx.moveTo(this.x - 4, this.y - 10);
        ctx.lineTo(this.x + 4, this.y - 10);
        ctx.lineTo(this.x + 6, this.y + 10);
        ctx.lineTo(this.x - 6, this.y + 10);
        ctx.closePath();
        ctx.fill();

        // 6. 一文字の固い口元
        ctx.strokeStyle = '#223344';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x - 10, this.y + 16);
        ctx.lineTo(this.x + 10, this.y + 16);
        ctx.stroke();

        // 7. がっしりした四角い顎 (あご)
        ctx.fillStyle = '#778899';
        ctx.beginPath();
        ctx.rect(this.x - 14, this.y + 19, 28, 5);
        ctx.fill();

        ctx.restore();
    }

    playMoaiSound() {
        // 重厚なゴツン重低音 + 仏教の鐘のような残響音
        audioEngine.playTone({ type: 'sawtooth', startFreq: 120, endFreq: 40, duration: 0.35, volume: 0.6 });
        setTimeout(() => {
            audioEngine.playTone({ type: 'sine', startFreq: 100, endFreq: 50, duration: 0.5, volume: 0.4 });
        }, 80);
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playMoaiSound();
        for (let i = 0; i < 2; i++) {
            game.createParticles(this.x, this.y, '#8899aa');
            game.createParticles(this.x, this.y, '#bbccdd');
        }
        game.ringPulse = 25;
        game.ringColor = '#8899aa';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#8899aa'));
        return true;
    }
}
