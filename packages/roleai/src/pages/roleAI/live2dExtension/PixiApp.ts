import * as PIXI from 'pixi.js'
import Live2dExtensionModel from './Live2dExtensionModel'

class PixiApp extends PIXI.Application {
  constructor(canvas: HTMLCanvasElement) {
    // const mayHaveCanvas: HTMLElement | null = document.getElementById(CANVAS_ID)
    // // Delete the canvas
    // if (mayHaveCanvas) {
    //   mayHaveCanvas.remove()
    // }

    // const canvas = document.createElement('canvas')
    // canvas.id = CANVAS_ID
    // if (!window) {
    //   throw new Error(`Live2d must in client env.`)
    // }
    // window.document.body.append(canvas)

    super({
      view: canvas,
      resizeTo: window,
      antialias: true,
      backgroundAlpha: 0,
    })
  }
}

export default PixiApp
