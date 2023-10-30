import * as PIXI from 'pixi.js';
import { Bar } from "./Bar";
import { Vector2D } from "../utils/Vector";
import { SpecialPowerType } from '../SpecialPowers/SpecialPower';
import { Game } from '../Game';

const UP    = new Vector2D(0, -5);
const DOWN  = new Vector2D(0, 5);
const STOP  = new Vector2D(0, 0);

interface KeyState {
    [key: string]: boolean;    
}

export interface KeyControls {
    up: string;
    down: string;
    boost: string;
    shoot: string;
}

export class Player extends Bar
{
    private keyPressed: KeyState = {
        up: false,
        down: false,
        boost: false,
        shoot: false,
    };

    constructor (
        texture: PIXI.Texture, x: number, y: number, public keys: KeyControls, tag: string, public direction: Vector2D, specialPower: SpecialPowerType)
    {
        super(texture, x, y, tag, direction);
        this.specialPowerType = specialPower;

    }

    onKeyDown(e: KeyboardEvent): void {
        
        this.keyPressed[e.key] = true;
        
        // special powers are here to not spam the screen
        if (this.keyPressed[this.keys.shoot]) {
            if (this.isShooting === false && this.shooter === undefined && this.hasEnoughMana())
            {
                if (this.specialPowerType !== undefined)
                {
                    this.power = Bar.create(this.specialPowerType, this.center, this.direction.x, this);
                    if (this.power !== undefined)
                    {
                        Game.add(this.power);
                        this.spendMana();
                    }
                }
                console.log("shooting");
            }
            else if (this.isShooting === true)
            {
                this.shooter?.shootBall(this);
            }
        }
    }

    onKeyUp(e: KeyboardEvent): void {
        this.keyPressed[e.key] = false;
    }

    executeMovement():void {
        if      (this.keyPressed[this.keys.up])  {this.setMove(true); this.setVelocity(UP.multiply(this.effectVelocity));  }
        else if (this.keyPressed[this.keys.down])  {this.setMove(true); this.setVelocity(DOWN.multiply(this.effectVelocity));}
        else                            {this.setMove(false); this.setVelocity(STOP);}
        if      (this.keyPressed[this.keys.boost])  {if (this.energy.energy > 2) {this.setAcceleration(2); this.energy.spendEnergy(2)}}
        else                            {this.setAcceleration(1);}
    }

    update(delta: number): void {
    
        if (this.isShooting === false)
        {
            this.executeMovement();
        }

        if (this.move && this.checkArenaCollision()) {
            this.displayObject.y += this.move ? (this.velocity.y * this.acceleration * delta) : 0;
            this.setCenter(new Vector2D(this.displayObject.x, this.displayObject.y));
        }

        this.mana.update(this.tag, delta);
        this.energy.update(this.tag, delta);
    
        if (this.energy.energy <= 2) { this.keyPressed[this.keys.boost] = false; }

        if (this.effect !== undefined) {
            this.effect.update(delta, this);
        }
        if (this.shooter !== undefined) {
            this.shooter.update(delta, this);
        }
    }

}