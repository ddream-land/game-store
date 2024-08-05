import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RequestStateBase, requestStateBase } from '../requestStateBase'
import { DEFAULT_OPEN_TTS } from '@/constant/env'

interface TTSState extends RequestStateBase {
  ttsTextInfo: { id?: string; text: string; publishId: string } | undefined
  enable: boolean
  isPlaying: boolean
}

const initialState: TTSState = {
  ...requestStateBase,
  ttsTextInfo: undefined,
  enable: DEFAULT_OPEN_TTS,
  isPlaying: false,
}

export const ttsSlice = createSlice({
  name: 'tts',
  initialState,
  reducers: {
    stop(state) {
      state.ttsTextInfo = undefined
    },
    playTTSText(state, action: PayloadAction<{ id?: string; text: string; publishId: string }>) {
      console.log('play tts')
      state.ttsTextInfo = action.payload
    },
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload
    },
  },
})

export const { stop, playTTSText, setIsPlaying } = ttsSlice.actions

export default ttsSlice.reducer
