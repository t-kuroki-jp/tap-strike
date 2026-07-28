/**
 * キジトラとらちゃん (KijitoraCatEnemy extends CatEnemy)
 */
class KijitoraCatEnemy extends CatEnemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT_KIJITORA',
            name: 'キジトラとらちゃん',
            color: '#c49a6c',
            tailColor: '#8c6239',
            speedRatio: 1.1,
            size: 15,
            hp: 1,
            behavior: 'wave',
            behaviorConfig: { frequency: 0.4, amplitude: 2.5 }
        });
    }

    drawCatPattern(ctx) {
        ctx.shadowBlur = 0;

        // 1. キジトラの可愛い白いお腹・白マズル (アイボリーホワイト)
        ctx.fillStyle = '#fff8f0';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 3.5, this.size * 0.65, 0, Math.PI * 2);
        ctx.fill();

        // 2. 額の「M字」トラ縞模様
        ctx.strokeStyle = '#4a321a';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(this.x - 7, this.y - 12);
        ctx.lineTo(this.x - 3.5, this.y - 6);
        ctx.lineTo(this.x, this.y - 10);
        ctx.lineTo(this.x + 3.5, this.y - 6);
        ctx.lineTo(this.x + 7, this.y - 12);
        ctx.stroke();

        // 頬のトラ縞模様
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(this.x - 14, this.y - 2);
        ctx.lineTo(this.x - 8, this.y);
        ctx.moveTo(this.x - 13, this.y + 3);
        ctx.lineTo(this.x - 7, this.y + 4);

        ctx.moveTo(this.x + 14, this.y - 2);
        ctx.lineTo(this.x + 8, this.y);
        ctx.moveTo(this.x + 13, this.y + 3);
        ctx.lineTo(this.x + 7, this.y + 4);
        ctx.stroke();

        // 3. 三角お耳
        ctx.fillStyle = '#a67c52';
        ctx.beginPath();
        ctx.moveTo(this.x - 14, this.y - 4);
        ctx.lineTo(this.x - 8, this.y - 18);
        ctx.lineTo(this.x - 1, this.y - 11);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 1, this.y - 11);
        ctx.lineTo(this.x + 8, this.y - 18);
        ctx.lineTo(this.x + 14, this.y - 4);
        ctx.closePath();
        ctx.fill();

        // 耳の中ピンク
        ctx.fillStyle = '#ffb7c5';
        ctx.beginPath();
        ctx.moveTo(this.x - 12, this.y - 6);
        ctx.lineTo(this.x - 8, this.y - 15);
        ctx.lineTo(this.x - 4, this.y - 10);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 4, this.y - 10);
        ctx.lineTo(this.x + 8, this.y - 15);
        ctx.lineTo(this.x + 12, this.y - 6);
        ctx.closePath();
        ctx.fill();
    }

    // キジトラ専用のお目め (ゴールドアンバー)
    drawEyes(ctx) {
        super.drawEyes(ctx, '#f39c12', '#3a2000');
    }
}

// 別名エイリアス互換
const TigerCatEnemy = KijitoraCatEnemy;
