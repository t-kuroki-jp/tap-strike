/**
 * 桜の花びらエネミー (SakuraPetalEnemy extends Enemy)
 * 上部からひらひら舞い降りてきて、ヒットすると画面下部でパッと満開の桜が咲き誇る！
 */
class SakuraPetalEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SAKURA_PETAL',
            name: '桜の花びら',
            color: '#ffb7c5',
            shape: 'sakura_petal',
            speedRatio: 0.85,
            size: 18,
            hp: 1,
            behavior: 'straight'
        });

        // 画面上部・上左右のエッジ（絶対画面上半分）からランダム出現
        const side = Math.floor(Math.random() * 3); // 0: 真上, 1: 左上, 2: 右上
        if (side === 0) {
            this.x = Math.random() * canvas.width;
            this.y = -30;
        } else if (side === 1) {
            this.x = -30;
            this.y = Math.random() * (canvas.height * 0.4);
        } else {
            this.x = canvas.width + 30;
            this.y = Math.random() * (canvas.height * 0.4);
        }

        // 画面中央（判定リング）へ向かう正確な方向ベクトルと速度を設定
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dist = Math.hypot(centerX - this.x, centerY - this.y) || 1;
        this.dirX = (centerX - this.x) / dist;
        this.dirY = (centerY - this.y) / dist;
        this.speed = (gameSpeed || 1.0) * 0.85 * 3.2;

        this.flutterPhase = Math.random() * Math.PI * 2;
        this.flutterSpeed = 0.08 + Math.random() * 0.04;
        this.prevDist = 9999;
    }

    update(playerTargetRadius) {
        // ひらひら風に舞う横揺れ成分
        this.flutterPhase += this.flutterSpeed;
        const flutterOffset = Math.sin(this.flutterPhase) * 2.2;
        const perpX = -this.dirY * flutterOffset;
        const perpY = this.dirX * flutterOffset;

        // 中央の判定リングに向かって接近
        this.x += (this.dirX * this.speed) + perpX;
        this.y += (this.dirY * this.speed) + perpY;

        // 中心（判定円）との現在の距離
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const dist = Math.hypot(centerX - this.x, centerY - this.y);

        // ★ 中心を突き抜けた(直前距離より開いた)瞬間、または中心至近距離で確実に中心到達判定(0)を返す！
        if (dist < 15 || (this.prevDist < 50 && dist > this.prevDist)) {
            this.prevDist = dist;
            return 0; // 確実に中心で吸収消滅！
        }

        this.prevDist = dist;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // 画面中央（判定リング）へ向かう向き合わせ ＋ ひらひら風の揺れ
        const angle = Math.atan2(this.dirY, this.dirX);
        const flutterRotation = Math.sin(this.flutterPhase) * 0.4;
        ctx.rotate(angle + Math.PI / 2 + flutterRotation);

        // 桜の花びらハート風グラフィック
        ctx.shadowColor = '#ff6699';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffb7c5';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.8, this.size, 0, 0, this.size * 1.1);
        ctx.bezierCurveTo(-this.size, 0, -this.size * 0.8, -this.size * 0.8, 0, -this.size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 花びら中央のピンク筋
        ctx.strokeStyle = '#ff6699';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.6);
        ctx.lineTo(0, this.size * 0.6);
        ctx.stroke();

        ctx.restore();
        this.drawShieldLayer(ctx);
    }

    playSakuraSound() {
        if (typeof audioEngine !== 'undefined' && audioEngine.audioCtx) {
            audioEngine.playTone({ type: 'sine', startFreq: 880, endFreq: 1760, duration: 0.25, volume: 0.35 });
        }
    }

    onHit(game, touchX, touchY, isPerfect) {
        super.onHit(game, touchX, touchY, isPerfect);
        this.playSakuraSound();

        // ★ 1回のヒットで画面下部のランダム 3〜4 箇所に一気に満開の桜が咲き乱れる！(通常: 3個, PERFECT: 4個!)
        const bloomCount = isPerfect ? 4 : 3;
        for (let b = 0; b < bloomCount; b++) {
            const bloomX = Math.random() * (game.canvas.width * 0.8) + (game.canvas.width * 0.1);
            const bloomY = game.canvas.height * 0.65 + Math.random() * (game.canvas.height * 0.25);
            game.particles.push(new RealSakuraBloom(bloomX, bloomY));
        }
        return true;
    }
}

/**
 * 画面下部でパッと美しく咲き誇る「リアル満開桜」オリジナルエフェクト
 */
class RealSakuraBloom {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.scale = 0.2;
        this.maxScale = 1.0 + Math.random() * 0.3;
        this.alpha = 1.0;
        this.rotation = (Math.random() - 0.5) * 0.4;
        this.petals = [];

        // 満開桜の花びらクラスタ
        const clusterCount = 12;
        for (let i = 0; i < clusterCount; i++) {
            const angle = (i / clusterCount) * Math.PI * 2;
            const dist = 8 + Math.random() * 16;
            this.petals.push({
                cx: Math.cos(angle) * dist,
                cy: Math.sin(angle) * dist,
                r: 7 + Math.random() * 6,
                color: i % 3 === 0 ? '#ffffff' : (i % 3 === 1 ? '#ffb7c5' : '#ff6699')
            });
        }
    }

    update() {
        // ふわっと開花
        if (this.scale < this.maxScale) {
            this.scale += (this.maxScale - this.scale) * 0.18;
        }
        // じんわりフェードアウト
        this.alpha -= 0.015;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = Math.max(0, this.alpha);

        // 1. 和風のしなやかな桜の小枝
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 3.0;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.quadraticCurveTo(-4, 6, 0, -5);
        ctx.stroke();

        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.lineTo(12, -8);
        ctx.moveTo(0, 0);
        ctx.lineTo(-10, -10);
        ctx.stroke();

        // 2. モコモコ立体的に咲き誇る八重桜の満開クラスタ
        ctx.shadowColor = '#ff3388';
        ctx.shadowBlur = 12;

        this.petals.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.cx, p.cy - 10, p.r, 0, Math.PI * 2);
            ctx.fill();
        });

        // 3. 中央の可憐な桜めしべ
        ctx.fillStyle = '#ffe600';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 6;
        for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(Math.cos(a) * 4, -10 + Math.sin(a) * 4, 1.8, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
