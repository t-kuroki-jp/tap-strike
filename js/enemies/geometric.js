/**
 * サイバー幾何学ノーツ・モジュール一括定義 (Geometric Enemies Module)
 * 全10種類のネオン幾何学ノーツ（丸、三角、四角、稲妻、ひし形、L字ブーメラン、ゴースト、六角形、リング、五角形）
 */

// 1. ノーマル・チェイサー (赤・丸ノーツ / Straight)
class ChaserEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CHASER', name: 'チェイサー', color: '#ff3366', shape: 'circle', speedRatio: 1.0, size: 14, hp: 1,
            behavior: 'straight'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 2. ボルト・スピーダー (黄・稲妻ノーツ / Straight High-Speed)
class SpeederEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SPEEDER', name: 'スピーダー', color: '#ffff33', shape: 'bolt', speedRatio: 1.5, size: 16, hp: 1,
            behavior: 'straight'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.moveTo(this.x - 3, this.y - this.size);
        ctx.lineTo(this.x + 8, this.y - 2);
        ctx.lineTo(this.x + 1, this.y + 2);
        ctx.lineTo(this.x + 5, this.y + this.size);
        ctx.lineTo(this.x - 7, this.y + 1);
        ctx.lineTo(this.x - 1, this.y - 3);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

// 3. ファントム・グリッチ (紫・四角ノーツ / Glitch Slow-down)
class GlitchEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'GLITCH', name: 'ファントム・グリッチ', color: '#cc00ff', shape: 'square', speedRatio: 1.1, size: 14, hp: 1,
            behavior: 'glitch'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;

        ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        ctx.restore();
    }
}

// 4. スパイラル・スピナー (オレンジ・三角ノーツ / Spiral Curve)
class CurveEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CURVE', name: 'スピナー', color: '#ff9900', shape: 'triangle', speedRatio: 0.9, size: 15, hp: 1,
            behavior: 'spiral'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size * 1.2);
        ctx.lineTo(this.x + this.size, this.y + this.size * 0.8);
        ctx.lineTo(this.x - this.size, this.y + this.size * 0.8);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

// 5. サイン・ウェイバー (シアン・ひし形ノーツ / Wave)
class SineWaveEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SINE_WAVE', name: 'サイン・ウェイバー', color: '#00ffcc', shape: 'diamond', speedRatio: 1.0, size: 13, hp: 1,
            behavior: 'wave', behaviorConfig: { frequency: 0.25, amplitude: 2.8 }
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size * 1.3);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size * 1.3);
        ctx.lineTo(this.x - this.size, this.y);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

// 6. ブーメラン・クロス (ピンク・L字幾何学ノーツ ＋ 高速回転 / Boomerang)
class CrossEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CROSS', name: 'ブーメラン・クロス', color: '#ff0077', shape: 'boomerang', speedRatio: 0.95, size: 14, hp: 1,
            behavior: 'boomerang'
        });
        this.rotationAngle = Math.random() * Math.PI * 2;
    }

    update(playerTargetRadius) {
        const dist = super.update(playerTargetRadius);
        this.rotationAngle += 0.22;
        return dist;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotationAngle);

        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 14;

        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(-s, -s);
        ctx.lineTo(0, -s);
        ctx.lineTo(0, 0);
        ctx.lineTo(s, 0);
        ctx.lineTo(s, s);
        ctx.lineTo(-s, s);
        ctx.closePath();
        
        ctx.fill();
        ctx.restore();
    }
}

// 7. ステルス・ゴースト (ライム・円輪郭ノーツ / Stealth)
class GhostEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'GHOST', name: 'ステルス・ゴースト', color: '#aaff66', shape: 'ghost', speedRatio: 1.0, size: 13, hp: 1,
            behavior: 'stealth'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 8. フリーズ・ヘキサ (シアン・六角形ノーツ / Freeze)
class HexagonEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'HEXAGON', name: 'フリーズ・ヘキサ', color: '#00ccff', shape: 'hexagon', speedRatio: 0.95, size: 14, hp: 1,
            behavior: 'freeze'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = this.x + Math.cos(angle) * this.size;
            const py = this.y + Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// 9. オービット・リング (黄色・円環リングノーツ / Orbit)
class RingEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'RING_NOTE', name: 'オービット・リング', color: '#ffea00', shape: 'ring', speedRatio: 0.9, size: 14, hp: 1,
            behavior: 'orbit'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

// 10. バウンド・ペンタ (グリーン・五角形ノーツ / Bound)
class PentagonEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'PENTAGON', name: 'バウンド・ペンタ', color: '#00ff66', shape: 'pentagon', speedRatio: 0.9, size: 14, hp: 1,
            behavior: 'bound'
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
            const px = this.x + Math.cos(angle) * this.size;
            const py = this.y + Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}
