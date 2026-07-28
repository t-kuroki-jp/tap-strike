/**
 * にゃんこファミリー (三毛猫・キジトラ・ハチワレ統合モジュール)
 * ステージ情報 (this.stage.id) や設定に応じた動きの個別制御にも完全対応！
 */

// 1. 三毛猫 (リアル可愛い本物三毛模様 ＆ トコトコ気まぐれ歩行)
class CatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT', name: '三毛猫みけちゃん', color: '#fff5f0', shape: 'cat', speedRatio: 1.05, size: 15, hp: 1,
            behavior: 'wave', behaviorConfig: { frequency: 0.35, amplitude: 2.2 }
        });
        this.tailAngle = Math.random() * Math.PI * 2;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        this.tailAngle += 0.18;
        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. ゆらゆら横しっぽ (白膨張色の視覚補正 15.0px)
        ctx.strokeStyle = '#fff5f0';
        ctx.lineWidth = 3.8;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#ffe0d0';
        ctx.shadowBlur = 5;
        ctx.beginPath();

        const tailSwing = Math.sin(this.tailAngle) * 3.8;
        const tailTipX = this.x + 15.0 + tailSwing;
        const tailTipY = this.y - 2.5 + Math.cos(this.tailAngle) * 2.5;

        ctx.moveTo(this.x + 8, this.y + 5);
        ctx.quadraticCurveTo(this.x + 14, this.y + 6.5, tailTipX, tailTipY);
        ctx.stroke();

        // 2. 白い猫の頭 (ベースアイボリーホワイト)
        ctx.fillStyle = '#fff5f0';
        ctx.shadowColor = '#ffaa88';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 3. 本物の三毛猫ブチ模様 (左頭に茶トラ模様, 右頭に黒ブチ模様)
        ctx.shadowBlur = 0;
        // 左耳〜頭の茶トラパッチ
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.arc(this.x - 7, this.y - 6, 7, 0, Math.PI * 2);
        ctx.fill();

        // 右耳〜頭の黒ブチパッチ
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y - 5, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // 4. リアルな曲線ねこ耳
        // 左耳 (茶トラ側)
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.moveTo(this.x - 14, this.y - 3);
        ctx.quadraticCurveTo(this.x - 13, this.y - 14, this.x - 7, this.y - 18);
        ctx.quadraticCurveTo(this.x - 3, this.y - 13, this.x - 1, this.y - 10);
        ctx.closePath();
        ctx.fill();

        // 右耳 (黒ブチ側)
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.moveTo(this.x + 1, this.y - 10);
        ctx.quadraticCurveTo(this.x + 3, this.y - 13, this.x + 7, this.y - 18);
        ctx.quadraticCurveTo(this.x + 13, this.y - 14, this.x + 14, this.y - 3);
        ctx.closePath();
        ctx.fill();

        // 5. ピンクのお耳の中 (ふんわりくぼみ)
        ctx.fillStyle = '#ffb7c5';
        ctx.beginPath();
        ctx.moveTo(this.x - 12, this.y - 5);
        ctx.quadraticCurveTo(this.x - 11, this.y - 12, this.x - 7, this.y - 15);
        ctx.quadraticCurveTo(this.x - 4, this.y - 11, this.x - 3, this.y - 8);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 3, this.y - 8);
        ctx.quadraticCurveTo(this.x + 4, this.y - 11, this.x + 7, this.y - 15);
        ctx.quadraticCurveTo(this.x + 11, this.y - 12, this.x + 12, this.y - 5);
        ctx.closePath();
        ctx.fill();

        // 6. つぶらなお目め (エメラルドグリーン)
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(this.x - 5.5, this.y - 1, 3.2, 0, Math.PI * 2);
        ctx.arc(this.x + 5.5, this.y - 1, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // 瞳孔
        ctx.fillStyle = '#0f381e';
        ctx.beginPath();
        ctx.arc(this.x - 5.5, this.y - 1, 1.6, 0, Math.PI * 2);
        ctx.arc(this.x + 5.5, this.y - 1, 1.6, 0, Math.PI * 2);
        ctx.fill();

        // 目の中の光 (ハイライト)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6.5, this.y - 2, 0.9, 0, Math.PI * 2);
        ctx.arc(this.x + 4.5, this.y - 2, 0.9, 0, Math.PI * 2);
        ctx.fill();

        // 7. ピンクのお鼻 ＆ 口元
        ctx.fillStyle = '#ff88a5';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 3.5, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#d35400';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(this.x - 2, this.y + 5, 2, 0, Math.PI);
        ctx.arc(this.x + 2, this.y + 5, 2, 0, Math.PI);
        ctx.stroke();

        // 8. ぴんっと生えたひげ (白いひげ)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        // 左ひげ
        ctx.moveTo(this.x - 8, this.y + 2);
        ctx.lineTo(this.x - 19, this.y);
        ctx.moveTo(this.x - 8, this.y + 4);
        ctx.lineTo(this.x - 18, this.y + 7);
        // 右ひげ
        ctx.moveTo(this.x + 8, this.y + 2);
        ctx.lineTo(this.x + 19, this.y);
        ctx.moveTo(this.x + 8, this.y + 4);
        ctx.lineTo(this.x + 18, this.y + 7);
        ctx.stroke();

        ctx.restore();
        this.drawShieldLayer(ctx);
    }
}

// 2. キジトラ猫 (縞々リアル可愛いキジトラ模様 ＆ 白いお腹・口元)
class TigerCatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'TIGER_CAT', name: 'キジトラとらちゃん', color: '#c49a6c', shape: 'cat', speedRatio: 1.1, size: 15, hp: 1,
            behavior: 'wave', behaviorConfig: { frequency: 0.4, amplitude: 2.5 }
        });
        this.tailAngle = Math.random() * Math.PI * 2;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        this.tailAngle += 0.2;
        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. 縞々しっぽ (黄金バランス)
        ctx.strokeStyle = '#8c6239';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#8c6239';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const tailSwing = Math.sin(this.tailAngle) * 4.5;
        const tailTipX = this.x + 17 + tailSwing;
        const tailTipY = this.y - 3 + Math.cos(this.tailAngle) * 3.0;

        ctx.moveTo(this.x + 9, this.y + 5);
        ctx.quadraticCurveTo(this.x + 16, this.y + 7, tailTipX, tailTipY);
        ctx.stroke();

        // 2. 頭部ベース (キジトラゴールドブラウン)
        ctx.fillStyle = '#c49a6c';
        ctx.shadowColor = '#8c6239';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 2-2. キジトラの可愛い白いお腹・白マズル (アイボリーホワイト)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff8f0';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 3.5, this.size * 0.65, 0, Math.PI * 2);
        ctx.fill();

        // 3. 額の「M字」トラ縞模様
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

        // 4. 三角お耳
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

        // 5. お目め (ゴールドアンバー)
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(this.x - 5.5, this.y - 1, 3.2, 0, Math.PI * 2);
        ctx.arc(this.x + 5.5, this.y - 1, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3a2000';
        ctx.beginPath();
        ctx.arc(this.x - 5.5, this.y - 1, 1.6, 0, Math.PI * 2);
        ctx.arc(this.x + 5.5, this.y - 1, 1.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6.5, this.y - 2, 0.9, 0, Math.PI * 2);
        ctx.arc(this.x + 4.5, this.y - 2, 0.9, 0, Math.PI * 2);
        ctx.fill();

        // 6. 口元 ＆ ひげ
        ctx.fillStyle = '#ff88a5';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 3.5, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#4a321a';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(this.x - 2, this.y + 5, 2, 0, Math.PI);
        ctx.arc(this.x + 2, this.y + 5, 2, 0, Math.PI);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(this.x - 8, this.y + 2);
        ctx.lineTo(this.x - 19, this.y);
        ctx.moveTo(this.x - 8, this.y + 4);
        ctx.lineTo(this.x - 18, this.y + 7);

        ctx.moveTo(this.x + 8, this.y + 2);
        ctx.lineTo(this.x + 19, this.y);
        ctx.moveTo(this.x + 8, this.y + 4);
        ctx.lineTo(this.x + 18, this.y + 7);
        ctx.stroke();

        ctx.restore();
        this.drawShieldLayer(ctx);
    }
}

// 3. ハチワレ猫 (くっきり漆黒ブラック＆純白美しいハチワレ模様)
class HachiwareCatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'HACHIWARE_CAT', name: 'ハチワレはちちゃん', color: '#1a1a1a', shape: 'cat', speedRatio: 1.0, size: 15, hp: 1,
            behavior: 'wave', behaviorConfig: { frequency: 0.3, amplitude: 2.0 }
        });
        this.tailAngle = Math.random() * Math.PI * 2;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        this.tailAngle += 0.16;
        return dist;
    }

    draw(ctx) {
        ctx.save();

        // 1. 漆黒しっぽ (黄金バランス)
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 4.2;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#1a1a1a';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const tailSwing = Math.sin(this.tailAngle) * 4.5;
        const tailTipX = this.x + 17 + tailSwing;
        const tailTipY = this.y - 3 + Math.cos(this.tailAngle) * 3.0;

        ctx.moveTo(this.x + 9, this.y + 5);
        ctx.quadraticCurveTo(this.x + 16, this.y + 7, tailTipX, tailTipY);
        ctx.stroke();

        // 2. 白い頭ベース
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#1a1a1a';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 3. 額のハチワレ「八の字」漆黒パッチ (#1a1a1a)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 7);
        ctx.lineTo(this.x - 14, this.y - 2);
        ctx.lineTo(this.x - 14, this.y - 15);
        ctx.lineTo(this.x + 14, this.y - 15);
        ctx.lineTo(this.x + 14, this.y - 2);
        ctx.closePath();
        ctx.fill();

        // 4. 漆黒の三角耳 (#1a1a1a)
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

        // ピンクのお耳の中
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

        // 5. お目め (アクアブルー)
        ctx.fillStyle = '#00c8ff';
        ctx.beginPath();
        ctx.arc(this.x - 5.5, this.y - 1, 3.2, 0, Math.PI * 2);
        ctx.arc(this.x + 5.5, this.y - 1, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#004060';
        ctx.beginPath();
        ctx.arc(this.x - 5.5, this.y - 1, 1.6, 0, Math.PI * 2);
        ctx.arc(this.x + 5.5, this.y - 1, 1.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6.5, this.y - 2, 0.9, 0, Math.PI * 2);
        ctx.arc(this.x + 4.5, this.y - 2, 0.9, 0, Math.PI * 2);
        ctx.fill();

        // 6. ピンクお鼻 ＆ ひげ
        ctx.fillStyle = '#ff88a5';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 3.5, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(this.x - 2, this.y + 5, 2, 0, Math.PI);
        ctx.arc(this.x + 2, this.y + 5, 2, 0, Math.PI);
        ctx.stroke();

        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(this.x - 8, this.y + 2);
        ctx.lineTo(this.x - 19, this.y);
        ctx.moveTo(this.x - 8, this.y + 4);
        ctx.lineTo(this.x - 18, this.y + 7);

        ctx.moveTo(this.x + 8, this.y + 2);
        ctx.lineTo(this.x + 19, this.y);
        ctx.moveTo(this.x + 8, this.y + 4);
        ctx.lineTo(this.x + 18, this.y + 7);
        ctx.stroke();

        ctx.restore();
        this.drawShieldLayer(ctx);
    }
}

// 別名エイリアス (CAT_KIJITORA 参照互換)
const KijitoraCatEnemy = TigerCatEnemy;
