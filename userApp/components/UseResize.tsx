import { useEffect } from 'react'

declare const _: any

type OnResizeFunc = () => void

export default function (functionCall: OnResizeFunc) {
  useEffect(() => {
    const handleResize = _.debounce(functionCall, 500)
    functionCall()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
}
