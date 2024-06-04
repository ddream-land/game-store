import { useTranslation } from 'react-i18next'
import classes from './SelectPrompt.module.scss'
import { DDLSplitLine } from '@ddreamland/common'

export default SelectPrompt

function SelectPrompt() {
  const { t } = useTranslation('roleAI')

  return (
    <div className={`${classes.selectPrompt} w-full h-full flex flex-col items-center`}>
      <div className={`${classes.img}`}></div>
      <DDLSplitLine className=""></DDLSplitLine>
      <div
        className={`${classes.btn} mt-4 w-full h-[41px] bg-[#3A71FF] rounded-[12px] flex justify-center items-center`}
      >
        {t('chatWithAINow')}
      </div>
    </div>
  )
}
