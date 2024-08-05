import { useTranslation } from 'react-i18next'
import classes from './Dashboard.module.scss'
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Switch,
  cn,
  useDisclosure,
} from '@nextui-org/react'
import { DDLSidebar, DDLPay, LoginModal, Auth } from '@ddreamland/common'
import { Language } from '@/constant/languages'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { DEFAULT_NO_USER, UserInfo } from '@/core/User'
import { getUserInfo } from '@/api/user/user'

type LanguageSwitchProps = Readonly<{
  isSelected: boolean
  onValueChange: (isSelected: boolean) => void
}>

function LanguageSwitch({ isSelected, onValueChange }: LanguageSwitchProps) {
  return (
    <Switch
      isSelected={isSelected}
      onValueChange={onValueChange}
      size="sm"
      className={``}
      classNames={{
        base: cn(''),
        wrapper: cn(
          'bg-transparent h-[40px] w-[76px] text-[#555] border-1 border-[#333]',
          'data-[selected=true]:text-[#555]',
          'data-[selected=true]:text-xs',
          'data-[selected=true]:bg-transparent',
          'group-data-[selected=true]:text-[#555]',
          'group-data-[selected=true]:text-xs',
          'group-data-[selected=true]:bg-transparent'
        ),
        thumb: cn(
          'bg-[#333333] w-[32px] h-[32px]',
          'data-[selected=true]:ml-[34px]',
          'group-data-[selected=true]:ml-[34px]'
        ),
      }}
      startContent={<span style={{ fontSize: '12px', color: '#555' }}>En</span>}
      endContent={<span style={{ fontSize: '12px', color: '#555' }}>中</span>}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <span className={`text-white`}>中</span>
        ) : (
          <span className={`text-white`}>En</span>
        )
      }
    ></Switch>
  )
}

function PlayLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
      <path
        d="M1.5 6.9999V4.77489C1.5 2.01656 3.45833 0.883229 5.85 2.26656L7.775 3.38323L9.7 4.4999C12.0917 5.88323 12.0917 8.14156 9.7 9.52489L7.775 10.6416L5.85 11.7582C3.45833 13.1166 1.5 11.9916 1.5 9.22489V6.9999Z"
        stroke="white"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FlashLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.97514 0.571807C10.3572 0.759091 10.5653 1.18022 10.4818 1.59748L9.45608 6.72612H14.5625C14.9296 6.72612 15.2629 6.94032 15.4153 7.27421C15.5678 7.60809 15.5114 8.00024 15.271 8.27762L7.14597 17.6526C6.86729 17.9742 6.40698 18.0677 6.02489 17.8804C5.6428 17.6931 5.43477 17.272 5.51822 16.8548L6.54395 11.7261H1.43751C1.07047 11.7261 0.737179 11.5119 0.584716 11.178C0.432254 10.8441 0.488664 10.452 0.729056 10.1746L8.85406 0.799623C9.13274 0.478061 9.59305 0.384522 9.97514 0.571807Z"
        fill="#18CD7F"
      />
    </svg>
  )
}

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const {
    isOpen: payIsOpen,
    onOpen: openPay,
    onOpenChange: onPayOpenChange,
  } = useDisclosure({ defaultOpen: false })
  const {
    isOpen: dropdownIsOpen,
    onOpen: openDropdown,
    onClose: closeDropdown,
  } = useDisclosure({ defaultOpen: false })
  const [loginIsOpen, setLoginIsOpen] = useState(false)
  const [isLogouting, setIsLogouting] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>(DEFAULT_NO_USER)

  const isChn = i18n.language === Language.zhCN
  function onLanguageChange(isSelected: boolean) {
    navigate(`/${isSelected ? Language.zhCN : Language.en}`)
  }

  const games = [
    {
      name: 'Role.AI',
      avatarUrl: '/imgs/roleAI.png',
      tags: ['Role Play', 'Interactive fiction'],
      author: {
        name: 'DDream',
        logoUrl: '/imgs/ddream-logo.png',
      },
      gameUrl: 'https://roleai.nuwalabs.org/',
    },
  ]

  function onAvatarClicked() {
    closeDropdown()
    if (Auth.isLogin) {
      openDropdown()
    } else {
      setLoginIsOpen(true)
    }
  }

  async function onLogoutClicked() {
    setIsLogouting(true)
    try {
      await Auth.logout()
    } catch {
    } finally {
      setIsLogouting(false)
      closeDropdown()
    }
  }

  async function refreshUserInfo() {
    const userInfoRes = await getUserInfo()
    if (userInfoRes.code !== 0) {
      await Auth.logout()
      setUserInfo(DEFAULT_NO_USER)
    } else {
      setUserInfo(userInfoRes.data)
    }
  }

  useEffect(function () {
    ;(async function () {
      await refreshUserInfo()
    })()
  }, [])

  return (
    <div
      className={`${classes.dashboard} w-screen h-screen flex flex-col relative`}
      onClick={closeDropdown}
    >
      <div className="flex-none w-full h-[82px] bg-[#25252A] border-b-1 border-[#25252A] flex flex-row justify-between px-[24px]">
        <div className="absolute top-[5px] left-[5px] bottom-[5px] w-[360px] z-50 pointer-events-none">
          <DDLSidebar
            title={{ name: 'GameStore' }}
            minifyTimeout={0}
            lang={i18n.language as 'en' | 'zh-CN'}
          ></DDLSidebar>
        </div>

        <div className=""></div>
        <div className="flex flex-row h-full justify-center items-center">
          <LanguageSwitch isSelected={isChn} onValueChange={onLanguageChange}></LanguageSwitch>
          <div className="flex flex-row ml-[24px]">
            <FlashLogo></FlashLogo>
            <span className="text-[#18CD7F] ml-[4px]">255</span>
          </div>
          <Dropdown isOpen={dropdownIsOpen} placement="bottom-end" className="bg-[#25252A]">
            <DropdownTrigger>
              <Avatar
                onClick={onAvatarClicked}
                showFallback
                className="w-[40px] h-[40px] ml-[12px]"
                radius="full"
              ></Avatar>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Profile" className="w-[300px] h-[289px] rounded-xl">
              <DropdownItem
                key="profile"
                textValue="profile"
                isReadOnly
                className="w-full cursor-default"
              >
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center">
                    <Avatar
                      showFallback
                      src={userInfo.avatar}
                      className="w-[40px] h-[40px]"
                    ></Avatar>
                    <span className="ml-[8px] text-[18px] font-[800]">{userInfo.name ?? ''}</span>
                  </div>
                  <div className="cursor-pointer text-[#A0A0AA] text-[12px]">Profile &gt;</div>
                </div>
              </DropdownItem>
              <DropdownItem
                key="wallet"
                textValue="wallet"
                isReadOnly
                className="w-full cursor-default"
              >
                <div
                  className="w-full h-[97px] my-[6px] bg-no-repeat bg-center bg-cover flex flex-col justify-between px-[16px] py-[12px]"
                  style={{
                    backgroundImage: `url('/imgs/wallet-bg.png')`,
                  }}
                >
                  <div className="flex flex-row justify-between">
                    <div className="text-[#fff] text-[14px] font-[500]">{t('balance')}</div>
                    <div className="text-[#fff] text-[12px] font-[400] cursor-pointer opacity-70">
                      {t('wallets')} &gt;
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <div>
                      <div className="text-[#fff] text-[24px] font-[700]">{userInfo.wallet}</div>
                      <div className="text-[#d9cee6] text-[10px] font-[400]">{t('dreamToken')}</div>
                    </div>
                    <div
                      onClick={() => {
                        openPay()
                      }}
                      className="w-[66px] h-[32px] cursor-pointer rounded-[16px] bg-[#ffffff14] text-[#fff] text-[12px] font-[500] flex justify-center items-center"
                    >
                      {t('topUp')}
                    </div>
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem key="myCollection" textValue="myCollection" className="">
                <Button className="w-full h-[40px] py-[10px] bg-transparent flex flex-row justify-start px-0">
                  <div
                    className={`${classes.myCollectionLogo} w-[20px] h-[20px]`}
                    style={{
                      backgroundImage: `url('/imgs/myColl.png')`,
                    }}
                  ></div>
                  <div className=" ml-4 text-[16px] font-[400] text-[#fff] text-center">
                    {t('myCollection')}
                  </div>
                </Button>
              </DropdownItem>
              <DropdownItem key="logout" textValue="logout">
                <Button
                  isLoading={isLogouting}
                  onClick={onLogoutClicked}
                  className="w-full h-[40] py-[10px] bg-transparent flex flex-row justify-start px-0"
                >
                  <div
                    className={`${classes.logoutLogo} w-[20px] h-[20px]`}
                    style={{
                      backgroundImage: `url('/imgs/logout.png')`,
                    }}
                  ></div>
                  <div className=" ml-4 text-[16px] font-[400] text-[#fff]">{t('logout')}</div>
                </Button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="flex-1 overflow-hidden w-full bg-[#15151A] flex flex-col">
        <div
          className={`${classes.title} flex-none w-full h-[48px] mt-[46px] px-[24px] flex flex-row`}
        >
          <span className={`${classes.icon} h-[48px] w-[48px]`}></span>
          <span className={`${classes.text} text-[#fff] ml-[8px]`}>{t('gameStore')}</span>
        </div>

        <div className={`${classes.content} w-full flex-1 mt-[48px] px-[24px] flex flex-row`}>
          {games.map(function (game, index) {
            return (
              <div
                key={index}
                className={`${classes.game} w-[266px] h-[351px] rounded-2xl bg-[#15151A] overflow-hidden shadow-[0_0_1px_0_rgba(255,255,255,0.3)] flex flex-col`}
              >
                <Avatar src={game.avatarUrl} radius="none" className="w-full h-[199px]"></Avatar>
                <div className="px-[16px] mt-[12px] flex flex-col w-full">
                  <div className={`${classes.name} text-[#fff]`}>{game.name}</div>
                  <div className={`${classes.tags} text-[#fff] mt-[4px] h-[24px]`}>
                    {game.tags.map(function (tag) {
                      return (
                        <span
                          key={tag}
                          className={`inline-block h-full px-2 py-[2px] rounded mr-[4px] bg-[#25252A]`}
                        >
                          {tag}
                        </span>
                      )
                    })}
                  </div>
                  <div className={`${classes.author} text-[#A0A0AA] mt-[8px] flex flex-row h-4`}>
                    <Avatar
                      className="h-[16px] w-[16px]"
                      radius="full"
                      src={game.author.logoUrl}
                    ></Avatar>

                    <span className="ml-[4px]">{game.author.name}</span>
                  </div>

                  <Button
                    onClick={() => {
                      window.open(game.gameUrl, '_blank')
                    }}
                    className="bg-[#18A9CC] rounded-lg mt-[12px] h-[32px]"
                  >
                    <PlayLogo></PlayLogo>
                    {t('play')}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <DDLPay
        isOpen={payIsOpen}
        onOpenChange={onPayOpenChange}
        lang={i18n.language as 'en' | 'zh-CN'}
      />

      <LoginModal
        isOpen={loginIsOpen}
        locale={i18n.language as 'en' | 'zh-CN'}
        onLogin={() => {
          setLoginIsOpen(false)
          refreshUserInfo()
        }}
        onClose={() => {
          setLoginIsOpen(false)
        }}
      />
    </div>
  )
}
