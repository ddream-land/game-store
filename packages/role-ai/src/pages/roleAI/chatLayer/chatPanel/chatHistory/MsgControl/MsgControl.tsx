import { MouseEvent } from 'react'
import type { PressEvent } from '@react-types/shared'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/hooks/useAppSelector'

export default MsgControl

export type MenuPopoverPlacement =
  | 'top'
  | 'bottom'
  | 'right'
  | 'left'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end'

type MsgControlProps = Readonly<{
  showPlayVoiceBtn?: boolean
  showPauseBtn?: boolean
  showRegenerateBtn?: boolean
  showMenuBtn?: boolean
  onPlayVoiceBtnClicked?: (e: MouseEvent) => void
  onPauseBtnClicked?: (e: MouseEvent) => void
  onRegenerateBtnClicked?: (e: MouseEvent) => void
  className?: string
  onEditClicked: (e: PressEvent) => void
  onDelClicked: (e: PressEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
  menuPopoverPlacement?: MenuPopoverPlacement
}>

function MsgControl({
  showPlayVoiceBtn = false,
  showPauseBtn = false,
  showRegenerateBtn = false,
  showMenuBtn = true,
  onPlayVoiceBtnClicked,
  onPauseBtnClicked,
  onRegenerateBtnClicked,
  className,
  onEditClicked,
  onDelClicked,
  onMouseLeave,
  menuPopoverPlacement = 'bottom-end',
}: MsgControlProps) {
  const { t: tCommon } = useTranslation('common')

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
        onClick={onPauseBtnClicked}
        className={`${showPauseBtn ? '' : 'hidden'} w-[20px] mt-[5px] h-[20px] cursor-pointer`}
      >
        <Image src="/imgs/3dots.png" className="w-[20px] h-[20px]"></Image>
      </div>

      <div
        onClick={onRegenerateBtnClicked}
        className={`${showRegenerateBtn ? '' : 'hidden'} w-[20px] mt-[5px] h-[20px] cursor-pointer`}
      >
        <Image src="/imgs/refresh.png" className="w-[20px] h-[20px]"></Image>
      </div>

      <Dropdown
        placement={menuPopoverPlacement}
        className="bg-[#28292D]"
        classNames={{
          content: 'min-w-[118px]',
        }}
      >
        <DropdownTrigger>
          <div
            className={`${showMenuBtn ? '' : 'hidden'} w-[20px] mt-[5px] h-[20px] cursor-pointer`}
          >
            <Image src="/imgs/3dots.png" className="w-[20px] h-[20px]"></Image>
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Menu" className="w-[118px] h-[78px] rounded-[10px]">
          <DropdownItem
            key="quick"
            textValue="quick"
            onPress={onEditClicked}
            className="w-full cursor-default"
          >
            <div className="px-[12px] w-full flex items-center text-[#C0C0C0] text-[14px] font-[400]">
              {tCommon('edit')}
            </div>
          </DropdownItem>
          <DropdownItem
            key="scratch"
            textValue="scratch"
            onPress={onDelClicked}
            className="w-full cursor-default"
          >
            <div className="px-[12px] w-full flex items-center text-[#C0C0C0] text-[14px] font-[400]">
              {tCommon('delete')}
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
