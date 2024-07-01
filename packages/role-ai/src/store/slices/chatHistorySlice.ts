import { NuwaChatMessage } from '@/core/ChatMessage'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type chatHistoryType = {
  chatHistory: NuwaChatMessage[]
}

const initialState: chatHistoryType = {
  chatHistory: [],
}

export const chatHistory = createSlice({
  name: 'chatHistory',
  initialState,
  reducers: {
    setChatHistory(state, action: PayloadAction<NuwaChatMessage[]>) {
      state.chatHistory = action.payload
    },
  },
})

export const { setChatHistory } = chatHistory.actions

export default chatHistory.reducer
