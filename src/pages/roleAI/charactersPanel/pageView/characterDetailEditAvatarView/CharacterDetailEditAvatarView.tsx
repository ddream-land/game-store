import classes from './CharacterDetailEditAvatarView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useTranslation } from 'react-i18next'
import { useCurrentCharaCardInfoChecker } from '../useCurrentCharaCardInfoChecker'
import { useState } from 'react'
import {
  CharacterAvatar,
  CharacterAvatarType,
  CharacterAvatarTypeContents,
} from '@/core/CharacterAvatar'
import { useNavigateBack } from '@/router/useNavigateBack'
import AvatarPanel from './AvatarPanel'
import toast from 'react-hot-toast'
import {
  NuwaAvatarExtension,
  NuwaExtensionVersion,
} from '@/core/characterCard/NuwaCharacterCardExtensions'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import { isString } from '@/libs/isTypes'

export default CharacterDetailEditAvatarView

function CharacterDetailEditAvatarView() {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()
  const { uploadCurrentCharacterCardInfo } = useCurrentCharacterCardInfo()
  const { t: tCommon } = useTranslation('common')

  const [avatars, setAvatars] = useState<CharacterAvatarTypeContents[]>([
    {
      type: CharacterAvatarType.Live2D,
      typeName: 'Live2D',
      enable: true,
      contents: [
        {
          name: 'Haru',
          url: '/assets/live2d/Haru11/Haru.model3.json',
        },
        {
          name: 'Hiyori',
          url: '/assets/live2d/Hiyori/Hiyori.model3.json',
        },
      ],
    },
    {
      type: CharacterAvatarType.VRM,
      typeName: 'VRM',
      enable: true,
      contents: [
        {
          name: 'VRM111111111',
          url: '/assets/live2d/Haru/Haru.model3.json',
        },
        {
          name: 'VRM222222',
          url: '/assets/live2d/Hiyori/Hiyori.model3.json',
        },
        {
          name: 'VRM111111111',
          url: '/assets/live2d/Haru/Haru.model3.json',
        },
        {
          name: 'VRM222222',
          url: '/assets/live2d/Hiyori/Hiyori.model3.json',
        },
        {
          name: 'VRM111111111',
          url: '/assets/live2d/Haru/Haru.model3.json',
        },
        {
          name: 'VRM222222',
          url: '/assets/live2d/Hiyori/Hiyori.model3.json',
        },
      ],
    },
    {
      type: CharacterAvatarType.Img,
      typeName: '图片',
      enable: true,
      contents: [
        {
          name: 'QQQQQQQQQQQQQ',
          url: '/imgs/default-avatar3.png',
        },
        {
          name: 'WWWWWWWWWW',
          url: '/main_ian-76649fb8_spec_v2.png',
        },
        {
          name: 'QQQQQQQQQQQQQ',
          url: '/imgs/default-avatar3.png',
        },
        {
          name: 'WWWWWWWWWW',
          url: '/main_ian-76649fb8_spec_v2.png',
        },
        {
          name: 'QQQQQQQQQQQQQ',
          url: '/imgs/default-avatar3.png',
        },
        {
          name: 'WWWWWWWWWW',
          url: '/main_ian-76649fb8_spec_v2.png',
        },
        {
          name: 'QQQQQQQQQQQQQ',
          url: '/imgs/default-avatar3.png',
        },
        {
          name: 'WWWWWWWWWW',
          url: '/main_ian-76649fb8_spec_v2.png',
        },
        {
          name: 'QQQQQQQQQQQQQ',
          url: '/imgs/default-avatar3.png',
        },
        {
          name: 'WWWWWWWWWW',
          url: '/main_ian-76649fb8_spec_v2.png',
        },
      ],
    },
  ])

  const { back } = useNavigateBack()

  async function onAddClicked(type: CharacterAvatarType) {
    console.log('add', type)
  }

  async function onSelectClicked(type: CharacterAvatarType, item: CharacterAvatar) {
    const id = toast.loading(tCommon('loading'))
    try {
      const nuwaAvatarExtension: NuwaAvatarExtension = {
        nuwa_avatar: {
          version: NuwaExtensionVersion.V1,
          type: type,
          url: item.url,
          name: item.name ?? '',
        },
      }
      const newCard: CharacterCardV2 = {
        spec: charaCardInfo.card.spec,
        spec_version: charaCardInfo.card.spec_version,
        data: {
          ...charaCardInfo.card.data,
          extensions: {
            ...charaCardInfo.card.data.extensions,
            ...nuwaAvatarExtension,
          },
        },
      }

      await uploadCurrentCharacterCardInfo(newCard)
      toast.success(tCommon('opSuccess'), {
        id: id,
      })
    } catch (err: unknown) {
      toast.error(isString(err) ? err : tCommon('opFailed'), {
        id: id,
      })
    }
  }

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      className={`${classes.characterDetailEditAvatarView} w-full h-full relative pointer-events-auto flex flex-col`}
    >
      <div className={`${classes.op} flex-none`}>
        <BackButton
          color={`rgba(0,0,0,1)`}
          bgColor={`rgba(255,255,255,1)`}
          onClick={back}
        ></BackButton>

        <NormalButton className={`${classes.editBtn} absolute`} size={`small`}></NormalButton>
      </div>

      <div className={`${classes.container} px-4 pt-20 pb-8 flex-1 overflow-hidden`}>
        <div
          className={`${classes.content} h-full w-full overflow-hidden overflow-y-scroll scrollbar-override`}
        >
          {avatars
            .filter(function (avatar) {
              return avatar.enable && avatar.contents && avatar.contents.length > 0
            })
            .map(function (avatar, index) {
              return (
                <AvatarPanel
                  key={index}
                  avatar={avatar}
                  onAddClicked={onAddClicked}
                  onSelectClicked={onSelectClicked}
                ></AvatarPanel>
              )
            })}
        </div>
      </div>
    </div>
  )
}
