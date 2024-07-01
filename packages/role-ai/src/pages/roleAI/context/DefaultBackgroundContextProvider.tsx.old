import { getDefaultBackground } from '@/api/backgrounds/backgrounds'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

const DefaultBackgroundContext = createContext<string | undefined>('')

const RefreshDefaultBackgroundContext = createContext<() => Promise<void>>(async function () {})

export function DefaultBackgroundContextProvider({ children }: { children: ReactNode }) {
  const [defaultBg, setDefaultBg] = useState<string | undefined>()

  async function refreshDefaultBg() {
    setDefaultBg('')
    const res = await getDefaultBackground()
    if (res.code === 0) {
      setDefaultBg(res.data)
    }
  }

  useEffect(function () {
    refreshDefaultBg()
  }, [])

  return (
    <DefaultBackgroundContext.Provider value={defaultBg}>
      <RefreshDefaultBackgroundContext.Provider value={refreshDefaultBg}>
        {children}
      </RefreshDefaultBackgroundContext.Provider>
    </DefaultBackgroundContext.Provider>
  )
}

export function useDefaultBackground() {
  return useContext(DefaultBackgroundContext)
}

export function useRefreshDefaultBackground() {
  return useContext(RefreshDefaultBackgroundContext)
}
