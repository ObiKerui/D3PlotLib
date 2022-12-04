import React, { useRef, useLayoutEffect, useState, useEffect } from 'react'
import useCreatePlot from './UseCreatePlot'

declare const d3: any
declare const d3PlotLib: any

async function createBoxPlot(ref: any) {

    // d3 reads in csv data as an array of json
    let csvresult = await d3.csv('assets/iris.csv')
  
    let labels = Object.keys(csvresult[0])
    labels = labels.slice(0, -1)
  
    // create an empty array for each label 
    let arrays: any = labels.reduce((accumulator, value) => {
      return {...accumulator, [value]: []}
    }, {})
  
    csvresult.forEach((elem: any) => {
      labels.forEach((e: any) => { 
        arrays[e as keyof any].push(+(elem[e]))
      })
      return elem
    })
  
    let ys = Object.values(arrays)
  
    let scaler = d3PlotLib.Scaler()
      .xScale((xs: any) => {
        return d3
          .scaleBand()
          .domain(labels)
          .paddingInner(1)
          .paddingOuter(0.5)
      })
      .yScale((ys: any) => {
        return d3.scaleLinear()
        .domain([-10, 10])
      })
  
    let boxplot = d3PlotLib.BoxPlot()
    .ys(ys)
    .labels(labels)
  
    let container = d3PlotLib
      .Container()
      .xAxisLabel('X Axis')
      .yAxisLabel('Y Axis')
      .scale(scaler)
      .plot(boxplot)
  
    d3.select(ref).call(container)
  
    return container
  }
  
  export default function () {
    let ref = useRef(null)
    let plotObj: any = null
  
    useCreatePlot(async () => {
      const currRef = ref.current
      let obj = await createBoxPlot(currRef)
      plotObj = obj
    })
  
    return (
      <div className="plot">
        <div className="plot plot--container">
          <h3>Box Plot</h3>
          <div className="plot plot--area" ref={ref}></div>
          <div className="plot plot--description">
            <p>
              Box plot is for rendering such n such. Good for which types of visual, bad for
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