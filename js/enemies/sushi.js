/**
 * 回転マグロ寿司 (和風皿に盛られた王道のマグロ握りがクルクル自転しながら押し寄せる！)
 */
class SushiEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SUSHI', name: '回転マグロ寿司', color: '#ff2a3b', shape: 'sushi', speedRatio: 1.1, size: 18, hp: 1
        });
        this.rotationAngle = Math.random() * Math.PI * 2;
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        const perpX = -dy / dist;
        const perpY = dx / dist;
        const orbit = Math.sin(dist * 0.05) * 4.0;

        this.x += (dx / dist) * this.speed + perpX * orbit;
        this.y += (dy / dist) * this.speed + perpY * orbit;

        // お寿司自体のクルクル自転アニメーション！
        this.rotationAngle += 0.07;

        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);

        // 1. 和風の回転寿司お皿 (丸い白陶器 ＋ 赤＆金の和風縁ライン)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 8;
        
        // 皿ベース (丸い白陶器)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 19, 0, Math.PI * 2);
        ctx.fill();

        // 皿の和風縁ライン (朱赤)
        ctx.strokeStyle = '#ff2a3b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, 16.8, 0, Math.PI * 2);
        ctx.stroke();

        // 皿の内側和風リング (ゴールド)
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, 0, 14.2, 0, Math.PI * 2);
        ctx.stroke();

        // 2. 王道マグロ握り寿司: シャリ (白くてふっくら酢飯)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 3;
        ctx.fillStyle = '#fffdf7';
        ctx.beginPath();
        ctx.roundRect(-10, -5, 20, 11, 4);
        ctx.fill();

        // 3. 王道マグロ握り寿司: マグロのネタ (シャリをドカンと覆う大きくてツヤツヤの赤身)
        ctx.fillStyle = '#ff2a3b';
        ctx.shadowColor = '#ff2a3b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(-13, -9, 26, 12, 5);
        ctx.fill();

        // マグロ刺身のツヤ・刺身スジ (白い筋線)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-7, -7); ctx.lineTo(-4, -1);
        ctx.moveTo(-1, -7); ctx.lineTo(2, -1);
        ctx.moveTo(5, -7); ctx.lineTo(8, -1);
        ctx.stroke();

        // ネタのツヤ光沢ハイライト
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(-4, -6, 3.5, 1.2, -Math.PI / 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    playSushiSound() {
        audioEngine.playTone({ type: 'square', startFreq: 440, endFreq: 880, duration: 0.12, volume: 0.3 });
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playSushiSound();
        game.createParticles(this.x, this.y, '#ff2a3b');
        game.createParticles(this.x, this.y, '#ffffff');
        game.ringPulse = 16;
        game.ringColor = '#ff2a3b';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ff2a3b'));
        return true;
    }
}
