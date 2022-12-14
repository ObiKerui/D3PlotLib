import React, { useRef, useLayoutEffect, useState, useEffect } from 'react'
import np from './NumpyClone'
import useCreatePlot from './UseCreatePlot'

declare const d3: any
declare const d3PlotLib: any

function createStackedBar(ref: any) {
    // matplotlib style
    let x = [1, 2, 3, 4, 5]
    let y1 = [1, 1, 2, 3, 5]
    let y2 = [0, 4, 2, 6, 8]
    let y3 = [1, 3, 5, 7, 9]
    let labels = ['Fibonacci ', 'Evens', 'Odds']
  
    let scaler = d3PlotLib.Scaler()
    .xScale((xs: any) => {
      return d3.scaleBand()
      .domain(xs)
      .padding(0.1)
    })
    .yScale((ys: any) => {
      return d3.scaleLinear()
      .domain([0, 25])
    })
  
    let stackplot = d3PlotLib.StackedBar()
    .xs(x)
    .ys([y1, y2, y3])
    .labels(labels)
  
    let legend = d3PlotLib.Legend()
  
    let container = d3PlotLib
      .Container()
      .xAxisLabel('X label')
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
      let obj = await createStackedBar(currRef)
      plotObj = obj
    })
  
    return (
      <div className="plot">
        <div className="plot plot--container">
          <h3 id="stacked-bar-plot">Stacked Bar Plot</h3>
          <div className="plot plot--area" ref={ref}></div>
          <div className="plot plot--description">
            <p>
              Stacked Bar plot is for rendering such n such. Good for which types of visual, bad for
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
  