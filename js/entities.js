/**
 * 演出・エフェクトオブジェクトエンティティ (Particle, Shockwave)
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

// 3. コンボマイルストーン テキストエフェクト (ノーツの視線・視認性を遮らない上部ポップアップ)
class ComboPopup {
    constructor(x, y, comboText, color = '#ffcc00') {
        this.x = x;
        this.y = y;
        this.text = comboText;
        this.color = color;
        this.alpha = 1.0;
        this.scale = 1.6;
        this.vy = -1.2;
    }

    update() {
        this.y += this.vy;
        this.alpha -= 0.025;
        if (this.scale > 1.0) {
            this.scale -= 0.04;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.font = `900 ${Math.round(22 * this.scale)}px 'Outfit', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}
