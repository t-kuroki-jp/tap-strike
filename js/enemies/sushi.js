/**
 * 回転マグロ寿司 (和風皿に盛られたお寿司がクルクル自転しながら押し寄せる！)
 */
class SushiEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SUSHI', name: '回転マグロ寿司', color: '#ff3344', shape: 'sushi', speedRatio: 1.1, size: 18, hp: 1
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

        // 1. 和風の回転寿司お皿 (白陶器 ＋ 金＆赤の和風ライン)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 8;
        
        // 皿ベース (白陶器)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();

        // 皿の和風縁ライン (赤)
        ctx.strokeStyle = '#e60033';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.stroke();

        // 皿の内側装飾ライン (金)
        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, 0, 13.5, 0, Math.PI * 2);
        ctx.stroke();

        // 2. お寿司: シャリ (ふっくら酢飯)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = '#fff9f0';
        ctx.beginPath();
        ctx.roundRect(-10, -5, 20, 10, 3);
        ctx.fill();

        // 3. お寿司: マグロのネタ (つややかな赤 ＋ 刺身のスジ)
        ctx.fillStyle = '#e60033';
        ctx.shadowColor = '#e60033';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(-11, -8, 22, 9, 4);
        ctx.fill();

        // マグロの美しい筋模様 (白スジ)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-6, -7); ctx.lineTo(-3, -1);
        ctx.moveTo(0, -7); ctx.lineTo(3, -1);
        ctx.moveTo(6, -7); ctx.lineTo(9, -1);
        ctx.stroke();

        // 4. 黒い海苔の帯 (アクセント)
        ctx.fillStyle = '#1a1a24';
        ctx.shadowBlur = 0;
        ctx.fillRect(-2.5, -8.5, 5, 13.5);

        ctx.restore();
    }

    playSushiSound() {
        audioEngine.playTone({ type: 'square', startFreq: 440, endFreq: 880, duration: 0.12, volume: 0.3 });
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playSushiSound();
        game.createParticles(this.x, this.y, '#e60033');
        game.createParticles(this.x, this.y, '#ffffff');
        game.ringPulse = 16;
        game.ringColor = '#e60033';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#e60033'));
        return true;
    }
}
