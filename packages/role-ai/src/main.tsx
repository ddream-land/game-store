import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import './i18n'
import router from './router/index.tsx'
import { RouterProvider } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import '@ddreamland/common/style.css'
import DDLLoading from './components/ddream/DDLLoading.tsx'
import './index.scss'
import { HTTP_BASEURL } from './constant/env.ts'
import { setBaseUrl } from '@ddreamland/common'
setBaseUrl(HTTP_BASEURL)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense
      fallback={
        <div className="w-screen h-screen flex flex-row justify-center items-center bg-white">
          <div className="w-28 h-28">
            <DDLLoading></DDLLoading>
          </div>
        </div>
      }
    >
      <Provider store={store}>
        <NextUIProvider className="dark w-full h-full bg-transparent">
          <RouterProvider router={router} />
        </NextUIProvider>
      </Provider>
    </Suspense>
  </React.StrictMode>
)
