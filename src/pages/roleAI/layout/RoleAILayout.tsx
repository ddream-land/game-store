import classes from './RoleAILayout.module.scss'

export interface RoleAILayoutProps {
  readonly charactersArea?: React.ReactNode
  readonly chatArea?: React.ReactNode
  readonly children?: React.ReactNode
}

function RoleAILayout({ charactersArea, chatArea, children }: RoleAILayoutProps) {
  return (
    <div className={`${classes.layout} relative pointer-events-none w-full h-full flex flex-row`}>
      <div className={`${classes.characters} flex-none h-full`}>{charactersArea}</div>
      <div className={`${classes.view} flex-1 h-full `}>{children}</div>
      <div className={`${classes.chat} flex-none h-full `}>{chatArea}</div>
    </div>
  )
}

export default RoleAILayout
