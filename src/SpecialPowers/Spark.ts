import { GameObject } from "../GameObject";
import { Vector2D } from "../utils/Vector";
import { SparkTex, specialpowerConfig } from "../main";
import { SpecialPower } from "./SpecialPower";
import { Bar } from "../Paddles/Bar";
import { Effect } from "./Effect";
import { Ball } from "../Ball";
import * as PIXI from "pixi.js";


export class Spark extends SpecialPower {
    constructor(center: Vector2D, velocity: Vector2D, shooter: Bar) {
        super("Spark", center, velocity, shooter, specialpowerConfig.spark.diameter, specialpowerConfig.spark.vertices);
    }

    onCollide(target: GameObject): boolean {
        if (target instanceof Bar)
        {
            if (target.getEffect === undefined)
                target.setEffect(new Effect("REVERSE", target));
        }

        if (!(target instanceof SpecialPower || target instanceof Ball))
        {
            return true;
        }
        return false;
    }
}

export class UISpark extends Spark {
    public displayObject: PIXI.Sprite;
    constructor(center: Vector2D, velocity: Vector2D, shooter: Bar) {
        super(center, velocity, shooter);
        this.displayObject = new PIXI.Sprite(SparkTex);
        this.displayObject.anchor.set(0.5);
        this.displayObject.x = center.x;
        this.displayObject.y = center.y;
        console.log(this)
    }

    update(delta: number): boolean {
        if (super.update(delta) === false) { return false; }
        this.displayObject.x = this.center.x;
        this.displayObject.y = this.center.y;
        return true;
    }

    onCollide(target: GameObject): boolean {
        console.log("not collide")
        if (super.onCollide(target) === true)
        {
            this.game.remove(this);
            return true;
        }
        return false;
    }
}
