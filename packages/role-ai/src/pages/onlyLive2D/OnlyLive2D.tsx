import { ttsGetUrl } from '@/api/tts/TTS'
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

      console.log('start auto play')
      audio.load()
      ;(async function () {
        try {
          await audio.play()
          console.log('start auto play success')
          //@ts-ignore
          window.lmn.setLipSync(window.lmn.modelIds[0], true)
        } catch (err) {
          console.log('auto play err', err)
        }
      })()
    },
    [ttsSrc]
  )

  function onAudioPlayEnded() {
    const audio = audioEl.current
    if (!audio) {
      return
    }

    console.log('audio play ended')

    if ((window as any).webkit && (window as any).webkit.messageHandlers) {
      console.log('audio play end to webkit')
      ;(window as any).webkit.messageHandlers.playMsgEnded.postMessage()
      console.log('audio play end to webkit success')
    }

    //@ts-ignore
    window.lmn.setLipSync(window.lmn.modelIds[0], false)

    if (!audio.paused) {
      audio.pause()
    }
    audio.currentTime = 0
  }

  // function globalClick() {
  //   console.log('global click')

  //   const audio = audioEl.current
  //   if (audio) {
  //     audio.load()
  //     ;(async function () {
  //       try {
  //         console.log('global play start')
  //         await audio.play()
  //         console.log('global play success')
  //       } catch (err) {
  //         console.log('global play err', err)
  //       }
  //     })()
  //   }

  // document.removeEventListener('click', globalClick)
  // }

  useEffect(function () {
    const audio = audioEl.current
    audio?.addEventListener('ended', onAudioPlayEnded)

    // document.addEventListener('click', globalClick)

    //@ts-ignore
    window.playMsg = setTTSText

    return function () {
      // document.removeEventListener('click', globalClick)
      audio?.removeEventListener('ended', onAudioPlayEnded)
    }
  }, [])

  return (
    <>
      <Live2dExt defaultModelUrl={url}></Live2dExt>

      <audio ref={audioEl} autoPlay={true} className="hidden" controls={true}>
        <source src={ttsSrc} content=""></source>
      </audio>
    </>
  )
}
