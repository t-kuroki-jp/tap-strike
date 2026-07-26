/**
 * サイン・ウェイバー (ネオンダイアモンド・波状幾何学ノーツ)
 */
class SineWaveEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SINE_WAVE', name: 'サイン・ウェイバー', color: '#00ffcc', shape: 'diamond', speedRatio: 1.0, size: 13, hp: 1,
            behavior: 'wave', behaviorConfig: { frequency: 0.25, amplitude: 2.8 }
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        
        // 白線を撤去し、他の幾何学ノーツと統一感のあるソリッドな単色ネオン描画に！
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        // ひし形 (ダイアモンドノーツ)
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size * 1.3);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size * 1.3);
        ctx.lineTo(this.x - this.size, this.y);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}
