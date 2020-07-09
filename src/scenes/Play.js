class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image("rocket", "./assets/rocket.png");
        this.load.image("spaceship", "./assets/spaceship.png");
        this.load.image("spaceshipSmall", "./assets/spaceshipSmall.png");
        this.load.image("starfield", "./assets/starfield.png");
        this.load.spritesheet("explosion", "./assets/explosion.png", {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9})

        // load background music
        this.load.audio("bgm_Zen_Glitch", "./assets/Zen Glitch.mp3");
    }

    create() {
        // create and configure sound objects
        this.bgm_Zen_Glitch = this.sound.add("bgm_Zen_Glitch", {volume: 0.3, loop: true});
        this.sfx_explosion = this.sound.add("sfx_explosion", {volume: 0.1});
        
        // play bgm
        this.bgm_Zen_Glitch.play();

        // place tile sprite background
        this.starfield = this.add.tileSprite(0, 0, 640, 480, "starfield").setOrigin(0, 0);
        
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, "rocket", 0).setScale(0.5, 0.5).setOrigin(0, 0);

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 162, "spaceship", 0, 30, 1).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 226, "spaceship", 0, 20, 1).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 290, "spaceship", 0, 10, 1).setOrigin(0, 0);

        // add special spaceship
        this.ship04 = new Spaceship(this, game.config.width + 192, 120, "spaceshipSmall", 0, 60, 1.5).setOrigin(0, 0);
        
        // pre-borders along the left and right edges
        this.add.rectangle(0, 0, 5, 480, 0x000000).setOrigin(0, 0);
        this.add.rectangle(635, 0, 640, 480, 0x000000).setOrigin(0, 0);

        // borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 445, 0xFFFFFF).setOrigin(0, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", {start: 0, end: 9, first:0}),
            frameRate: 30,
        })
        
        // score
        this.p1Score = 0;
        
        // time display config
        let scoreConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        //time display (will be updated in loop)
        this.timeRight = this.add.text(game.config.width-169, 54, "", scoreConfig);

        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2+64, "(F)ire to Restart or ← for Menu", scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this)
    }

    update() {
        // scroll tile sprite
        this.starfield.tilePositionX -= 4;

        // check for restart or to menu after gameover
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.bgm_Zen_Glitch.stop();
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.bgm_Zen_Glitch.stop();
            this.scene.start("menuScene");
        }

        // do updates only if game is not over
        if(!this.gameOver) {
            // update rocket
            this.p1Rocket.update();

            // update spaceships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();

            this.timeRight.text = Math.floor(this.clock.delay/1000 - this.clock.getElapsedSeconds());
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
        } else { 
            return false;
        }
    }

    shipExplode(ship) {
        // hide the ship
        ship.alpha = 0;

        // create and play explosion at ship's position
        let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
        boom.anims.play("explode");

        // when animation completes, reset the ship and show it again, and destroy the explosion sprite
        boom.on("animationcomplete", () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        
        // increase score
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        // pause timer temporarily depending on score granted
        this.clock.paused = true;
        this.timeRight.setColor("#C87A49");
        this.timeRight.setBackgroundColor("#F7F585");
        this.resume = this.time.delayedCall(ship.points*50, () => {
            this.clock.paused = false;
            this.timeRight.setColor("#843605");
            this.timeRight.setBackgroundColor("#F3B141");
        }, null, this)

        // play sound
        this.sfx_explosion.play();
    }
}