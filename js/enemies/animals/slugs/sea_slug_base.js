/**
 * ウミウシ (Sea Slug) エネミー基底クラス (SeaSlugEnemy)
 * ウミウシ特有の「うねうね波打つ体幹アニメーション」、頭部ツノ触角(Rhinophores)、背中・お尻のフサフサ二次鰓(Gill Plume)を共通管理
 */
class SeaSlugEnemy extends Enemy {
    static metadata = { id: 'SEA_SLUG', name: '海の宝石ウミウシ', tag: '波打つ水蒸泳', desc: 'アオウミウシ・ゴマちゃん・ピカチュウ！うねうね波打つ海の宝石！', color: '#00ccff' };

    static createRandom(canvas, gameSpeed, stage) {
        const slugClasses = [
            BlueSeaSlugEnemy, JorunnaSeaSlugEnemy, PikachuSeaSlugEnemy,
            StrawberrySeaSlugEnemy, CinderellaSeaSlugEnemy, GlaucusSeaSlugEnemy,
            MizoreSeaSlugEnemy, KompeitoSeaSlugEnemy
        ];
        const RandomSlugClass = slugClasses[Math.floor(Math.random() * slugClasses.length)];
        return new RandomSlugClass(canvas, gameSpeed, stage);
    }
    constructor(canvas, gameSpeed, stage, config = {}) {
        const color = config.color || '#0066cc';
        super(canvas, gameSpeed, stage, {
            id: config.id || 'SEA_SLUG',
            name: config.name || 'ウミウシ',
            color: color,
            shape: 'sea_slug',
            speedRatio: config.speedRatio || 0.85,
            size: config.size || 18,
            hp: config.hp || 1,
            behavior: config.behavior || 'straight'
        });

        this.slugType = config.slugType || 'base';
        this.ripplePhase = Math.random() * Math.PI * 2;
        this.gillAngle = Math.random() * Math.PI * 2;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        // うねうね体幹リップル運動 ＆ 二次鰓のフサフサ揺れ
        this.ripplePhase += 0.14;
        this.gillAngle += 0.10;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // 画面中心へ向かう正しく美しい向き合わせ
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const angle = Math.atan2(centerY - this.y, centerX - this.x);
        ctx.rotate(angle + Math.PI / 2);

        // 1. ウミウシ特有の「ぷっくりふっくらひらひらボディ (外套膜 Mantle)」
        this.drawBodyShape(ctx);

        // 2. 各ウミウシ固有の模様・配色 (子クラスでオーバーライド)
        this.drawMantlePattern(ctx);

        // 3. 背中・お尻のフサフサ二次鰓 (Gill Plume)
        this.drawGillPlume(ctx);

        // 4. 頭部の可愛いツノ触角 (Rhinophores)
        this.drawRhinophores(ctx);

        ctx.restore();
        this.drawShieldLayer(ctx);
    }

    // 1. うねうね波打つふっくらぷっくりボディ
    drawBodyShape(ctx) {
        const ripple = Math.sin(this.ripplePhase) * 3.5;

        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = this.color;
        ctx.beginPath();

        // ぷっくり丸い頭部
        ctx.arc(0, -this.size * 0.7, this.size * 0.65, Math.PI, 0);

        // 右側ふっくらひらひらヒダ
        ctx.quadraticCurveTo(
            this.size * 0.9 + ripple, -this.size * 0.1,
            this.size * 0.65, this.size * 0.7
        );

        // お尻・尾部 (しなやかなグラデーションテイル)
        ctx.quadraticCurveTo(
            ripple * 0.8, this.size * 1.4,
            -this.size * 0.65, this.size * 0.7
        );

        // 左側ふっくらひらひらヒダ
        ctx.quadraticCurveTo(
            -this.size * 0.9 - ripple, -this.size * 0.1,
            -this.size * 0.65, -this.size * 0.7
        );

        ctx.closePath();
        ctx.fill();
    }

    // 2. 子クラスでオーバーライドする外套膜の模様
    drawMantlePattern(ctx) {
        // デフォルト模様なし
    }

    // 3. 背中・お尻のフサフサ二次鰓 (Gill Plume)
    drawGillPlume(ctx, gillColor = '#ff6633', coreColor = '#ffffff') {
        ctx.save();
        ctx.translate(0, this.size * 0.35); // 背中やや後ろ

        const plumeSwing = Math.sin(this.gillAngle) * 2.0;
        const featherCount = 7;

        ctx.shadowBlur = 6;
        ctx.shadowColor = gillColor;
        ctx.strokeStyle = gillColor;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';

        // 放射状に広がるフサフサの羽枝
        for (let i = 0; i < featherCount; i++) {
            const a = (i / featherCount) * Math.PI * 2 + (this.gillAngle * 0.5);
            const fx = Math.cos(a) * (7 + Math.sin(a + plumeSwing) * 3);
            const fy = Math.sin(a) * (7 + Math.cos(a + plumeSwing) * 3);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(fx, fy);
            ctx.stroke();

            // 先端の丸みポッチ
            ctx.fillStyle = coreColor;
            ctx.beginPath();
            ctx.arc(fx, fy, 1.6, 0, Math.PI * 2);
            ctx.fill();
        }

        // 鰓の根元コア
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(0, 0, 3.0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // 4. 頭部のツノ触角 (Rhinophores)
    drawRhinophores(ctx, hornColor = '#ff5533', ringColor = '#ffffff') {
        ctx.save();
        ctx.translate(0, -this.size * 0.75); // 頭部前方

        const hornSwing = Math.sin(this.ripplePhase * 1.2) * 1.8;
        const horns = [
            { x: -7 + hornSwing, y: -11 },
            { x: 7 + hornSwing, y: -11 }
        ];

        horns.forEach(h => {
            // 触角の棒
            ctx.strokeStyle = hornColor;
            ctx.lineWidth = 3.0;
            ctx.lineCap = 'round';
            ctx.shadowColor = hornColor;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(h.x * 0.4, 0);
            ctx.lineTo(h.x, h.y);
            ctx.stroke();

            // 触角の先端リング・グラデーション
            ctx.fillStyle = ringColor;
            ctx.beginPath();
            ctx.arc(h.x, h.y, 2.4, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    playSlugSound() {
        // 水中「ぷにっ♪」高音かわいらしいプルプル効果音
        this.playTone({ type: 'sine', startFreq: 520, endFreq: 950, duration: 0.14, volume: 0.35 });
    }

    onHit(game, touchX, touchY, isPerfect) {
        super.onHit(game, touchX, touchY, isPerfect);
        this.playSlugSound();
        return true;
    }
}
