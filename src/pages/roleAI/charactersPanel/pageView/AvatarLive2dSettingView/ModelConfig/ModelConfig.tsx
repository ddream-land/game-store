import classes from './ModelConfig.module.scss'
import { Slider, SliderValue, Switch, cn } from '@nextui-org/react'
import { useLive2dExtension } from '@/pages/roleAI/context/Live2dExtensionContextProvider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default ModelConfig

function ModelConfig() {
  const { managerRef } = useLive2dExtension()
  const { t } = useTranslation('roleAI')

  const modelIds = managerRef.current?.modelIds
  const id = modelIds && modelIds[0]

  let live2dFollowCursor: boolean = false
  if (managerRef.current && id) {
    live2dFollowCursor = managerRef.current.getFollowCursor(id) ?? false
  }

  const [followCursor, setFollowCursor] = useState(live2dFollowCursor)
  async function onFollowCursorChange(isSelected: boolean) {
    setFollowCursor(isSelected)
    managerRef.current?.setFollowCursor(id, isSelected)
  }

  return (
    <div className={`${classes.modelConfig} w-full flex flex-col mt-16`}>
      <div className={`${classes.row} w-full flex flex-row justify-between`}>
        <div className={`${classes.desc} flex-none`}>{t('live2dFollowCursor')}</div>
        <div className={`${classes.crtl} flex-none px-4`}>
          <Switch
            isSelected={followCursor}
            onValueChange={onFollowCursorChange}
            aria-label="Follow cursor"
            classNames={{
              wrapper: cn(
                'bg-gray-300',
                'data-[selected=true]:bg-gray-100',
                'group-data-[selected=true]:bg-gray-100'
              ),
              thumb: cn('bg-black'),
            }}
          />
        </div>
      </div>

      <div className={`${classes.row} w-full flex flex-row mt-16 justify-between`}>
        <div className={`${classes.desc} flex-none`}>{t('live2dLipSync')}</div>
        <div className={`${classes.slider} flex-none px-4`}>
          <Switch
            defaultSelected
            aria-label="Mouth"
            classNames={{
              wrapper: cn(
                'bg-gray-300',
                'data-[selected=true]:bg-gray-100',
                'group-data-[selected=true]:bg-gray-100'
              ),
              thumb: cn('bg-black'),
            }}
          />
        </div>
      </div>

      <div className={`${classes.row} w-full flex flex-row mt-16 justify-between`}>
        <div className={`${classes.desc} flex-none`}>{t('live2dClickAnimation')}</div>

        <div className={`${classes.slider} flex-none px-4`}>
          {/* <Slider
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
          /> */}
        </div>
      </div>
    </div>
  )
}
