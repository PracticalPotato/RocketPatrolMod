class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this)

        // track rocket's firing status
        this.isFiring = false;

        // create and config rocket sfx (this should probably be in Play somehow)
        this.sfxRocket = scene.sound.add("sfx_rocket", {volume: 0.1});
    }

    update() {
        // left/right movement
        if (keyLEFT.isDown && this.x >= 47) {
            this.x -= 3;
        } else if (keyRIGHT.isDown && this.x <= 578) {
            this.x += 3;
        }
        
        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            // rocket is now firing
            this.isFiring = true;
            //play sound rocket firing sfx
            this.sfxRocket.play();
        }

        // if fired, move up
        if (this.isFiring == true) {
            this.y -=2;
        }

        // reset on miss
        if (this.y <= 108) {
            this.isFiring = false;
            this.y = 431;
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = 431;
    }
}