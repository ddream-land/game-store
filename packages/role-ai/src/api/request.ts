import http from './http'
import { DataDto, ListDto } from './dtoBase'
import { ResponseType } from 'axios'

export function requestData<T = any>({
  url,
  method = 'get',
  data,
  params,
  headers,
  timeout,
  signal,
}: {
  url: string
  method?: string
  data?: any
  params?: any
  headers?: Record<string, string | number | boolean>
  timeout?: number
  signal?: AbortSignal
}): Promise<DataDto<T>> {
  return http.request<any, DataDto<T>, any>({
    url,
    method,
    data,
    params,
    headers,
    timeout,
    signal,
  })
}

export function requestList<T = any>({
  url,
  method = 'get',
  data,
  params,
  headers,
  timeout,
  signal,
}: {
  url: string
  method?: string
  data?: any
  params?: any
  headers?: Record<string, string | number | boolean>
  timeout?: number
  signal?: AbortSignal
}): Promise<ListDto<T>> {
  return http.request<any, ListDto<T>, any>({
    url,
    method,
    data,
    params,
    headers,
    timeout,
    signal,
  })
}

export function request<T = any>({
  url,
  method = 'get',
  data,
  params,
  headers,
  timeout,
  responseType,
  signal,
}: {
  url: string
  method?: string
  data?: any
  params?: any
  headers?: Record<string, string | number | boolean>
  timeout?: number
  responseType?: ResponseType
  signal?: AbortSignal
}): Promise<T> {
  return http.request<any, T, any>({
    url,
    method,
    data,
    params,
    headers,
    timeout,
    responseType,
    signal,
  })
}
