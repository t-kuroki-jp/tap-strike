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

        // 1. ゆらゆら横しっぽ (右横・三毛猫しっぽ)
        ctx.strokeStyle = '#fff5f0';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#ffe0d0';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const tailSwing = Math.sin(this.tailAngle) * 6;
        const tailTipX = this.x + 20 + tailSwing;
        const tailTipY = this.y - 5 + Math.cos(this.tailAngle) * 4;

        ctx.moveTo(this.x + 10, this.y + 5);
        ctx.quadraticCurveTo(this.x + 20, this.y + 8, tailTipX, tailTipY);
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

        // 4. 三角お耳
        // 左耳 (茶トラ側)
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.moveTo(this.x - 14, this.y - 4);
        ctx.lineTo(this.x - 10, this.y - 18);
        ctx.lineTo(this.x - 2, this.y - 10);
        ctx.fill();

        // 右耳 (黒ブチ側)
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.moveTo(this.x + 14, this.y - 4);
        ctx.lineTo(this.x + 10, this.y - 18);
        ctx.lineTo(this.x + 2, this.y - 10);
        ctx.fill();

        // 内側耳 (桜ピンク)
        ctx.fillStyle = '#ffb6c1';
        ctx.beginPath();
        ctx.moveTo(this.x - 11, this.y - 6); ctx.lineTo(this.x - 9, this.y - 14); ctx.lineTo(this.x - 4, this.y - 9);
        ctx.moveTo(this.x + 11, this.y - 6); ctx.lineTo(this.x + 9, this.y - 14); ctx.lineTo(this.x + 4, this.y - 9);
        ctx.fill();

        // 5. 神秘的なエメラルドキャッツアイ (緑目) ＋ 黒目 ＋ ハイライト
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 2.8, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 1.4, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 1.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 3, 0.9, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 3, 0.9, 0, Math.PI * 2);
        ctx.fill();

        // 6. ピンクお鼻 & にっこり口元
        ctx.fillStyle = '#ff6699';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 1.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#662233';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x - 1.8, this.y + 3.5, 1.8, 0, Math.PI * 0.85);
        ctx.arc(this.x + 1.8, this.y + 3.5, 1.8, 0.15 * Math.PI, Math.PI);
        ctx.stroke();

        // 7. 白ヒゲ
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(this.x - 8, this.y + 1); ctx.lineTo(this.x - 18, this.y - 1);
        ctx.moveTo(this.x - 8, this.y + 3); ctx.lineTo(this.x - 18, this.y + 4);
        ctx.moveTo(this.x - 8, this.y + 5); ctx.lineTo(this.x - 17, this.y + 9);
        ctx.moveTo(this.x + 8, this.y + 1); ctx.lineTo(this.x + 18, this.y - 1);
        ctx.moveTo(this.x + 8, this.y + 3); ctx.lineTo(this.x + 18, this.y + 4);
        ctx.moveTo(this.x + 8, this.y + 5); ctx.lineTo(this.x + 17, this.y + 9);
        ctx.stroke();

        ctx.restore();
    }
}

// 2. キジトラ猫 (ブラウン茶トラしま模様)
class KijitoraCatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT_KIJITORA', name: 'キジトラねこ', color: '#e67e22', shape: 'cat', speedRatio: 1.05, size: 15, hp: 1,
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

        // しっぽ
        ctx.strokeStyle = '#d35400';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#d35400';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        const tailSwing = Math.sin(this.tailAngle) * 6;
        ctx.moveTo(this.x + 10, this.y + 5);
        ctx.quadraticCurveTo(this.x + 20, this.y + 8, this.x + 20 + tailSwing, this.y - 5);
        ctx.stroke();

        // 頭
        ctx.fillStyle = '#e67e22';
        ctx.shadowColor = '#d35400';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 額のキジトラしま模様 (M字)
        ctx.strokeStyle = '#6e2c00';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(this.x - 5, this.y - 9); ctx.lineTo(this.x - 2, this.y - 5); ctx.lineTo(this.x, this.y - 8); ctx.lineTo(this.x + 2, this.y - 5); ctx.lineTo(this.x + 5, this.y - 9);
        ctx.stroke();

        // 耳
        ctx.fillStyle = '#d35400';
        ctx.beginPath();
        ctx.moveTo(this.x - 14, this.y - 4); ctx.lineTo(this.x - 10, this.y - 18); ctx.lineTo(this.x - 2, this.y - 10);
        ctx.moveTo(this.x + 14, this.y - 4); ctx.lineTo(this.x + 10, this.y - 18); ctx.lineTo(this.x + 2, this.y - 10);
        ctx.fill();

        // 内耳
        ctx.fillStyle = '#ffb6c1';
        ctx.beginPath();
        ctx.moveTo(this.x - 11, this.y - 6); ctx.lineTo(this.x - 9, this.y - 14); ctx.lineTo(this.x - 4, this.y - 9);
        ctx.moveTo(this.x + 11, this.y - 6); ctx.lineTo(this.x + 9, this.y - 14); ctx.lineTo(this.x + 4, this.y - 9);
        ctx.fill();

        // 目 (アンバーイエロー)
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 2.8, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 1.4, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 1.4, 0, Math.PI * 2);
        ctx.fill();

        // 鼻口
        ctx.fillStyle = '#ff6699';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// 3. ハチワレ猫 (ネイビー＆ホワイト ハチワレ模様)
class HachiwareCatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT_HACHIWARE', name: 'ハチワレねこ', color: '#2c3e50', shape: 'cat', speedRatio: 1.05, size: 15, hp: 1,
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

        // しっぽ
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#34495e';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        const tailSwing = Math.sin(this.tailAngle) * 6;
        ctx.moveTo(this.x + 10, this.y + 5);
        ctx.quadraticCurveTo(this.x + 20, this.y + 8, this.x + 20 + tailSwing, this.y - 5);
        ctx.stroke();

        // 白顔ベース
        ctx.fillStyle = '#fff5f0';
        ctx.shadowColor = '#2c3e50';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 額のハチワレ（八の字）パッチ
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.moveTo(this.x - 15, this.y - 5);
        ctx.lineTo(this.x, this.y - 3);
        ctx.lineTo(this.x + 15, this.y - 5);
        ctx.lineTo(this.x + 12, this.y - 15);
        ctx.lineTo(this.x - 12, this.y - 15);
        ctx.closePath();
        ctx.fill();

        // 耳
        ctx.beginPath();
        ctx.moveTo(this.x - 14, this.y - 4); ctx.lineTo(this.x - 10, this.y - 18); ctx.lineTo(this.x - 2, this.y - 10);
        ctx.moveTo(this.x + 14, this.y - 4); ctx.lineTo(this.x + 10, this.y - 18); ctx.lineTo(this.x + 2, this.y - 10);
        ctx.fill();

        // 内耳
        ctx.fillStyle = '#ffb6c1';
        ctx.beginPath();
        ctx.moveTo(this.x - 11, this.y - 6); ctx.lineTo(this.x - 9, this.y - 14); ctx.lineTo(this.x - 4, this.y - 9);
        ctx.moveTo(this.x + 11, this.y - 6); ctx.lineTo(this.x + 9, this.y - 14); ctx.lineTo(this.x + 4, this.y - 9);
        ctx.fill();

        // 目 (アクアブルー)
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 2.8, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#111111';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 1.4, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 1.4, 0, Math.PI * 2);
        ctx.fill();

        // 鼻口
        ctx.fillStyle = '#ff6699';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
