import * as PIXI from 'pixi.js';
import { Vector2D } from './Vector';
import { Ball } from './Ball';

export abstract class Polygon {
    protected points: number[];
    protected vertices: number;
    protected center: Vector2D;
    protected width: number;
    protected height: number;


    constructor(protected polygon: PIXI.Polygon) {
        this.vertices = 0;
        this.center = Vector2D.Zero;
        this.points = [];
        this.width = 0;
        this.height = 0;
    }

    myContains(x: number, y: number): boolean {
        let inside = false;

        const length = this.points.length / 2;

        for (let i = 0, j = length - 1; i < length; j = i++)
        {
            const xi = this.points[i * 2];
            const yi = this.points[(i * 2) + 1];
            const xj = this.points[j * 2];
            const yj = this.points[(j * 2) + 1];
            const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * ((y - yi) / (yj - yi))) + xi);

            if (intersect)
            {
                inside = !inside;
            }
        }

        return inside;
    }

    get getPolygon() { return this.polygon; }
    get getPoints() { return this.points; }
    get getVertices() { return this.vertices; }
    get getCenter() { return this.center; }
    get getWidth() { return this.width; }
    get getHeight() { return this.height; }
    set setCenter(center: Vector2D) { this.center = center; }

    abstract update(center: Vector2D): void;
    
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
    
    getAreas(point: Vector2D): { area: number; points: [Vector2D, Vector2D] }[] {
        const vertices = this.points.length / 2;
        const areas = new Array<{ area: number; points: [Vector2D, Vector2D] }>(vertices);

        for (let i = 0; i < vertices; i++) {
            const triangle = [point, this.getVertice(i)];
            if (i == vertices - 1) triangle.push(this.getVertice(0));
            else triangle.push(this.getVertice(i + 1));
            
            const [A, B, C] = triangle;
            const area = Math.abs((A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)) / 2);
            areas[i] = { area, points: [triangle[1], triangle[2]] };
        }
        return areas;
    }


    private areLinesIntersecting(line1: {start: Vector2D, end: Vector2D}, line2: {start: Vector2D, end: Vector2D}): boolean {
        const dir1 =line1.end.subtract(line1.start);
        const dir2 =line2.end.subtract(line2.start);
    
        const p1 = line1.start;
        const p2 = line2.start;
        const p = p2.subtract(p1);
    
        const determinant = dir1.x * dir2.y - dir1.y * dir2.x;
    
        if (determinant === 0) {
            // Lines are parallel
            return false;
        }
    
        const t1 = (p.x * dir2.y - p.y * dir2.x) / determinant;
        const t2 = (p.x * dir1.y - p.y * dir1.x) / determinant;
    
        return t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1;
    }
    

    collides(polygon: Polygon): {obj: {start: Vector2D, end: Vector2D}, target: {start: Vector2D, end: Vector2D}} | undefined
    {

        const lines_1:  {start: Vector2D, end: Vector2D}[] = [];
        const lines_2:  {start: Vector2D, end: Vector2D}[] = [];

        for (let i = 0; i < (this.points.length - 2); i+=2)
        {
            lines_1.push({start: new Vector2D(this.points[i], this.points[i + 1]), end: new Vector2D(this.points[i + 2], this.points[i + 3])});
        }
        
        lines_1.push({start: lines_1[lines_1.length - 1].end, end: new Vector2D(this.points[0], this.points[1])});


        for (let i = 0; i < (polygon.points.length - 2); i+=2)
        {
            lines_2.push({start: new Vector2D(polygon.points[i], polygon.points[i + 1]), end: new Vector2D(polygon.points[i + 2], polygon.points[i + 3])});
        }
        
        lines_2.push({start: lines_2[lines_2.length - 1].end, end: new Vector2D(polygon.points[0], polygon.points[1])});
      
     
        
         for (const line of  lines_1)
         {
    
            for (const line2 of  lines_2)
            {
                if (this.areLinesIntersecting(line, line2))
                    return {
                        obj: line,
                        target: line2
                    };
            }
        }

        return (undefined);
    }
}

function createBall( points: number[], vertices: number, radius: number, center: Vector2D ): number[] {
    points.length = 0; // Clear the previous points

    for (let i = 0; i < vertices; i++) {
        const angle = (i / vertices) * Math.PI * 2;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        points.push(x, y);
    }
    return points;
}

export class BallPolygon extends Polygon {
    constructor( center: Vector2D, diameter: number, vertices: number, points: number[]) {
        points = createBall(points, vertices, diameter / 2, center);
        super(new PIXI.Polygon(points));

        this.vertices = vertices;
        this.center = center;
        this.points = points;
        this.width = diameter;
        this.height = this.width;
    }

    update(center: Vector2D) {
        this.points.length = 0;
        this.center = center;
        for (let i = 0; i < this.vertices; i++) {
            const angle = (i / this.vertices) * Math.PI * 2;
            const x = center.x + (this.width / 2) * Math.cos(angle);
            const y = center.y + (this.height / 2) * Math.sin(angle); 
            this.points.push(x, y);
        }
    }
}

function createBar( direction: Vector2D, width: number, height: number, center: Vector2D ): number[] {
    const points: number[] = [];

    const topLeft: Vector2D = new Vector2D( center.x + (width / 2) * direction.x, center.y - (height / 2) * direction.y );
    const bottomLeft: Vector2D = new Vector2D( center.x + (width / 2) * direction.x, center.y + (height / 2) * direction.y );
    const topRight: Vector2D = new Vector2D( center.x - (width / 2) * direction.x, center.y - (height / 2) * direction.y );
    const bottomRight: Vector2D = new Vector2D( center.x - (width / 2) * direction.x, center.y + (height / 2) * direction.y );
    const middleOut: Vector2D = new Vector2D( center.x - width * direction.x, center.y);
    points.push(topLeft.x, topLeft.y);
    points.push(topRight.x, topRight.y);
    points.push(middleOut.x, middleOut.y);
    points.push(bottomRight.x, bottomRight.y);
    points.push(bottomLeft.x, bottomLeft.y);

    return points;
}

export class BarPolygon extends Polygon {
    
    constructor( center: Vector2D, width: number, height: number, public direction: Vector2D) {
        const points = createBar(direction, width, height, center);
        
        const barPolygon = new PIXI.Polygon(points);
        super(barPolygon);

        this.vertices = 3;
        this.center = center;
        this.points = points;
        this.width = width;
        this.height = height;
    }

    update(center: Vector2D) { 
        this.center = center; 
        this.points = createBar(this.direction, this.width, this.height, center);
        this.getPolygon.points = this.points;
    }
}

const createArena = ( width: number, height: number, position: Vector2D): number[] => {
    const points: number[] = [];

    const topLeft: Vector2D = new Vector2D( position.x - width / 2, position.y - height / 2 );
    const topRight: Vector2D = new Vector2D( position.x + width / 2, position.y - height / 2 );
    const bottomRight: Vector2D = new Vector2D( position.x + width / 2, position.y + height / 2 );
    const bottomLeft: Vector2D = new Vector2D( position.x - width / 2, position.y + height / 2 );

    points.push(topLeft.x, topLeft.y);
    points.push(topRight.x, topRight.y);
    points.push(bottomRight.x, bottomRight.y);
    points.push(bottomLeft.x, bottomLeft.y);

    return points;
}

export class ArenaPolygon extends Polygon {
    constructor( center: Vector2D, width: number, height: number) {
        const points = createArena(width, height, center);
        const arenaPolygon = new PIXI.Polygon(points);
        super(arenaPolygon);

        this.vertices = 4;
        this.center = center;
        this.points = points;
        this.width = width;
        this.height = height;
    }

    update(center: Vector2D) {
        this.center = center;
        this.points = createArena( this.width, this.height, center);
        this.getPolygon.points = this.points;
    }
}