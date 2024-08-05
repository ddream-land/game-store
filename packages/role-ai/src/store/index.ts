import { configureStore } from '@reduxjs/toolkit'
import userInfo from './slices/userInfoSlice'
import adminPanel from './slices/adminPanelSlice'
import defaultBackground from './slices/defaultBackground'
import chat from './slices/chatSlice'
import character from './slices/characterSlice'
import tts from './slices/ttsSlice'
import balance from './slices/balanceSlice'
import ui from './slices/uiSlice'

const store = configureStore({
  reducer: {
    userInfo: userInfo,
    defaultBackground: defaultBackground,
    character: character,
    adminPanel: adminPanel,
    chat: chat,
    tts: tts,
    balance: balance,
    ui: ui,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
