import { NuwaChatMessage } from '@/core/ChatMessage'
import classes from './UserMsg.module.scss'

export default UserMsg

type UserMsgProps = Readonly<{
  msg: NuwaChatMessage
}>

function UserMsg({ msg }: UserMsgProps) {
  return (
    <div className={`${classes.userMsg} w-full flex flex-row-reverse relative`}>
      <div className={`${classes.content} w-full`}>{msg.content}</div>
    </div>
  )
}
