import { HTTP_BASEURL } from '@/constant/env'

export function getFullUrl(url: string) {
  const u = url.toLowerCase()
  if (u.startsWith('http') || u.startsWith('ws')) {
    return url
  } else if (u.startsWith('/')) {
    return `${HTTP_BASEURL}${url}`
  }
  return `${HTTP_BASEURL}/${url}`
}
