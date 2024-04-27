import { ChatRole } from '@/core/ChatRole'

export type ChatCompletionReqDto = {
  messages: { role: ChatRole; content: string }[]
  model: string
  temperature: number
  frequency_penalty: number
  presence_penalty: number
  top_p: number
  max_tokens: number
  // stream: boolean
  logit_bias: any
  chat_completion_source: string
  user_name: string
  char_name: string
}
