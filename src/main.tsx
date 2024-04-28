import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './i18n'
import router from './router/index.tsx'
import { RouterProvider } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import './index.scss'

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <NextUIProvider className="w-full h-full">
        <RouterProvider router={router} />
      </NextUIProvider>
    </Suspense>
  </React.StrictMode>
)
