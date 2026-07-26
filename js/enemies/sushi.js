/**
 * 回転すし (サーモンが仲間入り！全8種類の豪華お寿司ラインナップ)
 */
class SushiEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        // 全8種類の寿司ネタ定義 (大人気サーモン追加！)
        const sushiTypes = ['tuna', 'salmon', 'shrimp', 'egg', 'mackerel', 'octopus', 'squid', 'kappa_roll'];
        const type = sushiTypes[Math.floor(Math.random() * sushiTypes.length)];

        let color = '#ff2a3b';
        if (type === 'salmon') color = '#ff6633';
        if (type === 'shrimp') color = '#ff7733';
        if (type === 'egg') color = '#ffcc00';
        if (type === 'mackerel') color = '#0088cc';
        if (type === 'octopus') color = '#cc2255';
        if (type === 'squid') color = '#ffffff';
        if (type === 'kappa_roll') color = '#22aa44';

        super(canvas, gameSpeed, stage, {
            id: 'SUSHI', name: '回転すし', color: color, shape: 'sushi', speedRatio: 1.1, size: 18, hp: 1,
            behavior: 'straight'
        });

        this.sushiType = type;
        this.rotationAngle = Math.random() * Math.PI * 2;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        this.rotationAngle += 0.07;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);

        // 1. 和風回転寿司お皿 (真上から見た丸い陶器皿 ＋ ネタ色の綺麗な和風縁ライン)
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

        // 2. 上空トップダウン視点の美しいネタ描画 (全8種類)
        if (this.sushiType === 'kappa_roll') {
            // ★ かっぱ巻き (真上から見た均等な 4切れ巻き寿司)
            const rolls = [
                { x: -5.5, y: -5.5 },
                { x: 5.5, y: -5.5 },
                { x: -5.5, y: 5.5 },
                { x: 5.5, y: 5.5 }
            ];

            rolls.forEach(r => {
                ctx.save();
                ctx.translate(r.x, r.y);

                ctx.fillStyle = '#0d2113';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
                ctx.shadowBlur = 3;
                ctx.beginPath();
                ctx.arc(0, 0, 5.8, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#fffdf7';
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.arc(0, 0, 4.3, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#22cc55';
                ctx.beginPath();
                ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#aaff66';
                ctx.beginPath();
                ctx.arc(-0.6, -0.6, 0.7, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });
        } else if (this.sushiType === 'tuna') {
            // ★ マグロ (赤身 ＋ 白スジ)
            ctx.fillStyle = '#ff2a3b';
            ctx.shadowColor = '#ff2a3b';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.roundRect(-13, -7.5, 26, 15, 6);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(-7, -5); ctx.lineTo(-4, 5);
            ctx.moveTo(-1, -5); ctx.lineTo(2, 5);
            ctx.moveTo(5, -5); ctx.lineTo(8, 5);
            ctx.stroke();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.ellipse(-4, -4, 4, 1.8, -Math.PI / 8, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.sushiType === 'salmon') {
            // ★ サーモン (トロサーモンオレンジ ＋ 綺麗な白脂スジ ＋ ツヤ光沢)
            ctx.fillStyle = '#ff6633';
            ctx.shadowColor = '#ff6633';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.roundRect(-13, -7.5, 26, 15, 6);
            ctx.fill();

            // サーモンの美しいトロ脂スジ (白・クリーム色の太め筋)
            ctx.strokeStyle = 'rgba(255, 255, 235, 0.85)';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(-8, -6); ctx.lineTo(-4, 6);
            ctx.moveTo(-3, -6); ctx.lineTo(1, 6);
            ctx.moveTo(2, -6); ctx.lineTo(6, 6);
            ctx.moveTo(7, -6); ctx.lineTo(10, 3);
            ctx.stroke();

            // トロサーモンのツヤ光沢
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.ellipse(-3, -4, 4.5, 1.8, -Math.PI / 8, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.sushiType === 'shrimp') {
            // ★ エビ (蒸しエビ ＋ 尾)
            ctx.fillStyle = '#e63900';
            ctx.beginPath();
            ctx.moveTo(-12, -2); ctx.lineTo(-17, -7); ctx.lineTo(-15, 3);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ff7733';
            ctx.shadowColor = '#ff7733';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.roundRect(-12, -7.5, 24, 15, 6);
            ctx.fill();

            ctx.fillStyle = '#e63900';
            ctx.beginPath();
            ctx.roundRect(-12, -7.5, 6, 15, 3);
            ctx.roundRect(-2, -7.5, 6, 15, 3);
            ctx.roundRect(8, -7.5, 4, 15, 3);
            ctx.fill();
        } else if (this.sushiType === 'egg') {
            // ★ たまご (厚焼き玉子 ＋ 海苔帯)
            ctx.fillStyle = '#ffcc00';
            ctx.shadowColor = '#ffcc00';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.roundRect(-13, -8, 26, 16, 5);
            ctx.fill();

            ctx.fillStyle = '#111822';
            ctx.shadowBlur = 0;
            ctx.fillRect(-3.5, -8.5, 7, 17);
        } else if (this.sushiType === 'mackerel') {
            // ★ アジ (青皮 ＋ 切れ込み ＋ 生姜ネギ)
            ctx.fillStyle = '#2b6b99';
            ctx.shadowColor = '#2b6b99';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.roundRect(-13, -7.5, 26, 15, 6);
            ctx.fill();

            ctx.fillStyle = '#e6f2ff';
            ctx.beginPath();
            ctx.ellipse(0, 0, 9, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#22cc55';
            ctx.beginPath();
            ctx.arc(-3, -2, 2.0, 0, Math.PI * 2);
            ctx.arc(3, 1, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffdd44';
            ctx.beginPath();
            ctx.arc(1, -3, 1.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.sushiType === 'octopus') {
            // ★ タコ (赤皮 ＋ 白身 ＋ 吸盤)
            ctx.fillStyle = '#cc2255';
            ctx.shadowColor = '#cc2255';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.roundRect(-13, -7.5, 26, 15, 6);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(0, 0, 11, 4.5, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ff88aa';
            ctx.beginPath();
            ctx.arc(-7, -2, 2.5, 0, Math.PI * 2);
            ctx.arc(0, -3, 2.5, 0, Math.PI * 2);
            ctx.arc(7, -2, 2.5, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.sushiType === 'squid') {
            // ★ イカ (白い身 ＋ 鹿の子包丁切り込み)
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.roundRect(-13, -7.5, 26, 15, 6);
            ctx.fill();

            ctx.strokeStyle = '#d4e6f1';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(-8, -5); ctx.lineTo(-4, 5);
            ctx.moveTo(-2, -5); ctx.lineTo(2, 5);
            ctx.moveTo(4, -5); ctx.lineTo(8, 5);
            ctx.moveTo(-4, -5); ctx.lineTo(-8, 5);
            ctx.moveTo(2, -5); ctx.lineTo(-2, 5);
            ctx.moveTo(8, -5); ctx.lineTo(4, 5);
            ctx.stroke();

            ctx.fillStyle = 'rgba(34, 187, 85, 0.4)';
            ctx.beginPath();
            ctx.ellipse(0, 0, 8, 3, 0, 0, Math.PI * 2);
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
