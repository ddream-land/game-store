import classes from './user-area.module.scss'

interface UserAreaProps {
  username: string
  onModifyInfoClick?: () => void
  onModifySysSettingClick?: () => void
}

export default function UserArea({
  username,
  onModifyInfoClick,
  onModifySysSettingClick,
}: UserAreaProps) {
  return (
    <div className={`${classes['user-area']} flex flex-row items-center`}>
      <div className="flex-1 flex flex-row items-center">
        <div className={`${classes['avatar']}`}></div>
        <div className={`${classes['username']}`}>{username}</div>
      </div>
      <div className="flex-none flex flex-row items-center">
        <div
          onClick={onModifyInfoClick}
          className={`${classes['btn']} text-center text-white cursor-pointer`}
        >
          修改
          <br />
          资料
        </div>
        <div
          onClick={onModifySysSettingClick}
          className={`${classes['btn']} text-center text-white cursor-pointer`}
          style={{
            marginLeft: '8px',
          }}
        >
          系统
          <br />
          设置
        </div>
      </div>
    </div>
  )
}
