import { ReactNode } from 'react'
import { TTSSchedulerProvider } from './TTSSchedulerProvider'
import { Live2dExtensionContextProvider } from './Live2dExtensionContextProvider'
import { UserManagerContextProvider } from './UserManagerContextProvider'
import { GlobalContextProvider } from './GlobalContextProvider'

export function RoleAIContextProvider({ children }: { children: ReactNode }) {
  return (
    <UserManagerContextProvider>
      <GlobalContextProvider>
        <Live2dExtensionContextProvider>
          <TTSSchedulerProvider>{children}</TTSSchedulerProvider>
        </Live2dExtensionContextProvider>
      </GlobalContextProvider>
    </UserManagerContextProvider>
  )
}
