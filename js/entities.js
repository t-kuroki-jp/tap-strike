/**
 * ゲーム内のオブジェクトエンティティ (Enemy, Particle, Shockwave)
 */

class Enemy {
    constructor(canvas, gameSpeed, variation, enemiesMaster) {
        this.canvas = canvas;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(canvas.width, canvas.height) * 0.6;
        this.x = canvas.width / 2 + Math.cos(angle) * distance;
        this.y = canvas.height / 2 + Math.sin(angle) * distance;

        const pool = variation ? variation.enemyPool : [{ id: 'CHASER', weight: 1.0 }];
        const pickedItem = this.pickWeightedEnemy(pool);
        const masterData = enemiesMaster[pickedItem.id] || {
            name: 'クリムゾン・チェイサー', color: '#ff0055', shape: 'circle', speedRatio: 1.0, size: 12, behavior: 'straight'
        };

        this.id = pickedItem.id;
        this.name = masterData.name;
        this.color = masterData.color || '#ff0055';
        this.shape = masterData.shape || 'circle';
        this.behavior = masterData.behavior || 'straight';
        this.speed = (2.0 * (masterData.speedRatio || 1.0)) * gameSpeed;
        this.size = masterData.size || 12;
    }

    pickWeightedEnemy(pool) {
        if (!pool || pool.length === 0) return { id: 'CHASER', weight: 1.0 };
        let totalWeight = pool.reduce((sum, item) => sum + (item.weight || 1), 0);
        let rand = Math.random() * totalWeight;
        for (let item of pool) {
            if (rand < (item.weight || 1)) return item;
            rand -= (item.weight || 1);
        }
        return pool[0];
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        let currentSpeed = this.speed;
        if (this.behavior === 'feint' && dist < playerTargetRadius + 60 && dist > playerTargetRadius + 15) {
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
        if (this.shape === 'square') {
            ctx.rect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        } else {
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.alpha = 1.0;
        this.color = color || (Math.random() > 0.5 ? '#00f0ff' : '#ff007f');
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
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
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
