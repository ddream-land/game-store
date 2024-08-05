import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default CallMeByModal

type CallMeByModalProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (newName: string) => void
}
function CallMeByModal({ isOpen, onOpenChange, onSave }: CallMeByModalProps) {
  const { t: tCommon } = useTranslation('common')
  const { t: tRoleAI } = useTranslation('roleAI')
  const [value, setValue] = useState('')

  function onSavePressed() {
    onSave(value)
    setValue('')
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody>
              <div className="text-white text-2xl">{tRoleAI('callMeByNote')}</div>
              <Input placeholder="" value={value} onValueChange={setValue} />
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="bordered" onPress={onClose}>
                {tCommon('cancel')}
              </Button>

              <Button className="bg-[#18A9CC]" onPress={onSavePressed}>
                {tCommon('save')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
