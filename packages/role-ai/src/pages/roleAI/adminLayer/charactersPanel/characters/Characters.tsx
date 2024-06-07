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
      <div className="flex-1 overflow-hidden">
        <div className={`${classes.overview} w-full p-[10px]`}>
          <CharacterCardAndLevelOverview
            bgColor="rgba(44, 44, 50, 1)"
            name="Cyperpunk.V"
            description="The quick brown fox jumps over the ..."
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
        <div className={`${classes.tabs} w-full h-[40px]`}>
          <Tabs
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
          </Tabs>
        </div>
        <CharacterList characterSelected={characterSelected}></CharacterList>
      </div>
    </div>
  )
}
// return (
//   <div className={`${classes.characters} ${className ?? ''} flex flex-col h-full w-full`}>
//     <div className="flex-none">
//       <HeaderInfo></HeaderInfo>
//     </div>
//     <div className="flex-1 overflow-hidden">
//       <CharacterList characterSelected={characterSelected}></CharacterList>
//     </div>
//   </div>
// )
// }
