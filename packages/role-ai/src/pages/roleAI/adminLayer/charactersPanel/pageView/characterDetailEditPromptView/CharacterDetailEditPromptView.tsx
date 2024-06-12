import { ChangeEvent, MouseEvent, WheelEvent, useEffect, useRef, useState } from 'react'
import classes from './CharacterDetailEditPromptView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useTranslation } from 'react-i18next'
import { useCurrentAdminCharaInfoChecker } from '../useCurrentAdminCharaInfoChecker'
import { useNavigateBack } from '@/router/useNavigateBack'
import TabsArea, { TabsAreaRef } from './tabsArea/TabsArea'
import toast from 'react-hot-toast'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { isString } from '@/libs/isTypes'
import CharacterInfo from './characterInfo/CharacterInfo'
import { useCurrentAdminCharacterInfo } from '@/pages/roleAI/context/CurrentAdminCharacterInfoContextProvider'

export default CharacterDetailEditView

function CharacterDetailEditView() {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  const { uploadCurrentAdminCharaInfo } = useCurrentAdminCharacterInfo()
  const { t: tCommon } = useTranslation('common')
  const { back } = useNavigateBack()
  const tabsArea = useRef<TabsAreaRef | null>(null)
  const avatarUrl = adminCharaInfo.pngUrlOrBase64
    ? `${adminCharaInfo.pngUrlOrBase64}/w512`
    : '/imgs/default-avatar3.png'
  let avatarFile: File | undefined

  async function onSave() {
    const id = toast.loading(tCommon('loading'))

    const currentCharaCardData = tabsArea.current?.currentCharaCardData
    const newCard: CharacterCardV2 = {
      spec: adminCharaInfo.card.spec,
      spec_version: adminCharaInfo.card.spec_version,
      data: {
        ...adminCharaInfo.card.data,
        ...currentCharaCardData,
      },
    }

    try {
      await uploadCurrentAdminCharaInfo(newCard, avatarFile)
      toast.success(tCommon('opSuccess'), {
        id: id,
      })
    } catch (err: any) {
      const msg = err?.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }
  }

  const pngInputEl = useRef<HTMLInputElement>(null)

  async function pngImport(img: ChangeEvent<HTMLInputElement>) {
    if (!pngInputEl.current || !pngInputEl.current.files) {
      return
    }
    avatarFile = pngInputEl.current.files[0]
    pngInputEl.current.value = ''
  }

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      className={`${classes.characterDetailEditPromptView} w-full h-full relative`}
    >
      <div
        className={`${classes.charaImg} absolute top-0 w-full bg-center bg-no-repeat bg-cover`}
        style={{
          backgroundImage: `url(${avatarUrl})`,
        }}
      ></div>

      <div className={`${classes.detail}  absolute bottom-0 w-full flex flex-col`}>
        <div className={`${classes.info} flex-none z-0`}>
          <CharacterInfo></CharacterInfo>
        </div>
        <div className={`${classes.tabs} flex-1 z-0 overflow-hidden`}>
          <TabsArea ref={tabsArea}></TabsArea>
        </div>
      </div>

      <BackButton onClick={back}></BackButton>

      <NormalButton onClick={onSave} className={`${classes.save} absolute`} size={`small`}>
        {tCommon('save')}
      </NormalButton>

      <NormalButton
        onClick={() => pngInputEl.current?.click()}
        className={`${classes.upload} absolute`}
        size={`small`}
      ></NormalButton>
      <input
        ref={pngInputEl}
        className="hidden"
        type="file"
        onChange={pngImport}
        accept="image/png"
        multiple={false}
      />
    </div>
  )
}
