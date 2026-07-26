/**
 * 新・幾何学ノーツ群 (EASYモード全9動作対応)
 */

// 1. クロスノーツ (ブーメラン移動)
class CrossEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CROSS', name: 'ブーメラン・クロス', color: '#ff3399', shape: 'cross', speedRatio: 0.95, size: 13, hp: 1,
            behavior: 'boomerang'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        const s = this.size;
        const w = s * 0.4;
        ctx.rect(this.x - w, this.y - s, w * 2, s * 2);
        ctx.rect(this.x - s, this.y - w, s * 2, w * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 2. ゴーストノーツ (ステルス移動)
class GhostEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'GHOST', name: 'ステルス・ゴースト', color: '#aaff66', shape: 'ghost', speedRatio: 1.0, size: 13, hp: 1,
            behavior: 'stealth'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = 'rgba(170, 255, 102, 0.3)';
        ctx.lineWidth = 2.0;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

// 3. ヘキサゴンノーツ (フリーズ移動)
class HexagonEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'HEXAGON', name: 'フリーズ・ヘキサ', color: '#00ccff', shape: 'hexagon', speedRatio: 0.95, size: 14, hp: 1,
            behavior: 'freeze'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = this.x + Math.cos(angle) * this.size;
            const py = this.y + Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// 4. リングノーツ (オービット公転移動)
class RingEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'RING_NOTE', name: 'オービット・リング', color: '#ffea00', shape: 'ring', speedRatio: 0.9, size: 14, hp: 1,
            behavior: 'orbit'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

// 5. ペンタゴンノーツ (バウンド移動)
class PentagonEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'PENTAGON', name: 'バウンド・ペンタ', color: '#00ff66', shape: 'pentagon', speedRatio: 0.9, size: 14, hp: 1,
            behavior: 'bound'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
            const px = this.x + Math.cos(angle) * this.size;
            const py = this.y + Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}
