import BackButton from '@/components/backButton/BackButton'
import { useTranslation } from 'react-i18next'
import { useNavigateBack } from '@/router/useNavigateBack'
import { DDLSplitLine } from '@ddreamland/common'
import { Image, Button } from '@nextui-org/react'
import { MouseEvent, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { refreshDefaultBg } from '@/store/slices/defaultBackground'

export default SettingsView

function SettingsView() {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')
  const { back } = useNavigateBack()
  const navigate = useNavigate()
  const { defaultBg } = useAppSelector((state) => state.defaultBackground)
  const dispatch = useAppDispatch()

  const [clear, setClear] = useState({
    loading: false,
    showCleared: false,
  })

  function gotoBgSelect() {
    navigate(`bg`)
  }

  function clearCache(e: MouseEvent) {
    setClear({
      loading: true,
      showCleared: false,
    })

    setTimeout(() => {
      setClear({
        loading: false,
        showCleared: true,
      })
    }, Math.random() * 1000 + 500)
  }

  useEffect(function () {
    dispatch(refreshDefaultBg())
  }, [])

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      className={` w-full h-full relative pointer-events-auto flex flex-col bg-[#121315] rounded-[12px]`}
    >
      <BackButton onClick={back}></BackButton>

      <div className="absolute text-[#fff] h-[34px] top-[24px] left-1/2 -translate-x-1/2">
        {tCommon('setting')}
      </div>

      <div className={`pt-[78px] h-full w-full flex flex-col overflow-hidden`}>
        <DDLSplitLine className="flex-none"></DDLSplitLine>

        <div className="p-[24px] w-full h-full flex flex-col justify-between">
          <div>
            <div className="w-full text-[#EEEFF1] text-[16px] font-[400]">{t('defaultBg')}</div>

            <div className="w-full h-[156px] flex justify-center items-center mt-[24px] relative">
              <Image
                src={defaultBg}
                fallbackSrc="/imgs/default-bg.jpg"
                className="w-[279px] h-[156px] bg-cover object-cover overflow-hidden rounded-[8px] border-1 border-[#232323] z-0"
                classNames={{
                  wrapper: 'z-0',
                }}
              ></Image>

              <div className="absolute inset-0 flex justify-center items-center opacity-0 hover:opacity-100 bg-transparent">
                <Button
                  onClick={gotoBgSelect}
                  className="bg-[#ffffff33] text-[#fff] rounded-[36px] h-[32px] w-[85px]"
                >
                  {tCommon('edit')}
                </Button>
              </div>
            </div>

            <div className="w-full text-[#EEEFF1] text-[16px] font-[400] mt-[30px]">
              {tCommon('community')}
            </div>

            <div className="w-full flex justify-between items-center gap-4 mt-[24px]">
              <Button className="flex-1 h-[46px] rounded-[8px] bg-[#333333] flex justify-center items-center">
                <Image src="/imgs/logo-x.png" className="w-[28px] h-[28px]"></Image>
              </Button>
              <Button className="flex-1 h-[46px] rounded-[8px] bg-[#5A64EA] flex justify-center items-center">
                <Image src="/imgs/logo-discord.png" className="w-[28px] h-[28px]"></Image>
              </Button>
              <Button className="flex-1 h-[46px] rounded-[8px] bg-[#5D7AB0] flex justify-center items-center">
                <Image src="/imgs/logo-telegram.png" className="w-[28px] h-[28px]"></Image>
              </Button>
            </div>

            <DDLSplitLine className="flex-none mt-[24px]"></DDLSplitLine>
          </div>

          <div className="w-full h-[62px] bg-[#1C1E22] rounded-[8px] border-1 border-[#232323] flex flex-row items-center justify-between px-[18px]">
            <div className="text-[#a4a5a7] text-[16px] font-[500]">{tCommon('clearCache')}</div>
            <Button
              onClick={clearCache}
              isLoading={clear.loading}
              disabled={clear.showCleared}
              className={`${
                clear.showCleared ? 'text-[#5DC66F]' : 'text-[#C0C0C0]'
              } text-[14px] font-[500] bg-[#ffffff10] w-[81px] h-[40px] rounded-[10px]`}
            >
              {clear.showCleared ? tCommon('cleared') : tCommon('clear')}
            </Button>
          </div>
        </div>
      </div>

      <Outlet></Outlet>
    </div>
  )
}
