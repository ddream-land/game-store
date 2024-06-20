export interface DtoBase {
  code: number
  msg?: string
}

export interface DataDto<T = any> extends DtoBase {
  data: T
}

export interface ListDto<T = any> extends DtoBase {
  total: number
  rows: T[]
}
