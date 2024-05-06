import { isFunction } from '@/libs/isTypes'
import { ToastType, Toaster, useToaster } from 'react-hot-toast'
import classes from './Notifications.module.scss'

export default Notifications

function Notifications() {
  const { toasts, handlers } = useToaster()
  const { startPause, endPause, calculateOffset, updateHeight } = handlers

  //   return <Toaster></Toaster>

  return (
    <div className={`${classes.notifications} fixed z-50 inset-4 pointer-events-none`}>
      {toasts
        .filter((toast) => toast.visible)
        .map(function (toast) {
          const offset = calculateOffset(toast, {
            reverseOrder: false,
            gutter: 8,
          })

          const ref = (el: HTMLDivElement) => {
            if (el && typeof toast.height !== 'number') {
              const height = el.getBoundingClientRect().height
              updateHeight(toast.id, height)
            }
          }

          const iconClass = (type: ToastType) => {
            switch (type) {
              case 'success': {
                return classes.success
              }
              case 'loading': {
                return classes.loading
              }
              default: {
                return ''
              }
            }
          }

          return (
            <div
              key={toast.id}
              ref={ref}
              style={{
                position: 'absolute',
                transform: `translateY(${offset}px)`,
              }}
              {...toast.ariaProps}
              className="left-0 right-0 top-0 absolute transition-all flex flex-row justify-end"
            >
              <div
                className={`${classes.notification} flex flex-row justify-between items-center px-3`}
              >
                <div className={`${classes.msg}`}>
                  {isFunction(toast.message) ? toast.message(toast) : toast.message}
                </div>
                <div className={`${classes.icon} ${iconClass(toast.type)}`}></div>
              </div>
            </div>
          )
        })}
    </div>
  )
}
