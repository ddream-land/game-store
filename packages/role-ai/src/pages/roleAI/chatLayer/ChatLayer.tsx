import { useSelector } from 'react-redux'
import ChatLayout from './chatLayout/ChatLayout'
import ChatPanel from './chatPanel/ChatPanel'
import { useAppStore } from '@/hooks/useAppStore'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { resetts, reset } from '@/store/slices/userInfoSlice'

export default function ChatLayer() {
  const store = useAppStore()
  const userInfo = useAppSelector((state) => state.userInfo)
  const dispatch = useAppDispatch()

  dispatch(resetts(undefined))
  dispatch(reset())

  return <ChatLayout chatArea={<ChatPanel></ChatPanel>}></ChatLayout>
}
