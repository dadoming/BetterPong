import * as PIXI from 'pixi.js';
import { BallPolygon } from './Polygon';
import { Collider } from './Collider';
import { Vector2D } from './utils/Vector';

export abstract class GameObject {
    protected _move: boolean;
    protected acceleration: number;
    protected center: Vector2D;
    protected velocity: Vector2D;
    protected direction: Vector2D;
    protected scale: number;
    protected height: number;
    protected width: number;
    public collider: Collider;

    constructor(public tag: string, protected displayObject: PIXI.Container) {
        this._move = false;
        this.acceleration = 0;
        this.scale = 1;
        this.direction = Vector2D.Zero;
        this.center = Vector2D.Zero;
        this.velocity = Vector2D.Zero;
        this.height = 0;
        this.width = 0;
        this.collider = Collider.fromPolygon(new BallPolygon(this.center, 0, 0, []));
        this.collider.lastCollision = false;
    }

    setMove(move: boolean): void {
        this._move = move;
    }
    
    setCenter(center: Vector2D): void {
        this.center = center;
        this.setDisplayObjectCoords(this.center);
        this.updatePolygon(this.center);
    }

    setVelocity(velocity: Vector2D): void {
        this.velocity = velocity;
    }
    setAcceleration(acceleration: number): void {
        this.acceleration = acceleration;
    }
    setDisplayObjectCoords(coords: Vector2D): void {
        this.displayObject.x = coords.x;
        this.displayObject.y = coords.y;
    }
    setScale(scale: number): void {
        this.scale = scale;
    }

    get move(): boolean {
        return this._move;
    }
    get getCenter(): Vector2D {
        return this.center;
    }
    get getVelocity(): Vector2D {
        return this.velocity;
    }
    get getPolygon(): BallPolygon {
        return this.collider.polygon;
    }
    get getDirection(): Vector2D {
        return this.direction;
    }
    get getAcceleration(): number {
        return this.acceleration;
    }
    get getDisplayObject(): PIXI.Container {
        return this.displayObject;
    }
    get getScale(): number {
        return this.scale;
    }

    get getHeight(): number {
        return this.height;
    }

    get getWidth(): number {
        return this.width;
    }

    abstract update(delta: number): void;
    abstract updatePolygon(center: { x: number; y: number }): void;
    onCollide?(target: GameObject, line: { start: Vector2D; end: Vector2D }): void;
    onKeyDown?(e: KeyboardEvent): void;
    onKeyUp?(e: KeyboardEvent): void;
}
