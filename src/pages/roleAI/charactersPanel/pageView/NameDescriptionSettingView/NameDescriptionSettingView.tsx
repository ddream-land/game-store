import { useState } from 'react'
import classes from './NameDescriptionSettingView.module.scss'
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
import { Input, Textarea, cn } from '@nextui-org/react'

export default NameDescriptionSettingView

function NameDescriptionSettingView() {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()
  const [currentCharaCardData, setCurrentCharaCardData] = useState(
    cloneDeep(charaCardInfo.card.data)
  )

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

  async function onDescChange(val: string) {
    setCurrentCharaCardData({
      ...currentCharaCardData,
      description: val,
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
    <div className={`${classes.nameDescriptionSettingView} w-full h-full relative`}>
      <div
        className={`${classes.charaImg} absolute top-0 w-full bg-center bg-no-repeat bg-cover`}
        style={{
          backgroundImage: `url(${avatarUrl})`,
        }}
      ></div>

      <div className={`${classes.detail}  absolute bottom-0 w-full flex flex-col`}>
        <div className={`${classes.top} flex flex-row justify-between`}>
          <div className={`${classes.name} flex-none z-0`}>
            <Input
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

        <div className={`${classes.desc} flex-1 z-0 overflow-hidden flex flex-col`}>
          <div className={`${classes.title} flex-none`}>{`${tCommon('description')}(${tCommon(
            'optional'
          )})`}</div>
          <div className={`${classes.line} flex-none`}></div>
          <div className={`${classes.content} flex-1`}>
            <Textarea
              value={currentCharaCardData.description}
              onValueChange={onDescChange}
              disableAutosize={true}
              className={`${classes.textarea} h-full w-full`}
              classNames={{
                input: 'scrollbar-override',
              }}
            />
          </div>
        </div>
      </div>

      <BackButton onClick={back}></BackButton>

      <NormalButton onClick={onSave} className={`${classes.save} absolute`} size={`small`}>
        {tCommon('save')}
      </NormalButton>
    </div>
  )
}
