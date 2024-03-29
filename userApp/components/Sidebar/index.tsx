import React from 'react'
// let json = require("./listElements.json")
import json from './listElements.json'
import './sidebar.css'

export default function () {
  return (
    <ul className="sidebar sidebar--list">
      {json.elements.map((elem, i) => {
        const anchor = `#${Object.keys(elem)[0]}`
        return (
          <li className="sidebar--element" key={i}>
            <a href={anchor}>{Object.values(elem)}</a>
          </li>
        )
      })}
    </ul>
  )
}
