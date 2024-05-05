import classes from './CharacterDetailEditAvatarView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCurrentCharaCardInfoChecker } from '../useCurrentCharaCardInfoChecker'

export default CharacterDetailEditAvatarView

function CharacterDetailEditAvatarView() {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()

  const navigate = useNavigate()
  const { t: tCommon } = useTranslation('common')

  function backClicked() {
    navigate(-1)
  }

  return (
    <div className={`${classes.characterDetailEditAvatarView} w-full h-full relative`}>
      <div className={`${classes.op}`}>
        <BackButton
          color={`rgba(0,0,0,1)`}
          bgColor={`rgba(255,255,255,1)`}
          onClick={backClicked}
        ></BackButton>

        <NormalButton className={`${classes.editBtn} absolute`} size={`small`}></NormalButton>
      </div>

      <div className={`${classes.content} mt-20 px-4`}>
        <div className={`${classes.panel}`}>
          <div className={`${classes.header} flex flex-row justify-between items-center px-2`}>
            <div className={`${classes.title}`}>Live2D</div>
            <NormalButton className={`${classes.add}`} size={`small`}>
              +{' '}
            </NormalButton>
          </div>

          <div className={`${classes.listArea} mt-2`}></div>
        </div>
      </div>
    </div>
  )
}
