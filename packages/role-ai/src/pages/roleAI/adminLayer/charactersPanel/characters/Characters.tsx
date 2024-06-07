import classes from './Characters.module.scss'
import HeaderInfo from './headerInfo/HeaderInfo'
import CharacterList from './characterList/CharacterList'
import SidePanel from './sidePanel/SidePanel'
import { useTranslation } from 'react-i18next'
import CharacterCardAndLevelOverview from '@/components/characterCardAndLevelOverview/CharacterCardAndLevelOverview'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import { Tabs, Tab, cn } from '@nextui-org/react'

export type CharactersProps = Readonly<{
  characterSelected?: (id: string) => void
  className?: string
}>

export default Characters

function Characters({ characterSelected, className }: CharactersProps) {
  const { t: tCommon } = useTranslation('common')
  const { charaCardInfo } = useCurrentCharacterCardInfo()

  const level = 2
  const levelIconUrl = `/imgs/lv${level.toString().padStart(2, '0')}.png`

  return (
    <div className={`${classes.characters} ${className ?? ''} flex flex-row h-full w-full`}>
      <div className="flex-none">
        <SidePanel></SidePanel>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className={`${classes.overview} w-full p-[10px] flex-none`}>
          <CharacterCardAndLevelOverview
            bgColor="rgba(44, 44, 50, 1)"
            name={charaCardInfo?.card.data.name ?? 'Cyperpunk.V'}
            description={charaCardInfo?.card.data.creator_notes ?? ''}
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
        </div>
        <div className={`${classes.tabs} w-full h-[40px] mt-[21px] flex-none bg-gray-500`}>
          {/* <Tabs
            aria-label="Tabs"
            radius="full"
            className=""
            classNames={{
              tabList: 'bg-transparent',
              tab: 'h-10 px-3 text-xs font-medium',
              tabContent: cn(
                'group-data-[selected=true]:text-[#fff]',
                'group-data-[selected=true]:text-sm',
                'group-data-[selected=true]:font-semibold'
              ),
              cursor: cn(
                'group-data-[selected=true]:border-solid',
                'group-data-[selected=true]:border-red',
                'group-data-[selected=true]:border',
                'group-data-[selected=true]:border',
                'group-data-[selected=true]:shadow-none'
              ),
            }}
          >
            <Tab key="all" title="All" />
            <Tab key="nft" title="NFT" />
          </Tabs> */}
        </div>
        <div className={`${classes.list} mt-[18px] flex-1 overflow-hidden`}>
          <CharacterList characterSelected={characterSelected}></CharacterList>
        </div>
      </div>
    </div>
  )
}
