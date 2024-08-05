import classes from './CharacterDetailEditCoverView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useTranslation } from 'react-i18next'
import { ChangeEvent, useEffect, useRef, useState, MouseEvent, useContext } from 'react'
import { useNavigateBack } from '@/router/useNavigateBack'
import { Background } from '@/core/Background'
import {
  deleteBackground,
  getAllBackgrounds,
  setDefaultBackground,
  uploadBackground,
} from '@/api/backgrounds/backgrounds'
import toast from 'react-hot-toast'
import { isString } from '@/libs/isTypes'
import {
  NuwaBackgroundExtension,
  NuwaExtensionVersion,
  NuwaExtensions,
} from '@/core/characterCard/NuwaCharacterCardExtensions'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { DDLSplitLine } from '@ddreamland/common'
import { Checkbox, Skeleton } from '@nextui-org/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SETTINGS_BG_SUFFIX } from '@/router/constants'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { refreshDefaultBg } from '@/store/slices/defaultBackground'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  currentAdminCharacterInfoSelector,
  uploadCurrentAdminCharaInfo,
} from '@/store/slices/characterSlice'
import { ReqStatus } from '@/core/ReqStatus'

export default CharacterDetailEditCoverView

function CharacterDetailEditCoverView() {
  const navigate = useNavigate()
  const adminCharaInfo = useAppSelector(currentAdminCharacterInfoSelector)
  useEffect(function () {
    if (!adminCharaInfo && !location.pathname.endsWith(SETTINGS_BG_SUFFIX)) {
      navigate(`/`)
    }
  }, [])

  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')
  const { back } = useNavigateBack()
  const dispatch = useAppDispatch()
  const imgInputEl = useRef<HTMLInputElement>(null)
  const [imgs, setImgs] = useState<Background[]>([])
  const [requestLoading, setRequestLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const location = useLocation()
  const defaultBackground = useAppSelector((state) => state.defaultBackground)

  async function uploadCurrAdminCharaInfo(card: CharacterCardV2, avatar?: File) {
    await dispatch(uploadCurrentAdminCharaInfo({ card, avatar }))
  }

  function onAddImageClicked() {
    imgInputEl.current?.click()
  }
  async function imgImport(img: ChangeEvent<HTMLInputElement>) {
    if (!imgInputEl.current || !imgInputEl.current.files) {
      return
    }

    const id = toast.loading(tCommon('uploading'))
    try {
      const file = imgInputEl.current.files[0]
      const res = await uploadBackground(file)
      await refreshImgs()

      if (!res.code || res.code === 0) {
        toast.success(tCommon('uploaded'), {
          id: id,
        })
      } else {
        throw new Error(res.msg)
      }
    } catch (err: any) {
      const msg = err.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }
  }

  let deleteIds: string[] = []

  function onCheckValueChange(id: string, isSelected: boolean) {
    if (isSelected && !deleteIds.includes(id)) {
      deleteIds.push(id)
    }
    if (!isSelected && deleteIds.includes(id)) {
      deleteIds = deleteIds.filter((v) => v !== id)
    }
  }

  async function delImg(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()

    const delIds = [...deleteIds]
    setEditMode(false)

    const toastId = toast.loading(tCommon('deleting'))

    const len = delIds.length
    try {
      for (let i = 0; i < len; i++) {
        const id = delIds[i]
        const res = await deleteBackground(id)
      }

      await refreshImgs()
      toast.success(tCommon('deleted'), {
        id: toastId,
      })
    } catch (err: any) {
      const msg = err?.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: toastId,
      })
    }
  }

  async function refreshImgs() {
    setRequestLoading(true)
    try {
      const bgs = await getAllBackgrounds()
      setImgs(bgs)
    } finally {
      setRequestLoading(false)
    }
  }

  async function setCharacterCardBg(bg: Background) {
    if (!adminCharaInfo) {
      return
    }
    const id = toast.loading(tCommon('loading'))
    try {
      const nuwaBgExtension: NuwaBackgroundExtension = {
        nuwa_bg: {
          version: NuwaExtensionVersion.V1,
          url: bg.url,
        },
      }
      const newCard: CharacterCardV2 = {
        spec: adminCharaInfo.card.spec,
        spec_version: adminCharaInfo.card.spec_version,
        data: {
          ...adminCharaInfo.card.data,
          extensions: {
            ...adminCharaInfo.card.data.extensions,
            ...nuwaBgExtension,
          },
        },
      }
      await uploadCurrAdminCharaInfo(newCard)
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

  async function setDefaultBg(bg: Background) {
    const id = toast.loading(tCommon('loading'))
    try {
      await setDefaultBackground(bg.id)
      await dispatch(refreshDefaultBg())
      if (defaultBackground.status === ReqStatus.Failed) {
        throw new Error(defaultBackground.error)
      }

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

  async function onBackgroundClicked(bg: Background) {
    if (location.pathname.endsWith(SETTINGS_BG_SUFFIX)) {
      await setDefaultBg(bg)
    } else {
      await setCharacterCardBg(bg)
    }
  }

  function isCurrentBg(bg: Background) {
    if (location.pathname.endsWith(SETTINGS_BG_SUFFIX)) {
      return defaultBackground.defaultBg === bg.url
    } else {
      return adminCharaInfo?.card.data.extensions.nuwa_bg?.url === bg.url
    }
  }

  useEffect(function () {
    ;(async function () {
      await refreshImgs()
    })()
  }, [])

  useEffect(
    function () {
      if (!editMode) {
        deleteIds = []
      }
    },
    [editMode]
  )

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      className={`${classes.characterDetailEditCoverView} w-full h-full relative pointer-events-auto flex flex-col bg-[#121315] rounded-[12px]`}
    >
      <input
        ref={imgInputEl}
        className="hidden"
        type="file"
        onChange={imgImport}
        accept="image/*"
        multiple={false}
      />

      <BackButton onClick={back}></BackButton>

      <div className="absolute text-[#fff] h-[34px] top-[24px] left-1/2 -translate-x-1/2">
        {t('editBg')}
      </div>

      <NormalButton
        onClick={onAddImageClicked}
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
        onClick={delImg}
        className={`${classes.bigBtn} ${
          !editMode && 'hidden'
        } absolute h-[34px] top-[20px] right-[20px] rounded-[8px] bg-[#CD4646]`}
      >
        {tCommon('delete')}
      </NormalButton>

      <div className={`${classes.container} pt-[78px] flex flex-col overflow-hidden`}>
        <DDLSplitLine className="flex-none"></DDLSplitLine>

        <div className="flex-1 overflow-hidden mt-[6px]">
          <div
            className={`w-full h-full p-[24px] overflow-hidden overflow-y-scroll scrollbar-override flex flex-row flex-wrap justify-between content-start gap-6`}
          >
            {requestLoading &&
              new Array(2).fill(1).map(function (_, index) {
                return <Skeleton key={index} className="w-[216px] h-[140px] rounded-[12px]" />
              })}

            {imgs.map(function (img) {
              return (
                <div
                  key={img.id}
                  onClick={() => onBackgroundClicked(img)}
                  className={`overflow-hidden cursor-pointer relative flex flex-col justify-center items-center`}
                >
                  <div
                    className={`${
                      isCurrentBg(img) ? classes.current : ''
                    } w-[216px] h-[140px] rounded-[12px] overflow-hidden`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  </div>

                  <span
                    className={`${classes.imgName} ${
                      isCurrentBg(img) ? classes.currentName : ''
                    } max-w-[216px] mt-[10px] px-[10px] py-[4px] rounded-[12px] truncate`}
                  >
                    {img.name}
                  </span>

                  {editMode && (
                    <Checkbox
                      onValueChange={(isSelected: boolean) => {
                        onCheckValueChange(img.id, isSelected)
                      }}
                      defaultSelected={false}
                      color="default"
                      className={`absolute top-3 left-3`}
                      classNames={{
                        base: ``,
                        icon: 'color-[#111]',
                        wrapper: 'bg-[#3D3F42] after:bg-[#5C61FF]',
                      }}
                    ></Checkbox>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
