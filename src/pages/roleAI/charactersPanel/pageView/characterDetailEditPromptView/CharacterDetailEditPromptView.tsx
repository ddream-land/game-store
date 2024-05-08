import { MouseEvent, WheelEvent, useEffect, useState } from 'react'
import classes from './CharacterDetailEditPromptView.module.scss'
import LifeInfo from './characterInfo/CharacterInfo'
import DetailTabs from './tabsArea/TabsArea'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCurrentCharaCardInfoChecker } from '../useCurrentCharaCardInfoChecker'
import { useNavigateBack } from '@/router/useNavigateBack'

export default CharacterDetailEditView

function CharacterDetailEditView() {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()

  const { t: tCommon } = useTranslation('common')

  const { back } = useNavigateBack()

  const avatarUrl = charaCardInfo.pngUrlOrBase64 ?? '/imgs/default-avatar3.png'

  return (
    <div className={`${classes.characterDetailEditPromptView} w-full h-full relative`}>
      <div
        className={`${classes.charaImg} absolute top-0 w-full bg-center bg-no-repeat bg-cover`}
        style={{
          backgroundImage: `url(${avatarUrl})`,
        }}
      ></div>

      <div className={`${classes.detail}  absolute bottom-0 w-full flex flex-col`}>
        <div className={`${classes.info} flex-none z-0`}>{/* <LifeInfo></LifeInfo> */}</div>
        <div className={`${classes.tabs} flex-1 z-0 overflow-hidden`}>
          {/* <DetailTabs></DetailTabs> */}
        </div>
      </div>

      <BackButton onClick={back}></BackButton>

      <NormalButton className={`${classes.save} absolute`} size={`small`}>
        {tCommon('save')}
      </NormalButton>

      <NormalButton className={`${classes.upload} absolute`} size={`small`}></NormalButton>
    </div>
  )
}
