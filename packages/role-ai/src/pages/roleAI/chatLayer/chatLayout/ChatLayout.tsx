import classes from './ChatLayout.module.scss'

export interface ChatLayoutProps {
  readonly chatArea?: React.ReactNode
  readonly children?: React.ReactNode
}

function ChatLayout({ chatArea, children }: ChatLayoutProps) {
  return (
    <div
      className={`${classes.layout} absolute inset-0 pointer-events-none w-full h-full flex flex-row`}
    >
      <div className={`${classes.view} flex-1 h-full `}>{children}</div>
      <div className={`${classes.chat} flex-none h-full `}>{chatArea}</div>
    </div>
  )
}

export default ChatLayout
