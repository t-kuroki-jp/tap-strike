/**
 * 回転すし (マグロ・エビ・たまご・アジ・タコ・イカ・小ぶり4切れ盛りかっぱ巻きが和風皿に乗ってクルクル回転！)
 */
class SushiEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        // 全7種類の寿司ネタ定義
        const sushiTypes = ['tuna', 'shrimp', 'egg', 'mackerel', 'octopus', 'squid', 'kappa_roll'];
        const type = sushiTypes[Math.floor(Math.random() * sushiTypes.length)];

        let color = '#ff2a3b';
        if (type === 'shrimp') color = '#ff7733';
        if (type === 'egg') color = '#ffcc00';
        if (type === 'mackerel') color = '#0088cc';
        if (type === 'octopus') color = '#cc2255';
        if (type === 'squid') color = '#ffffff';
        if (type === 'kappa_roll') color = '#22aa44';

        super(canvas, gameSpeed, stage, {
            id: 'SUSHI', name: '回転すし', color: color, shape: 'sushi', speedRatio: 1.1, size: 18, hp: 1
        });

        this.sushiType = type;
        this.rotationAngle = Math.random() * Math.PI * 2;
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        // 直線でストレートに中心へ！
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        // クルクル自転回転アニメーション！
        this.rotationAngle += 0.07;

        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);

        // 1. 和風回転寿司お皿 (白陶器 ＋ ネタ色の綺麗な和風縁ライン)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 8;
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 19, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, 16.8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, 0, 14.2, 0, Math.PI * 2);
        ctx.stroke();

        // 2. 寿司ネタ別の専用グラフィック描画
        if (this.sushiType === 'kappa_roll') {
            // ★ かっぱ巻き (皿の上に小ぶりな 4切れが可愛く並ぶ！)
            const rolls = [
                { x: -5.5, y: -5.5 },
                { x: 5.5, y: -5.5 },
                { x: -5.5, y: 5.5 },
                { x: 5.5, y: 5.5 }
            ];

            rolls.forEach(r => {
                ctx.save();
                ctx.translate(r.x, r.y);

                // 外側の黒緑海苔
                ctx.fillStyle = '#0d2113';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 3;
                ctx.beginPath();
                ctx.arc(0, 0, 5.8, 0, Math.PI * 2);
                ctx.fill();

                // 内側の白酢飯シャリ
                ctx.fillStyle = '#fffdf7';
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.arc(0, 0, 4.3, 0, Math.PI * 2);
                ctx.fill();

                // 中央のシャキシャキきゅうり
                ctx.fillStyle = '#22cc55';
                ctx.beginPath();
                ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
                ctx.fill();

                // きゅうりツヤ
                ctx.fillStyle = '#aaff66';
                ctx.beginPath();
                ctx.arc(-0.6, -0.6, 0.7, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });
        } else {
            // ★ 握り寿司共通シャリ (ふっくら酢飯)
            ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
            ctx.shadowBlur = 3;
            ctx.fillStyle = '#fffdf7';
            ctx.beginPath();
            ctx.roundRect(-10, -5, 20, 11, 4);
            ctx.fill();

            if (this.sushiType === 'tuna') {
                // ★ マグロ (赤身 ＋ 白スジ ＋ 光沢)
                ctx.fillStyle = '#ff2a3b';
                ctx.shadowColor = '#ff2a3b';
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.roundRect(-13, -9, 26, 12, 5);
                ctx.fill();

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.moveTo(-7, -7); ctx.lineTo(-4, -1);
                ctx.moveTo(-1, -7); ctx.lineTo(2, -1);
                ctx.moveTo(5, -7); ctx.lineTo(8, -1);
                ctx.stroke();
            } else if (this.sushiType === 'shrimp') {
                // ★ エビ (蒸しエビ ＋ 尻尾)
                ctx.fillStyle = '#e63900';
                ctx.beginPath();
                ctx.moveTo(-13, -2); ctx.lineTo(-17, -7); ctx.lineTo(-15, 2);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#ff7733';
                ctx.shadowColor = '#ff7733';
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.roundRect(-12, -9, 24, 12, 5);
                ctx.fill();

                ctx.fillStyle = '#e63900';
                ctx.beginPath();
                ctx.roundRect(-12, -9, 6, 12, 3);
                ctx.roundRect(-2, -9, 6, 12, 3);
                ctx.roundRect(8, -9, 4, 12, 3);
                ctx.fill();
            } else if (this.sushiType === 'egg') {
                // ★ たまご (黄金色玉子焼き ＋ 海苔帯)
                ctx.fillStyle = '#ffcc00';
                ctx.shadowColor = '#ffcc00';
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.roundRect(-13, -10, 26, 13, 4);
                ctx.fill();

                ctx.strokeStyle = '#e6b800';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(-11, -4); ctx.lineTo(11, -4);
                ctx.stroke();

                ctx.fillStyle = '#111822';
                ctx.shadowBlur = 0;
                ctx.fillRect(-3, -10.5, 6, 14);
            } else if (this.sushiType === 'mackerel') {
                // ★ アジ (青皮 ＋ 切れ込み ＋ 生姜ネギ)
                ctx.fillStyle = '#2b6b99';
                ctx.shadowColor = '#2b6b99';
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.roundRect(-13, -9, 26, 12, 5);
                ctx.fill();

                ctx.fillStyle = '#e6f2ff';
                ctx.beginPath();
                ctx.ellipse(0, -3, 9, 3, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#22cc55';
                ctx.beginPath();
                ctx.arc(-2, -6, 1.8, 0, Math.PI * 2);
                ctx.arc(3, -5, 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffdd44';
                ctx.beginPath();
                ctx.arc(0, -7, 1.2, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.sushiType === 'octopus') {
                // ★ タコ (赤皮 ＋ 白身 ＋ 吸盤)
                ctx.fillStyle = '#cc2255';
                ctx.shadowColor = '#cc2255';
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.roundRect(-13, -9, 26, 12, 5);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.ellipse(0, -3, 11, 3.5, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#ff88aa';
                ctx.beginPath();
                ctx.arc(-7, -5, 2.2, 0, Math.PI * 2);
                ctx.arc(-1, -6, 2.2, 0, Math.PI * 2);
                ctx.arc(5, -5, 2.2, 0, Math.PI * 2);
                ctx.fill();
            } else if (this.sushiType === 'squid') {
                // ★ イカ (鹿の子包丁切り込み)
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.roundRect(-13, -9, 26, 12, 5);
                ctx.fill();

                ctx.strokeStyle = '#d4e6f1';
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.moveTo(-8, -7); ctx.lineTo(-4, -1);
                ctx.moveTo(-2, -7); ctx.lineTo(2, -1);
                ctx.moveTo(4, -7); ctx.lineTo(8, -1);
                ctx.moveTo(-4, -7); ctx.lineTo(-8, -1);
                ctx.moveTo(2, -7); ctx.lineTo(-2, -1);
                ctx.moveTo(8, -7); ctx.lineTo(4, -1);
                ctx.stroke();

                ctx.fillStyle = 'rgba(34, 187, 85, 0.45)';
                ctx.beginPath();
                ctx.ellipse(0, -3, 8, 2.5, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // ネタ共通光沢ハイライト
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.ellipse(-4, -6, 3.5, 1.2, -Math.PI / 8, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    playSushiSound() {
        audioEngine.playTone({ type: 'square', startFreq: 440, endFreq: 880, duration: 0.12, volume: 0.3 });
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playSushiSound();
        game.createParticles(this.x, this.y, this.color);
        game.createParticles(this.x, this.y, '#ffffff');
        game.ringPulse = 16;
        game.ringColor = this.color;
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, this.color));
        return true;
    }
}
