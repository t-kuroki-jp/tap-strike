/**
 * ゲーム内のオブジェクトエンティティ (基底Enemy, 各種エネミークラス, Particle, Shockwave)
 */

// --- エネミー基底クラス ---
class Enemy {
    constructor(canvas, gameSpeed, stage, masterData) {
        this.canvas = canvas;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(canvas.width, canvas.height) * 0.6;
        this.x = canvas.width / 2 + Math.cos(angle) * distance;
        this.y = canvas.height / 2 + Math.sin(angle) * distance;

        this.id = masterData?.id || 'CHASER';
        this.name = masterData?.name || 'エネミー';
        this.color = masterData?.color || '#ff0055';

        // レインボーテーマの場合、敵の色をランダムネオン発光に
        if (stage?.theme?.rainbow) {
            const randomHue = Math.floor(Math.random() * 360);
            this.color = `hsl(${randomHue}, 100%, 60%)`;
        }

        this.shape = masterData?.shape || 'circle';
        this.speed = (2.0 * (masterData?.speedRatio || 1.0)) * gameSpeed;
        this.size = masterData?.size || 12;
        this.hp = masterData?.hp || 1;
        this.maxHp = this.hp;
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    /** タップヒット時の自立処理 */
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

    /** 自機中心到達時の自立処理 */
    onReachCenter(game) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        game.createParticles(this.x, this.y, this.color);

        game.player.hp--;
        game.updateUI();
        audioEngine.playMissSound();

        if (game.player.hp <= 0) {
            game.gameOver();
        }
    }
}

// --- 個別エネミークラス（ポリモーフィズム） ---

// 1. 直進チェイサー
class ChaserEnemy extends Enemy {}

// 2. 高速スピーダー
class SpeederEnemy extends Enemy {}

// 3. 直前減速グリッチ
class GlitchEnemy extends Enemy {
    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        let currentSpeed = this.speed;
        if (dist < playerTargetRadius + 60 && dist > playerTargetRadius + 15) {
            currentSpeed *= 0.3;
        }

        this.x += (dx / dist) * currentSpeed;
        this.y += (dy / dist) * currentSpeed;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.rect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 4. ウネウネ軌道スピナー
class CurveEnemy extends Enemy {
    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        const perpX = -dy / dist;
        const perpY = dx / dist;
        const wave = Math.sin(dist * 0.08) * 2.5;

        this.x += (dx / dist) * this.speed + perpX * wave;
        this.y += (dy / dist) * this.speed + perpY * wave;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size * 1.3);
        ctx.lineTo(this.x + this.size, this.y + this.size);
        ctx.lineTo(this.x - this.size, this.y + this.size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// 5. シールド重装甲
class ShieldEnemy extends Enemy {
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i;
            const px = this.x + Math.cos(a) * this.size;
            const py = this.y + Math.sin(a) * this.size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        if (this.hp > 1) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }
}

// 6. 回復ポッド
class HealEnemy extends Enemy {
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size * 1.3);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size * 1.3);
        ctx.lineTo(this.x - this.size, this.y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#05070e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x - 4, this.y); ctx.lineTo(this.x + 4, this.y);
        ctx.moveTo(this.x, this.y - 4); ctx.lineTo(this.x, this.y + 4);
        ctx.stroke();
        ctx.restore();
    }

    onHit(game, touchX, touchY, isPerfect) {
        super.onHit(game, touchX, touchY, isPerfect);
        if (this.hp <= 0) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            game.player.hp = Math.min(game.player.maxHp, game.player.hp + 1);
            game.createParticles(centerX, centerY, '#00ff88');
        }
        return true;
    }

    onReachCenter(game) {
        // 回復ポッドはスルーしてもノーダメージ！
        game.createParticles(this.x, this.y, this.color);
    }
}

// 7. タップ禁止スルー敵
class DontTapEnemy extends Enemy {
    draw(ctx) {
        ctx.save();
        ctx.lineWidth = 4;
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(this.x - this.size, this.y - this.size);
        ctx.lineTo(this.x + this.size, this.y + this.size);
        ctx.moveTo(this.x + this.size, this.y - this.size);
        ctx.lineTo(this.x - this.size, this.y + this.size);
        ctx.stroke();
        ctx.restore();
    }

    onHit(game, touchX, touchY, isPerfect) {
        // タップしたらミス！
        audioEngine.playMissSound();
        game.combo = 0;
        game.ringPulse = 8;
        game.ringColor = '#ff0055';
        game.missPenaltyTimer = game.params.missPenaltyDuration;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ff0055'));
        game.createParticles(this.x, this.y, '#ff0055');
        this.hp = 0; // 消失
        return true;
    }

    onReachCenter(game) {
        // スルー成功！加点
        game.createParticles(this.x, this.y, this.color);
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        audioEngine.playHitSound();
        game.updateUI();
    }
}

// 8. ぴよぴよヒヨコ
class ChickenEnemy extends Enemy {
    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        const perpX = -dy / dist;
        const perpY = dx / dist;
        const hop = Math.sin(dist * 0.2) * 2.5;

        this.x += (dx / dist) * this.speed + perpX * hop;
        this.y += (dy / dist) * this.speed + perpY * hop;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#05070e';
        ctx.beginPath();
        ctx.arc(this.x - 4, this.y - 3, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 3, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(this.x - 3, this.y + 1);
        ctx.lineTo(this.x + 3, this.y + 1);
        ctx.lineTo(this.x, this.y + 6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    onHit(game, touchX, touchY, isPerfect) {
        audioEngine.playChickSound();
        game.createParticles(this.x, this.y, '#ffe600');
        game.ringPulse = 14;
        game.ringColor = '#ffe600';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ffe600'));
        return true;
    }
}

// 9. にゃんこフェスティバル
class CatEnemy extends Enemy {
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#ff99bb';
        ctx.shadowColor = '#ff99bb';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x - 12, this.y - 6); ctx.lineTo(this.x - 6, this.y - 15); ctx.lineTo(this.x - 2, this.y - 8);
        ctx.moveTo(this.x + 12, this.y - 6); ctx.lineTo(this.x + 6, this.y - 15); ctx.lineTo(this.x + 2, this.y - 8);
        ctx.fill();

        ctx.fillStyle = '#05070e';
        ctx.beginPath();
        ctx.arc(this.x - 4, this.y - 2, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    onHit(game, touchX, touchY, isPerfect) {
        audioEngine.playCatSound();
        game.createParticles(this.x, this.y, '#ff99bb');
        game.ringPulse = 16;
        game.ringColor = '#ff99bb';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ff99bb'));
        return true;
    }
}

// 10. 回転マグロ寿司
class SushiEnemy extends Enemy {
    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        const perpX = -dy / dist;
        const perpY = dx / dist;
        const orbit = Math.sin(dist * 0.05) * 4.0;

        this.x += (dx / dist) * this.speed + perpX * orbit;
        this.y += (dy / dist) * this.speed + perpY * orbit;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(this.x - 14, this.y - 4, 28, 12, 4);
        ctx.fill();

        ctx.fillStyle = '#ff3344';
        ctx.shadowColor = '#ff3344';
        ctx.beginPath();
        ctx.roundRect(this.x - 15, this.y - 10, 30, 10, 5);
        ctx.fill();
        ctx.restore();
    }

    onHit(game, touchX, touchY, isPerfect) {
        audioEngine.playSushiSound();
        game.createParticles(this.x, this.y, '#ff3344');
        game.ringPulse = 16;
        game.ringColor = '#ff3344';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ff3344'));
        return true;
    }
}

// 11. メガボム
class BombEnemy extends Enemy {
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#ff2200';
        ctx.shadowColor = '#ff2200';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffe600';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x + 6, this.y - this.size - 8);
        ctx.stroke();
        ctx.restore();
    }

    onHit(game, touchX, touchY, isPerfect) {
        audioEngine.playBombSound();
        for (let b = 0; b < 4; b++) {
            game.createParticles(this.x, this.y, '#ff2200');
            game.createParticles(this.x, this.y, '#ffe600');
            game.createParticles(this.x, this.y, '#ffffff');
        }
        game.ringPulse = 35;
        game.ringColor = '#ff3300';
        this.hp = 0;
        game.combo++;
        game.score += game.params.baseScore * game.combo * 2;
        game.gameSpeed += game.params.speedIncrement;
        game.shockwaves.push(new Shockwave(touchX, touchY, '#ff3300'));
        return true;
    }
}

// --- エネミーファクトリー（クラス生成管理） ---
class EnemyFactory {
    static create(canvas, gameSpeed, stage, enemiesMaster) {
        const pool = stage ? stage.enemyPool : [{ id: 'CHASER', weight: 1.0 }];
        const pickedId = this.pickWeightedId(pool);
        const masterData = enemiesMaster[pickedId] || {};
        masterData.id = pickedId;

        switch (pickedId) {
            case 'SPEEDER': return new SpeederEnemy(canvas, gameSpeed, stage, masterData);
            case 'GLITCH': return new GlitchEnemy(canvas, gameSpeed, stage, masterData);
            case 'CURVE': return new CurveEnemy(canvas, gameSpeed, stage, masterData);
            case 'SHIELD': return new ShieldEnemy(canvas, gameSpeed, stage, masterData);
            case 'BIG_BOSS': return new ShieldEnemy(canvas, gameSpeed, stage, masterData);
            case 'HEAL': return new HealEnemy(canvas, gameSpeed, stage, masterData);
            case 'DONT_TAP': return new DontTapEnemy(canvas, gameSpeed, stage, masterData);
            case 'CHICKEN': return new ChickenEnemy(canvas, gameSpeed, stage, masterData);
            case 'CAT': return new CatEnemy(canvas, gameSpeed, stage, masterData);
            case 'SUSHI': return new SushiEnemy(canvas, gameSpeed, stage, masterData);
            case 'BOMB': return new BombEnemy(canvas, gameSpeed, stage, masterData);
            default: return new ChaserEnemy(canvas, gameSpeed, stage, masterData);
        }
    }

    static pickWeightedId(pool) {
        if (!pool || pool.length === 0) return 'CHASER';
        let totalWeight = pool.reduce((sum, item) => sum + (item.weight || 1), 0);
        let rand = Math.random() * totalWeight;
        for (let item of pool) {
            if (rand < (item.weight || 1)) return item.id;
            rand -= (item.weight || 1);
        }
        return pool[0].id;
    }
}

// --- 演出系クラス ---
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.alpha = 1.0;
        this.color = color || '#00f0ff';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.03;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Shockwave {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.alpha = 0.8;
        this.color = color;
    }

    update() {
        this.radius += 5;
        this.alpha -= 0.05;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

class FloatingText {
    constructor(x, y, text, color, fontSize = 20) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color || '#ffcc00';
        this.fontSize = fontSize;
        this.alpha = 1.0;
        this.scale = 1.5;
    }

    update() {
        this.y -= 1.5;
        this.alpha -= 0.025;
        if (this.scale > 1.0) this.scale -= 0.05;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.font = `bold ${Math.round(this.fontSize * this.scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}
