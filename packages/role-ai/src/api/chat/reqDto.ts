import { AIChatMessage } from '@/core/ChatMessage'
import { ChatRole } from '@/core/ChatRole'

// export type ChatCompletionReqDto = {
//   messages: { role: ChatRole; content: string }[]
//   model: string
//   temperature: number
//   frequency_penalty: number
//   presence_penalty: number
//   top_p: number
//   max_tokens: number
//   // stream: boolean
//   logit_bias: any
//   chat_completion_source: string
//   claude_use_sysprompt: boolean
//   user_name: string
//   char_name: string
// }

// export function chatCompletionReqDto(
//   userMsg: string,
//   last9Msg: AIChatMessage[],
//   preMsg?: AIChatMessage[]
// ) {
//   const reqDto: ChatCompletionReqDto = {
//     messages: [
//       ...(preMsg ?? []),
//       ...last9Msg,
//       {
//         role: ChatRole.User,
//         content: userMsg,
//       },
//     ],
//     model: 'claude-2.0',
//     temperature: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     top_p: 1,
//     max_tokens: 300,
//     logit_bias: {},
//     chat_completion_source: 'claude',
//     claude_use_sysprompt: true,
//     user_name: 'User',
//     char_name: 'Flux the Cat',
//   }

//   return reqDto
// }

export type ChatCompletionReqDto = {
  role_id: string
  content?: string
  new_conversion?: boolean
  renew_msg?: {
    msg_id: string
  }
  update_msg?: {
    msg_id: string
    content: string
    tokens: number
  }
  continue_msg?: {
    msg_id: string
  }
}
