import classes from './AvatarPanel.module.scss'
import NormalButton from '@/components/NormalButton/NormalButton'
import {
  CharacterAvatar,
  CharacterAvatarType,
  CharacterAvatarTypeContents,
} from '@/core/CharacterAvatar'
import { useCurrentCharaCardInfoChecker } from '../useCurrentCharaCardInfoChecker'

export default AvatarPanel

function AvatarPanel({
  avatar,
  onAddClicked,
  onSelectClicked,
}: {
  avatar: CharacterAvatarTypeContents
  onAddClicked?: (type: CharacterAvatarType) => Promise<void>
  onSelectClicked?: (type: CharacterAvatarType, item: CharacterAvatar) => Promise<void>
}) {
  const { charaCardInfo } = useCurrentCharaCardInfoChecker()

  const nuwaAvatar = charaCardInfo.card.data.extensions.nuwa_avatar

  function isActive(avatar: CharacterAvatarTypeContents, item: CharacterAvatar) {
    return (
      avatar.type === nuwaAvatar?.type &&
      item.url === nuwaAvatar?.url &&
      item?.name === nuwaAvatar?.name
    )
  }

  return (
    <div className={`${classes.avatarPanel} mt-2`}>
      <div className={`${classes.header} flex flex-row justify-between items-center px-2`}>
        <div className={`${classes.title}`}>{avatar.typeName}</div>
        <NormalButton
          onClick={() => onAddClicked && onAddClicked(avatar.type)}
          className={`${classes.add}`}
          size={`small`}
        >
          +{' '}
        </NormalButton>
      </div>

      <div
        className={`${classes.listArea} ${
          avatar.type === CharacterAvatarType.Img ? classes.noBg : 'p-6'
        } mt-2`}
      >
        <div
          className={`${classes.list} w-full flex ${
            avatar.type === CharacterAvatarType.Img
              ? 'flex-row flex-wrap justify-between gap-3'
              : 'flex-col'
          }`}
        >
          {avatar.contents.map(function (item, i) {
            return avatar.type === CharacterAvatarType.Img ? (
              <div
                onClick={() => onSelectClicked && onSelectClicked(avatar.type, item)}
                key={i}
                className={`${classes.imgItem} overflow-hidden cursor-pointer`}
              >
                <img src={item.url} alt={item.name} className="w-full h-full" />
              </div>
            ) : (
              <div
                onClick={() => onSelectClicked && onSelectClicked(avatar.type, item)}
                key={i}
                className={`${classes.item}`}
              >
                <div
                  className={`${classes.name} ${
                    isActive(avatar, item) ? classes.active : ''
                  } px-4 py-2 truncate cursor-pointer`}
                >
                  {item.name}
                </div>
                <div className={`${classes.line} w-full`}></div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
