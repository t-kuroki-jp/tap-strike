/**
 * にゃんこフェスティバル (トコトコ気まぐれ移動・リアル猫グラフィック・ニャ〜オSE)
 */
class CatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT', name: 'にゃんこフェスティバル', color: '#ffb3cc', shape: 'cat', speedRatio: 1.05, size: 15, hp: 1
        });
        this.tailAngle = Math.random() * Math.PI * 2;
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        // 猫特有のすばしっこいトコトコ気まぐれステップ
        const perpX = -dy / dist;
        const perpY = dx / dist;
        const step = Math.sin(dist * 0.35) * 2.2;

        this.x += (dx / dist) * this.speed + perpX * step;
        this.y += (dy / dist) * this.speed + perpY * step;
        this.tailAngle += 0.15;

        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. ふりふりシッポ (後ろ)
        ctx.strokeStyle = '#ff99bb';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#ff99bb';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        const tailX = this.x + Math.sin(this.tailAngle) * 12;
        const tailY = this.y + 14 + Math.cos(this.tailAngle) * 4;
        ctx.moveTo(this.x, this.y + 10);
        ctx.quadraticCurveTo(this.x + 8, this.y + 18, tailX, tailY);
        ctx.stroke();

        // 2. 猫の頭 (メインの円)
        ctx.fillStyle = '#ffb3cc';
        ctx.shadowColor = '#ff99bb';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 3. 三角お耳 (外側アウター)
        ctx.fillStyle = '#ff99bb';
        ctx.beginPath();
        // 左耳
        ctx.moveTo(this.x - 14, this.y - 4);
        ctx.lineTo(this.x - 10, this.y - 18);
        ctx.lineTo(this.x - 2, this.y - 10);
        // 右耳
        ctx.moveTo(this.x + 14, this.y - 4);
        ctx.lineTo(this.x + 10, this.y - 18);
        ctx.lineTo(this.x + 2, this.y - 10);
        ctx.fill();

        // 内側インナー耳 (ピンク)
        ctx.fillStyle = '#ff6699';
        ctx.beginPath();
        ctx.moveTo(this.x - 12, me => {}); ctx.lineTo(this.x - 11, this.y - 5); ctx.lineTo(this.x - 9, me => {});
        ctx.moveTo(this.x - 12, this.y - 6); ctx.lineTo(this.x - 9, this.y - 15); ctx.lineTo(this.x - 4, me => {});
        ctx.moveTo(this.x - 11, this.y - 6); ctx.lineTo(this.x - 9, this.y - 14); ctx.lineTo(this.x - 4, this.y - 9);
        ctx.moveTo(this.x + 11, this.y - 6); ctx.lineTo(this.x + 9, this.y - 14); ctx.lineTo(this.x + 4, this.y - 9);
        ctx.fill();

        // 4. つぶらな黒目 + ハイライト白目
        ctx.fillStyle = '#05070e';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 2.5, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 3, 0.9, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 3, 0.9, 0, Math.PI * 2);
        ctx.fill();

        // 5. 小さなピンクのお鼻 & ωの口元
        ctx.fillStyle = '#ff3366';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#662233';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x - 1.8, this.y + 3.5, 1.8, 0, Math.PI * 0.85);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x + 1.8, this.y + 3.5, 1.8, Math.PI * 0.15, Math.PI);
        ctx.stroke();

        // 6. ピンと生えた猫のヒゲ (左右3本ずつ)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        // 左ヒゲ
        ctx.moveTo(this.x - 8, this.y + 1); ctx.lineTo(this.x - 18, this.y - 1);
        ctx.moveTo(this.x - 8, this.y + 3); ctx.lineTo(this.x - 19, this.y + 3);
        ctx.moveTo(this.x - 8, this.y + 5); ctx.lineTo(this.x - 17, this.y + 7);
        // 右ヒゲ
        ctx.moveTo(this.x + 8, this.y + 1); ctx.lineTo(this.x + 18, this.y - 1);
        ctx.moveTo(this.x + 8, this.y + 3); ctx.lineTo(this.x + 19, this.y + 3);
        ctx.moveTo(this.x + 8, this.y + 5); ctx.lineTo(this.x + 17, this.y + 7);
        ctx.stroke();

        ctx.restore();
    }

    playCatSound() {
        // ニャ〜オ！の愛らしい高音スライド
        audioEngine.playTone({ type: 'triangle', startFreq: 850, endFreq: 1450, duration: 0.12, volume: 0.4 });
        setTimeout(() => {
            audioEngine.playTone({ type: 'sine', startFreq: 1450, endFreq: 1100, duration: 0.1, volume: 0.35 });
        }, 100);
    }

    onHit(game, touchX, touchY, isPerfect) {
        this.playCatSound();
        game.createParticles(this.x, this.y, '#ff99bb');
        game.createParticles(this.x, this.y, '#ffffff');
        game.ringPulse = 18;
        game.ringColor = '#ff99bb';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ff99bb'));
        return true;
    }
}
