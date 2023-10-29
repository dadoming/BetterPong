import * as PIXI from 'pixi.js';
import { GameObject } from './GameObject';
import { BarPolygon } from './Polygon';
import { Vector2D } from './utils/Vector';
import { Mana } from './Mana';
import { Ice } from './SpecialPowers/Ice';
import { Bubble } from './SpecialPowers/Bubble';
import { Energy } from './Energy';
import { Effect } from './SpecialPowers/Effect';

export class Bar extends GameObject {

    protected mana: Mana;
    protected energy: Energy;
    protected specialPower: Bubble | Ice | undefined;
    
    protected hitAmount: number = 0;
    protected effect: Effect | undefined;
    protected effectVelocity: Vector2D = new Vector2D(0, 1);

    constructor(texture: PIXI.Texture, x: number, y: number, tag: string, public direction: Vector2D) {
        const sprite = PIXI.Sprite.from(texture);
        sprite.anchor.set(0.5);
        sprite.x = x;
        sprite.y = y;
        super(tag, sprite);
        
        this._move = false;
        this.acceleration = 1;
        this.center = new Vector2D(x, y);
        this.velocity = Vector2D.Zero;
        this.direction = direction;
        this.scale = 1;
        this.height = this.displayObject.height;
        this.width = this.displayObject.width;
        this.collider.polygon = new BarPolygon(this.center, this.displayObject.width, this.displayObject.height, this.direction);
        this.collider.updateBoundingBox();
        this.mana = new Mana(this.tag);
        this.energy = new Energy(this.tag);
        this.specialPower = undefined;
        this.effect = undefined;
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

    get getEffect(): Effect | undefined {
        return this.effect;
    }
    setEffect(effect: Effect): void {
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

    updatePolygon(center: Vector2D): void {
        this.collider.polygon.update(center);
        this.collider.updateBoundingBox();
    }

    update(delta: number): void { 
        if (this.move && this.checkArenaCollision()) {
            this.displayObject.y += this.move ? (this.velocity.y * this.acceleration * delta) : 0 ;
            this.setCenter(new Vector2D(this.displayObject.x, this.displayObject.y));
        }
        this.mana.update(this.tag, delta);
        this.energy.update(this.tag, delta);
        if (this.effect !== undefined) {
            this.effect.update(delta, this);
        }
    }

    checkArenaCollision(): boolean {
        if (this.collider.line && this.collider.intersection)
        {
            if (this.collider.intersection.y < this.getCenter.y &&  this.velocity.y < 0)
                return false;
            if (this.collider.intersection.y > this.getCenter.y &&  this.velocity.y > 0)
                return false;
        }
        return true;
    }
}


