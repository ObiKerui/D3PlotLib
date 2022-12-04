import React, { useRef, useLayoutEffect, useState, useEffect } from 'react'
declare const d3: any
declare const d3PlotLib: any

import useCreatePlot from './UseCreatePlot'

import './plot.css'

let np = {
  linspace(from: number, stop: number, len: number) {
    let multiplier = (stop - from) / len
    let arr = d3.range(from, stop, multiplier)
    return arr
  },

  mean(arr: any) {
    return d3.mean(arr)
  },

  std(arr: any) {
    return d3.deviation(arr)
  },

  random_normal(mu: any, sigma: any, len: any) {
    let ftn = d3.randomNormal(mu, sigma)
    let arr = Array.from({ length: len }, () => ftn())
    return arr
  },

  histogram(arr: any, bins: number) {
    let extents = d3.extent(arr)
    let range = extents[1] - extents[0]
    let binSize = range / bins
    let binFtn = d3.bin().thresholds(bins)
    let results = binFtn(arr)
  },
}

let norm = {
  pdf(xs: number[], mean: number, std: number): number[] {
    let fnorm = (x: number) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp((-x * x) / 2)
    let result = xs.map((elem: number, ith: number) => {
      return fnorm(elem)
    })
    // var y = new Array()
    // for (var i = 0 ; i < x.length ; i++) {
    //     y[i] = fnorm(x[i])
    // }
    return result
  },
}

async function createScatterPlot(ref: HTMLDivElement) {
  let csvresult = await d3.csv('assets/iris.csv')

  let xs = np.linspace(0, 160, 160)

  let keys = Object.keys(csvresult[0])
  let obj: any = keys.reduce((accumulator, value) => {
    return { ...accumulator, [value]: [] }
  }, {})

  csvresult.forEach((elem: { [x: string]: any }) => {
    keys.forEach((e) => {
      obj[e].push(+elem[e])
    })
    return elem
  })

  let ys = Object.values(obj)

  let scaler = d3PlotLib
    .Scaler()
    .xScale((xs: any) => {
      return d3.scaleLinear().domain(d3.extent(xs))
    })
    .yScale((ys: any) => {
      let merged = [].concat.apply([], ys)
      return d3.scaleLinear().domain(d3.extent(merged))
    })

  let scatterPlot = d3PlotLib
    .ScatterPlot()
    .xs(xs)
    .ys(ys)
    .colours(['red', 'green', 'blue', 'black'])
    .labels(keys)

  let container = d3PlotLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(scatterPlot)
    .legend(d3PlotLib.Legend())

  d3.select(ref).call(container)

  return container
}

export default function () {
  let ref = useRef(null)
  let plotObj = null

  useCreatePlot(async () => {
    const currRef = ref.current
    let obj = await createScatterPlot(currRef)
    plotObj = obj
  })

  return (
    <div className='plot'>
      <div className="plot plot--container">
        <h3>Scatter Plot</h3>
        <div className="plot plot--area" ref={ref}></div>
        <div className="plot plot--description">
          <p>Scatter plot is for rendering such n such. Good for which types of visual, bad for these others..etc.</p>
        </div>
      </div>
      <div className="plot plot--code">
        <code>
          how to paste in the code here?          
        </code>
      </div>
    </div>
  )
}
