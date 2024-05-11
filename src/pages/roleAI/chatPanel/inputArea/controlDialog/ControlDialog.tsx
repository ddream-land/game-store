import classes from './ControlDialog.module.scss'
import { useTranslation } from 'react-i18next'

export type ControlDialogProps = Readonly<{
  regenerate: () => void
  newChat: () => void
  closeChat: () => void
  continueMsg: () => void
  closeDialog: () => void
}>

export default function ControlDialog({
  regenerate,
  newChat,
  closeChat,
  continueMsg,
  closeDialog,
}: ControlDialogProps) {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  return (
    <>
      <div className={`${classes.controlDialog} absolute`}>
        <div className={`${classes.header} flex justify-end`}>
          <div onClick={closeDialog} className={`${classes.close} cursor-pointer`}></div>
        </div>
        <div className={`${classes.content} flex flex-row flex-wrap justify-center items-center`}>
          <div onClick={regenerate} className={`${classes.re} ${classes.btn} cursor-pointer`}>
            {t('regenerate')} &nbsp;
          </div>
          <div onClick={newChat} className={`${classes.new} ${classes.btn} cursor-pointer`}>
            {t('newConversation')} &nbsp;
          </div>
          <div onClick={continueMsg} className={`${classes.con} ${classes.btn} cursor-pointer`}>
            {tCommon('continue')} &nbsp;
          </div>
          <div onClick={closeChat} className={`${classes.clo} ${classes.btn} cursor-pointer`}>
            {t('hideConversation')} &nbsp;
          </div>
        </div>
      </div>
    </>
  )
}
