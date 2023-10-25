import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject';
import { ArenaPolygon, BarPolygon, Polygon } from './Polygon';
import { Vector2D } from './Vector';
import { Game } from './main';
import { Ball } from './Ball';
import { ArenaWall } from './Arena';

const BAR_VELOCITY = 4;

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

    //\collisionWithWall(delta: number): boolean {
    //\    for( let i = 0; i < this.getPolygon.getPoints.length; i += 2) {
    //\        const y = this.getPolygon.getPoints[i + 1] + ((this.velocity.y / 2) * this.acceleration * delta);
    //\        if (y <= 0 || y >= Game.height) {
    //\            return true;
    //\        }
    //\    }
    //\    return false;
    //\}

    update(delta: number): void { 
        // console.log(!this.collider.isCollider)
        if (this.move && this.checkArenaCollision()) {
            this.displayObject.y += this.move ? (this.velocity.y * this.acceleration * delta) : 0 ;
            this.setCenter(new Vector2D(this.displayObject.x, this.displayObject.y));
        }

    }

    checkArenaCollision(): boolean {
        if (this.collider.line && this.collider.intersection && this.collider.target)
        {
        //     console.log(this.collider.line.end)
        //     console.log(this.getCenter)
        //     console.log(this.collider.intersection)
            if (this.collider.intersection.y < this.getCenter.y && this.velocity.y < 0)
                return false;
            if (this.collider.intersection.y > this.getCenter.y && this.velocity.y > 0)
                return false;
        }
        
        return true;
    }
}


