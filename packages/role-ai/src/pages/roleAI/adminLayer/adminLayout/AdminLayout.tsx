import classes from './AdminLayout.module.scss'
import { DDLSidebar } from '@ddreamland/common'
import { useMouseHoverOp } from './useMouseHoverOp'
import { useState } from 'react'

export interface AdminLayoutProps {
  readonly children?: React.ReactNode
}

function AdminLayout({ children }: AdminLayoutProps) {
  const { mouseOnPanel, mouseOutofPanel, minify } = useMouseHoverOp(0)
  const [sidebarOpened, setSidebarOpened] = useState(false)

  const showMask = !minify || sidebarOpened

  return (
    <div
      className={`${classes.adminLayout} ${
        showMask ? classes.mask : ''
      }  w-full h-full flex flex-row`}
    >
      <div
        className={`${classes.panel} ${minify ? classes.minify : ''} h-full flex flex-col gap-5`}
      >
        <div className={`${classes.sidebar} w-full flex-1 overflow-y-hidden`}>
          <DDLSidebar
            forceSize={!minify ? 'mini' : undefined}
            title={{ name: 'Role AI' }}
            recordRecent={{
              key: 'RoleAI',
              openUrl: '',
              name: {
                en: 'Role AI',
                'zh-CN': 'Role AI',
              },
            }}
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
            minify ? classes.minify : ''
          } w-full flex-none bg-slate-600 pointer-events-auto`}
        ></div>
      </div>
    </div>
  )
}

export default AdminLayout
