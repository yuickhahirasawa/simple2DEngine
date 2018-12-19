import PhysicalObject, {GameObjectData, PhysicalObjectData} from "../classes/PhysicalObject";
import Point from "../classes/Point";

export default function PhysicalObjectFabric(data:Partial<PhysicalObjectData & GameObjectData>):PhysicalObject {
    return new PhysicalObject({
        coord: data.coord || new Point(0, 0),
        dx: data.dx || 0,
        dy: data.dy || 0,
        speedX: data.speedX || 0,
        speedY: data.speedY || 0,
        m: data.m || 1,
        playable: data.playable || false,
        width: data.width || 10,
        height: data.height || 10,
        playerSpeedX: data.playerSpeedX || 0
    });
}