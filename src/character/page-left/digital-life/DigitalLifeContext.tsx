import { createContext, useContext, useEffect, useState } from 'react'

export type DigitalLifeDetail = {
  /**
   * 唯一id，后端给
   */
  id: number

  /**
   * 名字
   */
  name: string

  /**
   * 头像 / 角色背景图
   */
  avatarUrl?: string

  /**
   * 描述文本
   */
  desc: string

  /**
   * 标签，最多三个
   */
  tags: string[]

  /**
   * 创作者注释
   */
  creatorNote?: string

  /**
   * 个性摘要
   */
  personalitySummary?: string

  /**
   * 角色描述
   */
  rolDesc?: string

  /**
   * 首条消息
   */
  firstMsg?: string
}

const DigitalLifeDetailListContext = createContext<DigitalLifeDetail[]>([])
const SetDigitalLifeDetailListContext = createContext<
  React.Dispatch<React.SetStateAction<DigitalLifeDetail[]>>
>(function () {})

const CurrentDigitalLifeIdContext = createContext<number | undefined>(undefined)
const SetCurrentDigitalLifeIdContext = createContext<
  React.Dispatch<React.SetStateAction<number | undefined>>
>(function () {})

export function DigitalLifeContextProvider({ children }: { children: JSX.Element }) {
  const [digitalLifeDetailList, setDigitalLifeDetailList] = useState<DigitalLifeDetail[]>([])
  const [currentDigitalLifeId, setCurrentDigitalLifeId] = useState<number | undefined>(undefined)

  useEffect(function () {
    setTimeout(() => {
      setDigitalLifeDetailList([
        {
          id: 0,
          name: 'Cyberwife1',
          desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
          creatorNote: `这是一个赛博老婆，你可以和她进进行对话聊天，培养感情，抓住机会，开始聊天吧。
          推荐形象设置，这是一个赛博老婆，你可以和她进进行对话聊天，培养感情，抓住机会，开始聊天吧。
          推荐形象设置，这是一个赛博老婆，你可以和她进进行对话聊天，培养感推荐形象设置，这是一个赛博老婆，你可以和她进进行对话聊天，培养感情，抓住机会，开始聊天吧
          推荐形象设置，情，抓住机会，开始聊天吧
          推荐形象设置，`,
          personalitySummary:
            '个性摘要 个性摘要 个性摘要 个性摘要 个性摘要 个性摘要 个性摘要 个性摘要 个性摘要 个性摘要 个性摘要 个性摘要 个性摘要 个性摘要 个性摘要 ',
          rolDesc:
            '角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 角色描述 ',
          firstMsg: '首条消息 首条消息 首条消息 首条消息 首条消息 首条消息 首条消息 首条消息 ',
          tags: ['Cyberwife', 'Cyber', 'wife'],
        },
        {
          id: 1,
          name: 'Cyberwife2',
          desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
          tags: ['Cyberwife', 'Cyber', 'wife'],
        },
        {
          id: 2,
          name: 'Cyberwife3',
          desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
          tags: ['Cyberwife', 'Cyber', 'wife'],
        },
        {
          id: 3,
          name: 'Cyberwife3',
          desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
          tags: ['Cyberwife', 'Cyber', 'wife'],
        },
        {
          id: 4,
          name: 'Cyberwife5',
          desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
          tags: ['Cyberwife', 'Cyber', 'wife'],
        },
        {
          id: 5,
          name: '55555',
          avatarUrl: '/imgs/default-avatar.png',
          desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
          tags: ['Cyberwife', 'Cyber', 'wife'],
        },
        {
          id: 6,
          name: '66666',
          desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
          tags: ['Cyberwife', 'Cyber', 'wife'],
        },
        {
          id: 7,
          name: '7777',
          avatarUrl: '/imgs/default-avatar2.png',
          desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
          tags: ['Cyberwife', 'Cyber', 'wife'],
        },
        {
          id: 8,
          name: '8888',
          desc: 'Your crazey wife is here ...Your crazey wife is here ...Your crazey wife is h ...',
          tags: ['Cyberwife', 'Cyber', 'wife'],
        },
      ])
    }, 1000)
  }, [])

  return (
    <DigitalLifeDetailListContext.Provider value={digitalLifeDetailList}>
      <SetDigitalLifeDetailListContext.Provider value={setDigitalLifeDetailList}>
        <CurrentDigitalLifeIdContext.Provider value={currentDigitalLifeId}>
          <SetCurrentDigitalLifeIdContext.Provider value={setCurrentDigitalLifeId}>
            {children}
          </SetCurrentDigitalLifeIdContext.Provider>
        </CurrentDigitalLifeIdContext.Provider>
      </SetDigitalLifeDetailListContext.Provider>
    </DigitalLifeDetailListContext.Provider>
  )
}

export function useDigitalLifeDetailList() {
  return useContext(DigitalLifeDetailListContext)
}

export function useSetDigitalLifeDetailList() {
  return useContext(SetDigitalLifeDetailListContext)
}

export function useCurrentDigitalLifeId() {
  return useContext(CurrentDigitalLifeIdContext)
}

export function useSetCurrentDigitalLifeId() {
  return useContext(SetCurrentDigitalLifeIdContext)
}
