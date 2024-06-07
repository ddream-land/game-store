import classes from './ControlDialog.module.scss'
import { useTranslation } from 'react-i18next'
import { DDLSplitLine } from '@ddreamland/common'

export type ControlDialogProps = Readonly<{
  regenerate: () => void
  newChat: () => void
  closeChat: () => void
  continueMsg: () => void
  closeDialog: () => void
  regenerateEnable: boolean
  continueEnable: boolean
}>

export default function ControlDialog({
  regenerate,
  newChat,
  closeChat,
  continueMsg,
  closeDialog,
  regenerateEnable,
  continueEnable,
}: ControlDialogProps) {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  return (
    <>
      <div className={`${classes.controlDialog} absolute`}>
        <div className={`${classes.content} flex flex-col justify-center items-center`}>
          <div
            onClick={() => {
              regenerateEnable && regenerate()
            }}
            className={`${classes.re} ${classes.btn} ${
              regenerateEnable ? '' : classes.disable
            } cursor-pointer`}
          >
            <span className={`${classes.icon}`}></span> <span>{t('regenerate')}</span>
          </div>
          <DDLSplitLine className=""></DDLSplitLine>
          {/* <div onClick={newChat} className={`${classes.new} ${classes.btn} cursor-pointer`}>
            {t('newConversation')} &nbsp;
          </div> */}
          <div
            onClick={() => {
              continueEnable && continueMsg()
            }}
            className={`${classes.con} ${classes.btn} ${
              continueEnable ? '' : classes.disable
            } cursor-pointer`}
          >
            <span className={`${classes.icon}`}></span> <span>{tCommon('continue')}</span>
          </div>
          <DDLSplitLine className=""></DDLSplitLine>
          <div onClick={closeChat} className={`${classes.clo} ${classes.btn} cursor-pointer`}>
            <span className={`${classes.icon}`}></span> <span>{t('endConversation')}</span>
          </div>
        </div>
      </div>
    </>
  )
}
