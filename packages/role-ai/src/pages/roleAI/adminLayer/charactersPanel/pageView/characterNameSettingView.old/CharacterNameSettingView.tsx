import { useEffect, useRef, useState } from 'react'
import classes from './CharacterNameSettingView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useTranslation } from 'react-i18next'
import { useCurrentAdminCharaInfoChecker } from '../useCurrentAdminCharaInfoChecker'
import { useNavigateBack } from '@/router/useNavigateBack'
import toast from 'react-hot-toast'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { isString } from '@/libs/isTypes'
import { cloneDeep } from 'lodash'
import { Input, cn } from '@nextui-org/react'
import { useCurrentAdminCharacterInfo } from '@/pages/roleAI/context/CurrentAdminCharacterInfoContextProvider'

export default CharacterNameSettingView

function CharacterNameSettingView() {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  const [currentCharaCardData, setCurrentCharaCardData] = useState(
    cloneDeep(adminCharaInfo.card.data)
  )
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(function () {
    inputRef.current && inputRef.current.focus()
  }, [])

  const { uploadCurrentAdminCharaInfo } = useCurrentAdminCharacterInfo()
  const { t: tCommon } = useTranslation('common')
  const { back } = useNavigateBack()

  const avatarUrl = adminCharaInfo.pngUrlOrBase64 ?? '/imgs/default-avatar3.png'

  async function onNameChange(val: string) {
    setCurrentCharaCardData({
      ...currentCharaCardData,
      name: val,
    })
  }

  async function onSave() {
    const id = toast.loading(tCommon('loading'))

    const newCard: CharacterCardV2 = {
      spec: adminCharaInfo.card.spec,
      spec_version: adminCharaInfo.card.spec_version,
      data: {
        ...adminCharaInfo.card.data,
        ...currentCharaCardData,
      },
    }
    try {
      await uploadCurrentAdminCharaInfo(newCard)
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
