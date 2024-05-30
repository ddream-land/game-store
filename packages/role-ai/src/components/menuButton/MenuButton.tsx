import { Button } from '@nextui-org/react'
import classes from './MenuButton.module.scss'
import { MouseEventHandler } from 'react'

export type MenuButtonProps = {
  onClick: MouseEventHandler
  className?: string
}

export default function MenuButton({
  onClick,
  className,
}: MenuButtonProps) {
  return (
    <Button
      className={`${classes.menuBtn} ${className ?? ''}`}
      onClick={onClick}
    ></Button>
  )
}
