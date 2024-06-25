import { ReactNode } from 'react'
import { CharacterInfoListContextProvider } from './CharacterInfoListContextProvider'
import { CurrentChatCharacterIdContextProvider } from './CurrentChatCharacterIdContextProvider'
import { CurrentChatCharacterInfoContextProvider } from './CurrentChatCharacterInfoContextProvider'
import { CurrentAdminCharacterIdContextProvider } from './CurrentAdminCharacterIdContextProvider'
import { CurrentAdminCharacterInfoContextProvider } from './CurrentAdminCharacterInfoContextProvider'
import { ChatHistoryContextProvider } from './ChatHistoryContextProvider'
import { TTSContextProvider } from './TTSContextProvider'
import { Live2dExtensionContextProvider } from './Live2dExtensionContextProvider'
import { AdminPanelStateContextProvider } from './AdminPanelStateContextProvider'
import { UserInfoContextProvider } from './UserInfoContextProvider'

export function RoleAIContextProvider({ children }: { children: ReactNode }) {
  return (
    <UserInfoContextProvider>
      <Live2dExtensionContextProvider>
        <CharacterInfoListContextProvider>
          <CurrentChatCharacterIdContextProvider>
            <CurrentAdminCharacterIdContextProvider>
              <CurrentChatCharacterInfoContextProvider>
                <CurrentAdminCharacterInfoContextProvider>
                  <ChatHistoryContextProvider>
                    <TTSContextProvider>
                      <AdminPanelStateContextProvider>{children}</AdminPanelStateContextProvider>
                    </TTSContextProvider>
                  </ChatHistoryContextProvider>
                </CurrentAdminCharacterInfoContextProvider>
              </CurrentChatCharacterInfoContextProvider>
            </CurrentAdminCharacterIdContextProvider>
          </CurrentChatCharacterIdContextProvider>
        </CharacterInfoListContextProvider>
      </Live2dExtensionContextProvider>
    </UserInfoContextProvider>
  )
}
