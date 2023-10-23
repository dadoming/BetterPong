import { Polygon } from './Polygon';
import { Vector2D } from './Vector';

export class BoundingBox {

    constructor(
        public position: Vector2D = Vector2D.Zero,
        public size: Vector2D = Vector2D.Zero
    ) {}

    get empty() { return this.size.x === 0 || this.size.y === 0; }
    get left() { return this.position.x; }
    get right() { return (this.position.x + this.size.x); }
    get top() { return this.position.y; }
    get bottom() { return (this.position.y + this.size.y); }

    get width() { return this.size.x; }
    get height() { return this.size.y; }

    get getPoints() {
        return [
            this.position.x, this.position.y,
            this.position.x + this.size.x, this.position.y,
            this.position.x + this.size.x, this.position.y + this.size.y,
            this.position.x, this.position.y + this.size.y
        ];
    }

    get center() { return this.position.add(this.size.divide(2)); }
    set center(value: Vector2D) { this.position = value.subtract(this.size.divide(2)); }

    collides(other: BoundingBox): boolean {
        return (
            this.left <= other.right &&
            this.right >= other.left &&
            this.top <= other.bottom &&
            this.bottom >= other.top
        );
    }

    static fromPolygon(polygon: Polygon): BoundingBox {
        const vertices = polygon.vertices2D;
        
        const left = Math.min(...vertices.map((v) => v.x));
        const right = Math.max(...vertices.map((v) => v.x));
        const top = Math.min(...vertices.map((v) => v.y));
        const bottom = Math.max(...vertices.map((v) => v.y));

        if ( left === Infinity || right === -Infinity || top === Infinity || bottom === -Infinity )
            return new BoundingBox();
        if ( isNaN(left) || isNaN(right) || isNaN(top) || isNaN(bottom) ||
            left === undefined || right === undefined || top === undefined || bottom === undefined )
            return new BoundingBox();
        
            return new BoundingBox( new Vector2D(left, top), new Vector2D(right - left, bottom - top) );
    }
}
