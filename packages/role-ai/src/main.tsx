import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './i18n'
import router from './router/index.tsx'
import { RouterProvider } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import './index.scss'
import '@ddreamland/common/style.css'

import store from './store'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Provider store={store}>
        <NextUIProvider className="w-full h-full bg-transparent">
          <RouterProvider router={router} />
        </NextUIProvider>
      </Provider>
    </Suspense>
  </React.StrictMode>
)
