/**
 * 打ち上げ花火玉 (玉の色と夜空の大輪花火が完全連動！全6色のアソート・画面下半分全域出現)
 */
class FireworkEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        // 全6色の花火カラーバリエーション
        const palette = [
            { name: 'ルビーレッド', main: '#ff0055', sub: '#ff6699', glow: '#ff0055' },
            { name: 'ゴールドイエロー', main: '#ffe600', sub: '#ffffaa', glow: '#ffe600' },
            { name: 'シアンブルー', main: '#00f0ff', sub: '#99ffff', glow: '#00f0ff' },
            { name: 'エレクトリックパープル', main: '#aa00ff', sub: '#e099ff', glow: '#aa00ff' },
            { name: 'エメラルドグリーン', main: '#33ff66', sub: '#99ffbb', glow: '#33ff66' },
            { name: 'サクラピンク', main: '#ff33cc', sub: '#ff99e6', glow: '#ff33cc' }
        ];

        const chosenColor = palette[Math.floor(Math.random() * palette.length)];

        super(canvas, gameSpeed, stage, {
            id: 'FIREWORK', name: `打ち上げ花火玉 (${chosenColor.name})`, color: chosenColor.main, shape: 'firework', speedRatio: 0.75, size: 15, hp: 1
        });

        this.fireworkTheme = chosenColor; // 個別カラーテーマ保持

        // 画面の下半分 (y >= height * 0.5) 全域から出現
        const mode = Math.random();
        if (mode < 0.4) {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 40;
        } else if (mode < 0.7) {
            this.x = -40;
            this.y = canvas.height * 0.5 + Math.random() * (canvas.height * 0.5);
        } else {
            this.x = canvas.width + 40;
            this.y = canvas.height * 0.5 + Math.random() * (canvas.height * 0.5);
        }

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        this.dirX = (dx / dist) * this.speed;
        this.dirY = (dy / dist) * this.speed;
    }

    update(playerTargetRadius) {
        this.x += this.dirX;
        this.y += this.dirY;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        return Math.hypot(centerX - this.x, centerY - this.y);
    }

    draw(ctx) {
        ctx.save();

        // 1. テール火花 (玉の色と連動)
        const angle = Math.atan2(this.dirY, this.dirX);
        const tailX = this.x - Math.cos(angle) * 26;
        const tailY = this.y - Math.sin(angle) * 26;

        ctx.strokeStyle = this.fireworkTheme.main;
        ctx.lineWidth = 4.0;
        ctx.shadowColor = this.fireworkTheme.glow;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX + (Math.random() - 0.5) * 3, tailY + (Math.random() - 0.5) * 3);
        ctx.stroke();

        // 2. 花火玉本体 (玉の色)
        ctx.fillStyle = this.fireworkTheme.main;
        ctx.shadowColor = this.fireworkTheme.glow;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.0;
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

        const launchX = this.x;
        const startY = this.y;

        const sideSign = Math.random() < 0.5 ? -1 : 1;
        const spreadOffset = sideSign * (this.canvas.width * (0.15 + Math.random() * 0.3));
        const targetX = Math.min(this.canvas.width - 30, Math.max(30, (this.canvas.width / 2) + spreadOffset));
        const targetY = Math.max(40, this.canvas.height * 0.14 + Math.random() * 80);

        let currentX = launchX;
        let currentY = startY;

        const theme = this.fireworkTheme;

        const launchInterval = setInterval(() => {
            currentY -= 19;
            currentX += (targetX - currentX) * 0.18;

            // ★昇っていく光の軌跡も玉と同じ色！
            game.particles.push(new FireworkSpurtParticle(currentX, currentY, theme.main));

            if (currentY <= targetY) {
                clearInterval(launchInterval);
                this.playExplosionSound();
                // ★上空で玉の色と同色の極美大輪花火が開花！
                this.explodeFireworks(game, targetX, targetY, theme);
            }
        }, 16);

        return true;
    }

    explodeFireworks(game, x, y, theme) {
        // ★玉の色と同色・サブ色・アクセント白を組みあわせた極美カラー同調開花！
        const outerCount = 60;
        for (let i = 0; i < outerCount; i++) {
            const angle = (i / outerCount) * Math.PI * 2;
            const speed = 7.0 + Math.random() * 3.5;
            const color = i % 2 === 0 ? theme.main : theme.sub;
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 4.5));
        }

        const midCount = 40;
        for (let i = 0; i < midCount; i++) {
            const angle = (i / midCount) * Math.PI * 2;
            const speed = 4.0 + Math.random() * 2.0;
            const color = theme.main;
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 3.5));
        }

        const innerCount = 40;
        for (let i = 0; i < innerCount; i++) {
            const angle = (i / innerCount) * Math.PI * 2;
            const speed = 1.8 + Math.random() * 1.5;
            const color = '#ffffff'; // 中心の星
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 3.0));
        }

        game.shockwaves.push(new Shockwave(x, y, theme.main));
        game.shockwaves.push(new Shockwave(x, y, theme.sub));
        game.shockwaves.push(new Shockwave(x, y, '#ffffff'));
    }
}

/** 上昇スパート用の軌跡粒子 */
class FireworkSpurtParticle {
    constructor(x, y, color) {
        this.x = x + (Math.random() - 0.5) * 3;
        this.y = y;
        this.color = color || '#ffe600';
        this.alpha = 1.0;
    }
    update() {
        this.alpha -= 0.11;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

/** 画面上空で開花して夜空一面に長く下垂する同色しだれ柳花火粒子 */
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
