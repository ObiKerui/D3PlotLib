import React, { useEffect } from 'react'
import Prism from 'prismjs'

import './codeblock.css'

export default function ({ content }: any) {
  let language = 'javascript'
  let code = ``

  useEffect(() => {
    Prism.highlightAll();
  }, []);  

  return (
    <pre>
      <code className={`language-${language}`}>{content}</code>
    </pre>
  )
}