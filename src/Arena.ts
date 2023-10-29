import { GameObject } from './GameObject';
import { Game } from "./Game";
import { Polygon } from './Polygon';
import { Vector2D } from './utils/Vector';
import * as PIXI from 'pixi.js';
import { Line } from './utils/types';

export class ArenaWall extends GameObject {
    constructor( public readonly position: Vector2D, public readonly size: Vector2D, private readonly color: number) {
        const sprite = new PIXI.Graphics();
        sprite.beginFill(color);
        sprite.drawRect(0, 0, size.x, size.y);
        sprite.endFill();
        sprite.x = position.x;
        sprite.y = position.y;
        
        super('Arena', sprite);
        this.collider.polygon = new ArenaPolygon(position, size);
        this.collider.updateBoundingBox();        
    }

    update(): void {}
    updatePolygon(): void {}

    onCollide(target: GameObject, line: Line): void {
        
    }
}

const createArena = ( position: Vector2D, size: Vector2D): number[] => {
    const points: number[] = [];

    // 0,0              800,0
    // 0,40             800,40

    // 0, height- 40    800, height - 40
    // 0, height        800, height
    
    const topLeft: Vector2D = new Vector2D( position.x, position.y ); 
    const topRight: Vector2D = new Vector2D( Game.width, position.y ); 
    const bottomRight: Vector2D = new Vector2D( Game.width, position.y + size.y ); 
    const bottomLeft: Vector2D = new Vector2D( position.x , size.y );
    if (position.y !== size.y) {
        bottomLeft.y = position.y + size.y;
    }

    points.push(topLeft.x, topLeft.y);
    points.push(topRight.x, topRight.y);
    points.push(bottomRight.x, bottomRight.y);
    points.push(bottomLeft.x, bottomLeft.y);

    return points;
}

export class ArenaPolygon extends Polygon {
    constructor(position:Vector2D, size: Vector2D) {
        const points = createArena(position, size);
        const arenaPolygon = new PIXI.Polygon(points);
        super(arenaPolygon);

        this.vertices = 4;
        if (position.x === 0 && position.y === 0) {
            this.center.x = Game.width / 2;
            this.center.y = size.y / 2;
        }
        else {
            this.center.x = Game.width / 2;
            this.center.y = position.y + (size.y / 2);
        }
        
        this.points = points;
        this.width = size.x;
        this.height = size.y;
    }

    update() {}
}