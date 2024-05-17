import * as PIXI from 'pixi.js'
window.PIXI = PIXI
import PixiApp from './PixiApp'
import { InternalModel } from 'pixi-live2d-display'
import { DEBUG_PREFIX, ModelId } from './constants'
import Live2dExtensionModel from './Live2dExtensionModel'

export type AddModelOption = {
  dragglable?: boolean
  followCursor?: boolean
}

class Live2dExtensionManager {
  public pixiApp: PixiApp

  private models: Record<ModelId, Live2dExtensionModel<InternalModel>> = {}

  public get modelIds(): ModelId[] {
    return Reflect.ownKeys(this.models) as ModelId[]
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
  }

  public async addModel(modelPath: string, option?: AddModelOption) {
    let model: Live2dExtensionModel<InternalModel> | undefined
    try {
      model = await Live2dExtensionModel.from(modelPath)
    } catch (err) {
      throw new Error(`Load model failed.`)
    }
    // model.st_character = character
    // model.st_model_path = model_path
    // model.is_dragged = false
    console.debug(DEBUG_PREFIX, 'loaded', model)

    this.initModelOption(model, option)

    //@ts-ignore
    this.pixiApp.stage.addChild(model)

    this.models[model.id] = model

    return model
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

  private initModelOption(model: Live2dExtensionModel<InternalModel>, option?: AddModelOption) {
    const DEFAULT_OPTION: AddModelOption = {
      dragglable: true,
      followCursor: true,
    }

    const { dragglable, followCursor } = {
      ...DEFAULT_OPTION,
      ...(option ?? {}),
    }

    // Scale to canvas
    model.scale.set(window.innerHeight / model.height)

    dragglable ? model.setDragglable() : model.removeDragglable()

    model.followCursor(followCursor)

    model.position.x = (this.pixiApp.view.width - model.width) / 2

    // model.showFrames()
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
    return viewW - model.width
  }

  public modelOffsetHeight(model: Live2dExtensionModel<InternalModel>) {
    const viewH = this.pixiApp.view.height
    return viewH - model.height
  }

  public getOffsetXPercent(id: ModelId): number | undefined {
    if (id in this.models) {
      const model = this.models[id]
      return (model.x / this.modelOffsetWidth(model)) * 100
    }
    return undefined
  }

  public setOffsetXPercent(offsetXPercent: number, ids?: ModelId[]) {
    const offSetXPer = Math.max(Math.min(100, offsetXPercent), 0) / 100
    const self = this

    this.filterUpdateModel(ids, function (model) {
      const xVal = self.modelOffsetWidth(model) * offSetXPer
      model.x = xVal
    })
  }

  public getOffsetYPercent(id: ModelId): number | undefined {
    if (id in this.models) {
      const model = this.models[id]
      return (model.y / this.modelOffsetHeight(model)) * 100
    }
    return undefined
  }

  public setOffsetYPercent(offsetYPercent: number, ids?: ModelId[]) {
    const offSetYPer = Math.max(Math.min(100, offsetYPercent), 0) / 100
    const yVal = this.pixiApp.view.width * offSetYPer

    this.filterUpdateModel(ids, function (model) {
      model.y = yVal
    })
  }
}

export { Live2dExtensionManager }
