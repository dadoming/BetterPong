import { GameObject } from "../GameObject";
import { Vector2D } from "../utils/Vector";
import { Game } from "../Game";
import { IceTex } from "../main";
import { SpecialPower } from "./SpecialPower";
import { Bar } from "../Paddles/Bar";
import { Effect } from "./Effect";
import { Ball } from "../Ball";

export class Ice extends SpecialPower {
    constructor(center: Vector2D, velocity: Vector2D, shooter: Bar) {
        super("Ice", IceTex, center, velocity, shooter);
    }

    onCollide(target: GameObject): void {

        if (target instanceof Bar)
        {
            if (target.getEffect === undefined)
                target.setEffect(new Effect("SLOW", target));
            else
                target.setEffect(new Effect("STOP", target));
        }

        if (!(target instanceof SpecialPower || target instanceof Ball))
        {
            Game.remove(this);
        }
    }
}