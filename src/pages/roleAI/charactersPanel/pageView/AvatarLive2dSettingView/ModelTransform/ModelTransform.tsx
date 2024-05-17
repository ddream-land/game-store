import classes from './ModelTransform.module.scss'
import { Slider, SliderValue } from '@nextui-org/react'
import { useLive2dExtension } from '@/pages/roleAI/context/Live2dExtensionContextProvider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default ModelTransform

function ModelTransform() {
  const { managerRef } = useLive2dExtension()
  const { t } = useTranslation('roleAI')

  const modelIds = managerRef.current?.modelIds
  const id = modelIds && modelIds[0]

  const [scaleX, scaleY] = ((id && managerRef.current && managerRef.current.getScale(id)) ?? [
    1, 1,
  ]) as [number, number]

  const [scale, setScale] = useState(Math.max(scaleX, scaleY))
  async function scaleChange(value: SliderValue) {
    let scale = ((value as number) - 50) / 50 + 1
    scale <= 0 && (scale = 0.1)
    setScale(Math.round(scale * 10) / 10)
    managerRef.current && managerRef.current.setScale(scale, scale)
  }

  let live2dOffsetXPercent: number = 50
  if (managerRef.current && id) {
    live2dOffsetXPercent = managerRef.current.getOffsetXPercent(id) ?? 50
  }

  const [offsetX, setOffsetX] = useState(Math.round(live2dOffsetXPercent))
  async function offsetXChange(value: SliderValue) {
    const val = value as number
    setOffsetX(val)
    managerRef.current && managerRef.current.setOffsetXPercent(val)
  }

  let live2dOffsetYPercent: number = 50
  if (managerRef.current && id) {
    live2dOffsetYPercent = managerRef.current.getOffsetYPercent(id) ?? 50
  }
  const [offsetY, setOffsetY] = useState(Math.round(live2dOffsetYPercent))
  async function offsetYChange(value: SliderValue) {
    const val = value as number
    setOffsetY(val)
    managerRef.current && managerRef.current.setOffsetYPercent(val)
  }

  return (
    <div className={`${classes.modelTransform} w-full flex flex-col`}>
      <div className={`${classes.row} w-full flex flex-row`}>
        <div className={`${classes.desc} flex-none`}>{t('live2dScale')}</div>
        <div className={`${classes.slider} flex-1 px-4`}>
          <Slider
            size="sm"
            step={5}
            maxValue={100}
            minValue={0}
            aria-label="Scale"
            value={(scale - 1) * 50 + 50}
            className="max-w-md"
            classNames={{
              track: 'border-s-secondary-100',
              filler: 'bg-default-300/50',
              thumb: 'bg-transparent',
            }}
            onChange={scaleChange}
          />
        </div>
        <div className={`${classes.val} flex-none`}>{`${scale.toFixed(1)}x`}</div>
      </div>

      <div className={`${classes.row} w-full flex flex-row mt-16`}>
        <div className={`${classes.desc} flex-none`}>{t('live2dOffsetX')}</div>
        <div className={`${classes.slider} flex-1 px-4`}>
          <Slider
            size="sm"
            step={1}
            maxValue={100}
            minValue={0}
            aria-label="X"
            value={offsetX}
            className="max-w-md"
            classNames={{
              track: 'border-s-secondary-100',
              filler: 'bg-default-300/50',
              thumb: 'bg-transparent',
            }}
            onChange={offsetXChange}
          />
        </div>
        <div className={`${classes.val} flex-none`}>{`${offsetX}%`}</div>
      </div>

      <div className={`${classes.row} w-full flex flex-row mt-16`}>
        <div className={`${classes.desc} flex-none`}>{t('live2dOffsetY')}</div>

        <div className={`${classes.slider} flex-1 px-4`}>
          <Slider
            size="sm"
            step={1}
            maxValue={100}
            minValue={0}
            aria-label="Y"
            value={offsetY}
            className="max-w-md"
            classNames={{
              track: 'border-s-secondary-100',
              filler: 'bg-default-300/50',
              thumb: 'bg-transparent',
            }}
            onChange={offsetYChange}
          />
        </div>
        <div className={`${classes.val} flex-none`}>{`${offsetY}%`}</div>
      </div>
    </div>
  )
}
