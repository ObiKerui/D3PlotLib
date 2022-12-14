import React, { useRef, useLayoutEffect, useEffect } from 'react'
// let json = require("./listElements.json") 
import json from './listElements.json'
import './sidebar.css'

console.log('json data: ', json.elements)

export default function() {
    return (
        <>
            <ul className='sidebar sidebar--list'>
            {
                json.elements.map((elem, i) => {
                    let anchor = `#${Object.keys(elem)[0]}`
                    return (
                        <li className='sidebar--element' key={i}>
                            <a href={anchor}>{Object.values(elem)}</a>
                        </li>
                    )
                })                
            }
            </ul>
        </>
    )
}