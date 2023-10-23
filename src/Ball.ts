import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject';
import { BallPolygon } from './Polygon';
import { Vector2D } from './Vector';

import { score } from './main';

export const BALL_VERTICES = 20;

export class Ball extends GameObject {
    constructor(x: number, y: number, texture: PIXI.Texture) {
        const sprite = PIXI.Sprite.from(texture);
        sprite.anchor.set(0.5);
        sprite.x = x;
        sprite.y = y;
        super('Bolinha', sprite);

        this.center = new Vector2D(x, y);

        this.velocity = new Vector2D(5, 0);
        this.acceleration = 1;
        this._move = true;
        this.height = this.displayObject.height;
        this.width = this.displayObject.width;
        this.collider.polygon = new BallPolygon(this.center, this.width, BALL_VERTICES, []);
        this.collider.updateBoundingBox();
    }

    get randomVelocity(): Vector2D {
        const randX = (Math.random() * 3 + 3) * (Math.random() < 0.5 ? -1 : 1);
        const randY = (Math.random() * 1 + 3) * (Math.random() < 0.5 ? -1 : 1);

        //console.log(`randX: ${randX} randY: ${randY}`);

        return new Vector2D(randX, randY);
    }

    resetBall(x: number, windowWidth: number, windowHeight: number, allObjects: GameObject[]): boolean {
        if (x <= 0) {
            //allObjects.forEach(element => { if (element.tag === 'Player2') {
            //    if (element.getScale >= 0.82) { element.setScale(element.getScale - 0.02); }}
            //});
            score[1] += 1;
        } else {
            //allObjects.forEach(element => { if (element.tag === 'Player1') {
            //    if (element.getScale >= 0.82) { element.setScale(element.getScale - 0.02);}}
            //});
            score[0] += 1;
        }
        //this.setCenter(new Vector2D(windowWidth / 2, windowHeight / 2));
        this.acceleration = 1;
        this.velocity = new Vector2D(5, 0);
        return true;
    }

  

    updatePolygon(newCenter: Vector2D): void {
        this.collider.polygon.update(newCenter);
        this.collider.updateBoundingBox();
    }

    update(delta: number): void {
        this.setCenter(
            new Vector2D(
                this.center.x + (this.move ? this.velocity.x * this.acceleration * delta : 0),
                this.center.y + (this.move ? this.velocity.y * this.acceleration * delta : 0)
            )
        );
        
    }


    onCollide(target: GameObject, line: { start: Vector2D; end: Vector2D; }): void {
        this.setMove(false);
    }

    onKeyDown(e: KeyboardEvent): void {
            if (e.key === 'w')          {this.setCenter(new Vector2D(this.center.x, this.center.y - 1 )); }
            if (e.key === 's')          {this.setCenter(new Vector2D(this.center.x, this.center.y + 1)); }
            if (e.key === 'a')          {this.setCenter(new Vector2D(this.center.x - 1, this.center.y )); }
            if (e.key === 'd')          {this.setCenter(new Vector2D(this.center.x + 1, this.center.y )); }
    }

}
