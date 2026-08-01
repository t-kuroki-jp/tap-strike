/**
 * 多言語管理システム (Internationalization / i18n Manager)
 * 英語 🌐 日本語の動的リアルタイム切り替えモジュール
 */
const I18N_DICTIONARY = {
    ja: {
        // ヘッダー・メインメニュー
        title: "秒殺！1ボタンアクション Tap Strike",
        subtitle: "1ボタンで決めるサイバー快感リズムアクション！",
        btn_mode_select: "ゲーム開始",
        btn_encyclopedia: "キャラクター図鑑",
        btn_settings: "設定",

        // モード選択
        mode_select_title: "モード選択",
        btn_easy: "EASY (初心者向け)",
        btn_normal: "NORMAL (標準)",
        btn_hard: "HARD (上級者向け)",
        btn_funny: "FUNNY (バラエティ)",

        // ゲーム内UI・ポーズ・ゲームオーバー
        paused_title: "PAUSED",
        btn_resume: "ゲーム再開",
        btn_restart: "最初からやり直す",
        btn_stage_select: "ステージ選択",
        btn_title_return: "タイトルへ戻る",
        game_over_title: "GAME OVER",
        score_label: "SCORE",
        high_score_label: "NEW HIGH SCORE!",

        // キャラクター図鑑
        encyclopedia_title: "キャラクター図鑑",
        encyclopedia_subtitle: "登場する全エネミーとノーツのコレクション",
        btn_close: "閉じる"
    },
    en: {
        // Header & Main Menu
        title: "Tap Strike - One Button Action",
        subtitle: "Satisfying Cyber Rhythm Action with 1 Button!",
        btn_mode_select: "Start Game",
        btn_encyclopedia: "Character Book",
        btn_settings: "Settings",

        // Mode Select
        mode_select_title: "Select Mode",
        btn_easy: "EASY (Casual)",
        btn_normal: "NORMAL (Standard)",
        btn_hard: "HARD (Expert)",
        btn_funny: "FUNNY (Variety)",

        // Game UI / Pause / Game Over
        paused_title: "PAUSED",
        btn_resume: "Resume Game",
        btn_restart: "Restart Stage",
        btn_stage_select: "Stage Select",
        btn_title_return: "Back to Title",
        game_over_title: "GAME OVER",
        score_label: "SCORE",
        high_score_label: "NEW HIGH SCORE!",

        // Character Book
        encyclopedia_title: "Character Collection",
        encyclopedia_subtitle: "Collection of all Notes & Enemies",
        btn_close: "Close"
    }
};

class I18nManager {
    constructor() {
        // 日本語ブラウザ以外はデフォルトで 'en' (CrazyGames等を見据えて)
        const isJa = navigator.language && navigator.language.startsWith('ja');
        this.lang = localStorage.getItem('tap_strike_lang') || (isJa ? 'ja' : 'en');
    }

    /**
     * 翻訳キーに対応する文字列を取得
     * @param {string} key 
     * @returns {string}
     */
    t(key) {
        return I18N_DICTIONARY[this.lang]?.[key] || I18N_DICTIONARY['ja']?.[key] || key;
    }

    /**
     * 言語を変更して DOM を全自動更新
     * @param {'ja'|'en'} lang 
     */
    setLanguage(lang) {
        if (lang !== 'ja' && lang !== 'en') return;
        this.lang = lang;
        localStorage.setItem('tap_strike_lang', lang);
        this.updateDOM();
        
        // 言語切替イベントの通知 (UIや図鑑の再描画用)
        window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: this.lang } }));
    }

    /**
     * 日本語 ⇔ 英語のトグル切り替え
     */
    toggleLanguage() {
        this.setLanguage(this.lang === 'ja' ? 'en' : 'ja');
    }

    /**
     * HTML内の data-i18n 属性が付いた全要素のテキストを一括更新
     */
    updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(elem => {
            const key = elem.getAttribute('data-i18n');
            const text = this.t(key);
            if (text) {
                elem.innerText = text;
            }
        });

        // 言語切り替えトグルスイッチ (チェックボックス) の状態同期
        const toggleCheckbox = document.getElementById('lang-toggle-checkbox');
        if (toggleCheckbox) {
            toggleCheckbox.checked = (this.lang === 'en');
        }
    }
}

// グローバルインスタンスの作成
const i18n = new I18nManager();

// DOM 読み込み完了時に自動的に DOM テキストを適用
document.addEventListener('DOMContentLoaded', () => {
    i18n.updateDOM();
});
