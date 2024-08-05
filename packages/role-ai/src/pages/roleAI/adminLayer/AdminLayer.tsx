import classes from './AdminLayer.module.scss'
import AdminLayout from './adminLayout/AdminLayout'

export default function AdminLayer() {
  return (
    <div className={`${classes.adminLayer} absolute inset-0 pointer-events-none`}>
      <AdminLayout></AdminLayout>
    </div>
  )
}
