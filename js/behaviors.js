/**
 * エネミー行動ロジック (Behavior Components)
 * 移動・物理計算と見た目(Visual)を完全分離するコンポーネントシステム
 */

// 1. 行動基底クラス
class Behavior {
    update(enemy, playerTargetRadius) {
        return 0;
    }
}

// 2. 直線移動 Behavior (まっすぐ中心へ向かって進む)
class StraightBehavior extends Behavior {
    update(enemy, playerTargetRadius) {
        const centerX = enemy.canvas.width / 2;
        const centerY = enemy.canvas.height / 2;
        const dx = centerX - enemy.x;
        const dy = centerY - enemy.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;

        return dist;
    }
}

// 3. 波状・トコトコ歩行 Behavior (垂直方向にサイン波で揺れながら進む)
class WaveBehavior extends Behavior {
    constructor(config = {}) {
        super();
        this.frequency = config.frequency || 0.35; // 揺れピッチ
        this.amplitude = config.amplitude || 2.2;  // 揺れ幅
    }

    update(enemy, playerTargetRadius) {
        const centerX = enemy.canvas.width / 2;
        const centerY = enemy.canvas.height / 2;
        const dx = centerX - enemy.x;
        const dy = centerY - enemy.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        const perpX = -dy / dist;
        const perpY = dx / dist;
        const step = Math.sin(dist * this.frequency) * this.amplitude;

        enemy.x += (dx / dist) * enemy.speed + perpX * step;
        enemy.y += (dy / dist) * enemy.speed + perpY * step;

        return dist;
    }
}

// 4. 渦巻き・公転 Behavior (中心の周りを円を描きながら吸い込まれる)
class SpiralBehavior extends Behavior {
    constructor(config = {}) {
        super();
        this.orbitFrequency = config.orbitFrequency || 0.05;
        this.orbitRadius = config.orbitRadius || 4.0;
    }

    update(enemy, playerTargetRadius) {
        const centerX = enemy.canvas.width / 2;
        const centerY = enemy.canvas.height / 2;
        const dx = centerX - enemy.x;
        const dy = centerY - enemy.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        const perpX = -dy / dist;
        const perpY = dx / dist;
        const orbit = Math.sin(dist * this.orbitFrequency) * this.orbitRadius;

        enemy.x += (dx / dist) * enemy.speed + perpX * orbit;
        enemy.y += (dy / dist) * enemy.speed + perpY * orbit;

        return dist;
    }
}

// 5. 直前減速 Behavior (判定リング直前で減速)
class GlitchBehavior extends Behavior {
    constructor(config = {}) {
        super();
        this.slowDownMin = config.slowDownMin || 15;
        this.slowDownMax = config.slowDownMax || 60;
        this.slowDownRatio = config.slowDownRatio || 0.3;
    }

    update(enemy, playerTargetRadius) {
        const centerX = enemy.canvas.width / 2;
        const centerY = enemy.canvas.height / 2;
        const dx = centerX - enemy.x;
        const dy = centerY - enemy.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        let currentSpeed = enemy.speed;
        if (dist < playerTargetRadius + this.slowDownMax && dist > playerTargetRadius + this.slowDownMin) {
            currentSpeed *= this.slowDownRatio;
        }

        enemy.x += (dx / dist) * currentSpeed;
        enemy.y += (dy / dist) * currentSpeed;
        return dist;
    }
}

// 🪃 6. ブーメラン・フェイント Behavior (一度退避してから爆速突入)
class BoomerangBehavior extends Behavior {
    constructor(config = {}) {
        super();
        this.retreated = false;
        this.retreatTimer = 0;
        this.triggerDist = config.triggerDist || 110;
    }

    update(enemy, playerTargetRadius) {
        const centerX = enemy.canvas.width / 2;
        const centerY = enemy.canvas.height / 2;
        const dx = centerX - enemy.x;
        const dy = centerY - enemy.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        if (!this.retreated && dist < playerTargetRadius + this.triggerDist) {
            this.retreatTimer++;
            // 後退（戻る）
            enemy.x -= (dx / dist) * (enemy.speed * 1.4);
            enemy.y -= (dy / dist) * (enemy.speed * 1.4);

            if (this.retreatTimer > 18) {
                this.retreated = true;
            }
        } else {
            // 一度引き返した後は倍速突入！
            const mult = this.retreated ? 2.2 : 1.0;
            enemy.x += (dx / dist) * (enemy.speed * mult);
            enemy.y += (dy / dist) * (enemy.speed * mult);
        }

        return Math.hypot(centerX - enemy.x, centerY - enemy.y);
    }
}

// 🥷 7. ステルス・隠密 Behavior (途中で透明化し目の前で実体化)
class StealthBehavior extends Behavior {
    constructor(config = {}) {
        super();
        this.revealDist = config.revealDist || 75;
        this.hideDist = config.hideDist || 200;
    }

    update(enemy, playerTargetRadius) {
        const centerX = enemy.canvas.width / 2;
        const centerY = enemy.canvas.height / 2;
        const dx = centerX - enemy.x;
        const dy = centerY - enemy.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        // 透明度の制御 (alpha)
        if (dist < playerTargetRadius + this.hideDist && dist > playerTargetRadius + this.revealDist) {
            enemy.alpha = 0.08; // ほぼ透明！
        } else {
            enemy.alpha = 1.0;  // 目の前でくっきり出現！
        }

        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;

        return dist;
    }
}

// ⏸️ 8. フリーズ・だるまさんが転んだ Behavior (手前で完全停止してから突入)
class FreezeBehavior extends Behavior {
    constructor(config = {}) {
        super();
        this.frozen = false;
        this.freezeTimer = 0;
        this.freezeDuration = config.freezeDuration || 45; // 約0.75秒停止
        this.triggerDist = config.triggerDist || 90;
    }

    update(enemy, playerTargetRadius) {
        const centerX = enemy.canvas.width / 2;
        const centerY = enemy.canvas.height / 2;
        const dx = centerX - enemy.x;
        const dy = centerY - enemy.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        if (!this.frozen && dist < playerTargetRadius + this.triggerDist) {
            this.freezeTimer++;
            if (this.freezeTimer >= this.freezeDuration) {
                this.frozen = true;
            }
            // 停止中！(移動しない)
            return dist;
        }

        // 解除後はロケットダッシュ！
        const mult = this.frozen ? 2.0 : 1.0;
        enemy.x += (dx / dist) * (enemy.speed * mult);
        enemy.y += (dy / dist) * (enemy.speed * mult);

        return Math.hypot(centerX - enemy.x, centerY - enemy.y);
    }
}

// 🧲 9. オービット公転 Behavior (リング周りを360度周回してから中心へ)
class OrbitAttractBehavior extends Behavior {
    constructor(config = {}) {
        super();
        this.angle = Math.random() * Math.PI * 2;
        this.orbitCompleted = false;
        this.orbitDegrees = 0;
    }

    update(enemy, playerTargetRadius) {
        const centerX = enemy.canvas.width / 2;
        const centerY = enemy.canvas.height / 2;
        const dx = centerX - enemy.x;
        const dy = centerY - enemy.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        const targetOrbitRadius = playerTargetRadius + 70;

        if (!this.orbitCompleted && Math.abs(dist - targetOrbitRadius) < 25) {
            // 周回運動！
            this.orbitDegrees += 0.12;
            this.angle += 0.12;
            enemy.x = centerX + Math.cos(this.angle) * targetOrbitRadius;
            enemy.y = centerY + Math.sin(this.angle) * targetOrbitRadius;

            if (this.orbitDegrees >= Math.PI * 1.8) {
                this.orbitCompleted = true;
            }
            return targetOrbitRadius;
        }

        // 通常移動 & 周回後の突入
        const mult = this.orbitCompleted ? 1.8 : 1.0;
        enemy.x += (dx / dist) * (enemy.speed * mult);
        enemy.y += (dy / dist) * (enemy.speed * mult);

        return dist;
    }
}

// 🦘 10. バウンド・反射 Behavior (画面枠で跳ねてから入る)
class BoundBehavior extends Behavior {
    constructor(config = {}) {
        super();
        this.bounced = false;
        this.vx = null;
        this.vy = null;
    }

    update(enemy, playerTargetRadius) {
        const centerX = enemy.canvas.width / 2;
        const centerY = enemy.canvas.height / 2;

        if (this.vx === null) {
            const dx = centerX - enemy.x;
            const dy = centerY - enemy.y;
            const dist = Math.hypot(dx, dy);
            this.vx = (dx / dist) * enemy.speed * 1.3;
            this.vy = (dy / dist) * enemy.speed * 1.3;
        }

        enemy.x += this.vx;
        enemy.y += this.vy;

        // 端で1回だけバウンド！
        if (!this.bounced) {
            if (enemy.x < 15 || enemy.x > enemy.canvas.width - 15) {
                this.vx *= -1;
                this.bounced = true;
            }
            if (enemy.y < 15 || enemy.y > enemy.canvas.height - 15) {
                this.vy *= -1;
                this.bounced = true;
            }
        } else {
            // バウンド後は中心へ向かう補正
            const dx = centerX - enemy.x;
            const dy = centerY - enemy.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 0) {
                enemy.x += (dx / dist) * (enemy.speed * 0.8);
                enemy.y += (dy / dist) * (enemy.speed * 0.8);
            }
        }

        return Math.hypot(centerX - enemy.x, centerY - enemy.y);
    }
}

// 11. 行動ファクトリー (文字列 ID から Behavior を自動生成)
class BehaviorFactory {
    static create(type, config = {}) {
        if (!type) return new StraightBehavior();
        
        const key = type.toLowerCase();
        switch (key) {
            case 'wave':
                return new WaveBehavior(config);
            case 'spiral':
                return new SpiralBehavior(config);
            case 'glitch':
                return new GlitchBehavior(config);
            case 'boomerang':
                return new BoomerangBehavior(config);
            case 'stealth':
                return new StealthBehavior(config);
            case 'freeze':
                return new FreezeBehavior(config);
            case 'orbit':
                return new OrbitAttractBehavior(config);
            case 'bound':
                return new BoundBehavior(config);
            case 'straight':
            default:
                return new StraightBehavior();
        }
    }
}
