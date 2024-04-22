import { DigitalLifeDetail } from '@/libs/DigitalLifeDetail'
import { createContext, useContext, useEffect, useState } from 'react'

const DigitalLifeDetailListContext = createContext<DigitalLifeDetail[]>([])
const SetDigitalLifeDetailListContext = createContext<
  React.Dispatch<React.SetStateAction<DigitalLifeDetail[]>>
>(function () {})

export function DigitalLifeDetailListContextProvider({ children }: { children: JSX.Element }) {
  const [digitalLifeDetailList, setDigitalLifeDetailList] = useState<DigitalLifeDetail[]>([])

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
    }, 800)
  }, [])

  return (
    <DigitalLifeDetailListContext.Provider value={digitalLifeDetailList}>
      <SetDigitalLifeDetailListContext.Provider value={setDigitalLifeDetailList}>
        {children}
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
