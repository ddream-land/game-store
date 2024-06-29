import { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

type EditControlProps = Readonly<{
  visible: boolean
  onSaveClicked: (e: MouseEvent) => void
  onCancelClicked: (e: MouseEvent) => void
}>

export default EditControl
function EditControl({ visible, onSaveClicked, onCancelClicked }: EditControlProps) {
  const { t: tCommon } = useTranslation('common')

  return (
    <div
      className={`${
        visible ? '' : 'hidden'
      } absolute right-0 bottom-[-34px] w-[170px] h-[29px] z-10 flex flex-row gap-4 overflow-hidden`}
    >
      <div
        onClick={onCancelClicked}
        className="flex-1 flex items-center justify-center cursor-pointer text-[#FCFDFE] text-[14px] font-[600] opacity-80 hover:opacity-100 h-full rounded-full bg-[#ffffff33]"
      >
        {tCommon('cancel')}
      </div>

      <div
        onClick={onSaveClicked}
        className="flex-1 flex items-center justify-center cursor-pointer text-[#FCFDFE] text-[14px] font-[600] opacity-80 hover:opacity-100 h-full rounded-full bg-[#2E6EE6]"
      >
        {tCommon('save')}
      </div>
    </div>
  )
}
