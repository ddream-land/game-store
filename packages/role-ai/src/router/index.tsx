import { Navigate, createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import RoleAI from '@/pages/roleAI/RoleAI'
import PageView from '@/pages/roleAI/adminLayer/charactersPanel/pageView/PageView'
import CharacterDetailView from '@/pages/roleAI/adminLayer/charactersPanel/pageView/characterDetailView/CharacterDetailView'
import CharacterDetailEditPromptView from '@/pages/roleAI/adminLayer/charactersPanel/pageView/characterDetailEditPromptView/CharacterDetailEditPromptView'
import CharacterDetailEditAvatarView from '@/pages/roleAI/adminLayer/charactersPanel/pageView/characterDetailEditAvatarView/CharacterDetailEditAvatarView'
import CharacterDetailEditCoverView from '@/pages/roleAI/adminLayer/charactersPanel/pageView/characterDetailEditCoverView/CharacterDetailEditCoverView'
import CharacterDetailEditToneView from '@/pages/roleAI/adminLayer/charactersPanel/pageView/characterDetailEditToneView/CharacterDetailEditToneView'
import OnlyLive2D from '@/pages/onlyLive2D/OnlyLive2D'
import AvatarLive2dSettingView from '@/pages/roleAI/adminLayer/charactersPanel/pageView/AvatarLive2dSettingView/AvatarLive2dSettingView'
// import CharacterNameSettingView from '@/pages/roleAI/adminLayer/charactersPanel/pageView/characterNameSettingView/CharacterNameSettingView'

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
              // {
              //   path: '/:language/detail/editName',
              //   element: (
              //     <PageView>
              //       <CharacterNameSettingView></CharacterNameSettingView>
              //     </PageView>
              //   ),
              // },
              {
                path: '/:language/detail/editTone',
                element: (
                  <PageView>
                    <CharacterDetailEditToneView></CharacterDetailEditToneView>
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
                children: [
                  {
                    path: '/:language/detail/editAvatar/live2dSetting',
                    element: (
                      <PageView>
                        <AvatarLive2dSettingView></AvatarLive2dSettingView>
                      </PageView>
                    ),
                  },
                ],
              },
              {
                path: '/:language/detail/editCover',
                element: (
                  <PageView>
                    <CharacterDetailEditCoverView></CharacterDetailEditCoverView>
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
    path: '/vp-test/:modelname?',
    Component: OnlyLive2D,
  },
  {
    path: '*',
    element: <Navigate to={`/`} replace />,
  },
])

export default router
