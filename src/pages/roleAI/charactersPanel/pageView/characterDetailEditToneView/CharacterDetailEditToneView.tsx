import classes from './CharacterDetailEditToneView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useTranslation } from 'react-i18next'
import { useCurrentCharaCardInfoChecker } from '../useCurrentCharaCardInfoChecker'
import { useNavigateBack } from '@/router/useNavigateBack'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'

export default CharacterDetailEditToneView

function CharacterDetailEditToneView() {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()
  const { uploadCurrentCharacterCardInfo } = useCurrentCharacterCardInfo()
  const { t: tCommon } = useTranslation('common')
  const { back } = useNavigateBack()

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      className={`${classes.characterDetailEditToneView} w-full h-full relative pointer-events-auto flex flex-col`}
    >
      <div className={`${classes.op} flex-none`}>
        <BackButton
          color={`rgba(0,0,0,1)`}
          bgColor={`rgba(255,255,255,1)`}
          onClick={back}
        ></BackButton>
      </div>
    </div>
  )
}
