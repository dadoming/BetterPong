import * as PIXI from 'pixi.js';
import { Bar } from './Bar';
import { Ball } from './Ball';
import { GameObject } from './GameObject';
import { Vector2D } from './Vector';
import { ArenaWall } from './Arena';

/**
 *
 *  TODO:
 *
 *    Implement neutral bars
 *    Implement score
 *    Implement pause
 *    Integrate with the dev branch
 *
 *
 *
 */

// value * 0.8 to not have a sidebar in my pc
const WINDOW_WIDTH = window.innerWidth * 0.8;
const WINDOW_HEIGHT = window.innerHeight * 0.8;

const app = new PIXI.Application<HTMLCanvasElement>({
    background: '#1099bb',
    antialias: true, // smooth lines
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT
});

const P1_START_POS = 0 + 50;
const P2_START_POS = WINDOW_WIDTH - 50;

const playerTex = await PIXI.Texture.fromURL(
    'https://pixijs.com/assets/bunny.png'
);

const Player1 = new Bar(
    playerTex,
    P1_START_POS,
    WINDOW_HEIGHT / 2,
    'P1',
    new Vector2D(1, 1)
);
app.stage.addChild(Player1.getDisplayObject);
const Player2 = new Bar(
    playerTex,
    P2_START_POS,
    WINDOW_HEIGHT / 2,
    'P2',
    new Vector2D(-1, 1)
);
app.stage.addChild(Player2.getDisplayObject);

const GameBall = new Ball(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2);
app.stage.addChild(GameBall.getDisplayObject);

document.body.appendChild(app.view);

const MaxAcceleration = 3;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        Player2.setMove(true);
        Player2.setVelocity({ x: 0, y: -Math.abs(Player2.getVelocity.y) });
    }
    if (event.key === 'ArrowDown') {
        Player2.setVelocity({ x: 0, y: Math.abs(Player2.getVelocity.y) });
        Player2.setMove(true);
    }
    if (event.key === ' ') {
        Player2.setAcceleration(MaxAcceleration);
    }
    if (event.key === 'w') {
        Player1.setMove(true);
        Player1.setVelocity({ x: 0, y: -Math.abs(Player1.getVelocity.y) });
    }
    if (event.key === 's') {
        Player1.setVelocity({ x: 0, y: Math.abs(Player1.getVelocity.y) });
        Player1.setMove(true);
    }
    if (event.key === 'a') {
        Player1.setAcceleration(MaxAcceleration);
    }
    if (event.key === 'v') {
        // only allow to change scale if the player is well inside the screen
        Player1.getDisplayObject.scale.set(2);
        Player1.setScale(2);
        Player1.updatePolygon(Player1.getPosition);
    } else {
        console.log(event.key);
    }
});
document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        Player2.setMove(false);
    }
    if (event.key === ' ') {
        Player2.setAcceleration(1);
    }
    if (event.key === 'w' || event.key === 's') {
        Player1.setMove(false);
    }
    if (event.key === 'a') {
        Player1.setAcceleration(1);
    }
    if (event.key === 'v') {
        Player1.getDisplayObject.scale.set(1);
        Player1.setScale(1);
        Player1.updatePolygon(Player1.getPosition);
    }
    if (event.key === 't') GameBall.setMove(!GameBall.getMove);
});

const allObjects: GameObject[] = [
    new ArenaWall(
        new Vector2D(app.view.width / 2, -25),
        new Vector2D(app.view.width, 55)
    ),
    new ArenaWall(
        new Vector2D(app.view.width / 2, app.view.height + 10),
        new Vector2D(app.view.width, 25)
    ),
    Player1,
    Player2
]; // except the ball

const debug = new PIXI.Graphics();

app.stage.addChild(debug);
app.ticker.add((delta) => {
    debug.clear();
    // delta is 1 if running at 100% performance
    Player1.update(delta, WINDOW_HEIGHT);
    Player2.update(delta, WINDOW_HEIGHT);
    GameBall.update(delta, WINDOW_HEIGHT, WINDOW_WIDTH, allObjects);

    debug.beginFill(0xffff00);
    allObjects.forEach((obj) =>
        debug.drawRect(
            obj.collider.left,
            obj.collider.top,
            obj.collider.width,
            obj.collider.height
        )
    );
    debug.endFill();
    debug.beginFill(0xff0000);
    allObjects.forEach((obj) =>
        debug.drawCircle(obj.collider.center.x, obj.collider.center.y, 2)
    );
    debug.endFill();
    debug.beginFill(0x00ff00);
    allObjects.forEach((obj) =>
        debug.drawPolygon(obj.collider.polygon.getPoints)
    );
    if (GameBall.getMove) console.log(GameBall.getPosition);
});
