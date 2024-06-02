import classes from './Characters.module.scss'
import HeaderInfo from './headerInfo/HeaderInfo'
import CharacterList from './characterList/CharacterList'

export type CharactersProps = Readonly<{
  characterSelected?: (id: string) => void
  className?: string
}>

export default Characters

function Characters({ characterSelected, className }: CharactersProps) {
  return (
    <div className={`${classes.characters} ${className ?? ''} flex flex-col h-full w-full`}>
      <div className="flex-none">
        <HeaderInfo></HeaderInfo>
      </div>
      <div className="flex-1 overflow-hidden">
        <CharacterList characterSelected={characterSelected}></CharacterList>
      </div>
    </div>
  )
}
