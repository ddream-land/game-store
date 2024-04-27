import classes from './MinimizedOverview.module.scss'
import { useCharacterCardInfoList } from '@/roleAI/context/CharacterCardInfoListContextProvider'
import { useCurrentDigitalLifeId } from '@/roleAI/context/CurrentDigitalLifeIdContextProvider'
import SelectPrompt from './selectPrompt/SelectPrompt'
import CharacterOverview from './characterOverview/CharacterOverview'
import { CharacterCardInfo } from '@/core/CharacterCardInfo'

export interface MinimizedOverviewProps {}

export default function MinimizedOverview({}: MinimizedOverviewProps) {
  const digitalLifeDetailList = useCharacterCardInfoList()
  const currentDigitalLifeId = useCurrentDigitalLifeId()

  const lifeDetail: CharacterCardInfo | undefined =
    digitalLifeDetailList.find(
      (item) => item.id === currentDigitalLifeId
    )

  const content = lifeDetail ? (
    <CharacterOverview
      lifeDetail={lifeDetail}
    ></CharacterOverview>
  ) : (
    <SelectPrompt></SelectPrompt>
  )

  return (
    <div
      className={`${classes.miniOverview} w-full h-full flex flex-row justify-between overflow-hidden`}
    >
      <div
        className={`${classes.content} flex-1 overflow-hidden`}
      >
        {content}
      </div>
      <div className={`${classes.icon} flex-none`}>
        <img src="/imgs/digitalLifeIcon.png" />
      </div>
    </div>
  )
}
