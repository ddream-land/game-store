import classes from './CharacterDetailEditAvatarView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useTranslation } from 'react-i18next'
import { useCurrentCharaCardInfoChecker } from '../useCurrentCharaCardInfoChecker'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
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
import { createLive2d, deleteLive2d, getAllLive2d } from '@/api/live2d/live2d'
import { Outlet, useNavigate } from 'react-router-dom'

export default CharacterDetailEditAvatarView

function CharacterDetailEditAvatarView() {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()
  const { uploadCurrentCharacterCardInfo } = useCurrentCharacterCardInfo()
  const { t: tCommon } = useTranslation('common')
  const live2dInputEl = useRef<HTMLInputElement>(null)
  const vrmInputEl = useRef<HTMLInputElement>(null)
  const [editMode, setEditMode] = useState(false)
  const [deleteIds, setDeleteIds] = useState<string[]>([])
  const { back } = useNavigateBack()
  const navigate = useNavigate()

  async function refreshList() {
    const res = await getAllLive2d()

    const live2dList: CharacterAvatarTypeContents = {
      type: CharacterAvatarType.Live2D,
      typeName: 'Live2D',
      enable: true,
      contents: (res.resp ?? []).map(function (item) {
        return {
          id: item.id,
          name: item.name,
          url: item.url,
        }
      }),
    }

    const vrmList: CharacterAvatarTypeContents = {
      type: CharacterAvatarType.VRM,
      typeName: 'VRM',
      enable: false,
      contents: [
        {
          id: '1',
          name: 'VRM111111111',
          url: '/assets/live2d/Haru/Haru.model3.json',
        },
        {
          id: '2',
          name: 'VRM222222',
          url: '/assets/live2d/Hiyori/Hiyori.model3.json',
        },
        {
          id: '3',
          name: 'VRM111111111',
          url: '/assets/live2d/Haru/Haru.model3.json',
        },
        {
          id: '4',
          name: 'VRM222222',
          url: '/assets/live2d/Hiyori/Hiyori.model3.json',
        },
      ],
    }

    const imgList: CharacterAvatarTypeContents = {
      type: CharacterAvatarType.Img,
      typeName: '图片',
      enable: false,
      contents: [
        {
          id: '11',
          name: 'QQQQQQQQQQQQQ',
          url: '/imgs/default-avatar3.png',
        },
        {
          id: '22',
          name: 'WWWWWWWWWW',
          url: '/main_ian-76649fb8_spec_v2.png',
        },
        {
          id: '33',
          name: 'QQQQQQQQQQQQQ',
          url: '/imgs/default-avatar3.png',
        },
        {
          id: '44',
          name: 'WWWWWWWWWW',
          url: '/main_ian-76649fb8_spec_v2.png',
        },
      ],
    }

    setAvatars([live2dList, vrmList, imgList])
  }

  useEffect(function () {
    ;(async function () {
      await refreshList()
    })()
  }, [])

  useEffect(
    function () {
      setDeleteIds([])
    },
    [editMode]
  )

  const [avatars, setAvatars] = useState<CharacterAvatarTypeContents[]>([])

  async function onAddClicked(type: CharacterAvatarType) {
    switch (type) {
      case CharacterAvatarType.Live2D: {
        live2dInputEl.current && live2dInputEl.current.click()
        break
      }
      case CharacterAvatarType.VRM: {
        vrmInputEl.current && vrmInputEl.current.click()
        break
      }
      case CharacterAvatarType.Img: {
        break
      }
    }
  }

  async function onSettingClicked(type: CharacterAvatarType) {
    switch (type) {
      case CharacterAvatarType.Live2D: {
        navigate(`live2dSetting`)
        break
      }
      case CharacterAvatarType.VRM: {
        break
      }
      case CharacterAvatarType.Img: {
        break
      }
    }
  }

  async function onLive2dImport(zip: ChangeEvent<HTMLInputElement>) {
    if (!live2dInputEl.current || !live2dInputEl.current.files) {
      return
    }

    const id = toast.loading(tCommon('uploading'))
    try {
      const file = live2dInputEl.current.files[0]
      const res = await createLive2d(file)
      if (res.code !== 0) {
        throw new Error(res.msg)
      }

      await refreshList()
      toast.success(tCommon('uploaded'), {
        id: id,
      })
    } catch (err: any) {
      const msg = err?.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }

    live2dInputEl.current.value = ''
  }

  async function onVrmImport(zip: ChangeEvent<HTMLInputElement>) {}

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
    } catch (err: any) {
      const msg = err?.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }
  }

  async function onDeleteChecked(id: string, isSelected: boolean) {
    if (isSelected) {
      if (!deleteIds.includes(id)) {
        setDeleteIds([...deleteIds, id])
      }
    } else {
      setDeleteIds(deleteIds.filter((i) => i !== id))
    }
  }

  async function onDelete() {
    const id = toast.loading(tCommon('loading'))
    try {
      const len = deleteIds.length
      for (let i = 0; i < len; i++) {
        const id = deleteIds[i]
        await deleteLive2d(id)
      }
      await refreshList()
      toast.success(tCommon('opSuccess'), {
        id: id,
      })

      setEditMode(false)
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
      className={`${classes.characterDetailEditAvatarView} w-full h-full relative pointer-events-auto flex flex-col`}
    >
      <div className={`${classes.op} flex-none`}>
        <BackButton onClick={back}></BackButton>

        {!editMode && (
          <NormalButton
            onClick={() => {
              setEditMode(true)
            }}
            className={`${classes.editBtn} absolute`}
            size={`small`}
          ></NormalButton>
        )}

        {editMode && (
          <div className={`${classes.editMode} absolute flex flex-row `}>
            <NormalButton
              onClick={() => {
                setEditMode(false)
              }}
              className={`${classes.cancel} `}
              size={`small`}
            >
              {tCommon('cancel')}
            </NormalButton>
            <NormalButton
              onClick={onDelete}
              className={`${classes.delete} ml-4`}
              size={`small`}
            ></NormalButton>
          </div>
        )}
      </div>

      <div className={`${classes.container} px-4 pt-20 pb-8 flex-1 overflow-hidden`}>
        <div
          className={`${classes.content} h-full w-full overflow-hidden overflow-y-scroll scrollbar-override`}
        >
          {avatars
            .filter(function (avatar) {
              return avatar.enable
            })
            .map(function (avatar, index) {
              return (
                <AvatarPanel
                  key={index}
                  avatar={avatar}
                  checkMode={editMode}
                  onAddClicked={onAddClicked}
                  onSettingClicked={onSettingClicked}
                  onSelectClicked={onSelectClicked}
                  onValueChange={onDeleteChecked}
                ></AvatarPanel>
              )
            })}
        </div>
      </div>

      <input
        ref={live2dInputEl}
        className="hidden"
        type="file"
        onChange={onLive2dImport}
        accept=".zip"
        multiple={false}
      />
      <input
        ref={vrmInputEl}
        className="hidden"
        type="file"
        onChange={onVrmImport}
        accept=".zip"
        multiple={false}
      />

      <Outlet></Outlet>
    </div>
  )
}
