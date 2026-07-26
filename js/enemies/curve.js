/**
 * スパイラル・スピナー (ウネウネ軌道)
 */
class CurveEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CURVE', name: 'スパイラル・スピナー', color: '#ff6600', shape: 'triangle', speedRatio: 1.1, size: 12, hp: 1,
            behavior: 'spiral', behaviorConfig: { orbitFrequency: 0.08, orbitRadius: 2.5 }
        });
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
