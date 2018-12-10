import Material, {MaterialState} from "../classes/Material";

export default class Air extends Material {
    constructor() {
        super({
            state: MaterialState.GASEOUS,
            viscosityK: 1,
            frictionK: 0.2,
            color: "blue"
        });
    }
}