import * as PIXI from 'pixi.js';
import { Bar } from "./Bar";
import { Vector2D } from "../utils/Vector";
import { Bubble } from '../SpecialPowers/Bubble';
import { Ice } from '../SpecialPowers/Ice';

const UP    = new Vector2D(0, -5);
const DOWN  = new Vector2D(0, 5);
const STOP  = new Vector2D(0, 0);

interface KeyState {
    [key: string]: boolean;    
}

export class Player extends Bar
{
    private keyPressed: KeyState = {
        w: false,
        s: false,
        a: false,
        q: false,
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Enter: false
    };

    constructor (
        texture: PIXI.Texture, x: number, y: number, tag: string, public direction: Vector2D, specialPower: Bubble | Ice | undefined)
    {
        super(texture, x, y, tag, direction);
        this.specialPower = specialPower;
    }

    onKeyDown(e: KeyboardEvent): void {
        
        this.keyPressed[e.key] = true;
        
        // special powers are here to not spam the screen
        if (this.keyPressed['q'] && this.tag === "Player1" && this.specialPower != undefined) {
            this.specialPower.shootPower(this.center, this.mana, this.direction.x);
        }
        else if (this.keyPressed['ArrowRight'] && this.tag === "Player2" && this.specialPower != undefined) {
            this.specialPower.shootPower(this.center, this.mana, this.direction.x);
        }
    }

    onKeyUp(e: KeyboardEvent): void {

        this.keyPressed[e.key] = false;
    }

    update(delta: number): void {
    
        if (this.tag === "Player1")
        {
            if      (this.keyPressed['w'])  {this.setMove(true); this.setVelocity(UP.multiply(this.effectVelocity));  }
            else if (this.keyPressed['s'])  {this.setMove(true); this.setVelocity(DOWN.multiply(this.effectVelocity));}
            else                            {this.setMove(false); this.setVelocity(STOP);}
            if      (this.keyPressed['a'])  {if (this.energy.energy > 2) {this.setAcceleration(2); this.energy.spendEnergy(2)}}
            else                            {this.setAcceleration(1);}
        }
        else if (this.tag === "Player2")
        {
            if      (this.keyPressed['ArrowUp'])     {this.setMove(true); this.setVelocity(UP.multiply(this.effectVelocity));}
            else if (this.keyPressed['ArrowDown'])   {this.setMove(true); this.setVelocity(DOWN.multiply(this.effectVelocity));}
            else                                     {this.setMove(false); this.setVelocity(STOP);}   
            if      (this.keyPressed['ArrowLeft'])   {if (this.energy.energy > 2) {this.setAcceleration(2); this.energy.spendEnergy(2)}}
            else                                     {this.setAcceleration(1);}
        }

        if (this.move && this.checkArenaCollision()) {
            this.displayObject.y += this.move ? (this.velocity.y * this.acceleration * delta) : 0;
            this.setCenter(new Vector2D(this.displayObject.x, this.displayObject.y));
        }

        this.mana.update(this.tag, delta);
        this.energy.update(this.tag, delta);
        if (this.energy.energy <= 2) { this.keyPressed['a'] = false; }
        if (this.energy.energy <= 2) { this.keyPressed['ArrowLeft'] = false; }

        if (this.effect !== undefined) {
            this.effect.update(delta, this);
        }
    }

}