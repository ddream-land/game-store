import classes from './CharacterInfo.module.scss'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import { useTranslation } from 'react-i18next'

export default CharacterInfo

function CharacterInfo() {
  const { charaCardInfo } = useCurrentCharacterCardInfo()
  if (!charaCardInfo) {
    throw new Error(`Runtime error.`)
  }

  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  const name = charaCardInfo.card.data.name
  const desc = charaCardInfo.card.data.description

  return (
    <div
      className={`${classes.characterInfo} w-full h-full relative flex flex-row justify-between`}
    >
      <div className={`${classes.name} truncate max-w-72`}>{name}</div>
      <div className={`${classes.editFlag}`}></div>
    </div>
  )
}
