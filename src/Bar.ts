import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject';
import { BarPolygon } from './Polygon';
import { Vector2D } from './Vector';

const BAR_VELOCITY = 7;

export class Bar extends GameObject {

    constructor(texture: PIXI.Texture, x: number, y: number, tag: string, public direction: Vector2D) {
        const sprite = PIXI.Sprite.from(texture);
        sprite.anchor.set(0.5);
        sprite.x = x;
        sprite.y = y;
        super(tag, sprite);
        
        this._move = false;
        this.acceleration = 1;
        this.center = new Vector2D(x, y);
        this.velocity = new Vector2D(0, BAR_VELOCITY).normalize().multiply(6);
        this.direction = direction;
        this.scale = 1;
        this.height = this.displayObject.height;
        this.width = this.displayObject.width;
        this.collider.polygon = new BarPolygon(this.center, this.displayObject.width, this.displayObject.height, this.direction);
        this.collider.updateBoundingBox();
    }

    setScaleDisplayObject(scale: number): void {
        this.displayObject.height = this.height * scale;
        this.displayObject.width = this.width;
    }

    setScale(scale: number): void {
        this.scale = scale;
        this.height = this.height * scale;
        this.width = this.width * scale;
        this.collider.polygon = new BarPolygon(this.center, this.width, this.height, this.direction);
        this.collider.updateBoundingBox();
        
        this.setScaleDisplayObject(scale);
        this.setDisplayObjectCoords(this.center);
    }

    updatePolygon(center: Vector2D): void {
        this.collider.polygon.update(center);
        this.collider.updateBoundingBox();
    }

    update(delta: number): void { 
        if (this.move && this.checkArenaCollision()) {
            this.displayObject.y += this.move ? (this.velocity.y * this.acceleration * delta) : 0 ;
            this.setCenter(new Vector2D(this.displayObject.x, this.displayObject.y));
        }
    }

    checkArenaCollision(): boolean {
        if (this.collider.line && this.collider.intersection)
        {
            if (this.collider.intersection.y < this.getCenter.y && this.velocity.y < 0)
                return false;
            if (this.collider.intersection.y > this.getCenter.y && this.velocity.y > 0)
                return false;
        }
        return true;
    }
}


