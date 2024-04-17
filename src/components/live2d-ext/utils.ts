export function loadFileToDocument(url: string, type: string) {
  return new Promise((resolve, reject) => {
    let element: HTMLLinkElement | HTMLScriptElement

    if (type === 'css') {
      element = document.createElement('link')
      element.rel = 'stylesheet'
      element.href = url
    } else if (type === 'js') {
      element = document.createElement('script')
      element.src = url
    } else {
      reject('Invalid type specified')
      return
    }

    element.onload = resolve
    element.onerror = reject

    type === 'css' ? document.head.appendChild(element) : document.body.appendChild(element)
  })
}
