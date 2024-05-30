import { useState, useEffect } from 'react'

function getStorageValue<T = any>(
  key: string,
  defaultValue: T
): T {
  const valStr = localStorage.getItem(key)
  let initial: T | undefined = undefined
  if (valStr) {
    initial = JSON.parse(valStr)
  }
  return initial || defaultValue
}

export function useLocalStorage<T = any>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(function () {
    return getStorageValue(key, defaultValue)
  })

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value))
    },
    [key, value]
  )

  return [value, setValue]
}
