import { useNavigateBack } from '@/router/useNavigateBack'
import classes from './AvatarLive2dSettingView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import { Slider, SliderValue } from '@nextui-org/react'

export default AvatarLive2dSettingView

function AvatarLive2dSettingView() {
  const { back } = useNavigateBack()

  async function scaleChange(value: SliderValue) {
    const scale = ((value as number) - 50) / 50 + 1
  }

  return (
    <div
      className={`${classes.avatarLive2dSettingView} w-full h-full relative pointer-events-auto`}
    >
      <BackButton
        color={`rgba(0,0,0,1)`}
        bgColor={`rgba(255,255,255,1)`}
        onClick={back}
      ></BackButton>

      <div className={`${classes.content} w-full mt-14`}>
        <div className={`${classes.transform} w-full flex flex-col`}>
          <div className={`${classes.row} w-full flex flex-row`}>
            <div className={`${classes.desc} flex-none`}>缩放</div>
            <div className={`${classes.slider} flex-1 px-4`}>
              <Slider
                size="sm"
                step={5}
                maxValue={100}
                minValue={0}
                aria-label="Scale"
                defaultValue={50}
                className="max-w-md"
                classNames={{
                  track: 'border-s-secondary-100',
                  filler: 'bg-default-300/50',
                  thumb: 'bg-transparent',
                }}
                onChange={scaleChange}
              />
            </div>
            <div className={`${classes.val} flex-none`}>1x</div>
          </div>

          <div className={`${classes.row} w-full flex flex-row mt-16`}>
            <div className={`${classes.desc} flex-none`}>X位移</div>
            <div className={`${classes.slider} flex-1 px-4`}>
              <Slider
                size="sm"
                step={0.01}
                maxValue={1}
                minValue={0}
                aria-label="X"
                defaultValue={0.2}
                className="max-w-md"
                classNames={{
                  track: 'border-s-secondary-100',
                  filler: 'bg-default-300/50',
                  thumb: 'bg-transparent',
                }}
              />
            </div>
            <div className={`${classes.val} flex-none`}>1x</div>
          </div>

          <div className={`${classes.row} w-full flex flex-row mt-16`}>
            <div className={`${classes.desc} flex-none`}>Y位移</div>
            <div className={`${classes.slider} flex-1 px-4`}>
              <Slider
                size="sm"
                step={0.01}
                maxValue={1}
                minValue={0}
                aria-label="Y"
                defaultValue={0.2}
                className="max-w-md"
                classNames={{
                  track: 'border-s-secondary-100',
                  filler: 'bg-default-300/50',
                  thumb: 'bg-transparent',
                }}
              />
            </div>
            <div className={`${classes.val} flex-none`}>1x</div>
          </div>
        </div>
        <div className={`${classes.config} w-full`}></div>
      </div>
    </div>
  )
}
