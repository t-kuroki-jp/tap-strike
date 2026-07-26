/**
 * にゃんこファミリー (三毛猫・キジトラ・ハチワレ統合モジュール)
 * ステージ情報 (this.stage.id) や設定に応じた動きの個別制御にも完全対応！
 */

// 1. 三毛猫 (デフォルメ・トコトコ気まぐれ歩行)
class CatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT', name: 'にゃんこフェスティバル', color: '#ffb3cc', shape: 'cat', speedRatio: 1.05, size: 15, hp: 1,
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

        // 1. ゆらゆら横しっぽ (右横)
        ctx.strokeStyle = '#ff99bb';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#ff99bb';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const tailSwing = Math.sin(this.tailAngle) * 6;
        const tailTipX = this.x + 20 + tailSwing;
        const tailTipY = this.y - 5 + Math.cos(this.tailAngle) * 4;

        ctx.moveTo(this.x + 10, this.y + 5);
        ctx.quadraticCurveTo(this.x + 20, this.y + 8, tailTipX, tailTipY);
        ctx.stroke();

        // 2. 猫の頭
        ctx.fillStyle = '#ffb3cc';
        ctx.shadowColor = '#ff99bb';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 3. 三角お耳
        ctx.fillStyle = '#ff99bb';
        ctx.beginPath();
        ctx.moveTo(this.x - 14, this.y - 4);
        ctx.lineTo(this.x - 10, this.y - 18);
        ctx.lineTo(this.x - 2, this.y - 10);
        ctx.moveTo(this.x + 14, this.y - 4);
        ctx.lineTo(this.x + 10, this.y - 18);
        ctx.lineTo(this.x + 2, this.y - 10);
        ctx.fill();

        // 内側耳
        ctx.fillStyle = '#ff6699';
        ctx.beginPath();
        ctx.moveTo(this.x - 11, this.y - 6); ctx.lineTo(this.x - 9, this.y - 14); ctx.lineTo(this.x - 4, this.y - 9);
        ctx.moveTo(this.x + 11, this.y - 6); ctx.lineTo(this.x + 9, this.y - 14); ctx.lineTo(this.x + 4, this.y - 9);
        ctx.fill();

        // 4. 黒目 ＋ ハイライト
        ctx.fillStyle = '#05070e';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 2.5, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 3, 0.9, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 3, 0.9, 0, Math.PI * 2);
        ctx.fill();

        // 5. お鼻 & 口元
        ctx.fillStyle = '#ff3366';
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#662233';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x - 1.8, this.y + 3.5, 1.8, 0, Math.PI * 0.85);
        ctx.arc(this.x + 1.8, this.y + 3.5, 1.8, 0.15 * Math.PI, Math.PI);
        ctx.stroke();

        // 6. 白ヒゲ
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

// 2. キジトラねこ (ブラウンタビー・オリーブ目・広め白口元)
class KijitoraCatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT_KIJITORA', name: 'キジトラねこ', color: '#9c7344', shape: 'cat_kijitora', speedRatio: 1.08, size: 15, hp: 1,
            behavior: 'wave', behaviorConfig: { frequency: 0.35, amplitude: 2.3 }
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

        // 1. 横しっぽ
        ctx.strokeStyle = '#9c7344';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(156, 115, 68, 0.4)';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const tailSwing = Math.sin(this.tailAngle) * 6;
        const tailTipX = this.x + 20 + tailSwing;
        const tailTipY = this.y - 5 + Math.cos(this.tailAngle) * 4;

        ctx.moveTo(this.x + 10, this.y + 5);
        ctx.quadraticCurveTo(this.x + 20, this.y + 8, tailTipX, tailTipY);
        ctx.stroke();

        ctx.strokeStyle = '#3b2612';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(this.x + 14, this.y + 6); ctx.lineTo(this.x + 15, this.y + 2);
        ctx.moveTo(this.x + 18, this.y + 5); ctx.lineTo(this.x + 19, this.y + 1);
        ctx.stroke();

        // 2. 頭
        ctx.fillStyle = '#9c7344';
        ctx.shadowColor = 'rgba(156, 115, 68, 0.5)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 3. 口元白
        ctx.fillStyle = '#fbf9f2';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 6, 8.5, 6.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 4. 耳
        ctx.fillStyle = '#805b33';
        ctx.beginPath();
        ctx.moveTo(this.x - 14, this.y - 4);
        ctx.lineTo(this.x - 10, this.y - 18);
        ctx.lineTo(this.x - 2, this.y - 10);
        ctx.moveTo(this.x + 14, this.y - 4);
        ctx.lineTo(this.x + 10, this.y - 18);
        ctx.lineTo(this.x + 2, this.y - 10);
        ctx.fill();

        ctx.fillStyle = '#f2b3c4';
        ctx.beginPath();
        ctx.moveTo(this.x - 11, this.y - 6); ctx.lineTo(this.x - 9, this.y - 14); ctx.lineTo(this.x - 4, this.y - 9);
        ctx.moveTo(this.x + 11, this.y - 6); ctx.lineTo(this.x + 9, this.y - 14); ctx.lineTo(this.x + 4, this.y - 9);
        ctx.fill();

        // 5. タビーM字模様
        ctx.strokeStyle = '#38220f';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 13); ctx.lineTo(this.x, this.y - 7);
        ctx.moveTo(this.x - 4, this.y - 12); ctx.lineTo(this.x - 2, this.y - 7);
        ctx.moveTo(this.x + 4, this.y - 12); ctx.lineTo(this.x + 2, this.y - 7);
        ctx.moveTo(this.x - 9, this.y - 4); ctx.lineTo(this.x - 14, this.y - 2);
        ctx.moveTo(this.x + 9, this.y - 4); ctx.lineTo(this.x + 14, this.y - 2);
        ctx.stroke();

        // 6. オリーブ目
        ctx.fillStyle = '#b5ce5d';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 2.9, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 2.9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#141412';
        ctx.beginPath();
        ctx.ellipse(this.x - 5, this.y - 2, 1.1, 2.5, 0, 0, Math.PI * 2);
        ctx.ellipse(this.x + 5, this.y - 2, 1.1, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 3.2, 0.8, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 3.2, 0.8, 0, Math.PI * 2);
        ctx.fill();

        // 7. 鼻 & 口
        ctx.fillStyle = '#a85d43';
        ctx.beginPath();
        ctx.moveTo(this.x - 1.8, this.y + 1);
        ctx.lineTo(this.x + 1.8, this.y + 1);
        ctx.lineTo(this.x, this.y + 3.2);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#4a2c17';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x - 1.8, this.y + 4.2, 1.8, 0, Math.PI * 0.85);
        ctx.arc(this.x + 1.8, this.y + 4.2, 1.8, 0.15 * Math.PI, Math.PI);
        ctx.stroke();

        // 8. ヒゲ
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(this.x - 7, this.y + 3); ctx.lineTo(this.x - 18, this.y + 1);
        ctx.moveTo(this.x - 7, this.y + 4.5); ctx.lineTo(this.x - 18, this.y + 5.5);
        ctx.moveTo(this.x - 7, this.y + 6); ctx.lineTo(this.x - 17, this.y + 10);
        ctx.moveTo(this.x + 7, this.y + 3); ctx.lineTo(this.x + 18, this.y + 1);
        ctx.moveTo(this.x + 7, this.y + 4.5); ctx.lineTo(this.x + 18, this.y + 5.5);
        ctx.moveTo(this.x + 7, this.y + 6); ctx.lineTo(this.x + 17, this.y + 10);
        ctx.stroke();

        ctx.restore();
    }
}

// 3. ハチワレねこ (漆黒頭部・V字八の字ホワイト)
class HachiwareCatEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CAT_HACHIWARE', name: 'ハチワレねこ', color: '#16161c', shape: 'cat_hachiware', speedRatio: 1.05, size: 15, hp: 1,
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

        // 1. 横しっぽ
        ctx.strokeStyle = '#16161c';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(22, 22, 28, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const tailSwing = Math.sin(this.tailAngle) * 6;
        const tailTipX = this.x + 20 + tailSwing;
        const tailTipY = this.y - 5 + Math.cos(this.tailAngle) * 4;

        ctx.moveTo(this.x + 10, this.y + 5);
        ctx.quadraticCurveTo(this.x + 20, this.y + 8, tailTipX, tailTipY);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(tailTipX - 3, tailTipY + 1);
        ctx.lineTo(tailTipX, tailTipY);
        ctx.stroke();

        // 2. 漆黒頭部
        ctx.fillStyle = '#16161c';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 3. 耳
        ctx.fillStyle = '#16161c';
        ctx.beginPath();
        ctx.moveTo(this.x - 14, this.y - 4);
        ctx.lineTo(this.x - 10, this.y - 18);
        ctx.lineTo(this.x - 2, this.y - 10);
        ctx.moveTo(this.x + 14, this.y - 4);
        ctx.lineTo(this.x + 10, this.y - 18);
        ctx.lineTo(this.x + 2, this.y - 10);
        ctx.fill();

        ctx.fillStyle = '#f2a6b8';
        ctx.beginPath();
        ctx.moveTo(this.x - 11, this.y - 6); ctx.lineTo(this.x - 9, this.y - 14); ctx.lineTo(this.x - 4, this.y - 9);
        ctx.moveTo(this.x + 11, this.y - 6); ctx.lineTo(this.x + 9, this.y - 14); ctx.lineTo(this.x + 4, this.y - 9);
        ctx.fill();

        // 4. 八の字ホワイト
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 8);
        ctx.lineTo(this.x - 5, this.y - 2);
        ctx.lineTo(this.x - 10, this.y + 8);
        ctx.lineTo(this.x + 10, this.y + 8);
        ctx.lineTo(this.x + 5, this.y - 2);
        ctx.closePath();
        ctx.fill();

        // 5. 目
        ctx.fillStyle = '#b0ce57';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 2.8, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0a0b0e';
        ctx.beginPath();
        ctx.ellipse(this.x - 5, this.y - 2, 1.0, 2.4, 0, 0, Math.PI * 2);
        ctx.ellipse(this.x + 5, this.y - 2, 1.0, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x - 6, this.y - 3, 0.8, 0, Math.PI * 2);
        ctx.arc(this.x + 4, this.y - 3, 0.8, 0, Math.PI * 2);
        ctx.fill();

        // 6. 鼻 & 口
        ctx.fillStyle = '#e8788c';
        ctx.beginPath();
        ctx.moveTo(this.x - 1.8, this.y + 1);
        ctx.lineTo(this.x + 1.8, this.y + 1);
        ctx.lineTo(this.x, this.y + 3.2);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#2d2e38';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x - 1.8, this.y + 4.2, 1.8, 0, Math.PI * 0.85);
        ctx.arc(this.x + 1.8, this.y + 4.2, 1.8, 0.15 * Math.PI, Math.PI);
        ctx.stroke();

        // 7. ヒゲ
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(this.x - 8, this.y + 2); ctx.lineTo(this.x - 18, this.y);
        ctx.moveTo(this.x - 8, this.y + 4); ctx.lineTo(this.x - 18, this.y + 5);
        ctx.moveTo(this.x - 8, this.y + 6); ctx.lineTo(this.x - 17, this.y + 10);
        ctx.moveTo(this.x + 8, this.y + 2); ctx.lineTo(this.x + 18, this.y);
        ctx.moveTo(this.x + 8, this.y + 4); ctx.lineTo(this.x + 18, this.y + 5);
        ctx.moveTo(this.x + 8, this.y + 6); ctx.lineTo(this.x + 17, this.y + 10);
        ctx.stroke();

        ctx.restore();
    }
}
