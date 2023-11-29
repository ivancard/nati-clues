export class Game extends Phaser.Scene {

    constructor() {
        super({key: 'game'})
    }

    preload() {
        this.load.image('background', './assets/background.jpeg')
    }

    create() {
        this.add.image(400, 250, 'background')
    }
}