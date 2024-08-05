import { useState } from 'react'
import { DEFAULT_OPEN_LIVE2D } from '@/constant/env'
import Live2dExtension from '@/pages/roleAI/live2dExtension/Live2dExtension'

export default function Live2dLayer() {
  const [live2dExtensionEnable] = useState(DEFAULT_OPEN_LIVE2D)

  if (live2dExtensionEnable) {
    return <Live2dExtension></Live2dExtension>
  }

  return null
}
