import {
  Navigate,
  createBrowserRouter,
} from 'react-router-dom'
import App from '@/App'
import RoleAI from '@/pages/roleAI/RoleAI'

function X() {
  return <div>123</div>
}

const router = createBrowserRouter([
  {
    path: '/:language?',
    Component: App,
    children: [
      {
        path: '/:language',
        Component: RoleAI,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={`/`} replace />,
  },
])

export default router
