/**
 * タップストライク メインゲームエンジン
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.score = 0;
        this.combo = 0;
        this.isGameOver = false;
        this.isGameStarted = false;
        this.enemies = [];
        this.particles = [];
        this.shockwaves = [];
        this.gameSpeed = 1.0;

        this.ringPulse = 0;
        this.ringColor = '#00f0ff';

        this.lastTapTime = 0;
        this.missPenaltyTimer = 0;
        this.beatPulse = 0;
        this.bgmStep = 0;
        this.bgmInterval = null;

        this.currentVariation = null;
        this.params = {};

        this.player = {
            x: 0,
            y: 0,
            radius: 20,
            targetRadius: 60,
            hp: 1,
            maxHp: 1,
            color: '#00f0ff'
        };

        this.initEventListeners();
        this.resize();
    }

    initEventListeners() {
        window.addEventListener('resize', () => this.resize());

        const isUIElement = (target) => {
            if (!target) return false;
            const el = target.closest ? target : target.parentElement;
            if (!el || !el.closest) return false;
            return !!(
                el.closest('.btn-mode') ||
                el.closest('.btn-action') ||
                el.closest('.btn-back') ||
                el.closest('.var-card') ||
                el.closest('#start-screen') ||
                el.closest('#game-over')
            );
        };

        window.addEventListener('touchstart', (e) => {
            if (this.isGameStarted && !this.isGameOver && !isUIElement(e.target)) {
                if (e.cancelable) e.preventDefault();
                this.handleInput(e);
            }
        }, { passive: false });

        window.addEventListener('mousedown', (e) => {
            if (this.isGameStarted && !this.isGameOver && !isUIElement(e.target)) {
                this.handleInput(e);
            }
        });
    }

    resize() {
        this.canvas.width = Math.min(window.innerWidth, 500);
        this.canvas.height = window.innerHeight;
    }

    async startApp() {
        await dataLoader.loadAll();
        this.showStartScreen();
        this.updateUI();
    }

    showStartScreen() {
        audioEngine.init();
        this.isGameStarted = false;
        this.isGameOver = false;
        this.stopBGM();
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
        document.getElementById('mode-select-view').style.display = 'block';
        document.getElementById('variation-select-view').style.display = 'none';
    }

    backToModeSelect() {
        audioEngine.init();
        document.getElementById('start-screen').style.display = 'block';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('mode-select-view').style.display = 'block';
        document.getElementById('variation-select-view').style.display = 'none';
    }

    reselectVariation() {
        audioEngine.init();
        this.isGameStarted = false;
        this.isGameOver = false;
        this.stopBGM();
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
        const lastDiff = this.currentVariation?.difficulty || 'EASY';
        this.openVariationMenu(lastDiff);
    }

    async openVariationMenu(diff) {
        audioEngine.init();
        document.getElementById('start-screen').style.display = 'block';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('mode-select-view').style.display = 'none';
        document.getElementById('variation-select-view').style.display = 'block';

        const diffDef = dataLoader.difficultiesMaster[diff] || {};
        const titleElem = document.getElementById('selected-mode-title');
        if (titleElem) {
            titleElem.innerText = `${diffDef.name || diff} モード`;
            titleElem.className = `diff-title diff-${diff}`;
        }

        if (!dataLoader.isLoaded || dataLoader.variations.length === 0) {
            document.getElementById('variation-list').innerHTML = '<div class="loading-text">バリエーション読込中...</div>';
            await dataLoader.loadAll();
        }

        this.renderVariationMenu(diff);
    }

    renderVariationMenu(diff) {
        const container = document.getElementById('variation-list');
        container.innerHTML = '';

        const items = dataLoader.variations.filter(v => v.difficulty === diff);
        if (items.length === 0) {
            container.innerHTML = '<div class="loading-text" style="color:#aaa;">このモードのバリエーションはまだありません</div>';
            return;
        }

        // 日付の降順（新しい順）に並び替え
        items.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

        items.forEach(v => {
            const card = document.createElement('div');
            card.className = 'var-card';
            const best = localStorage.getItem(`bestScore_${v.id}`) || 0;
            const resolved = dataLoader.getResolvedParams(v);
            const dateStr = v.updatedAt || v.createdAt || '';

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="var-name">${v.name}</span>
                    ${dateStr ? `<span style="font-size:10px; color:#888;">📅 ${dateStr}</span>` : ''}
                </div>
                <div class="var-desc">${v.description || ''}</div>
                <div class="var-stats">
                    <span>❤️ HP: ${resolved.maxHp} | ⭕ リング径: ${resolved.targetRadius}</span>
                    <span class="var-score">🏆 BEST: ${best}</span>
                </div>
            `;

            let handled = false;
            const trigger = (e) => {
                if (e && e.stopPropagation) e.stopPropagation();
                if (handled) return;
                handled = true;
                setTimeout(() => { handled = false; }, 300);
                this.startGameWithVariation(v);
            };

            card.ontouchend = (e) => {
                if (e.cancelable) e.preventDefault();
                trigger(e);
            };
            card.onclick = (e) => {
                trigger(e);
            };

            container.appendChild(card);
        });
    }

    startGameWithVariation(variation) {
        audioEngine.init();
        this.currentVariation = variation;
        this.params = dataLoader.getResolvedParams(variation);
        this.applyTheme(variation.theme);

        this.isGameStarted = true;
        document.getElementById('start-screen').style.display = 'none';
        this.resetGame();
    }

    applyTheme(theme) {
        if (!theme) return;
        const bgElem = document.querySelector('.bg-animated');
        if (bgElem) {
            bgElem.style.background = `
                radial-gradient(circle, ${theme.bgGlow || 'rgba(0, 240, 255, 0.25)'} 0%, rgba(5, 7, 14, 0.9) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 39px, ${theme.gridColor || 'rgba(0, 240, 255, 0.3)'} 40px),
                repeating-linear-gradient(90deg, transparent, transparent 39px, ${theme.gridColor || 'rgba(0, 240, 255, 0.3)'} 40px)
            `;
        }
        this.ringColor = theme.ringColor || '#00f0ff';
        this.player.color = theme.playerColor || '#00f0ff';
        document.documentElement.style.setProperty('--bg-scroll-speed', this.params.bgScrollSpeed);
    }

    showStartScreen() {
        this.isGameStarted = false;
        this.stopBGM();
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
        this.renderVariationMenu();
    }

    resetGame() {
        this.score = 0;
        this.combo = 0;
        this.gameSpeed = 1.0;
        this.enemies = [];
        this.particles = [];
        this.shockwaves = [];
        this.ringPulse = 0;
        this.missPenaltyTimer = 0;
        this.lastTapTime = 0;
        this.isGameOver = false;

        this.params = dataLoader.getResolvedParams(this.currentVariation);
        this.player.targetRadius = this.params.targetRadius;
        this.player.maxHp = this.params.maxHp;
        this.player.hp = this.params.maxHp;
        this.ringColor = this.currentVariation?.theme?.ringColor || '#00f0ff';

        document.getElementById('game-over').style.display = 'none';
        this.startBGM();
        this.updateUI();
        requestAnimationFrame(() => this.gameLoop());
    }

    startBGM() {
        this.stopBGM();

        if (this.currentVariation && this.currentVariation.bgm) {
            audioEngine.startBGM(this.currentVariation.bgm);
        }

        this.bgmStep = 0;
        const spawnInterval = this.currentVariation?.spawnRate || 187;

        this.bgmInterval = setInterval(() => {
            if (this.isGameOver || !this.isGameStarted) return;
            this.beatPulse = 5;

            if (this.bgmStep % 2 === 0 && Math.random() > 0.3) {
                this.enemies.push(new Enemy(this.canvas, this.gameSpeed, this.currentVariation, dataLoader.enemiesMaster));
            }

            this.bgmStep++;
        }, spawnInterval);
    }

    stopBGM() {
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
        audioEngine.stopBGM();
    }

    handleInput(e) {
        if (!this.isGameStarted || this.isGameOver) return;
        if (e && e.cancelable && e.preventDefault) e.preventDefault();

        const now = Date.now();
        if (now - this.lastTapTime < this.params.tapCooldown || this.missPenaltyTimer > 0) return;
        this.lastTapTime = now;

        const rect = this.canvas.getBoundingClientRect();
        let touchX = this.canvas.width / 2;
        let touchY = this.canvas.height / 2;

        if (e.touches && e.touches.length > 0) {
            touchX = e.touches[0].clientX - rect.left;
            touchY = e.touches[0].clientY - rect.top;
        } else if (e.clientX !== undefined) {
            touchX = e.clientX - rect.left;
            touchY = e.clientY - rect.top;
        }

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        let hit = false;

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const dist = Math.hypot(centerX - enemy.x, centerY - enemy.y);

            if (Math.abs(dist - this.player.targetRadius) < this.params.hitWindow) {
                hit = true;
                this.createParticles(enemy.x, enemy.y, enemy.color);
                this.enemies.splice(i, 1);
                this.combo++;
                this.score += this.params.baseScore * this.combo;
                this.gameSpeed += this.params.speedIncrement;
                break;
            }
        }

        if (hit) {
            audioEngine.playHitSound();
            this.ringPulse = 15;
            this.ringColor = this.currentVariation?.theme?.ringColor || '#00f0ff';
            this.shockwaves.push(new Shockwave(touchX, touchY, this.ringColor));
        } else {
            audioEngine.playMissSound();
            this.combo = 0;
            this.ringPulse = 8;
            this.ringColor = '#ff0055';
            this.missPenaltyTimer = this.params.missPenaltyDuration;
            this.shockwaves.push(new Shockwave(touchX, touchY, '#ff0055'));
        }

        this.updateUI();
    }

    createParticles(x, y, color) {
        const count = this.params.particleCount || 12;
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    updateUI() {
        document.getElementById('score').innerText = `SCORE: ${this.score}`;
        document.getElementById('combo').innerText = `COMBO: ${this.combo}x`;
        const hpStr = '❤️'.repeat(Math.max(0, this.player.hp));
        document.getElementById('hp').innerText = hpStr || '💀';
    }

    gameOver() {
        this.isGameOver = true;
        this.stopBGM();
        audioEngine.playGameOverSound();

        let noticeText = '';
        if (this.currentVariation) {
            const storageKey = `bestScore_${this.currentVariation.id}`;
            const prevBest = parseInt(localStorage.getItem(storageKey) || '0', 10);
            if (this.score > prevBest) {
                localStorage.setItem(storageKey, this.score.toString());
                noticeText = '🎉 NEW RECORD!';
            } else {
                noticeText = `BEST SCORE: ${prevBest}`;
            }
        }

        document.getElementById('final-score').innerText = `SCORE: ${this.score} (${this.currentVariation ? this.currentVariation.name : ''})`;
        document.getElementById('high-score-notice').innerText = noticeText;
        document.getElementById('game-over').style.display = 'block';
    }

    gameLoop() {
        if (!this.isGameStarted || this.isGameOver) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        if (this.beatPulse > 0) this.beatPulse *= 0.85;

        if (this.missPenaltyTimer > 0) {
            this.missPenaltyTimer--;
            this.ringColor = '#ff0055';
        } else if (this.ringPulse === 0) {
            this.ringColor = this.currentVariation?.theme?.ringColor || '#00f0ff';
        }

        if (this.ringPulse > 0) {
            this.ringPulse *= 0.85;
            if (this.ringPulse < 0.1) this.ringPulse = 0;
        }

        // 自機描画
        this.ctx.save();
        this.ctx.fillStyle = this.missPenaltyTimer > 0 ? '#ff0055' : this.player.color;
        this.ctx.shadowColor = this.missPenaltyTimer > 0 ? '#ff0055' : this.player.color;
        this.ctx.shadowBlur = 15;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.player.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // 判定リング描画
        const currentRadius = this.player.targetRadius + this.ringPulse + this.beatPulse;
        this.ctx.strokeStyle = this.ringColor;
        this.ctx.lineWidth = 2 + (this.ringPulse / 3);
        this.ctx.shadowColor = this.ringColor;
        this.ctx.shadowBlur = 10 + this.ringPulse * 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();

        // 敵更新・描画
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const dist = enemy.update(this.player.targetRadius);
            enemy.draw(this.ctx);

            if (dist <= this.player.radius) {
                this.createParticles(enemy.x, enemy.y, '#ff0055');
                this.enemies.splice(i, 1);
                this.player.hp--;
                this.updateUI();
                audioEngine.playMissSound();

                if (this.player.hp <= 0) {
                    this.gameOver();
                    return;
                }
            }
        }

        // エフェクト更新・描画
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const sw = this.shockwaves[i];
            sw.update();
            sw.draw(this.ctx);
            if (sw.alpha <= 0) this.shockwaves.splice(i, 1);
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            p.draw(this.ctx);
            if (p.alpha <= 0) this.particles.splice(i, 1);
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

// インスタンス化
const game = new Game();
window.game = game;
window.onload = () => game.startApp();
