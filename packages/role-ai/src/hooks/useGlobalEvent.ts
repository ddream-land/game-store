import { useEffect } from 'react'

export function useGlobalEvent<K extends keyof DocumentEventMap>(type: K, listener: () => void) {
  useEffect(function () {
    document.addEventListener(type, listener)

    return function () {
      document.removeEventListener(type, listener)
    }
  }, [])
}
