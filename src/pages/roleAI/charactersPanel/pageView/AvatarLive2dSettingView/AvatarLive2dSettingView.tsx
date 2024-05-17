import { useNavigateBack } from '@/router/useNavigateBack'
import classes from './AvatarLive2dSettingView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import ModelTransform from './ModelTransform/ModelTransform'
import ModelConfig from './ModelConfig/ModelConfig'

export default AvatarLive2dSettingView

function AvatarLive2dSettingView() {
  const { back } = useNavigateBack()

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
        <ModelTransform></ModelTransform>
        <ModelConfig></ModelConfig>
      </div>
    </div>
  )
}
