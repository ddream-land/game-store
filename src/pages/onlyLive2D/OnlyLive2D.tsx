import Live2dExt from '@/pages/roleAI/live2dExtension/Live2dExtension'
import { useParams } from 'react-router-dom'

export default function OnlyLive2D() {
  const params = useParams()

  const modelName = params.modelname ?? 'Haru'
  const url = `/assets/live2d/${modelName}/${modelName}.model3.json`

  return (
    <>
      <Live2dExt defaultModelUrl={url}></Live2dExt>
    </>
  )
}
