import {
  MouseEvent,
  WheelEvent,
  useEffect,
  useState,
} from 'react'
import classes from './CharacterDetailView.module.scss'
import CharacterInfo from './characterInfo/CharacterInfo'
import TabsArea from './tabsArea/TabsArea'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import BackButton from '@/components/backButton/BackButton'
import { Outlet, useNavigate } from 'react-router-dom'

export default CharacterDetailView

function CharacterDetailView() {
  const navigate = useNavigate()
  const { charaCardInfo } = useCurrentCharacterCardInfo()

  useEffect(function () {
    if (!charaCardInfo) {
      navigate(`/`)
    }
  }, [])

  if (!charaCardInfo) {
    return
  }

  const avatarUrl =
    charaCardInfo.pngUrlOrBase64 ??
    '/imgs/default-avatar3.png'

  const [fullDetail, setFullDetail] = useState(false)

  function backClicked() {
    navigate(-1)
  }

  function editPromptClicked() {
    navigate(`edit`)
  }

  function wheel(e: WheelEvent<HTMLDivElement>) {
    if (e.deltaY > 0) {
      setFullDetail(true)
    } else {
      setFullDetail(false)
    }
  }

  return (
    <div
      onWheel={wheel}
      className={`${classes.characterDetailView} w-full h-full relative`}
    >
      <div
        className={`${classes['life-img']} absolute top-0 w-full bg-center bg-no-repeat bg-cover`}
        style={{
          backgroundImage: `url(${avatarUrl})`,
        }}
      >
        {/* <img src={avatarUrl} className="w-full h-full" /> */}
      </div>

      <div
        className={`${classes['life-detail']} ${
          fullDetail ? classes.full : ''
        } absolute bottom-0 w-full flex flex-col`}
      >
        <div className={`${classes.info} flex-none z-0`}>
          <CharacterInfo
            editPromptClicked={editPromptClicked}
          ></CharacterInfo>
        </div>
        <div
          className={`${classes.tabs} flex-1 z-0 overflow-hidden`}
        >
          <TabsArea></TabsArea>
        </div>
      </div>

      <BackButton onClick={backClicked}></BackButton>

      <Outlet></Outlet>
    </div>
  )
}
