import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState = {
  ddreamTokenPayIsOpen: false,
  powerExchangePayIsOpen: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDdreamTokenPayIsOpen(state, action: PayloadAction<boolean>) {
      state.ddreamTokenPayIsOpen = action.payload
    },
    setPowerExchangePayIsOpen(state, action: PayloadAction<boolean>) {
      state.powerExchangePayIsOpen = action.payload
    },
  },
})

export const { setDdreamTokenPayIsOpen, setPowerExchangePayIsOpen } = uiSlice.actions

export default uiSlice.reducer
