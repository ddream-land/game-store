import { Button } from '@nextui-org/react'
import classes from './BackButton.module.scss'
import { CSSProperties, MouseEventHandler } from 'react'

export type BackButtonProps = {
  onClick: MouseEventHandler
  color?: string
  bgColor?: string
  className?: string
}

export default function BackButton({ onClick, bgColor, color, className }: BackButtonProps) {
  const style: CSSProperties = {
    backgroundColor: bgColor ?? 'rgba(255, 255, 255, 0.2)',
    color: color ?? 'rgba(0,0,0,1)',
  }

  return (
    <Button className={`${className ?? ''} ${classes.backBtn}`} onClick={onClick} style={style}>
      <svg
        width="10"
        height="16"
        viewBox="0 0 10 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.25 14.5005C5.88748 12.792 3.76889 10.7923 1.94807 8.5531C1.68398 8.22832 1.68398 7.77261 1.94807 7.44784C3.76889 5.20865 5.88748 3.20889 8.25 1.50047"
          stroke="white"
          strokeWidth="2.17"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Button>
  )
}
