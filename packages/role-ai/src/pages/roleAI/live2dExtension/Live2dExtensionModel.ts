import * as PIXI from 'pixi.js'
import {
  Live2DModel as BaseModel,
  InternalModel,
  MotionPriority,
  MotionState,
} from 'pixi-live2d-display'
import { HitAreaFrames } from 'pixi-live2d-display/extra'
import { ModelId } from './constants'
import { Ticker } from '@pixi/ticker'
import { Expression, ModelInitOption, MotionGroup } from './core'

BaseModel.registerTicker(Ticker)

let uid = Date.now()

class Live2dExtensionModel<IM extends InternalModel = InternalModel> extends BaseModel<IM> {
  public readonly id: ModelId = (uid++).toString()

  constructor() {
    super()

    // this.internalModel.motionManager.on('motionStart', this.motionStart)
    this.on('hit', this.onHit)
  }

  // #region model drag: start
  private dragDownPositionState = {
    x: 0,
    y: 0,
  }
  private dragging: boolean = false

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

  public get motions() {
    const motionGroups: MotionGroup[] = []
    const motionManager = this.internalModel.motionManager
    const definitions = motionManager.definitions
    for (const [groupName, groupMotions] of Object.entries(definitions)) {
      const motions = groupMotions?.map(function (motion, index) {
        return {
          file: motion.file || motion.File || '',
          error:
            motionManager.motionGroups[groupName]![index]! === null ? 'Faild to load' : undefined,
        }
      })
      motionGroups.push({
        groupName: groupName,
        motions: motions ?? [],
      })
    }

    return motionGroups
  }

  public async startMotion(groupName: string, index?: number, priority?: MotionPriority) {
    return await this.motion(groupName, index, priority)
  }

  private motionStart(groupName: string, index: number) {
    const motionManager = this.internalModel.motionManager
    const motion = motionManager.motionGroups[groupName]?.[index]
    if (motion) {
      let motionDuration = 0
      if ('_loopDurationSeconds' in motion) {
        motionDuration = motion._loopDurationSeconds * 1000
      } else if ('getDurationMSec' in motion) {
        motionDuration = motion.getDurationMSec()
      }
    }
  }

  public get expressions(): Expression[] {
    const motionManager = this.internalModel.motionManager
    const expressionManager = motionManager.expressionManager

    const expressions = expressionManager?.definitions.map(function (expression, index) {
      return {
        file: expression.file || expression.File || '',
        error: expressionManager!.expressions[index]! === null ? 'Failed to load' : undefined,
      }
    })

    return expressions ?? []
  }

  public async setExpression(index: number) {
    return await this.expression(index)
  }

  public onHit(hitAreaNames: string[]) {
    const motions = this.motions
    const len = motions.length

    for (let area of hitAreaNames) {
      area = area.toLowerCase()
      const possibleGroups = [area, 'tap' + area, 'tap_' + area, 'tap']
      for (const possibleGroup of possibleGroups) {
        for (let i = 0; i < len; i++) {
          const motion = motions[i]
          if (possibleGroup === motion.groupName.toLowerCase()) {
            this.startMotion(motion.groupName)
            return
          }
        }
      }
    }
  }

  public destroy(options?: {
    children?: boolean | undefined
    texture?: boolean | undefined
    baseTexture?: boolean | undefined
  }): void {
    this.off('motionStart', this.motionStart)
    this.off('hit', this.onHit)
    super.destroy(options)
  }
}

export default Live2dExtensionModel
