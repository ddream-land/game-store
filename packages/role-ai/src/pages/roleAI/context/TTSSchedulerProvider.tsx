import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react'
import { stop, setIsPlaying } from '@/store/slices/ttsSlice'
import { ttsInfo } from '@/api/tts/TTS'
import { currentChatCharacterInfoSelector } from '@/store/slices/characterSlice'

const TTSSchedulerContext = createContext<{
  getPlayState(): AudioContextState | undefined
  pauseCurrent(): Promise<void>
  resumeCurrent(): Promise<void>
}>({
  getPlayState() {
    return undefined
  },
  async pauseCurrent() {},
  async resumeCurrent() {},
})

//@ts-ignore
const AudioContext = window.AudioContext || window.webkitAudioContext

let audioCtx: AudioContext | undefined
let audioSource: AudioBufferSourceNode | undefined = undefined
let controller: AbortController | undefined = undefined

export function TTSSchedulerProvider({ children }: { children: ReactNode }) {
  // const audioEl = useRef<HTMLAudioElement>(null)
  const dispatch = useAppDispatch()
  const ttsTextInfo = useAppSelector((state) => state.tts.ttsTextInfo)
  const ttsEnable = useAppSelector((state) => state.tts.enable)

  useEffect(
    function () {
      if (ttsTextInfo) {
        ttsEnable && playAudioContext()
      } else {
        disposeAudioContext()
      }
    },
    [ttsTextInfo]
  )

  async function disposeAudioContext() {
    try {
      controller?.abort()
      controller = undefined
      audioSource?.stop(0)
      audioSource = undefined
      await audioCtx?.close()
      audioCtx = undefined
    } catch (err) {}
  }

  async function playAudioContext() {
    if (!ttsTextInfo || !ttsTextInfo.publishId || !ttsTextInfo.text) {
      return
    }

    await disposeAudioContext()

    audioCtx = new AudioContext()

    const reg = new RegExp(/\((.*?)\)/, 'g')

    try {
      controller = new AbortController()
      const res = await ttsInfo(
        ttsTextInfo.publishId,
        ttsTextInfo.text.replace(reg, ''),
        controller.signal
      )
      if (res.status !== 200) {
        return
      }

      const audioBuffer = await audioCtx.decodeAudioData(res.data, function (buffer) {
        return buffer
      })

      audioSource = audioCtx.createBufferSource()
      audioSource.buffer = audioBuffer
      audioSource.loop = false
      audioSource.connect(audioCtx.destination)
      audioSource.onended = function () {
        dispatch(setIsPlaying(false))
        dispatch(stop())
        disposeAudioContext()
      }
      audioSource.start(0)

      dispatch(setIsPlaying(true))
    } catch (err) {}
  }

  function getPlayState() {
    return audioCtx?.state
  }

  async function suspend() {
    await audioCtx?.suspend()
  }

  async function resume() {
    await audioCtx?.resume()
  }

  // async function playAudioElement() {
  //   const audio = audioEl.current
  //   if (!audio) {
  //     return
  //   }
  //   audio.load()
  //   try {
  //     await audio.play()
  //   } catch (err) {}
  // }

  // function onAudioElementPlayEnded() {
  //   const audio = audioEl.current

  //   if (!audio) {
  //     return
  //   }

  //   if (!audio.paused) {
  //     audio.pause()
  //   }
  //   audio.currentTime = 0
  // }

  // useEffect(function () {
  //   const audio = audioEl.current
  //   audio?.addEventListener('ended', onAudioElementPlayEnded)

  //   return function () {
  //     audio?.removeEventListener('ended', onAudioElementPlayEnded)
  //     audioCtx?.close()
  //     audioCtx = undefined
  //   }
  // }, [])

  return (
    <TTSSchedulerContext.Provider
      value={{ getPlayState, pauseCurrent: suspend, resumeCurrent: resume }}
    >
      {children}
      {/* {ttsEnable && (
        <audio ref={audioEl} autoPlay={true} className="hidden">
          <source src={currentAudioSrc}></source>
        </audio>
      )} */}
    </TTSSchedulerContext.Provider>
  )
}

export function useTTSScheduler() {
  const scheduler = useContext(TTSSchedulerContext)

  return {
    ...scheduler,
  }
}
