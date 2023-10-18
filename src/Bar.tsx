import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject';
import { BarPolygon } from './Polygon';
import { Vector2D } from './Vector';

// Falta definir o tamanho do poligono para a colisao com a bola

const BAR_VELOCITY = 4;

export class Bar extends GameObject {

    constructor(texture: PIXI.Texture, x: number, y: number, tag: string, public direction: Vector2D) {
        console.log(texture);
        const sprite = PIXI.Sprite.from(texture);
        sprite.anchor.set(0.5);
        sprite.x = x;
        sprite.y = y;
        super(tag, sprite);
        this.move = false;
        this.acceleration = 1;
        this.scale = 1;
        this.position = { x: x, y: y };
        this.velocity = new Vector2D(0, BAR_VELOCITY);
        this.collider.polygon = new BarPolygon(this.position, this.displayObject.width, this.displayObject.height, this.direction);
        this.collider.updateBoundingBox();

    }

    collisionWithWall(windowHeight: number): boolean {
        for( let i = 0; i < this.getPolygon.getPoints.length; i += 2) {
            const y = this.getPolygon.getPoints[i + 1] + ((this.velocity.y / 2) * this.acceleration);
            if (y <= 0 || y >= windowHeight) {
                return true;
            }
        }
        return false;
    }

    updatePolygon(position: { x: number; y: number; }): void {
        this.collider.polygon.update(position, this.scale);
        this.collider.boundingBox.center = new Vector2D(position.x, position.y);
        this.collider.center = new Vector2D(position.x, position.y);
    }

    update(delta: number, windowHeight: number) {
        if (this.move && (this.collisionWithWall(windowHeight) === false)) {
            this.displayObject.y += (this.move ? this.velocity.y * this.acceleration : 0) * delta;
            this.setPosition(this.displayObject);
            this.updatePolygon(this.position);
        }
    }
}