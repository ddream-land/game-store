import { ttsGetUrl } from '@/api/tts/textTTS'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const TTSTextContext = createContext<string | undefined>(undefined)
const SetTTSTextContext = createContext<React.Dispatch<React.SetStateAction<string | undefined>>>(
  function () {}
)

export function TTSContextProvider({ children }: { children: JSX.Element }) {
  const audioEl = useRef<HTMLAudioElement>(null)
  const [ttsText, setTTSText] = useState<string | undefined>()
  const [ttsSrc, setTTSSrc] = useState('')

  useEffect(
    function () {
      if (ttsText) {
        setTTSSrc(ttsGetUrl(ttsText))
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
      audio.play()
    },
    [ttsSrc]
  )

  return (
    <TTSTextContext.Provider value={ttsText}>
      <SetTTSTextContext.Provider value={setTTSText}>
        {children}
        <audio ref={audioEl} autoPlay={true} className="hidden">
          <source src={ttsSrc}></source>
        </audio>
      </SetTTSTextContext.Provider>
    </TTSTextContext.Provider>
  )
}

export function useTTSText() {
  const ttsText = useContext(TTSTextContext)

  return { ttsText }
}

export function useSetTTSText() {
  return useContext(SetTTSTextContext)
}
