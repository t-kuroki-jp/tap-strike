/**
 * ライフ・ポッド (回復ボーナス)
 */
class HealEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'HEAL', name: 'ライフ・ポッド', color: '#00ff88', shape: 'diamond', speedRatio: 0.9, size: 11, hp: 1
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size * 1.3);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size * 1.3);
        ctx.lineTo(this.x - this.size, this.y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#05070e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x - 4, this.y); ctx.lineTo(this.x + 4, this.y);
        ctx.moveTo(this.x, this.y - 4); ctx.lineTo(this.x, this.y + 4);
        ctx.stroke();
        ctx.restore();
    }

    onHit(game, touchX, touchY, isPerfect) {
        super.onHit(game, touchX, touchY, isPerfect);
        if (this.hp <= 0) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            game.player.hp = Math.min(game.player.maxHp, game.player.hp + 1);
            game.createParticles(centerX, centerY, '#00ff88');
        }
        return true;
    }

    onReachCenter(game) {
        // 回復ポッドはスルーしてもノーダメージ！
        game.createParticles(this.x, this.y, this.color);
    }
}
