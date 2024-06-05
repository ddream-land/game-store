import { useTranslation } from 'react-i18next'
import classes from './SidePanel.module.scss'
import { DDLSplitLine } from '@ddreamland/common'
import { ChangeEvent, useRef } from 'react'
import toast from 'react-hot-toast'
import { createCard } from '@/api/characterCard/characterCard'
import { useSetCharacterCardInfoList } from '@/pages/roleAI/context/CharacterCardInfoListContextProvider'
import { isString } from '@/libs/isTypes'

export default SidePanel

function SidePanel() {
  const { t: tCommon } = useTranslation('common')
  const { t: tRoleAI } = useTranslation('roleAI')
  const { setCharacterCardInfoList, refreshCharacterCardInfoList } = useSetCharacterCardInfoList()

  const userAvatar = `/imgs/default-user.png`

  function gotoSquareClicked() {
    window.location.href = `https://create.nuwalabs.org/`
  }

  const pngInputEl = useRef<HTMLInputElement>(null)
  function importPngBtnClicked() {
    pngInputEl.current?.click()
  }

  async function pngImport(img: ChangeEvent<HTMLInputElement>) {
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
    <div className={`${classes.sidePanel} flex flex-col justify-between h-full w-[89px]`}>
      <div className={`flex-1 flex flex-col items-center`}>
        <div
          className={`${classes.user} cursor-pointer relative mt-[28px]`}
          style={{
            background: `url('${userAvatar}')`,
          }}
        >
          <div className={`${classes.flag} absolute bottom-0 -right-1`}></div>
        </div>
        <div className={`${classes.op} flex flex-col mt-10 gap-6`}>
          <div
            onClick={gotoSquareClicked}
            className={`${classes.square} cursor-pointer flex flex-col justify-center items-center`}
          >
            <div className={`${classes.icon} w-[26px] h-[26px] bg-no-repeat bg-cover`}></div>
            <div className={`${classes.text} mt-1`}>{tRoleAI('square')}</div>
          </div>
          <input
            ref={pngInputEl}
            className="hidden"
            type="file"
            onChange={pngImport}
            accept="image/png"
            multiple={false}
          />
          <div
            onClick={importPngBtnClicked}
            className={`${classes.upload} cursor-pointer flex flex-col justify-center items-center`}
          >
            <div className={`${classes.icon} w-[26px] h-[26px] bg-no-repeat bg-cover`}></div>
            <div className={`${classes.text} mt-1`}>{tCommon('upload')}</div>
          </div>
          <div
            className={`${classes.create} cursor-pointer flex flex-col justify-center items-center`}
          >
            <div className={`${classes.icon} w-[26px] h-[26px] bg-no-repeat bg-cover`}></div>
            <div className={`${classes.text} mt-1`}>{tCommon('create')}</div>
          </div>
        </div>
      </div>
      <div className={`flex-none px-[10px]`}>
        <DDLSplitLine className=""></DDLSplitLine>
        <div className={`flex flex-col justify-center items-center py-[28px]`}>
          <div
            className={`${classes.setting} cursor-pointer flex flex-col justify-center items-center`}
          >
            <div className={`${classes.icon} w-[26px] h-[26px] `}></div>
            <div className={`${classes.text} mt-1`}>{tCommon('setting')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
// return (
//   <div className={`${classes.characters} ${className ?? ''} flex flex-col h-full w-full`}>
//     <div className="flex-none">
//       <HeaderInfo></HeaderInfo>
//     </div>
//     <div className="flex-1 overflow-hidden">
//       <CharacterList characterSelected={characterSelected}></CharacterList>
//     </div>
//   </div>
// )
// }
