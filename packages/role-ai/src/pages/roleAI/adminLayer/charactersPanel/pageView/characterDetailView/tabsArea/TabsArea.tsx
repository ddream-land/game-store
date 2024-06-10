import { Key, useRef, useState, WheelEvent } from 'react'
import classes from './TabsArea.module.scss'
import { isArray, isKey, isNumber, isString } from '@/libs/isTypes'
import { useTranslation } from 'react-i18next'
import { Tab, Tabs, Textarea, cn } from '@nextui-org/react'
import { useCurrentCharaCardInfoChecker } from '../../useCurrentCharaCardInfoChecker'

export default TabsArea

export type TabsAreaProps = Readonly<{
  fullDetail?: boolean
}>

function TabsArea({ fullDetail }: TabsAreaProps) {
  const { t } = useTranslation('roleAI')
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()

  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [tabs] = useState([
    { prop: 'description', txt: t('description') },
    { prop: 'personality', txt: t('personality') },
    { prop: 'first_mes', txt: t('greetingMsg') },
    { prop: 'mes_example', txt: t('msgExample') },
    { prop: 'scenario', txt: t('scenario') },
    // { prop: 'creator_notes', txt: t('creatorNote') }, only edit use
  ])

  const tabsEl = (
    <Tabs
      onSelectionChange={(index: Key) => setCurrentTabIndex(index as number)}
      aria-label="Tabs"
      color="primary"
      variant="underlined"
      className=" "
      classNames={{
        tabList: `bg-transparent w-full relative rounded-none border-b border-[#2C2F35]`,
        tab: 'max-w-fit px-0 h-12 px-3 text-xs font-medium',
        tabContent: cn(
          `group-data-[selected=true]:text-[${fullDetail ? '#5B61FF' : '#5DC66F'}]`,
          'group-data-[selected=true]:text-sm',
          'group-data-[selected=true]:font-semibold'
        ),
        cursor: `w-1/3 h-[3px] rounded-t-[2px] bg-[#5DC66F] ${fullDetail ? 'hidden' : ''}`,
      }}
    >
      {tabs.map(function (tab, index) {
        return <Tab key={index} title={tab.txt} />
      })}
    </Tabs>
  )

  function getContent() {
    const prop = tabs[currentTabIndex].prop
    const data = charaCardInfo?.card.data
    let content = ''
    if (data && isKey(data, prop)) {
      const val = data[prop]
      if (isString(val)) {
        content = val
      } else if (isNumber(val)) {
        content = val.toString()
      } else if (isArray(val)) {
        content = val.join(',')
      }
    }
    return content
  }

  const scrollContainer = useRef<HTMLDivElement>(null)
  function tabsScroll(e: WheelEvent<HTMLDivElement>) {
    e.stopPropagation()

    if (!scrollContainer.current) {
      return
    }
    if (e.deltaY > 0) {
      scrollContainer.current.scrollLeft += 50
    } else {
      scrollContainer.current.scrollLeft -= 50
    }
  }

  return (
    <div
      className={`${classes.tabsArea} w-full h-full box-border flex flex-col justify-center items-center`}
    >
      <div
        ref={scrollContainer}
        onWheel={tabsScroll}
        className={`${classes.tabs} w-full flex flex-row justify-between flex-none overflow-y-auto no-scrollbar`}
      >
        {tabsEl}
      </div>
      <div className={`${classes.content} w-full flex-1 text-ellipsis overflow-hidden`}>
        {getContent()}
      </div>
    </div>
  )
}
