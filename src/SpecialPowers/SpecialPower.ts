import { GameObject } from "../GameObject";
import { Vector2D } from "../utils/Vector";
import * as PIXI from "pixi.js";
import { BallPolygon } from "../Polygon";
import { BALL_VERTICES } from "../Ball";
import { Game } from "../Game";
import { Line } from "../utils/types";
import { Mana } from "../Mana";


export abstract class SpecialPower extends GameObject {
    constructor(tag: string, texture: PIXI.Texture, center: Vector2D, velocity?: Vector2D) {
        const sprite = PIXI.Sprite.from(texture);
        sprite.anchor.set(0.5);
        sprite.x = center.x;
        sprite.y = center.y;
        super(tag, sprite);

        this.center = center;
        this._move = true;
        this.direction = Vector2D.Zero;
        this.center = center;
        this.acceleration = 1.5;
        this.velocity = velocity || new Vector2D(5, 0);
        this.height = this.displayObject.height;
        this.width = this.displayObject.width;
        this.collider.polygon = new BallPolygon(this.center, this.width, BALL_VERTICES, []);
        this.collider.updateBoundingBox();
        this.collider.lastCollision = undefined;
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

    abstract shootPower(center: Vector2D, mana: Mana, direction: number): void
    onCollide(target: GameObject, line: Line): void {
        if (!(target instanceof SpecialPower)) Game.remove(this);
    }
}
