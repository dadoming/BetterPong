import * as PIXI from 'pixi.js';
import { Bar } from "./Bar";
import { Vector2D } from "./Vector";
import { Game, BubbleTex } from "./main";
import { Bubble } from './Bubble';

export class Player extends Bar
{
    constructor (texture: PIXI.Texture, x: number, y: number, tag: string, public direction: Vector2D)
    {
        super(texture, x, y, tag, direction);
    }

    onKeyDown(e: KeyboardEvent): void {
        if (this.tag === "Player1")
        {
            if (e.key === 'w')          {this.setMove(true); this.setVelocity(new Vector2D(0, -5));}
            if (e.key === 's')          {this.setMove(true); this.setVelocity(new Vector2D(0, 5));}
            if (e.key === 'a')          {this.setAcceleration(1);}

            if (e.key === 'q')          {
                const bubble = new Bubble("Bubble", BubbleTex, new Vector2D(this.center.x + 50, this.center.y))
                Game.add(bubble);
            }
        }
        else if(this.tag === "Player2")
        {
            if (e.key === 'ArrowUp')    {this.setMove(true); this.setVelocity(new Vector2D(0, -5));}
            if (e.key === 'ArrowDown')  {this.setMove(true); this.setVelocity(new Vector2D(0, 5));}
            if (e.key === 'ArrowLeft')  {this.setAcceleration(1);}
            if (e.key === 'ArrowRight') {
                const bubble = new Bubble("Bubble", BubbleTex, new Vector2D(this.center.x - 50, this.center.y), new Vector2D(-5,0))
                Game.add(bubble);
            }
        }
    }

    onKeyUp(e: KeyboardEvent): void {
        if (e.key === 'w')          {this.setMove(false); this.setVelocity(new Vector2D(0, 0));}
        if (e.key === 's')          {this.setMove(false); this.setVelocity(new Vector2D(0, 0));}
        if (e.key === 'a')          {this.setAcceleration(1);}
        //if (e.key === 'q')          {}
        if (e.key === 'ArrowUp')    {this.setMove(false); this.setVelocity(new Vector2D(0, 0));}
        if (e.key === 'ArrowDown')  {this.setMove(false); this.setVelocity(new Vector2D(0, 0));}
        if (e.key === 'ArrowLeft')  {this.setAcceleration(1);}
        //if (e.key === 'Enter')      {}
    }
}