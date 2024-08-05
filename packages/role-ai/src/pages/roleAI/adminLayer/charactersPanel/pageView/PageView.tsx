import { ReactNode } from 'react'
import classes from './PageView.module.scss'

export type PageViewProps = Readonly<{
  children: ReactNode
}>

export default function PageView({ children }: PageViewProps) {
  return <div className={`${classes.pageView} ${classes.animate} absolute inset-0`}>{children}</div>
}
