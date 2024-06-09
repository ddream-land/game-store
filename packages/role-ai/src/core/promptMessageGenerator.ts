import { AIChatMessage } from './ChatMessage'
import { ChatRole } from './ChatRole'
import { CharacterCardV2 } from './characterCard/characterCardV2'

export function msgMacrosReplace(msg: string, characterCard: CharacterCardV2): string {
  let result = msg
  // Legacy non-macro substitutions
  result = result.replace(/<USER>/gi, 'User')
  result = result.replace(/<BOT>/gi, characterCard.data.name)

  // Short circuit if there are no macros
  if (!result.includes('{{')) {
    return result
  }

  result = result.replace(/{{user}}/gi, 'User')
  //  result = result.replace(/{{charPrompt}}/gi, );
  //  result = result.replace(/{{charJailbreak}}/gi, );
  result = result.replace(/{{char}}/gi, characterCard.data.name)
  result = result.replace(/{{description}}/gi, characterCard.data.description)
  result = result.replace(/{{scenario}}/gi, characterCard.data.scenario)
  result = result.replace(/{{personality}}/gi, characterCard.data.personality)
  //  result = result.replace(/{{persona}}/gi, );
  result = result.replace(/{{mesExamples}}/gi, characterCard.data.mes_example)
  //  result = result.replace(/{{lastMessageId}}/gi, );
  //  result = result.replace(/{{lastMessage}}/gi, );
  //  result = result.replace(/{{lastCharMessage}}/gi, );
  //  result = result.replace(/{{lastUserMessage}}/gi, );

  return result
}

export function preMsgGenerator(characterCard: CharacterCardV2): AIChatMessage[] {
  const preMsg: { role: ChatRole; content: string }[] = []

  const mainMsg = `rite {{char}}'s next reply in a fictional chat between {{char}} and {{user}}. Write 1 reply only in internet RP style, italicize actions, and avoid quotation marks. Use markdown. Be proactive, creative, and drive the plot and conversation forward. Write at least 1 paragraph, up to 4. Always stay in character and avoid repetition.`
  mainMsg &&
    preMsg.push({
      role: ChatRole.System,
      content: msgMacrosReplace(mainMsg, characterCard),
    })

  // const wordInfoMsg = ``
  // preMsg.push({
  //   role: ChatRole.System,
  //   content: msgMacrosReplace(wordInfoMsg, characterCard),
  // })

  // const personaDescriptionMsg = ``
  // preMsg.push({
  //   role: ChatRole.System,
  //   content: msgMacrosReplace(personaDescriptionMsg, characterCard),
  // })

  const description = characterCard.data.description
  description &&
    preMsg.push({
      role: ChatRole.System,
      content: msgMacrosReplace(description, characterCard),
    })

  const personality = characterCard.data.personality
  personality &&
    preMsg.push({
      role: ChatRole.System,
      content: msgMacrosReplace(personality, characterCard),
    })

  const scenario = characterCard.data.scenario
  scenario &&
    preMsg.push({
      role: ChatRole.System,
      content: msgMacrosReplace(scenario, characterCard),
    })

  // const NSFW = characterCard.data.
  // preMsg.push({
  //   role: ChatRole.System,
  //   content: msgMacrosReplace(NSFW, characterCard),
  // })

  const mes_example = characterCard.data.mes_example
  mes_example &&
    preMsg.push({
      role: ChatRole.System,
      content: msgMacrosReplace(mes_example, characterCard),
    })

  // const mes_example = characterCard.data.
  // preMsg.push({
  //   role: ChatRole.System,
  //   content: msgMacrosReplace(mes_example, characterCard),
  // })

  return preMsg
}
