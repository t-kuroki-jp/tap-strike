/**
 * 寿司ノーツ基底クラス (SushiEnemy)
 * お皿描画・回転運動・ヒット演出・サウンド処理などの共通ロジックを一元管理
 */
class SushiEnemy extends Enemy {
    static metadata = { id: 'SUSHI', name: '回転寿司全8種', tag: '自転回転', desc: 'マグロ・サーモン・エビ・たまご等。自転しながら突進！', color: '#ff6633' };

    static createRandom(canvas, gameSpeed, stage) {
        const sushiClasses = [
            TunaSushiEnemy, SalmonSushiEnemy, ShrimpSushiEnemy, EggSushiEnemy,
            MackerelSushiEnemy, OctopusSushiEnemy, SquidSushiEnemy, KappaRollSushiEnemy
        ];
        const RandomSushiClass = sushiClasses[Math.floor(Math.random() * sushiClasses.length)];
        return new RandomSushiClass(canvas, gameSpeed, stage);
    }
    constructor(canvas, gameSpeed, stage, config = {}) {
        const color = config.color || '#ff2a3b';
        super(canvas, gameSpeed, stage, {
            id: config.id || 'SUSHI',
            name: config.name || '回転すし',
            color: color,
            shape: 'sushi',
            speedRatio: config.speedRatio || 1.1,
            size: config.size || 18,
            hp: config.hp || 1,
            behavior: config.behavior || 'straight'
        });

        this.sushiType = config.sushiType || 'base';
        this.rotationAngle = Math.random() * Math.PI * 2;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        this.rotationAngle += 0.07;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);

        // 1. 和風回転寿司お皿 (共通の陶器皿)
        this.drawPlate(ctx);

        // 2. 個別寿司ネタの描画 (子クラスでオーバーライド)
        this.drawNeta(ctx);

        ctx.restore();
        this.drawShieldLayer(ctx);
    }

    // 和風回転寿司お皿 (真上から見た丸い陶器皿 ＋ ネタ色の綺麗な和風縁ライン)
    drawPlate(ctx) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 8;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 19, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, 16.8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, 0, 14.2, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 子クラスでオーバーライドするネタ描画
    drawNeta(ctx) {
        // 各ネタの独自描画
    }

    playSushiSound() {
        this.playTone({ type: 'sine', startFreq: 520, endFreq: 1040, duration: 0.15, volume: 0.35 });
    }

    onHit(game, touchX, touchY, isPerfect) {
        // 1. 親クラス(Enemy)の共通HIT・PERFECT音・スコア・ショックウェーブ処理をすべてそのまま利用！
        super.onHit(game, touchX, touchY, isPerfect);

        // 2. 寿司固有の「和風ポンッ♪効果音」と「白いお皿の破片粒子」のみを追加！
        this.playSushiSound();
        game.createParticles(this.x, this.y, '#ffffff', isPerfect);
        return true;
    }
}
