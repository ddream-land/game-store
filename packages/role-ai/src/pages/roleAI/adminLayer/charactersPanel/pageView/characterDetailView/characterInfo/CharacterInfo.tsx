import classes from './CharacterInfo.module.scss'
import { useTranslation } from 'react-i18next'
import NormalButton from '@/components/NormalButton/NormalButton'
import { MouseEventHandler } from 'react'
import { useCurrentCharaCardInfoChecker } from '../../useCurrentCharaCardInfoChecker'
import { DDLSplitLine } from '@ddreamland/common'

export default CharacterInfo

export type CharacterInfoProps = Readonly<{
  fullDetail?: boolean
  editCoverClicked?: MouseEventHandler
  editAvatarClicked?: MouseEventHandler
  editToneClicked?: MouseEventHandler
  editPromptClicked?: MouseEventHandler
}>

function CharacterInfo({
  fullDetail,
  editCoverClicked,
  editAvatarClicked,
  editToneClicked,
  editPromptClicked,
}: CharacterInfoProps) {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('roleAI')

  const name = charaCardInfo.card.data.name
  const creatorNotes = charaCardInfo.card.data.creator_notes
  const tags = charaCardInfo.card.data.tags

  return (
    <div
      className={`${classes.characterInfo} w-full h-full relative px-[30px] py-[23px] flex flex-col`}
    >
      <div className="h-[32px] flex flex-row justify-between">
        <div className={`${classes.name} truncate max-w-72`}>{name}</div>
        {!fullDetail && <div className={`${classes.nft} w-[111px] h-[32px] cursor-pointer`}></div>}
      </div>

      <div className={`${classes.tags} overflow-hidden w-full h-[20px] flex flex-nowrap gap-1`}>
        {tags &&
          tags.map(function (tag, index) {
            return (
              <span
                key={index}
                className="flex-none inline-block h-full leading-[20px] rounded-[10px] px-2 bg-[#27282a]"
              >
                {`${tag}`}
              </span>
            )
          })}
      </div>

      <div className={`${classes.desc} text-ellipsis overflow-hidden mt-[20px]`}>
        {creatorNotes}
      </div>

      <DDLSplitLine
        className="mt-[20px]"
        line1Color={`${fullDetail ? '#3e3f41' : undefined}`}
      ></DDLSplitLine>

      <div className={`${classes.op} mt-[20px] flex flex-row gap-5`}>
        <NormalButton className={`${classes.btn}`} onClick={editCoverClicked}>
          <div className={`w-[20px] h-[20px] ${classes.bg}`}></div>
          {tCommon('edit')}
          &nbsp;
          {t('cover')}
        </NormalButton>

        <NormalButton className={`${classes.btn}`} onClick={editAvatarClicked}>
          <div className={`w-[20px] h-[20px] ${classes.avatar}`}></div>
          {tCommon('edit')}
          &nbsp;
          {t('avatar')}
        </NormalButton>

        <NormalButton className={`${classes.btn}`} onClick={editPromptClicked}>
          <div className={`w-[20px] h-[20px] ${classes.oc}`}></div>
          {tCommon('edit')}
          &nbsp;
          {t('prompt')}
        </NormalButton>

        <NormalButton className={`${classes.btn}`} onClick={editToneClicked}>
          <div className={`w-[20px] h-[20px] ${classes.voice}`}></div>
          {tCommon('edit')}
          &nbsp;
          {tCommon('voice')}
        </NormalButton>
      </div>
    </div>
  )
}
