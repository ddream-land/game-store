import classes from './CharacterDetailEditAvatarView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useTranslation } from 'react-i18next'
import { useCurrentAdminCharaInfoChecker } from '../useCurrentAdminCharaInfoChecker'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { CharacterAvatar, CharacterAvatarType } from '@/core/CharacterAvatar'
import { useNavigateBack } from '@/router/useNavigateBack'
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
import CreatorChoice from './creatorChoice/CreatorChoice'
import LocalUploads from './localUploads/LocalUploads'
import DdreamFreePkg from './ddreamFreePkg/DdreamFreePkg'

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

  useEffect(
    function () {
      setDeleteIds([])
    },
    [editMode]
  )

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

      // await refreshList()
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

  async function onSelectClicked(type: CharacterAvatarType, item: Omit<CharacterAvatar, 'id'>) {
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
      // await refreshList()
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
            <CreatorChoice
              checkMode={editMode}
              onSelected={(item) => {
                onSelectClicked(CharacterAvatarType.Live2D, item)
              }}
            ></CreatorChoice>

            <DDLSplitLine></DDLSplitLine>

            <LocalUploads
              checkMode={editMode}
              onSelected={(item) => {
                onSelectClicked(CharacterAvatarType.Live2D, item)
              }}
            ></LocalUploads>

            <DDLSplitLine></DDLSplitLine>

            <DdreamFreePkg
              onSelected={(item) => {
                onSelectClicked(CharacterAvatarType.Live2D, item)
              }}
            ></DdreamFreePkg>
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
