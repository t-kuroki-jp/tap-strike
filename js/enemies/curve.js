/**
 * スパイラル・スピナー (ウネウネ軌道)
 */
class CurveEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CURVE', name: 'スパイラル・スピナー', color: '#ff6600', shape: 'triangle', speedRatio: 1.1, size: 12, hp: 1
        });
    }

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
