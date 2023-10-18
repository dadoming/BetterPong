import { BoundingBox } from './BoundingBox';
import { Polygon } from './Polygon';
import { Vector2D } from './Vector';

export class Collider {
    public center: Vector2D = Vector2D.Zero;

    constructor(
        public readonly boundingBox: BoundingBox = new BoundingBox(),
        public polygon: Polygon
    ) {
        this.updateBoundingBox();
    }

    get enabled() {
        return !this.boundingBox.empty;
    }
    get left() {
        return this.boundingBox.left;
    }
    get right() {
        return this.boundingBox.right;
    }
    get top() {
        return this.boundingBox.top;
    }
    get bottom() {
        return this.boundingBox.bottom;
    }

    get width() {
        return this.boundingBox.width;
    }
    get height() {
        return this.boundingBox.height;
    }

    updateBoundingBox() {
        const newBoundingBox = BoundingBox.fromPolygon(this.polygon);
        console.log(newBoundingBox);
        
        this.boundingBox.position = newBoundingBox.position;
        this.boundingBox.size = newBoundingBox.size;
        this.center = this.polygon.vertices2D.reduce((a, b) => a.add(b), Vector2D.Zero).divide(this.polygon.vertices2D.length);
    }

    /**
     * If the collider collides with another collider, returns the point of the collision and the normal based on the nearest polygon's side.
     * @returns [collides, point?, normal?] 
     */
    collides(other: Collider): [false] | [true, Vector2D, Vector2D] {
        if (!this.enabled || !other.enabled)
            return [false];
        if (!this.boundingBox.collides(other.boundingBox))
            return [false];

        for (const vertex of this.polygon.vertices2D) {
            if (!other.polygon.getPolygon.contains(vertex.x, vertex.y))
                continue;
            const [v1, v2] = other.getPolygonVerticesFromPoint(vertex);
            
            const middle = v1.add(v2.subtract(v1).divide(2));
            
            const normal = middle.subtract(other.center).normalize();
            
            return [true, vertex, normal];
        }
        return [false];
    }
    getPolygonVerticesFromPoint(point: Vector2D): [Vector2D, Vector2D] {
        const areas = this.polygon.getAreas(point);
        let minArea:
            | { area: number; points: [Vector2D, Vector2D] }
            | undefined = undefined;
        
        for (const area of areas) {
            if (!minArea || area.area < minArea.area) minArea = area;
        }
        if (!minArea) throw new Error('No min area found');
        return minArea.points;
    }

    static fromPolygon(polygon: Polygon): Collider {
        return new Collider(BoundingBox.fromPolygon(polygon), polygon);
    }
}
