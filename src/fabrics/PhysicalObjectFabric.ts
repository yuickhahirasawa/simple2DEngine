import PhysicalObject, {PhysicalObjectData} from "../classes/PhysicalObject";
import Point from "../classes/Point";

export default function PhysicalObjectFabric(data:Partial<PhysicalObjectData>):PhysicalObject {
    return new PhysicalObject({
        coord: data.coord || new Point(0, 0),
        dx: data.dx || 0,
        dy: data.dy || 0,
        speedX: data.speedX || 0,
        m: data.m || 1
    });
}