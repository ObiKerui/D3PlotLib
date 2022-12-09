import React, { useRef, useLayoutEffect, useState, useEffect } from 'react'
import np from './NumpyClone'
import useCreatePlot from './UseCreatePlot'

declare const d3: any
declare const d3PlotLib: any

function createHistogram(ref: any) {
  // let logmass: number[] = []

  let logmass1: number[] = np.random_normal(0, 1, 10000)
  let logmass2: number[] = np.random_normal(8, 2, 10000)

  let ms = np.linspace(-5, 20, 100)
  let mean: number = np.mean(logmass1)
  let std = np.std(logmass1)
  let pdf_norm: number[] = np.pdf(ms, mean, std)

  // console.log('mean / std / pdf_norm ', mean, std, d3.extent(pdf_norm))

  let scaler = d3PlotLib
    .Scaler()
    .xScale((xs: any) => {
      return d3.scaleLinear().domain(d3.extent(ms)).nice()
    })
    .yScale((ys: any) => {
      return d3.scaleLinear().domain(d3.extent(pdf_norm)).nice()
    })

  let hist1 = d3PlotLib.Hist().xs(ms).ys(logmass1).bins(100).density(true).alpha(0.4)

  let hist2 = d3PlotLib.Hist().xs(ms).ys(logmass2).bins(100).density(true).alpha(0.5)

  let plot = d3PlotLib.Plot().xs(ms).ys(pdf_norm).curve(d3.curveCardinal)

  // create a vertical line

  // create a fill-between above the line but below the curve.
  let condition = (x: any) => {
    return x > 0.9 && x < 2
  }

  let fillBetween = d3PlotLib
    .FillArea()
    .xs(ms)
    .ys(pdf_norm)
    .alpha(0.2)
    .where(condition)
    .colours(['blue'])
    .labels(['filled in'])

  let container = d3PlotLib
    .Container()
    .scale(scaler)
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .plot(hist1)
    .plot(hist2)
    .plot(plot)
    .plot(fillBetween)

  d3.select(ref).call(container)

  return container
}

export default function () {
  let ref = useRef(null)
  let plotObj: any = null

  useCreatePlot(async () => {
    const currRef = ref.current
    let obj = await createHistogram(currRef)
    plotObj = obj
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3>Histogram Plot</h3>
        <div className="plot plot--area" ref={ref}></div>
        <div className="plot plot--description">
          <p>
            Histogram plot is for rendering such n such. Good for which types of visual, bad for
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
