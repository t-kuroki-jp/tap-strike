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

        this.currentStage = null;
        this.params = {};

        this.player = {
            x: 0,
            y: 0,
            radius: 20,
            targetRadius: 60,
            hp: 3,
            maxHp: 3,
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
                el.closest('.stage-card') ||
                el.closest('.var-card') ||
                el.closest('.modal-box')
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

    // --- 画面モーダル切替ロジック ---
    hideAllModals() {
        const modalIds = ['modal-mode-select', 'modal-stage-select', 'modal-game-over'];
        modalIds.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) elem.style.display = 'none';
        });
        const uiElem = document.getElementById('ui');
        if (uiElem) uiElem.style.display = 'none';
    }

    showModal(modalId) {
        this.hideAllModals();
        if (modalId) {
            const elem = document.getElementById(modalId);
            if (elem) elem.style.display = 'block';
        }
    }

    async startApp() {
        await dataLoader.loadAll();
        this.showModeSelect();
        this.updateUI();
    }

    showModeSelect() {
        audioEngine.init();
        this.isGameStarted = false;
        this.isGameOver = false;
        this.stopBGM();

        // 描画・エンティティ完全削除
        this.enemies = [];
        this.particles = [];
        this.shockwaves = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // デフォルト背景復元
        this.resetThemeToDefault();

        // モード選択モーダル表示
        this.showModal('modal-mode-select');
    }

    async showStageSelect(diff) {
        audioEngine.init();
        this.isGameStarted = false;
        this.isGameOver = false;
        this.stopBGM();

        // 描画完全クリア
        this.enemies = [];
        this.particles = [];
        this.shockwaves = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // 難易度指定（フォールバック付き）
        diff = (diff || this.currentStage?.difficulty || 'EASY').toUpperCase();

        const diffDef = dataLoader.difficultiesMaster[diff] || {};
        const titleElem = document.getElementById('selected-mode-title');
        if (titleElem) {
            titleElem.innerText = `${diffDef.name || diff} モード`;
            titleElem.className = `diff-title diff-${diff}`;
        }

        if (!dataLoader.isLoaded || dataLoader.stages.length === 0) {
            document.getElementById('stage-list').innerHTML = '<div class="loading-text">ステージ読込中...</div>';
            await dataLoader.loadAll();
        }

        this.renderStageMenu(diff);
        this.showModal('modal-stage-select');
    }

    renderStageMenu(diff) {
        const container = document.getElementById('stage-list');
        container.innerHTML = '';

        const items = dataLoader.stages.filter(s => s.difficulty === diff);
        if (items.length === 0) {
            container.innerHTML = '<div class="loading-text" style="color:#aaa;">このモードのステージはまだありません</div>';
            return;
        }

        // 日付の降順（新しい順）に並び替え
        items.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

        items.forEach(s => {
            const card = document.createElement('div');
            card.className = 'stage-card';
            const best = localStorage.getItem(`bestScore_${s.id}`) || 0;
            const dateStr = s.updatedAt || s.createdAt || '';

            card.innerHTML = `
                <div class="stage-name">${s.name}</div>
                <div class="stage-desc">${s.description || ''}</div>
                <div class="stage-stats">
                    <span>${dateStr ? `📅 ${dateStr}` : ''}</span>
                    <span class="stage-score">🏆 BEST: ${best}</span>
                </div>
            `;
            card.onclick = () => this.startGameWithStage(s);
            container.appendChild(card);
        });
    }

    startGameWithStage(stage) {
        audioEngine.init();
        this.currentStage = stage;
        this.params = dataLoader.getResolvedParams(stage);
        this.applyTheme(stage.theme);

        this.isGameStarted = true;
        this.isGameOver = false;

        // 全モーダル隠してプレイ画面へ
        this.hideAllModals();
        const uiElem = document.getElementById('ui');
        if (uiElem) uiElem.style.display = 'block';

        this.resetGame();
    }

    resetThemeToDefault() {
        const bgElem = document.querySelector('.bg-animated');
        if (bgElem) {
            bgElem.style.background = `
                radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, rgba(5, 7, 14, 0.9) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0, 240, 255, 0.3) 40px),
                repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0, 240, 255, 0.3) 40px)
            `;
        }
        document.documentElement.style.setProperty('--bg-scroll-speed', '3s');
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

        this.params = dataLoader.getResolvedParams(this.currentStage);
        this.player.targetRadius = this.params.targetRadius;
        this.player.maxHp = this.params.maxHp;
        this.player.hp = this.params.maxHp;
        this.ringColor = this.currentStage?.theme?.ringColor || '#00f0ff';

        this.startBGM();
        this.updateUI();
        requestAnimationFrame(() => this.gameLoop());
    }

    startBGM() {
        this.stopBGM();

        if (this.currentStage && this.currentStage.bgm) {
            audioEngine.startBGM(this.currentStage.bgm);
        }

        this.bgmStep = 0;
        const spawnInterval = this.currentStage?.spawnRate || 187;

        this.bgmInterval = setInterval(() => {
            if (this.isGameOver || !this.isGameStarted) return;
            this.beatPulse = 5;

            if (this.bgmStep % 2 === 0 && Math.random() > 0.3) {
                this.enemies.push(new Enemy(this.canvas, this.gameSpeed, this.currentStage, dataLoader.enemiesMaster));
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

                enemy.hp--;
                if (enemy.hp <= 0) {
                    this.enemies.splice(i, 1);
                    this.combo++;
                    this.score += this.params.baseScore * this.combo;
                    this.gameSpeed += this.params.speedIncrement;

                    if (enemy.behavior === 'heal') {
                        this.player.hp = Math.min(this.player.maxHp, this.player.hp + 1);
                        this.createParticles(centerX, centerY, '#00ff88');
                    }
                } else {
                    this.combo++;
                    this.score += this.params.baseScore;
                }
                break;
            }
        }

        if (hit) {
            audioEngine.playHitSound();
            this.ringPulse = 15;
            this.ringColor = this.currentStage?.theme?.ringColor || '#00f0ff';
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

        // 描画残像完全削除
        this.enemies = [];
        this.particles = [];
        this.shockwaves = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        let noticeText = '';
        if (this.currentStage) {
            const storageKey = `bestScore_${this.currentStage.id}`;
            const prevBest = parseInt(localStorage.getItem(storageKey) || '0', 10);
            if (this.score > prevBest) {
                localStorage.setItem(storageKey, this.score.toString());
                noticeText = '🎉 NEW RECORD!';
            } else {
                noticeText = `BEST SCORE: ${prevBest}`;
            }
        }

        document.getElementById('final-score').innerText = `SCORE: ${this.score} (${this.currentStage ? this.currentStage.name : ''})`;
        document.getElementById('high-score-notice').innerText = noticeText;

        // ゲームオーバーモーダル表示
        this.showModal('modal-game-over');
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
            this.ringColor = this.currentStage?.theme?.ringColor || '#00f0ff';
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
                this.createParticles(enemy.x, enemy.y, enemy.color);
                this.enemies.splice(i, 1);

                if (enemy.behavior !== 'heal') {
                    this.player.hp--;
                    this.updateUI();
                    audioEngine.playMissSound();

                    if (this.player.hp <= 0) {
                        this.gameOver();
                        return;
                    }
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
