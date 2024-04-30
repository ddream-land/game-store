import { Button } from '@nextui-org/react'
import classes from './BackButton.module.scss'
import { MouseEventHandler } from 'react'

export type BackButtonProps = {
  onClick: MouseEventHandler
}

export default function BackButton({
  onClick,
}: BackButtonProps) {
  return (
    <Button
      className={`${classes.backBtn}`}
      onClick={onClick}
    ></Button>
  )
}
