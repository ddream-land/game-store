import classes from './CharacterDetailEditAvatarView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useTranslation } from 'react-i18next'
import { useCurrentAdminCharaInfoChecker } from '../useCurrentAdminCharaInfoChecker'
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
import { isString } from '@/libs/isTypes'
import { createLive2d, deleteLive2d, getAllLive2d } from '@/api/live2d/live2d'
import { Outlet, useNavigate } from 'react-router-dom'
import { useCurrentAdminCharacterInfo } from '@/pages/roleAI/context/CurrentAdminCharacterInfoContextProvider'
import { DDLSplitLine } from '@ddreamland/common'

export default CharacterDetailEditAvatarView

function CharacterDetailEditAvatarView() {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  const { uploadCurrentAdminCharaInfo } = useCurrentAdminCharacterInfo()
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')
  const live2dInputEl = useRef<HTMLInputElement>(null)
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
      contents: (res.data ?? []).map(function (live2dInfo) {
        return {
          id: live2dInfo.id,
          name: live2dInfo.name,
          url: live2dInfo.url,
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
        spec: adminCharaInfo.card.spec,
        spec_version: adminCharaInfo.card.spec_version,
        data: {
          ...adminCharaInfo.card.data,
          extensions: {
            ...adminCharaInfo.card.data.extensions,
            ...nuwaAvatarExtension,
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
      className={`${classes.characterDetailEditAvatarView} w-full h-full relative pointer-events-auto flex flex-col bg-[#121315] rounded-[12px]`}
    >
      <BackButton onClick={back}></BackButton>

      <div className="absolute text-[#fff] h-[34px] top-[24px] left-1/2 -translate-x-1/2">
        {tCommon('edit')} &nbsp;
        {t('avatar')}
      </div>

      <NormalButton
        onClick={() => onAddClicked(CharacterAvatarType.Live2D)}
        className={`${classes.addBtn} ${
          editMode && 'hidden'
        } absolute h-[34px] top-[20px] right-[20px] rounded-[8px]`}
      >
        +
      </NormalButton>

      <NormalButton
        onClick={() => {
          setEditMode(true)
        }}
        className={`${classes.bigBtn} ${
          editMode && 'hidden'
        } absolute h-[34px] top-[20px] right-[62px] rounded-[8px]`}
      >
        {tCommon('edit')}
      </NormalButton>

      <NormalButton
        onClick={() => {
          setEditMode(false)
        }}
        className={`${classes.bigBtn} ${
          !editMode && 'hidden'
        } absolute h-[34px] top-[20px] right-[106px] rounded-[8px]`}
      >
        {tCommon('cancel')}
      </NormalButton>

      <NormalButton
        // onClick={}
        className={`${classes.bigBtn} ${
          !editMode && 'hidden'
        } absolute h-[34px] top-[20px] right-[20px] rounded-[8px] bg-[#CD4646]`}
      >
        {tCommon('delete')}
      </NormalButton>

      <div className={`pt-[78px] flex flex-col overflow-hidden`}>
        <DDLSplitLine className="flex-none"></DDLSplitLine>

        <div className="flex-1 overflow-hidden mt-[6px]">
          <div
            className={`w-full h-full p-[24px] overflow-hidden overflow-y-scroll scrollbar-override flex flex-row flex-wrap justify-between content-start gap-6`}
          >
            123
          </div>
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

      <Outlet></Outlet>
    </div>
  )
}
