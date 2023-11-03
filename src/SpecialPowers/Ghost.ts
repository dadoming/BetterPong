import { GameObject } from "../GameObject";
import { Vector2D } from "../utils/Vector";
import { GhostTex, specialpowerConfig } from "../main";
import { SpecialPower } from "./SpecialPower";
import { Bar } from "../Paddles/Bar";
import { Effect } from "./Effect";
import * as PIXI from "pixi.js";

export class Ghost extends SpecialPower {
    constructor(center: Vector2D, velocity: Vector2D, shooter: Bar) {
        super("Ghost", center, velocity, shooter, specialpowerConfig.ghost.diameter, specialpowerConfig.ghost.vertices);
    }

    onCollide(target: GameObject): boolean {

        if (!(target instanceof SpecialPower))
        {
            target.setEffect(new Effect("INVISIBLE", target));
            return true;
            // Game.remove(this);
        }
        return false;
    }
}

export class UIGhost extends Ghost {
    public displayObject: PIXI.Sprite;
    constructor(center: Vector2D, velocity: Vector2D, shooter: Bar) {
        super(center, velocity, shooter);
        this.displayObject = new PIXI.Sprite(GhostTex);
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