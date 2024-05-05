import classes from './CharacterInfo.module.scss'
import { useMenuDialog } from './useMenuDialog'
import MenuDialog from './MenuDialog/MenuDialog'
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

  const { menuDialogOpened, openMenuDialog } = useMenuDialog()

  return (
    <div className={`${classes.characterInfo} w-full h-full relative`}>
      <div className={`${classes.name} truncate max-w-72`}>{name}</div>
      <div className={`${classes.desc} text-ellipsis overflow-hidden`}>{desc}</div>
      <div className={`${classes.op} flex flex-row gap-5`}>
        <div
          className={`${classes.btn} flex-none cursor-pointer flex flex-row justify-center items-center`}
        >
          {tCommon('edit')}
          <br></br>
          {t('cover')}
        </div>
        <div
          className={`${classes.btn} flex-none cursor-pointer flex flex-row justify-center items-center`}
        >
          {tCommon('edit')}
          <br></br>
          {t('avatar')}
        </div>
        <div
          className={`${classes.btn} flex-none cursor-pointer flex flex-row justify-center items-center`}
        >
          {tCommon('edit')}
          <br></br>
          {t('prompt')}
        </div>
      </div>

      <div
        onClick={openMenuDialog}
        className={`${classes['menu-btn']} absolute cursor-pointer`}
      ></div>

      {menuDialogOpened && <MenuDialog></MenuDialog>}
    </div>
  )
}
