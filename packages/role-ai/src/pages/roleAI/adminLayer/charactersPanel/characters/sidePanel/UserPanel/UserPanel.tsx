import { useTranslation } from 'react-i18next'
import classes from './UserPanel.module.scss'

type UserPanelProps = {
  className?: string
}

export default function UserPanel({ className }: UserPanelProps) {
  const { t: tCommon } = useTranslation('common')

  const userAvatar = `/imgs/default-user.png`
  const username = 'Username'
  const usertype = 'Power user'
  const userExpire = '120 days left'
  const token = 500

  return (
    <div
      className={`${classes.userPanel} ${className} cursor-default absolute top-0 left-[46px] w-[300px] h-[262px] z-10 rounded-[10px] p-[20px] flex flex-col justify-between`}
    >
      <div className={`${classes.user} w-full h-[46px] flex flex-row`}>
        <div
          className={`${classes.avatar}`}
          style={{
            background: `url('${userAvatar}')`,
          }}
        ></div>
        <div className={`ml-[10px] py-[6px] flex-1 overflow-hidden flex flex-col justify-between`}>
          <div className={`${classes.username} flex flex-row items-center`}>
            <span className={`${classes.name} truncate`}>{username}</span>
            <span className={`${classes.flag} flex-none`}></span>
          </div>
          <div className={`${classes.info} flex flex-row items-center`}>
            <span className={`${classes.type}`}>{usertype}</span>
            <div className={`w-[1px] h-[4px] bg-[#36383E] mx-1`}></div>
            <span className={`${classes.expire}`}>{` ${userExpire}`}</span>
          </div>
        </div>
      </div>
      <div
        className={`${classes.balance} w-full h-[98px] bg-[#5B61FF] px-[14px] py-[10px] flex flex-col justify-between`}
      >
        <div className={`${classes.title}`}>{tCommon('balance')}</div>
        <div className={`${classes.op} flex flex-row justify-between items-end`}>
          <div>
            <span className={`${classes.token}`}>{token}</span>
            <span className={`${classes.icon} ml-2 inline-block w-[14px] h-[14px]`}></span>
          </div>
          <div
            className={`${classes.topUp} w-[72px] h-[24px] rounded-[36px] cursor-pointer text-white flex justify-center items-center`}
          >
            {tCommon('topUp')}
          </div>
        </div>
      </div>
      <div
        className={`${classes.logout} cursor-pointer w-full h-[40px] rounded-[20px] flex justify-center items-center`}
      >
        {tCommon('logout')}
      </div>
    </div>
  )
}
