import {
  useCharacterCardInfoList,
  useSetCharacterCardInfoList,
} from '@/roleAI/context/CharacterCardInfoListContextProvider'
import classes from './HeaderInfo.module.scss'
import { useCurrentDigitalLifeId } from '@/roleAI/context/CurrentDigitalLifeIdContextProvider'
import { useRef, ChangeEvent } from 'react'
import { extractChunks } from '@/libs/pngChunks'
import { readCharacterCardFromChunks } from '@/core/characterCard/characterCard'
import { toBase64 } from '@/libs/fileBase64Encode'
import { CharacterCardInfo } from '@/core/CharacterCardInfo'

export type HeaderInfoProps = {}
export default HeaderInfo

let uid = Date.now()

function HeaderInfo({}: HeaderInfoProps) {
  const characterCardInfoList = useCharacterCardInfoList()
  const setCharacterCardInfoList =
    useSetCharacterCardInfoList()
  const currentDigitalLifeId = useCurrentDigitalLifeId()

  const lifeDetail: CharacterCardInfo | undefined =
    characterCardInfoList.find(
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

      const cardInfo: CharacterCardInfo = {
        pngUrlOrBase64: pngBase64,
        card: char,
        id: uid++,
      }

      setCharacterCardInfoList([
        ...characterCardInfoList,
        cardInfo,
      ])
    } catch {}
  }

  return (
    <div className={`${classes.headerInfo}`}>
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
