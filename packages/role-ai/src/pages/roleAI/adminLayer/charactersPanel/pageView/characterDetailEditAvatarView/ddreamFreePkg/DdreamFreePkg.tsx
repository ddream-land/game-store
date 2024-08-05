import { CharacterAvatarType } from '@/core/CharacterAvatar'
import { Avatar, Checkbox, Skeleton } from '@nextui-org/react'
import { useCurrentAdminCharaInfoChecker } from '../../useCurrentAdminCharaInfoChecker'
import { useTranslation } from 'react-i18next'
import { NuwaAvatarsExtensionListItem } from '@/core/characterCard/NuwaCharacterCardExtensions'
import { useEffect, useState } from 'react'
import classes from './DdreamFreePkg.module.scss'
import { ddreamFreeLive2ds } from '@/api/live2d/live2d'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { uploadCurrentAdminCharaInfo } from '@/store/slices/characterSlice'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'

type CheckedNuwaAvatarsExtensionListItem = NuwaAvatarsExtensionListItem

type DdreamFreePkgProps = { onSelected?: (item: NuwaAvatarsExtensionListItem) => void }

export default DdreamFreePkg

function DdreamFreePkg({ onSelected }: DdreamFreePkgProps) {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  if (!adminCharaInfo) {
    return
  }

  const { t } = useTranslation('roleAI')

  const [avatarList, setAvatarList] = useState<CheckedNuwaAvatarsExtensionListItem[]>([])
  const dispatch = useAppDispatch()
  const [requestLoading, setRequestLoading] = useState(false)

  async function uploadCurrAdminCharaInfo(card: CharacterCardV2, avatar?: File) {
    await dispatch(uploadCurrentAdminCharaInfo({ card, avatar }))
  }

  const nuwaAvatar = adminCharaInfo.card.data.extensions.nuwa_avatar
  const nuwaAvarars = adminCharaInfo.card.data.extensions.nuwa_avatars

  async function refreshAvatarList() {
    const list: CheckedNuwaAvatarsExtensionListItem[] = []

    try {
      setRequestLoading(true)
      const res = await ddreamFreeLive2ds()
      res.forEach((live2d, index) => {
        list.push({
          type: CharacterAvatarType.Live2D,
          url: live2d.url,
          name: live2d.name,
        })
      })
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
        {t('ddreamFreePkg')}
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
              key={index}
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
