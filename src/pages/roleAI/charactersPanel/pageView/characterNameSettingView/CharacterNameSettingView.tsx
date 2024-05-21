import { useEffect, useRef, useState } from 'react'
import classes from './CharacterNameSettingView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useTranslation } from 'react-i18next'
import { useCurrentCharaCardInfoChecker } from '../useCurrentCharaCardInfoChecker'
import { useNavigateBack } from '@/router/useNavigateBack'
import toast from 'react-hot-toast'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { useCurrentCharacterCardInfo } from '@/pages/roleAI/context/CurrentCharacterCardInfoContextProvider'
import { isString } from '@/libs/isTypes'
import { cloneDeep } from 'lodash'
import { Input, cn } from '@nextui-org/react'

export default CharacterNameSettingView

function CharacterNameSettingView() {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()
  const [currentCharaCardData, setCurrentCharaCardData] = useState(
    cloneDeep(charaCardInfo.card.data)
  )
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(function () {
    inputRef.current && inputRef.current.focus()
  }, [])

  const { uploadCurrentCharacterCardInfo } = useCurrentCharacterCardInfo()
  const { t: tCommon } = useTranslation('common')
  const { back } = useNavigateBack()

  const avatarUrl = charaCardInfo.pngUrlOrBase64 ?? '/imgs/default-avatar3.png'

  async function onNameChange(val: string) {
    setCurrentCharaCardData({
      ...currentCharaCardData,
      name: val,
    })
  }

  async function onSave() {
    const id = toast.loading(tCommon('loading'))

    const newCard: CharacterCardV2 = {
      spec: charaCardInfo.card.spec,
      spec_version: charaCardInfo.card.spec_version,
      data: {
        ...charaCardInfo.card.data,
        ...currentCharaCardData,
      },
    }
    try {
      await uploadCurrentCharacterCardInfo(newCard)
      toast.success(tCommon('opSuccess'), {
        id: id,
      })
    } catch (err: any) {
      const msg = err?.message
      toast.error(isString(msg) ? msg : tCommon('opFailed'), {
        id: id,
      })
    }
  }

  return (
    <div className={`${classes.characterNameSettingView} w-full h-full relative bg-white`}>
      <div
        className={`${classes.charaImg} absolute top-0 w-full bg-center bg-no-repeat bg-cover`}
        style={{
          backgroundImage: `url(${avatarUrl})`,
        }}
      ></div>

      <div className={`${classes.detail}  absolute bottom-0 w-full flex flex-col`}>
        <div className={`${classes.top} h-full flex flex-row justify-between`}>
          <div className={`${classes.name} flex-none z-0`}>
            <Input
              ref={inputRef}
              value={currentCharaCardData.name}
              onValueChange={onNameChange}
              className="max-w-xs"
              classNames={{
                input: cn(
                  'bg-transparent',
                  'data-[focus=true]:bg-transparent',
                  'group-data-[focus=true]:bg-transparent',
                  'data-[hover=true]:bg-transparent',
                  'group-data-[hover=true]:bg-transparent',
                  'data-[has-value=true]:text-white',
                  'group-data-[has-value=true]:text-white'
                ),
                innerWrapper: cn(
                  'bg-transparent',
                  'data-[focus=true]:bg-transparent',
                  'group-data-[focus=true]:bg-transparent',
                  'data-[hover=true]:bg-transparent',
                  'group-data-[hover=true]:bg-transparent'
                ),
                inputWrapper: cn(
                  'bg-transparent',
                  'data-[focus=true]:bg-transparent',
                  'group-data-[focus=true]:bg-transparent',
                  'data-[hover=true]:bg-transparent',
                  'group-data-[hover=true]:bg-transparent'
                ),
              }}
            />
          </div>
          <div className={`${classes.editFlag}`}></div>
        </div>
      </div>

      <BackButton onClick={back}></BackButton>

      <NormalButton onClick={onSave} className={`${classes.save} absolute`} size={`small`}>
        {tCommon('save')}
      </NormalButton>
    </div>
  )
}
