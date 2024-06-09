import classes from './CharacterDetailEditToneView.module.scss'
import BackButton from '@/components/backButton/BackButton'
import NormalButton from '@/components/NormalButton/NormalButton'
import { useTranslation } from 'react-i18next'
import { useCurrentCharaCardInfoChecker } from '../useCurrentCharaCardInfoChecker'
import { useNavigateBack } from '@/router/useNavigateBack'
import { useCurrentChatCharacterInfo } from '@/pages/roleAI/context/CurrentChatCharacterInfoContextProvider'
import { Switch, cn } from '@nextui-org/react'

type AutoPlaySwitchProps = Readonly<{
  isSelected: boolean
  onValueChange: (isSelected: boolean) => void
}>

function AutoPlaySwitch({ isSelected, onValueChange }: AutoPlaySwitchProps) {
  const { t: tCommon } = useTranslation('common')

  return (
    <Switch
      isSelected={isSelected}
      onValueChange={onValueChange}
      size="lg"
      className={`ml-4`}
      classNames={{
        base: cn(''),
        wrapper: cn(
          'bg-gray-300 h-11 w-24 text-black',
          'data-[selected=true]:bg-gray-100',
          'data-[selected=true]:text-black',
          'data-[selected=true]:text-xs',
          'group-data-[selected=true]:bg-gray-100',
          'group-data-[selected=true]:text-black',
          'group-data-[selected=true]:text-xs'
        ),
        thumb: cn(
          'bg-black h-9 w-12',
          'data-[selected=true]:ml-10',
          'group-data-[selected=true]:ml-10'
        ),
      }}
      startContent={
        <div
          style={{
            fontSize: '12px',
          }}
        >
          {tCommon('off')}
        </div>
      }
      endContent={
        <div
          style={{
            fontSize: '12px',
          }}
        >
          {tCommon('on')}
        </div>
      }
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <span className={`text-white`}>{tCommon('on')}</span>
        ) : (
          <span className={`text-white`}>{tCommon('off')}</span>
        )
      }
    ></Switch>
  )
}

export default CharacterDetailEditToneView

function CharacterDetailEditToneView() {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()
  const { uploadCurrentCharacterCardInfo } = useCurrentChatCharacterInfo()
  const { t: tCommon } = useTranslation('common')
  const { back } = useNavigateBack()

  async function onSave() {}

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      className={`${classes.characterDetailEditToneView} w-full h-full relative pointer-events-auto flex flex-col`}
    >
      <BackButton onClick={back}></BackButton>
      <NormalButton onClick={onSave} className={`${classes.save} absolute`} size={`small`}>
        {tCommon('save')}
      </NormalButton>

      <div className={`${classes.settings} flex flex-col mt-16 px-4`}>
        <div className={`${classes.autoPlay}`}>
          <span className={`${classes.desc}`}>{tCommon('autoPlay')}</span>
          {/* <AutoPlaySwitch></AutoPlaySwitch> */}
        </div>
      </div>
    </div>
  )
}
