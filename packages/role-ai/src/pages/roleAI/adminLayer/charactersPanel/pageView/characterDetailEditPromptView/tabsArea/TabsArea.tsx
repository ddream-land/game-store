import {
  ForwardedRef,
  Key,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  WheelEvent,
  ReactNode,
  Fragment,
} from 'react'
import classes from './TabsArea.module.scss'
import { isArray, isKey, isNumber, isString } from '@/libs/isTypes'
import { useTranslation } from 'react-i18next'
import { useCurrentAdminCharaInfoChecker } from '../../useCurrentAdminCharaInfoChecker'
import { Button, Chip, Input, Tab, Tabs, Textarea, cn } from '@nextui-org/react'
import { cloneDeep } from 'lodash'
import { CharacteCardV2Data } from '@/core/characterCard/characterCardV2'

type TagChipInputProps = Readonly<{
  value: string
  onValueChange: ((value: string) => void) | undefined
}>

function TagChipInput({ value, onValueChange }: TagChipInputProps) {
  return (
    <Input
      value={value}
      onValueChange={onValueChange}
      className="text-[#5DC66F]"
      classNames={{
        input: cn(
          'bg-transparent',
          'text-[#5DC66F]',
          'data-[focus=true]:bg-transparent',
          'group-data-[focus=true]:bg-transparent',
          'data-[hover=true]:bg-transparent',
          'group-data-[hover=true]:bg-transparent',
          'data-[has-value=true]:text-[#5DC66F]',
          'group-data-[has-value=true]:text-[#5DC66F]'
        ),
        innerWrapper: cn(
          'bg-transparent',
          'data-[focus=true]:bg-transparent',
          'group-data-[focus=true]:bg-transparent',
          'data-[hover=true]:bg-transparent',
          'group-data-[hover=true]:bg-transparent'
        ),
        inputWrapper: cn(
          'bg-transparent px-0',
          'data-[focus=true]:bg-transparent',
          'group-data-[focus=true]:bg-transparent',
          'data-[hover=true]:bg-transparent',
          'group-data-[hover=true]:bg-transparent'
        ),
      }}
    />
  )
}

export type TabsAreaProps = Readonly<{}>

export type TabsAreaRef = {
  currentCharaCardData: CharacteCardV2Data<any>
}

export default forwardRef<TabsAreaRef, TabsAreaProps>(TabsArea)

function TabsArea(props: TabsAreaProps, ref: ForwardedRef<TabsAreaRef>) {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  if (!adminCharaInfo) {
    return
  }
  const [currentCharaCardData, setCurrentCharaCardData] = useState(
    cloneDeep(adminCharaInfo.card.data)
  )

  useImperativeHandle(ref, function () {
    return {
      currentCharaCardData,
    }
  })

  const { t } = useTranslation('roleAI')

  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [tabs] = useState([
    { prop: 'description', txt: t('description') },
    { prop: 'personality', txt: t('personality') },
    { prop: 'first_mes', txt: t('greetingMsg') },
    { prop: 'mes_example', txt: t('msgExample') },
    { prop: 'scenario', txt: t('scenario') },
    { prop: 'creator_notes', txt: t('creatorNote') }, // only edit use
    { prop: 'tags', txt: t('tags') },
  ])

  const tabsEl = (
    <Tabs
      onSelectionChange={(index: Key) => setCurrentTabIndex(index as number)}
      aria-label="Tabs"
      color="primary"
      variant="underlined"
      className=""
      classNames={{
        tabList: 'bg-transparent w-full relative rounded-none border-b border-[#2C2F35]',
        tab: 'max-w-fit px-0 h-12 px-3 text-xs font-medium',
        tabContent: cn(
          'group-data-[selected=true]:text-[#5DC66F]',
          'group-data-[selected=true]:text-sm',
          'group-data-[selected=true]:font-semibold'
        ),
        cursor: `w-1/3 h-[3px] rounded-t-[2px] bg-[#5DC66F]`,
      }}
    >
      {tabs.map(function (tab, index) {
        return <Tab key={index} title={tab.txt} />
      })}
    </Tabs>
  )

  function contentNode() {
    const prop = tabs[currentTabIndex].prop
    let content: ReactNode = ''
    if (currentCharaCardData && isKey(currentCharaCardData, prop)) {
      const val = currentCharaCardData[prop]
      if (isString(val)) {
        content = (
          <Textarea
            value={val}
            onValueChange={onTextContenetChange}
            disableAutosize={true}
            className={`${classes.textarea} h-full w-full bg-[#121315] text-[#a4a5a7]`}
            classNames={{
              inputWrapper: 'p-0 bg-[#121315]',
              innerWrapper: 'bg-[#121315]',
              input:
                'h-full scrollbar-override bg-[#121315] border-2 border-[#a4a5a7] p-[12px] rounded-[12px]',
            }}
          />
        )
      } else if (isNumber(val)) {
        content = (
          <Textarea
            value={val.toString()}
            onValueChange={onTextContenetChange}
            disableAutosize={true}
            className={`${classes.textarea} h-full w-full bg-[#121315] text-[#a4a5a7]`}
            classNames={{
              inputWrapper: 'p-0 bg-[#121315]',
              innerWrapper: 'bg-[#121315]',
              input:
                'scrollbar-override bg-[#121315] border-2 border-[#a4a5a7] p-[12px] rounded-[12px]',
            }}
          />
        )
      } else if (isArray(val)) {
        content = (
          <div className="w-full h-full flex flex-row flex-wrap gap-3 justify-start items-start content-start">
            {val.map(function (item, index) {
              return (
                <Chip
                  key={index}
                  onClose={() => {
                    onTagItemRemove(index)
                  }}
                  className="w-full max-w-none text-[#5DC66F]"
                  variant="flat"
                >
                  <TagChipInput
                    value={item}
                    onValueChange={(val: string) => onTagItemContentChange(index, val)}
                  ></TagChipInput>
                </Chip>
              )
            })}
            <Button onClick={onAddTagClicked} size="sm" color="default" radius="full">
              +
            </Button>
          </div>
        )
      }
    }

    return content
  }

  function onAddTagClicked() {
    const currTags = currentCharaCardData.tags
    currTags.push(t('newTagTxt'))
    setCurrentCharaCardData({
      ...currentCharaCardData,
      tags: [...currTags],
    })
  }

  function onTagItemContentChange(index: number, text: string) {
    const currTags = currentCharaCardData.tags
    currTags[index] = text
    setCurrentCharaCardData({
      ...currentCharaCardData,
      tags: [...currTags],
    })
  }

  function onTagItemRemove(index: number) {
    const currTags = currentCharaCardData.tags
    currTags.splice(index, 1)

    setCurrentCharaCardData({
      ...currentCharaCardData,
      tags: [...currTags],
    })
  }

  function onTextContenetChange(val: string) {
    const prop = tabs[currentTabIndex].prop
    if (currentCharaCardData && isKey(currentCharaCardData, prop)) {
      const raw = currentCharaCardData[prop]
      let content: string | number = val
      if (isString(raw)) {
        content = val
      } else if (isNumber(raw)) {
        content = Number(val)
      }
      setCurrentCharaCardData({
        ...currentCharaCardData,
        [prop]: content,
      })
    }
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
        {contentNode()}
      </div>
    </div>
  )
}
