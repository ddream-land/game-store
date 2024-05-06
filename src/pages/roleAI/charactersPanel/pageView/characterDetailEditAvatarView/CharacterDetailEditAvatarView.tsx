import classes from './CharacterDetailEditAvatarView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCurrentCharaCardInfoChecker } from '../useCurrentCharaCardInfoChecker'
import { useState } from 'react'

export default CharacterDetailEditAvatarView

type Avatar = {
  name: string
  url: string
}

enum AvatarType {
  Live2D = 'Live2D',
  VRM = 'VRM',
  Img = 'Img',
}

type AvatarTypeContents = {
  type: AvatarType
  typeName: string
  contents: Avatar[]
}

function CharacterDetailEditAvatarView() {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()

  const navigate = useNavigate()
  const { t: tCommon } = useTranslation('common')

  const [avatars, setAvatars] = useState<AvatarTypeContents[]>([
    {
      type: AvatarType.Live2D,
      typeName: 'Live2D',
      contents: [
        {
          name: 'Haru',
          url: '/assets/live2d/Haru/Haru.model3.json',
        },
        {
          name: 'Hiyori',
          url: '/assets/live2d/Hiyori/Hiyori.model3.json',
        },
      ],
    },

    {
      type: AvatarType.VRM,
      typeName: 'VRM',
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
      type: AvatarType.Img,
      typeName: '图片',
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
  const [currentAvarar, setCurrentAvatar] = useState({
    type: AvatarType.Live2D,
    index: 1,
  })

  function backClicked() {
    navigate(-1)
  }

  function onAddClicked(type: AvatarType) {
    console.log('add', type)
  }

  const panels = avatars
    .filter(function (avatar) {
      return avatar.contents && avatar.contents.length > 0
    })
    .map(function (avatar, index) {
      return (
        <div key={index} className={`${classes.panel} mt-2`}>
          <div className={`${classes.header} flex flex-row justify-between items-center px-2`}>
            <div className={`${classes.title}`}>{avatar.typeName}</div>
            <NormalButton
              onClick={() => onAddClicked(avatar.type)}
              className={`${classes.add}`}
              size={`small`}
            >
              +{' '}
            </NormalButton>
          </div>

          <div
            className={`${classes.listArea} ${
              avatar.type === AvatarType.Img ? classes.noBg : 'p-6'
            } mt-2`}
          >
            <div
              className={`${classes.list} w-full flex ${
                avatar.type === AvatarType.Img
                  ? 'flex-row flex-wrap justify-between gap-3'
                  : 'flex-col'
              }`}
            >
              {avatar.contents.map(function (item, i) {
                if (avatar.type === AvatarType.Img) {
                  return (
                    <div key={i} className={`${classes.imgItem} overflow-hidden cursor-pointer`}>
                      <img src={item.url} alt={item.name} />
                    </div>
                  )
                } else {
                  return (
                    <div key={i} className={`${classes.item}`}>
                      <div
                        className={`${classes.name} ${
                          currentAvarar.type === avatar.type && currentAvarar.index === i
                            ? classes.active
                            : ''
                        } px-4 py-2 truncate cursor-pointer`}
                      >
                        {item.name}
                      </div>
                      <div className={`${classes.line} w-full`}></div>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        </div>
      )
    })

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      className={`${classes.characterDetailEditAvatarView} w-full h-full relative pointer-events-auto flex flex-col`}
    >
      <div className={`${classes.op} flex-none`}>
        <BackButton
          color={`rgba(0,0,0,1)`}
          bgColor={`rgba(255,255,255,1)`}
          onClick={backClicked}
        ></BackButton>

        <NormalButton className={`${classes.editBtn} absolute`} size={`small`}></NormalButton>
      </div>

      <div className={`${classes.container} px-4 pt-20 pb-8 flex-1 overflow-hidden`}>
        <div
          className={`${classes.content} h-full w-full overflow-hidden overflow-y-scroll scrollbar-override`}
        >
          {panels}
        </div>
      </div>
    </div>
  )
}
