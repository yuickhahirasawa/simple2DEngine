enum MaterialState {
    SOLID = "SOLID",
    LIQUID = "LIQUID",
    GASEOUS = "GASEOUS"
}

type MaterialData = {
    speedIn:number;
    frictionK:number;
}

export default abstract class Material {
    protected constructor(
        public readonly speed:number
    ) {}
}