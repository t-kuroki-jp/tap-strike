/**
 * ファントム・グリッチ (直前減速)
 */
class GlitchEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'GLITCH', name: 'ファントム・グリッチ', color: '#aa00ff', shape: 'square', speedRatio: 1.2, size: 13, hp: 1,
            behavior: 'glitch'
        });
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
