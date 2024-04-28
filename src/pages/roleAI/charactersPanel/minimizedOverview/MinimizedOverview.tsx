import classes from './MinimizedOverview.module.scss'
import SelectPrompt from './selectPrompt/SelectPrompt'
import CharacterOverview from './characterOverview/CharacterOverview'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'

export interface MinimizedOverviewProps {}

export default function MinimizedOverview({}: MinimizedOverviewProps) {
  const currentCharaCardInfo = useCurrentCharacterCardInfo()

  const content = currentCharaCardInfo ? (
    <CharacterOverview
      charaCardInfo={currentCharaCardInfo}
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
