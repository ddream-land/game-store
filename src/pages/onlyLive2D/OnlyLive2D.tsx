import { ttsGetUrl } from '@/api/tts/textTTS'
import { DEFAULT_OPEN_TTS } from '@/constant/env'
import Live2dExt from '@/pages/roleAI/live2dExtension/Live2dExtension'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function OnlyLive2D() {
  const params = useParams()

  const modelName = params.modelname ?? 'Haru'
  const url = `/assets/live2d/${modelName}/${modelName}.model3.json`

  const audioEl = useRef<HTMLAudioElement>(null)
  const [ttsText, setTTSText] = useState<string | undefined>()
  const [ttsSrc, setTTSSrc] = useState('')

  useEffect(
    function () {
      if (ttsText) {
        setTTSSrc(ttsGetUrl(ttsText, 'lisa'))
      } else {
        setTTSSrc('')
      }
    },
    [ttsText]
  )

  useEffect(
    function () {
      const audio = audioEl.current
      if (!audio) {
        return
      }
      if (!audio.paused) {
        audio.pause()
      }

      if (!ttsSrc) {
        return
      }

      audio.load()
      ;(async function () {
        try {
          await audio.play()
        } catch (err) {}
      })()
    },
    [ttsSrc]
  )

  function onAudioPlayEnded() {
    const audio = audioEl.current
    if (!audio) {
      return
    }

    if ((window as any).webkit && (window as any).webkit.messageHandlers) {
      ;(window as any)?.webkit?.messageHandlers?.playMsgEnded?.postMessage()
    }

    if (!audio.paused) {
      audio.pause()
    }
    audio.currentTime = 0
  }

  useEffect(function () {
    const audio = audioEl.current
    audio?.addEventListener('ended', onAudioPlayEnded)

    //@ts-ignore
    window.playMsg = setTTSText

    return function () {
      audio?.removeEventListener('ended', onAudioPlayEnded)
    }
  }, [])

  return (
    <>
      <Live2dExt defaultModelUrl={url}></Live2dExt>

      <audio ref={audioEl} autoPlay={true} className="hidden">
        <source src={ttsSrc}></source>
      </audio>
    </>
  )
}
