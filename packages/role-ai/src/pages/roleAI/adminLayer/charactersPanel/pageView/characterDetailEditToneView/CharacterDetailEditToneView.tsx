import classes from './CharacterDetailEditToneView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useTranslation } from 'react-i18next'
import { useCurrentAdminCharaInfoChecker } from '../useCurrentAdminCharaInfoChecker'
import { useNavigateBack } from '@/router/useNavigateBack'
import { useCurrentAdminCharacterInfo } from '@/pages/roleAI/context/CurrentAdminCharacterInfoContextProvider'
import { DDLSplitLine } from '@ddreamland/common'
import { Checkbox, Switch, cn } from '@nextui-org/react'
import toast from 'react-hot-toast'
import {
  NuwaExtensionVersion,
  NuwaVoiceExtension,
  NuwaVoicesExtensionListItem,
} from '@/core/characterCard/NuwaCharacterCardExtensions'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { isString } from '@/libs/isTypes'
import { useEffect, useRef, useState } from 'react'
import CreatorChoice, { CreatorChoiceRef } from './creatorChoice/CreatorChoice'

export default CharacterDetailEditToneView

function CharacterDetailEditToneView() {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  const { uploadCurrentAdminCharaInfo } = useCurrentAdminCharacterInfo()
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')
  const { back } = useNavigateBack()
  const [editMode, setEditMode] = useState(false)
  const creatorChoiceRef = useRef<CreatorChoiceRef | null>(null)

  const [autoplay, setAutoplay] = useState(
    adminCharaInfo.card.data.extensions.nuwa_voice?.autoPlay ?? false
  )

  const [currentSelect, setCurrentSelect] = useState<Partial<NuwaVoicesExtensionListItem>>({
    type: undefined,
    sex: undefined,
    name: undefined,
    language: undefined,
  })

  async function onSelectClicked(item: NuwaVoicesExtensionListItem) {
    setCurrentSelect({
      type: item.type,
      sex: item.sex,
      name: item.name,
      language: item.language,
    })
  }

  async function onAutoPlayChange(isSelected: boolean) {
    setAutoplay(isSelected)
  }

  async function onSave() {
    return

    const id = toast.loading(tCommon('loading'))

    try {
      const nuwaVoiceExtension: NuwaVoiceExtension = {
        nuwa_voice: {
          ...(adminCharaInfo.card.data.extensions.nuwa_voice ?? {
            version: NuwaExtensionVersion.V1,
            type: '',
            sex: '',
            name: '',
            language: '',
          }),
          autoPlay: autoplay,
        },
      }
      const newCard: CharacterCardV2 = {
        spec: adminCharaInfo.card.spec,
        spec_version: adminCharaInfo.card.spec_version,
        data: {
          ...adminCharaInfo.card.data,
          extensions: {
            ...adminCharaInfo.card.data.extensions,
            ...nuwaVoiceExtension,
          },
        },
      }

      await uploadCurrentAdminCharaInfo(newCard)
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
      className={`${classes.characterDetailEditToneView} w-full h-full relative pointer-events-auto flex flex-col bg-[#121315] rounded-[12px]`}
    >
      <BackButton onClick={back}></BackButton>

      <div className="absolute text-[#fff] h-[34px] top-[24px] left-1/2 -translate-x-1/2">
        {tCommon('edit')} &nbsp;
        {tCommon('voice')}
      </div>

      <NormalButton
        onClick={onSave}
        className={`absolute h-[34px] top-[20px] right-[20px] rounded-[8px] bg-[#2E6EE6] text-[14px] font-[500] text-[#fff]`}
      >
        {tCommon('save')}
      </NormalButton>

      <div className={`pt-[78px] flex flex-col overflow-hidden`}>
        <DDLSplitLine className="flex-none"></DDLSplitLine>

        <div className="p-[24px] flex flex-col gap-6">
          <div className="w-full h-[62px] bg-[#1C1E22] border-1 border-[#2C2C32] rounded-[8px] flex flex-row items-center cursor-pointer">
            <div className="ml-[16px] flex-1 truncate text-[#EEEFF1] text-[16px] font-[400] tracking-[0.05rem]">
              {tCommon('autoPlay')}
            </div>

            <Switch
              isSelected={autoplay}
              onValueChange={onAutoPlayChange}
              aria-label="Follow cursor"
              classNames={{
                wrapper: cn(''),
                thumb: cn(''),
              }}
              thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                  <div className={`${className} w-[6px] h-[6px] rounded-full bg-[#2E6EE6]`}></div>
                ) : (
                  <div className={`${className} w-[6px] h-[6px] rounded-full bg-[#CDD0D5]`}></div>
                )
              }
            />
          </div>

          <DDLSplitLine className="flex-none"></DDLSplitLine>

          <CreatorChoice
            ref={creatorChoiceRef}
            checkMode={editMode}
            currentSelected={currentSelect}
            onSelected={(item) => {
              onSelectClicked(item)
            }}
          ></CreatorChoice>
        </div>
      </div>
    </div>
  )
}
