import * as PIXI from 'pixi.js';
import { Vector2D } from './Vector';

export abstract class Polygon {
    protected points: number[];
    protected vertices: number;
    protected position: { x: number; y: number };
    protected width: number;
    protected height: number;

    constructor(protected polygon: PIXI.Polygon) {
        this.vertices = 0;
        this.position = { x: 0, y: 0 };
        this.points = [];
        this.width = 0;
        this.height = 0;
    }

    get getPolygon() {
        return this.polygon;
    }
    get getPoints() {
        return this.points;
    }
    get getVertices() {
        return this.vertices;
    }
    get getPosition() {
        return this.position;
    }
    get getWidth() {
        return this.width;
    }
    get getHeight() {
        return this.height;
    }
    set setPosition(position: { x: number; y: number }) {
        this.position = position;
    }

    abstract update(position: { x: number; y: number }, scale: number): void;
    getVertice(index: number): Vector2D {
        if (index < 0 || index >= this.points.length)
            throw new Error('Index out of bounds');
        return new Vector2D(this.points[index * 2], this.points[index * 2 + 1]);
    }
    get vertices2D(): Vector2D[] {
        const verticesCount = this.points.length / 2;
        const vertices = new Array<Vector2D>(verticesCount);
        for (let i = 0; i < this.points.length; i += 2)
            vertices[Math.round(i / 2)] = new Vector2D(this.points[i], this.points[i + 1]);
        return vertices;
    }
    getAreas(
        point: Vector2D
    ): { area: number; points: [Vector2D, Vector2D] }[] {
        const vertices = this.points.length / 2;
        const areas = new Array<{ area: number; points: [Vector2D, Vector2D] }>(
            vertices
        );
        console.log(this.points);
        
        for (let i = 0; i < vertices; i++) {
            const triangle = [point, this.getVertice(i)];
            if (i == vertices - 1) triangle.push(this.getVertice(0));
            else triangle.push(this.getVertice(i + 1));
            const [A, B, C] = triangle;
            
            const area = Math.abs(
                (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)) / 2
            );
            areas[i] = { area, points: [triangle[1], triangle[2]] };
        }
        return areas;
    }
}

function createBall(
    points: number[],
    vertices: number,
    radius: number,
    position: { x: number; y: number }
): number[] {
    points.length = 0; // Clear the previous points

    for (let i = 0; i < vertices; i++) {
        const angle = (i / vertices) * Math.PI * 2;
        const x = position.x + radius * Math.cos(angle);
        const y = position.y + radius * Math.sin(angle);
        points.push(x, y);
    }
    return points;
}

export class BallPolygon extends Polygon {
    constructor(
        position: { x: number; y: number },
        radius: number,
        vertices: number,
        points: number[]
    ) {
        // get Points for a circle
        points = createBall(points, vertices, radius, position);
        super(new PIXI.Polygon(points));

        this.vertices = vertices;
        this.position = position;
        this.points = points;
        this.width = radius * 2;
        this.height = this.width;
    }

    update(position: { x: number; y: number }, scale: number) {
        this.points.length = 0;
        this.position = position;
        for (let i = 0; i < this.vertices; i++) {
            const angle = (i / this.vertices) * Math.PI * 2;
            const x = position.x + (this.width / 2) * Math.cos(angle) * scale;
            const y = position.y + (this.height / 2) * Math.sin(angle) * scale;
            this.points.push(x, y);
        }
    }
}

function createBar(
    direction: Vector2D,
    width: number,
    height: number,
    position: { x: number; y: number }
): number[] {
    const points: number[] = [];

    const top: Vector2D = new Vector2D(
        position.x + (width / 2) * direction.x,
        position.y - (height / 2) * direction.y
    );

    const bottom: Vector2D = new Vector2D(
        position.x + (width / 2) * direction.x,
        position.y + (height / 2) * direction.y
    );

    const backMiddle: Vector2D = new Vector2D(
        position.x - (width / 2) * direction.x,
        position.y
    );

    points.push(top.x, top.y);
    points.push(bottom.x, bottom.y);
    points.push(backMiddle.x, backMiddle.y);



    return points;
}

export class BarPolygon extends Polygon {
    constructor(
        position: { x: number; y: number },
        width: number,
        height: number,
        public direction: Vector2D
    ) {
        const points = createBar(direction, width, height, position);
        console.log(points);
        
        const barPolygon = new PIXI.Polygon(points);
        super(barPolygon);

        this.vertices = 4;
        this.position = position;
        this.points = points;
        this.width = width;
        this.height = height;
    }

    update(position: { x: number; y: number }, scale: number) {
        this.position = position;
        this.points = createBar(
            this.direction,
            this.width * scale,
            this.height * scale,
            position
        );
        this.getPolygon.points = this.points;
        
    }
}

const createArena = (
    width: number,
    height: number,
    position: Vector2D
): number[] => {
    const points: number[] = [];

    const topLeft: Vector2D = new Vector2D(
        position.x - width / 2,
        position.y - height / 2
    );

    const topRight: Vector2D = new Vector2D(
        position.x + width / 2,
        position.y - height / 2
    );

    const bottomRight: Vector2D = new Vector2D(
        position.x + width / 2,
        position.y + height / 2
    );

    const bottomLeft: Vector2D = new Vector2D(
        position.x - width / 2,
        position.y + height / 2
    );

    points.push(topLeft.x, topLeft.y);
    points.push(topRight.x, topRight.y);
    points.push(bottomRight.x, bottomRight.y);
    points.push(bottomLeft.x, bottomLeft.y);

    return points;
}

export class ArenaPolygon extends Polygon {
    constructor(
        position: Vector2D,
        width: number,
        height: number
    ) {
        const points = createArena(width, height, position);
        const arenaPolygon = new PIXI.Polygon(points);
        super(arenaPolygon);

        this.vertices = 4;
        this.position = position;
        this.points = points;
        this.width = width;
        this.height = height;
    }

    update(position: Vector2D, scale: number) {
        this.position = position;
        this.points = createArena(
            this.width * scale,
            this.height * scale,
            position
        );
        this.getPolygon.points = this.points;
    }
}