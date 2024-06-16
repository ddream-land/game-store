import { KEEP_ROLE_PANEL_OPEN } from '@/constant/env'
import { ReactNode, createContext, useContext, useState } from 'react'

type AdminPanelStateType = {
  minify: boolean
}

const AdminPanelStateContext = createContext<AdminPanelStateType>({
  minify: true,
})

const SetAdminPanelStateContext = createContext<
  React.Dispatch<React.SetStateAction<AdminPanelStateType>>
>(function () {})

export function AdminPanelStateContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminPanelStateType>({
    minify: KEEP_ROLE_PANEL_OPEN ? false : true,
  })

  return (
    <AdminPanelStateContext.Provider value={state}>
      <SetAdminPanelStateContext.Provider value={setState}>
        {children}
      </SetAdminPanelStateContext.Provider>
    </AdminPanelStateContext.Provider>
  )
}

export function useAdminPanelState() {
  return useContext(AdminPanelStateContext)
}

export function useSetAdminPanelStateContext() {
  return useContext(SetAdminPanelStateContext)
}
