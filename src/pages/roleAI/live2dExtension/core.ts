export interface MotionGroup {
  groupName: string
  motions: {
    file: string
    error?: any
  }[]
}

export interface Expression {
  file: string
  error?: any
}

export type ModelInitOption = {
  dragglable?: boolean
  followCursor?: boolean
  autoInteract?: boolean
}
