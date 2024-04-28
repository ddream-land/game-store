import classes from './CharacterInfo.module.scss'
import { useMenuDialog } from './useMenuDialog'
import MenuDialog from './MenuDialog/MenuDialog'
import { useCurrentCharacterCardInfo } from '@/roleAI/context/CurrentCharacterCardInfoContextProvider'

export default CharacterInfo

function CharacterInfo() {
  const currentCharaCardInfo = useCurrentCharacterCardInfo()
  if (!currentCharaCardInfo) {
    throw new Error(`Runtime error.`)
  }

  const name = currentCharaCardInfo.card.data.name
  const desc = currentCharaCardInfo.card.data.description

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
