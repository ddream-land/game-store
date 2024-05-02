import { useEffect, useRef } from 'react'
import Live2dExtensionModel from './Live2dExtensionManager'
import classes from './Live2dExtension.module.scss'

type Live2dExtensionProps = Readonly<{}>

export default Live2dExtension

function Live2dExtension({}: Live2dExtensionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const manager = useRef<Live2dExtensionModel | null>(null)

  useEffect(function () {
    if (!canvasRef.current) {
      throw new Error(`Live2D canvas create failed.`)
    }

    manager.current = new Live2dExtensionModel(canvasRef.current)
    //@ts-ignore
    window.lmn = manager.current
    manager.current.addModel('/assets/live2d/Haru/Haru.model3.json')
  }, [])

  return (
    <div className={`${classes.live2dExtension} absolute inset-0 bg-transparent`}>
      <canvas ref={canvasRef} className="absolute inset-0  bg-transparent"></canvas>
    </div>
  )
}
