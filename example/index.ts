import Ground from "../src/Materials/Ground";
import Air from "../src/Materials/Air";
import {Level} from "../src/classes/Level";
import PhysicalObject from "../src/classes/PhysicalObject";
import PhysicalWorld from "../src/classes/PhysicalWorld";
import Point from "../src/classes/Point";
import {fabric} from "fabric";
import PhysicalObjectFabric from "../src/fabrics/PhysicalObjectFabric";
import Water from "../src/Materials/Water";

const levelMatrix = [
    [new Air(), new Air, new Air(), new Air(), new Air(), new Air()],
    [new Air(), new Air, new Air(), new Air(), new Air(), new Air()],
    // [new Water(), new Water, new Water(), new Water(), new Water(), new Water()],
    [new Ground(), new Ground(), new Ground(), new Ground(), new Ground(), new Air()]
];

const canvas = new fabric.StaticCanvas("canvas");
const level1 = new Level(levelMatrix, canvas);

const obj = PhysicalObjectFabric({
    coord: new Point(100, 200),
    speedX: 20,
    playable: true,
    width: 20,
    height: 20
});

const world = new PhysicalWorld(level1, canvas);

world.addPhysicalObject(obj);

window.onkeypress = (e:KeyboardEvent) => {
    if (e.key === ' ' && obj.speedY === 0) {
        obj.speedY = -40;
    }
}

window.onkeydown = (e:KeyboardEvent) => {
    console.log(e.key);
    if (e.key === 'a') {
        obj.playerSpeedX = -10;
    }

    if (e.key === 'd') {
        obj.playerSpeedX = 10;
    }
}

window.onkeyup = (e:KeyboardEvent) => {
    if (e.key === 'a' || e.key === 'd') {
        obj.playerSpeedX = 0;
    }
}