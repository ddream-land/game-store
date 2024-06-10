import { useTranslation } from 'react-i18next'
import classes from './MenuDialog.module.scss'

export type MenuDialogProps = Readonly<{
  onRenameClicked?: () => Promise<void>
  onCallMeByClicked?: () => Promise<void>
  onLinkToWorldBookClicked?: () => Promise<void>
  onExportClicked?: () => Promise<void>
  onDeleteClicked?: () => Promise<void>
}>

export default MenuDialog

function MenuDialog({
  onRenameClicked,
  onCallMeByClicked,
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
      className={`${classes.menuDialog} absolute w-[172px] h-[180px] rounded-[10px] bg-[#28292D] text-[#C0C0C0] py-[8px] top-[64px] right-[20px] flex flex-col items-start justify-between`}
    >
      <div
        onClick={() => onRenameClicked && onRenameClicked()}
        className={`${classes.btn} cursor-pointer px-[12px] my-[8px] w-full flex-1 flex justify-start items-center hover:bg-[#323339]`}
      >
        {t('rename')}
      </div>
      <div
        onClick={() => onExportClicked && onExportClicked()}
        className={`${classes.btn} cursor-pointer px-[12px] my-[8px] w-full flex-1 flex justify-start items-center hover:bg-[#323339]`}
      >
        {t('export')}
      </div>
      <div
        onClick={() => onDeleteClicked && onDeleteClicked()}
        className={`${classes.btn} cursor-pointer px-[12px] my-[8px] w-full flex-1 flex justify-start items-center hover:bg-[#323339]`}
      >
        {tCommon('delete')}
      </div>
    </div>
  )
}
