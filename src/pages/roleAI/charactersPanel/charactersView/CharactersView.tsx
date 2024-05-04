import classes from './CharactersView.module.scss'

import HeaderInfo from './headerInfo/HeaderInfo'
import CharacterList from './characterList/CharacterList'

export type CharactersViewProps = {
  characterSelected?: (id: string) => void
}

export default CharactersView

function CharactersView({
  characterSelected,
}: CharactersViewProps) {
  return (
    <div
      className={`${classes.charactersView} flex flex-col h-full w-full`}
    >
      <div className="flex-none">
        <HeaderInfo></HeaderInfo>
      </div>
      <div className="flex-1 overflow-hidden">
        <CharacterList
          characterSelected={characterSelected}
        ></CharacterList>
      </div>
    </div>
  )
}
