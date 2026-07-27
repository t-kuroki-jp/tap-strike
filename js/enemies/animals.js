/**
 * ネオンどうぶつノーツ・モジュール (Animal Enemies Module)
 * Canvas ベクター描画による可愛いネオンどうぶつノーツ群
 */

// 1. 柴犬わんこ (Dog / 本格麻呂眉 ＆ ふっくら柴犬フェイス)
class DogEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'DOG', name: '柴犬わんこ', color: '#e67e22', shape: 'dog', speedRatio: 1.0, size: 16, hp: 1,
            behavior: 'straight'
        });
        this.tailAngle = 0;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        // 嬉しそうにフリフリ振る尻尾アニメーション
        this.tailAngle = Math.sin(Date.now() / 80) * 0.5;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;

        const s = this.size;

        // 1. くるりん巻いたフリフリ尾っぽ (後ろ)
        ctx.save();
        ctx.translate(0, s * 0.85);
        ctx.rotate(this.tailAngle);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 9, Math.PI * 0.2, Math.PI * 1.3);
        ctx.stroke();
        ctx.restore();

        // 2. 柴犬の頭 (赤柴カラー)
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 0, s, 0, Math.PI * 2);
        ctx.fill();

        // 3. 前傾した厚みのある立ち耳
        ctx.fillStyle = '#d35400';
        // 左耳
        ctx.beginPath();
        ctx.moveTo(-s * 0.75, -s * 0.4);
        ctx.lineTo(-s * 0.95, -s * 1.25);
        ctx.lineTo(-s * 0.2, -s * 0.95);
        ctx.closePath();
        ctx.fill();
        // 右耳
        ctx.beginPath();
        ctx.moveTo(s * 0.75, -s * 0.4);
        ctx.lineTo(s * 0.95, -s * 1.25);
        ctx.lineTo(s * 0.2, -s * 0.95);
        ctx.closePath();
        ctx.fill();

        // 4. 柴犬特有の白毛マズル・頬の毛 (裏白・クリーム色)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff0e6';
        ctx.beginPath();
        ctx.ellipse(0, s * 0.25, s * 0.7, s * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();

        // 5. 柴犬のトレードマーク『麻呂眉 (まろまゆ・白い点)』
        ctx.beginPath();
        ctx.arc(-s * 0.4, -s * 0.45, 2.8, 0, Math.PI * 2); // 左まろ眉
        ctx.arc(s * 0.4, -s * 0.45, 2.8, 0, Math.PI * 2);  // 右まろ眉
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

// 2. みつばち (Bee / 旋回アプローチ)
class BeeEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'BEE', name: 'みつばち', color: '#ffcc00', shape: 'bee', speedRatio: 0.9, size: 15, hp: 1,
            behavior: 'spiral'
        });
        this.wingAngle = 0;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        // パタパタ羽ばたく高速ツイン翼アニメーション
        this.wingAngle = Math.sin(Date.now() / 40) * 0.5;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;

        const s = this.size;

        // 1. 左右のパタパタ透明ツイン翼 (Back)
        ctx.save();
        ctx.fillStyle = 'rgba(200, 240, 255, 0.7)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 8;

        // 左翼
        ctx.beginPath();
        ctx.ellipse(-s * 0.85, -s * 0.3, s * 0.75, s * 0.4, -0.4 + this.wingAngle, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 右翼
        ctx.beginPath();
        ctx.ellipse(s * 0.85, -s * 0.3, s * 0.75, s * 0.4, 0.4 - this.wingAngle, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 2. 黄色と黒のしましまボディ
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.85, s * 1.05, 0, 0, Math.PI * 2);
        ctx.fill();

        // 黒いしましま模様 (2本)
        ctx.fillStyle = '#111111';
        ctx.fillRect(-s * 0.8, -s * 0.25, s * 1.6, s * 0.25);
        ctx.fillRect(-s * 0.75, s * 0.2, s * 1.5, s * 0.25);

        // 3. 触角 ( Antennae )
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-s * 0.3, -s * 0.9);
        ctx.quadraticCurveTo(-s * 0.5, -s * 1.4, -s * 0.6, -s * 1.3);
        ctx.moveTo(s * 0.3, -s * 0.9);
        ctx.quadraticCurveTo(s * 0.5, -s * 1.4, s * 0.6, -s * 1.3);
        ctx.stroke();

        // 4. 可愛いつぶらな目
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-s * 0.35, -s * 0.45, 3.2, 0, Math.PI * 2);
        ctx.arc(s * 0.35, -s * 0.45, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-s * 0.35, -s * 0.45, 1.6, 0, Math.PI * 2);
        ctx.arc(s * 0.35, -s * 0.45, 1.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// 3. カエル (Frog / フリーズ一瞬停止)
class FrogEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'FROG', name: 'かえるさん', color: '#00ff66', shape: 'frog', speedRatio: 0.95, size: 15, hp: 1,
            behavior: 'freeze'
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;

        const s = this.size;

        // 1. 体の丸
        ctx.beginPath();
        ctx.arc(0, 2, s * 0.9, 0, Math.PI * 2);
        ctx.fill();

        // 2. ぽっこり飛び出た二つの大きなお目め (上部)
        ctx.beginPath();
        ctx.arc(-s * 0.6, -s * 0.6, s * 0.5, 0, Math.PI * 2);
        ctx.arc(s * 0.6, -s * 0.6, s * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // 白目と黒目
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-s * 0.6, -s * 0.6, s * 0.3, 0, Math.PI * 2);
        ctx.arc(s * 0.6, -s * 0.6, s * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-s * 0.6, -s * 0.6, s * 0.15, 0, Math.PI * 2);
        ctx.arc(s * 0.6, -s * 0.6, s * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // 3. にっこり口元
        ctx.strokeStyle = '#005522';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, s * 0.1, s * 0.4, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        ctx.restore();
    }
}
