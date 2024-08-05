import { MouseEvent, WheelEvent, useEffect, useState } from 'react'
import classes from './CharacterDetailView.module.scss'
import CharacterInfo from './characterInfo/CharacterInfo'
import TabsArea from './tabsArea/TabsArea'
import BackButton from '@/components/backButton/BackButton'
import { Outlet, useNavigate } from 'react-router-dom'
import { useNavigateBack } from '@/router/useNavigateBack'
import MenuButton from '@/components/menuButton/MenuButton'
import { useMenuDialog } from './useMenuDialog'
import MenuDialog from './MenuDialog/MenuDialog'
import ChatButton from './chatButton/ChatButton'
import RenameModal from './renameModal/RenameModal'
import CallMeByModal from './callMeByModal/CallMeByModal'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setCurrentChatCharacterId } from '@/store/slices/characterSlice'
import { useCurrentAdminCharaInfoChecker } from '../useCurrentAdminCharaInfoChecker'

export default CharacterDetailView

function CharacterDetailView() {
  const { adminCharaInfo } = useCurrentAdminCharaInfoChecker()
  if (!adminCharaInfo) {
    return
  }

  const currentChatCharacterId = useAppSelector((state) => state.character.currentChatCharacterId)
  const navigate = useNavigate()
  const { t } = useTranslation('roleAI')
  const { t: tCommon } = useTranslation('common')

  const {
    menuDialogOpened,
    renameModalOpened,
    callMeByModalOpened,
    onRenameModalOpenChange,
    onCallMeByModalOpenChange,
    onRenameSave,
    onCallMeBySave,
    openMenuDialog,
    renameClicked,
    callMeByClicked,
    linkToWorldBookClicked,
    exportClicked,
    deleteClicked,
  } = useMenuDialog()

  const userInfo = useAppSelector((state) => state.userInfo.info)
  const dispatch = useAppDispatch()

  function setCurrentChatId(id: string) {
    dispatch(setCurrentChatCharacterId(id))
  }

  const avatarUrl = adminCharaInfo.pngUrlOrBase64
    ? `${adminCharaInfo.pngUrlOrBase64}`
    : '/imgs/default-avatar3.png'

  const [fullDetail, setFullDetail] = useState(false)

  const { back } = useNavigateBack()

  function editPromptClicked() {
    navigate(`editPrompt`)
  }

  function editAvatartClicked() {
    navigate(`editAvatar`)
  }

  function editCoverClicked() {
    navigate(`editCover`)
  }

  function editToneClicked() {
    navigate(`editTone`)
  }

  function wheel(e: WheelEvent<HTMLDivElement>) {
    if (e.deltaY > 0) {
      setFullDetail(true)
    } else {
      setFullDetail(false)
    }
  }

  return (
    <div onWheel={wheel} className={`${classes.characterDetailView} w-full h-full relative`}>
      <RenameModal
        isOpen={renameModalOpened}
        onOpenChange={onRenameModalOpenChange}
        onSave={onRenameSave}
      ></RenameModal>

      <CallMeByModal
        isOpen={callMeByModalOpened}
        onOpenChange={onCallMeByModalOpenChange}
        onSave={onCallMeBySave}
      ></CallMeByModal>

      <div
        className={`${classes.lifeImg} absolute top-0 w-full bg-center bg-no-repeat bg-cover`}
        style={{
          backgroundColor: `rgba(120, 120, 120, 1)`,
          backgroundImage: `url('${avatarUrl}')`,
        }}
      >
        {/* <img src={avatarUrl} className="w-full h-full" /> */}
      </div>

      <div
        className={`${classes.lifeDetail} ${
          fullDetail ? classes.full : ''
        } absolute bottom-0 w-full flex flex-col`}
      >
        <div className={`${classes.info} flex-none z-0`}>
          <CharacterInfo
            fullDetail={fullDetail}
            editCoverClicked={editCoverClicked}
            editPromptClicked={editPromptClicked}
            editAvatarClicked={editAvatartClicked}
            editToneClicked={editToneClicked}
          ></CharacterInfo>
        </div>
        <div className={`${classes.tabs} flex-1 z-0 overflow-hidden`}>
          <TabsArea fullDetail={fullDetail}></TabsArea>
        </div>
      </div>

      <div className={`${classes.shadow} absolute top-[0px] left-[0px] right-[0px] h-[88px]`}></div>

      <BackButton onClick={back} className=""></BackButton>

      {fullDetail && (
        <div className="absolute text-[#C0C0C0] text-[14px] font-[400] h-[34px] top-[24px] left-1/2 -translate-x-1/2 flex items-center">
          {`${t('callMeBy')}: ${
            adminCharaInfo.card.data.extensions.nuwa_call_me_by?.name ?? userInfo.name
          }`}
        </div>
      )}

      {!fullDetail &&
        (currentChatCharacterId === adminCharaInfo.id ? (
          <div
            className={`absolute top-[212px] right-[40px] text-[#fff] text-center font-[600] leading-[12px] h-[34px] w-[98px] bg-[#5DC66F] rounded-[13px] flex flex-row justify-center items-center`}
          >
            <span className="ml-1">{tCommon('chatting')}</span>
          </div>
        ) : (
          <ChatButton
            onClick={() => setCurrentChatId(adminCharaInfo.id)}
            className="absolute top-[212px] right-[40px]"
          ></ChatButton>
        ))}

      <MenuButton
        onClick={openMenuDialog}
        className={`${classes.menuBtn} absolute top-[20px] right-[20px]`}
      ></MenuButton>

      {menuDialogOpened && (
        <MenuDialog
          onRenameClicked={renameClicked}
          onDeleteClicked={deleteClicked}
          onExportClicked={exportClicked}
          onLinkToWorldBookClicked={linkToWorldBookClicked}
          onCallMeByClicked={callMeByClicked}
        ></MenuDialog>
      )}

      <Outlet></Outlet>
    </div>
  )
}
