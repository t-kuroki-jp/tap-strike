/**
 * 演出・エフェクトオブジェクトエンティティ (Particle, Shockwave, FloatingText)
 */

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
