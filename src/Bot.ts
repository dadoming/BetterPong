import { Bar } from "./Bar";
import { Vector2D } from "./utils/Vector";
import { Game } from "./Game";
import * as PIXI from 'pixi.js';

const UP    = new Vector2D(0, -5);
const DOWN  = new Vector2D(0, 5);
const STOP  = new Vector2D(0, 0);

export class Bot extends Bar {

    private botSpeed: number = 5;
    
    constructor (texture: PIXI.Texture, x: number, y: number, tag: string, public direction: Vector2D) {
        super(texture, x, y, tag, direction);
    }

    // add acceleration to the bot
    // add powers to the bot
    // add bot powers
    // add inteligent ball predicition to the bot
    // add bot difficulty:
    // add bot reaction time

    update(delta: number): void {

        const ballPosition = Game.getObjectByTag('Bolinha').getCenter;
        if (ballPosition.y < this.center.y - 5) {
            this.setMove(true);
            this.velocity = UP.multiply(this.effectVelocity);
        }
        else if (ballPosition.y > this.center.y + 5) {
            this.setMove(true);
            this.velocity = DOWN.multiply(this.effectVelocity);
        }
        else {
            this.setMove(false);
            this.velocity = STOP;
        }

        if (this.move && this.checkArenaCollision()) {
            this.displayObject.y += this.velocity.y * this.acceleration * delta;
            this.setCenter(new Vector2D(this.displayObject.x, this.displayObject.y));
        }

        this.mana.update(this.tag, delta);
        this.energy.update(this.tag, delta);

        if (this.effect !== undefined) {
            this.effect.update(delta, this);
        }
    }
}