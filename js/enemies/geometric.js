/**
 * サイバー幾何学ノーツ・統合モジュール (Geometric Enemies Module)
 * 全10種類の純粋サイバーネオン幾何学ノーツの描画・ロジック一括集約
 */

// 1. チェイサー (赤・ソリッド真円ノーツ / Straight)
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
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        this.drawShieldLayer(ctx);
    }
}
class SpeederEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SPEEDER', name: 'スピーダー', color: '#ffff33', shape: 'star', speedRatio: 1.45, size: 14, hp: 1,
            behavior: 'straight'
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;

        // ネオンイエローの疾走感のある5角星グラフィック
        const s = this.size * 1.1;
        const innerRadius = s * 0.45;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const outerAngle = (i * 72 - 90) * Math.PI / 180;
            const innerAngle = ((i * 72 + 36) - 90) * Math.PI / 180;

            if (i === 0) {
                ctx.moveTo(Math.cos(outerAngle) * s, Math.sin(outerAngle) * s);
            } else {
                ctx.lineTo(Math.cos(outerAngle) * s, Math.sin(outerAngle) * s);
            }
            ctx.lineTo(Math.cos(innerAngle) * innerRadius, Math.sin(innerAngle) * innerRadius);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
        this.drawShieldLayer(ctx);
    }
}

// 3. ファントム・グリッチ (紫・正方形ノーツ / Glitch)
class GlitchEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'GLITCH', name: 'ファントム・グリッチ', color: '#cc00ff', shape: 'square', speedRatio: 1.0, size: 14, hp: 1,
            behavior: 'glitch', behaviorConfig: { slowDownMax: 95, slowDownMin: 35, slowDownRatio: 0.55 }
        });
    }

    draw(ctx) {
        ctx.save();
        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        ctx.restore();
        this.drawShieldLayer(ctx);
    }
}

// 4. スピナー (オレンジ・三角形ノーツ / Spiral)
class CurveEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CURVE', name: 'スピナー', color: '#ff9900', shape: 'triangle', speedRatio: 0.95, size: 14, hp: 1,
            behavior: 'spiral'
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;

        const s = this.size * 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.866, s * 0.5);
        ctx.lineTo(-s * 0.866, s * 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

// 5. サイン・ウェイバー (シアン・ひし形ノーツ / Wave)
class SineWaveEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SINE_WAVE', name: 'サイン・ウェイバー', color: '#00ffcc', shape: 'diamond', speedRatio: 1.0, size: 14, hp: 1,
            behavior: 'wave', behaviorConfig: { frequency: 0.035, amplitude: 4.5 }
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

// 6. ブーメラン・クロス (シックな木調ブラウン・L字幾何学ノーツ / Boomerang)
class CrossEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CROSS', name: 'ブーメラン・クロス', color: '#d2691e', shape: 'boomerang', speedRatio: 0.95, size: 14, hp: 1,
            behavior: 'boomerang'
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

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

// 7. ステルス・クロス (ライム・4角手裏剣スターノーツ / Stealth)
class GhostEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'GHOST', name: 'ステルス・クロス', color: '#aaff66', shape: 'shuriken', speedRatio: 1.0, size: 14, hp: 1,
            behavior: 'stealth'
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;

        const rOuter = this.size * 1.25;
        const rInner = this.size * 0.45;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const r = (i % 2 === 0) ? rOuter : rInner;
            const angle = (Math.PI / 4) * i;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

// 8. フリーズ・ヘキサ (水色・正六角形ノーツ / Freeze)
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

// 9. オービット・オクタ (ディープインディゴ・正八角形幾何学ノーツ / Orbit)
class RingEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'RING_NOTE', name: 'オービット・オクタ', color: '#3355ff', shape: 'octagon', speedRatio: 0.9, size: 14, hp: 1,
            behavior: 'orbit'
        });
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.alpha !== undefined) ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;

        // 重厚で美しく見やすいネオン正八角形 (Octagon)
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI / 4) * i + (Math.PI / 8);
            const px = Math.cos(angle) * this.size * 1.1;
            const py = Math.sin(angle) * this.size * 1.1;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
        this.drawShieldLayer(ctx);
    }
}

// 10. バウンド・ペンタ (グリーン・正五角形ノーツ / Bound)
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
