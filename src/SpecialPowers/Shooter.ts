import { Bar } from "../Paddles/Bar";
import { Vector2D } from "../utils/Vector";
import { Game } from "../Game";
import * as PIXI from 'pixi.js';
import { Ball } from "../Ball";

export class Shooter {
    private lineDraw: PIXI.Graphics = new PIXI.Graphics();
    private line: {start: Vector2D, end: Vector2D}
    private angle: number;
    private center: Vector2D;
    private direction: Vector2D = new Vector2D(1, 0);
    private ballRef: Ball | undefined;

    private upDown: number = 1;
    
    constructor(shooter: Bar)
    {
        this.line = {start: Vector2D.Zero, end: Vector2D.Zero};
        this.lineDraw = new PIXI.Graphics();
        this.angle = -(Math.PI / 4);
        this.ballRef = Game.getObjectByTag("Bolinha") as Ball;
        
        shooter.setCenter(new Vector2D(shooter.getCenter.x, Game.app.view.height / 2));
        this.ballRef.setCenter(new Vector2D(shooter.getCenter.x + (40 * shooter.direction.x), shooter.getCenter.y));
        
        this.ballRef.setMove(false);
        this.center = this.ballRef.getCenter;
        this.direction = shooter.direction;
        shooter.setVelocity(new Vector2D(0, 0));
    }
    
    shootBall(shooter: Bar): void
    {
        shooter.setShooter(undefined);
        shooter.setMove(true);
    
        this.ballRef?.setVelocity(new Vector2D(Math.cos(this.angle) * 10, Math.sin(this.angle) * 10));
        this.ballRef?.setMove(true);
        this.ballRef?.getEffect?.setStopEffect();
        this.ballRef?.setEffect(undefined);
        this.ballRef = undefined;
        this.lineDraw.clear();
    }
    
    update(delta: number, shooter: Bar)
    {
        if (shooter.isShooting === true)
        {
            const lineLength = 60;
            const angleIncrement = 0.05;
            
            this.angle += angleIncrement * this.direction.x * delta * this.upDown;

            if (this.direction.x === 1)
            {
                if (this.angle >= Math.PI / 4)
                {
                    this.angle = Math.PI / 4;
                    this.upDown = -1;
                }
                else if (this.angle <= -Math.PI / 4)
                {
                    this.angle = -Math.PI / 4;
                    this.upDown = 1;
                }
            }
            else if (this.direction.x === -1)
            {
                if (this.angle >= Math.PI * 5 / 4)
                {
                    this.angle = Math.PI * 5 / 4;
                    this.upDown = 1;
                }
                else if (this.angle <= Math.PI * 3 / 4)
                {
                    this.angle = Math.PI * 3 / 4;
                    this.upDown = -1;
                }
            }

            this.line = {
                    start: this.center,
                    end: new Vector2D(
                        this.center.x + (Math.cos(this.angle) * lineLength),
                        this.center.y + Math.sin(this.angle) * lineLength )};

            this.lineDraw.clear();
            this.lineDraw.lineStyle(4, 0xff0000, 1);
            this.lineDraw.moveTo(this.line.start.x, this.line.start.y);
            this.lineDraw.lineTo(this.line.end.x, this.line.end.y);
            
            Game.app.stage.addChild(this.lineDraw);
            console.log(this.ballRef?.getEffect?.isEffectOver);
            if (this.ballRef?.getEffect?.isEffectOver === true || this.ballRef?.getEffect === undefined)
            {
                console.log("effect over now shoot");
                this.shootBall(shooter);
            }
        }
        else
        {
            Game.app.stage.removeChild(this.lineDraw);
        }
    }
}