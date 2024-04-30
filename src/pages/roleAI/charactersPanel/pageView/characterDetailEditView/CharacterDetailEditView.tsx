import {
  MouseEvent,
  WheelEvent,
  useEffect,
  useState,
} from 'react'
import classes from './CharacterDetailEditView.module.scss'
import LifeInfo from './characterInfo/CharacterInfo'
import DetailTabs from './tabsArea/TabsArea'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default CharacterDetailEditView

function CharacterDetailEditView() {
  const navigate = useNavigate()
  const { charaCardInfo } = useCurrentCharacterCardInfo()

  useEffect(function () {
    if (!charaCardInfo) {
      navigate(`/`)
    }
  }, [])

  const { t: tCommon } = useTranslation('common')

  if (!charaCardInfo) {
    return
  }

  function backClicked() {
    navigate(-1)
  }

  const avatarUrl =
    charaCardInfo.pngUrlOrBase64 ??
    '/imgs/default-avatar3.png'

  return (
    <div
      className={`${classes.characterDetailEditView} w-full h-full relative`}
    >
      <div
        className={`${classes.charaImg} absolute top-0 w-full bg-center bg-no-repeat bg-cover`}
        style={{
          backgroundImage: `url(${avatarUrl})`,
        }}
      ></div>

      <div
        className={`${classes.detail}  absolute bottom-0 w-full flex flex-col`}
      >
        <div className={`${classes.info} flex-none z-0`}>
          {/* <LifeInfo></LifeInfo> */}
        </div>
        <div
          className={`${classes.tabs} flex-1 z-0 overflow-hidden`}
        >
          {/* <DetailTabs></DetailTabs> */}
        </div>
      </div>

      <BackButton onClick={backClicked}></BackButton>

      <NormalButton
        className={`${classes.save} absolute`}
        size={`small`}
      >
        {tCommon('save')}
      </NormalButton>

      <NormalButton
        className={`${classes.upload} absolute`}
        size={`small`}
      ></NormalButton>
    </div>
  )
}
