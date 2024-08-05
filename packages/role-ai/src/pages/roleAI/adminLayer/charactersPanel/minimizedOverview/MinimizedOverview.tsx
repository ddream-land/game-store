import {
  currentAdminCharacterInfoSelector,
  currentChatCharacterInfoSelector,
} from '@/store/slices/characterSlice'
import classes from './MinimizedOverview.module.scss'
import SelectPrompt from './selectPrompt/SelectPrompt'
import CharacterCardAndLevelOverview from '@/components/characterCardAndLevelOverview/CharacterCardAndLevelOverview'
import { useAppSelector } from '@/hooks/useAppSelector'

export interface MinimizedOverviewProps {}

export default function MinimizedOverview({}: MinimizedOverviewProps) {
  const chatCharaInfo = useAppSelector(currentChatCharacterInfoSelector)

  const level = 2
  const levelIconUrl = `/imgs/lv${level.toString().padStart(2, '0')}.png`

  const content = chatCharaInfo ? (
    <CharacterCardAndLevelOverview
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
  ) : (
    <SelectPrompt></SelectPrompt>
  )

  return <div className={`${classes.miniOverview} w-[400px] h-[165px]`}>{content}</div>
}
