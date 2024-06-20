import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t } = useTranslation()

  return <div>{t('test')}</div>
}
