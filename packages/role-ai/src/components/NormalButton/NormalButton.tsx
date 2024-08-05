import { Button } from '@nextui-org/react'
import classes from './NormalButton.module.scss'
import { MouseEventHandler } from 'react'

export type NormalButtonProps = {
  children?: React.ReactNode
  onClick?: MouseEventHandler
  className?: string
  size?: 'small' | 'normal'
}

export default function NormalButton({ children, onClick, className, size }: NormalButtonProps) {
  function classNames() {
    let sizeClassname = classes.normal
    switch (size) {
      case 'small': {
        sizeClassname = classes.small
        break
      }
    }

    return `${className ?? ''} ${classes.normalBtn} ${sizeClassname}`
  }

  return (
    <Button
      className={`flex-none cursor-pointer flex flex-row justify-center items-center ${classNames()}`}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
