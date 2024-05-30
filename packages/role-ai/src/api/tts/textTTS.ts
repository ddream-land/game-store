export function ttsGetUrl(text: string, character: string = 'shenli') {
  return `https://tts.nirvanaworld.cn/tts?character=${character}&text=${text}&batch_size=10&format=mp3`
}
