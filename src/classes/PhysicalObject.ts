import Point from "./Point";

export interface PhysicalObjectData {
    width:number,
    height:number,
    coord:Point;
    dx:number;
    dy:number;
    speedX:number;
    speedY:number;
    m:number;
}

export interface GameObjectData {
    playable:boolean;
    playerSpeedX:number;
}

export default class PhysicalObject implements PhysicalObjectData, GameObjectData{
    constructor(data:PhysicalObjectData & GameObjectData) {
        Object.assign(this, data);
    }

    get S():number {
        return this.width * this.height;
    }

    getNextPoint():Point {
        let nextX = this.speedX + this.dx >= 0 ?
            this.coord.x + this.width :
            this.coord.x;
        nextX += this.speedX + this.dx;

        let nextY = this.speedY + this.dy >= 0 ?
            this.coord.y + this.height :
            this.coord.y;
        nextY += this.speedY + this.dy;

        return new Point(nextX, nextY);
    }

    playerSpeedX:number;
    playable:boolean;
    coord: Point;
    dx: number;
    dy: number;
    speedX: number;
    m: number;
    height: number;
    width: number;
    speedY: number;
}