/**
 * 打ち上げ花火玉 (ゆったり上昇・タップで画面中央上空へ豪勢スターマイン大開花！)
 */
class FireworkEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'FIREWORK', name: '打ち上げ花火玉', color: '#ff3366', shape: 'firework', speedRatio: 0.7, size: 15, hp: 1
        });

        // 画面下部から出現
        const centerX = canvas.width / 2;
        this.x = centerX + (Math.random() - 0.5) * 30;
        this.y = canvas.height + 40;
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        // ゆったり風情のあるスピードで上昇
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. 真下に伸びる火花テール
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + (Math.random() - 0.5) * 2, this.y + 26);
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

        // ドーーーン！と腹に響く豪勢大輪開花サウンド
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

        // ★画面真上中央の夜空 (画面横幅の中央, 上部20%の位置) へ向かって打ち上げスパート！
        const launchX = this.x;
        const startY = this.y;
        const targetX = this.canvas.width / 2; // 画面横幅の真ん中！
        const targetY = Math.max(70, this.canvas.height * 0.22); // 画面上部中央の夜空

        let currentX = launchX;
        let currentY = startY;

        const launchInterval = setInterval(() => {
            currentY -= 18;
            currentX += (targetX - currentX) * 0.15; // 中央へ誘導

            // 上昇軌跡
            game.particles.push(new FireworkSpurtParticle(currentX, currentY));

            if (currentY <= targetY) {
                clearInterval(launchInterval);
                // 画面中央上空で超豪華大輪スターマイン開花！
                this.playExplosionSound();
                this.explodeFireworks(game, targetX, targetY);
            }
        }, 16);

        return true;
    }

    explodeFireworks(game, x, y) {
        const palette = ['#ff0055', '#ffe600', '#00f0ff', '#ff33cc', '#ffffff', '#33ff66', '#ffaa00', '#aa00ff'];

        // ★2重・3重の輪を持つ超ゴージャス72粒子大輪スターマイン！
        const outerCount = 48; // 外輪
        for (let i = 0; i < outerCount; i++) {
            const angle = (i / outerCount) * Math.PI * 2;
            const speed = 5.5 + Math.random() * 2.5;
            const color = palette[i % palette.length];
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 4.0));
        }

        const innerCount = 24; // 内輪
        for (let i = 0; i < innerCount; i++) {
            const angle = (i / innerCount) * Math.PI * 2;
            const speed = 2.5 + Math.random() * 1.5;
            const color = '#ffffff';
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 3.0));
        }

        // 大爆発トリプルショックウェーブ
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

/** 画面中央上空で開花して広大に広がるしだれ柳花火粒子 */
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
        this.alpha -= 0.015; // 長めに残像が残る
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
