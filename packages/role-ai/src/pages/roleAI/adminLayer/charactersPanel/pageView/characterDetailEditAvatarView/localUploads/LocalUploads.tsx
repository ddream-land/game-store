import { CharacterAvatarType } from '@/core/CharacterAvatar'
import { Avatar, Checkbox, Skeleton } from '@nextui-org/react'
import { useCurrentAdminCharaInfoChecker } from '../../useCurrentAdminCharaInfoChecker'
import { useTranslation } from 'react-i18next'
import { NuwaAvatarsExtensionListItem } from '@/core/characterCard/NuwaCharacterCardExtensions'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import classes from './LocalUploads.module.scss'
import { deleteLive2d, getAllLive2d } from '@/api/live2d/live2d'
import { DDLSplitLine } from '@ddreamland/common'

type CheckedNuwaAvatarsExtensionListItem = NuwaAvatarsExtensionListItem & {
  checked: boolean
  id: string
}

export type LocalUploadsRef = {
  delSelection: () => Promise<void>
  refresh: () => Promise<void>
}

type LocalUploadsProps = {
  checkMode?: boolean
  onSelected?: (item: NuwaAvatarsExtensionListItem) => void
}

export default forwardRef<LocalUploadsRef, LocalUploadsProps>(LocalUploads)

function LocalUploads(
  { checkMode, onSelected }: LocalUploadsProps,
  ref: ForwardedRef<LocalUploadsRef>
) {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  if (!adminCharaInfo) {
    return
  }

  const { t } = useTranslation('roleAI')

  const [avatarList, setAvatarList] = useState<CheckedNuwaAvatarsExtensionListItem[]>([])
  const [requestLoading, setRequestLoading] = useState(false)

  const nuwaAvatar = adminCharaInfo.card.data.extensions.nuwa_avatar
  const nuwaAvarars = adminCharaInfo.card.data.extensions.nuwa_avatars

  async function refreshAvatarList() {
    const list: CheckedNuwaAvatarsExtensionListItem[] = []

    try {
      setRequestLoading(true)
      const res = await getAllLive2d()
      const data = res.data

      if (data && data.length > 0) {
        data.forEach((live2d, index) => {
          list.push({
            type: CharacterAvatarType.Live2D,
            url: live2d.url,
            name: live2d.name,
            checked: false,
            id: live2d.id,
          })
        })
      }
    } finally {
      setAvatarList(list)
      setRequestLoading(false)
    }
  }

  function isActive(item: NuwaAvatarsExtensionListItem) {
    return (
      item.type === nuwaAvatar?.type &&
      item.url === nuwaAvatar?.url &&
      item?.name === nuwaAvatar?.name
    )
  }

  function onSelect(isSelected: boolean, id: string) {
    setAvatarList(
      avatarList.map(function (item, i) {
        if (item.id === id) {
          return { ...item, checked: isSelected }
        }
        return item
      })
    )
  }

  async function delSelection() {
    const len = avatarList.length
    for (let i = 0; i < len; i++) {
      const avatar = avatarList[i]
      if (avatar.checked) {
        await deleteLive2d(avatar.id)
      }
    }
    await refreshAvatarList()
  }

  useImperativeHandle(ref, function () {
    return {
      delSelection,
      refresh: refreshAvatarList,
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
    <div
      className={`${classes.cc} w-full ${
        requestLoading || (avatarList && avatarList.length > 0) ? '' : 'hidden'
      }`}
    >
      <div className={`text-[#6B6C70] text-[12px] font-[400] leading-[24px] tracking-[0.1rem]`}>
        {t('localUploads')}
      </div>

      <div>
        {requestLoading &&
          new Array(2).fill(1).map(function (_, index) {
            return <Skeleton key={index} className="w-full h-[62px] rounded-[8px] mt-[14px]" />
          })}

        {avatarList.map(function (avatar, index) {
          return (
            <div
              onClick={() => {
                onSelected && onSelected(avatar)
              }}
              key={avatar.id}
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
                    onSelect(isSelected, avatar.id)
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
