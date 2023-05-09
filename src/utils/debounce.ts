export const debounce = (func: any) => {
  let timer: any
  return function (...args: any) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      func.apply(args)
    }, 500)
  }
}
