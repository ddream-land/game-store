import {
  CharacterCardDetail,
  useDigitalLifeDetailList,
} from '@/character/context/DigitalLifeDetailListContextProvider'
import classes from './Head.module.scss'
import { useCurrentDigitalLifeId } from '@/character/context/CurrentDigitalLifeIdContextProvider'
import { useRef, ChangeEvent } from 'react'
import { extractChunks } from '@/libs/pngChunks'
import { readCharacterCardFromChunks } from '@/libs/characterCard'
import { toBase64 } from '@/libs/fileBase64Encode'
import {
  useCardInfos,
  useSetCardInfos,
} from '@/character/context/CardInfoLocalStorageContextProvider'

export type DigitalLifeHeadProps = {}

let uid = Date.now()

export default function Head({}: DigitalLifeHeadProps) {
  const digitalLifeDetailList = useDigitalLifeDetailList()
  const currentDigitalLifeId = useCurrentDigitalLifeId()

  const cardInfos = useCardInfos()
  const setCardInfos = useSetCardInfos()

  const lifeDetail: CharacterCardDetail | undefined =
    digitalLifeDetailList.find(
      (item) => item.id === currentDigitalLifeId
    )

  const titleDesc = lifeDetail
    ? 'Conversation with'
    : 'Select'

  const name =
    lifeDetail?.card?.data.name ?? 'Digital lives'
  const avatarUrl =
    lifeDetail?.pngUrlOrBase64 ??
    '/imgs/default-avatar2.png'

  const pngInputEl = useRef<HTMLInputElement>(null)
  function importPngBtnClicked() {
    pngInputEl.current?.click()
  }

  function gotoCreateNuwaClicked() {
    window.location.href = `https://create.nuwalabs.org/`
  }

  async function pngImport(
    img: ChangeEvent<HTMLInputElement>
  ) {
    if (!pngInputEl.current || !pngInputEl.current.files) {
      return
    }

    const file = pngInputEl.current.files[0]
    try {
      const pngBase64 = await toBase64(file)
      const char = readCharacterCardFromChunks(
        await extractChunks(file)
      )

      const cardInfo: CharacterCardDetail = {
        pngUrlOrBase64: pngBase64,
        card: char,
        id: uid++,
      }

      setCardInfos([...cardInfos, cardInfo])
    } catch {}
  }

  return (
    <div className={`${classes.head}`}>
      <div
        className={`${classes.title} flex flex-row w-full overflow-hidden`}
      >
        <div
          className={`${classes.info} flex flex-col flex-1 overflow-hidden`}
        >
          <div className={`${classes.desc}`}>
            {titleDesc}
          </div>
          <div className={`${classes.name} truncate`}>
            {name}
          </div>
        </div>
        <div
          className={`${classes['avatar-area']} flex-none flex flex-row justify-center items-center`}
        >
          <div
            className={`${classes.avatar} overflow-hidden`}
          >
            <img
              src={avatarUrl}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div
        className={`${classes.op} flex flex-row justify-between`}
      >
        <div
          className={`${classes.l} flex flex-row flex-none`}
        >
          <div
            onClick={gotoCreateNuwaClicked}
            className={`${classes.add} cursor-pointer`}
          ></div>
          <div
            onClick={importPngBtnClicked}
            className={`${classes.import} cursor-pointer`}
          ></div>
          <input
            ref={pngInputEl}
            className="hidden"
            type="file"
            onChange={pngImport}
            accept="image/png"
            multiple={false}
          />
        </div>
        <div
          className={`${classes.r} flex-1 flex justify-end`}
        >
          <div
            className={`${classes['digital-plaza']} cursor-pointer flex flex-row justify-center items-center px-4`}
          >
            <div className={`${classes.txt}`}>
              More digital lives on DDream.Land
            </div>
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
