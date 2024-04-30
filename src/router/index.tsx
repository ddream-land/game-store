import { Navigate, createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import RoleAI from '@/pages/roleAI/RoleAI'
import PageView from '@/pages/roleAI/charactersPanel/pageView/PageView'
import CharacterDetailView from '@/pages/roleAI/charactersPanel/pageView/characterDetailView/CharacterDetailView'
import CharacterDetailEditView from '@/pages/roleAI/charactersPanel/pageView/characterDetailEditView/CharacterDetailEditView'
import OnlyLive2D from '@/pages/onlyLive2D/OnlyLive2D'

const router = createBrowserRouter([
  {
    path: '/:language?',
    Component: App,
    children: [
      {
        path: '/:language',
        Component: RoleAI,
        children: [
          {
            path: '/:language/detail',
            element: (
              <PageView>
                <CharacterDetailView></CharacterDetailView>
              </PageView>
            ),
            children: [
              {
                path: '/:language/detail/edit',
                element: (
                  <PageView>
                    <CharacterDetailEditView></CharacterDetailEditView>
                  </PageView>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/vp-test',
    Component: OnlyLive2D,
  },
  {
    path: '*',
    element: <Navigate to={`/`} replace />,
  },
])

export default router
