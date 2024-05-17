import {
  useCharacterCardInfoList,
  useSetCharacterCardInfoList,
} from '@/pages/roleAI/context/CharacterCardInfoListContextProvider'
import classes from './HeaderInfo.module.scss'
import { useRef, ChangeEvent, useEffect } from 'react'
import { extractChunks } from '@/libs/pngChunks'
import { readCharacterCardFromChunks } from '@/core/characterCard/characterCard'
import { toBase64 } from '@/libs/fileBase64Encode'
import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import { useTranslation } from 'react-i18next'
import { createCard } from '@/api/characterCard/characterCard'
import toast from 'react-hot-toast'
import { isString } from '@/libs/isTypes'

export type HeaderInfoProps = Readonly<{}>
export default HeaderInfo

let uid = Date.now()

function HeaderInfo({}: HeaderInfoProps) {
  const { t } = useTranslation('roleAI')
  const { t: tCommon } = useTranslation('common')
  const characterCardInfoList = useCharacterCardInfoList()
  const { setCharacterCardInfoList, refreshCharacterCardInfoList } = useSetCharacterCardInfoList()
  const { charaCardInfo } = useCurrentCharacterCardInfo()

  const titleDesc = charaCardInfo ? t('conversationWith') : tCommon('select')

  const name = charaCardInfo?.card?.data.name ?? t('digitalLives')
  const avatarUrl = charaCardInfo?.pngUrlOrBase64 ?? '/imgs/default-avatar2.png'

  const pngInputEl = useRef<HTMLInputElement>(null)
  function importPngBtnClicked() {
    pngInputEl.current?.click()
  }

  function gotoCreateNuwaClicked() {
    window.location.href = `https://create.nuwalabs.org/`
  }

  async function localCreateCard(file: File) {
    try {
      const pngBase64 = await toBase64(file)
      const characterCard = readCharacterCardFromChunks(await extractChunks(file))

      if (!characterCard) {
        alert(`Unsupport card.`)
        return
      }

      const cardInfo: CharacterCardInfo = {
        pngUrlOrBase64: pngBase64,
        card: characterCard,
        id: (uid++).toString(),
      }

      setCharacterCardInfoList([...characterCardInfoList, cardInfo])
    } catch {}
  }

  async function pngImport(img: ChangeEvent<HTMLInputElement>) {
    console.log('---receice file', pngInputEl.current, pngInputEl.current?.files)

    if (!pngInputEl.current || !pngInputEl.current.files) {
      return
    }

    const id = toast.loading(tCommon('uploading'))
    try {
      const file = pngInputEl.current.files[0]

      const res = await createCard(file)
      if (res.code === 0) {
        toast.success(tCommon('uploaded'), {
          id: id,
        })
        await refreshCharacterCardInfoList()
      } else {
        throw new Error(res.msg)
      }
    } catch (err: any) {
      const msg = err.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }

    // try {
    //   await localCreateCard(file)
    // } catch {}
    pngInputEl.current.value = ''
  }

  return (
    <div className={`${classes.headerInfo}`}>
      <div className={`${classes.title} flex flex-row w-full overflow-hidden`}>
        <div className={`${classes.info} flex flex-col flex-1 overflow-hidden`}>
          <div className={`${classes.desc}`}>{titleDesc}</div>
          <div className={`${classes.name} truncate`}>{name}</div>
        </div>
        <div
          className={`${classes['avatar-area']} flex-none flex flex-row justify-center items-center`}
        >
          <div className={`${classes.avatar} overflow-hidden`}>
            <img src={avatarUrl} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
      <div className={`${classes.op} flex flex-row justify-between`}>
        <div className={`${classes.l} flex flex-row flex-none`}>
          <div onClick={gotoCreateNuwaClicked} className={`${classes.add} cursor-pointer`}></div>
          <div onClick={importPngBtnClicked} className={`${classes.import} cursor-pointer`}></div>
          <input
            ref={pngInputEl}
            className="hidden"
            type="file"
            onChange={pngImport}
            accept="image/png"
            multiple={false}
          />
        </div>
        <div className={`${classes.r} flex-1 flex justify-end`}>
          <div
            className={`${classes['digital-plaza']} cursor-pointer flex flex-row justify-center items-center px-4`}
          >
            <div className={`${classes.txt}`}>{t('digitalLifePlaza')}</div>
            <div className="flex-none">
              <img src="/imgs/default-avatar.png" />
            </div>
          </div>
        </div>
      </div>
      <div className={`${classes.line}`}></div>
    </div>
  )
}
