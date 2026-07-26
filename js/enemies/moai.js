/**
 * ジャイアント・モアイ (ハッキリわかるモアイ顔構造・判定リング視界確保・岩石SE)
 */
class MoaiEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'MOAI', name: 'ジャイアント・モアイ', color: '#8899aa', shape: 'moai', speedRatio: 0.75, size: 16, hp: 1
        });
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        this.maxDistance = Math.hypot(centerX - this.x, centerY - this.y);
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        // ★判定リング (65px) の内側にしっかり治まるハッキリモアイサイズ (16px ➔ 32px)
        const progress = Math.min(1.0, Math.max(0.0, 1.0 - (dist / (this.maxDistance || 300))));
        this.size = 16 + progress * 16;

        return dist;
    }

    draw(ctx) {
        ctx.save();
        const s = this.size / 20; // スケール倍率

        // 1. モアイベース顔影
        ctx.fillStyle = '#556677';
        ctx.shadowColor = '#8899aa';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(this.x - 14 * s, this.y - 22 * s, 28 * s, 44 * s, 6 * s);
        ctx.fill();

        // 2. モアイ表面構造 (石像グレー)
        ctx.fillStyle = '#8899aa';
        ctx.beginPath();
        ctx.roundRect(this.x - 12 * s, this.y - 20 * s, 24 * s, 40 * s, 5 * s);
        ctx.fill();

        // 3. 突き出た大きなオデコ・眉
        ctx.fillStyle = '#aabbcc';
        ctx.beginPath();
        ctx.rect(this.x - 10 * s, this.y - 17 * s, 20 * s, 5 * s);
        ctx.fill();

        // 4. 深い無表情の窪んだ目 (黒穴)
        ctx.fillStyle = '#112233';
        ctx.beginPath();
        ctx.rect(this.x - 9 * s, this.y - 11 * s, 7 * s, 4 * s);
        ctx.rect(this.x + 2 * s, this.y - 11 * s, 7 * s, 4 * s);
        ctx.fill();

        // 5. 巨大で突き出たモアイの鼻
        ctx.fillStyle = '#bbccdd';
        ctx.beginPath();
        ctx.moveTo(this.x - 3 * s, this.y - 6 * s);
        ctx.lineTo(this.x + 3 * s, this.y - 6 * s);
        ctx.lineTo(this.x + 5 * s, this.y + 8 * s);
        ctx.lineTo(this.x - 5 * s, this.y + 8 * s);
        ctx.closePath();
        ctx.fill();

        // 6. 一文字の固い無表情口元
        ctx.strokeStyle = '#112233';
        ctx.lineWidth = Math.max(1.5, 2.5 * s);
        ctx.beginPath();
        ctx.moveTo(this.x - 8 * s, this.y + 13 * s);
        ctx.lineTo(this.x + 8 * s, this.y + 13 * s);
        ctx.stroke();

        // 7. がっしりした四角い顎 (あご)
        ctx.fillStyle = '#667788';
        ctx.beginPath();
        ctx.rect(this.x - 10 * s, this.y + 15 * s, 20 * s, 4 * s);
        ctx.fill();

        ctx.restore();
    }

    playMoaiSound() {
        if (!audioEngine.audioCtx) return;
        const ctx = audioEngine.audioCtx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.6, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playMoaiSound();
        game.createParticles(this.x, this.y, '#8899aa');
        game.createParticles(this.x, this.y, '#bbccdd');
        game.ringPulse = 20;
        game.ringColor = '#8899aa';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#8899aa'));
        return true;
    }
}
