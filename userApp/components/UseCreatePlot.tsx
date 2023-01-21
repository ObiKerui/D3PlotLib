import { useLayoutEffect, useRef } from 'react'

type CreateFunc = () => Promise<unknown>

export default function (creatorFtn: CreateFunc) {
  const plotCreated = useRef(false)
  useLayoutEffect(() => {
    if (plotCreated.current === false) {
      // eslint-disable-next-line no-console
      creatorFtn().catch(console.error)
    }

    return () => {
      plotCreated.current = true
    }
  }, [])
}
