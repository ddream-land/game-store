import { MouseEvent } from 'react'
import { Image } from '@nextui-org/react'
import MsgMenu from './MsgMenu'

export default MsgControl

type MsgControlProps = Readonly<{
  showPlayVoiceBtn?: boolean
  showRegenerateBtn?: boolean
  showMenuBtn?: boolean
  onMenuBtnClicked: (e: MouseEvent) => void
  menuVisible: boolean
  className?: string
  onEditClicked: (e: MouseEvent) => void
  onDelClicked: (e: MouseEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
}>

function MsgControl({
  showPlayVoiceBtn,
  showRegenerateBtn,
  showMenuBtn = true,
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
      } absolute hidden group-hover:flex flex-row justify-end right-[0px] left-0 bottom-[-25px] h-[25px]`}
    >
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
