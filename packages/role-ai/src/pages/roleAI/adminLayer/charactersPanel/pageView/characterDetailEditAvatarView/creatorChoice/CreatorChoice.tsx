import { CharacterAvatarType } from '@/core/CharacterAvatar'
import { Avatar, Checkbox } from '@nextui-org/react'
import { useCurrentAdminCharaInfoChecker } from '../../useCurrentAdminCharaInfoChecker'
import { useTranslation } from 'react-i18next'
import {
  NuwaAvatarsExtensionConfig,
  NuwaAvatarsExtensionListItem,
  NuwaExtensionVersion,
} from '@/core/characterCard/NuwaCharacterCardExtensions'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import classes from './CreatorChoice.module.scss'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { DDLSplitLine } from '@ddreamland/common'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { uploadCurrentAdminCharaInfo } from '@/store/slices/characterSlice'

type CheckedNuwaAvatarsExtensionListItem = NuwaAvatarsExtensionListItem & {
  checked: boolean
  originIndex: number
}

export type CreatorChoiceRef = {
  delSelection: () => Promise<void>
}

type CreatorChoiceProps = Readonly<{
  checkMode?: boolean
  onSelected?: (item: NuwaAvatarsExtensionListItem) => void
}>

export default forwardRef<CreatorChoiceRef, CreatorChoiceProps>(CreatorChoice)

function CreatorChoice(
  { checkMode, onSelected }: CreatorChoiceProps,
  ref: ForwardedRef<CreatorChoiceRef>
) {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  if (!adminCharaInfo) {
    return
  }

  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  const [avatarList, setAvatarList] = useState<CheckedNuwaAvatarsExtensionListItem[]>([])

  const dispatch = useAppDispatch()

  async function uploadCurrAdminCharaInfo(card: CharacterCardV2, avatar?: File) {
    await dispatch(uploadCurrentAdminCharaInfo({ card, avatar }))
  }

  const nuwaAvatar = adminCharaInfo.card.data.extensions.nuwa_avatar
  const nuwaAvarars = adminCharaInfo.card.data.extensions.nuwa_avatars

  function refreshAvatarList() {
    const newVal: CheckedNuwaAvatarsExtensionListItem[] = []
    if (nuwaAvarars && !nuwaAvarars.disable && nuwaAvarars.version === NuwaExtensionVersion.V1) {
      nuwaAvarars.list.forEach((item, index) => {
        if (item.type === CharacterAvatarType.Live2D) {
          newVal.push({
            type: CharacterAvatarType.Live2D,
            url: item.url,
            name: item.name,
            checked: false,
            originIndex: index,
          })
        }
      })
    }

    setAvatarList(newVal)
  }

  function isActive(item: NuwaAvatarsExtensionListItem) {
    return (
      item.type === nuwaAvatar?.type &&
      item.url === nuwaAvatar?.url &&
      item?.name === nuwaAvatar?.name
    )
  }

  function onSelect(isSelected: boolean, index: number) {
    setAvatarList(
      avatarList.map(function (item, i) {
        if (i === index) {
          return { ...item, checked: isSelected }
        }
        return item
      })
    )
  }

  async function delSelection() {
    if (!adminCharaInfo) {
      return
    }
    let newNuwaAvatars: NuwaAvatarsExtensionConfig | undefined
    const list: NuwaAvatarsExtensionListItem[] = avatarList
      .filter(function (item) {
        return !item.checked
      })
      .map(function (item) {
        return {
          type: item.type,
          url: item.url,
          name: item.name,
        }
      })
    if (list && list.length > 0) {
      newNuwaAvatars = {
        ...(adminCharaInfo.card.data.extensions.nuwa_avatars ?? {
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
          nuwa_avatars: newNuwaAvatars,
        },
      },
    }

    await uploadCurrAdminCharaInfo(newAdminCard)
  }

  useImperativeHandle(ref, function () {
    return {
      delSelection,
    }
  })

  useEffect(function () {
    refreshAvatarList()
  }, [])

  useEffect(
    function () {
      refreshAvatarList()
    },
    [nuwaAvarars]
  )

  return (
    <div className={`${classes.cc} w-full ${avatarList && avatarList.length > 0 ? '' : 'hidden'}`}>
      <div className={`text-[#6B6C70] text-[12px] font-[400] leading-[24px] tracking-[0.1rem]`}>
        {t('creatorChoice')}
      </div>

      <div>
        {avatarList.map(function (avatar, index) {
          return (
            <div
              onClick={() => {
                onSelected && onSelected(avatar)
              }}
              key={avatar.url}
              className="w-full h-[62px] bg-[#1C1E22] border-1 border-[#2C2C32] hover:border-[#2E6EE6] rounded-[8px] flex flex-row items-center px-[18px] mt-[14px] cursor-pointer"
            >
              <Avatar
                src="/imgs/user2.png"
                className={`w-[24px] h-[24px] bg-transparent flex-none`}
                radius="none"
              ></Avatar>

              <div className="ml-[16px] flex-1 truncate text-[#EEEFF1] text-[16px] font-[400] tracking-[0.05rem]">
                {avatar.name}
              </div>

              <Avatar
                src="/imgs/checked.png"
                className={`${
                  isActive(avatar) ? '' : 'hidden'
                } w-[24px] h-[24px] bg-transparent flex-none`}
                radius="none"
              ></Avatar>

              {checkMode && (
                <Checkbox
                  isSelected={avatar.checked}
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
