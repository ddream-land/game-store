import classes from './MinimizedOverview.module.scss'
import SelectPrompt from './selectPrompt/SelectPrompt'
import { useCurrentChatCharacterInfo } from '@/pages/roleAI/context/CurrentChatCharacterInfoContextProvider'
import CharacterCardAndLevelOverview from '@/components/characterCardAndLevelOverview/CharacterCardAndLevelOverview'

export interface MinimizedOverviewProps {}

export default function MinimizedOverview({}: MinimizedOverviewProps) {
  const { chatCharaInfo } = useCurrentChatCharacterInfo()

  const level = 2
  const levelIconUrl = `/imgs/lv${level.toString().padStart(2, '0')}.png`

  const content = chatCharaInfo ? (
    <CharacterCardAndLevelOverview
      name={chatCharaInfo.card.data.name}
      description={chatCharaInfo.card.data.creator_notes}
      avatarUrl={
        chatCharaInfo?.pngUrlOrBase64
          ? `${chatCharaInfo.pngUrlOrBase64}/w350`
          : `/imgs/default-avatar5.png`
      }
      levelIconUrl={levelIconUrl}
      levelName="Bond lv.6"
      xpCurrent={1000}
      xpTotal={1400}
    ></CharacterCardAndLevelOverview>
  ) : (
    <SelectPrompt></SelectPrompt>
  )

  return <div className={`${classes.miniOverview} w-[400px] h-[165px]`}>{content}</div>
}
