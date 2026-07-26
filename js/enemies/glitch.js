/**
 * ファントム・グリッチ (直前減速)
 */
class GlitchEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'GLITCH', name: 'ファントム・グリッチ', color: '#aa00ff', shape: 'square', speedRatio: 1.2, size: 13, hp: 1
        });
    }

    update(playerTargetRadius) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);

        let currentSpeed = this.speed;
        if (dist < playerTargetRadius + 60 && dist > playerTargetRadius + 15) {
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
        ctx.rect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        ctx.fill();
        ctx.restore();
    }
}
