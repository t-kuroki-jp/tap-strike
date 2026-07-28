/**
 * 打ち上げ花火玉 (玉の色と夜空の大輪花火が完全連動！レア・七色レインボー花火搭載！全7カラーアソート)
 */
class FireworkEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        // レインボーを含む全7色の花火カラーバリエーション
        const palette = [
            { isRainbow: true, name: '★七色レインボー★', main: 'rainbow', sub: 'rainbow', glow: '#ffffff' },
            { isRainbow: false, name: 'ルビーレッド', main: '#ff0055', sub: '#ff6699', glow: '#ff0055' },
            { isRainbow: false, name: 'ゴールドイエロー', main: '#ffe600', sub: '#ffffaa', glow: '#ffe600' },
            { isRainbow: false, name: 'シアンブルー', main: '#00f0ff', sub: '#99ffff', glow: '#00f0ff' },
            { isRainbow: false, name: 'エレクトリックパープル', main: '#aa00ff', sub: '#e099ff', glow: '#aa00ff' },
            { isRainbow: false, name: 'エメラルドグリーン', main: '#33ff66', sub: '#99ffbb', glow: '#33ff66' },
            { isRainbow: false, name: 'サクラピンク', main: '#ff33cc', sub: '#ff99e6', glow: '#ff33cc' }
        ];

        // 20%の確率でレインボー花火玉登場！
        const chosenColor = Math.random() < 0.22 ? palette[0] : palette[1 + Math.floor(Math.random() * 6)];

        super(canvas, gameSpeed, stage, {
            id: 'FIREWORK', name: `打ち上げ花火玉 (${chosenColor.name})`, color: chosenColor.isRainbow ? '#ffe600' : chosenColor.main, shape: 'firework', speedRatio: 0.75, size: 16, hp: 1
        });

        this.fireworkTheme = chosenColor;

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
        const theme = this.fireworkTheme;
        const currentColor = theme.isRainbow ? `hsl(${(Date.now() / 3) % 360}, 100%, 60%)` : theme.main;

        // 1. 本物クラフト和紙貼り花火玉 (写真再現)
        ctx.shadowColor = currentColor;
        ctx.shadowBlur = 12;

        // 球体ベース (クラフトブラウン和紙)
        ctx.fillStyle = '#d9a066';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // クラフト紙の貼り合わせ帯ライン (縦横の和紙貼りスジ)
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#a67238';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.95, -Math.PI / 4, Math.PI / 4);
        ctx.arc(this.x, this.y, this.size * 0.95, (3 * Math.PI) / 4, (5 * Math.PI) / 4);
        ctx.stroke();

        // 2. 帯紙 ＆ ネオン発光ラベル (何色の花火玉か判別できる和風帯)
        ctx.fillStyle = currentColor;
        ctx.shadowColor = currentColor;
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x - this.size, this.y - 3, this.size * 2, 6);

        // 3. 上部の導火線 (点火コード)
        const fuseAngle = -Math.PI / 2; // 上向き
        const fuseStartX = this.x;
        const fuseStartY = this.y - this.size;
        const fuseEndX = fuseStartX + Math.sin(Date.now() * 0.01) * 2;
        const fuseEndY = fuseStartY - 10;

        ctx.strokeStyle = '#8c5828';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(fuseStartX, fuseStartY);
        ctx.lineTo(fuseEndX, fuseEndY);
        ctx.stroke();

        // 4. 「チッチッチッ」導火線パチパチ火花アニメーション (リアルスパーク！)
        ctx.shadowColor = '#ffea00';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(fuseEndX, fuseEndY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // パチパチ飛び散る橘火花 4〜6本
        const sparkCount = 5;
        ctx.strokeStyle = Math.random() < 0.5 ? '#ff9900' : '#ffe600';
        ctx.lineWidth = 1.4;
        for (let i = 0; i < sparkCount; i++) {
            const sparkAngle = Math.random() * Math.PI * 2;
            const sparkLen = 4 + Math.random() * 8;
            const sx = fuseEndX + Math.cos(sparkAngle) * sparkLen;
            const sy = fuseEndY + Math.sin(sparkAngle) * sparkLen;

            ctx.beginPath();
            ctx.moveTo(fuseEndX, fuseEndY);
            ctx.lineTo(sx, sy);
            ctx.stroke();
        }

        ctx.restore();
    }

    playLaunchWhistleSound() {
        if (!audioEngine || !audioEngine.audioCtx) return;
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
        if (!audioEngine || !audioEngine.audioCtx) return;
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
        game.score += game.params.baseScore * game.combo * (this.fireworkTheme.isRainbow ? 2 : 1);
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

            const currentColor = theme.isRainbow ? `hsl(${(Date.now() / 2) % 360}, 100%, 65%)` : theme.main;
            game.particles.push(new FireworkSpurtParticle(currentX, currentY, currentColor));

            if (currentY <= targetY) {
                clearInterval(launchInterval);
                this.playExplosionSound();
                this.explodeFireworks(game, targetX, targetY, theme);
            }
        }, 16);

        return true;
    }

    explodeFireworks(game, x, y, theme) {
        const outerCount = 60;
        for (let i = 0; i < outerCount; i++) {
            const angle = (i / outerCount) * Math.PI * 2;
            const speed = 7.5 + Math.random() * 3.5;
            const color = theme.isRainbow ? `hsl(${Math.floor((i / outerCount) * 360)}, 100%, 60%)` : (i % 2 === 0 ? theme.main : theme.sub);
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 4.5));
        }

        const midCount = 40;
        for (let i = 0; i < midCount; i++) {
            const angle = (i / midCount) * Math.PI * 2;
            const speed = 4.2 + Math.random() * 2.0;
            const color = theme.isRainbow ? `hsl(${Math.floor(((i / midCount) * 360 + 180) % 360)}, 100%, 65%)` : theme.main;
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 3.5));
        }

        const innerCount = 40;
        for (let i = 0; i < innerCount; i++) {
            const angle = (i / innerCount) * Math.PI * 2;
            const speed = 1.8 + Math.random() * 1.5;
            const color = '#ffffff';
            game.particles.push(new FireworkBloomParticle(x, y, angle, speed, color, 3.0));
        }

        const ringColor = theme.isRainbow ? '#ffe600' : theme.main;
        game.shockwaves.push(new Shockwave(x, y, ringColor));
        game.shockwaves.push(new Shockwave(x, y, '#ffffff'));
        game.shockwaves.push(new Shockwave(x, y, '#00f0ff'));
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

/** 画面上空で開花して夜空一面に長く下垂する同色・レインボーしだれ柳花火粒子 */
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
