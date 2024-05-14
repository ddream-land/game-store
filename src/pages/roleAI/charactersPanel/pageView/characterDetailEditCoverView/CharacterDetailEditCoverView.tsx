import classes from './CharacterDetailEditCoverView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useTranslation } from 'react-i18next'
import { useCurrentCharaCardInfoChecker } from '../useCurrentCharaCardInfoChecker'
import { ChangeEvent, useEffect, useRef, useState, MouseEvent } from 'react'
import { useNavigateBack } from '@/router/useNavigateBack'
import { Background } from '@/core/Background'
import {
  deleteBackground,
  getAllBackgrounds,
  uploadBackground,
} from '@/api/backgrounds/backgrounds'
import toast from 'react-hot-toast'
import { isString } from '@/libs/isTypes'
import {
  NuwaBackgroundExtension,
  NuwaExtensionVersion,
  NuwaExtensions,
} from '@/core/characterCard/NuwaCharacterCardExtensions'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'

export default CharacterDetailEditCoverView

function CharacterDetailEditCoverView() {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()
  const { uploadCurrentCharacterCardInfo } = useCurrentCharacterCardInfo()
  const { t: tCommon } = useTranslation('common')
  const { back } = useNavigateBack()
  const imgInputEl = useRef<HTMLInputElement>(null)
  const [imgs, setImgs] = useState<Background[]>([])

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
        toast.error(res.msg, {
          id: id,
        })
      }
    } catch (err) {
      toast.error(tCommon('opFailed'), {
        id: id,
      })
    }
  }

  async function delImg(e: MouseEvent<HTMLDivElement>, id: string) {
    e.stopPropagation()

    const toastId = toast.loading(tCommon('deleting'))
    try {
      const res = await deleteBackground(id)
      if (res.code !== 0) {
        throw new Error(res.msg)
      }
      await refreshImgs()
      toast.success(tCommon('deleted'), {
        id: toastId,
      })
    } catch (err: any) {
      const msg = err?.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }
  }

  async function refreshImgs() {
    const bgs = await getAllBackgrounds()
    setImgs(bgs)
  }

  async function onBackgroundClicked(bg: Background) {
    const id = toast.loading(tCommon('loading'))
    try {
      const nuwaBgExtension: NuwaBackgroundExtension = {
        nuwa_bg: {
          version: NuwaExtensionVersion.V1,
          url: bg.url,
        },
      }
      const newCard: CharacterCardV2 = {
        spec: charaCardInfo.card.spec,
        spec_version: charaCardInfo.card.spec_version,
        data: {
          ...charaCardInfo.card.data,
          extensions: {
            ...charaCardInfo.card.data.extensions,
            ...nuwaBgExtension,
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

  useEffect(function () {
    ;(async function () {
      await refreshImgs()
    })()
  }, [])

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      className={`${classes.characterDetailEditCoverView} w-full h-full relative pointer-events-auto flex flex-col`}
    >
      <div className={`${classes.op} flex-none`}>
        <BackButton
          color={`rgba(0,0,0,1)`}
          bgColor={`rgba(255,255,255,1)`}
          onClick={back}
        ></BackButton>
      </div>

      <div className={`${classes.container} px-4 pt-12 pb-8 flex-1 overflow-hidden`}>
        <div className={`${classes.content} h-full w-full`}>
          <div className={`${classes.panel} h-full w-full flex flex-col mt-1`}>
            <div
              className={`${classes.header} flex-none flex flex-row justify-between items-center px-2`}
            >
              <div className={`${classes.title}`}>{tCommon('img')}</div>
              <NormalButton onClick={onAddImageClicked} className={`${classes.add}`} size={`small`}>
                +{' '}
              </NormalButton>
              <input
                ref={imgInputEl}
                className="hidden"
                type="file"
                onChange={imgImport}
                accept="image/*"
                multiple={false}
              />
            </div>

            <div className={`${classes.line} flex-none mt-4`}></div>

            <div className={`${classes.listArea} flex-1 overflow-hidden mt-8`}>
              <div
                className={`${classes.list} w-full h-full overflow-hidden overflow-y-scroll scrollbar-override flex flex-row flex-wrap justify-between content-start gap-3`}
              >
                {imgs.map(function (img) {
                  return (
                    <div
                      key={img.id}
                      onClick={() => onBackgroundClicked(img)}
                      className={`${classes.item} overflow-hidden cursor-pointer relative`}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full" />
                      <div
                        className={`${classes.imgName} absolute bottom-0 left-0 right-0 flex justify-center items-center truncate`}
                      >
                        {img.name}
                      </div>
                      <div
                        onClick={(e) => delImg(e, img.id)}
                        className={`${classes.del} absolute top-4 right-4`}
                      ></div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
