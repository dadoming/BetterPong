// Fazer com que o poder seja fazer reverse no movimento do player

import { GameObject } from "../GameObject";
import { Vector2D } from "../utils/Vector";
import { Game } from "../Game";
import { SparkTex } from "../main";
import { Mana } from "../Mana";
import { SpecialPower } from "./SpecialPower";
import { Bar } from "../Bar";
import { Effect } from "./Effect";

export class Spark extends SpecialPower {
    constructor(center: Vector2D, velocity?: Vector2D) {
        super("Spark", SparkTex, center, velocity);
    }

    shootPower(center: Vector2D, mana: Mana, direction: number): void {
        if (mana.mana < 40) return;
        const spark = new Spark(new Vector2D(center.x + (40 * direction), center.y), new Vector2D(direction === 1 ? 5 : -5, 0));
        Game.add(spark);
        mana.spendMana(40);
    }

    onCollide(target: GameObject): void {

        if (target instanceof Bar)
        {
            if (target.getEffect === undefined)
                target.setEffect(new Effect("REVERSE", target));
            else
                target.setEffect(new Effect("REVERSE-SLOW", target));
        }

        if (!(target instanceof SpecialPower))
        {
            Game.remove(this);
        }
    }
}