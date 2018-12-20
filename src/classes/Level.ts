import Material from "./Material";
import {fabric} from "fabric";
import Point from "./Point";

export class Level {
    private readonly _canvas:fabric.StaticCanvas;
    private readonly _chunkSize:number;
    private _levelCanvasObjects:fabric.Rect[] = [];
    private _deltaX = 0;

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
    }

    scroll(x:number, direction:"left"|"right"):number {
        console.log(direction, this._deltaX + x, this.width, this._canvas.getWidth(), this._chunkSize, this.levelMatrix[0].length);
        if (direction === "right" && Math.abs(this._deltaX + x) > this.width - this._canvas.getWidth()) {
            x = this.width - this._canvas.getWidth() - Math.abs(this._deltaX);
        }

        if (direction === "left" && this._deltaX + x > 0) {
            x = -this._deltaX;
        }

        this._deltaX += x;

        if (x) {
            this._levelCanvasObjects.forEach(obj => {
                this._canvas.remove(obj);
            });
            this.draw();
        }

        return x;
    }

    draw() {
        for (let i = 0; i < this.levelMatrix.length; i++) {
            for (let j = 0; j < this.levelMatrix[i].length; j++) {
                const chunk = new fabric.Rect({
                    width: this._chunkSize,
                    height: this._chunkSize,
                    fill: this.levelMatrix[i][j].color,
                    left: this._deltaX + j * this._chunkSize,
                    top: i * this._chunkSize
                });

                this._levelCanvasObjects.push(chunk);
                this._canvas.add(chunk);
                this._canvas.sendToBack(chunk);
            }
        }
    }

    getMaterialRect(point:Point):MaterialRect {
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

export interface MaterialRect {
    material:Material,
    rect:{
        x:number,
        y:number,
        width:number,
        height:number
    }
}
