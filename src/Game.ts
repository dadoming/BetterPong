import * as PIXI from 'pixi.js';
import { Ball } from './Ball';
import { GameObject } from './GameObject';
import { Vector2D } from './utils/Vector';
import { ArenaWall } from './Arena';
import { Debug } from './utils/Debug';
import { drawLines } from './utils/drawUtils';
import { Collider } from './Collider';
import { Player } from './Player';
import { hue_value, score, P_START_DIST, MULTIPLAYER_START_POS, ARENA_SIZE, P1Tex, P2Tex, BallTex, DEFAULT_LINE_COLOR, DEFAULT_FIELD_COLOR, WINDOW_WIDTH, WINDOW_HEIGHT } from './main';
import { Bubble } from './SpecialPowers/Bubble';
import { Ice } from './SpecialPowers/Ice';
import { Bot } from './Bot';
import { Spark } from './SpecialPowers/Spark';

export class Game {
    private app: PIXI.Application;
    private debug: Debug;
    private scoreElement: PIXI.Text;
    private scoreStyle: PIXI.TextStyle;
    public runGame = true;
    public isDebug = false;

    public gameObjects: GameObject[] = [];
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
        
        // i don't know if this is the best way to do this
        this.setCanvasSize();
        window.addEventListener('resize', this.setCanvasSize);

        this.app.renderer.background.color = DEFAULT_FIELD_COLOR;
        drawLines(DEFAULT_LINE_COLOR, this.app);

        const p1 = new Player(P1Tex, P_START_DIST, this.app.view.height / 2, 'Player1', new Vector2D(1, 1), new Spark(Vector2D.Zero, Vector2D.Zero));
        this.blueTranform.hue(240, false);
        p1.getDisplayObject.filters = [this.blueTranform];
        Game.add(p1);
        
        const p2 = new Player(P2Tex, this.app.view.width - P_START_DIST, this.app.view.height / 2, 'Player2', new Vector2D(-1, 1), new Ice(Vector2D.Zero, Vector2D.Zero));
        Game.add(p2);
        //Game.add(new Bot(P2Tex, this.app.view.width - P_START_DIST, this.app.view.height / 2, 'Player2', new Vector2D(-1, 1)));
        Game.add(new Bot(P2Tex, MULTIPLAYER_START_POS, this.app.view.height / 2, 'Player3', new Vector2D(-1, 1)));
        Game.add(new Bot(P2Tex, this.app.view.width - MULTIPLAYER_START_POS, this.app.view.height / 2, 'Player4', new Vector2D(-1, 1)));
        Game.add(new ArenaWall(new Vector2D(0, 0), new Vector2D(this.app.view.width, ARENA_SIZE), 0x00ABFF));
        Game.add(new ArenaWall(new Vector2D(0, this.app.view.height - ARENA_SIZE), new Vector2D(this.app.view.width, ARENA_SIZE), 0x00ABFF));
        Game.add(new Ball(this.app.view.width / 2, this.app.view.height / 2, BallTex));


        // true or false?
        // this.blueTranform.hue(120, false);
        // p1.getDisplayObject.filters = [this.blueTranform];
        // this.backgroundHue.hue(hue_value, false);
        // this.app.stage.filters = [this.backgroundHue];

        document.body.appendChild(this.app.view as HTMLCanvasElement);

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

    setCanvasSize() {
        const screenWidth = WINDOW_WIDTH;
        const screenHeight = WINDOW_HEIGHT;

        const aspectRatio = 4/3;

        if (screenWidth / screenHeight > aspectRatio) {
            this.app.view.width = screenHeight * aspectRatio;
            this.app.view.height = screenHeight;
        }
        else {
            this.app.view.width = screenWidth;
            this.app.view.height = screenWidth / aspectRatio;
        }
    }

    handleKeyDown = (e: KeyboardEvent) => {
        this.keydown_gameObjects.forEach((gameObject: GameObject) => {
            if (gameObject?.onKeyDown != undefined) {
                gameObject.onKeyDown.bind(gameObject)(e);
            }
        });
        if (e.key === 't') {
            Game.getObjectByTag('Bolinha')?.setMove(!this.runGame);
            this.runGame = !this.runGame;   
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
        this.app.ticker.minFPS = 30;
        this.app.ticker.maxFPS = 120;
        const text = new PIXI.Text(this.app.ticker.FPS, { fill: 'white' });
        text.x = 200;
        text.y = 10;
        this.app.stage.addChild(text);
        this.app.ticker.add((delta) => {
            if (this.runGame) {

                text.text = Math.round(this.app.ticker.FPS).toString();
                        
                this.gameObjects.forEach((gameObject: GameObject) => gameObject.collider.reset());
                
                this.scoreElement.text = `${score[0]}     ${score[1]}`;
                this.backgroundHue.hue(hue_value, false);      

                //hue_value += 1;
                this.collider_gameObjects.forEach((target: GameObject) => {
                    this.gameObjects.forEach((gameObject: GameObject) => {
                        if (target != gameObject) Collider.collidingObjects(gameObject, target);
                    });
                });

                this.gameObjects.forEach((gameObject: GameObject) => {
                    gameObject.update(delta);
                });
                
                if (this.remove_gameObjects.length > 0) this.removeObjects();
            
                this.debug.clear();
                if (this.isDebug) this.debug.debugDraw(this.gameObjects);
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

        this.collider_gameObjects = this.collider_gameObjects.filter((value: GameObject) => !this.remove_gameObjects.includes(value)) 
        this.keydown_gameObjects = this.keydown_gameObjects.filter((value: GameObject) => !this.remove_gameObjects.includes(value)) 
        this.keyup_gameObjects = this.keyup_gameObjects.filter((value: GameObject) => !this.remove_gameObjects.includes(value)) 
        this.gameObjects = this.gameObjects.filter((value: GameObject) => !this.remove_gameObjects.includes(value)) 
        
        this.app.stage.removeChild(...this.remove_gameObjects.map(e => e.getDisplayObject));
        this.remove_gameObjects.length = 0;
    }

    static applyOnAllObjects(func: (gameObject: GameObject) => void) {
        Game.instance.gameObjects.forEach((gameObject: GameObject) => {
            func(gameObject);
        });
    }

    static get width(){
        return   Game.instance.app.view.width
    }

    static get height(){
        return   Game.instance.app.view.height
    }
    
    static get app(){
        return   Game.instance.app
    }

    static getObjectByTag(tag: string): GameObject | undefined {
        return Game.instance.gameObjects.find((gameObject: GameObject) => gameObject.tag === tag);
    }
}