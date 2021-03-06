class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, speedFactor) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this)
        
        // calculate ship speed
        this.speed = Math.floor(game.settings.spaceshipSpeed*speedFactor);
        // store pointValue
        this.points = pointValue;
    }

    update() {
        // move spaceship left
        if (keyLEFT.isDown) {
            this.x -= this.speed-2;
        } else if (keyRIGHT.isDown) {
            this.x -= this.speed+2;
        } else {
            this.x -= this.speed;
        }
        // wraparound from left to right edge
        if (this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width;
    }
}