/**
 * 演出・エフェクトオブジェクトエンティティ (Particle, Shockwave)
 */

class Particle {
    constructor(x, y, color, isStar = false) {
        this.x = x;
        this.y = y;
        const speed = isStar ? (10 + Math.random() * 8) : 8;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.alpha = 1.0;
        this.color = color || '#00f0ff';
        this.isStar = isStar;
        this.size = isStar ? (4 + Math.random() * 4) : 3;
        this.rotation = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.94;
        this.vy *= 0.94;
        this.alpha -= this.isStar ? 0.025 : 0.035;
        this.rotation += 0.12;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.isStar ? 14 : 8;

        if (this.isStar) {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size, -Math.sin((18 + i * 72) * Math.PI / 180) * this.size);
                ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (this.size / 2), -Math.sin((54 + i * 72) * Math.PI / 180) * (this.size / 2));
            }
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
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
