import { Bar } from "./Bar";
import { Vector2D } from "../utils/Vector";
import { Game, UIGame } from "../Game";
import { UIMana } from './Mana';
import { UIEnergy } from './Energy';

import * as PIXI from 'pixi.js';

const UP    = new Vector2D(0, -5);
const DOWN  = new Vector2D(0, 5);
const STOP  = new Vector2D(0, 0);

export class Bot extends Bar {

    private botSpeed: number = 5;
    
    constructor (x: number, y: number, tag: string, public direction: Vector2D, game: Game) {
        super(x, y, tag, direction, game);
    }

    // add acceleration to the bot
    // add powers to the bot
    // add bot powers
    // add inteligent ball predicition to the bot
    // add bot difficulty:
    // add bot reaction time

    update(delta: number): boolean {

        let ret = false;

        const ballPosition = this.game.getObjectByTag('Bolinha')?.getCenter;
        if (!ballPosition) return false;
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
            this.center.y += this.velocity.y * this.acceleration * delta;
            ret = true;
        }

        this.mana.update(this.tag, delta);
        this.energy.update(this.tag, delta);

        if (this.effect !== undefined) {
            this.effect.update(delta, this);
        }
        return ret;
    }
}

export class UIBot extends Bot {
    public displayObject: PIXI.Sprite;
    constructor(texture: PIXI.Texture, x: number, y: number, tag: string, public direction: Vector2D, uigame: UIGame)
    {
        super(x, y, tag, direction, uigame);
        this.displayObject = PIXI.Sprite.from(texture);
        this.displayObject.anchor.set(0.5);
        this.displayObject.x = x;
        this.displayObject.y = y;
        this.displayObject.scale.set(0.5);
        this.mana = new UIMana(this.tag);
        this.energy = new UIEnergy(this.tag);
    }

    setScaleDisplayObject(scale: number): void {
        this.displayObject.height = this.height * scale;
        this.displayObject.width = this.width;
    }

    setDisplayObjectCoords(center: Vector2D): void {
        this.displayObject.x = center.x;
        this.displayObject.y = center.y;
    }

    setScale(scale: number): void {
        super.setScale(scale);
        this.setScaleDisplayObject(scale);
        this.setDisplayObjectCoords(this.center);
    }

    update(delta: number): boolean {
        if (super.update(delta) === true) this.displayObject.y = this.center.y; 
        this.displayObject.x = this.center.x;
        this.displayObject.y = this.center.y;
        return true;
    }
}