/**
 * 打ち上げ花火玉 (タップ ➔ 上空へヒュ〜〜ッ昇る ➔ 夜空の最高到達点でドーーーンと開花！しだれ柳演出)
 */
class FireworkEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'FIREWORK', name: '打ち上げ花火玉', color: '#ff3366', shape: 'firework', speedRatio: 1.1, size: 14, hp: 1
        });

        // 画面下部から出現
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

        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. 下から上昇するテール煙
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + (Math.random() - 0.5) * 4, this.y + 20);
        ctx.stroke();

        // 2. 花火玉
        ctx.fillStyle = '#ff3366';
        ctx.shadowColor = '#ff3366';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    playLaunchWhistleSound() {
        if (!audioEngine.audioCtx) return;
        const ctx = audioEngine.audioCtx;
        // 上空へヒュ〜〜〜ッと昇る笛音
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }

    playExplosionSound() {
        if (!audioEngine.audioCtx) return;
        const ctx = audioEngine.audioCtx;

        // ドーーーン！という大輪開花破裂音
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.85, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playLaunchWhistleSound();
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;

        // ★タップ位置から上空へ向かって光が高速スパートで駆け上がり、最高点でドカンと大輪開花！
        const startX = touchX;
        const startY = touchY;
        const targetY = Math.max(60, touchY - 180 - Math.random() * 60); // 画面上空の夜空
        let currentY = startY;

        const launchInterval = setInterval(() => {
            currentY -= 18; // 高速スパート上昇

            // 昇っていく光の軌跡粒子
            game.particles.push(new FireworkSpurtParticle(startX, currentY));

            if (currentY <= targetY) {
                clearInterval(launchInterval);
                // 上空最高到達点で大爆発開花！
                this.playExplosionSound();
                this.explodeFireworks(game, startX, targetY);
            }
        }, 16);

        return true;
    }

    explodeFireworks(game, x, y) {
        const colors = ['#ff0055', '#ffe600', '#00f0ff', '#ff33cc', '#ffffff', '#33ff66', '#ffaa00'];
        const particleCount = 36; // 360度大輪花火

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = 4.5 + Math.random() * 3.5;
            const color = colors[i % colors.length];

            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color));
        }

        // 大輪ショックウェーブ
        game.shockwaves.push(new Shockwave(x, y, '#ffe600'));
        game.shockwaves.push(new Shockwave(x, y, '#ff0055'));
    }
}

/** 上昇スパート用の軌跡粒子 */
class FireworkSpurtParticle {
    constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 4;
        this.y = y;
        this.alpha = 1.0;
    }
    update() {
        this.alpha -= 0.12;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

/** 上空で開花して重力で垂れ落ちるしだれ柳花火粒子 */
class FireworkBloomParticle {
    constructor(x, y, angle, speed, color) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
        this.alpha = 1.0;
        this.gravity = 0.08; // しだれ重力
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity; // 重力でハラハラ下垂
        this.vx *= 0.96;
        this.alpha -= 0.018;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
