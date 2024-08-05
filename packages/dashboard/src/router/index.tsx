import { Navigate, createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import Dashboard from '@/pages/dashboard/Dashboard'

const router = createBrowserRouter([
  {
    path: '/:language?',
    Component: App,
    children: [
      {
        path: '/:language',
        Component: Dashboard,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={`/`} replace />,
  },
])

export default router
