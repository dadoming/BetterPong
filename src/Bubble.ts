import * as PIXI from "pixi.js";
import { GameObject } from "./GameObject";
import { Vector2D } from "./Vector";
import { BallPolygon } from "./Polygon";
import { Game } from "./main";
import { BALL_VERTICES } from "./Ball";


export class Bubble extends GameObject {
    constructor(tag: string, texture: PIXI.Texture, center: Vector2D, velocity?: Vector2D) {
        const sprite = PIXI.Sprite.from(texture);
        sprite.anchor.set(0.5);
        sprite.x = center.x;
        sprite.y = center.y;
        super(tag, sprite);

        this._move = true;
        this.direction = Vector2D.Zero;
        this.center = center;
        this.acceleration = 1.5;
        this.velocity = velocity || new Vector2D(5, 0);
        this.height = this.displayObject.height;
        this.width = this.displayObject.width;
        this.collider.polygon = new BallPolygon(this.center, this.width, BALL_VERTICES, []);
        this.collider.updateBoundingBox();
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

    onCollide(target: GameObject, line: { start: Vector2D; end: Vector2D; }): void {

        if (!(target instanceof Bubble))
        {
            Game.remove(this);
        }
    }
}