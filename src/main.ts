import * as PIXI from 'pixi.js';
import { Bar } from './Bar';
import { Ball } from './Ball';
import { GameObject } from './GameObject';
import { Vector2D } from './Vector';
import { ArenaWall } from './Arena';
import { Debug } from './Debug';
import { Bubble } from './Bubble';

import { drawLines } from './drawUtils';
import { Collider } from './Collider';
import { Player } from './Player';

const WINDOW_WIDTH = window.innerWidth * 0.8;
const WINDOW_HEIGHT = window.innerHeight * 0.8;
const P_START_DIST = 40; // Player starting distance from the edge of the canvas

export const score: [number, number] = [0, 0];

export let backgroundMultiplier: number = 0.00025;
export function setBackgroundMultiplier(value: number) {
    backgroundMultiplier = value;
}
export function getBackgroundMultiplier(): number {
    return backgroundMultiplier;
}

let hue_value = 0;

const DEFAULT_LINE_COLOR = 0xffffff;
const DEFAULT_FIELD_COLOR = 0x000000;

export class Game {
    private app: PIXI.Application;
    private debug: Debug;
    private scoreElement: PIXI.Text;
    private scoreStyle: PIXI.TextStyle;
    public isUpdade = true;
    public isDebug = false;

    private gameObjects: GameObject[] = [];
    private remove_gameObjects: GameObject[] = [];
    private collider_gameObjects: GameObject[] = [];
    private keydown_gameObjects: GameObject[] = [];
    private keyup_gameObjects: GameObject[] = [];

    private static instance: Game;

    private blueTranform = new PIXI.ColorMatrixFilter();
    private backgroundHue = new PIXI.ColorMatrixFilter();
    constructor() {
        Game.instance = this;
        this.app = new PIXI.Application({
            background: DEFAULT_FIELD_COLOR,
            antialias: true, // smooth edge rendering
            width: WINDOW_WIDTH, // 80% of the window width
            height: WINDOW_HEIGHT // 80% of the window height
        });

        this.app.renderer.background.color = DEFAULT_FIELD_COLOR;

        const p1 = new Player(P1Tex, P_START_DIST, this.app.view.height / 2, 'Player1', new Vector2D(1, 1));
        Game.add(p1);
        Game.add(
            new Player(
                P2Tex,
                this.app.view.width - P_START_DIST,
                this.app.view.height / 2,
                'Player2',
                new Vector2D(-1, 1)
            )
        );

        Game.add(new Ball(this.app.view.width / 2, this.app.view.height / 2, BallTex));
        Game.add(new ArenaWall(new Vector2D(this.app.view.width / 2, -25), new Vector2D(this.app.view.width, 55)));
        Game.add(new ArenaWall(new Vector2D(this.app.view.width / 2, this.app.view.height + 10),new Vector2D(this.app.view.width, 25)));

        drawLines(DEFAULT_LINE_COLOR, this.app);

        // true or false?
        // this.blueTranform.hue(120, false);
        // p1.getDisplayObject.filters = [this.blueTranform];
        // this.backgroundHue.hue(hue_value, false);
        // this.app.stage.filters = [this.backgroundHue];

        document.body.appendChild(this.app.view as HTMLCanvasElement);
        // this.players.forEach(player => this.app.stage.addChild(player.getDisplayObject));

        this.scoreStyle = new PIXI.TextStyle({
            fontFamily: 'arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: ['#FF2C05', '#FFCE03'], // gradient
            stroke: '#4a1850',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 3,
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 2
        });

        this.scoreElement = new PIXI.Text(`${score[0]}     ${score[1]}`, this.scoreStyle);
        this.scoreElement.x = this.app.view.width / 2 - this.scoreElement.width / 2;
        this.scoreElement.y = this.app.view.height / 16;
        this.app.stage.addChild(this.scoreElement);

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        this.debug = new Debug(this.app);
    }

    handleKeyDown = (e: KeyboardEvent) => {
        this.keydown_gameObjects.forEach((gameObject: GameObject) => {
            if (gameObject?.onKeyDown != undefined) {
                gameObject.onKeyDown.bind(gameObject)(e);
            }
        });
        if (e.key === 't') {
            this.isUpdade = !this.isUpdade;
            
        }

        if (e.key === 'p')
            this.isDebug = !this.isDebug;
    };
    handleKeyUp = (e: KeyboardEvent) => {
        this.keyup_gameObjects.forEach((gameObject: GameObject) => {
            if (gameObject?.onKeyUp) gameObject.onKeyUp.bind(gameObject)(e);
        });
    };

    start() {
        this.app.ticker.minFPS = 120;
        this.app.ticker.add((delta) => {
            if (this.isUpdade) {
                this.gameObjects.forEach((gameObject: GameObject) => gameObject.collider.reset());
                // gameObjects.forEach(ob => {
                //     if (Collider.collides_ob(ob, ball, this.debugGraphics))
                //     {
                //         ball.setMove(false);
                //     }
                // });
                //hue_value += 1;
                this.collider_gameObjects.forEach((target: GameObject) => {
                    this.gameObjects.forEach((gameObject: GameObject) => {
                        if (target != gameObject) Collider.collides_ob(gameObject, target);
                    });
                });

                this.gameObjects.forEach((gameObject: GameObject) => {
                    gameObject.update(delta);
                });

    
                if (this.remove_gameObjects.length > 0)
                    this.removeObjects();
                this.backgroundHue.hue(hue_value, false);
                this.debug.clear();
                //console.log(this.allObjects);
                // this.players.forEach(player => player.update(delta, this.app.view.height));
                this.scoreElement.text = `${score[0]}     ${score[1]}`;
                // this.gameBall.update(delta, this.app.view.height, this.app.view.width, this.allObjects)
                // this.specialPower.update(delta, this.app.view.height, this.app.view.width, this.allObjects);
                // this.allObjects.forEach(obj => obj instanceof Bubble && obj.update(delta, this.app.view.height, this.app.view.width, this.allObjects));
                if (this.isDebug)
                    this.debug.debugDraw(this.gameObjects);
            }
        });
    }

    public static add(gameObject: GameObject) {
        Game.instance.gameObjects.push(gameObject);
        Game.instance.app.stage.addChild(gameObject.getDisplayObject);
        if (gameObject?.onCollide != undefined) Game.instance.collider_gameObjects.push(gameObject);
        if (gameObject?.onKeyDown != undefined) Game.instance.keydown_gameObjects.push(gameObject);
        if (gameObject?.onKeyUp != undefined) Game.instance.keyup_gameObjects.push(gameObject);
    }

    public static remove(gameObject: GameObject) {
        Game.instance.remove_gameObjects.push(gameObject);
    }

    private removeObjects() {
        console.log("gameObjects: ", this.gameObjects.length);


        // for (const gameObject of this.remove_gameObjects) {
   
            this.collider_gameObjects = this.collider_gameObjects.filter((value: GameObject) => !this.remove_gameObjects.includes(value)) 
            this.keydown_gameObjects = this.keydown_gameObjects.filter((value: GameObject) => !this.remove_gameObjects.includes(value)) 
            this.keyup_gameObjects = this.keyup_gameObjects.filter((value: GameObject) => !this.remove_gameObjects.includes(value)) 
            this.gameObjects = this.gameObjects.filter((value: GameObject) => !this.remove_gameObjects.includes(value)) 
            //(this.collider_gameObjects.indexOf(gameObject), 1);
            // if (gameObject?.onKeyDown != undefined)
            //     this.keydown_gameObjects.splice(this.keydown_gameObjects.indexOf(gameObject), 1);
            // if (gameObject?.onKeyUp != undefined)
            //     this.keyup_gameObjects.splice(this.keyup_gameObjects.indexOf(gameObject), 1);
            // this.gameObjects.splice(this.gameObjects.indexOf(gameObject), 1);
            //
        // }
        this.app.stage.removeChild(...this.remove_gameObjects.map(e => e.getDisplayObject));
        this.remove_gameObjects.length = 0;
        console.log("remove_gameObjects: ", this.gameObjects.length);

    }

    static get width(){
        return   Game.instance.app.view.width
    }

    static get height(){
        return   Game.instance.app.view.height
    }


}

const P1Tex = await PIXI.Texture.fromURL('assets/RedBar2.png');
const P2Tex = await PIXI.Texture.fromURL('assets/RedBar2.png');
const BallTex = await PIXI.Texture.fromURL('assets/Ball.png');
export const BubbleTex = await PIXI.Texture.fromURL('assets/bubble_3.png');

const game = new Game();
game.start();
