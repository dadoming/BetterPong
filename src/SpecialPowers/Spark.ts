import { GameObject } from "../GameObject";
import { Vector2D } from "../utils/Vector";
import { Game } from "../Game";
import { SparkTex } from "../main";
import { SpecialPower } from "./SpecialPower";
import { Bar } from "../Paddles/Bar";
import { Effect } from "./Effect";
import { Ball } from "../Ball";

export class Spark extends SpecialPower {
    constructor(center: Vector2D, velocity: Vector2D, shooter: Bar) {
        super("Spark", SparkTex, center, velocity, shooter);
    }

    onCollide(target: GameObject): void {

        if (target instanceof Bar)
        {
            if (target.getEffect === undefined)
                target.setEffect(new Effect("REVERSE", target));
        }

        if (!(target instanceof SpecialPower || target instanceof Ball))
        {
            Game.remove(this);
        }
    }
}