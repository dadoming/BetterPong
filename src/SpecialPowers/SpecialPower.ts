import { GameObject } from "../GameObject";
import { Vector2D } from "../utils/Vector";
import * as PIXI from "pixi.js";
import { BallPolygon } from "../Collisions/Polygon";
import { BALL_VERTICES } from "../Ball";
import { Game } from "../Game";
import { Bar } from "../Paddles/Bar";

export type SpecialPowerType = "Spark" | "Bubble" | "Ice" | "Fire" | "Ghost" | undefined;

export abstract class SpecialPower extends GameObject {

    protected shooterObject: Bar;

    constructor(tag: string, texture: PIXI.Texture, center: Vector2D, velocity: Vector2D, shooter: Bar) {
        const sprite = PIXI.Sprite.from(texture);
        sprite.anchor.set(0.5);
        sprite.x = center.x;
        sprite.y = center.y;
        super(tag, sprite);

        this.center = center;
        this._move = true;
        this.direction = Vector2D.Zero;
        this.acceleration = 1.5;
        this.velocity = velocity || new Vector2D(5, 0);
        this.height = this.displayObject.height;
        this.width = this.displayObject.width;
        this.collider.polygon = new BallPolygon(this.center, this.width, BALL_VERTICES, []);
        this.collider.updateBoundingBox();
        this.collider.lastCollision = undefined;
        this.shooterObject = shooter;
    }

    updatePolygon(center: Vector2D): void {
        this.collider.polygon.update(center);
        this.collider.boundingBox.center = center;
        this.collider.center = center;
    }
    
    update(delta: number): void {
        if (!this.move) return;
        this.center = this.center.add(this.velocity.x * this.acceleration * delta, this.velocity.y * this.acceleration * delta);
        this.updatePolygon(this.center);
        this.collider.updateBoundingBox();
        this.setDisplayObjectCoords(this.center);
        if (this.center.x > Game.width || this.center.x < 0 || this.center.y > Game.height || this.center.y < 0) {
           Game.remove(this);
        }
    }

    onCollide(target: GameObject): void {
        if (!(target instanceof SpecialPower)) 
            Game.remove(this);
    }

}
