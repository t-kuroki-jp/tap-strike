/**
 * Web Audio API を使用した軽量効果音・BGM再生管理クラス
 * 汎用的な音源合成機能を提供
 */
class AudioEngine {
    constructor() {
        this.audioCtx = null;
        this.bgmAudio = null;
    }

    init() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => {});
        }
    }

    /** 汎用トーン・シンセサイザー再生機能 */
    playTone({ type = 'sine', startFreq = 440, endFreq = 880, duration = 0.1, volume = 0.4 }) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, this.audioCtx.currentTime);
        if (endFreq !== startFreq) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), this.audioCtx.currentTime + duration);
        }

        gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }

    /** 共通基本SE */
    playHitSound() {
        this.playTone({ type: 'sine', startFreq: 600, endFreq: 1200, duration: 0.08, volume: 0.3 });
    }

    playPerfectSound() {
        this.playTone({ type: 'triangle', startFreq: 1320, endFreq: 2640, duration: 0.12, volume: 0.4 });
    }

    playMissSound() {
        this.playTone({ type: 'sawtooth', startFreq: 150, endFreq: 60, duration: 0.25, volume: 0.5 });
    }

    playGameOverSound() {
        this.playTone({ type: 'sawtooth', startFreq: 300, endFreq: 40, duration: 0.6, volume: 0.6 });
    }

    startBGM(url) {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio = null;
        }

        this.bgmAudio = new Audio(url);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.35;
        this.bgmAudio.play().catch(() => {});
    }

    stopBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio.currentTime = 0;
            this.bgmAudio = null;
        }
    }
}

const audioEngine = new AudioEngine();
