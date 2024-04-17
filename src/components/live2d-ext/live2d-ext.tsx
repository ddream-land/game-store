import { useEffect, useRef } from 'react'
import Live2dManager from './Live2dManager'

type Live2dExtProps = Readonly<{}>

function Live2dExt({}: Live2dExtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const manager = useRef<Live2dManager | null>(null)

  useEffect(function () {
    if (!canvasRef.current) {
      throw new Error(`Live2D canvas create failed.`)
    }

    manager.current = new Live2dManager(canvasRef.current)
    //@ts-ignore
    window.lmn = manager.current
    manager.current.addModel('/assets/live2d/Haru/Haru.model3.json')
  }, [])

  return (
    <div className="live2d-ext absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0"></canvas>
    </div>
  )
}

export default Live2dExt
