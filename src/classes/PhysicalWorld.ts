import {Level} from "./Level";
import PhysicalObject from "./PhysicalObject";
import {fabric} from "fabric";

export default class PhysicalWorld {
    public readonly level:Level;
    public readonly physicalObject:{
        data:PhysicalObject,
        canvasObj:fabric.Object
    }[] = [];

    private _canvas:fabric.StaticCanvas;

    constructor(level:Level, canvas:fabric.StaticCanvas) {
        this.level = level;
        this._canvas = canvas;
    }

    addPhysicalObject(object:PhysicalObject):void {
        const canvasObj = new fabric.Rect({
            left: object.coord.x,
            top: object.coord.y,
            fill: "red",
            width: 20,
            height: 20
        });

        this.physicalObject.push({
            data:object,
            canvasObj
        });
        this._canvas.add(canvasObj);
        this._recalculateWorld();
    }

    private _recalculateWorld():void {

    }
}