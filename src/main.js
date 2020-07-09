/*
Rocket Patrol Mod
Calvin Rong

Partially at the recommendation of a groupmate, I've selected 

[DONE] Add your own (copyright-free) background music to the Play scene (10)
            The song I wanted to use was copyrighted under CC BY-SA 4.0, so I provided credit below.
[DONE] Allow the player to control the Rocket after it's fired (10)
[DONE] Implement Parallax Scrolling (15)
            The background and spaceships move at different speeds, relative to the movement of the player.
            However, it still feels really weird to play. Not sure if I got my values wrong or
            whether it's just the jerkiness of the player's movement making it seem like the ships
            are speeding and slowing down erratically
[DONE] Display the time remaining (in seconds) on the screen (15)
[DONE] Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (25)
            Implemented with a new sprite and a speed multiplier variable
[DONE] Implement a new timing/scoring mechanism that adds time to the clock for successful hits (25)
            The time pauses for an amount of time dependent on the point value of the ship hit.

Credit:
BGM: TeknoAXE - Zen Glitch
    Unmodified, Copyright 2020 under Attribution 4.0 International https://creativecommons.org/licenses/by-sa/4.0/
*/

// Create game config object
let config = {
    type: Phaser.Canvas,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
};

// create main game object
let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000,
}

let keyF, keyLEFT, keyRIGHT;