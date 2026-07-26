/**
 * エネミー基底クラス
 */
class Enemy {
    constructor(canvas, gameSpeed, stage, config = {}) {
        this.canvas = canvas;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(canvas.width, canvas.height) * 0.6;
        this.x = canvas.width / 2 + Math.cos(angle) * distance;
        this.y = canvas.height / 2 + Math.sin(angle) * distance;

        this.id = config.id || 'CHASER';
        this.name = config.name || 'クリムゾン・チェイサー';
        this.color = config.color || '#ff0055';

        if (stage?.theme?.rainbow) {
            const randomHue = Math.floor(Math.random() * 360);
            this.color = `hsl(${randomHue}, 100%, 60%)`;
        }

        this.shape = config.shape || 'circle';
        this.speed = (2.0 * (config.speedRatio || 1.0)) * gameSpeed;
        this.size = config.size || 12;
        this.hp = config.hp || 1;
        this.maxHp = this.hp;

        // 行動コンポーネント (Behavior) の設定
        if (config.behavior) {
            this.behavior = typeof config.behavior === 'string' 
                ? BehaviorFactory.create(config.behavior, config.behaviorConfig || {}) 
                : config.behavior;
        } else {
            this.behavior = BehaviorFactory.create('straight');
        }
    }

    update(playerTargetRadius) {
        if (this.behavior) {
            return this.behavior.update(this, playerTargetRadius);
        }

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        return dist;
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) {
            ctx.globalAlpha = this.alpha;
        }
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    onHit(game, touchX, touchY, isPerfect) {
        if (isPerfect) {
            audioEngine.playPerfectSound();
            game.createParticles(this.x, this.y, '#ffcc00');
            game.createParticles(this.x, this.y, '#ffffff');
            game.ringPulse = 22;
            game.ringColor = '#ffcc00';
        } else {
            audioEngine.playHitSound();
            game.createParticles(this.x, this.y, this.color);
            game.ringPulse = 14;
            game.ringColor = game.currentStage?.theme?.ringColor || '#00f0ff';
        }

        const scoreMultiplier = isPerfect ? 2 : 1;
        this.hp--;

        if (this.hp <= 0) {
            game.combo++;
            game.score += game.params.baseScore * game.combo * scoreMultiplier;
            game.gameSpeed += game.params.speedIncrement;
        } else {
            game.combo++;
            game.score += game.params.baseScore * scoreMultiplier;
        }

        game.shockwaves.push(new Shockwave(touchX, touchY, isPerfect ? '#ffcc00' : game.ringColor));
        return true;
    }

    onReachCenter(game) {
        game.createParticles(this.x, this.y, this.color);
        game.player.hp--;
        game.updateUI();
        audioEngine.playMissSound();

        if (game.player.hp <= 0) {
            game.gameOver();
        }
    }
}
