import classes from './MinimizedOverview.module.scss'
import SelectPrompt from './selectPrompt/SelectPrompt'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import CharacterCardAndLevelOverview from '@/components/characterCardAndLevelOverview/CharacterCardAndLevelOverview'

export interface MinimizedOverviewProps {}

export default function MinimizedOverview({}: MinimizedOverviewProps) {
  const { charaCardInfo } = useCurrentCharacterCardInfo()

  const content = charaCardInfo ? (
    <CharacterCardAndLevelOverview
      name="Cyperpunk.V"
      description="The quick brown fox jumps over the ..."
      avatarUrl={
        charaCardInfo.pngUrlOrBase64
          ? `${charaCardInfo.pngUrlOrBase64}/w350`
          : `/imgs/default-avatar5.png`
      }
      levelIconUrl="/imgs/level-icon.png"
      levelName="Bond lv.6"
      xpCurrent={1000}
      xpTotal={1400}
    ></CharacterCardAndLevelOverview>
  ) : (
    <SelectPrompt></SelectPrompt>
  )

  return (
    <div className={`${classes.miniOverview} w-[400px] h-[165px] overflow-hidden`}>{content}</div>
  )
}
