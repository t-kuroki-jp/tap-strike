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

// 🪃 6. ブーメラン・フェイント Behavior (一度スムーズ退避してから爆速突入)
class BoomerangBehavior extends Behavior {
    constructor(config = {}) {
        super();
        this.phase = 0; // 0: 接近中, 1: 退避中, 2: 最終突撃中
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

        // フェーズ0: 境界線に達したら退避フェーズ(1)へ移行
        if (this.phase === 0) {
            if (dist < playerTargetRadius + this.triggerDist) {
                this.phase = 1;
            }
        }

        if (this.phase === 1) {
            // フェーズ1: スムーズに外へ引き返す
            this.retreatTimer++;
            enemy.x -= (dx / dist) * (enemy.speed * 1.2);
            enemy.y -= (dy / dist) * (enemy.speed * 1.2);
            if (this.retreatTimer >= 16) {
                this.phase = 2; // 引き返し完了！
            }
        } else if (this.phase === 2) {
            // フェーズ2: 引き返した後は倍速突入！
            enemy.x += (dx / dist) * (enemy.speed * 2.0);
            enemy.y += (dy / dist) * (enemy.speed * 2.0);
        } else {
            // フェーズ0 (通常接近)
            enemy.x += (dx / dist) * enemy.speed;
            enemy.y += (dy / dist) * enemy.speed;
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

// 🧲 9. オービット公転 Behavior (画面外から大きな円弧を描いて優雅に中心へ接近する大円弧公転)
class OrbitAttractBehavior extends Behavior {
    constructor(config = {}) {
        super();
        this.angle = undefined;
        this.currentRadius = undefined;
        this.spiralSpeed = config.spiralSpeed || 0.038; // 優雅な大円弧旋回スピード
    }

    update(enemy, playerTargetRadius) {
        const centerX = enemy.canvas.width / 2;
        const centerY = enemy.canvas.height / 2;

        // 初回発生時に初期角度と画面外からの初期半径を自動設定
        if (this.angle === undefined) {
            const dx = enemy.x - centerX;
            const dy = enemy.y - centerY;
            this.angle = Math.atan2(dy, dx);
            this.currentRadius = Math.hypot(dx, dy);
        }

        // 1. 大きな円弧を描いて旋回を進める
        this.angle += this.spiralSpeed;

        // 2. 半径を中心（0）に向かって滑らかに縮める（大円弧で近づく）
        this.currentRadius -= enemy.speed * 0.9;

        if (this.currentRadius < 0) this.currentRadius = 0;

        // 3. 大円弧を描く連続座標計算
        enemy.x = centerX + Math.cos(this.angle) * this.currentRadius;
        enemy.y = centerY + Math.sin(this.angle) * this.currentRadius;

        return this.currentRadius;
    }
}

// 🦘 10. バウンド・反射 Behavior (判定リング手前で1回だけカクッと跳ねて屈折バウンド)
class BoundBehavior extends Behavior {
    constructor(config = {}) {
        super();
        this.bounced = false;
        this.bounceDist = config.bounceDist || 130;
    }

    update(enemy, playerTargetRadius) {
        const centerX = enemy.canvas.width / 2;
        const centerY = enemy.canvas.height / 2;
        const dx = centerX - enemy.x;
        const dy = centerY - enemy.y;
        const dist = Math.hypot(dx, dy);

        if (dist === 0) return 0;

        // 判定の手前に近づいたら1回だけ壁跳ね（屈折バウンド）発動！
        if (!this.bounced && dist < playerTargetRadius + this.bounceDist) {
            this.bounced = true;
            const side = (Math.random() < 0.5 ? 1 : -1);
            const perpX = -dy / dist;
            const perpY = dx / dist;
            enemy.x += perpX * 45 * side;
            enemy.y += perpY * 45 * side;
        }

        // バウンド後は急加速で中心へ突入！
        const mult = this.bounced ? 1.6 : 1.0;
        enemy.x += (dx / dist) * (enemy.speed * mult);
        enemy.y += (dy / dist) * (enemy.speed * mult);

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
