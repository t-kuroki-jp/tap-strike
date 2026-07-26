/**
 * 打ち上げ花火玉 (画面下部左右ワイド出現・タップで左右上空ワイド飛翔＆多重スターマイン開花)
 */
class FireworkEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'FIREWORK', name: '打ち上げ花火玉', color: '#ff3366', shape: 'firework', speedRatio: 0.7, size: 15, hp: 1
        });

        // ★画面下部の左右幅広い位置 (画面横幅の 15% 〜 85% の範囲) からランダム出現！
        const margin = canvas.width * 0.15;
        this.x = margin + Math.random() * (canvas.width - margin * 2);
        this.y = canvas.height + 40;
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        // 下の左右から判定リング（中央）に向かってゆったり上昇
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. 下へ伸びる火花テール
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + (Math.random() - 0.5) * 3, this.y + 26);
        ctx.stroke();

        // 2. 打ち上げ花火玉
        ctx.fillStyle = '#ff3366';
        ctx.shadowColor = '#ff3366';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 2;
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
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1900, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    }

    playExplosionSound() {
        if (!audioEngine.audioCtx) return;
        const ctx = audioEngine.audioCtx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.6);

        gain.gain.setValueAtTime(0.95, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playLaunchWhistleSound();
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;

        // ★タップ位置から、上空の「左・中央・右」へダイナミックに左右散らばって打ち上がる！
        const launchX = this.x;
        const startY = this.y;

        // 夜空の上空目標 (左・中・右にワイドに分散)
        const spreadOffset = (Math.random() - 0.5) * (this.canvas.width * 0.7);
        const targetX = Math.min(this.canvas.width - 40, Math.max(40, (this.canvas.width / 2) + spreadOffset));
        const targetY = Math.max(60, this.canvas.height * 0.18 + Math.random() * 80);

        let currentX = launchX;
        let currentY = startY;

        const launchInterval = setInterval(() => {
            currentY -= 18;
            currentX += (targetX - currentX) * 0.16; // 目標の左右位置へカーブ誘導

            // 上昇軌跡
            game.particles.push(new FireworkSpurtParticle(currentX, currentY));

            if (currentY <= targetY) {
                clearInterval(launchInterval);
                // 夜空の各位置でダイナミックに大輪スターマイン開花！
                this.playExplosionSound();
                this.explodeFireworks(game, targetX, targetY);
            }
        }, 16);

        return true;
    }

    explodeFireworks(game, x, y) {
        const palette = ['#ff0055', '#ffe600', '#00f0ff', '#ff33cc', '#ffffff', '#33ff66', '#ffaa00', '#aa00ff'];

        // 72粒子の多重豪華大輪スターマイン！
        const outerCount = 48;
        for (let i = 0; i < outerCount; i++) {
            const angle = (i / outerCount) * Math.PI * 2;
            const speed = 5.5 + Math.random() * 2.5;
            const color = palette[i % palette.length];
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 4.0));
        }

        const innerCount = 24;
        for (let i = 0; i < innerCount; i++) {
            const angle = (i / innerCount) * Math.PI * 2;
            const speed = 2.5 + Math.random() * 1.5;
            const color = '#ffffff';
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 3.0));
        }

        game.shockwaves.push(new Shockwave(x, y, '#ffe600'));
        game.shockwaves.push(new Shockwave(x, y, '#ff0055'));
        game.shockwaves.push(new Shockwave(x, y, '#00f0ff'));
    }
}

/** 上昇スパート用の軌跡粒子 */
class FireworkSpurtParticle {
    constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 2;
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
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

/** 上空で開花して広大に広がるしだれ柳花火粒子 */
class FireworkBloomParticle {
    constructor(x, y, angle, speed, color, size) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
        this.size = size;
        this.alpha = 1.0;
        this.gravity = 0.07;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.96;
        this.alpha -= 0.015;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
