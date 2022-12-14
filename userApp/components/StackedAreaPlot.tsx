import React, { useRef, useLayoutEffect, useState, useEffect } from 'react'
import np from './NumpyClone'
import useCreatePlot from './UseCreatePlot'

declare const d3: any
declare const d3PlotLib: any

function createStackedArea(ref: any) {
    // matplotlib style
    let dte1 = new Date(2022, 8)
    let dte2 = new Date(2022, 9)
    let dte3 = new Date(2022, 10)
    let dte4 = new Date(2022, 11)
    let dte5 = new Date(2022, 12)

    let x = [dte1, dte2, dte3, dte4, dte5]

    let y1 = [1, 1, 2, 3, 5]
    let y2 = [0, 4, 2, 6, 8]
    let y3 = [1, 3, 5, 7, 9]
    let labels = ['Fibonacci ', 'Evens', 'Odds']
  
    let scaler = d3PlotLib.Scaler()
    .xScale((xs: any) => {
      return d3.scaleTime()
      .domain(d3.extent(xs))
    })
    .yScale((ys: any) => {
      return d3.scaleLinear()
      .domain([0, 25])
    })
  
    let stackplot = d3PlotLib.StackedArea()
    .xs(x)
    .ys([y1, y2, y3])
    .labels(labels)
  
    let legend = d3PlotLib.Legend()
  
    let container = d3PlotLib
      .Container()
      .xAxisLabel('X label')
      .xAxisText({ rotation: 65 })  
      .yAxisLabel('Y Label')
      .scale(scaler)
      .plot(stackplot)
      .legend(legend)
  
    d3.select(ref).call(container)
    return container
  }
  
  export default function () {
    let ref = useRef(null)
    let plotObj: any = null
  
    useCreatePlot(async () => {
      const currRef = ref.current
      let obj = await createStackedArea(currRef)
      plotObj = obj
    })
  
    return (
      <div className="plot">
        <div className="plot plot--container">
          <h3 id="stacked-area-plot">Stacked Area Plot</h3>
          <div className="plot plot--area" ref={ref}></div>
          <div className="plot plot--description">
            <p>
              Stacked Area plot is for rendering such n such. Good for which types of visual, bad for
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