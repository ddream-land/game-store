import { KEEP_ROLE_PANEL_OPEN } from '@/constant/env'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
  minify: KEEP_ROLE_PANEL_OPEN ? false : true,
}

export const adminPanelSlice = createSlice({
  name: 'adminPanel',
  initialState,
  reducers: {
    setMinify(state, action: PayloadAction<boolean>) {
      state.minify = action.payload
    },
  },
})

export const { setMinify } = adminPanelSlice.actions

export default adminPanelSlice.reducer
