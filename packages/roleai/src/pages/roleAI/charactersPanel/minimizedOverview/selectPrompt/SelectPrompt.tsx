import { useTranslation } from 'react-i18next'
import classes from './SelectPrompt.module.scss'

export default SelectPrompt

function SelectPrompt() {
  const { t } = useTranslation('roleAI')

  return (
    <div
      className={`${classes.selectPrompt} w-full h-full flex flex-row`}
    >
      <div
        className={`${classes.avatar} flex justify-center items-center`}
      >
        <img src="/imgs/default-avatar.png" />
      </div>
      <div
        className={`${classes.txt} flex justify-center items-center`}
      >
        {t('selectADigitalLifeToChat')}
      </div>
    </div>
  )
}
