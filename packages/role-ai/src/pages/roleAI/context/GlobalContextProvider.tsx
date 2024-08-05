import { ReactNode, useEffect, useState } from 'react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { stop } from '@/store/slices/ttsSlice'
import { heart } from '@/api/heart/heart'
import { BalanceType, DDLPay } from '@ddreamland/common'
import { useTranslation } from 'react-i18next'
import { setDdreamTokenPayIsOpen, setPowerExchangePayIsOpen } from '@/store/slices/uiSlice'
import { useDisclosure } from '@nextui-org/react'

let heartTimer: number | undefined = undefined

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const currentChatId = useAppSelector((state) => state.character.currentChatCharacterId)
  const ddreamTokenPayIsOpen = useAppSelector((state) => state.ui.ddreamTokenPayIsOpen)
  const powerExchangePayIsOpen = useAppSelector((state) => state.ui.powerExchangePayIsOpen)

  const [ddreamTokenPayIsOpenState, setDdreamTokenPayIsOpenState] = useState(false)
  const [powerExchangePayIsOpenState, setPowerExchangePayIsOpenState] = useState(false)

  function onDDreamTokenPayOpenChange(isOpen: boolean) {
    dispatch(setDdreamTokenPayIsOpen(isOpen))
  }

  function onPowerExchangePayOpenChange(isOpen: boolean) {
    dispatch(setPowerExchangePayIsOpen(isOpen))
  }

  function onNotHaveEnoughDDreamToken() {
    dispatch(setPowerExchangePayIsOpen(false))
    dispatch(setDdreamTokenPayIsOpen(true))
  }

  async function refreshHeart() {
    heartTimer && window.clearInterval(heartTimer)
    heartTimer = window.setInterval(async () => {
      await heart()
    }, 30000)
  }

  useEffect(
    function () {
      setDdreamTokenPayIsOpenState(ddreamTokenPayIsOpen)
    },
    [ddreamTokenPayIsOpen]
  )

  useEffect(
    function () {
      setPowerExchangePayIsOpenState(powerExchangePayIsOpen)
    },
    [powerExchangePayIsOpen]
  )

  useEffect(
    function () {
      if (!currentChatId) {
        dispatch(stop())
      }
    },
    [currentChatId]
  )

  useEffect(function () {
    refreshHeart()

    return function () {
      heartTimer && window.clearInterval(heartTimer)
    }
  }, [])

  return (
    <>
      {children}

      <DDLPay
        isOpen={ddreamTokenPayIsOpenState}
        onOpenChange={onDDreamTokenPayOpenChange}
        lang={i18n.language as 'en' | 'zh-CN'}
      />

      <DDLPay
        isOpen={powerExchangePayIsOpenState}
        onOpenChange={onPowerExchangePayOpenChange}
        lang={i18n.language as 'en' | 'zh-CN'}
        balanceType={BalanceType.Power}
        onNotHaveEnoughDDreamToken={onNotHaveEnoughDDreamToken}
      />
    </>
  )
}
