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

        this.hp = masterData.hp || 1;
        this.maxHp = this.hp;
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
        let dx = centerX - this.x;
        let dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        let currentSpeed = this.speed;
        if (this.behavior === 'feint' && dist < playerTargetRadius + 60 && dist > playerTargetRadius + 15) {
            currentSpeed *= 0.3;
        }

        if (this.behavior === 'curve') {
            const perpX = -dy / dist;
            const perpY = dx / dist;
            const wave = Math.sin(dist * 0.08) * 2.5;
            this.x += (dx / dist) * currentSpeed + perpX * wave;
            this.y += (dy / dist) * currentSpeed + perpY * wave;
        } else {
            this.x += (dx / dist) * currentSpeed;
            this.y += (dy / dist) * currentSpeed;
        }

        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();

        if (this.shape === 'square') {
            ctx.rect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
            ctx.fill();
        } else if (this.shape === 'diamond') {
            ctx.moveTo(this.x, this.y - this.size * 1.3);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.lineTo(this.x, this.y + this.size * 1.3);
            ctx.lineTo(this.x - this.size, this.y);
            ctx.closePath();
            ctx.fill();

            // 内側の十字デザイン
            ctx.strokeStyle = '#05070e';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x - 4, this.y); ctx.lineTo(this.x + 4, this.y);
            ctx.moveTo(this.x, this.y - 4); ctx.lineTo(this.x, this.y + 4);
            ctx.stroke();
        } else if (this.shape === 'hexagon') {
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
        } else if (this.shape === 'triangle') {
            ctx.moveTo(this.x, this.y - this.size * 1.3);
            ctx.lineTo(this.x + this.size, this.y + this.size);
            ctx.lineTo(this.x - this.size, this.y + this.size);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

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
