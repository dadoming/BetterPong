import * as PIXI from 'pixi.js';
import { BallPolygon } from './Polygon';
import { Collider } from './Collider';
import { Vector2D } from './Vector';

export abstract class GameObject {

    protected move: boolean;
    protected acceleration: number;
    protected position: { x: number, y: number}
    protected velocity: Vector2D;
    public collider: Collider;
    protected scale: number;

    constructor(public tag: string, protected displayObject: PIXI.Container ) {
        this.move = false;
        this.acceleration = 0;
        this.position = { x: 0, y: 0 };
        this.velocity = Vector2D.Zero;
        this.collider = Collider.fromPolygon(new BallPolygon(this.position, 0, 0, []));
        this.scale = 1;
    }

    setAcceleration(acceleration: number) {
        this.acceleration = acceleration;
    }
    setMove(move: boolean) {
        this.move = move;
    }
    setVelocity(velocity: { x: number, y: number}) {
        this.velocity = new Vector2D(velocity.x, velocity.y);
    }
    setPosition(position: { x: number, y: number}) {
        this.position = position;
    }
    setScale(scale: number) {
        this.scale = scale;
    }

    get getAcceleration() {
        return this.acceleration;
    }
    get getMove() {
        return this.move;
    }
    get getPosition() {
        return this.position;
    }
    get getVelocity() {
        return this.velocity;
    }
    get getPolygon() {
        return this.collider.polygon;
    }
    get getDisplayObject() {
        return this.displayObject;
    }
    get getScale() {
        return this.scale;
    }

    abstract update(delta: number, windowHeight: number, windowWidth: number, allObjects: GameObject[]): void;
    abstract updatePolygon(position: { x: number, y: number}): void;
}
