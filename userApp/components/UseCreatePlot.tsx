import React, { useLayoutEffect, useRef } from "react"


export default function(creatorFtn: any) {
    let plotCreated = useRef(false)
    useLayoutEffect(() => {
        if(plotCreated.current === false) {
            creatorFtn().catch(console.error)
          }
      
          return () => {
            plotCreated.current = true
          }
    }, [])    
}
