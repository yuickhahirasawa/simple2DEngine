import {Level, MaterialRect} from "./Level";
import PhysicalObject from "./PhysicalObject";
import {fabric} from "fabric";
import {MaterialState} from "./Material";
import Point from "./Point";

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

        requestAnimationFrame(() => {
            this._recalculateWorld();
        });
    }

    addPhysicalObject(object:PhysicalObject):void {
        const canvasObj = new fabric.Rect({
            left: object.coord.x,
            top: object.coord.y,
            fill: "red",
            width: object.width,
            height: object.height,

        });

        this.physicalObjects.push({
            data:object,
            canvasObj
        });
        this._canvas.add(canvasObj);
    }

    private _recalculateWorld():void {
        setTimeout(() => {
            this.physicalObjects.forEach(obj => {
                const nextVerticalPoints = this._getNextVerticalPoint(obj.data, obj.canvasObj);
                const nextHorisontalPoints = this._getHorisontalPoint(obj.data, obj.canvasObj);
                const materialRects = {
                    topRight: this.level.getMaterialRect()
                }

                if (obj.data.speedX > 0 && obj.data.speedY > 0) {
                    materialRect = this.level.getMaterialRect()
                }

                if (materialRect.material.state === MaterialState.LIQUID) {
                    obj.canvasObj.left += obj.data.speedX || obj.data.playerSpeedX;
                    obj.canvasObj.top += obj.data.speedY;
                }

                if (materialRect.material.state === MaterialState.GASEOUS) {
                    obj.canvasObj.left += obj.data.speedX || obj.data.playerSpeedX;
                    obj.canvasObj.top += obj.data.speedY;
                }

                if (materialRect.material.state === MaterialState.SOLID) {
                    if (obj.data.speedY > 0) {
                        duration = ((materialRect.rect.y - obj.canvasObj.height) - obj.canvasObj.top) / obj.data.speedY;
                        obj.canvasObj.top = materialRect.rect.y - obj.canvasObj.height;
                        obj.canvasObj.left += obj.data.speedX * duration;
                        console.log(((materialRect.rect.y - obj.canvasObj.height) - obj.data.coord.y), duration);
                        duration = duration < 50 ? 50 : duration;
                    } else {
                        obj.canvasObj.left += obj.data.speedX || obj.data.playerSpeedX;
                    }
                }

                if (materialRect.material.state === MaterialState.LIQUID) {
                    obj.data.speedY -=
                        obj.canvasObj.width * obj.canvasObj.height * materialRect.material.ro + 9;

                    obj.data.speedX = obj.data.speedX * materialRect.material.ro;
                }

                if (materialRect.material.state === MaterialState.GASEOUS) {
                    obj.data.speedY += 2 + obj.data.dy;
                    obj.data.speedX += obj.data.dx;
                }

                if (materialRect.material.state === MaterialState.SOLID) {
                    obj.data.speedY = - Math.round(obj.data.speedY * .3);

                    if (obj.data.speedY < 0 && Math.abs(obj.data.speedY) < obj.canvasObj.height * 0.1) {
                        obj.data.speedY = 0;
                        obj.data.speedX = 0;
                    }
                }
            });

            const playableObject = this.physicalObjects.find(o => o.data.playable);

            if (playableObject) {
                const deltaRight = this._canvas.getWidth() - playableObject.canvasObj.left;
                const deltaLeft = 0 - playableObject.canvasObj.left;
                const toScrollDelta = this._canvas.getWidth() * 0.1;

                if (Math.abs(deltaRight) < toScrollDelta) {
                    const moovOn = deltaRight - toScrollDelta;
                    const x = this.level.scroll(moovOn, "right");
                    this.physicalObjects.forEach(obj => {
                        obj.canvasObj.left += x;
                    })
                }

                if (Math.abs(deltaLeft) < toScrollDelta) {
                    const moovOn = toScrollDelta - deltaLeft;
                    const x = this.level.scroll(moovOn, "left");
                    this.physicalObjects.forEach(obj => {
                        obj.canvasObj.left += x;
                    })
                }

                this._canvas.renderAll();
            }

            requestAnimationFrame(() => {
                this._recalculateWorld();
            });
        }, 1000 / 60);
    }

    private _getHorisontalPoint(po:PhysicalObject, co:fabric.Object):{top:Point, bottom:Point} {
        const topY = co.top + po.speedY + po.dy;
        const bottomY = co.top + co.height + po.speedY + po.dy;

        let x = po.speedX + po.dx >= 0 ?
            co.left + co.width :
            co.left;
        x += po.speedX + po.dx;

        return {
            top: new Point(x, topY),
            bottom: new Point(x, bottomY)
        }
    }

    private _getNextVerticalPoint(po:PhysicalObject, co:fabric.Object):{left:Point, right:Point} {
        const leftX = co.left + po.speedX + po.dx;
        const rightX = co.left + co.width + po.speedX + po.dx;

        let y = po.speedY + po.dy >= 0 ?
            co.top + co.height :
            co.top;
        y += po.speedY + po.dy;

        return {
            left: new Point(leftX, y),
            right: new Point(rightX, y)
        };
    }
}