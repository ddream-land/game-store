import { MutableRefObject, ReactNode, createContext, useContext, useRef, useState } from 'react'
import { Live2dExtensionManager } from '../live2dExtension/Live2dExtensionManager'

const Live2dExtensionManagerContext = createContext<
  MutableRefObject<Live2dExtensionManager | undefined>
>({
  current: undefined,
})
const SetLive2dExtensionManagerContext = createContext<
  (manager: Live2dExtensionManager | undefined) => void
>(function (manager: Live2dExtensionManager | undefined) {})

export function Live2dExtensionContextProvider({ children }: { children: ReactNode }) {
  const live2dExtensionManager = useRef<Live2dExtensionManager | undefined>(undefined)
  function setLive2dExtensionManager(manager: Live2dExtensionManager | undefined) {
    live2dExtensionManager.current = manager
  }

  return (
    <Live2dExtensionManagerContext.Provider value={live2dExtensionManager}>
      <SetLive2dExtensionManagerContext.Provider value={setLive2dExtensionManager}>
        {children}
      </SetLive2dExtensionManagerContext.Provider>
    </Live2dExtensionManagerContext.Provider>
  )
}

export function useLive2dExtension() {
  const managerRef = useContext(Live2dExtensionManagerContext)

  return { managerRef }
}

export function useSetLive2dExtension() {
  const setLive2dExtensionManager = useContext(SetLive2dExtensionManagerContext)

  return {
    setLive2dExtensionManager,
  }
}
