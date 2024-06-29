import { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

type MsgMenuProps = Readonly<{
  visible: boolean
  onEditClicked: (e: MouseEvent) => void
  onDelClicked: (e: MouseEvent) => void
}>

export default MsgMenu
function MsgMenu({ visible, onEditClicked, onDelClicked }: MsgMenuProps) {
  const { t: tCommon } = useTranslation('common')

  return (
    <div
      className={`${
        visible ? '' : 'hidden'
      } absolute right-0 top-[20px] w-[118px] h-[78px] bg-[#28292D] rounded-[10px] z-10 flex flex-col gap-0 overflow-hidden`}
    >
      <div
        onClick={onEditClicked}
        className="px-[12px] flex-1 w-full flex items-center cursor-pointer text-[#C0C0C0] text-[14px] font-[400] hover:bg-[#1c1d1f]"
      >
        {tCommon('edit')}
      </div>
      <div
        onClick={onDelClicked}
        className="px-[12px] flex-1 w-full flex items-center cursor-pointer text-[#C0C0C0] text-[14px] font-[400] hover:bg-[#1c1d1f]"
      >
        {tCommon('delete')}
      </div>
    </div>
  )
}
