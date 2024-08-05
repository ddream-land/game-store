import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './i18n'
import router from './router/index.tsx'
import { RouterProvider } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import '@ddreamland/common/style.css'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <NextUIProvider className="w-full h-full bg-transparent">
        <RouterProvider router={router} />
      </NextUIProvider>
    </Suspense>
  </React.StrictMode>
)
