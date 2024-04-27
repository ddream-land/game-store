export const HTTP_BASEURL =
  import.meta.env.VITE_APP_API_BASEURL ?? ''
export const HTTP_TIMEOUT = Number(
  import.meta.env.VITE_APP_HTTP_TIMEOUT ?? 10000
)

export function getFullUrl(url: string) {
  const u = url.toLowerCase()
  if (u.startsWith('http') || u.startsWith('ws')) {
    return url
  } else if (u.startsWith('/')) {
    return `${HTTP_BASEURL}${url}`
  }
  return `${HTTP_BASEURL}/${url}`
}
