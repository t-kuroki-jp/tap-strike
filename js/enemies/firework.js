/**
 * 打ち上げ花火玉 (斜め下からダイナミック直線上昇・140粒子超豪華三輪スターマイン)
 */
class FireworkEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'FIREWORK', name: '打ち上げ花火玉', color: '#ff3366', shape: 'firework', speedRatio: 0.75, size: 15, hp: 1
        });

        // 画面下部の左右ワイドな位置
        const margin = canvas.width * 0.08;
        this.x = margin + Math.random() * (canvas.width - margin * 2);
        this.y = canvas.height + 40;

        // ★中央へ引き寄せられず、画面の下から斜め上へ向かってダイナミックに突き抜ける直進ベクトル！
        const centerX = canvas.width / 2;
        const targetX = centerX + (this.x - centerX) * 0.4; // 左右斜め上方向へ直進
        const targetY = canvas.height * 0.2;

        const vx = targetX - this.x;
        const vy = targetY - this.y;
        const len = Math.hypot(vx, vy);

        this.dirX = (vx / len) * this.speed;
        this.dirY = (vy / len) * this.speed;
    }

    update(playerTargetRadius) {
        // 斜め下からダイナミックに直進！
        this.x += this.dirX;
        this.y += this.dirY;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        return Math.hypot(centerX - this.x, centerY - this.y);
    }

    draw(ctx) {
        ctx.save();

        // 1. 進行方向の反対へ伸びる綺麗なテール火花
        const angle = Math.atan2(this.dirY, this.dirX);
        const tailX = this.x - Math.cos(angle) * 26;
        const tailY = this.y - Math.sin(angle) * 26;

        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 4.0;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX + (Math.random() - 0.5) * 3, tailY + (Math.random() - 0.5) * 3);
        ctx.stroke();

        // 2. 打ち上げ花火玉
        ctx.fillStyle = '#ff3366';
        ctx.shadowColor = '#ff3366';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }

    playLaunchWhistleSound() {
        if (!audioEngine.audioCtx) return;
        const ctx = audioEngine.audioCtx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.42);

        gain.gain.setValueAtTime(0.45, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.42);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.42);
    }

    playExplosionSound() {
        if (!audioEngine.audioCtx) return;
        const ctx = audioEngine.audioCtx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + 0.75);

        gain.gain.setValueAtTime(1.0, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.75);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.75);
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playLaunchWhistleSound();
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;

        // ★現在位置から、そのまま斜め上空の夜空へスパート打ち上げ！
        const launchX = this.x;
        const startY = this.y;

        // 進行方向の斜め上の上空位置へ
        const targetX = Math.min(this.canvas.width - 25, Math.max(25, launchX + this.dirX * 35));
        const targetY = Math.max(50, this.canvas.height * 0.15 + Math.random() * 70);

        let currentX = launchX;
        let currentY = startY;

        const launchInterval = setInterval(() => {
            currentY -= 19;
            currentX += (targetX - currentX) * 0.18;

            game.particles.push(new FireworkSpurtParticle(currentX, currentY));

            if (currentY <= targetY) {
                clearInterval(launchInterval);
                this.playExplosionSound();
                this.explodeFireworks(game, targetX, targetY);
            }
        }, 16);

        return true;
    }

    explodeFireworks(game, x, y) {
        const palette = ['#ff0055', '#ffe600', '#00f0ff', '#ff33cc', '#ffffff', '#33ff66', '#ffaa00', '#aa00ff', '#ff6600'];

        // 140粒子の超ゴージャス三輪スターマイン！
        const outerCount = 60;
        for (let i = 0; i < outerCount; i++) {
            const angle = (i / outerCount) * Math.PI * 2;
            const speed = 7.0 + Math.random() * 3.5;
            const color = palette[i % palette.length];
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 4.5));
        }

        const midCount = 40;
        for (let i = 0; i < midCount; i++) {
            const angle = (i / midCount) * Math.PI * 2;
            const speed = 4.0 + Math.random() * 2.0;
            const color = '#ffe600';
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 3.5));
        }

        const innerCount = 40;
        for (let i = 0; i < innerCount; i++) {
            const angle = (i / innerCount) * Math.PI * 2;
            const speed = 1.8 + Math.random() * 1.5;
            const color = '#ffffff';
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 3.0));
        }

        game.shockwaves.push(new Shockwave(x, y, '#ffe600'));
        game.shockwaves.push(new Shockwave(x, y, '#ff0055'));
        game.shockwaves.push(new Shockwave(x, y, '#00f0ff'));
        game.shockwaves.push(new Shockwave(x, y, '#ffffff'));
    }
}

/** 上昇スパート用の軌跡粒子 */
class FireworkSpurtParticle {
    constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 3;
        this.y = y;
        this.alpha = 1.0;
    }
    update() {
        this.alpha -= 0.11;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

/** 画面上空で開花して夜空一面に長く下垂するしだれ柳花火粒子 */
class FireworkBloomParticle {
    constructor(x, y, angle, speed, color, size) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
        this.size = size;
        this.alpha = 1.0;
        this.gravity = 0.065;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.965;
        this.alpha -= 0.011;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
