/**
 * シールド・クラッシャー (耐久2)
 */
class ShieldEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SHIELD', name: 'シールド・クラッシャー', color: '#0099ff', shape: 'hexagon', speedRatio: 0.8, size: 15, hp: 2
        });
    }

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
