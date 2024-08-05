import { ForwardedRef, forwardRef, MouseEvent, useImperativeHandle, useRef, useState } from 'react'
import classes from './CharacterList.module.scss'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/hooks/useAppSelector'
import { Image, Skeleton } from '@nextui-org/react'
import { ReqStatus } from '@/core/ReqStatus'

export type CharacterListProps = Readonly<{
  adminCharacterSelected?: (id: string) => void
  chatCharacterSelected?: (id: string) => void
}>

export type CharacterListRef = {
  scrollTo: (id: string) => void
}

export default forwardRef<CharacterListRef, CharacterListProps>(CharacterList)

function CharacterList(
  { adminCharacterSelected, chatCharacterSelected }: CharacterListProps,
  ref: ForwardedRef<CharacterListRef>
) {
  const { t: tCommon } = useTranslation('common')

  const cardList = useAppSelector((state) => state.character.characterInfoList)
  const requestCardListStatus = useAppSelector(
    (state) => state.character.reqCharacterInfoListStatus
  )
  const currentChatCharacterId = useAppSelector((state) => state.character.currentChatCharacterId)
  const characterContainer = useRef<HTMLDivElement | null>(null)
  const characterItemRefs = useRef<(HTMLDivElement | null)[]>(new Array(cardList.length).fill(null))

  function onCharacterClicked(id: string) {
    adminCharacterSelected && adminCharacterSelected(id)
  }

  function onCharacterChatClicked(e: MouseEvent<HTMLDivElement>, id: string) {
    e.stopPropagation()

    chatCharacterSelected && chatCharacterSelected(id)
  }

  function scrollTo(id: string) {
    const index = cardList.findIndex((x) => x.id === id)
    if (index < 0) {
      return
    }
    const top = characterItemRefs.current[index]?.offsetTop
    if (!top) {
      return
    }
    characterContainer.current?.scrollTo({
      top: top,
      behavior: 'smooth',
    })
  }

  useImperativeHandle(ref, function () {
    return {
      scrollTo,
    }
  })

  const characterElements = cardList.map(function (card, index) {
    const name = card.card.data.name
    const avatarUrl = `${card.pngUrlOrBase64}` ?? '/imgs/default-avatar3.png'
    const desc = card.card.data.description
    const creatorNotes = card.card.data.creator_notes
    const tags = card.card.data.tags
    const id = card.id

    const isChatting = id === currentChatCharacterId

    // max length is 3
    const tagsElements = (tags ?? []).slice(0, 3).map(function (tag, index) {
      return (
        <div key={index} className={`${classes.tag} py-1 flex-1 truncate`}>
          {tag}
        </div>
      )
    })

    return (
      <div
        key={id}
        ref={(el) => (characterItemRefs.current[index] = el)}
        onClick={(e) => onCharacterClicked(id)}
        className={`${classes.item} h-[116px] rounded-[8px] bg-[#1c1e22] mb-3 p-[12px] border-2 border-[#232323] cursor-pointer flex flex-row relative overflow-hidden`}
      >
        <div className={`${classes.nftFlag} hidden absolute w-[60px] h-[22px] top-0 right-0`}></div>

        <div
          className={`${classes.avatar} w-[80px] h-[92px] rounded bg-[rgba(103, 103, 103, 1)] flex-none overflow-hidden`}
        >
          <Image isBlurred src={avatarUrl} className="w-full h-full z-0"></Image>
        </div>
        <div className={`${classes.lifeInfo} flex-1 ml-4 flex flex-col overflow-hidden`}>
          <div className={`${classes.name} h-[20px] flex-none truncate`}>{name}</div>
          <div className={`${classes.desc} h-[28px] flex-1 break-all mt-1 truncate`}>
            {creatorNotes}
          </div>
          <div
            className={`${classes.tagsAndOp} mt-[8px] flex-none flex flex-row justify-center space-between overflow-hidden`}
          >
            <div className="flex-1 flex flex-row justify-end items-center overflow-hidden">
              {tagsElements}
            </div>

            <div
              className={`${classes.chatBtnContainer} h-[26px] w-[92px] flex-none flex justify-end`}
            >
              <div
                onClick={(e) => onCharacterChatClicked(e, id)}
                className={`${
                  classes.chatBtn
                } text-[12px] text-[#fff] text-center font-[600] leading-[12px] h-[26px] ${
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
      <div
        ref={characterContainer}
        className={`${classes.list} h-full overflow-y-auto scrollbar-override`}
      >
        {(requestCardListStatus === ReqStatus.Idel ||
          requestCardListStatus === ReqStatus.Pending) &&
          new Array(3).fill(1).map(function (_, index) {
            return <Skeleton key={index} className="w-full h-[116px] rounded-[8px] mb-3" />
          })}
        {characterElements}
      </div>
    </div>
  )
}
