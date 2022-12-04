import React, { useRef, useLayoutEffect, useState, useEffect } from 'react'
import useCreatePlot from './UseCreatePlot'

declare const d3: any
declare const d3PlotLib: any

async function createDonutPlot(ref: any): Promise<any> {

    let csvresult = await d3.csv('assets/iris.csv')
  
    let labels = Object.keys(csvresult[0])
    labels = labels.slice(0, -1)
    let obj: any = labels.reduce((accumulator, value) => {
      return {...accumulator, [value]: []}
    }, {})
  
    csvresult.forEach((elem: any) => {
      labels.forEach((e: any) => { 
          obj[e as keyof any].push(+(elem[e]))
      })
      return elem
    })
  
    let ys = Object.values(obj)
  
    // sum the values 
    let sums = ys.map((y: any) => {
      return d3.sum(y)
    })
  
    // get total
    let total = sums.reduce((accumulator, value) => {
      return accumulator + value
    }, 0)
  
    let percentages = sums.map((y: any) => {
      return y / total
    })
  
    // console.log('labels / ys / sums / total / percentages ', labels, ys, sums, total, percentages)
  
    let donutPlot = d3PlotLib.DonutPlot()
    .ys(percentages)
    .labels(labels)
  
    let container = d3PlotLib.Container()
    .plot(donutPlot)
  
    d3.select(ref).call(container)
  
    return container
  }
  
  export default function () {
    let ref = useRef(null)
    let plotObj: any = null
  
    useCreatePlot(async () => {
      const currRef = ref.current
      let obj = await createDonutPlot(currRef)
      plotObj = obj
    })
  
    return (
      <div className="plot">
        <div className="plot plot--container">
          <h3>Donut Plot</h3>
          <div className="plot plot--area" ref={ref}></div>
          <div className="plot plot--description">
            <p>
              Donut plot is for rendering such n such. Good for which types of visual, bad for
              these others..etc.
            </p>
          </div>
        </div>
        <div className="plot plot--code">
          <code>how to paste in the code here?</code>
        </div>
      </div>
    )
  }
  