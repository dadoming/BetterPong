import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject';
import { BallPolygon } from './Polygon';
import { Vector2D } from './Vector';

const BALL_RADIUS = 8;
const BALL_VERTICES = 10;

export class Ball extends GameObject {
    constructor(x: number, y: number) {
        const bolinha = new PIXI.Graphics();
        bolinha.lineStyle(2);
        bolinha.beginFill(0xff0000);
        bolinha.drawCircle(x, y, BALL_RADIUS);
        bolinha.endFill();
        super('Bolinha', bolinha);
        //const sprite = PIXI.Sprite.from(texture);
        //this.sprite.anchor.set(0.5);
        //this.sprite.x = x;
        //this.sprite.y = y;
        this.position = { x: x, y: y };
        this.velocity = new Vector2D(4.5, -5.5);
        this.acceleration = 1;
        this.move = true;
        this.collider.polygon = new BallPolygon(
            this.position,
            BALL_RADIUS,
            BALL_VERTICES,
            []
        );
        this.collider.updateBoundingBox();
    }

    collisionDetection(
        allObjects: GameObject[],
        windowHeight: number,
        windowWidth: number,
        delta: number
    ) : boolean {
        for (let i = 0; i < this.getPolygon.getPoints.length; i += 2) {
            const x = this.getPolygon.getPoints[i];
            if (x <= 0 || x >= windowWidth) {
                this.position.x = windowWidth / 2;
                this.position.y = windowHeight / 2;
                //this.polygon.update(this.position, this.scale);
                return true;
            }
            for (const obj of allObjects) {
                const [collides, point, normal] = this.collider.collides(
                    obj.collider
                );
                if (!collides) continue;
                //console.log(point, normal);
                //this.move = false;
                this.velocity = this.velocity.reflect(normal);
                
                this.position.x += (this.velocity.x * this.acceleration) * delta;
                this.position.y += (this.velocity.y * this.acceleration) * delta;
                console.log('Collision detected');
                return true;
            }
        }
        return false;
    }

    updatePolygon(position: { x: number; y: number }): void {
        this.collider.polygon.update(position, this.scale);
        this.collider.boundingBox.center = new Vector2D(position.x, position.y);
    }

    update(
        delta: number,
        windowHeight: number,
        windowWidth: number,
        allObjects: GameObject[]
    ) {
        if (this.collisionDetection(allObjects, windowHeight, windowWidth, delta)) {
            this.updatePolygon(this.position);
            this.getDisplayObject.x = this.position.x - windowWidth / 2;
            this.getDisplayObject.y = this.position.y - windowHeight / 2;
            return;
        }
        this.position.x += this.move
        ? this.velocity.x * this.acceleration * delta
        : 0;
        this.position.y += this.move
        ? this.velocity.y * this.acceleration * delta
        : 0;
        this.updatePolygon(this.position);

        // mudar isto quando implementar a sprite
        this.getDisplayObject.x = this.position.x - windowWidth / 2;
        this.getDisplayObject.y = this.position.y - windowHeight / 2;

        //this.setPosition(this.displayObject);

        //this.getDisplayObject.x = this.position.x - windowWidth / 2;
        //this.getDisplayObject.y = this.position.y - windowHeight / 2;
    }
}
