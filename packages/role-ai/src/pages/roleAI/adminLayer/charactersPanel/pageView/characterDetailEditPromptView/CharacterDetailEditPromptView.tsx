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
import { useCurrentAdminCharacterInfo } from '@/pages/roleAI/context/CurrentAdminCharacterInfoContextProvider'

export default CharacterDetailEditView

function CharacterDetailEditView() {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  const { uploadCurrentAdminCharaInfo } = useCurrentAdminCharacterInfo()
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')
  const { back } = useNavigateBack()
  const tabsArea = useRef<TabsAreaRef | null>(null)

  async function onSave() {
    const id = toast.loading(tCommon('loading'))

    const currentCharaCardData = tabsArea.current?.currentCharaCardData
    const newAdminCard: CharacterCardV2 = {
      spec: adminCharaInfo.card.spec,
      spec_version: adminCharaInfo.card.spec_version,
      data: {
        ...adminCharaInfo.card.data,
        ...currentCharaCardData,
      },
    }

    try {
      await uploadCurrentAdminCharaInfo(newAdminCard)
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

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      className={`${classes.characterDetailEditPromptView} w-full h-full relative bg-[#121315] rounded-[12px]`}
    >
      <BackButton onClick={back}></BackButton>

      <div className="absolute text-[#fff] h-[34px] top-[24px] left-1/2 -translate-x-1/2">
        {tCommon('edit')} &nbsp;
        {t('prompt')}
      </div>

      <NormalButton
        onClick={onSave}
        className={`${classes.save} absolute w-[78px] h-[34px] top-[20px] right-[20px] rounded-[8px] bg-[#2E6EE6]`}
      >
        {tCommon('save')}
      </NormalButton>

      <div className={`${classes.tabs} w-full h-full z-0 overflow-hidden pt-[75px]`}>
        <TabsArea ref={tabsArea}></TabsArea>
      </div>
    </div>
  )
}
