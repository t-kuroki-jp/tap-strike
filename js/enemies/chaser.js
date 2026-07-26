/**
 * クリムゾン・チェイサー (標準型)
 */
class ChaserEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'CHASER', name: 'クリムゾン・チェイサー', color: '#ff0055', shape: 'circle', speedRatio: 1.0, size: 12, hp: 1
        });
    }
}
