import { Navigate, createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import RoleAI from '@/pages/roleAI/RoleAI'
import PageView from '@/pages/roleAI/charactersPanel/pageView/PageView'
import CharacterDetailView from '@/pages/roleAI/charactersPanel/pageView/characterDetailView/CharacterDetailView'
import CharacterDetailEditPromptView from '@/pages/roleAI/charactersPanel/pageView/characterDetailEditPromptView/CharacterDetailEditPromptView'
import CharacterDetailEditAvatarView from '@/pages/roleAI/charactersPanel/pageView/characterDetailEditAvatarView/CharacterDetailEditAvatarView'

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
                path: '/:language/detail/editPrompt',
                element: (
                  <PageView>
                    <CharacterDetailEditPromptView></CharacterDetailEditPromptView>
                  </PageView>
                ),
              },
              {
                path: '/:language/detail/editAvatar',
                element: (
                  <PageView>
                    <CharacterDetailEditAvatarView></CharacterDetailEditAvatarView>
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
