import { useCharacterCardInfoList } from '@/pages/roleAI/context/CharacterCardInfoListContextProvider'
import classes from './CharacterList.module.scss'
import { useTranslation } from 'react-i18next'

export type CharacterListProps = Readonly<{
  characterSelected?: (id: string) => void
  characterChat?: (id: string) => void
}>

export default CharacterList

function CharacterList({ characterSelected, characterChat }: CharacterListProps) {
  const { t: tCommon } = useTranslation('common')

  const cardList = useCharacterCardInfoList()

  function onItemClicked(id: string) {
    characterSelected && characterSelected(id)
  }

  function onChatClicked(id: string) {
    characterChat && characterChat(id)
  }

  const lifeElementItems = cardList.map(function (card) {
    const name = card.card.data.name
    const avatarUrl = `${card.pngUrlOrBase64}/w350` ?? '/imgs/default-avatar3.png'
    const desc = card.card.data.description
    const creatorNotes = card.card.data.creator_notes
    const tags = card.card.data.tags
    const id = card.id

    const isChatting = true

    // max length is 3
    const tagsElements = (tags ?? []).slice(0, 3).map(function (tag, index) {
      return (
        <div key={index} className={`${classes.tag} flex-1 truncate`}>
          {tag}
        </div>
      )
    })

    return (
      <div
        key={id}
        onClick={(e) => onItemClicked(id)}
        className={`${classes.item} cursor-pointer mb-3 flex flex-row`}
      >
        <div
          className={`${classes.avatar} w-[80px] h-[92px] rounded bg-[rgba(103, 103, 103, 1)] flex-none overflow-hidden`}
        >
          <img src={avatarUrl} className="w-full h-full" />
        </div>
        <div className={`${classes['life-info']} flex-1 ml-4 flex flex-col`}>
          <div className={`${classes.name} h-[20px] flex-none`}>{name}</div>
          <div className={`${classes.desc} h-[28px] flex-none break-all mt-1 overflow-hidden`}>
            {creatorNotes}
          </div>
          <div
            className={`${classes.tagsAndOp} mt-[13px] flex-none flex flex-row justify-center space-between`}
          >
            <div className="flex-1 mr-6 flex flex-row justify-end items-center">{tagsElements}</div>

            <div
              className={`${classes.chatBtnContainer} h-[26px] w-[92px] flex-none flex justify-end`}
            >
              <div
                className={`${classes.chatBtn} h-[26px] ${
                  isChatting ? 'w-[92px] bg-[#5DC66F]' : 'w-[74px] bg-[#2E6EE6]'
                } rounded-[13px] flex flex-row justify-center items-center`}
              >
                {isChatting ? (
                  <>
                    <span
                      className={`${classes.chattingIcon} w-[15px] h-[15px] bg-no-repeat bg-contain`}
                    ></span>{' '}
                    <span className="ml-1">{tCommon('chatting')}</span>
                  </>
                ) : (
                  <span>{tCommon('chat')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  })

  return (
    <div className={`${classes.characterList} h-full w-full pl-[10px]`}>
      <div className={`${classes.sum} flex-none hidden`}>共拥有103个数字生命</div>
      <div className={`${classes.list} h-full overflow-y-auto overflow-x-auto scrollbar-override`}>
        {lifeElementItems}
      </div>
    </div>
  )
}
