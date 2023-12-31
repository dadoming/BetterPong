import { BallPolygon } from './Collisions/Polygon';
import { Collider } from './Collisions/Collider';
import { Vector2D } from './utils/Vector';
import { Effect } from './SpecialPowers/Effect';
import { Game } from './Game';

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

    protected hitAmount: number = 0;
    protected effect: Effect | undefined;
    protected effectVelocity: Vector2D = new Vector2D(1, 1);

    constructor(public tag: string, public readonly game: Game) {
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
        this.effect = undefined;
    }

    get getEffect(): Effect | undefined {
        return this.effect;
    }
    setEffect(effect: Effect | undefined): void {
        this.effect = effect;
    }
    get hitAmountEffect(): number {
        return this.hitAmount;
    }
    increaseHitAmount(): void {
        this.hitAmount += 1;
    }
    decreaseHitAmount(): void {
        this.hitAmount -= 1;
    }
    setEffectVelocity(velocity: Vector2D): void {
        this.effectVelocity = velocity;
    }

    setMove(move: boolean): void {
        this._move = move;
    }
    
    setCenter(center: Vector2D): void {
        this.center = center;
        this.updatePolygon(this.center);
    }

    setVelocity(velocity: Vector2D): void {
        this.velocity = velocity;
    }
    setAcceleration(acceleration: number): void {
        this.acceleration = acceleration;
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
    onDestroy?(): void;
}
