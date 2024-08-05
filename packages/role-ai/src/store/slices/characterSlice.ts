import { CharacterCardInfo } from '@/core/CharacterCardInfo'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RequestStateBase, requestStateBase } from '../requestStateBase'
import { editCard, getAllCards } from '@/api/characterCard/characterCard'
import { ReqStatus } from '@/core/ReqStatus'
import { CharacterCardV2 } from '@/core/characterCard/characterCardV2'
import { RootState } from '..'

interface CharacterState extends RequestStateBase {
  currentAdminCharacterId: string | undefined
  currentChatCharacterId: string | undefined
  characterInfoList: CharacterCardInfo[]
  reqCharacterInfoListStatus: ReqStatus
}

const initialState: CharacterState = {
  ...requestStateBase,

  reqCharacterInfoListStatus: ReqStatus.Idel,

  currentAdminCharacterId: undefined,
  currentChatCharacterId: undefined,
  characterInfoList: [],
}

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    setCurrentAdminCharacterId(state, action: PayloadAction<string | undefined>) {
      state.currentAdminCharacterId = action.payload
    },

    setCurrentChatCharacterId(state, action: PayloadAction<string | undefined>) {
      state.currentChatCharacterId = action.payload
    },

    clearCharacterList(state) {
      state.characterInfoList = []
    },
  },
  selectors: {
    currentAdminCharacterInfoSelector: (characterSlice) =>
      characterSlice.characterInfoList.find(
        (item) => item.id === characterSlice.currentAdminCharacterId
      ),
    currentChatCharacterInfoSelector: (characterSlice) =>
      characterSlice.characterInfoList.find(
        (item) => item.id === characterSlice.currentChatCharacterId
      ),
  },
  extraReducers(builder) {
    builder
      .addCase(refreshCharacterList.pending, function (state, action) {
        state.reqCharacterInfoListStatus = ReqStatus.Pending
      })
      .addCase(refreshCharacterList.fulfilled, (state, action) => {
        state.reqCharacterInfoListStatus = ReqStatus.Succeeded
        state.characterInfoList = action.payload
      })
      .addCase(refreshCharacterList.rejected, (state, action) => {
        state.reqCharacterInfoListStatus = ReqStatus.Failed
        state.characterInfoList = []
        state.error = action.error.message
      })

      .addCase(uploadCurrentAdminCharaInfo.pending, function (state, action) {
        state.status = ReqStatus.Pending
      })
      .addCase(uploadCurrentAdminCharaInfo.fulfilled, (state, action) => {
        state.status = ReqStatus.Succeeded
      })
      .addCase(uploadCurrentAdminCharaInfo.rejected, (state, action) => {
        state.status = ReqStatus.Failed
        state.error = action.error.message
      })
  },
})

export const refreshCharacterList = createAsyncThunk(
  'character/refreshCharacterList',
  async function () {
    const cards = await getAllCards()
    return cards
  }
)

export const { setCurrentAdminCharacterId, setCurrentChatCharacterId, clearCharacterList } =
  characterSlice.actions

export const { currentAdminCharacterInfoSelector, currentChatCharacterInfoSelector } =
  characterSlice.selectors

export const uploadCurrentAdminCharaInfo = createAsyncThunk(
  'character/uploadCurrentAdminCharaInfo',
  async function (info: { card: CharacterCardV2; avatar?: File }, { dispatch, getState }) {
    const state = getState() as RootState

    const adminCharaInfo = currentAdminCharacterInfoSelector(state)

    const currentId = adminCharaInfo?.id
    const currentAvatarUrl = adminCharaInfo?.pngUrlOrBase64
    if (!currentId || !currentAvatarUrl) {
      return
    }

    const { card, avatar } = info

    const res = await editCard(currentId, currentAvatarUrl, card, avatar)
    if (res.code !== 0) {
      throw new Error(res.msg ?? 'error')
    }
    await dispatch(refreshCharacterList())
  }
)

export default characterSlice.reducer
