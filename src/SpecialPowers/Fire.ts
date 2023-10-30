import { GameObject } from "../GameObject";
import { Vector2D } from "../utils/Vector";
import { Game } from "../Game";
import { FireTex } from "../main";
import { SpecialPower } from "./SpecialPower";
import { Effect } from "./Effect";
import { Ball } from "../Ball";
import { Bar } from "../Paddles/Bar";
import { Shooter } from "./Shooter";

export class Fire extends SpecialPower {
    
    constructor(center: Vector2D, velocity: Vector2D, public shooter: Bar) {
        super("Fire", FireTex, center, velocity, shooter);
    }

    onCollide(target: GameObject): void {

        if (target instanceof Ball)
        {
            if (target.getEffect === undefined || target.getEffect.name !== "FIRE-CANNON")
            {
                target.setEffect(new Effect("FIRE-CANNON", target));
                this.shooter.setShooter(new Shooter(this.shooter));
            }
        }

        if (!(target instanceof SpecialPower))
        {
            Game.remove(this);
        }
    }
}
