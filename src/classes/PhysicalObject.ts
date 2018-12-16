import Point from "./Point";

export interface PhysicalObjectData {
    coord:Point;
    dx:number;
    dy:number;
    speedX:number;
    m:number;
}

export default class PhysicalObject implements PhysicalObjectData {
    constructor(data:PhysicalObjectData) {
        Object.assign(this, data);
    }

    coord: Point;
    dx: number;
    dy: number;
    speedX: number;
    m: number;
}