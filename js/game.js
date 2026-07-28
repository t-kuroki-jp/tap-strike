/**
 * ゲーム状態 Enum 定義
 */
const GameState = Object.freeze({
    MODE_SELECT: 'MODE_SELECT',
    STAGE_SELECT: 'STAGE_SELECT',
    CHARACTER_LIST: 'CHARACTER_LIST',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER'
});

/**
 * タップストライク メインゲームエンジン
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.state = GameState.MODE_SELECT;
        this.score = 0;
        this.combo = 0;
        this.enemies = [];
        this.particles = [];
        this.shockwaves = [];
        this.comboPopups = [];
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

    // 互換性アクセサー
    get isGameStarted() { return this.state === GameState.PLAYING || this.state === GameState.PAUSED; }
    get isGameOver() { return this.state === GameState.GAME_OVER; }
    get isPaused() { return this.state === GameState.PAUSED; }

    setState(newState) {
        this.state = newState;
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
                el.closest('.btn-pause') ||
                el.closest('.stage-card') ||
                el.closest('.var-card') ||
                el.closest('.modal-box')
            );
        };

        window.addEventListener('keydown', (e) => {
            if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && this.isGameStarted && !this.isGameOver) {
                this.togglePause();
            }
        });

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
        window.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                if (this.isGameStarted || this.isGameOver) {
                    this.restartStage();
                }
            }
        });
    }

    resize() {
        this.canvas.width = Math.min(window.innerWidth, 500);
        this.canvas.height = window.innerHeight;
    }

    // --- 画面モーダル切替ロジック (uiManager へ委譲) ---
    hideAllModals() {
        uiManager.hideAllModals();
    }

    showModal(modalId) {
        uiManager.showModal(modalId);
    }

    showCharacterList() {
        this.setState(GameState.CHARACTER_LIST);
        uiManager.showCharacterList();
    }

    togglePause() {
        if (this.state !== GameState.PLAYING && this.state !== GameState.PAUSED) return;

        if (this.state === GameState.PLAYING) {
            this.setState(GameState.PAUSED);
            if (audioEngine.bgmAudio) {
                try { audioEngine.bgmAudio.pause(); } catch (e) {}
            }
            this.showModal('modal-pause');
            const uiElem = document.getElementById('ui');
            if (uiElem) uiElem.style.display = 'block';
        } else {
            this.setState(GameState.PLAYING);
            const pauseElem = document.getElementById('modal-pause');
            if (pauseElem) pauseElem.style.display = 'none';

            const uiElem = document.getElementById('ui');
            if (uiElem) uiElem.style.display = 'block';

            if (audioEngine.bgmAudio) {
                try { audioEngine.bgmAudio.play(); } catch (e) {}
            }
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    restartStage() {
        if (!this.currentStage) {
            this.showModeSelect();
            return;
        }
        this.startGameWithStage(this.currentStage);
    }

    async startApp() {
        await dataLoader.loadAll();
        this.showModeSelect();
        this.updateUI();
    }

    showModeSelect() {
        audioEngine.init();
        this.setState(GameState.MODE_SELECT);
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
        this.setState(GameState.STAGE_SELECT);
        this.stopBGM();

        // 描画完全クリア
        this.enemies = [];
        this.particles = [];
        this.shockwaves = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        diff = (diff || this.currentStage?.difficulty || 'EASY').toUpperCase();

        const titleElem = document.getElementById('selected-mode-title');
        if (titleElem) {
            titleElem.innerText = diff;
            titleElem.className = `diff-title diff-${diff}`;
        }

        if (!dataLoader.isLoaded || dataLoader.stages.length === 0) {
            document.getElementById('stage-list').innerHTML = '<div class="loading-text">ステージ読込中...</div>';
            await dataLoader.loadAll();
        }

        uiManager.renderStageMenu(dataLoader.stages, diff, (s) => this.startGameWithStage(s));
        uiManager.showModal('modal-stage-select');
    }

    renderStageMenu(diff) {
        uiManager.renderStageMenu(dataLoader.stages, diff, (s) => this.startGameWithStage(s));
    }

    startGameWithStage(stage) {
        audioEngine.init();
        this.currentStage = stage;
        this.params = dataLoader.getResolvedParams(stage);
        this.applyTheme(stage.theme);

        this.setState(GameState.PLAYING);

        uiManager.hideAllModals();
        const uiElem = document.getElementById('ui');
        if (uiElem) uiElem.style.display = 'block';

        this.resetGame();
    }

    resetThemeToDefault() {
        uiManager.resetThemeToDefault();
    }

    applyTheme(theme) {
        if (!theme) return;
        uiManager.applyTheme(theme);
        const mainColor = theme.ringColor || theme.playerColor || '#00f0ff';
        this.ringColor = mainColor;
        this.player.color = mainColor;
    }

    resetGame() {
        this.setState(GameState.PLAYING);
        this.score = 0;
        this.combo = 0;
        this.gameSpeed = 1.0;
        this.enemies = [];
        this.particles = [];
        this.shockwaves = [];
        this.ringPulse = 0;
        this.missPenaltyTimer = 0;
        this.lastTapTime = 0;

        this.params = dataLoader.getResolvedParams(this.currentStage) || {};
        this.player.targetRadius = this.params.targetRadius || 60;
        this.player.maxHp = this.params.maxHp || 3;
        this.player.hp = this.player.maxHp;
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
            if (this.isGameOver || !this.isGameStarted || this.isPaused) return;
            this.beatPulse = 5;

            if (this.currentStage?.spawnPattern === 'san_san_nana') {
                const step = this.bgmStep % 20;
                const isSan1 = step >= 0 && step <= 2;
                const isSan2 = step >= 4 && step <= 6;
                const isNana = step >= 9 && step <= 15;

                if (isSan1 || isSan2 || isNana) {
                    this.enemies.push(EnemyFactory.create(this.canvas, this.gameSpeed, this.currentStage));
                }
            } else if (this.bgmStep % 2 === 0 && Math.random() > 0.3) {
                this.enemies.push(EnemyFactory.create(this.canvas, this.gameSpeed, this.currentStage));
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
        if (!this.isGameStarted || this.isGameOver || this.isPaused) return;
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
            const diff = Math.abs(dist - this.player.targetRadius);

            if (diff < this.params.hitWindow) {
                hit = true;
                const isPerfect = diff <= 8;

                enemy.onHit(this, touchX, touchY, isPerfect);

                if (enemy.hp <= 0) {
                    this.enemies.splice(i, 1);
                }
                break;
            }
        }

        if (!hit) {
            audioEngine.playMissSound();
            this.combo = 0;
            this.ringPulse = 8;
            this.ringColor = '#ff0055';
            this.missPenaltyTimer = this.params.missPenaltyDuration;
            this.shockwaves.push(new Shockwave(touchX, touchY, '#ff0055'));
        }

        this.updateUI();
    }

    createParticles(x, y, color, isStar = false) {
        const baseCount = this.params.particleCount || 12;
        const count = isStar ? Math.round(baseCount * 2.5) : baseCount;
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color, isStar && Math.random() < 0.6));
        }
    }

    updateUI() {
        uiManager.updateHUD(this.score, this.combo, this.player.hp);
    }

    gameOver() {
        this.setState(GameState.GAME_OVER);
        this.stopBGM();
        audioEngine.playGameOverSound();

        // 描画残像完全削除
        this.enemies = [];
        this.particles = [];
        this.shockwaves = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        let isNewRecord = false;
        let prevBest = 0;

        if (this.currentStage) {
            const storageKey = `bestScore_${this.currentStage.id}`;
            prevBest = parseInt(localStorage.getItem(storageKey) || '0', 10);
            if (this.score > prevBest) {
                localStorage.setItem(storageKey, this.score.toString());
                isNewRecord = true;
            }
        }

        uiManager.showGameOverModal(
            this.currentStage ? this.currentStage.name : '',
            this.score,
            isNewRecord,
            prevBest
        );
    }

    gameLoop() {
        if (!this.isGameStarted || this.isGameOver || this.isPaused) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        if (this.currentStage?.theme?.rainbow) {
            const hue = (Date.now() / 6) % 360;
            const rainbowColor = `hsl(${hue}, 100%, 50%)`;
            if (this.missPenaltyTimer <= 0 && this.ringPulse === 0) {
                this.ringColor = rainbowColor;
            }
            this.player.color = rainbowColor;
            const bgElem = document.querySelector('.bg-animated');
            if (bgElem) {
                bgElem.style.background = `
                    radial-gradient(circle, hsl(${hue}, 100%, 25%) 0%, rgba(5, 7, 14, 0.9) 100%),
                    repeating-linear-gradient(0deg, transparent, transparent 39px, hsl(${hue}, 100%, 40%) 40px),
                    repeating-linear-gradient(90deg, transparent, transparent 39px, hsl(${hue}, 100%, 40%) 40px)
                `;
            }
        }

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

        // 敵更新・描画・判定（ポリモーフィズム）
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const dist = enemy.update(this.player.targetRadius);
            enemy.draw(this.ctx);

            if (dist <= this.player.radius) {
                enemy.onReachCenter(this);
                this.enemies.splice(i, 1);
                if (this.isGameOver) {
                    this.ctx.restore();
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
