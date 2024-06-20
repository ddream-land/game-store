export function sleep(timeout: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout)
  })
}
