import { MouseEvent, useEffect, useState } from 'react'
import {
  DigitalLifeDetail,
  useCurrentDigitalLifeId,
  useDigitalLifeDetailList,
} from '../DigitalLifeContext'
import classes from './LifeInfo.module.scss'

export default function LifeInfo() {
  const digitalLifeDetailList = useDigitalLifeDetailList()
  const currentDigitalLifeId = useCurrentDigitalLifeId()
  const lifeDetail: DigitalLifeDetail | undefined = digitalLifeDetailList.find(
    (item) => item.id === currentDigitalLifeId
  )
  if (!lifeDetail) {
    throw new Error(`Runtime error.`)
  }
  const { name, desc } = lifeDetail

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
    <div className={`${classes.info} w-full h-full relative`}>
      <div className={`${classes.name}`}>{name}</div>
      <div className={`${classes.desc}`}>{desc}</div>
      <div className={`${classes.op} flex flex-row gap-5`}>
        <div
          className={`${classes.btn} flex-none cursor-pointer flex flex-row justify-center items-center`}
        >
          修改<br></br>背景
        </div>
        <div
          className={`${classes.btn} flex-none cursor-pointer flex flex-row justify-center items-center`}
        >
          更改<br></br>形象
        </div>
        <div
          className={`${classes.btn} flex-none cursor-pointer flex flex-row justify-center items-center`}
        >
          修改<br></br>设定
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
      <div className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}>
        重命名
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}>
        链接到世界书
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}>
        导出下载
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}>
        删除
      </div>
    </div>
  )
}
