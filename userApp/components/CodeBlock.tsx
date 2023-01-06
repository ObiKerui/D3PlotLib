import React, { useEffect } from 'react'
import Prism from 'prismjs'

import './codeblock.css'

interface CodeBlockInt {
  content: string
}

export default function ({ content }: CodeBlockInt) {
  const language = 'javascript'

  useEffect(() => {
    Prism.highlightAll()
  }, [])

  const style = {
    fontSize: '0.6rem',
  }

  return (
    <pre>
      <code className={`language-${language}`} style={style}>
        {content}
      </code>
      {/* <code className={`language-${language}`} style={style} data-src="js/d3PlotLib.bundle.js"/> */}
    </pre>
  )
}
