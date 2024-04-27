import classes from './CharacterInfo.module.scss'
import { useCharacterCardInfoList } from '@/roleAI/context/CharacterCardInfoListContextProvider'
import { useCurrentDigitalLifeId } from '@/roleAI/context/CurrentDigitalLifeIdContextProvider'
import { useMenuDialog } from './useMenuDialog'
import MenuDialog from './MenuDialog/MenuDialog'
import { CharacterCardInfo } from '@/core/CharacterCardInfo'

export default CharacterInfo

function CharacterInfo() {
  const digitalLifeDetailList = useCharacterCardInfoList()
  const currentDigitalLifeId = useCurrentDigitalLifeId()
  const lifeDetail: CharacterCardInfo | undefined =
    digitalLifeDetailList.find(
      (item) => item.id === currentDigitalLifeId
    )
  if (!lifeDetail) {
    throw new Error(`Runtime error.`)
  }

  const name = lifeDetail.card.data.name
  const desc = lifeDetail.card.data.description

  const { menuDialogOpened, openMenuDialog } =
    useMenuDialog()

  return (
    <div
      className={`${classes.characterInfo} w-full h-full relative`}
    >
      <div className={`${classes.name} truncate max-w-72`}>
        {name}
      </div>
      <div
        className={`${classes.desc} text-ellipsis overflow-hidden`}
      >
        {desc}
      </div>
      <div className={`${classes.op} flex flex-row gap-5`}>
        <div
          className={`${classes.btn} flex-none cursor-pointer flex flex-row justify-center items-center`}
        >
          Edit<br></br>Cover
        </div>
        <div
          className={`${classes.btn} flex-none cursor-pointer flex flex-row justify-center items-center`}
        >
          Edit<br></br>Avatar
        </div>
        <div
          className={`${classes.btn} flex-none cursor-pointer flex flex-row justify-center items-center`}
        >
          Edit<br></br>Prompt
        </div>
      </div>

      <div
        onClick={openMenuDialog}
        className={`${classes['menu-btn']} absolute cursor-pointer`}
      ></div>

      {menuDialogOpened && <MenuDialog></MenuDialog>}
    </div>
  )
}
