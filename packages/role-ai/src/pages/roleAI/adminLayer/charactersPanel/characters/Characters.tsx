import classes from './Characters.module.scss'
import CharacterList, { CharacterListRef } from './characterList/CharacterList'
import SidePanel from './sidePanel/SidePanel'
import { useTranslation } from 'react-i18next'
import CharacterCardAndLevelOverview from '@/components/characterCardAndLevelOverview/CharacterCardAndLevelOverview'
import { Tabs, Tab, cn } from '@nextui-org/react'
import { DataSource } from '@/core/DataSource'
import { Key, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  currentChatCharacterInfoSelector,
  refreshCharacterList,
  setCurrentChatCharacterId,
} from '@/store/slices/characterSlice'
import store from '@/store'
import { useAppDispatch } from '@/hooks/useAppDispatch'

export type CharactersProps = Readonly<{
  adminCharacterSelected?: (id: string) => void
  chatCharacterSelected?: (id: string) => void
  className?: string
}>

export default Characters

function Characters({ adminCharacterSelected, chatCharacterSelected, className }: CharactersProps) {
  const { t } = useTranslation('roleAI')
  const chatCharaInfo = useAppSelector(currentChatCharacterInfoSelector)
  const dispatch = useAppDispatch()
  const characterListRef = useRef<CharacterListRef | null>(null)
  const [currentDatasouceKey, setCurrentDatasouceKey] = useState<string>(DataSource.All)

  function onCharactersDataSourceChanged(key: Key) {
    setCurrentDatasouceKey(key as string)

    if (key === DataSource.NFT) {
      const id = toast.loading(t('comingSoon'))
      setTimeout(() => {
        toast.dismiss(id)
        setCurrentDatasouceKey(DataSource.All)
      }, 1500)
      return
    }
  }

  function onAddedCharacter(id: string) {
    if (!id) {
      return
    }

    ;(async function () {
      await dispatch(refreshCharacterList())
      const characters = store.getState().character.characterInfoList
      if (characters.find((x) => x.id === id)) {
        dispatch(setCurrentChatCharacterId(id))
        // characterListRef.current?.scrollTo(id)
      }
    })()
  }

  const level = 2
  const levelIconUrl = `/imgs/lv${level.toString().padStart(2, '0')}.png`

  return (
    <div className={`${classes.characters} ${className ?? ''} flex flex-row h-full w-full`}>
      <div className="flex-none">
        <SidePanel onAddedCharacter={onAddedCharacter}></SidePanel>
      </div>
      <div className={`${classes.mainRight} flex-1 overflow-hidden flex flex-col`}>
        <div className={`${classes.overview} w-full p-[10px] flex-none`}>
          {chatCharaInfo && (
            <CharacterCardAndLevelOverview
              bgColor="rgba(44, 44, 50, 1)"
              name={chatCharaInfo.card.data.name}
              description={chatCharaInfo.card.data.creator_notes}
              avatarUrl={
                chatCharaInfo?.pngUrlOrBase64
                  ? `${chatCharaInfo.pngUrlOrBase64}`
                  : `/imgs/default-avatar5.png`
              }
              levelIconUrl={levelIconUrl}
              levelName="Bond lv.6"
              xpCurrent={1000}
              xpTotal={1400}
            ></CharacterCardAndLevelOverview>
          )}
        </div>
        <div
          className={`${classes.tabs} w-full h-[40px] ${
            chatCharaInfo ? 'mt-[21px]' : ''
          } flex-none px-[10px] py-[2px]`}
        >
          <Tabs
            onSelectionChange={onCharactersDataSourceChanged}
            selectedKey={currentDatasouceKey}
            aria-label="Character datasource"
            size="sm"
            radius="full"
            className=""
            classNames={{
              base: 'w-full',
              tabList: 'bg-[#000] w-full',
              tab: cn(''),
              cursor: cn('group-data-[selected=true]:bg-[#2F3137]'),
              tabContent: cn(
                'group-data-[selected=true]:text-[#fff]',
                'group-data-[selected=true]:text-sm'
              ),
            }}
          >
            <Tab key={DataSource.All} title={t('all')} />
            <Tab key={DataSource.NFT} title={t('nft')} />
          </Tabs>
        </div>
        <div className={`${classes.list} mt-[18px] flex-1 overflow-hidden`}>
          <CharacterList
            ref={characterListRef}
            adminCharacterSelected={adminCharacterSelected}
            chatCharacterSelected={chatCharacterSelected}
          ></CharacterList>
        </div>
      </div>
    </div>
  )
}
