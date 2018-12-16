import {Level} from "./Level";
import PhysicalObject from "./PhysicalObject";
import {fabric} from "fabric";
import Point from "./Point";
import Material from "./Material";
import Air from "../Materials/Air";
import Ground from "../Materials/Ground";

export default class PhysicalWorld {
    public readonly level:Level;
    public readonly physicalObjects:{
        data:PhysicalObject,
        canvasObj:fabric.Object
    }[] = [];

    private _canvas:fabric.StaticCanvas;

    constructor(level:Level, canvas:fabric.StaticCanvas) {
        this.level = level;
        this._canvas = canvas;
        this.level.draw();

        setInterval(() => {
            this._recalculateWorld();
        }, 100);
    }

    addPhysicalObject(object:PhysicalObject):void {
        const canvasObj = new fabric.Rect({
            left: object.coord.x,
            top: object.coord.y,
            fill: "red",
            width: 20,
            height: 20
        });

        this.physicalObjects.push({
            data:object,
            canvasObj
        });
        this._canvas.add(canvasObj);
    }

    private _recalculateWorld():void {
        this.physicalObjects.forEach(obj => {
            let duration = 100;
            const materialPoint = new Point(
                obj.data.dx > 0 ?
                    obj.data.coord.x + obj.canvasObj.width :
                    obj.data.coord.x,
                obj.data.dy > 0 ?
                    obj.data.coord.y + obj.canvasObj.height :
                    obj.data.coord.y - obj.canvasObj.height
            );
            const materialRect = this.level.getMaterialRect(materialPoint);

            if (materialRect.material instanceof Air) {
                obj.data.dy = obj.data.dy ?
                    obj.data.dy + 9 :
                    0.1;

                obj.data.coord.x += obj.data.speedX;
                obj.data.coord.y = obj.data.coord.y + obj.data.dy;
            }

            if (materialRect.material instanceof Ground) {
                obj.data.dy = - (obj.data.dy * 10);

                // obj.data.dy = 0;
                obj.data.dx = 0;
                obj.data.speedX = 0;

                const speedY = (materialRect.rect.y - obj.data.coord.y) / 100;
                duration = ((materialRect.rect.y - obj.canvasObj.height) - obj.data.coord.y) / speedY;
                obj.data.coord.y = materialRect.rect.y - obj.canvasObj.height;
            }

            console.log(obj.data.dy);

            obj.canvasObj.animate('top', obj.data.coord.y, {
                duration,
                onChange: this._canvas.renderAll.bind(this._canvas)
            });
            obj.canvasObj.animate('left', obj.data.coord.x,  {
                duration,
                onChange: this._canvas.renderAll.bind(this._canvas)
            });
        });
    }
}