import Material, {MaterialState} from "../classes/Material";

export default class Ground extends Material {
    constructor() {
        super({
            state: MaterialState.SOLID,
            viscosityK: 1,
            frictionK: 0.2,
            color: "brown"
        });
    }
}