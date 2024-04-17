console.log('is client', window)

import * as PIXI from 'pixi.js'
window.PIXI = PIXI
import PixiApp from './PixiApp'
import { InternalModel } from 'pixi-live2d-display'
import { DEBUG_PREFIX, ModelId } from './constants'
import Live2DModel from './Live2DModel'

export type AddModelOption = {
  dragglable?: boolean
  followCursor?: boolean
}

class Live2dManager {
  public pixiApp: PixiApp

  private models: Record<ModelId, Live2DModel<InternalModel>> = {}

  constructor(canvas: HTMLCanvasElement) {
    this.pixiApp = new PixiApp(canvas)
  }

  public async addModel(modelPath: string, option?: AddModelOption) {
    let model: Live2DModel<InternalModel> | undefined
    try {
      model = await Live2DModel.from(modelPath)
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

    return model
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

  private initModelOption(model: Live2DModel<InternalModel>, option?: AddModelOption) {
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

    model.position.x = 500

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
    fn: (model: Live2DModel) => void
  ) {
    const { models, getUpdateIds } = this
    getUpdateIds(ids).forEach(function (id) {
      fn(models[id])
    })
  }

  public setScale(scaleX?: number, scaleY?: number, ids?: ModelId[]) {
    this.filterUpdateModel(ids, function (model) {
      model.scale.set(scaleX, scaleY)
    })
  }

  public setDraggle(dragglable: boolean = true, ids?: ModelId[]) {
    this.filterUpdateModel(ids, function (model) {
      dragglable ? model.setDragglable() : model.removeDragglable()
    })
  }
}

export default Live2dManager
