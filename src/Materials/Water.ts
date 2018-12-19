import Material, {MaterialState} from "../classes/Material";

export default class Water extends Material {
    constructor() {
        super({
            state: MaterialState.LIQUID,
            ro: 0.1,
            frictionK: 0.2,
            color: "aqua"
        });
    }
}