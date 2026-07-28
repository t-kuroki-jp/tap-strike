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

        const items = stages.filter(s => s.difficulty === diff);
        if (items.length === 0) {
            container.innerHTML = '<div class="loading-text" style="color:#aaa;">このモードのステージはまだありません</div>';
            return;
        }

        // 新しい順（日付降順）にソート
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
            card.onclick = () => onSelectStage(s);
            container.appendChild(card);
        });
    }

    /** 背景テーマをデフォルト状態（シアン）に復元 */
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

    /** ステージテーマ（背景・テーマカラー）を適用 */
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
        document.documentElement.style.setProperty('--bg-scroll-speed', theme.bgScrollSpeed || '3s');

        const scoreBoard = document.querySelector('.score-board');
        if (scoreBoard) {
            scoreBoard.style.color = mainColor;
            scoreBoard.style.textShadow = `0 0 12px ${mainColor}`;
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
