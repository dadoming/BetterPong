import { GameObject } from './GameObject';
import { ArenaPolygon } from './Polygon';
import { Vector2D } from './Vector';
import * as PIXI from 'pixi.js';
export class ArenaWall extends GameObject {
    constructor(
        public readonly position: Vector2D,
        public readonly size: Vector2D
    ) {
        super('Arena', new PIXI.Container());
        this.collider.polygon = new ArenaPolygon(position, size.x, size.y);
        this.collider.updateBoundingBox();
    }
    update(): void {}
    updatePolygon(): void {}
}