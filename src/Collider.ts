import { BoundingBox } from './BoundingBox';
import { Polygon } from './Polygon';
import { Vector2D } from './Vector';

interface SeparationCollision {
    separation: number;
    normal: Vector2D;
    edges: [Vector2D, Vector2D];
}

export class Collider {
    public center: Vector2D = Vector2D.Zero;
    public lastCollision: Collider | undefined;

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

        this.boundingBox.position = newBoundingBox.position;
        this.boundingBox.size = newBoundingBox.size;
        this.center = this.polygon.vertices2D
            .reduce((a, b) => a.add(b), Vector2D.Zero)
            .divide(this.polygon.vertices2D.length);
    }

    /**
     * If the collider collides with another collider, returns the point of the collision and the normal based on the nearest polygon's side.
     * @returns [collides, normal?]
     */
    collides(other: Collider): [false] | [true, Vector2D, Vector2D] {
        if (
            !this.enabled ||
            !other.enabled ||
            this === other ||
            this.lastCollision === other ||
            other.lastCollision === this
        )
            return [false];
        if (!this.boundingBox.collides(other.boundingBox)) return [false];
        const a = this.getMinimumSeparation(other);
        console.log(a);
        
        if (a.separation <= 0)
            return [true, a.edges[0], a.normal];
        const b = other.getMinimumSeparation(this);
        console.log(b);
        if (b.separation <= 0)
            return [true, b.edges[0], b.normal];
        /* or (const vertex of this.polygon.vertices2D) {
            if (!other.polygon.myContains(vertex.x, vertex.y)) continue;
            const { separation, edges: [v1, v2], normal } = this.getMinimumSeparation(other);
            if (separation < 0) continue;
            //const normal = middle.subtract(other.center).normalize();
            console.log(other.polygon.vertices2D);

            console.log(`vertex: ${vertex.x}, ${vertex.y}`);
            console.log(`v1: ${v1.x}, ${v1.y}`);
            console.log(`v2: ${v2.x}, ${v2.y}`);
            //console.log(`middle: ${middle.x}, ${middle.y}`);

            console.log(`normal: ${normal.x}, ${normal.y}`);

            // to control javascript's floating point precision
            // if (Math.abs(normal.y) < 0.5) {
            //     normal.y = 0;
            //     normal.x = normal.x > 0 ? 1 : -1;
            // } else {
            //     normal.x = 0;
            //     normal.y = normal.y > 0 ? 1 : -1;
            // }
            this.lastCollision = other;
            return [true, vertex, normal];
        } */
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
    getMinimumSeparation(other: Collider): SeparationCollision {
        return other.polygon.vertices2D.reduce(
            (acc, vA, idxA, verticesA) => {
                const nextVertex = verticesA[(idxA + 1) % verticesA.length];
                const edge = nextVertex.subtract(vA);
                const normal = new Vector2D(edge.y, -edge.x).normalize();
                const minSep = Math.min(
                    ...this.polygon.vertices2D.map((vB) =>
                        vB.subtract(vA).dot(normal)
                    )
                );
                console.log(`Sep between ${vA} and ${nextVertex} on ${normal}: ${minSep}t`);
                
                if (acc.separation === -1 || minSep > acc.separation)
                    return {
                        separation: minSep,
                        normal,
                        edges: [vA, nextVertex]
                    };
                return acc;
            },
            {
                separation: -1,
                normal: Vector2D.Zero,
                edges: [Vector2D.Zero, Vector2D.Zero]
            }
        );
    }

    static fromPolygon(polygon: Polygon): Collider {
        return new Collider(BoundingBox.fromPolygon(polygon), polygon);
    }
}
