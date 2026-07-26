/**
 * 打ち上げ花火玉 (超限界ワイド左右振り・140粒子超豪華三輪スターマイン・ド迫力地響き音)
 */
class FireworkEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'FIREWORK', name: '打ち上げ花火玉', color: '#ff3366', shape: 'firework', speedRatio: 0.7, size: 15, hp: 1
        });

        // ★画面最下部の「左極端 〜 右極端」(5% 〜 95% の限界超ワイド範囲) からランダム出現！
        const margin = canvas.width * 0.05;
        this.x = margin + Math.random() * (canvas.width - margin * 2);
        this.y = canvas.height + 40;
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        // 下の両極端から判定リング（中央）に向かってゆったり上昇
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. 火花テール
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 4.0;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + (Math.random() - 0.5) * 3, this.y + 28);
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

        // ドドドカーーーーン！！！と夜空が震える超重低音爆発
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

        // ★夜空の左右極端までダイナミックに限界ワイドスイング！
        const launchX = this.x;
        const startY = this.y;

        const sideSign = Math.random() < 0.5 ? -1 : 1;
        const spreadOffset = sideSign * (this.canvas.width * (0.2 + Math.random() * 0.35));
        const targetX = Math.min(this.canvas.width - 30, Math.max(30, (this.canvas.width / 2) + spreadOffset));
        const targetY = Math.max(50, this.canvas.height * 0.15 + Math.random() * 80);

        let currentX = launchX;
        let currentY = startY;

        const launchInterval = setInterval(() => {
            currentY -= 19;
            currentX += (targetX - currentX) * 0.18;

            // 軌跡粒子
            game.particles.push(new FireworkSpurtParticle(currentX, currentY));

            if (currentY <= targetY) {
                clearInterval(launchInterval);
                // 画面上空の極限ワイド位置で超・超豪華140粒子大輪開花！
                this.playExplosionSound();
                this.explodeFireworks(game, targetX, targetY);
            }
        }, 16);

        return true;
    }

    explodeFireworks(game, x, y) {
        const palette = ['#ff0055', '#ffe600', '#00f0ff', '#ff33cc', '#ffffff', '#33ff66', '#ffaa00', '#aa00ff', '#ff6600'];

        // ★140粒子の超ゴージャス三輪スターマイン！
        // 1. 特大外輪 (60粒子)
        const outerCount = 60;
        for (let i = 0; i < outerCount; i++) {
            const angle = (i / outerCount) * Math.PI * 2;
            const speed = 7.0 + Math.random() * 3.5;
            const color = palette[i % palette.length];
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 4.5));
        }

        // 2. 黄金の中輪 (40粒子)
        const midCount = 40;
        for (let i = 0; i < midCount; i++) {
            const angle = (i / midCount) * Math.PI * 2;
            const speed = 4.0 + Math.random() * 2.0;
            const color = '#ffe600';
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 3.5));
        }

        // 3. 純白の内輪 (40粒子)
        const innerCount = 40;
        for (let i = 0; i < innerCount; i++) {
            const angle = (i / innerCount) * Math.PI * 2;
            const speed = 1.8 + Math.random() * 1.5;
            const color = '#ffffff';
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 3.0));
        }

        // 4. 超大爆発クアドラプル・ショックウェーブ
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
        this.gravity = 0.065; // ゆったり下垂
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.965;
        this.alpha -= 0.011; // より長くキラキラ輝く残像
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
