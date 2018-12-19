import {Level} from "./Level";
import PhysicalObject from "./PhysicalObject";
import {fabric} from "fabric";
import {MaterialState} from "./Material";

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
            width: object.width,
            height: object.height
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
            const nextPoint = obj.data.getNextPoint();

            const materialRect = this.level.getMaterialRect(nextPoint);

            /*this._canvas.add(new fabric.Rect({
                top: nextPoint.y,
                left: nextPoint.x,
                fill: "yellow",
                width: 5,
                height: 5
            }));*/

            if (materialRect.material.state === MaterialState.LIQUID) {
                obj.data.coord.x += obj.data.speedX || obj.data.playerSpeedX;
                obj.data.coord.y += obj.data.speedY;
            }

            if (materialRect.material.state === MaterialState.GASEOUS) {
                obj.data.coord.x += obj.data.speedX || obj.data.playerSpeedX;
                obj.data.coord.y += obj.data.speedY;
            }

            if (materialRect.material.state === MaterialState.SOLID) {
                if (obj.data.speedY > 0) {
                    duration = ((materialRect.rect.y - obj.canvasObj.height) - obj.data.coord.y) / obj.data.speedY;
                    obj.data.coord.y = materialRect.rect.y - obj.canvasObj.height;
                    obj.data.coord.x += obj.data.speedX * duration;
                    console.log(((materialRect.rect.y - obj.canvasObj.height) - obj.data.coord.y), duration);
                    duration = duration < 50 ? 50 : duration;
                } else {
                    obj.data.coord.x += obj.data.speedX || obj.data.playerSpeedX;
                }
            }

            obj.canvasObj.animate('top', obj.data.coord.y, {
                duration,
                onChange: this._canvas.renderAll.bind(this._canvas)
            });
            obj.canvasObj.animate('left', obj.data.coord.x,  {
                duration,
                onChange: this._canvas.renderAll.bind(this._canvas)
            });

            if (materialRect.material.state === MaterialState.LIQUID) {
                obj.data.speedY -=
                    obj.canvasObj.width * obj.canvasObj.height * materialRect.material.ro + 9;

                obj.data.speedX = obj.data.speedX * materialRect.material.ro;
            }

            if (materialRect.material.state === MaterialState.GASEOUS) {
                obj.data.speedY += 9 + obj.data.dy;
                obj.data.speedX += obj.data.dx;
            }

            console.log(materialRect.material.state)
            if (materialRect.material.state === MaterialState.SOLID) {
                obj.data.speedY = - Math.round(obj.data.speedY * .3);

                if (obj.data.speedY < 0 && Math.abs(obj.data.speedY) < obj.canvasObj.height) {
                    obj.data.speedY = 0;
                    obj.data.speedX = 0;
                }
            }
        });

        const playableObject = this.physicalObjects.find(o => o.data.playable);
        if (playableObject) {
            const deltaRight = this._canvas.getWidth() - playableObject.data.coord.x;
            const deltaLeft = 0 - playableObject.data.coord.x;
            const toScrollDelta = this._canvas.getWidth() * 0.1;

            console.log(`Delta ${deltaRight} ${deltaLeft} ${toScrollDelta}`);
            if (Math.abs(deltaRight) < toScrollDelta) {
                const moovOn = deltaRight - toScrollDelta - 10;
                this.level.scroll(moovOn);
                this.physicalObjects.forEach(obj => {
                    obj.canvasObj.left += moovOn;
                })
            }

            if (Math.abs(deltaLeft) < toScrollDelta) {
                const moovOn = toScrollDelta - deltaLeft;
                this.level.scroll(moovOn);
            }

            this._canvas.renderAll();
        }
    }
}