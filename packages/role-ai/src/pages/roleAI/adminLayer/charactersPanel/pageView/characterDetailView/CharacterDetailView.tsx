import { MouseEvent, WheelEvent, useEffect, useState } from 'react'
import classes from './CharacterDetailView.module.scss'
import CharacterInfo from './characterInfo/CharacterInfo'
import TabsArea from './tabsArea/TabsArea'
import BackButton from '@/components/backButton/BackButton'
import { Outlet, useNavigate } from 'react-router-dom'
import { useNavigateBack } from '@/router/useNavigateBack'
import { useCurrentAdminCharacterInfo } from '@/pages/roleAI/context/CurrentAdminCharacterInfoContextProvider'
import MenuButton from '@/components/menuButton/MenuButton'
import { useMenuDialog } from './useMenuDialog'
import MenuDialog from './MenuDialog/MenuDialog'
import ChatButton from './chatButton/ChatButton'

export default CharacterDetailView

function CharacterDetailView() {
  const navigate = useNavigate()
  const { charaCardInfo } = useCurrentAdminCharacterInfo()
  const {
    menuDialogOpened,
    openMenuDialog,
    renameClicked,
    linkToWorldBookClicked,
    exportClicked,
    deleteClicked,
  } = useMenuDialog()

  useEffect(function () {
    if (!charaCardInfo) {
      navigate(`/`)
    }
  }, [])

  if (!charaCardInfo) {
    return
  }

  const avatarUrl = charaCardInfo.pngUrlOrBase64
    ? `${charaCardInfo.pngUrlOrBase64}/w512`
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

      {!fullDetail && <ChatButton className="absolute top-[212px] right-[40px]"></ChatButton>}

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
        ></MenuDialog>
      )}

      <Outlet></Outlet>
    </div>
  )
}
