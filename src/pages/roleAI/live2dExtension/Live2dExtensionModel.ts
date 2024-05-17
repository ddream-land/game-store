import * as PIXI from 'pixi.js'
import { Live2DModel as BaseModel, InternalModel } from 'pixi-live2d-display'
import { HitAreaFrames } from 'pixi-live2d-display/extra'
import { ModelId } from './constants'
import { Ticker } from '@pixi/ticker'

BaseModel.registerTicker(Ticker)

let uid = Date.now()

class Live2dExtensionModel<IM extends InternalModel = InternalModel> extends BaseModel<IM> {
  public readonly id: ModelId = (uid++).toString()

  private dragging: boolean = false

  constructor() {
    super()
  }

  // #region model drag: start
  private dragDownPositionState = {
    x: 0,
    y: 0,
  }

  private dragPointerDown(e: PIXI.InteractionEvent) {
    this.dragging = true
    this.dragDownPositionState.x = e.data.global.x - this.x
    this.dragDownPositionState.y = e.data.global.y - this.y
  }

  private dragPointerMove(e: PIXI.InteractionEvent) {
    if (!this.dragging) {
      return
    }
    const new_x = e.data.global.x - this.dragDownPositionState.x
    const new_y = e.data.global.y - this.dragDownPositionState.y

    this.position.x = new_x
    this.position.y = new_y
  }

  private dragPointerUpoutside() {
    this.dragging = false
  }

  private dragPointerUp() {
    this.dragging = false
  }

  public setDragglable() {
    // model.buttonMode = true
    this.on('pointerdown', this.dragPointerDown)
    this.on('pointermove', this.dragPointerMove)
    this.on('pointerupoutside', this.dragPointerUpoutside)
    this.on('pointerup', this.dragPointerUp)
  }

  public removeDragglable() {
    this.removeListener('pointerup', this.dragPointerUp)
    this.removeListener('pointerupoutside', this.dragPointerUpoutside)
    this.removeListener('pointermove', this.dragPointerMove)
    this.removeListener('pointerdown', this.dragPointerDown)
  }

  //#endregion model drag : end

  public showFrames() {
    const foreground = PIXI.Sprite.from(PIXI.Texture.WHITE)
    foreground.width = this.internalModel.width
    foreground.height = this.internalModel.height
    foreground.alpha = 0.2
    foreground.visible = true

    const hitAreaFrames = new HitAreaFrames()
    hitAreaFrames.visible = true

    this.addChild(foreground)
    this.addChild(hitAreaFrames)
  }

  private _followCursor = false
  public get followCursor(): boolean {
    return this._followCursor
  }

  public set followCursor(val: boolean) {
    this._followCursor = val
  }
}

export default Live2dExtensionModel
