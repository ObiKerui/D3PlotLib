import { useLayoutEffect, useRef } from 'react'

export default function (creatorFtn: any) {
  const plotCreated = useRef(false)
  useLayoutEffect(() => {
    if (plotCreated.current === false) {
      creatorFtn().catch(console.error)
    }

    return () => {
      plotCreated.current = true
    }
  }, [])
}
