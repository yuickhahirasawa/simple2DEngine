import Material from "./Material";
import {fabric} from "fabric";
import Point from "./Point";

export class Level {
    private readonly _canvas:fabric.StaticCanvas;
    private readonly _chunkSize:number;
    private _levelCanvasObjects:fabric.Rect[] = [];

    private _currentLevelX:number;

    get width():number {
        return this.levelMatrix[0].length * this._chunkSize;
    }

    get height():number {
        return this.levelMatrix.length * this._chunkSize;
    }

    constructor(
        public readonly levelMatrix:Material[][],
        canvas:fabric.StaticCanvas
    ) {
        this._canvas = canvas;
        this.draw();
        this._chunkSize = Math.round(this._canvas.getHeight() / this.levelMatrix.length);
        this._currentLevelX = 0;
    }

    scroll(x:number):void {
        for (let obj of this._levelCanvasObjects) {
            obj.left += x;
        }
    }

    draw() {
        for (let i = 0; i < this.levelMatrix.length; i++) {
            for (let j = 0; j < this.levelMatrix[i].length; j++) {
                const chunk = new fabric.Rect({
                    width: this._chunkSize,
                    height: this._chunkSize,
                    fill: this.levelMatrix[i][j].color,
                    left: j * this._chunkSize,
                    top: i * this._chunkSize
                });

                this._levelCanvasObjects.push(chunk);
                this._canvas.add(chunk);
            }
        }
    }

    getMaterialRect(point:Point):{
        material:Material,
        rect:{
            x:number,
            y:number,
            width:number,
            height:number
        }
    } {
        const i = Math.trunc(point.y / this._chunkSize);
        const j = Math.trunc(point.x / this._chunkSize);

        return {
            material: this.levelMatrix[i][j],
            rect: {
                x: j * this._chunkSize,
                y: i * this._chunkSize,
                width: this._chunkSize,
                height: this._chunkSize
            }
        };
    }
}