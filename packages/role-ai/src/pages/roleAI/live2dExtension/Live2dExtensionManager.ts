import * as PIXI from 'pixi.js'
window.PIXI = PIXI
import PixiApp from './PixiApp'
import { Cubism4ModelSettings, InternalModel, ModelSettings } from 'pixi-live2d-display'
import { DEBUG_PREFIX, ModelId } from './constants'
import Live2dExtensionModel from './Live2dExtensionModel'
import { ModelInitOption } from './core'

class Live2dExtensionManager {
  public pixiApp: PixiApp

  private models: Record<ModelId, Live2dExtensionModel<InternalModel>> = {}

  public get modelIds(): ModelId[] {
    return Reflect.ownKeys(this.models) as ModelId[]
  }

  public get canvas(): HTMLCanvasElement {
    return this.pixiApp.view
  }

  public getModel(id: ModelId | undefined): Live2dExtensionModel<InternalModel> | undefined {
    if (id && id in this.models) {
      const model = this.models[id]
      return model
    }
    return undefined
  }

  constructor(canvas: HTMLCanvasElement) {
    this.pixiApp = new PixiApp(canvas)
    document.addEventListener('pointermove', this.pointerMoveFocus.bind(this))
  }

  public destroy() {
    document.removeEventListener('pointermove', this.pointerMoveFocus.bind(this))
  }

  public async addModel(modelPath: string, option?: ModelInitOption) {
    let model: Live2dExtensionModel<InternalModel> | undefined
    try {
      model = await Live2dExtensionModel.from(modelPath)
    } catch (err) {
      throw new Error(`Load model failed.  ${modelPath}. ${err}`)
    }
    // model.st_character = character
    // model.st_model_path = model_path
    // model.is_dragged = false
    // console.debug(DEBUG_PREFIX, 'loaded', model)

    this.initModelOption(model, option)

    this.pixiApp.stage.addChild(model)

    this.models[model.id] = model

    return model
  }

  private initModelOption(model: Live2dExtensionModel<InternalModel>, option?: ModelInitOption) {
    const DEFAULT_OPTION = {
      dragglable: true,
      followCursor: true,
      autoInteract: false,
    }

    const { dragglable, followCursor, autoInteract } = {
      ...DEFAULT_OPTION,
      ...(option ?? {}),
    }

    model.autoInteract = autoInteract
    model.followCursor = followCursor

    // Scale to canvas
    model.scale.set(this.pixiApp.view.height / model.height)

    dragglable ? model.setDragglable() : model.removeDragglable()

    model.position.x = (this.pixiApp.view.width - model.width) / 2

    // console.log(model.internalModel.settings)

    // model.motion()
    // model.showFrames()
  }

  public modelExistByModelPath(modelPath: string) {
    const { models } = this
    const modelIds = Reflect.ownKeys(models) as ModelId[]
    const len = modelIds.length
    for (let i = 0; i < len; i++) {
      const id = modelIds[i]
      const model = models[id]
      if (model.internalModel.settings.url === modelPath) {
        return true
      }
    }
    return false
  }

  public removeModel(id: ModelId) {
    if (!(id in this.models)) {
      return
    }
    const model = this.models[id]
    if (model) {
      this.pixiApp.stage.removeChild(model)
      model.destroy({
        children: true,
        texture: true,
        baseTexture: true,
      })
    }
    Reflect.deleteProperty(this.models, id)
  }

  public removeModels(ids?: ModelId[]) {
    const self = this
    this.getUpdateIds(ids).forEach(function (id) {
      self.removeModel(id)
    })
  }

  public removeAll() {
    this.removeModels()
  }

  private getUpdateIds(ids?: ModelId[]): ModelId[] {
    let updateIds = ids
    if (!updateIds) {
      updateIds = Reflect.ownKeys(this.models) as ModelId[]
    }
    return updateIds
  }

  private filterUpdateModel(
    ids: ModelId[] | undefined = undefined,
    fn: (model: Live2dExtensionModel) => void
  ) {
    const self = this
    this.getUpdateIds(ids).forEach(function (id) {
      fn(self.models[id])
    })
  }

  public setScale(scaleX?: number, scaleY?: number, ids?: ModelId[]) {
    this.filterUpdateModel(ids, function (model) {
      model.scale.set(scaleX, scaleY)
    })
  }

  public getScale(id: ModelId): [number, number] | undefined {
    if (id in this.models) {
      const s = this.models[id].scale
      return [s.x, s.y]
    }
  }

  public setDraggle(dragglable: boolean = true, ids?: ModelId[]) {
    this.filterUpdateModel(ids, function (model) {
      dragglable ? model.setDragglable() : model.removeDragglable()
    })
  }

  public modelOffsetWidth(model: Live2dExtensionModel<InternalModel>) {
    const viewW = this.pixiApp.view.width
    return viewW + model.width
  }

  public getOffsetXPercent(id: ModelId): number | undefined {
    if (id in this.models) {
      const model = this.models[id]
      return ((model.x + model.width) / this.modelOffsetWidth(model)) * 100
    }
    return undefined
  }

  public setOffsetXPercent(offsetXPercent: number, ids?: ModelId[]) {
    const offSetXPer = Math.max(Math.min(100, offsetXPercent), 0) / 100
    const self = this

    this.filterUpdateModel(ids, function (model) {
      const xVal = self.modelOffsetWidth(model) * offSetXPer
      model.x = xVal - model.width
    })
  }

  public modelOffsetHeight(model: Live2dExtensionModel<InternalModel>) {
    const viewH = this.pixiApp.view.height
    return viewH + model.height
  }

  public getOffsetYPercent(id: ModelId): number | undefined {
    if (id in this.models) {
      const model = this.models[id]
      return ((model.y + model.height) / this.modelOffsetHeight(model)) * 100
    }
    return undefined
  }

  public setOffsetYPercent(offsetYPercent: number, ids?: ModelId[]) {
    const offSetYPer = Math.max(Math.min(100, offsetYPercent), 0) / 100
    const self = this

    this.filterUpdateModel(ids, function (model) {
      const yVal = self.modelOffsetHeight(model) * offSetYPer
      model.y = yVal - model.height
    })
  }

  private pointerMoveFocus(e: PointerEvent) {
    // console.log(e.clientX, this, this.filterUpdateModel)
    this.filterUpdateModel(undefined, function (model) {
      if (model.followCursor) {
        model.focus(e.clientX, e.clientY)
      }
    })
  }

  public getFollowCursor(id: ModelId): boolean | undefined {
    if (id in this.models) {
      const model = this.models[id]
      return model.followCursor
    }
    return undefined
  }

  public setFollowCursor(id: ModelId | undefined, val: boolean): void {
    if (id && id in this.models) {
      const model = this.models[id]
      model.followCursor = val
    }
  }

  public setLipSync(id: ModelId | undefined, val: boolean): void {
    if (id && id in this.models) {
      const model = this.models[id]
      model.lipSync = val
    }
  }
}

export { Live2dExtensionManager }
