import { useNavigateBack } from '@/router/useNavigateBack'
import classes from './AvatarLive2dSettingView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import ModelTransform from './ModelTransform/ModelTransform'
import ModelConfig from './ModelConfig/ModelConfig'
import { useTranslation } from 'react-i18next'
import { DDLSplitLine } from '@ddreamland/common'
import { useCurrentAdminCharaInfoChecker } from '../useCurrentAdminCharaInfoChecker'

export default AvatarLive2dSettingView

function AvatarLive2dSettingView() {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  if (!adminCharaInfo) {
    return
  }

  const { back } = useNavigateBack()
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      className={`${classes.avatarLive2dSettingView} w-full h-full relative pointer-events-auto flex flex-col bg-[#121315] rounded-[12px]`}
    >
      <BackButton onClick={back}></BackButton>

      <div className="absolute text-[#fff] h-[34px] top-[24px] left-1/2 -translate-x-1/2">
        {t('avatar')} &nbsp; {tCommon('setting')}
      </div>

      <div className={`${classes.content} pt-[78px] flex flex-col overflow-hidden`}>
        <DDLSplitLine className="flex-none"></DDLSplitLine>

        <div className="p-[24px]">
          <ModelTransform></ModelTransform>

          <DDLSplitLine className="my-8"></DDLSplitLine>

          <ModelConfig></ModelConfig>
        </div>
      </div>
    </div>
  )
}
