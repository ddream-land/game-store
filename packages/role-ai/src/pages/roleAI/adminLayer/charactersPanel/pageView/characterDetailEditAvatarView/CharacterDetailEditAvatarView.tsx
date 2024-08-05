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
import { DDLSplitLine } from '@ddreamland/common'
import CreatorChoice, { CreatorChoiceRef } from './creatorChoice/CreatorChoice'
import LocalUploads, { LocalUploadsRef } from './localUploads/LocalUploads'
import DdreamFreePkg from './ddreamFreePkg/DdreamFreePkg'
import { Avatar } from '@nextui-org/react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { uploadCurrentAdminCharaInfo } from '@/store/slices/characterSlice'

export default CharacterDetailEditAvatarView

function CharacterDetailEditAvatarView() {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  if (!adminCharaInfo) {
    return
  }

  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')
  const live2dInputEl = useRef<HTMLInputElement>(null)
  const [editMode, setEditMode] = useState(false)
  const creatorChoiceRef = useRef<CreatorChoiceRef | null>(null)
  const localUploadsRef = useRef<LocalUploadsRef | null>(null)
  const { back } = useNavigateBack()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  async function uploadCurrAdminCharaInfo(card: CharacterCardV2, avatar?: File) {
    await dispatch(uploadCurrentAdminCharaInfo({ card, avatar }))
  }

  const nuwaAvatar = adminCharaInfo.card.data.extensions.nuwa_avatar
  const hasLive2d = nuwaAvatar?.type === CharacterAvatarType.Live2D && nuwaAvatar?.url

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

      localUploadsRef.current?.refresh()

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
    if (!adminCharaInfo) {
      return
    }
    const id = toast.loading(tCommon('loading'))
    try {
      const nuwaAvatarExtension: NuwaAvatarExtension = {
        nuwa_avatar: {
          version: NuwaExtensionVersion.V1,
          type: type,
          url: item.url,
          name: item.name ?? '',
          clickMotion: undefined,
          startMotion: undefined,
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

      await uploadCurrAdminCharaInfo(newCard)
      toast.dismiss(id)
    } catch (err: any) {
      const msg = err?.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }
  }

  async function onDelete() {
    const id = toast.loading(tCommon('loading'))
    try {
      creatorChoiceRef.current?.delSelection()
      localUploadsRef.current?.delSelection()

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

      <NormalButton
        onClick={() => {
          onSettingClicked(CharacterAvatarType.Live2D)
        }}
        className={`${classes.rectBtn} ${
          !hasLive2d && 'hidden'
        } absolute h-[34px] top-[20px] left-[62px] rounded-[8px] p-0`}
      >
        <Avatar src={'/imgs/setting3.png'} className="w-[24px] h-[24px]"></Avatar>
      </NormalButton>

      <div className="absolute text-[#fff] h-[34px] top-[24px] left-1/2 -translate-x-1/2">
        {t('editAvatar')}
      </div>

      <NormalButton
        onClick={() => onAddClicked(CharacterAvatarType.Live2D)}
        className={`${classes.rectBtn} ${
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
        onClick={onDelete}
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
              ref={creatorChoiceRef}
              checkMode={editMode}
              onSelected={(item) => {
                onSelectClicked(CharacterAvatarType.Live2D, item)
              }}
            ></CreatorChoice>

            <LocalUploads
              ref={localUploadsRef}
              checkMode={editMode}
              onSelected={(item) => {
                onSelectClicked(CharacterAvatarType.Live2D, item)
              }}
            ></LocalUploads>

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
