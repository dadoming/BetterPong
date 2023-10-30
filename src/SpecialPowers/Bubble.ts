import { GameObject } from "../GameObject";
import { Vector2D } from "../utils/Vector";
import { Game } from "../Game";
import { SpecialPower } from "./SpecialPower";
import { BubbleTex } from "../main";
import { Bar } from "../Paddles/Bar";

export class Bubble extends SpecialPower {
    constructor(center: Vector2D, velocity: Vector2D, shooter: Bar) {
        super("Bubble", BubbleTex, center, velocity, shooter);
    }

    onCollide(target: GameObject): void {
        if (!(target instanceof SpecialPower)){
            Game.remove(this);
        }
    }
}