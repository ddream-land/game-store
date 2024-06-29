import { MouseEvent } from 'react'
import { Image } from '@nextui-org/react'
import MsgMenu from './MsgMenu'

export default MsgControl

type MsgControlProps = Readonly<{
  showPlayVoiceBtn?: boolean
  showRegenerateBtn?: boolean
  showMenuBtn?: boolean
  onPlayVoiceBtnClicked?: (e: MouseEvent) => void
  onRegenerateBtnClicked?: (e: MouseEvent) => void
  onMenuBtnClicked: (e: MouseEvent) => void
  menuVisible: boolean
  className?: string
  onEditClicked: (e: MouseEvent) => void
  onDelClicked: (e: MouseEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
}>

function MsgControl({
  showPlayVoiceBtn = false,
  showRegenerateBtn = false,
  showMenuBtn = true,
  onPlayVoiceBtnClicked,
  onRegenerateBtnClicked,
  onMenuBtnClicked,
  menuVisible,
  className,
  onEditClicked,
  onDelClicked,
  onMouseLeave,
}: MsgControlProps) {
  return (
    <div
      onMouseLeave={onMouseLeave}
      className={` ${
        className ?? ''
      } absolute hidden group-hover:flex flex-row justify-end gap-2 right-[0px] left-0 bottom-[-25px] h-[25px]`}
    >
      <div
        onClick={onPlayVoiceBtnClicked}
        className={`${showPlayVoiceBtn ? '' : 'hidden'} w-[20px] mt-[5px] h-[20px] cursor-pointer`}
      >
        <Image src="/imgs/volume.png" className="w-[20px] h-[20px]"></Image>
      </div>

      <div
        onClick={onRegenerateBtnClicked}
        className={`${showRegenerateBtn ? '' : 'hidden'} w-[20px] mt-[5px] h-[20px] cursor-pointer`}
      >
        <Image src="/imgs/refresh.png" className="w-[20px] h-[20px]"></Image>
      </div>

      <div
        onClick={onMenuBtnClicked}
        className={`${showMenuBtn ? '' : 'hidden'} w-[20px] mt-[5px] h-[20px] cursor-pointer`}
      >
        <Image src="/imgs/3dots.png" className="w-[20px] h-[20px]"></Image>
      </div>

      <MsgMenu
        visible={menuVisible}
        onEditClicked={onEditClicked}
        onDelClicked={onDelClicked}
      ></MsgMenu>
    </div>
  )
}
