import React, { useRef, useEffect, useLayoutEffect } from 'react'
declare const d3: any;
declare const _: any;
declare const window: any;

export default function(functionCall: any) {
  useEffect(() => {
    const handleResize = _.debounce(functionCall, 500)
    functionCall()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)  
    }
  }, [])
}
