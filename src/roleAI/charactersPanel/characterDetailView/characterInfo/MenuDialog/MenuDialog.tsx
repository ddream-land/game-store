import classes from './MenuDialog.module.scss'

export default MenuDialog

function MenuDialog() {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
      className={`${classes.menuDialog} absolute top-0 flex flex-col items-center`}
    >
      <div
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        Re-name
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        Link to World Book
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        Export
      </div>
      <div className={`${classes.line} flex-none`}></div>
      <div
        className={`${classes.btn} cursor-pointer flex-1 flex justify-center items-center`}
      >
        Delete
      </div>
    </div>
  )
}
