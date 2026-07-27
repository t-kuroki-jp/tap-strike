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
        this.isPaused = false;
        this.enemies = [];
        this.particles = [];
        this.shockwaves = [];
        this.comboPopups = [];
        this.coreFlash = 0;
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

    // --- 画面モーダル切替ロジック ---
    hideAllModals() {
        ['modal-mode-select', 'modal-stage-select', 'modal-game-over', 'modal-pause', 'modal-character-list'].forEach(id => {
            const elem = document.getElementById(id);
            if (elem) elem.style.display = 'none';
        });
    }

    showModal(modalId) {
        this.hideAllModals();
        if (modalId) {
            const elem = document.getElementById(modalId);
            if (elem) elem.style.display = 'block';
        }
        if (modalId === 'modal-mode-select' || modalId === 'modal-stage-select' || modalId === 'modal-character-list') {
            const uiElem = document.getElementById('ui');
            if (uiElem) uiElem.style.display = 'none';
        }
    }

    showCharacterList() {
        this.hideAllModals();
        this.renderCharacterList();
        this.showModal('modal-character-list');
    }

    renderCharacterList() {
        const container = document.getElementById('character-grid');
        if (!container) return;
        container.innerHTML = '';

        const characterData = [
            { id: 'CHASER', name: 'チェイサー', tag: '直進', desc: '赤色のネオン円形ノーツ。中心へ一直線にアプローチ！', color: '#ff3366' },
            { id: 'SPEEDER', name: 'スピーダー', tag: '高速直進', desc: '黄色のネオン稲妻ノーツ。1.5倍のハイスピードで突進！', color: '#ffff33' },
            { id: 'GLITCH', name: 'ファントム・グリッチ', tag: '直前減速', desc: '紫色のネオン正方形。判定手前でフッと一瞬減速する！', color: '#cc00ff' },
            { id: 'CURVE', name: 'スピナー', tag: '片曲がりカーブ', desc: 'オレンジ色の正三角形。片側に綺麗なカーブ（変化球）を描いて侵入！', color: '#ff9900' },
            { id: 'SINE_WAVE', name: 'サイン・ウェイバー', tag: '大波S字運動', desc: 'シアン色のダイアモンド。S字サイン波でゆったり優雅に流れる！', color: '#00ffcc' },
            { id: 'CROSS', name: 'ブーメラン・クロス', tag: '引き返し回転', desc: 'ピンク色のL字ノーツ。自転回転しながら手前で引き返す！', color: '#ff0077' },
            { id: 'GHOST', name: 'ステルス・クロス', tag: '隠密・透明化', desc: 'ライム色の手裏剣ノーツ。途中で消えて判定直前に現れる！', color: '#aaff66' },
            { id: 'HEXAGON', name: 'フリーズ・ヘキサ', tag: '一瞬停止', desc: '水色の正六角形。手前でピタッと1秒停止後ダッシュ！', color: '#00ccff' },
            { id: 'RING_NOTE', name: 'オービット・サターン', tag: '大円弧公転', desc: '金色の土星ノーツ。画面外から大きな円弧を描いて接近！', color: '#ffea00' },
            { id: 'PENTAGON', name: 'バウンド・ペンタ', tag: 'ジグザグステップ', desc: '緑色の正五角形。カクッカクッと左右にステップを踏みながら進行！', color: '#00ff66' },
            { id: 'CAT', name: 'にゃんこファミリー', tag: 'トコトコ歩行', desc: '白猫・茶トラ・ハチワレ。しっぽを振って気まぐれ散歩！', color: '#ffccaa' },
            { id: 'CHICKEN', name: 'ぴよぴよヒヨコ', tag: 'チョコチョコ歩行', desc: '羽をはためかせてトコトコ進む可愛い黄色いヒヨコ！', color: '#ffee33' },
            { id: 'DOG', name: '柴犬わんこ', tag: '直進ダッシュ', desc: 'くるりん尾っぽを振って元気いっぱいに駆けてくる柴犬！', color: '#ffaa33' },
            { id: 'BEE', name: 'みつばち', tag: '旋回飛翔', desc: '羽をパタパタさせながら大きな円を描いて飛んでくる！', color: '#ffcc00' },
            { id: 'FROG', name: 'かえるさん', tag: '一瞬停止', desc: '手前でピタッと1秒止まって「だるまさんが転んだ」！', color: '#00ff66' },
            { id: 'SUSHI', name: '回転寿司全8種', tag: '自転回転', desc: 'マグロ・サーモン・エビ・たまご等。自転しながら突進！', color: '#ff6633' },
            { id: 'FIREWORK', name: '打上花火', tag: '大輪演出', desc: 'タップすると夜空へ大輪の花火が打ち上がる！', color: '#ff00aa' }
        ];

        characterData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'character-card';

            const canvas = document.createElement('canvas');
            canvas.className = 'char-canvas';
            canvas.width = 60;
            canvas.height = 60;

            card.appendChild(canvas);

            const nameElem = document.createElement('div');
            nameElem.className = 'char-name';
            nameElem.innerText = item.name;
            card.appendChild(nameElem);

            const tagElem = document.createElement('div');
            tagElem.className = 'char-behavior-tag';
            tagElem.innerText = `⚙️ ${item.tag}`;
            card.appendChild(tagElem);

            const descElem = document.createElement('div');
            descElem.className = 'char-desc';
            descElem.innerText = item.desc;
            card.appendChild(descElem);

            container.appendChild(card);

            setTimeout(() => {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, 60, 60);
                try {
                    const dummyEnemy = EnemyFactory.create(this.canvas, 1.0, { enemyPool: [{ id: item.id }] });
                    dummyEnemy.x = 30;
                    dummyEnemy.y = 30;
                    // 実ゲーム本編のスケールと100%同一に調整！
                    dummyEnemy.size = dummyEnemy.size || 15;
                    dummyEnemy.draw(ctx);
                } catch (e) {
                    ctx.fillStyle = item.color;
                    ctx.shadowColor = item.color;
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(30, 30, 14, 0, Math.PI * 2);
                    ctx.fill();
                }
            }, 20);
        });
    }

    togglePause() {
        if (!this.isGameStarted || this.isGameOver) return;

        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            if (this.bgmAudio) {
                try { this.bgmAudio.pause(); } catch (e) {}
            }
            this.showModal('modal-pause');
            const uiElem = document.getElementById('ui');
            if (uiElem) uiElem.style.display = 'block'; // ポーズ中もHUD維持
        } else {
            const pauseElem = document.getElementById('modal-pause');
            if (pauseElem) pauseElem.style.display = 'none';

            const uiElem = document.getElementById('ui');
            if (uiElem) uiElem.style.display = 'block'; // 再開時もHUD確定表示！

            if (this.bgmAudio) {
                try { this.bgmAudio.play(); } catch (e) {}
            }
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    restartStage() {
        this.isPaused = false;
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

        const titleElem = document.getElementById('selected-mode-title');
        if (titleElem) {
            titleElem.innerText = diff;
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
        this.isPaused = false;

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
        const scoreBoard = document.querySelector('.score-board');
        if (scoreBoard) {
            scoreBoard.style.color = '#00f0ff';
            scoreBoard.style.textShadow = '0 0 10px #00f0ff';
        }
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
        const mainColor = theme.ringColor || theme.playerColor || '#00f0ff';
        this.ringColor = mainColor;
        this.player.color = mainColor;
        document.documentElement.style.setProperty('--bg-scroll-speed', this.params.bgScrollSpeed || '3s');

        const scoreBoard = document.querySelector('.score-board');
        if (scoreBoard) {
            scoreBoard.style.color = mainColor;
            scoreBoard.style.textShadow = `0 0 12px ${mainColor}`;
        }
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
        this.coreFlash = 1.0; // ⚡ タップフラッシュ発生！

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

                // 10, 20, 30... コンボマイルストーン発生！
                if (this.combo > 0 && this.combo % 10 === 0) {
                    this.comboPopups.push(new ComboPopup(centerX, centerY - 85, `🔥 ${this.combo} COMBO!`, '#ffea00'));
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
                noticeText = 'NEW RECORD!';
            } else {
                noticeText = `BEST SCORE: ${prevBest}`;
            }
        }

        const stageNameElem = document.getElementById('game-over-stage-name');
        if (stageNameElem) {
            stageNameElem.innerText = this.currentStage ? this.currentStage.name : '';
        }

        document.getElementById('final-score').innerText = `SCORE: ${this.score}`;
        document.getElementById('high-score-notice').innerText = noticeText;

        // ゲームオーバーモーダル表示
        this.showModal('modal-game-over');
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

        // 💓 自機コアのビート鼓動 & ⚡ タップフラッシュ描画 (Beat Pulse Core)
        const pulseOffset = (this.beatPulse * 0.6);
        const flashOffset = (this.coreFlash * 4.5);
        const currentCoreRadius = this.player.radius + pulseOffset + flashOffset;
        const baseColor = this.missPenaltyTimer > 0 ? '#ff0055' : this.player.color;

        this.ctx.save();
        this.ctx.fillStyle = baseColor;
        this.ctx.shadowColor = baseColor;
        this.ctx.shadowBlur = 15 + (this.coreFlash * 12);
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, currentCoreRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // ⚡ タップフラッシュ時の中央白熱コア (#ffffff)
        if (this.coreFlash > 0.05) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.shadowColor = '#ffffff';
            this.ctx.shadowBlur = 20;
            this.ctx.globalAlpha = this.coreFlash;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, currentCoreRadius * 0.65, 0, Math.PI * 2);
            this.ctx.fill();

            this.coreFlash *= 0.82;
            if (this.coreFlash < 0.05) this.coreFlash = 0;
        }

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

        // 💥 コンボマイルストーン (Combo Milestones) ポップアップ更新・描画
        for (let i = this.comboPopups.length - 1; i >= 0; i--) {
            const cp = this.comboPopups[i];
            cp.update();
            cp.draw(this.ctx);
            if (cp.alpha <= 0) this.comboPopups.splice(i, 1);
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

// インスタンス化
const game = new Game();
window.game = game;
window.onload = () => game.startApp();
