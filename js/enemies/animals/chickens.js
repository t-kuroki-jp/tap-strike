/**
 * ぴよぴよヒヨコ (ChickenEnemy / トコトコ歩行 / つぶらな黒目 ＋ ハイライト ＋ パタパタ羽)
 */
class ChickenEnemy extends Enemy {
    static metadata = { id: 'CHICKEN', name: 'ぴよぴよヒヨコ', tag: 'チョコチョコ歩行', desc: '羽をはためかせてトコトコ進む可愛い黄色いヒヨコ！', color: '#ffee33' };
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CHICKEN', name: 'ぴよぴよヒヨコ', color: '#ffee33', shape: 'chicken', speedRatio: 0.95, size: 14.5, hp: 1,
            behavior: 'straight'
        });
        this.wingAngle = 0;
        this.waddleOffset = 0;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        // パタパタはためく羽アニメーション
        this.wingAngle = Math.sin(Date.now() / 60) * 0.4;
        // トコトコチョコチョコ揺れる体
        this.waddleOffset = Math.sin(Date.now() / 40) * 2;
        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. おしりの小さなチョコン尾羽
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 11, 4, 0, Math.PI * 2);
        ctx.fill();

        // 2. パタパタ動く小さな翼
        const wingYOffset = Math.sin(this.wingAngle) * 2.5;
        ctx.fillStyle = '#ffdb1a';

        // 左羽
        ctx.save();
        ctx.translate(this.x - 12, this.y + 1 + wingYOffset);
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 右羽
        ctx.save();
        ctx.translate(this.x + 12, this.y + 1 + wingYOffset);
        ctx.rotate(-Math.PI / 4);
        ctx.beginPath();
        ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. オレンジの小さなちょこん足 (2本)
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x - 4, this.y + 11); ctx.lineTo(this.x - 5, this.y + 16);
        ctx.moveTo(this.x + 4, this.y + 11); ctx.lineTo(this.x + 5, this.y + 16);
        ctx.stroke();

        // 4. 滑らかなひよこ饅頭・たまごシルエットボディ (頭と身体の一体感)
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 8;

        // 胴体 (下部ふっくら)
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 14, 0, Math.PI * 2);
        ctx.fill();

        // つるんとした頭部 (スムーズな丸み)
        ctx.beginPath();
        ctx.arc(this.x, this.y - 4, 11.5, 0, Math.PI * 2);
        ctx.fill();

        // 5. 頭のてっぺんのチョコンと生えた一本の小さな産毛 (アホ毛)
        ctx.strokeStyle = '#ffb700';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 15);
        ctx.quadraticCurveTo(this.x + 3, this.y - 20, this.x + 4, this.y - 21);
        ctx.stroke();

        // 6. ほんのりピンクのチーク (ほっぺた 💕)
        ctx.fillStyle = 'rgba(255, 99, 132, 0.55)';
        ctx.beginPath();
        ctx.arc(this.x - 7, this.y - 1, 3.2, 0, Math.PI * 2);
        ctx.arc(this.x + 7, this.y - 1, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // 7. 童顔パッチリ黒目 ＋ ハイライト (少し低めの愛くるしい位置)
        ctx.fillStyle = '#0a0d14';
        ctx.beginPath();
        ctx.arc(this.x - 4.5, this.y - 4, 2.5, 0, Math.PI * 2);
        ctx.arc(this.x + 4.5, this.y - 4, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 白目ハイライト
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 5.5, this.y - 5, 1.0, 0, Math.PI * 2);
        ctx.arc(this.x + 3.5, this.y - 5, 1.0, 0, Math.PI * 2);
        ctx.fill();

        // 8. ちょこんと小さくて可愛い三角形の口ばし
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(this.x - 3.5, this.y - 2);
        ctx.lineTo(this.x + 3.5, this.y - 2);
        ctx.lineTo(this.x, this.y + 3);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}
