import * as PIXI from 'pixi.js';
import { UIBall } from './Ball';
import { GameObject, UIGameObject } from './GameObject';
import { Vector2D } from './utils/Vector';
import { UIArenaWall } from './Collisions/Arena';
import { Debug } from './utils/Debug';
import { drawLines } from './utils/drawUtils';
import { Collider } from './Collisions/Collider';
import { UIPlayer } from './Paddles/Player';
import {
    hue_value,
    score,
    P_START_DIST,
    MULTIPLAYER_START_POS,
    ARENA_SIZE,
    P1Tex,
    P2Tex,
    BallTex,
    DEFAULT_LINE_COLOR,
    DEFAULT_FIELD_COLOR,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
    gameConfig
} from './main';
import { Bot } from './Paddles/Bot';
import { SpecialPower, SpecialPowerType, UISpecialPower } from './SpecialPowers/SpecialPower';

import { KeyControls } from './Paddles/Player';
import { UIMarioBox } from './SpecialPowers/MarioBox';

/**
 *
 *  HARDCODE
 *
 */

const keys1: KeyControls = {
    up: 'w',
    down: 's',
    boost: 'a',
    shoot: 'q'
};

const keys2: KeyControls = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    boost: 'ArrowLeft',
    shoot: 'ArrowRight'
};

export class Game {
    public run = true;
    public gameObjects: UIGameObject[] = [];
    protected remove_gameObjects: UIGameObject[] = [];
    protected collider_gameObjects: UIGameObject[] = [];
    protected keydown_gameObjects: UIGameObject[] = [];
    protected keyup_gameObjects: UIGameObject[] = [];

    public delta: number = 0;

    // add array for changed objects to send to client

    constructor(public width: number, public height: number) {}

    start() {}

    public add(gameObject: UIGameObject) {
        this.gameObjects.push(gameObject);
        if (gameObject?.onCollide != undefined) this.collider_gameObjects.push(gameObject);
        if (gameObject?.onKeyDown != undefined) this.keydown_gameObjects.push(gameObject);
        if (gameObject?.onKeyUp != undefined) this.keyup_gameObjects.push(gameObject);
    }

    public remove(gameObject: UIGameObject) {
        this.remove_gameObjects.push(gameObject);
    }

    protected removeObjects() {
        this.collider_gameObjects = this.collider_gameObjects.filter(
            (value: UIGameObject) => !this.remove_gameObjects.includes(value)
        );
        this.keydown_gameObjects = this.keydown_gameObjects.filter(
            (value: UIGameObject) => !this.remove_gameObjects.includes(value)
        );
        this.keyup_gameObjects = this.keyup_gameObjects.filter(
            (value: UIGameObject) => !this.remove_gameObjects.includes(value)
        );
        this.gameObjects = this.gameObjects.filter((value: UIGameObject) => !this.remove_gameObjects.includes(value));
        this.remove_gameObjects.forEach((gameObject: UIGameObject) => gameObject?.onDestroy?.());
        this.remove_gameObjects.length = 0;
    }

    public applyOnAllObjects(func: (gameObject: UIGameObject) => void) {
        this.gameObjects.forEach((gameObject: UIGameObject) => {
            func(gameObject);
        });
    }

    getObjectByTag(tag: string): UIGameObject | undefined {
        return this.gameObjects.find((gameObject: UIGameObject) => gameObject.tag === tag);
    }
}

export class UIGame extends Game {
    public app: PIXI.Application;
    private debug: Debug;
    private scoreElement: PIXI.Text;
    private scoreStyle: PIXI.TextStyle;

    private blueTranform = new PIXI.ColorMatrixFilter();
    private backgroundHue = new PIXI.ColorMatrixFilter();

    constructor(width: number, height: number) {
        super(width, height);
        this.app = new PIXI.Application({
            background: DEFAULT_FIELD_COLOR,
            antialias: true, // smooth edge rendering
            width, // 80% of the window width
            height // 80% of the window height
        });
        this.app.renderer.background.color = DEFAULT_FIELD_COLOR;
        drawLines(DEFAULT_LINE_COLOR, this.app);
        const p1 = new UIPlayer(
            P1Tex,
            P_START_DIST,
            this.height / 2,
            keys1,
            'Player1',
            new Vector2D(1, 1),
            gameConfig.p1.specialPower as SpecialPowerType,
            this
        );
        this.blueTranform.hue(240, false);
        p1.displayObject.filters = [this.blueTranform];
        this.add(p1);

        const p2 = new UIPlayer(
            P2Tex,
            this.width - P_START_DIST,
            this.height / 2,
            keys2,
            'Player2',
            new Vector2D(-1, 1),
            'Fire',
            this
        );
        this.add(p2);
        //this.add(new Bot(P2Tex, this.app.view.width - P_START_DIST, this.app.view.height / 2, 'Player2', new Vector2D(-1, 1)));
        //this.add(new Bot(P2Tex, MULTIPLAYER_START_POS, this.app.view.height / 2, 'Player3', new Vector2D(-1, 1)));
        //this.add(new Bot(P2Tex, this.app.view.width - MULTIPLAYER_START_POS, this.app.view.height / 2, 'Player4', new Vector2D(-1, 1)));
        this.add(new UIArenaWall(new Vector2D(0, 0), new Vector2D(this.width, ARENA_SIZE), 0x00abff, this));
        this.add(
            new UIArenaWall(
                new Vector2D(0, this.height - ARENA_SIZE),
                new Vector2D(this.width, ARENA_SIZE),
                0x00abff,
                this
            )
        );
        this.add(new UIBall(this.width / 2, this.height / 2, BallTex, this));

        // true or false?
        // this.blueTranform.hue(120, false);
        // p1.getDisplayObject.filters = [this.blueTranform];
        // this.backgroundHue.hue(hue_value, false);
        // this.app.stage.filters = [this.backgroundHue];
                this.add(new UIMarioBox(this));
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

        //window.addEventListener('resize', this.setCanvasSize.bind(this));

        this.debug = new Debug(this.app);
    }

    handleKeyDown = (e: KeyboardEvent) => {
        this.keydown_gameObjects.forEach((gameObject: UIGameObject) => {
            if (gameObject?.onKeyDown != undefined) {
                gameObject.onKeyDown.bind(gameObject)(e);
            }
        });
        if (e.key === 't') {
            this.run = !this.run;
        }

        if (e.key === 'v') {
            this.getObjectByTag('Bolinha')?.setMove(!this.run);
        }

        if (e.key === 'p') this.debug.isDebug = !this.debug.isDebug;
    };
    handleKeyUp = (e: KeyboardEvent) => {
        this.keyup_gameObjects.forEach((gameObject: UIGameObject) => {
            if (gameObject?.onKeyUp) gameObject.onKeyUp.bind(gameObject)(e);
        });
    };

    start() {
        super.start();

        const text = new PIXI.Text(this.app.ticker.FPS, { fill: 'white' });
        text.x = 200;
        text.y = 10;
        this.app.stage.addChild(text);

        let lastTimeStamp = performance.now();
        let accFrames = 0;
        let lastFPSTimestamp = performance.now();
        const fixedDeltaTime: number = 0.01667; // 60 FPS in seconds
        const tick = () => {
            const timestamp = performance.now();
            const deltaTime = (timestamp - lastTimeStamp) / 1000;
            accFrames ++;
            lastTimeStamp = timestamp;
            this.delta = deltaTime / fixedDeltaTime
            this.update(this.delta);
            if (timestamp - lastFPSTimestamp > 1000) {
                console.log(accFrames);
                text.text = Math.round(accFrames).toString();
                accFrames = 0;
                lastFPSTimestamp = timestamp;
            }
            //requestAnimationFrame(tick);
        };
        setInterval(tick, 3);
        //requestAnimationFrame(tick);
    }

    update(delta: number) {

            if (this.run) {

                this.gameObjects.forEach((gameObject: UIGameObject) => gameObject.collider.reset());

                this.scoreElement.text = `${score[0]}     ${score[1]}`;
                this.backgroundHue.hue(hue_value, false);

                //hue_value += 1;
                this.collider_gameObjects.forEach((target: UIGameObject) => {
                    this.gameObjects.forEach((gameObject: UIGameObject) => {
                        if (target != gameObject) Collider.collidingObjects(gameObject, target);
                    });
                });

                this.gameObjects.forEach((gameObject: UIGameObject) => {
                    gameObject.update(delta);
                });

                if (this.remove_gameObjects.length > 0) this.removeObjects();

                this.debug.debugDraw(this.gameObjects);
            }
        
    }
    public add(gameObject: UIGameObject) {
        super.add(gameObject);
        this.app.stage.addChild(gameObject.displayObject);
    }

    protected removeObjects(): void {
        this.app.stage.removeChild(...this.remove_gameObjects.map((e) => e.displayObject));
        this.remove_gameObjects.forEach(e => e.displayObject.destroy());
        super.removeObjects();
    }
}
