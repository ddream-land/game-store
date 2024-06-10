import classes from './AdminLayout.module.scss'
import { DDLSidebar } from '@ddreamland/common'
import { useMouseHoverOp } from './useMouseHoverOp'
import { useState } from 'react'
import Characters from '../charactersPanel/characters/Characters'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSetCurrentChatCharacterId } from '../../context/CurrentChatCharacterIdContextProvider'
import MinimizedOverview from '../charactersPanel/minimizedOverview/MinimizedOverview'
import { useSetCurrentAdminCharacterId } from '../../context/CurrentAdminCharacterIdContextProvider'
import {
  useAdminPanelState,
  useSetAdminPanelStateContext,
} from '../../context/AdminPanelStateContextProvider'

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

  function onAdminCharacterSelected(id: string) {
    setCurrentAdminId(id)
    navigate(`detail`)
  }

  function onChatCharacterSelected(id: string) {
    setCurrentChatId(id)
  }

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
              openUrl: '',
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
    </div>
  )
}

export default AdminLayout
