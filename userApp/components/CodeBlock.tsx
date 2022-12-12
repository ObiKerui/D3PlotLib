import React, { useEffect } from 'react'
import Prism from 'prismjs'

import './codeblock.css'

export default function ({ content }: any) {
  let language = 'javascript'

  useEffect(() => {
    Prism.highlightAll();
  }, []);  

  const style = {
    fontSize: '0.6rem'
  }

  return (
    <pre>
      <code className={`language-${language}`} style={style}>{content}</code>
    </pre>
  )
}