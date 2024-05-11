import classes from './CharacterInfo.module.scss'
import { useMenuDialog } from './useMenuDialog'
import MenuDialog from './MenuDialog/MenuDialog'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import { useTranslation } from 'react-i18next'
import MenuButton from '@/components/menuButton/MenuButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { MouseEventHandler } from 'react'

export default CharacterInfo

export type CharacterInfoProps = Readonly<{
  editCoverClicked?: MouseEventHandler
  editAvatarClicked?: MouseEventHandler
  editPromptClicked?: MouseEventHandler
}>

function CharacterInfo({
  editCoverClicked,
  editAvatarClicked,
  editPromptClicked,
}: CharacterInfoProps) {
  const { charaCardInfo } = useCurrentCharacterCardInfo()
  if (!charaCardInfo) {
    throw new Error(`Runtime error.`)
  }

  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  const name = charaCardInfo.card.data.name
  const desc = charaCardInfo.card.data.description

  const {
    menuDialogOpened,
    openMenuDialog,
    renameClicked,
    linkToWorldBookClicked,
    exportClicked,
    deleteClicked,
  } = useMenuDialog()

  return (
    <div className={`${classes.characterInfo} w-full h-full relative`}>
      <div className={`${classes.name} truncate max-w-72`}>{name}</div>
      <div className={`${classes.desc} text-ellipsis overflow-hidden`}>{desc}</div>
      <div className={`${classes.op} flex flex-row gap-5`}>
        <NormalButton className={`${classes.btn}`} onClick={editCoverClicked}>
          {tCommon('edit')}
          <br></br>
          {t('cover')}
        </NormalButton>
        <NormalButton className={`${classes.btn}`} onClick={editAvatarClicked}>
          {tCommon('edit')}
          <br></br>
          {t('avatar')}
        </NormalButton>
        <NormalButton className={`${classes.btn}`} onClick={editPromptClicked}>
          {tCommon('edit')}
          <br></br>
          {t('prompt')}
        </NormalButton>
      </div>

      <MenuButton
        onClick={openMenuDialog}
        className={`${classes['menu-btn']} absolute`}
      ></MenuButton>

      {menuDialogOpened && (
        <MenuDialog
          onRenameClicked={renameClicked}
          onDeleteClicked={deleteClicked}
          onExportClicked={exportClicked}
          onLinkToWorldBookClicked={linkToWorldBookClicked}
        ></MenuDialog>
      )}
    </div>
  )
}
