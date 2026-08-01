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

        const characterData = [
            { id: 'CHASER', name: 'ストレート・サークル', tag: '直進', desc: '赤色のネオン正円ノーツ。中心へ一直線にアプローチ！', color: '#ff3366' },
            { id: 'SPEEDER', name: 'ボルト・ステラ', tag: '高速直進', desc: '黄色のネオン★星型ノーツ。1.5倍のハイスピードで突進！', color: '#ffff33' },
            { id: 'GLITCH', name: 'グリッチ・テトラ', tag: '直前減速', desc: '紫色のネオン正方形。判定手前でフッと一瞬減速する！', color: '#cc00ff' },
            { id: 'CURVE', name: 'カーブ・トライ', tag: '片曲がりカーブ', desc: 'オレンジ色の正三角形。片側に綺麗なカーブ（変化球）を描いて侵入！', color: '#ff9900' },
            { id: 'SINE_WAVE', name: 'ウェイブ・ダイヤ', tag: '大波S字運動', desc: 'シアン色のひし形ノーツ。S字サイン波でゆったり優雅に流れる！', color: '#00ffcc' },
            { id: 'CROSS', name: 'リターン・アングル', tag: '引き返し・Uターン', desc: '木調ブラウンのL字ノーツ。一度外へ引き返してから急速アプローチ！', color: '#d2691e' },
            { id: 'GHOST', name: 'シャドウ・クロス', tag: '隠密・透明化', desc: 'ライム色の手裏剣ノーツ。途中で消えて判定直前に現れる！', color: '#aaff66' },
            { id: 'HEXAGON', name: 'フリーズ・ヘキサ', tag: '一瞬停止', desc: '水色の正六角形。手前でピタッと1秒停止後ダッシュ！', color: '#00ccff' },
            { id: 'RING_NOTE', name: 'オービット・オクタ', tag: '大円弧公転', desc: 'インディゴブルーの正八角形ノーツ。画面外から大きな円弧を描いて接近！', color: '#3355ff' },
            { id: 'PENTAGON', name: 'バウンド・ペンタ', tag: 'ジグザグステップ', desc: '緑色の正五角形。カクッカクッと左右にステップを踏みながら進行！', color: '#00ff66' },
            { id: 'CAT', name: 'にゃんこファミリー', tag: 'トコトコ歩行', desc: '白猫・茶トラ・ハチワレ。しっぽを振って気まぐれ散歩！', color: '#ffccaa' },
            { id: 'CHICKEN', name: 'ぴよぴよヒヨコ', tag: 'チョコチョコ歩行', desc: '羽をはためかせてトコトコ進む可愛い黄色いヒヨコ！', color: '#ffee33' },
            { id: 'DOG', name: '柴犬わんこ', tag: '直進ダッシュ', desc: 'くるりん尾っぽを振って元気いっぱいに駆けてくる柴犬！', color: '#ffaa33' },
            { id: 'BEE', name: 'みつばち', tag: '旋回飛翔', desc: '羽をパタパタさせながら大きな円を描いて飛んでくる！', color: '#ffcc00' },
            { id: 'FROG', name: 'かえるさん', tag: '一瞬停止', desc: '手前でピタッと1秒止まって「だるまさんが転んだ」！', color: '#00ff66' },
            { id: 'SUSHI', name: '回転寿司全8種', tag: '自転回転', desc: 'マグロ・サーモン・エビ・たまご等。自転しながら突進！', color: '#ff6633' },
            { id: 'SEA_SLUG', name: '海の宝石ウミウシ', tag: '波打つ水蒸泳', desc: 'アオウミウシ・ゴマちゃん・ピカチュウ！うねうね波打つ海の宝石！', color: '#00ccff' },
            { id: 'FIREWORK', name: '打上花火', tag: '大輪演出', desc: 'タップすると夜空へ大輪の花火が打ち上がる！', color: '#ff00aa' },
            { id: 'SAKURA_PETAL', name: '桜の花びら', tag: 'ひらひら舞い降り', desc: '上から舞い落ちる花びら。タップすると下に満開の桜が咲き誇る！', color: '#ffb7c5' }
        ];

        const dummyCanvas = document.createElement('canvas');

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

        if (diff === 'FUNNY') {
            // FUNNYモード: 最新順(日付降順)で並べ替え
            items.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
        }
        // EASY / NORMAL / HARD: stages.json での定義順(コース順 1, 2, 3...)を維持！

        items.forEach((s, index) => {
            const card = document.createElement('div');
            card.className = 'stage-card';
            const best = localStorage.getItem(`bestScore_${s.id}`) || 0;

            let badgeHtml = '';
            if (diff === 'FUNNY') {
                // 最新3件に NEW! バッジを表示 (ゴールド/イエローカラー)
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

        // 水泡アクアリウムエフェクトのオンオフ
        this.toggleBubbleEffect(!!theme.bubbleEffect);
        // 夜桜吹雪エフェクトのオンオフ
        this.toggleSakuraEffect(!!theme.sakuraEffect);
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
        this.toggleSakuraEffect(false);
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
