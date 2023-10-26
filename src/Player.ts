import * as PIXI from 'pixi.js';
import { Bar } from "./Bar";
import { Vector2D } from "./Vector";
import { BubbleTex } from "./main";
import { Game } from "./Game";
import { Bubble } from './Bubble';
import { Mana } from './Mana';

const UP    = new Vector2D(0, -5);
const DOWN  = new Vector2D(0, 5);
const STOP  = new Vector2D(0, 0);

type KeyState = {
    w: boolean,
    s: boolean,
    a: boolean,
    q: boolean,
    ArrowUp: boolean,
    ArrowDown: boolean,
    ArrowLeft: boolean,
    ArrowRight: boolean,
    Enter: boolean
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

    constructor (texture: PIXI.Texture, x: number, y: number, tag: string, public direction: Vector2D)
    {
        super(texture, x, y, tag, direction);
    }

    onKeyDown(e: KeyboardEvent): void {
        
        this.keyPressed[e.key] = true;
        
        // special powers are here to not spam the screen
        if (this.keyPressed['q'] && this.tag === "Player1" && this.mana.mana >= 20) {
            const bubble = new Bubble("Bubble", BubbleTex, new Vector2D(this.center.x + 40, this.center.y))
            Game.add(bubble);
            this.mana.spendMana(20);
        }
        else if (this.keyPressed['ArrowRight'] && this.tag === "Player2" && this.mana.mana >= 20) {
            const bubble = new Bubble("Bubble", BubbleTex, new Vector2D(this.center.x - 40, this.center.y), new Vector2D(-5,0))
            Game.add(bubble);
            this.mana.spendMana(20);
        }
    }

    onKeyUp(e: KeyboardEvent): void {

        this.keyPressed[e.key] = false;
    }

    update(delta: number): void {
    
        if (this.tag === "Player1")
        {
            if      (this.keyPressed['w'])  {this.setMove(true); this.setVelocity(UP);  }
            else if (this.keyPressed['s'])  {this.setMove(true); this.setVelocity(DOWN);}
            else                            {this.setMove(false); this.setVelocity(STOP);}
            if      (this.keyPressed['a'])  {this.setAcceleration(2);}
            else                            {this.setAcceleration(1);}
        }
        else if (this.tag === "Player2")
        {
            if      (this.keyPressed['ArrowUp'])     {this.setMove(true); this.setVelocity(UP);}
            else if (this.keyPressed['ArrowDown'])   {this.setMove(true); this.setVelocity(DOWN);}
            else                                     {this.setMove(false); this.setVelocity(STOP);}   
            if      (this.keyPressed['ArrowLeft'])   {this.setAcceleration(2);}
            else                                     {this.setAcceleration(1);}
        }

        if (this.move && this.checkArenaCollision()) {
            this.displayObject.y += this.move ? (this.velocity.y * this.acceleration * delta) : 0;
            this.setCenter(new Vector2D(this.displayObject.x, this.displayObject.y));
        }

        this.mana.update(this.tag);
    }

}