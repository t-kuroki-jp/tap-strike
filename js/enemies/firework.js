/**
 * 打ち上げ花火玉 (画面下からヒュゥ〜と上昇・タップで上空に色鮮やかな大輪花火が破裂！)
 */
class FireworkEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'FIREWORK', name: '打ち上げ花火玉', color: '#ff3366', shape: 'firework', speedRatio: 1.1, size: 14, hp: 1
        });

        // 画面下部から出現して自機中心（上方向）へ打ち上がる！
        const centerX = canvas.width / 2;
        const offsetX = (Math.random() - 0.5) * (canvas.width * 0.6);
        this.x = centerX + offsetX;
        this.y = canvas.height + 40;
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        // 下から上へ向かって上昇
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. 火花を散らしながら昇る上昇煙テール
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + (Math.random() - 0.5) * 4, this.y + 22);
        ctx.stroke();

        // 2. 打ち上げ花火玉本体 (和風ドラゴン和柄玉)
        ctx.fillStyle = '#ff3366';
        ctx.shadowColor = '#ff3366';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 花火玉の模様 (金色の十字帯)
        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    playFireworkSound() {
        if (!audioEngine.audioCtx) return;
        const ctx = audioEngine.audioCtx;

        // ドンッ！パアァァアン！！という大輪花火の破裂音
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.45);

        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playFireworkSound();

        // ★上空へ色鮮やかな大輪花火パーティクルが円状に大拡散！
        const colors = ['#ff0055', '#ffe600', '#00f0ff', '#ff33cc', '#ffffff', '#33ff66'];
        for (let i = 0; i < 24; i++) {
            const color = colors[i % colors.length];
            game.createParticles(this.x, this.y, color);
        }

        game.ringPulse = 30;
        game.ringColor = '#ffe600';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ffe600'));
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ff0055'));
        return true;
    }
}
