export type DigitalLifeDetail = {
  /**
   * 唯一id，后端给
   */
  id: number

  /**
   * 名字
   */
  name: string

  /**
   * 头像 / 角色背景图
   */
  avatarUrl?: string

  /**
   * 描述文本
   */
  desc: string

  /**
   * 标签，最多三个
   */
  tags: string[]

  /**
   * 创作者注释
   */
  creatorNote?: string

  /**
   * 个性摘要
   */
  personalitySummary?: string

  /**
   * 角色描述
   */
  rolDesc?: string

  /**
   * 首条消息
   */
  firstMsg?: string
}
