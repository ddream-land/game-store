import { configureStore } from '@reduxjs/toolkit'
import userInfoSlice from './slices/userInfoSlice'
import adminPanelSlice from './slices/adminPanelSlice'
import defaultBackground from './slices/defaultBackground'
import chatHistory from './slices/chatHistorySlice'

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice,
    adminPanel: adminPanelSlice,
    defaultBackground: defaultBackground,
    chatHistory: chatHistory,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
