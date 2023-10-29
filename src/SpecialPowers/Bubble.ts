import { GameObject } from "../GameObject";
import { Vector2D } from "../utils/Vector";
import { Game } from "../Game";
import { SpecialPower } from "./SpecialPower";
import { BubbleTex } from "../main";
import { Mana } from "../Mana";

export class Bubble extends SpecialPower {
    constructor(center: Vector2D, velocity?: Vector2D) {
        super("Bubble", BubbleTex, center, velocity);
    }

    shootPower(center: Vector2D, mana: Mana, direction: number): void {
        if (mana.mana < 20) return;
        const bubble = new Bubble(new Vector2D(center.x + (40 * direction), center.y), new Vector2D(direction === 1 ? 5 : -5, 0));
        Game.add(bubble);
        mana.spendMana(20);
    }

    onCollide(target: GameObject): void {
        if (!(target instanceof SpecialPower)){
            Game.remove(this);
        }
    }
}