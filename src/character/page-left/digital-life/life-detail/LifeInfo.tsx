import { MouseEvent, useEffect, useState } from 'react'
import classes from './LifeInfo.module.scss'
import {
  CharacterCardDetail,
  useDigitalLifeDetailList,
} from '@/character/context/DigitalLifeDetailListContextProvider'
import { useCurrentDigitalLifeId } from '@/character/context/CurrentDigitalLifeIdContextProvider'

export default function LifeInfo() {
  const digitalLifeDetailList = useDigitalLifeDetailList()
  const currentDigitalLifeId = useCurrentDigitalLifeId()
  const lifeDetail: CharacterCardDetail | undefined =
    digitalLifeDetailList.find(
      (item) => item.id === currentDigitalLifeId
    )
  if (!lifeDetail) {
    throw new Error(`Runtime error.`)
  }

  const name = lifeDetail.card.data.name
  const desc = lifeDetail.card.data.description

  const [menuOpen, setMenuOpen] = useState(false)

  function menuBtnClicked(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setMenuOpen(true)
  }

  function globalCloseMenu() {
    setMenuOpen(false)
  }

  useEffect(function () {
    document.addEventListener('click', globalCloseMenu)

    return function () {
      document.removeEventListener('click', globalCloseMenu)
    }
  }, [])

  return (
    <div
      className={`${classes.info} w-full h-full relative`}
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
        onClick={menuBtnClicked}
        className={`${classes['menu-btn']} absolute cursor-pointer`}
      ></div>

      {menuOpen && <Menu></Menu>}
    </div>
  )
}

function Menu() {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
      className={`${classes.menu} absolute top-0 flex flex-col items-center`}
    >
      <div
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        Re-name
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        Link to World Book
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        Export
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        Delete
      </div>
    </div>
  )
}
