import { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

export default ChatButton

type ChatButtonProps = {
  onClick?: MouseEventHandler
  className?: string
}

function ChatButton({ onClick, className }: ChatButtonProps) {
  const { t: tCommon } = useTranslation('common')
  return (
    <div
      onClick={(e) => onClick && onClick(e)}
      className={`${
        className ?? ''
      } h-[34px] w-[98px] bg-[#2E6EE6] text-white rounded-[17px] cursor-pointer flex flex-row justify-center items-center`}
    >
      <span>{tCommon('chat')}</span>
    </div>
  )
}
