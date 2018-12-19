import Material, {MaterialState} from "../classes/Material";

export default class Ground extends Material {
    constructor() {
        super({
            state: MaterialState.SOLID,
            ro: 1,
            frictionK: 0.2,
            color: "brown"
        });
    }
}