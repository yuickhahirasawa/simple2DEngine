export enum MaterialState {
    SOLID = "SOLID",
    LIQUID = "LIQUID",
    GASEOUS = "GASEOUS"
}

export type MaterialData = {
    state:MaterialState;
    ro:number;
    frictionK:number;

    color:string;
    texture?:string;
}

export default abstract class Material {
    private readonly _state:MaterialState;
    private readonly _ro:number;
    private readonly _frictionK:number;
    private readonly _color:string;

    get state():MaterialState {
        return this._state;
    }

    get ro():number {
        return this._ro;
    }

    get color():string {
        return this._color;
    }

    protected constructor(data:MaterialData) {
        this._state = data.state;
        this._ro = data.ro;
        this._frictionK = data.frictionK;
        this._color = data.color;
    }
}