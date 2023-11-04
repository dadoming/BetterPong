import * as PIXI from 'pixi.js';
import { Game, UIGame } from './Game';
import { Vector2D } from './utils/Vector';

/* ----------------------- Game Config ----------------------- */
import _gameConfig from './config/game.json';
export interface gameConfig {
    canvas: {
        width: number;
        height: number;
        fieldHexColor: string;
    },

    p1: {
        name: string;
        hexColor: string;
        specialPower: string;
        paddleSkin: string
    },

    p2: {
        name: string;
        hexColor: string;
        specialPower: string;
        paddleSkin: string
    },

    p3: {
        name: string;
        hexColor: string;
        specialPower: string;
        paddleSkin: string
    },

    p4: {
        name: string;
        hexColor: string;
        specialPower: string;
        paddleSkin: string
    },

    ball: {
        name: string;
        hexColor: string;
        color: string;
        skin: string;
        diameter: number;
        vertices: number;
    },
}
const gameConfig: gameConfig = _gameConfig as gameConfig;
export { gameConfig };

/* ----------------------- Game Config ----------------------- */


/* ----------------------- Bar Config ----------------------- */
import _paddleConfig from './config/paddles.json';
export interface paddleObjectConfig {
    paddle: {
    width: number;
    height: number;
    colliderType: 'Bar';
    colliderData: {
        radius?: number;
        vertices?: Vector2D[];
        }
    }
}
const paddleConfig: paddleObjectConfig = _paddleConfig as paddleObjectConfig;
export { paddleConfig };
/* ----------------------- Bar Config ----------------------- */

/* ------------------ Special Powers Config ------------------*/
import _specialpowerConfig from './config/specialpower.json';
export interface specialPowerObjectConfig {
    spark: {
        texture: string,
        diameter: number,
        vertices: number
    },

    fire: {
        texture: string,
        diameter: number,
        vertices: number
    },

    ghost: {
        texture: string,
        diameter: number,
        vertices: number
    },

    bubble: {
        texture: string,
        diameter: number,
        vertices: number
    },

    ice: {
        texture: string,
        diameter: number,
        vertices: number
    },
}
const specialpowerConfig: specialPowerObjectConfig = _specialpowerConfig as specialPowerObjectConfig;
export { specialpowerConfig };
/* ------------------ Special Powers Config ------------------*/


export const WINDOW_WIDTH = window.innerWidth * 0.8;
export const WINDOW_HEIGHT = window.innerHeight * 0.8;
export const P_START_DIST = 40; // Player starting distance from the edge of the canvas
export const MULTIPLAYER_START_POS = 80;
export const ARENA_SIZE = 50;

export const score: [number, number] = [0, 0];

export let backgroundMultiplier: number = 0.00025;
export function setBackgroundMultiplier(value: number) {
    backgroundMultiplier = value;
}
export function getBackgroundMultiplier(): number {
    return backgroundMultiplier;
}

export const StartingBarWidth = 20;
export const StartingBarHeight = 100;

export let hue_value = 0;

export const DEFAULT_LINE_COLOR = 0xffffff;
export const DEFAULT_FIELD_COLOR = 0x000000;

// this is for the powers that the players shoot do not collide with the friendly player
export const multiplayerON = true;


export const P1Tex = await PIXI.Texture.fromURL('assets/RedBar2.png');
export const P2Tex = await PIXI.Texture.fromURL('assets/RedBar2.png');
export const BallTex = await PIXI.Texture.fromURL('assets/Ball.png');
export const BubbleTex = await PIXI.Texture.fromURL('assets/bubble_3.png');
export const IceTex = await PIXI.Texture.fromURL('assets/iceball.png');
export const SparkTex = await PIXI.Texture.fromURL('assets/spark.png');
export const FireTex = await PIXI.Texture.fromURL('assets/fireball.png');
export const GhostTex = await PIXI.Texture.fromURL('assets/ghost.png');


const game = new UIGame(1024, 800);
game.start();
