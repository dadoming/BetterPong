import * as PIXI from 'pixi.js';
import { Bar } from "./Bar";
import { Vector2D } from "../utils/Vector";
import { SpecialPowerType } from '../SpecialPowers/SpecialPower';
import { Game, UIGame } from '../Game';
import { UIMana } from './Mana';
import { UIEnergy } from './Energy';
import { UIShooter } from '../SpecialPowers/Shooter';
import { UIGameObject } from '../GameObject';


/* ----------------- Velocity ----------------- */
const UP    = new Vector2D(0, -5);
const DOWN  = new Vector2D(0, 5);
const STOP  = new Vector2D(0, 0);

/* ------------------- Keys ------------------- */
interface KeyState {
    [key: string]: boolean;    
}
export interface KeyControls {
    up: string;
    down: string;
    boost: string;
    shoot: string;
}

/* ------------------- Player ------------------- */
export class Player extends Bar
{
    private keyPressed: KeyState = {
        up: false,
        down: false,
        boost: false,
        shoot: false,
    };
    constructor (
        x: number, y: number, public keys: KeyControls, tag: string, public direction: Vector2D, specialPower: SpecialPowerType, game: Game)
    {
        super(x, y, tag, direction, game);
        this.specialPowerType = specialPower;
    }

    onKeyDown(e: KeyboardEvent): void {
        
        this.keyPressed[e.key] = true;
        
        if (this.keyPressed[this.keys.shoot]) {
            if (this.isShooting === false && this.shooter === undefined && this.hasEnoughMana())
            {
                if (this.specialPowerType !== undefined)
                {
                    this.power = Bar.create(this.specialPowerType, this.center, this.direction.x, this);
                    if (this.power !== undefined)
                    {
                        this.game.add(this.power as unknown as UIGameObject);
                        this.spendMana();
                    }
                }
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
        if      (this.keyPressed[this.keys.boost])  {if (this.energy.energy > 2 && this.move) {this.setAcceleration(2); this.energy.spendEnergy(2 * this.game.delta)}}
        else                            {this.setAcceleration(1);}
    }

    update(delta: number): boolean {
        
        let ret = false;

        if (this.isShooting === false)
        {
            this.executeMovement();
        }

        if (this.move && this.checkArenaCollision()) {
            this.center.y += this.move ? (this.velocity.y * this.acceleration * delta) : 0;
            ret = true;
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
        return ret;
    }
}

export class UIPlayer extends Player {
    public displayObject: PIXI.Sprite;
    
    public mana: UIMana;
    public energy: UIEnergy;
    public shooter: UIShooter | undefined;
    
    constructor (texture: PIXI.Texture, x: number, y: number, public keys: KeyControls, tag: string, public direction: Vector2D, specialPower: SpecialPowerType, uigame: UIGame)
    {
        super(x, y, keys, tag, direction, specialPower, uigame);
        this.displayObject = new PIXI.Sprite(texture);
        this.displayObject.anchor.set(0.5);
        this.displayObject.x = this.center.x;
        this.displayObject.y = this.center.y;
        this.mana = new UIMana(tag, uigame);
        this.energy = new UIEnergy(tag, uigame);
        this.shooter = undefined;
    }

    setScaleDisplayObject(scale: number): void {
        this.displayObject.height = this.height * scale;
        this.displayObject.width = this.width;
    }

    setDisplayObjectCoords(center: Vector2D): void {
        this.displayObject.x = center.x;
        this.displayObject.y = center.y;
    }

    setScale(scale: number): void {
        super.setScale(scale);
        this.setScaleDisplayObject(scale);
        this.setDisplayObjectCoords(this.center);
    }

    update(delta: number): boolean {
        if (super.update(delta) === true)
        {
            this.displayObject.y = this.center.y;
            this.updatePolygon(this.center);
            
        }
        this.mana.update(this.tag, delta);
        this.energy.update(this.tag, delta);
        if (this.shooter !== undefined) {
            console.log(this)
            this.shooter.update(delta, this);
            this.displayObject.y = this.center.y;
        }
        return true;
    }
    
}