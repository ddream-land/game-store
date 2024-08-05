import { useTranslation } from 'react-i18next'
import classes from './UserPanel.module.scss'
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverTrigger,
  useDisclosure,
} from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Language } from '@/constant/languages'
import { Auth, DDLPay } from '@ddreamland/common'
// import { useAdminPanelState } from '@/pages/roleAI/context/AdminPanelStateContextProvider'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { logout } from '@/store/slices/userInfoSlice'
import { useGlobalEvent } from '@/hooks/useGlobalEvent'
import { useSetLoginModalOpenState } from '@/pages/roleAI/context/UserManagerContextProvider'
import { setDdreamTokenPayIsOpen } from '@/store/slices/uiSlice'
import { refreshBalanceInfo } from '@/store/slices/balanceSlice'

type UserPanelProps = {
  className?: string
}

export default function UserPanel({ className }: UserPanelProps) {
  const { t: tCommon } = useTranslation('common')
  const { t: tRoleAI } = useTranslation('roleAI')

  const { i18n } = useTranslation()
  const navigate = useNavigate()
  // const {
  //   isOpen: payIsOpen,
  //   onOpen: openPay,
  //   onOpenChange: onPayOpenChange,
  // } = useDisclosure({ defaultOpen: false })
  const {
    isOpen: dropdownIsOpen,
    onOpen: openDropdown,
    onClose: closeDropdown,
  } = useDisclosure({ defaultOpen: false })
  const [isLogouting, setIsLogouting] = useState(false)
  const { minify } = useAppSelector((state) => state.adminPanel)
  const userInfo = useAppSelector((state) => state.userInfo.info)
  const balance = useAppSelector((state) => state.balance.ddreamToken)
  const { setLoginModalOpenState } = useSetLoginModalOpenState()
  const dispatch = useAppDispatch()
  useGlobalEvent('click', closeDropdown)

  async function onAvatarClicked() {
    closeDropdown()
    if (Auth.isLogin) {
      dispatch(refreshBalanceInfo())
      openDropdown()
    } else {
      await dispatch(logout())
      setLoginModalOpenState(true)
    }
  }

  async function onLogoutClicked() {
    setIsLogouting(true)
    try {
      await dispatch(logout())
    } catch {
    } finally {
      setIsLogouting(false)
      closeDropdown()
    }
  }

  async function onTopUpClicked() {
    closeDropdown()
    dispatch(setDdreamTokenPayIsOpen(true))
  }

  const usertype = 'Power user'
  const userExpire = '120 days left'

  useEffect(
    function () {
      if (minify) {
        closeDropdown()
      }
    },
    [minify]
  )

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
      className={`${classes.userPanel} relative cursor-pointer pointer-events-auto`}
    >
      <Dropdown isOpen={dropdownIsOpen} placement="right-start" className="bg-[#25252A]">
        <DropdownTrigger>
          <Avatar
            onClick={onAvatarClicked}
            showFallback
            src={userInfo.avatar}
            className="w-[46px] h-[46px] z-0"
            radius="full"
          ></Avatar>
        </DropdownTrigger>
        <DropdownMenu aria-label="User Profile" className="w-[300px] h-[262px] rounded-xl">
          <DropdownItem
            key="profile"
            textValue="profile"
            isReadOnly
            className="w-full cursor-default"
          >
            <div className={`w-full h-[46px] flex flex-row`}>
              <Avatar
                onClick={onAvatarClicked}
                showFallback
                src={userInfo.avatar}
                className="w-[46px] h-[46px]"
                radius="full"
              ></Avatar>
              <div
                className={`ml-[10px] py-[6px] flex-1 overflow-hidden flex flex-col justify-between`}
              >
                <div className={`flex flex-row items-center`}>
                  <span className={`text-[#fff] text-[16px] font-[500] truncate`}>
                    {userInfo.name}
                  </span>
                  <span className={`${classes.flag} w-[16px] h-[16px] flex-none`}></span>
                </div>
                <div className={`flex flex-row items-center`}>
                  <span className={`text-[#FFB240] text-[12px] font-[500]`}>
                    {tRoleAI('betaUser')}
                  </span>
                  {/*<span className={`text-[#FFB240] text-[12px] font-[500]`}>{usertype}</span>
                   <div className={`w-[1px] h-[4px] bg-[#36383E] mx-1`}></div>
                  <span className={`text-[#5e5f62] text-[12px] font-[400]`}>
                    {` ${userExpire}`}
                  </span> */}
                </div>
              </div>

              <div className="flex-none flex justify-center items-center text-[12px] text-[#aaa]">
                {userInfo.uid}
              </div>
            </div>
          </DropdownItem>
          <DropdownItem
            key="wallet"
            textValue="wallet"
            isReadOnly
            className="w-full cursor-default"
          >
            <div
              className={`w-full h-[98px] bg-[#5B61FF] px-[14px] py-[10px] flex flex-col justify-between rounded-[7px]`}
            >
              <div className={`text-[#2D1A70]`}>{tCommon('balance')}</div>
              <div className={`${classes.op} flex flex-row justify-between items-end`}>
                <div>
                  <span className={`text-[#fff] text-[34px] font-[700]`}>{balance}</span>
                  <span className={`ml-2 inline-block w-[14px] h-[14px]`}>
                    {tRoleAI('ddreamTokenUnit')}
                  </span>
                </div>
                <div
                  onClick={onTopUpClicked}
                  className={`w-[72px] h-[24px] rounded-[36px] cursor-pointer text-white flex justify-center items-center text-[12px] font-[500] bg-[#ffffff14]`}
                >
                  {tCommon('topUp')}
                </div>
              </div>
            </div>
          </DropdownItem>
          <DropdownItem key="logout" textValue="logout" isReadOnly className="mt-4 ">
            <Button
              isLoading={isLogouting}
              onClick={onLogoutClicked}
              className="w-full h-[40] py-[10px] bg-transparent flex flex-row justify-center px-0 border-1 border-[#303030] rounded-full"
            >
              <div className="text-[14px] font-[400] text-[#ffffff88]"> {tCommon('logout')}</div>
            </Button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* <DDLPay
        isOpen={payIsOpen}
        onOpenChange={onPayOpenChange}
        lang={i18n.language as 'en' | 'zh-CN'}
      /> */}

      <div
        className={`w-[16px] h-[16px] bg-[url('/imgs/user-flag.png')] absolute bottom-0 -right-1`}
      ></div>
    </div>
  )
}
