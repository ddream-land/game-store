import classes from './Detail.module.scss'
import Head from './Head'
import List from '../list/List'

export type DetailProps = { itemClicked?: (id: number) => void }

export default function ({ itemClicked }: DetailProps) {
  return (
    <div className={`${classes.d} flex flex-col h-full w-full`}>
      <div className="flex-none">
        <Head></Head>
      </div>
      <div className="flex-1 overflow-hidden">
        <List itemClicked={itemClicked}></List>
      </div>
    </div>
  )
}
