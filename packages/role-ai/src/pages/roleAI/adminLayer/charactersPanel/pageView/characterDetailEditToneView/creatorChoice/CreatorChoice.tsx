import { CharacterAvatarType } from '@/core/CharacterAvatar'
import { Avatar, Checkbox } from '@nextui-org/react'
import { useCurrentAdminCharaInfoChecker } from '../../useCurrentAdminCharaInfoChecker'
import { useTranslation } from 'react-i18next'
import {
  NuwaExtensionVersion,
  NuwaVoicesExtensionConfig,
  NuwaVoicesExtensionListItem,
} from '@/core/characterCard/NuwaCharacterCardExtensions'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import classes from './CreatorChoice.module.scss'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { useCurrentAdminCharacterInfo } from '@/pages/roleAI/context/CurrentAdminCharacterInfoContextProvider'
import { DDLSplitLine } from '@ddreamland/common'

type CheckedNuwaVoicesExtensionListItem = NuwaVoicesExtensionListItem & {
  checked: boolean
  originIndex: number
}

export type CreatorChoiceRef = {
  delSelection: () => Promise<void>
}

type CreatorChoiceProps = {
  checkMode?: boolean
  onSelected?: (item: NuwaVoicesExtensionListItem) => void
  currentSelected?: Partial<NuwaVoicesExtensionListItem>
}

export default forwardRef<CreatorChoiceRef, CreatorChoiceProps>(CreatorChoice)

function CreatorChoice(
  { checkMode, onSelected, currentSelected }: CreatorChoiceProps,
  ref: ForwardedRef<CreatorChoiceRef>
) {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  const { uploadCurrentAdminCharaInfo } = useCurrentAdminCharacterInfo()

  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  const [voiceList, setVoiceList] = useState<CheckedNuwaVoicesExtensionListItem[]>([])

  const nuwaVoice = adminCharaInfo.card.data.extensions.nuwa_voice
  const nuwaVoices = adminCharaInfo.card.data.extensions.nuwa_voices

  function refreshVoiceList() {
    const newVal: CheckedNuwaVoicesExtensionListItem[] = []
    if (nuwaVoices && !nuwaVoices.disable && nuwaVoices.version === NuwaExtensionVersion.V1) {
      nuwaVoices.list.forEach((item, index) => {
        if (item.type === CharacterAvatarType.Live2D) {
          newVal.push({
            type: item.type,
            sex: item.sex,
            name: item.name,
            language: item.language,
            checked: false,
            originIndex: index,
          })
        }
      })
    }

    newVal.push({
      type: '',
      sex: '',
      name: 'item.name',
      language: 'item.language',
      checked: false,
      originIndex: 100,
    })

    setVoiceList(newVal)
  }

  function isActive(item: NuwaVoicesExtensionListItem) {
    return (
      item.language === nuwaVoice?.language &&
      item.name === nuwaVoice?.name &&
      item.sex === nuwaVoice?.sex &&
      item.type === nuwaVoice?.type
    )
  }

  function isSelected(item: NuwaVoicesExtensionListItem) {
    return (
      item.language === currentSelected?.language &&
      item.name === currentSelected?.name &&
      item.sex === currentSelected?.sex &&
      item.type === currentSelected?.type
    )
  }

  function onSelect(isSelected: boolean, index: number) {
    setVoiceList(
      voiceList.map(function (item, i) {
        if (i === index) {
          return { ...item, checked: isSelected }
        }
        return item
      })
    )
  }

  async function delSelection() {
    let newNuwaVoices: NuwaVoicesExtensionConfig | undefined
    const list: NuwaVoicesExtensionListItem[] = voiceList
      .filter(function (item) {
        return !item.checked
      })
      .map(function (item) {
        return {
          language: item.language,
          name: item.name,
          sex: item.sex,
          type: item.type,
        }
      })
    if (list && list.length > 0) {
      newNuwaVoices = {
        ...(adminCharaInfo.card.data.extensions.nuwa_voices ?? {
          version: NuwaExtensionVersion.V1,
        }),
        list: list,
      }
    }

    const newAdminCard: CharacterCardV2 = {
      spec: adminCharaInfo.card.spec,
      spec_version: adminCharaInfo.card.spec_version,
      data: {
        ...adminCharaInfo.card.data,
        extensions: {
          ...adminCharaInfo.card.data.extensions,
          nuwa_voices: newNuwaVoices,
        },
      },
    }

    await uploadCurrentAdminCharaInfo(newAdminCard)
  }

  useImperativeHandle(ref, function () {
    return {
      delSelection,
    }
  })

  useEffect(function () {
    refreshVoiceList()
  }, [])

  useEffect(
    function () {
      refreshVoiceList()
    },
    [nuwaVoices]
  )

  return (
    <div className={`${classes.cc} w-full ${voiceList && voiceList.length > 0 ? '' : 'hidden'}`}>
      <div className={`text-[#6B6C70] text-[12px] font-[400] leading-[24px] tracking-[0.1rem]`}>
        {t('creatorChoice')}
      </div>

      <div>
        {voiceList.map(function (voice, index) {
          return (
            <div
              onClick={() => {
                onSelected && onSelected(voice)
              }}
              key={index}
              className={`w-full h-[62px] ${
                isSelected(voice) ? 'border-[#5B61FF]' : ''
              } bg-[#1C1E22] border-1 border-[#2C2C32] hover:border-[#5B61FF] rounded-[8px] flex flex-row items-center px-[18px] mt-[14px] cursor-pointer`}
            >
              <Avatar
                src="/imgs/play2.png"
                className={`w-[30px] h-[30px] bg-transparent flex-none`}
                radius="none"
              ></Avatar>

              <div className="ml-[16px] flex-1 truncate text-[#EEEFF1] text-[16px] font-[400] tracking-[0.05rem]">
                {voice.name}
              </div>

              <Avatar
                src="/imgs/checked.png"
                className={`${
                  isActive(voice) ? '' : 'hidden'
                } w-[24px] h-[24px] bg-transparent flex-none`}
                radius="none"
              ></Avatar>

              {checkMode && (
                <Checkbox
                  isSelected={voice.checked}
                  radius="sm"
                  color="primary"
                  onValueChange={(isSelected: boolean) => {
                    onSelect(isSelected, index)
                  }}
                  className={`ml-2`}
                ></Checkbox>
              )}
            </div>
          )
        })}
      </div>

      <DDLSplitLine className="my-[24px]"></DDLSplitLine>
    </div>
  )
}
