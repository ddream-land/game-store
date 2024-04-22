import classes from './Character.module.scss'
import PageLeft from './page-left/PageLeft'
import PageRight from './page-right/PageRight'
import Live2dExt from '@/components/live2d-ext/Live2dExt'

interface LayoutProps {
  left?: React.ReactNode
  right?: React.ReactNode
  children?: React.ReactNode
}

function Layout({ left, right, children }: LayoutProps) {
  return (
    <div
      className={`${classes['layout']} relative pointer-events-none w-full h-full flex flex-row`}
    >
      <div className={`${classes['left']} flex-none h-full`}>{left}</div>
      <div className={`${classes['center']} flex-1 h-full `}>{children}</div>
      <div className={`${classes['right']} flex-none h-full `}>{right}</div>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <div className={`${classes.main} w-full h-full flex flex-row box-border`}>
        {/* <Live2dExt></Live2dExt> */}
        <Layout left={<PageLeft></PageLeft>} right={<PageRight></PageRight>}></Layout>
      </div>
    </>
  )
}
