export enum MaterialState {
    SOLID = "SOLID",
    LIQUID = "LIQUID",
    GASEOUS = "GASEOUS"
}

export type MaterialData = {
    state:MaterialState;
    viscosityK:number;
    frictionK:number;

    color:string;
    texture?:string;
}

export default abstract class Material {
    private readonly _state:MaterialState;
    private readonly _viscosityK:number;
    private readonly _frictionK:number;
    private readonly _color:string;

    get state():MaterialState {
        return this._state;
    }

    get viscosityK():number {
        return this._viscosityK;
    }

    get frictionK():number {
        return this._frictionK;
    }

    get color():string {
        return this._color;
    }

    protected constructor(data:MaterialData) {
        this._state = data.state;
        this._viscosityK = data.viscosityK;
        this._frictionK = data.frictionK;
        this._color = data.color;
    }
}