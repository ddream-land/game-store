import { useTranslation } from 'react-i18next'
import classes from './MenuDialog.module.scss'

export type MenuDialogProps = Readonly<{
  onRenameClicked: () => Promise<void>
  onLinkToWorldBookClicked: () => Promise<void>
  onExportClicked: () => Promise<void>
  onDeleteClicked: () => Promise<void>
}>

export default MenuDialog

function MenuDialog({
  onRenameClicked,
  onLinkToWorldBookClicked,
  onExportClicked,
  onDeleteClicked,
}: MenuDialogProps) {
  const { t } = useTranslation('roleAI')
  const { t: tCommon } = useTranslation('common')

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
      className={`${classes.menuDialog} absolute top-0 flex flex-col items-center`}
    >
      <div
        onClick={onRenameClicked}
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        {t('rename')}
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        onClick={onLinkToWorldBookClicked}
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        {t('linkToWorldBook')}
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        onClick={onExportClicked}
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        {t('export')}
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        onClick={onDeleteClicked}
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        {tCommon('delete')}
      </div>
    </div>
  )
}
