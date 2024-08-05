import { NuwaChatMessage, nuwaChatMessage } from '@/core/ChatMessage'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '..'
import { delHistory, newChat as newChatReq } from '@/api/chat/chat'
import { msgMacrosReplace } from '@/core/promptMessageGenerator'
import { ChatRole } from '@/core/ChatRole'
import { ReqStatus } from '@/core/ReqStatus'
import { RequestStateBase, requestStateBase } from '../requestStateBase'
import { ChatCompletionReqDto } from '@/api/chat/reqDto'
import { chatCompletionStream } from '@/api/chat/chatCompletion'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  currentAdminCharacterInfoSelector,
  currentChatCharacterInfoSelector,
} from './characterSlice'

interface chatType extends RequestStateBase {
  chatHistory: NuwaChatMessage[]
  isChatMsgResponsing: boolean

  delStatus: ReqStatus
  delError?: string
}

const initialState: chatType = {
  ...requestStateBase,

  chatHistory: [],
  isChatMsgResponsing: false,

  delStatus: ReqStatus.Idel,
}

export const chat = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChatHistory(state) {
      state.chatHistory = []
    },

    setChatHistory(state, action: PayloadAction<NuwaChatMessage[]>) {
      state.chatHistory = action.payload
    },

    setIsChatMsgResponsing(state, action: PayloadAction<boolean>) {
      state.isChatMsgResponsing = action.payload
    },

    pushMsg(state, action: PayloadAction<NuwaChatMessage>) {
      state.chatHistory.push(action.payload)
    },

    changeMsg(
      state,
      action: PayloadAction<{
        id: string
        msg: NuwaChatMessage
      }>
    ) {
      state.chatHistory.forEach(function (msg) {
        if (msg.id === action.payload.id) {
          Object.assign(msg, action.payload.msg)
        }
      })
    },
  },

  extraReducers(builder) {
    builder
      // startNewChat
      .addCase(startNewChat.pending, function (state, action) {
        state.status = ReqStatus.Pending
      })
      .addCase(startNewChat.fulfilled, (state, action) => {
        state.status = ReqStatus.Succeeded
        state.chatHistory = action.payload
      })
      .addCase(startNewChat.rejected, (state, action) => {
        state.status = ReqStatus.Failed
        state.error = action.error.message
        state.chatHistory = []
      })

      // sendChatMsg
      .addCase(sendChatMsg.pending, function (state, action) {
        state.status = ReqStatus.Pending
      })
      .addCase(sendChatMsg.fulfilled, (state, action) => {
        state.status = ReqStatus.Succeeded
      })
      .addCase(sendChatMsg.rejected, (state, action) => {
        state.status = ReqStatus.Failed
        state.error = action.error.message
      })

      // delChatMsg
      .addCase(delChatMsg.pending, function (state, action) {
        state.delStatus = ReqStatus.Pending
      })
      .addCase(delChatMsg.fulfilled, (state, action) => {
        state.delStatus = ReqStatus.Succeeded
        state.chatHistory = action.payload
      })
      .addCase(delChatMsg.rejected, (state, action) => {
        state.delStatus = ReqStatus.Failed
        state.delError = action.error.message
      })
  },
})

export const { clearChatHistory, setChatHistory, setIsChatMsgResponsing, pushMsg, changeMsg } =
  chat.actions

export const startNewChat = createAsyncThunk('chat/startNewChat', async function (_, { getState }) {
  const state = getState() as RootState
  const chatCharaInfo = currentChatCharacterInfoSelector(state)

  if (!chatCharaInfo) {
    return []
  }

  const res = await newChatReq(chatCharaInfo.id)
  if (res.code !== 0) {
    throw new Error(res.msg ?? 'Start new chat error.')
  }

  const firstMsg = msgMacrosReplace(chatCharaInfo.card.data.first_mes, chatCharaInfo.card)
  const nuwaFirstMsg: NuwaChatMessage = nuwaChatMessage(
    firstMsg,
    chatCharaInfo.id,
    0,
    ChatRole.Assistant
  )

  return [nuwaFirstMsg]
})

export const sendChatMsg = createAsyncThunk(
  'chat/sendChatMsg',
  async function (payload: { msg: string }, { dispatch, getState }) {
    const state = getState() as RootState
    const chatCharaInfo = currentChatCharacterInfoSelector(state)
    if (!chatCharaInfo) {
      return
    }

    dispatch(setIsChatMsgResponsing(true))

    const { msg } = payload

    const reqDto: ChatCompletionReqDto = {
      content: msg,
      role_id: chatCharaInfo.id,
    }

    const chatHistory = state.chat.chatHistory

    if (chatHistory && chatHistory.length > 1) {
      const latestMsg = chatHistory[chatHistory.length - 1]
      if (latestMsg.role === ChatRole.Assistant) {
        // clear latest msg multi response contents
        if (latestMsg.contents && latestMsg.contents.length > 0) {
          reqDto.update_msg = {
            msg_id: latestMsg.id,
            content: latestMsg.content,
            tokens: latestMsg.tokens,
          }
          dispatch(
            changeMsg({
              id: latestMsg.id,
              msg: {
                ...latestMsg,
                contents: undefined,
              },
            })
          )
        }
      }
    }

    const newUserMsg: NuwaChatMessage = nuwaChatMessage(msg, chatCharaInfo.id, 0, ChatRole.User)
    dispatch(pushMsg({ ...newUserMsg }))

    const newAssistantMsg: NuwaChatMessage = nuwaChatMessage(
      '',
      chatCharaInfo.id,
      0,
      ChatRole.Assistant
    )
    dispatch(pushMsg({ ...newAssistantMsg }))

    async function reqSSEMsg() {
      return new Promise<void>(async function (resolve, reject) {
        try {
          await chatCompletionStream(reqDto, {
            onMsgId(msgId: string, replyMsgId: string, msgTime: number, replyMsgTime: number) {
              const oldUserMsgId = newUserMsg.id
              dispatch(
                changeMsg({
                  id: oldUserMsgId,
                  msg: { ...newUserMsg, date: msgTime, id: msgId },
                })
              )
              newUserMsg.id = msgId
              newUserMsg.date = msgTime

              const oldAssistantMsgId = newAssistantMsg.id
              dispatch(
                changeMsg({
                  id: oldAssistantMsgId,
                  msg: { ...newAssistantMsg, date: replyMsgTime, id: replyMsgId },
                })
              )
              newAssistantMsg.id = replyMsgId
              newAssistantMsg.date = replyMsgTime
            },
            onOutputTokens(tokens) {
              const realtimeNewAssistantMsg = (getState() as RootState).chat.chatHistory.find(
                (x) => x.id === newAssistantMsg.id
              )

              if (realtimeNewAssistantMsg) {
                dispatch(
                  changeMsg({
                    id: realtimeNewAssistantMsg.id,
                    msg: { ...realtimeNewAssistantMsg, tokens: tokens },
                  })
                )
              }
            },
            async onOpen(response) {
              dispatch(setIsChatMsgResponsing(true))
            },
            onEnd() {
              dispatch(setIsChatMsgResponsing(false))
              resolve()
            },
            onMessage(index, msg) {
              const realtimeNewAssistantMsg = (getState() as RootState).chat.chatHistory.find(
                (x) => x.id === newAssistantMsg.id
              )
              if (realtimeNewAssistantMsg) {
                const oldContent = realtimeNewAssistantMsg.content ?? ''
                dispatch(
                  changeMsg({
                    id: newAssistantMsg.id,
                    msg: { ...realtimeNewAssistantMsg, content: oldContent + msg },
                  })
                )
              }
            },
            onClose() {
              dispatch(setIsChatMsgResponsing(false))
              resolve()
            },
            onError(err) {
              dispatch(setIsChatMsgResponsing(false))
              console.log('error', err)
              reject(err)
            },
          })
        } catch (err) {
          dispatch(setIsChatMsgResponsing(false))
          console.log('error', err)
          reject(err)
        }
      })
    }

    await reqSSEMsg()
  }
)

export const continueChatMsg = createAsyncThunk(
  'chat/continueChatMsg',
  async function (_, { dispatch, getState }) {
    const state = getState() as RootState
    const chatCharaInfo = currentChatCharacterInfoSelector(state)
    if (!chatCharaInfo) {
      return
    }

    const chatHistory = state.chat.chatHistory

    if (!chatHistory || chatHistory.length <= 1) {
      // first msg can not continue
      return
    }

    const latestMsg = chatHistory[chatHistory.length - 1]
    if (latestMsg.role !== ChatRole.Assistant) {
      return
    }

    dispatch(setIsChatMsgResponsing(true))

    const latestMsgId = latestMsg.id
    const reqDto: ChatCompletionReqDto = {
      role_id: chatCharaInfo.id,
      continue_msg: {
        msg_id: latestMsgId,
      },
    }

    if (latestMsg.contents && latestMsg.contents.length > 0) {
      reqDto.update_msg = {
        msg_id: latestMsgId,
        content: latestMsg.content,
        tokens: latestMsg.tokens,
      }
      dispatch(
        setChatHistory(
          chatHistory.map(function (m) {
            if (m.id === latestMsgId) {
              const contents = undefined
              return {
                ...m,
                contents,
              }
            } else {
              return m
            }
          })
        )
      )
    }

    async function reqSSEMsg() {
      return new Promise<void>(async function (resolve, reject) {
        try {
          await chatCompletionStream(reqDto, {
            onMsgId(msgId: string, replyMsgId: string, msgTime: number, replyMsgTime: number) {},
            onOutputTokens(tokens) {
              const realtimeLatestMsg = (getState() as RootState).chat.chatHistory.find(
                (x) => x.id === latestMsgId
              )
              if (realtimeLatestMsg) {
                dispatch(
                  changeMsg({
                    id: latestMsgId,
                    msg: { ...realtimeLatestMsg, tokens: tokens },
                  })
                )
              }
            },
            async onOpen(response) {
              dispatch(setIsChatMsgResponsing(true))
            },
            onEnd() {
              dispatch(setIsChatMsgResponsing(false))
              resolve()
            },
            onMessage(index, msg) {
              const realtimeLatestMsg = (getState() as RootState).chat.chatHistory.find(
                (x) => x.id === latestMsgId
              )
              if (realtimeLatestMsg) {
                const oldContent = realtimeLatestMsg.content ?? ''

                dispatch(
                  changeMsg({
                    id: latestMsgId,
                    msg: { ...realtimeLatestMsg, content: oldContent + msg },
                  })
                )
              }
            },
            onClose() {
              dispatch(setIsChatMsgResponsing(false))
              resolve()
            },
            onError(err) {
              dispatch(setIsChatMsgResponsing(false))
              console.log('error', err)
              reject(err)
            },
          })
        } catch (err) {
          dispatch(setIsChatMsgResponsing(false))
          console.log('error', err)
          reject(err)
        }
      })
    }

    await reqSSEMsg()
  }
)

export const regenerateChatMsg = createAsyncThunk(
  'chat/regenerateChatMsg',
  async function (_, { dispatch, getState }) {
    const state = getState() as RootState
    const chatCharaInfo = currentChatCharacterInfoSelector(state)
    if (!chatCharaInfo) {
      return
    }

    const chatHistory = state.chat.chatHistory

    if (!chatHistory || chatHistory.length <= 1) {
      // first msg can not continue
      return
    }

    const latestMsg = chatHistory[chatHistory.length - 1]
    if (latestMsg.role !== ChatRole.Assistant) {
      return
    }

    dispatch(setIsChatMsgResponsing(true))

    const latestMsgId = latestMsg.id
    const reqDto: ChatCompletionReqDto = {
      role_id: chatCharaInfo.id,
      renew_msg: {
        msg_id: latestMsgId,
      },
    }

    // if no contents, push old content to contents list
    dispatch(
      changeMsg({
        id: latestMsgId,
        msg: {
          ...latestMsg,
          contents: latestMsg.contents
            ? latestMsg.contents
            : [
                {
                  content: latestMsg.content,
                  tokens: latestMsg.tokens ?? 0,
                },
              ],
          // clear content
          content: '',
        },
      })
    )

    function pushRegenerateMsgToContentsList() {
      const nowLatestMsg = (getState() as RootState).chat.chatHistory.find(
        (x) => x.id === latestMsgId
      )
      if (nowLatestMsg) {
        const content = nowLatestMsg.content
        const contents = [...(nowLatestMsg.contents ?? [])]
        if (!contents.some((x) => x.content === content)) {
          // AI reply content not duplicated
          contents.push({
            content: nowLatestMsg.content,
            tokens: nowLatestMsg.tokens ?? 0,
          })
        }

        dispatch(
          changeMsg({
            id: latestMsgId,
            msg: { ...nowLatestMsg, contents },
          })
        )
      }
    }

    async function reqSSEMsg() {
      return new Promise<void>(async function (resolve, reject) {
        try {
          await chatCompletionStream(reqDto, {
            onMsgId(msgId: string, replyMsgId: string, msgTime: number, replyMsgTime: number) {},
            onOutputTokens(tokens) {
              const realtimeLatestMsg = (getState() as RootState).chat.chatHistory.find(
                (x) => x.id === latestMsgId
              )
              if (realtimeLatestMsg) {
                dispatch(
                  changeMsg({
                    id: latestMsgId,
                    msg: { ...realtimeLatestMsg, tokens: tokens },
                  })
                )
              }
            },
            async onOpen(response) {
              dispatch(setIsChatMsgResponsing(true))
            },
            onEnd() {
              // Only end signal can push list
              pushRegenerateMsgToContentsList()
              dispatch(setIsChatMsgResponsing(false))
              resolve()
            },
            onMessage(index, msg) {
              const realtimeLatestMsg = (getState() as RootState).chat.chatHistory.find(
                (x) => x.id === latestMsgId
              )
              if (realtimeLatestMsg) {
                const oldContent = realtimeLatestMsg.content ?? ''

                dispatch(
                  changeMsg({
                    id: latestMsgId,
                    msg: { ...realtimeLatestMsg, content: oldContent + msg },
                  })
                )
              }
            },
            onClose() {
              dispatch(setIsChatMsgResponsing(false))
              resolve()
            },
            onError(err) {
              dispatch(setIsChatMsgResponsing(false))
              console.log('error', err)
              reject(err)
            },
          })
        } catch (err) {
          dispatch(setIsChatMsgResponsing(false))
          console.log('error', err)
          reject(err)
        }
      })
    }

    await reqSSEMsg()
  }
)

export const delChatMsg = createAsyncThunk(
  'chat/delChatMsg',
  async function (
    payload: {
      msg: NuwaChatMessage
    },
    { dispatch, getState }
  ) {
    const state = getState() as RootState
    const msg = payload.msg

    let humanMsgId = ''
    let aiMsgId = ''

    if (msg.role === ChatRole.User) {
      humanMsgId = msg.id
      const index = state.chat.chatHistory.findIndex((x) => x.id === humanMsgId)
      aiMsgId = state.chat.chatHistory[index + 1].id
    } else if (msg.role === ChatRole.Assistant) {
      aiMsgId = msg.id
      const index = state.chat.chatHistory.findIndex((x) => x.id === aiMsgId)
      humanMsgId = state.chat.chatHistory[index - 1].id
    }

    if (humanMsgId && aiMsgId) {
      const res = await delHistory(humanMsgId, aiMsgId)
      if (res.code === 0) {
        return state.chat.chatHistory.filter((x) => x.id !== humanMsgId && x.id !== aiMsgId)
      } else {
        throw new Error(res.msg ?? '')
      }
    }

    return [...state.chat.chatHistory]
  }
)

export default chat.reducer
