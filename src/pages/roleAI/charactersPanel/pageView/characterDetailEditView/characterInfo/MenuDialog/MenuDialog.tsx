import { useTranslation } from 'react-i18next'
import classes from './MenuDialog.module.scss'

export default MenuDialog

function MenuDialog() {
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
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        {t('rename')}
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        {t('linkToWorldBook')}
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        {t('export')}
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        {tCommon('delete')}
      </div>
    </div>
  )
}
