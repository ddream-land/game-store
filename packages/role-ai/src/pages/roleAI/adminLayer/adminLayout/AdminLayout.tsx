import classes from './AdminLayout.module.scss'
import { DDLSidebar, LoginModal } from '@ddreamland/common'
import { useMouseHoverOp } from './useMouseHoverOp'
import { useEffect, useState } from 'react'
import Characters from '../charactersPanel/characters/Characters'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSetCurrentChatCharacterId } from '../../context/CurrentChatCharacterIdContextProvider'
import MinimizedOverview from '../charactersPanel/minimizedOverview/MinimizedOverview'
import { useSetCurrentAdminCharacterId } from '../../context/CurrentAdminCharacterIdContextProvider'
import {
  useAdminPanelState,
  useSetAdminPanelStateContext,
} from '../../context/AdminPanelStateContextProvider'
import { useSetUserInfoContext, useUserInfoContext } from '../../context/UserInfoContextProvider'
import { useTranslation } from 'react-i18next'

export interface AdminLayoutProps {
  readonly children?: React.ReactNode
}

function AdminLayout({ children }: AdminLayoutProps) {
  const adminPanelState = useAdminPanelState()
  const setAdminPanelState = useSetAdminPanelStateContext()

  const { mouseOnPanel, mouseOutofPanel } = useMouseHoverOp(0)
  const [sidebarOpened, setSidebarOpened] = useState(false)

  const showMask = !adminPanelState.minify || sidebarOpened

  const navigate = useNavigate()
  const setCurrentChatId = useSetCurrentChatCharacterId()
  const setCurrentAdminId = useSetCurrentAdminCharacterId()
  const [loginIsOpen, setLoginIsOpen] = useState(false)
  const userInfo = useUserInfoContext()
  const { i18n } = useTranslation()

  function onAdminCharacterSelected(id: string) {
    setCurrentAdminId(id)
    navigate(`detail`)
  }

  function onChatCharacterSelected(id: string) {
    setCurrentChatId(id)
  }

  function onLogin() {
    // refreshUserInfo().then(() => {
    setLoginIsOpen(false)
    // })
  }

  useEffect(
    function () {
      // if (userInfo.uid <= 0) {
      //   setLoginIsOpen(true)
      // }
    },
    [userInfo]
  )

  return (
    <div
      className={`${classes.adminLayout} ${
        showMask ? classes.mask : ''
      }  w-full h-full flex flex-row`}
    >
      <div
        className={`${classes.panel} ${
          adminPanelState.minify ? classes.minify : ''
        } h-full flex flex-col gap-5`}
      >
        <div className={`${classes.sidebar} w-full flex-1 overflow-y-hidden`}>
          <DDLSidebar
            forceSize={!adminPanelState.minify ? 'mini' : undefined}
            title={{ name: 'Role AI' }}
            recordRecent={{
              key: 'RoleAI',
              openUrl: 'https://roleai.nuwalabs.org/',
              name: {
                en: 'Role AI',
                'zh-CN': 'Role AI',
              },
            }}
            minifyTimeout={0}
            onPanelSizeChange={(toFull) => {
              setSidebarOpened(toFull)
            }}
          ></DDLSidebar>
        </div>
        <div
          onMouseEnter={mouseOnPanel}
          onMouseOver={mouseOnPanel}
          onMouseLeave={mouseOutofPanel}
          className={`${classes.characters} ${
            adminPanelState.minify ? classes.minify : ''
          } w-full relative flex-none bg-slate-600 pointer-events-auto`}
        >
          <Characters
            className={`${!adminPanelState.minify ? 'block' : 'hidden'}`}
            adminCharacterSelected={onAdminCharacterSelected}
            chatCharacterSelected={onChatCharacterSelected}
          ></Characters>

          {adminPanelState.minify && <MinimizedOverview></MinimizedOverview>}

          <div className={`${!adminPanelState.minify ? '' : 'hidden'}`}>
            <Outlet></Outlet>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={loginIsOpen}
        locale={i18n.language as 'en' | 'zh-CN'}
        onLogin={() => {
          onLogin()
        }}
        onClose={() => {
          setLoginIsOpen(false)
        }}
      />
    </div>
  )
}

export default AdminLayout
