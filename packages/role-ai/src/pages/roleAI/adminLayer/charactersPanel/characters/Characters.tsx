import classes from './Characters.module.scss'
import HeaderInfo from './headerInfo/HeaderInfo'
import CharacterList from './characterList/CharacterList'
import SidePanel from './sidePanel/SidePanel'
import { useTranslation } from 'react-i18next'

export type CharactersProps = Readonly<{
  characterSelected?: (id: string) => void
  className?: string
}>

export default Characters

function Characters({ characterSelected, className }: CharactersProps) {
  const { t: tCommon } = useTranslation('common')
  
  return (
    <div className={`${classes.characters} ${className ?? ''} flex flex-row h-full w-full`}>
      <div className="flex-none">
        <SidePanel></SidePanel>
      </div>
      <div className="flex-1 overflow-hidden">
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
