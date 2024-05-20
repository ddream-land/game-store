import classes from './CharacterInfo.module.scss'
import { useMenuDialog } from './useMenuDialog'
import MenuDialog from './MenuDialog/MenuDialog'
import { useTranslation } from 'react-i18next'
import MenuButton from '@/components/menuButton/MenuButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { MouseEventHandler } from 'react'
import { useCurrentCharaCardInfoChecker } from '../../useCurrentCharaCardInfoChecker'

export default CharacterInfo

export type CharacterInfoProps = Readonly<{
  editCoverClicked?: MouseEventHandler
  editAvatarClicked?: MouseEventHandler
  editToneClicked?: MouseEventHandler
  editPromptClicked?: MouseEventHandler
}>

function CharacterInfo({
  editCoverClicked,
  editAvatarClicked,
  editToneClicked,
  editPromptClicked,
}: CharacterInfoProps) {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  const name = charaCardInfo.card.data.name
  const creatorNotes = charaCardInfo.card.data.creator_notes
  const tags = charaCardInfo.card.data.tags

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
      <div className={`${classes.tags} overflow-hidden w-full flex flex-nowrap gap-2`}>
        {tags &&
          tags.map(function (tag, index) {
            return (
              <span key={index} className="flex-none">
                {`#${tag}`}
              </span>
            )
          })}
      </div>
      <div className={`${classes.desc} text-ellipsis overflow-hidden`}>{creatorNotes}</div>
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

        <NormalButton className={`${classes.btn}`} onClick={editToneClicked}>
          {tCommon('edit')}
          <br></br>
          {tCommon('tone')}
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
