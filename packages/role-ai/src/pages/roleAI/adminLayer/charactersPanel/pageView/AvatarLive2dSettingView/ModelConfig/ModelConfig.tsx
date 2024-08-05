import classes from './ModelConfig.module.scss'
import {
  Select,
  SelectItem,
  SelectSection,
  Slider,
  SliderValue,
  Switch,
  cn,
} from '@nextui-org/react'
import { useLive2dExtension } from '@/pages/roleAI/context/Live2dExtensionContextProvider'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MOTION_GROUP_INDEX_SPERATOR } from '@/core/characterCard/constant'
import { useCurrentAdminCharaInfoChecker } from '../../useCurrentAdminCharaInfoChecker'
import toast from 'react-hot-toast'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { isString } from '@/libs/isTypes'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { uploadCurrentAdminCharaInfo } from '@/store/slices/characterSlice'

export default ModelConfig

function ModelConfig() {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  if (!adminCharaInfo) {
    return
  }

  const { managerRef } = useLive2dExtension()
  const { t } = useTranslation('roleAI')
  const { t: tCommon } = useTranslation('common')
  const dispatch = useAppDispatch()

  async function uploadCurrAdminCharaInfo(card: CharacterCardV2, avatar?: File) {
    await dispatch(uploadCurrentAdminCharaInfo({ card, avatar }))
  }

  let cardClickMotionKey: string[] = []
  const cardClickMotion = adminCharaInfo.card.data.extensions.nuwa_avatar?.clickMotion
  if (cardClickMotion) {
    cardClickMotionKey = [
      `${
        cardClickMotion.groupName
      }${MOTION_GROUP_INDEX_SPERATOR}${cardClickMotion.index.toString()}`,
    ]
  }
  let cardStartMotionKey: string[] = []
  const cardStartMotion = adminCharaInfo.card.data.extensions.nuwa_avatar?.startMotion
  if (cardStartMotion) {
    cardStartMotionKey = [
      `${
        cardStartMotion.groupName
      }${MOTION_GROUP_INDEX_SPERATOR}${cardStartMotion.index.toString()}`,
    ]
  }

  const [clickMotionSelectedKeys] = useState(cardClickMotionKey)
  const [startMotionSelectedKeys] = useState(cardStartMotionKey)

  const modelIds = managerRef.current?.modelIds
  const id = modelIds && modelIds[0]

  let live2dFollowCursor: boolean = false
  if (managerRef.current && id) {
    live2dFollowCursor = managerRef.current.getFollowCursor(id) ?? false
  }

  const motions: {
    groupName: string
    children: {
      name: string
      index: number
    }[]
  }[] = []
  if (managerRef.current && id) {
    const modelMotions = managerRef.current.getMotions(id)
    if (modelMotions) {
      modelMotions.forEach(function (modelMotion) {
        motions.push({
          groupName: modelMotion.groupName,
          children: modelMotion.motions.map(function (motion, index) {
            return {
              name: motion.file,
              index,
            }
          }),
        })
      })
    }
  }

  async function clickMotionSelectionChange(key?: { currentKey?: string }) {
    if (!key || !key.currentKey) {
      return
    }

    const [groupName, indexStr] = key.currentKey.split(MOTION_GROUP_INDEX_SPERATOR)
    await saveMotionChange(groupName, Number(indexStr), 'click')
    if (managerRef.current && id) {
      managerRef.current.setTapMotion(id, groupName, Number(indexStr))
    }
  }

  async function startMotionSelectionChange(key?: { currentKey?: string }) {
    if (!key || !key.currentKey) {
      return
    }

    const [groupName, indexStr] = key.currentKey.split(MOTION_GROUP_INDEX_SPERATOR)
    await saveMotionChange(groupName, Number(indexStr), 'start')
  }

  async function saveMotionChange(groupName: string, index: number, type: 'click' | 'start') {
    const currentNuwaAvatar = adminCharaInfo?.card.data.extensions.nuwa_avatar
    if (!currentNuwaAvatar) {
      return
    }

    const id = toast.loading(tCommon('loading'))
    try {
      const nuwaAvatarExtension = {
        nuwa_avatar: {
          ...currentNuwaAvatar,
        },
      }
      switch (type) {
        case 'click': {
          nuwaAvatarExtension.nuwa_avatar.clickMotion = {
            groupName: groupName,
            index: index,
          }
          break
        }
        case 'start': {
          nuwaAvatarExtension.nuwa_avatar.startMotion = {
            groupName: groupName,
            index: index,
          }
          break
        }
      }

      const newCard: CharacterCardV2 = {
        spec: adminCharaInfo.card.spec,
        spec_version: adminCharaInfo.card.spec_version,
        data: {
          ...adminCharaInfo.card.data,
          extensions: {
            ...adminCharaInfo.card.data.extensions,
            ...nuwaAvatarExtension,
          },
        },
      }

      await uploadCurrAdminCharaInfo(newCard)
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

  const [followCursor, setFollowCursor] = useState(live2dFollowCursor)
  async function onFollowCursorChange(isSelected: boolean) {
    setFollowCursor(isSelected)
    managerRef.current?.setFollowCursor(id, isSelected)
  }

  return (
    <div className={`${classes.modelConfig} w-full flex flex-col mt-8`}>
      <div
        className={`w-full flex flex-row justify-between items-center px-4 h-[62px] bg-[#1C1E22] rounded-[8px] border-1 border-[#232323]`}
      >
        <div className={`text-[#a4a5a7] flex-none`}>{t('live2dFollowCursor')}</div>
        <div className={`flex-none`}>
          <Switch
            isSelected={followCursor}
            onValueChange={onFollowCursorChange}
            aria-label="Follow cursor"
            classNames={{
              wrapper: cn(''),
              thumb: cn(''),
            }}
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <div className={`${className} w-[6px] h-[6px] rounded-full bg-[#2E6EE6]`}></div>
              ) : (
                <div className={`${className} w-[6px] h-[6px] rounded-full bg-[#CDD0D5]`}></div>
              )
            }
          />
        </div>
      </div>

      {/* <div className={`${classes.row} w-full flex flex-row mt-16 justify-between`}>
        <div className={`${classes.desc} flex-none`}>{t('live2dLipSync')}</div>
        <div className={`${classes.slider} flex-none px-4`}>
          <Switch
            defaultSelected
            aria-label="Mouth"
            classNames={{
              wrapper: cn(
                'bg-gray-300',
                'data-[selected=true]:bg-gray-100',
                'group-data-[selected=true]:bg-gray-100'
              ),
              thumb: cn('bg-black'),
            }}
          />
        </div>
      </div> */}

      <div
        className={`mt-[16px] w-full flex flex-row justify-between items-center px-4 h-[62px] bg-[#1C1E22] rounded-[8px] border-1 border-[#232323]`}
      >
        <div className={`text-[#a4a5a7] flex-none`}>{t('live2dClickAnimation')}</div>

        <div className={`w-[322px] flex-none px-4`}>
          <Select
            defaultSelectedKeys={clickMotionSelectedKeys}
            //@ts-ignore
            onSelectionChange={clickMotionSelectionChange}
            selectionMode="single"
            radius="md"
            aria-label="Motions"
            className="w-full text-[#C0C0C0]"
          >
            {motions.map(function (m) {
              return (
                <SelectSection
                  className="text-[#C0C0C0]"
                  key={m.groupName}
                  showDivider
                  title={m.groupName}
                >
                  {m.children.map(function (c) {
                    return (
                      <SelectItem key={`${m.groupName}${MOTION_GROUP_INDEX_SPERATOR}${c.index}`}>
                        {c.name}
                      </SelectItem>
                    )
                  })}
                </SelectSection>
              )
            })}
          </Select>
        </div>
      </div>

      <div
        className={`mt-[16px] w-full flex flex-row justify-between items-center px-4 h-[62px] bg-[#1C1E22] rounded-[8px] border-1 border-[#232323]`}
      >
        <div className={`text-[#a4a5a7] flex-none`}>{t('live2dStartAnimation')}</div>

        <div className={`w-[322px] flex-none px-4`}>
          <Select
            defaultSelectedKeys={startMotionSelectedKeys}
            //@ts-ignore
            onSelectionChange={startMotionSelectionChange}
            selectionMode="single"
            radius="md"
            aria-label="Motions"
            className="w-full text-[#C0C0C0]"
          >
            {motions.map(function (m) {
              return (
                <SelectSection
                  className="text-[#C0C0C0]"
                  key={m.groupName}
                  showDivider
                  title={m.groupName}
                >
                  {m.children.map(function (c) {
                    return (
                      <SelectItem key={`${m.groupName}${MOTION_GROUP_INDEX_SPERATOR}${c.index}`}>
                        {c.name}
                      </SelectItem>
                    )
                  })}
                </SelectSection>
              )
            })}
          </Select>
        </div>
      </div>
    </div>
  )
}
