import { GameObject } from "../GameObject";
import { Vector2D } from "../utils/Vector";
import { Game } from "../Game";
import { GhostTex } from "../main";
import { SpecialPower } from "./SpecialPower";
import { Bar } from "../Paddles/Bar";
import { Effect } from "./Effect";

export class Ghost extends SpecialPower {
    constructor(center: Vector2D, velocity: Vector2D, shooter: Bar) {
        super("Ghost", GhostTex, center, velocity, shooter);
        console.log("Ghost created");
    }

    onCollide(target: GameObject): void {

        if (!(target instanceof SpecialPower))
        {
            target.setEffect(new Effect("INVISIBLE", target));
            Game.remove(this);
        }
    }
}