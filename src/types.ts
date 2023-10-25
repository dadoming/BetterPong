import { Vector2D } from "./Vector";

type Point = Vector2D;

export interface Line {
    start: Vector2D,
    end: Vector2D
}