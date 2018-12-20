import {Level} from "./Level";
import PhysicalObject from "./PhysicalObject";
import {fabric} from "fabric";
import {MaterialState} from "./Material";
import Point from "./Point";

const g = 1;

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

    private _nextHypotheticalPoint(po:PhysicalObject, co:fabric.Object) {
        const yToCheck = po.speedY > 0 ?
            co.top + po.speedY + co.height :
            co.top + po.speedY;
        const xToCheck = po.speedX > 0 ?
            co.left + po.speedX + co.width :
            co.left + po.speedX;


    }

    private _recalculateWorld():void {
        setTimeout(() => {
            this.physicalObjects.forEach(obj => {
                const nextHypotheticalVerticalPoints = this._getNextVerticalPoint(obj.data, obj.canvasObj);
                const nextHypotheticalHorizontalPoints = this._getHorisontalPoint(obj.data, obj.canvasObj);
                const horisontalMaterialPoints = {
                    top: this.level.getMaterialRect(nextHypotheticalHorizontalPoints.top),
                    bottom: this.level.getMaterialRect(nextHypotheticalHorizontalPoints.bottom)
                };
                const verticalMaterialPoints = {
                    left: this.level.getMaterialRect(nextHypotheticalVerticalPoints.left),
                    right: this.level.getMaterialRect(nextHypotheticalVerticalPoints.right)
                };

                const verticalInGas = verticalMaterialPoints.left.material.state === MaterialState.GASEOUS &&
                    verticalMaterialPoints.right.material.state === MaterialState.GASEOUS;
                const horisontalInGas = horisontalMaterialPoints.top.material.state === MaterialState.GASEOUS &&
                    horisontalMaterialPoints.bottom.material.state === MaterialState.GASEOUS;
                const verticalOnSolid = verticalMaterialPoints.left.material.state === MaterialState.SOLID ||
                    verticalMaterialPoints.right.material.state === MaterialState.SOLID;
                const horisontalOnSolid = horisontalMaterialPoints.top.material.state === MaterialState.SOLID ||
                    horisontalMaterialPoints.bottom.material.state === MaterialState.SOLID;

                /*console.log(`ObjInGas: ${objInGas}`);
                console.log(`ObjToGasSide: ${objToGasSide}`);
                console.log(`ObjOnSolid: ${objOnSolid}`);
                console.log(`ObjToSolidSide: ${objToSolidSide}`);
                console.log('----------------------------dddd')*/

                if (horisontalOnSolid) {
                    console.log('toSolid');
                    obj.canvasObj.left = horisontalMaterialPoints.bottom.rect.x + obj.canvasObj.width * (obj.data.speedX > 0 ? 1 : 0);
                    obj.data.speedX = 0;
                }

                if (horisontalInGas) {
                    console.log('to gas');
                    obj.canvasObj.left += Math.max(obj.data.speedX, obj.data.playerSpeedX);
                    obj.data.speedX += obj.data.dx;
                }

                if (verticalInGas) {
                    obj.canvasObj.top += obj.data.speedY;
                    obj.data.speedY += obj.data.dy + g;
                }

                if (verticalOnSolid) {
                    if (obj.data.speedY > 0) {
                        const newTop = verticalMaterialPoints.right.rect.y  + obj.canvasObj.height * (obj.data.speedY > 0 ? -1 : 1);
                        const deltaTop = Math.abs(newTop - obj.canvasObj.top);
                        const t = deltaTop / obj.data.speedY;
                        obj.canvasObj.left += Math.trunc(obj.data.speedX * t);
                        obj.canvasObj.top = newTop;
                        obj.data.speedY = - Math.trunc(obj.data.speedY * 0.3);
                        obj.data.dy = 0;
                    }

                    if (Math.abs(obj.data.speedY) < 2 * g) {
                        obj.data.speedY = 0;
                        obj.data.dy = 0;
                    }

                    const solidMaterial = verticalMaterialPoints.left.material.state === MaterialState.SOLID ?
                        verticalMaterialPoints.left.material :
                        verticalMaterialPoints.right.material;

                    obj.data.speedX = Math.trunc(obj.data.speedX * solidMaterial.frictionK);
                }
            });

            /*const playableObject = this.physicalObjects.find(o => o.data.playable);

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
            }*/

            this._canvas.renderAll();
            requestAnimationFrame(() => {
                this._recalculateWorld();
            });
        }, 1000 / 5);
    }

    private _getHorisontalPoint(po:PhysicalObject, co:fabric.Object):{top:Point, bottom:Point} {
        const topY = co.top + po.speedY + 1;
        const bottomY = co.top + co.height + po.speedY - 1;

        let x = po.speedX >= 0 ?
            co.left + co.width + 1 :
            co.left - 1;
        x += po.speedX;

        return {
            top: new Point(x, topY),
            bottom: new Point(x, bottomY)
        }
    }

    private _getNextVerticalPoint(po:PhysicalObject, co:fabric.Object):{left:Point, right:Point} {
        const leftX = co.left + po.speedX + 1;
        const rightX = co.left + co.width + po.speedX - 1;

        let y = po.speedY >= 0 ?
            co.top + co.height + 1 :
            co.top - 1;
        y += po.speedY;

        return {
            left: new Point(leftX, y),
            right: new Point(rightX, y)
        };
    }
}