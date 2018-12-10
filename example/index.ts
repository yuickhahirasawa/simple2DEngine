import Ground from "../src/Materials/Ground";
import Air from "../src/Materials/Air";
import {Level} from "../src/classes/Level";
import PhysicalObject from "../src/classes/PhysicalObject";
import PhysicalWorld from "../src/classes/PhysicalWorld";
import Point from "../src/classes/Point";
import {fabric} from "fabric";

const levelMatrix = [
    [new Air(), new Air, new Air(), new Air()],
    [new Air(), new Air, new Air(), new Air()],
    [new Air(), new Air, new Air(), new Air()],
    [new Ground(), new Ground(), new Ground(), new Air()]
];

const canvas = new fabric.StaticCanvas("canvas");
const level1 = new Level(levelMatrix, canvas);

const obj = new PhysicalObject({
    m: 1,
    coord: new Point(100, 0)
})

const world = new PhysicalWorld(level1, canvas);

world.addPhysicalObject(obj);