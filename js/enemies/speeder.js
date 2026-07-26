/**
 * ボルト・スピーダー (高速小型)
 */
class SpeederEnemy extends Enemy {
    constructor(canvas, gameSpeed, stage) {
        super(canvas, gameSpeed, stage, {
            id: 'SPEEDER', name: 'ボルト・スピーダー', color: '#ffcc00', shape: 'circle', speedRatio: 1.5, size: 9, hp: 1
        });
    }
}
