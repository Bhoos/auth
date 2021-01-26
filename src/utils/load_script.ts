/**
 * Insert javascript script element
 */
export default (d: any, s: string, id: string, jsSrc: string, cb: any, onError: (err: Error) => void) => {
  const element = d.getElementsByTagName(s)[0]
  const fjs = element
  let js = element
  js = d.createElement(s)
  js.id = id
  js.src = jsSrc
  if (fjs && fjs.parentNode) {
    fjs.parentNode.insertBefore(js, fjs)
  } else {
    d.head.appendChild(js)
  }
  js.onerror = onError
  js.onload = cb
}