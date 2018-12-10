import Point from "./Point";

type PhysicalObjectData = {
    m:number;
    coord:Point;
}

export default class PhysicalObject {
    private readonly _m:number;
    public readonly coord:Point;

    get m():number {
        return this._m;
    }

    constructor(data:PhysicalObjectData) {
        this._m = data.m;
        this.coord = data.coord;
    }
}