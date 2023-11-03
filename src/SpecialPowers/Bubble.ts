import { GameObject } from "../GameObject";
import { Vector2D } from "../utils/Vector";
import { SpecialPower } from "./SpecialPower";
import { BubbleTex, specialpowerConfig } from "../main";
import { Bar } from "../Paddles/Bar";
import * as PIXI from "pixi.js";

export class Bubble extends SpecialPower {
    constructor(center: Vector2D, velocity: Vector2D, shooter: Bar) {
        super("Bubble", center, velocity, shooter, specialpowerConfig.bubble.diameter, specialpowerConfig.bubble.vertices);
    }

    onCollide(target: GameObject): boolean {
        if (!(target instanceof SpecialPower)){
            return true;
        }
        return false;
    }
}

export class UIBubble extends Bubble {
    public displayObject: PIXI.Sprite;
    constructor(center: Vector2D, velocity: Vector2D, shooter: Bar) {
        super(center, velocity, shooter);
        this.displayObject = new PIXI.Sprite(BubbleTex);
        this.displayObject.anchor.set(0.5);
        this.displayObject.x = center.x;
        this.displayObject.y = center.y;
    }

    update(delta: number): boolean {
        if (super.update(delta) === false) { return false; }
        this.displayObject.x = this.center.x;
        this.displayObject.y = this.center.y; 
        return true;
    }

    onCollide(target: GameObject): boolean {
        if (super.onCollide(target) === true)
        {
            this.game.remove(this);
            return true;
        }
        return false;
    }
}