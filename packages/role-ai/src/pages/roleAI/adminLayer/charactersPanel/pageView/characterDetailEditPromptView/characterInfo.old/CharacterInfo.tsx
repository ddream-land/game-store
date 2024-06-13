import classes from './CharacterInfo.module.scss'
import { useTranslation } from 'react-i18next'
import { useCurrentAdminCharaInfoChecker } from '../../useCurrentAdminCharaInfoChecker'

export default CharacterInfo

function CharacterInfo() {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()

  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  const name = adminCharaInfo.card.data.name
  const desc = adminCharaInfo.card.data.description

  return (
    <div
      className={`${classes.characterInfo} w-full h-full relative flex flex-row justify-between`}
    >
      <div className={`${classes.name} truncate max-w-72`}>{name}</div>
      <div className={`${classes.editFlag}`}></div>
    </div>
  )
}
