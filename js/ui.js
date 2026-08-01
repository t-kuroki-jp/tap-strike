/**
 * タップストライク UI・DOM制御マネージャークラス (UIManager)
 * モーダル表示、カード生成、HUD表示、テーマスタイルの更新を一括管理
 */
class UIManager {
    constructor() {
        this.modals = [
            'modal-mode-select',
            'modal-stage-select',
            'modal-game-over',
            'modal-pause',
            'modal-character-list'
        ];
    }

    /** すべてのモーダルダイアログを隠す */
    hideAllModals() {
        this.modals.forEach(id => {
            const elem = document.getElementById(id);
            if (elem) elem.style.display = 'none';
        });
    }

    /** 指定されたモーダルを表示し、状況に応じてUIコンテナの可視性を切替 */
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

    /** ゲームプレイ中HUD (スコア, コンボ, HP) の表示更新 */
    updateHUD(score, combo, hp) {
        const scoreElem = document.getElementById('score');
        if (scoreElem) scoreElem.innerText = `SCORE: ${score}`;

        const comboElem = document.getElementById('combo');
        if (comboElem) comboElem.innerText = `COMBO: ${combo}x`;

        const hpElem = document.getElementById('hp');
        if (hpElem) {
            const hpStr = '❤️'.repeat(Math.max(0, hp));
            hpElem.innerText = hpStr || '💀';
        }
    }

    /** キャラクター図鑑モーダルを表示 */
    showCharacterList() {
        this.hideAllModals();
        this.renderCharacterList();
        this.showModal('modal-character-list');
    }

    /** キャラクター図鑑グリッドの動的生成 */
    renderCharacterList() {
        const container = document.getElementById('character-grid');
        if (!container) return;
        container.innerHTML = '';

        // 各エネミーノーツクラスが保持する static metadata を全自動集約！(ハードコード完全消去)
        const characterData = typeof EnemyFactory !== 'undefined' ? EnemyFactory.getAllMetadata() : [];

        const dummyCanvas = document.createElement('canvas');

        characterData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'character-card';

            const canvas = document.createElement('canvas');
            canvas.className = 'char-canvas';
            canvas.width = 60;
            canvas.height = 60;

            card.appendChild(canvas);

            const isEn = typeof i18n !== 'undefined' && i18n.lang === 'en';

            const nameElem = document.createElement('div');
            nameElem.className = 'char-name';
            nameElem.innerText = (isEn && item.name_en) ? item.name_en : item.name;
            card.appendChild(nameElem);

            const tagElem = document.createElement('div');
            tagElem.className = 'char-behavior-tag';
            tagElem.innerText = (isEn && item.tag_en) ? item.tag_en : item.tag;
            card.appendChild(tagElem);

            container.appendChild(card);

            setTimeout(() => {
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                ctx.clearRect(0, 0, 60, 60);
                try {
                    const dummyEnemy = EnemyFactory.create(dummyCanvas, 1.0, { enemyPool: [{ id: item.id }] });
                    dummyEnemy.x = 30;
                    dummyEnemy.y = 30;
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

    /** ステージ選択画面の動的生成 */
    renderStageMenu(stages, diff, onSelectStage) {
        const container = document.getElementById('stage-list');
        if (!container) return;
        container.innerHTML = '';

        let items = stages.filter(s => s.difficulty === diff);
        if (items.length === 0) {
            container.innerHTML = '<div class="loading-text" style="color:#aaa;">このモードのステージはまだありません</div>';
            return;
        }

        // 全モード: stages.json に書かれた配列の並び順通りにストレート表示！

        items.forEach((s, index) => {
            const card = document.createElement('div');
            card.className = 'stage-card';
            const best = localStorage.getItem(`bestScore_${s.id}`) || 0;

            let badgeHtml = '';
            if (diff === 'FUNNY') {
                // stages.json の上(先頭 3件)に金色の NEW! バッジを表示！
                if (index < 3) {
                    badgeHtml = `<span class="badge-new badge-${diff}">NEW!</span>`;
                }
            } else {
                // コース順の STAGE 01, STAGE 02 ... (モードカラー連動)
                const stageNum = String(index + 1).padStart(2, '0');
                badgeHtml = `<span class="badge-stage-num badge-${diff}">STAGE ${stageNum}</span>`;
            }

            card.innerHTML = `
                <div class="stage-card-header">
                    ${badgeHtml}
                    <div class="stage-name">${s.name}</div>
                </div>
                <div class="stage-desc">${s.description || ''}</div>
                <div class="stage-stats">
                    <span class="stage-score">🏆 BEST: ${Number(best).toLocaleString()}</span>
                </div>
            `;
            card.onclick = () => onSelectStage(s);
            container.appendChild(card);
        });
    }

    /** 背景テーマをデフォルト状態（シアン）に復元 */
    resetThemeToDefault() {
        const bgElem = document.querySelector('.bg-animated');
        if (bgElem) {
            bgElem.style.background = `
                radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, rgba(5, 7, 14, 0.95) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0, 240, 255, 0.3) 40px),
                repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0, 240, 255, 0.3) 40px)
            `;
            bgElem.style.backgroundColor = '#05070e';
        }
        document.documentElement.style.setProperty('--bg-scroll-speed', '3s');
        const scoreBoard = document.querySelector('.score-board');
        if (scoreBoard) {
            scoreBoard.style.color = '#00f0ff';
            scoreBoard.style.textShadow = '0 0 10px #00f0ff';
        }
        this.toggleBubbleEffect(false);
    }

    /** ステージテーマ（背景・テーマカラー）を適用 */
    applyTheme(theme) {
        if (!theme) return;
        const bgElem = document.querySelector('.bg-animated');
        if (bgElem) {
            const baseBg = theme.bgColor || '#05070e';
            bgElem.style.backgroundColor = baseBg;
            bgElem.style.background = `
                radial-gradient(circle at 50% 40%, ${theme.bgGlow || 'rgba(0, 240, 255, 0.25)'} 0%, ${baseBg} 85%),
                repeating-linear-gradient(0deg, transparent, transparent 39px, ${theme.gridColor || 'rgba(0, 240, 255, 0.3)'} 40px),
                repeating-linear-gradient(90deg, transparent, transparent 39px, ${theme.gridColor || 'rgba(0, 240, 255, 0.3)'} 40px)
            `;
        }
        const mainColor = theme.ringColor || theme.playerColor || '#00f0ff';
        document.documentElement.style.setProperty('--bg-scroll-speed', theme.bgScrollSpeed || '3s');

        const scoreBoard = document.querySelector('.score-board');
        if (scoreBoard) {
            scoreBoard.style.color = mainColor;
            scoreBoard.style.textShadow = `0 0 12px ${mainColor}`;
        }

        // プラグインマネージャー経由で背景ビジュアルエフェクトを一括適応！
        if (typeof effectManager !== 'undefined') {
            effectManager.applyEffects(theme);
        }
    }

    /** 背景テーマをデフォルト状態（シアン）に復元 */
    resetThemeToDefault() {
        const bgElem = document.querySelector('.bg-animated');
        if (bgElem) {
            bgElem.style.background = `
                radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, rgba(5, 7, 14, 0.95) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0, 240, 255, 0.3) 40px),
                repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0, 240, 255, 0.3) 40px)
            `;
            bgElem.style.backgroundColor = '#05070e';
        }
        document.documentElement.style.setProperty('--bg-scroll-speed', '3s');
        const scoreBoard = document.querySelector('.score-board');
        if (scoreBoard) {
            scoreBoard.style.color = '#00f0ff';
            scoreBoard.style.textShadow = '0 0 10px #00f0ff';
        }
        if (typeof effectManager !== 'undefined') {
            effectManager.stopAll();
        }
    }

    /** 深海ぷくぷく水泡エフェクトのオンオフ切り替え */
    toggleBubbleEffect(enable) {
        let container = document.getElementById('bubble-container');
        if (enable) {
            if (!container) {
                container = document.createElement('div');
                container.id = 'bubble-container';
                container.className = 'bubble-container';
                document.body.appendChild(container);
            }
            container.innerHTML = '';
            // 12個のゆらめく水泡をランダム生成
            for (let i = 0; i < 12; i++) {
                const bubble = document.createElement('div');
                bubble.className = 'bubble-particle';
                const size = 6 + Math.random() * 14;
                const left = Math.random() * 100;
                const delay = Math.random() * 6;
                const duration = 4 + Math.random() * 5;

                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                bubble.style.left = `${left}%`;
                bubble.style.animationDelay = `${delay}s`;
                bubble.style.animationDuration = `${duration}s`;
                container.appendChild(bubble);
            }
            container.style.display = 'block';
        } else if (container) {
            container.style.display = 'none';
        }
    }

    /** ロマンチック夜桜吹雪エフェクトのオンオフ切り替え */
    toggleSakuraEffect(enable) {
        let container = document.getElementById('sakura-container');
        if (enable) {
            if (!container) {
                container = document.createElement('div');
                container.id = 'sakura-container';
                container.className = 'sakura-container';
                document.body.appendChild(container);
            }
            container.innerHTML = '';
            // 16枚のひらひら舞う桜の花びらを生成
            for (let i = 0; i < 16; i++) {
                const petal = document.createElement('div');
                petal.className = 'sakura-particle';
                const size = 8 + Math.random() * 10;
                const left = Math.random() * 100;
                const delay = Math.random() * 8;
                const duration = 5 + Math.random() * 6;

                petal.style.width = `${size}px`;
                petal.style.height = `${size * 1.3}px`;
                petal.style.left = `${left}%`;
                petal.style.animationDelay = `${delay}s`;
                petal.style.animationDuration = `${duration}s`;
                container.appendChild(petal);
            }
            container.style.display = 'block';
        } else if (container) {
            container.style.display = 'none';
        }
    }

    /** 七色サイバーレインボー背景エフェクトのオンオフ切り替え */
    toggleRainbowEffect(enable) {
        const bgElem = document.querySelector('.bg-animated');
        if (!bgElem) return;
        if (enable) {
            bgElem.classList.add('rainbow-bg');
        } else {
            bgElem.classList.remove('rainbow-bg');
        }
    }

    /** ゲームオーバーモーダルの表示更新 */
    showGameOverModal(stageName, score, isNewRecord, prevBest) {
        const stageNameElem = document.getElementById('game-over-stage-name');
        if (stageNameElem) stageNameElem.innerText = stageName || '';

        const scoreElem = document.getElementById('final-score');
        if (scoreElem) scoreElem.innerText = `SCORE: ${score}`;

        const noticeElem = document.getElementById('high-score-notice');
        if (noticeElem) {
            noticeElem.innerText = isNewRecord ? 'NEW RECORD!' : `BEST SCORE: ${prevBest}`;
        }

        this.showModal('modal-game-over');
    }
}

const uiManager = new UIManager();
