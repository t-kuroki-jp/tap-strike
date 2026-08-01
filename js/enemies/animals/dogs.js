/**
 * 柴犬わんこ (DogEnemy / くるりん尾っぽ ＆ 麻呂眉 ＆ つぶらな黒目)
 */
class DogEnemy extends Enemy {
    static metadata = { id: 'DOG', name: '柴犬わんこ', tag: '直進ダッシュ', desc: 'くるりん尾っぽを振って元気いっぱいに駆けてくる柴犬！', color: '#ffaa33' };
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'DOG', name: '柴犬わんこ', color: '#ffaa33', shape: 'dog', speedRatio: 1.05, size: 14.5, hp: 1,
            behavior: 'straight'
        });
        this.tailAngle = 0;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        // 元気いっぱいに振る柴犬の巻き尾っぽアニメーション
        this.tailAngle = Math.sin(Date.now() / 70) * 0.45;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;

        const s = this.size;

        // 1. 【奥レイヤー (Back)】 頭の裏から生えて右後ろでゆらゆら動く柴犬の可愛いしっぽ
        ctx.save();
        // 頭の円の裏（右後ろ）に基点を配置
        ctx.translate(s * 0.7, s * 0.15);
        ctx.rotate(-0.2 + this.tailAngle * 0.6);

        ctx.shadowColor = '#e67700';
        ctx.shadowBlur = 6;
        ctx.strokeStyle = '#ffaa33';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';

        // 頭の奥から伸びて先がクルンと巻く柴犬しっぽ
        ctx.beginPath();
        ctx.moveTo(-s * 0.2, s * 0.2);
        ctx.quadraticCurveTo(s * 0.5, -s * 0.2, s * 0.2, -s * 0.6);
        ctx.stroke();

        // しっぽの裏白（クリーム毛）
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#fff0e6';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-s * 0.2, s * 0.2);
        ctx.quadraticCurveTo(s * 0.35, -s * 0.15, s * 0.15, -s * 0.48);
        ctx.stroke();

        ctx.restore();

        // 2. 柴犬の頭 (赤柴カラー)
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, s, 0, Math.PI * 2);
        ctx.fill();

        // 3. 【参考画像100%再現】柴犬のピンと立ったリアル美しい三角立ち耳
        ctx.shadowColor = '#d35400';
        ctx.shadowBlur = 6;

        // 左耳 (赤柴ベース)
        ctx.fillStyle = '#e67700';
        ctx.beginPath();
        ctx.moveTo(-s * 0.82, -s * 0.32); // 頬横の付け根
        ctx.quadraticCurveTo(-s * 0.90, -s * 1.10, -s * 0.65, -s * 1.38); // 外側曲線〜先端
        ctx.quadraticCurveTo(-s * 0.30, -s * 1.15, -s * 0.22, -s * 0.80); // 内側曲線〜おでこ付け根
        ctx.closePath();
        ctx.fill();

        // 右耳 (赤柴ベース)
        ctx.beginPath();
        ctx.moveTo(s * 0.82, -s * 0.32);
        ctx.quadraticCurveTo(s * 0.90, -s * 1.10, s * 0.65, -s * 1.38);
        ctx.quadraticCurveTo(s * 0.22, -s * 0.80, s * 0.22, -s * 0.80);
        ctx.closePath();
        ctx.fill();

        // 内耳 (前を向いた本物柴犬のふんわりピンククリーム耳穴)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffe5d0';

        // 左内耳
        ctx.beginPath();
        ctx.moveTo(-s * 0.72, -s * 0.42);
        ctx.quadraticCurveTo(-s * 0.78, -s * 0.98, -s * 0.60, -s * 1.20);
        ctx.quadraticCurveTo(-s * 0.35, -s * 1.00, -s * 0.30, -s * 0.78);
        ctx.closePath();
        ctx.fill();

        // 右内耳
        ctx.beginPath();
        ctx.moveTo(s * 0.72, -s * 0.42);
        ctx.quadraticCurveTo(s * 0.78, -s * 0.98, s * 0.60, -s * 1.20);
        ctx.quadraticCurveTo(s * 0.35, -s * 1.00, s * 0.30, -s * 0.78);
        ctx.closePath();
        ctx.fill();

        // 4. 柴犬特有の白毛マズル・ふっくら頬の裏白 (参考画像のふくふくクリーム白毛)
        ctx.fillStyle = '#fff4e6';
        ctx.beginPath();
        ctx.ellipse(0, s * 0.22, s * 0.72, s * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();

        // 5. 柴犬のトレードマーク『麻呂眉 (まろまゆ)』(参考画像通り、目の直上にチョコンと配置)
        ctx.fillStyle = '#fff4e6';
        ctx.beginPath();
        ctx.arc(-s * 0.35, -s * 0.28, 2.3, 0, Math.PI * 2); // 左目の直上
        ctx.arc(s * 0.35, -s * 0.28, 2.3, 0, Math.PI * 2);  // 右目の直上
        ctx.fill();

        // 6. つぶらな黒目
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(-s * 0.4, -s * 0.1, 2.8, 0, Math.PI * 2); // 左目
        ctx.arc(s * 0.4, -s * 0.1, 2.8, 0, Math.PI * 2);  // 右目
        ctx.fill();

        // 目のハイライト
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-s * 0.45, -s * 0.15, 1.0, 0, Math.PI * 2);
        ctx.arc(s * 0.35, -s * 0.15, 1.0, 0, Math.PI * 2);
        ctx.fill();

        // 7. 黒いお鼻 ＆ にっこり口元
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(0, s * 0.15, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        // w 型の可愛い口元
        ctx.moveTo(-3.2, s * 0.38);
        ctx.quadraticCurveTo(-1.6, s * 0.52, 0, s * 0.38);
        ctx.quadraticCurveTo(1.6, s * 0.52, 3.2, s * 0.38);
        ctx.stroke();

        ctx.restore();
    }
}
