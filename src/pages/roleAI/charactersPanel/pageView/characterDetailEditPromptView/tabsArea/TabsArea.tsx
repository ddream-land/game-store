import { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import classes from './TabsArea.module.scss'
import { isArray, isKey, isNumber, isString } from '@/libs/isTypes'
import { useTranslation } from 'react-i18next'
import { useCurrentCharaCardInfoChecker } from '../../useCurrentCharaCardInfoChecker'
import { Textarea } from '@nextui-org/react'
import { cloneDeep } from 'lodash'
import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { CharacteCardV2Data } from '@/core/characterCard/characterCardV2'

export type TabsAreaProps = Readonly<{}>

export type TabsAreaRef = {
  currentCharaCardData: CharacteCardV2Data<any>
}

export default forwardRef<TabsAreaRef, TabsAreaProps>(TabsArea)

function TabsArea(props: TabsAreaProps, ref: ForwardedRef<TabsAreaRef>) {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()
  const [currentCharaCardData, setCurrentCharaCardData] = useState(
    cloneDeep(charaCardInfo.card.data)
  )

  useImperativeHandle(ref, function () {
    return {
      currentCharaCardData,
    }
  })

  const { t } = useTranslation('roleAI')

  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [tabs] = useState([
    { prop: 'creator_notes', txt: t('creatorNote') },
    { prop: 'personality', txt: t('personality') },
    { prop: 'description', txt: t('basicInfo') },
    { prop: 'first_mes', txt: t('greetingMsg') },
    { prop: 'tags', txt: t('tags') },
  ])

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
    let content = ''
    if (currentCharaCardData && isKey(currentCharaCardData, prop)) {
      const val = currentCharaCardData[prop]
      if (isString(val)) {
        content = val
      } else if (isNumber(val)) {
        content = val.toString()
      } else if (isArray(val)) {
        content = val.join(' ')
      }
    }
    return content
  }

  function onContentChange(val: string) {
    const prop = tabs[currentTabIndex].prop
    if (currentCharaCardData && isKey(currentCharaCardData, prop)) {
      const raw = currentCharaCardData[prop]
      let content: string | number | string[] = val
      if (isString(raw)) {
        content = val
      } else if (isNumber(raw)) {
        content = Number(val)
      } else if (isArray(raw)) {
        content = val.split(' ')
      }
      setCurrentCharaCardData({
        ...currentCharaCardData,
        [prop]: content,
      })
    }
  }

  return (
    <div
      className={`${classes.tabsArea} w-full h-full box-border flex flex-col justify-center items-center`}
    >
      <div className={`${classes.tabs} w-full flex flex-row justify-between flex-none`}>
        {tabsElement}
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div className={`${classes.content} w-full flex-1 text-ellipsis overflow-hidden`}>
        <Textarea
          value={getContent()}
          onValueChange={onContentChange}
          disableAutosize={true}
          className={`${classes.textarea} h-full w-full`}
          classNames={{
            input: 'scrollbar-override',
          }}
        />
      </div>
    </div>
  )
}
