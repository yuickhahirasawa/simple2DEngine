import Material from "./Material";
import {fabric} from "fabric";

export class Level {
    private readonly _canvas: fabric.StaticCanvas;

    constructor(
        public readonly levelMatrix:Material[][],
        canvas:fabric.StaticCanvas
    ) {
        this._canvas = canvas;
        this.draw();
    }

    draw() {
        const chunkSize = Math.round(this._canvas.getHeight() / this.levelMatrix.length);

        for (let i = 0; i < this.levelMatrix.length; i++) {
            for (let j = 0; j < this.levelMatrix[i].length; j++) {
                const chunk = new fabric.Rect({
                    width: chunkSize,
                    height: chunkSize,
                    fill: this.levelMatrix[i][j].color,
                    left: j * chunkSize,
                    top: i * chunkSize
                });

                this._canvas.add(chunk);
            }
        }
    }
}