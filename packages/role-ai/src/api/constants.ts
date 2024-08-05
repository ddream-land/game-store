import { HTTP_BASEURL } from '@/constant/env'

export function getFullUrl(url: string) {
  const u = url.toLowerCase()
  if (u.startsWith('http') || u.startsWith('ws')) {
    return url
  } else {
    const base = HTTP_BASEURL === '/' ? '' : HTTP_BASEURL

    if (u.startsWith('/')) {
      return `${base}${url}`
    }
    return `${base}/${url}`
  }
}
