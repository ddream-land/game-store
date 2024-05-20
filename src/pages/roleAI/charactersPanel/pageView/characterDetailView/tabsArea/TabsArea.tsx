import { Key, useRef, useState, WheelEvent } from 'react'
import classes from './TabsArea.module.scss'
import { isArray, isKey, isNumber, isString } from '@/libs/isTypes'
import { useTranslation } from 'react-i18next'
import { Tab, Tabs, Textarea, cn } from '@nextui-org/react'
import { useCurrentCharaCardInfoChecker } from '../../useCurrentCharaCardInfoChecker'

export default TabsArea

function TabsArea() {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()
  const { t } = useTranslation('roleAI')

  charaCardInfo.card.data.scenario

  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [tabs] = useState([
    { prop: 'description', txt: t('description') },
    { prop: 'personality', txt: t('personality') },
    { prop: 'first_mes', txt: t('greetingMsg') },
    { prop: 'mes_example', txt: t('msgExample') },
    { prop: 'scenario', txt: t('scenario') },
    // { prop: 'tags', txt: t('tags') },
    // { prop: 'creator_notes', txt: t('creatorNote') }, only edit use
  ])

  const tabsEl = (
    <Tabs
      onSelectionChange={(index: Key) => setCurrentTabIndex(index as number)}
      aria-label="Tabs"
      radius="full"
      className=""
      classNames={{
        tabList: 'bg-transparent',
        tab: 'h-10 px-3 text-xs font-medium',
        tabContent: cn(
          'group-data-[selected=true]:text-[#000]',
          'group-data-[selected=true]:text-sm',
          'group-data-[selected=true]:font-semibold'
        ),
        cursor: cn(
          'group-data-[selected=true]:border-solid',
          'group-data-[selected=true]:border-black',
          'group-data-[selected=true]:border',
          'group-data-[selected=true]:shadow-none'
        ),
      }}
    >
      {tabs.map(function (tab, index) {
        return <Tab key={index} title={tab.txt} />
      })}
    </Tabs>
  )

  const tabsElement = tabs.map(function (tab, index) {
    return (
      <div
        key={index}
        onClick={() => setCurrentTabIndex(index)}
        className={`${classes.tab} ${
          index === currentTabIndex ? classes.current : ''
        } cursor-pointer flex justify-end items-center`}
      >
        {tab.txt}
      </div>
    )
  })

  function getContent() {
    const prop = tabs[currentTabIndex].prop
    const data = charaCardInfo?.card.data
    let content = '无'
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
      <div className={`${classes.line} flex-none`}></div>
      <div className={`${classes.content} w-full flex-1 text-ellipsis overflow-hidden`}>
        {getContent()}
      </div>
    </div>
  )
}
