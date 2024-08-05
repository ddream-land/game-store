import { useTranslation } from 'react-i18next'
import classes from './SidePanel.module.scss'
import {
  DDLSplitLine,
  QuickCreateDigitalLifeModal,
  DigitalLifeStoreModal,
  Auth,
} from '@ddreamland/common'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { createCard } from '@/api/characterCard/characterCard'
import { isString } from '@/libs/isTypes'
import UserPanel from './UserPanel/UserPanel'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { refreshCharacterList, setCurrentChatCharacterId } from '@/store/slices/characterSlice'
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import { useSetLoginModalOpenState } from '@/pages/roleAI/context/UserManagerContextProvider'
import { useAppSelector } from '@/hooks/useAppSelector'

export type SidePanelProps = Readonly<{
  onAddedCharacter?: (id: string) => void
}>

export default SidePanel

function SidePanel({ onAddedCharacter }: SidePanelProps) {
  const { t: tCommon } = useTranslation('common')
  const { t: tRoleAI } = useTranslation('roleAI')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    isOpen: squareModalIsOpen,
    onOpen: openSquareModal,
    onClose: closeSquareModal,
  } = useDisclosure()
  const {
    isOpen: createMenuIsOpen,
    onOpen: openCreateMenu,
    onClose: closeCreateMenu,
  } = useDisclosure()
  const { i18n } = useTranslation()
  const { setLoginModalOpenState } = useSetLoginModalOpenState()
  const adminPanelMinify = useAppSelector((state) => state.adminPanel.minify)
  const [ocQuickCreateOpen, setOcQuickCreateOpen] = useState(false)
  const [ocCustomCreateOpen, setOcCustomCreateOpen] = useState(false)

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
        await dispatch(refreshCharacterList())
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

  async function mayOpenSquareModal() {
    if (Auth.isLogin) {
      openSquareModal()
    } else {
      setLoginModalOpenState(true)
    }
  }

  async function mayOpenCreateMenu() {
    if (Auth.isLogin) {
      openCreateMenu()
    } else {
      setLoginModalOpenState(true)
    }
  }

  async function mayOpenSettings() {
    if (Auth.isLogin) {
      navigate(`settings`)
    } else {
      setLoginModalOpenState(true)
    }
  }

  async function quickCreateClicked() {
    setOcQuickCreateOpen(true)
  }

  async function createFromScratchClicked() {
    setOcCustomCreateOpen(true)
  }

  useEffect(
    function () {
      closeCreateMenu()
    },
    [adminPanelMinify]
  )

  return (
    <div className={`${classes.sidePanel} flex flex-col justify-between h-full w-[89px]`}>
      <div className={`flex-1 flex flex-col items-center`}>
        <div className={`mt-[28px]`}>
          <UserPanel className={`${classes.userPanel}`}></UserPanel>
        </div>
        <div className={`${classes.op} flex flex-col mt-10 gap-6`}>
          <div
            onClick={mayOpenSquareModal}
            className={`z-0 cursor-pointer flex flex-col justify-center items-center py-[8px] px-[16px] rounded-[8px] hover:bg-[#202020]`}
          >
            <Image src={'/imgs/square.png'} className="w-[26px] h-[26px]"></Image>
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

          <Dropdown
            isOpen={createMenuIsOpen}
            shouldCloseOnInteractOutside={(e: Element) => {
              closeCreateMenu()
              return true
            }}
            placement="right"
            className="bg-[#25252A]"
          >
            <DropdownTrigger>
              <div
                onClick={mayOpenCreateMenu}
                className={`${classes.create} cursor-pointer flex z-0 flex-col justify-center items-center py-[8px] px-[16px] rounded-[8px] hover:bg-[#202020]`}
              >
                <Image src={'/imgs/user5.png'} className="w-[26px] h-[26px]"></Image>
                <div className={`${classes.text} mt-1`}>{tCommon('create')}</div>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Create" className="w-[196px] h-[112px] rounded-[10px]">
              <DropdownItem
                key="quick"
                textValue="quick"
                onPress={quickCreateClicked}
                className="w-full cursor-default"
              >
                <div className="flex flex-row justify-start items-center">
                  <Image width={20} height={20} src="/imgs/user3.png"></Image>
                  <div className="ml-2">{tRoleAI('quickCreate')}</div>
                  <Image width={38} height={20} src="/imgs/ai.png" className="ml-2"></Image>
                </div>
              </DropdownItem>
              <DropdownItem
                key="scratch"
                textValue="scratch"
                onPress={createFromScratchClicked}
                className="w-full cursor-default"
              >
                <div className="flex flex-row justify-start items-center">
                  <Image width={20} height={20} src="/imgs/user4.png"></Image>
                  <div className="ml-2">{tRoleAI('createFromScratch')}</div>
                </div>
              </DropdownItem>
              <DropdownItem
                key="local"
                textValue="local"
                onPress={importPngBtnClicked}
                className="w-full cursor-default"
              >
                <div className="flex flex-row justify-start items-center">
                  <Image width={20} height={20} src="/imgs/upload2.png"></Image>
                  <div className="ml-2">{tRoleAI('createFromLocal')}</div>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className={`flex-none px-[10px]`}>
        <DDLSplitLine className=""></DDLSplitLine>

        <div className={`flex flex-col justify-center items-center py-[16px]`}>
          <div
            onClick={mayOpenSettings}
            className={`${classes.setting} cursor-pointer flex flex-col justify-center items-center w-full rounded-[8px] hover:bg-[#202020]`}
          >
            <div className={`${classes.icon} w-[26px] h-[26px] `}></div>
            <div className={`${classes.text} mt-1`}>{tCommon('setting')}</div>
          </div>
        </div>
      </div>

      <DigitalLifeStoreModal
        isOpen={squareModalIsOpen}
        onClose={closeSquareModal}
        locale={i18n.language as 'en' | 'zh-CN'}
        onRunAISuccess={(id: string, isSuccess: boolean) => {
          if (isSuccess) {
            onAddedCharacter && onAddedCharacter(id)
            closeSquareModal()
          }
        }}
      ></DigitalLifeStoreModal>

      <QuickCreateDigitalLifeModal
        locale={i18n.language as 'en' | 'zh-CN'}
        isOpen={ocQuickCreateOpen}
        onClose={() => {
          setOcQuickCreateOpen(false)
        }}
        onSuccess={(res: { code: number; data: string; msg: string }) => {
          res.code === 0 && onAddedCharacter && onAddedCharacter(res.data)
        }}
      ></QuickCreateDigitalLifeModal>

      <QuickCreateDigitalLifeModal
        variant="custom"
        locale={i18n.language as 'en' | 'zh-CN'}
        isOpen={ocCustomCreateOpen}
        onClose={() => {
          setOcCustomCreateOpen(false)
        }}
        onSuccess={(res: { code: number; data: string; msg: string }) => {
          res.code === 0 && onAddedCharacter && onAddedCharacter(res.data)
        }}
      ></QuickCreateDigitalLifeModal>
    </div>
  )
}
