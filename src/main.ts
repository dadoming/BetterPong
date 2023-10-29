import * as PIXI from 'pixi.js';
import { Game } from './Game';

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

const game = new Game();

game.start();
