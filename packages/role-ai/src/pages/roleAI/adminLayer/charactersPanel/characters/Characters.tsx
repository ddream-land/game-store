import classes from './Characters.module.scss'
import CharacterList from './characterList/CharacterList'
import SidePanel from './sidePanel/SidePanel'
import { useTranslation } from 'react-i18next'
import CharacterCardAndLevelOverview from '@/components/characterCardAndLevelOverview/CharacterCardAndLevelOverview'
import { useCurrentChatCharacterInfo } from '@/pages/roleAI/context/CurrentChatCharacterInfoContextProvider'
import { Tabs, Tab, cn } from '@nextui-org/react'
import { DataSource } from '@/core/DataSource'

export type CharactersProps = Readonly<{
  adminCharacterSelected?: (id: string) => void
  chatCharacterSelected?: (id: string) => void
  className?: string
}>

export default Characters

function Characters({ adminCharacterSelected, chatCharacterSelected, className }: CharactersProps) {
  const { t: tCommon } = useTranslation('common')
  const { charaCardInfo } = useCurrentChatCharacterInfo()

  const level = 2
  const levelIconUrl = `/imgs/lv${level.toString().padStart(2, '0')}.png`

  return (
    <div className={`${classes.characters} ${className ?? ''} flex flex-row h-full w-full`}>
      <div className="flex-none">
        <SidePanel></SidePanel>
      </div>
      <div className={`${classes.mainRight} flex-1 overflow-hidden flex flex-col`}>
        <div className={`${classes.overview} w-full p-[10px] flex-none`}>
          {charaCardInfo && (
            <CharacterCardAndLevelOverview
              bgColor="rgba(44, 44, 50, 1)"
              name={charaCardInfo.card.data.name}
              description={charaCardInfo.card.data.creator_notes}
              avatarUrl={
                charaCardInfo?.pngUrlOrBase64
                  ? `${charaCardInfo.pngUrlOrBase64}/w350`
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
            charaCardInfo ? 'mt-[21px]' : ''
          } flex-none px-[10px] py-[2px]`}
        >
          <Tabs
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
            <Tab key={DataSource.All} title={'All'} />
            <Tab key={DataSource.NFT} title={'NFT'} />
          </Tabs>
        </div>
        <div className={`${classes.list} mt-[18px] flex-1 overflow-hidden`}>
          <CharacterList
            adminCharacterSelected={adminCharacterSelected}
            chatCharacterSelected={chatCharacterSelected}
          ></CharacterList>
        </div>
      </div>
    </div>
  )
}
