import React, { useRef, useLayoutEffect, useEffect } from 'react'
import useCreatePlot from '../UseCreatePlot'
declare const d3: any
declare const d3PlotLib: any

async function createBarPlot(ref: HTMLDivElement) {
  let xs = [1, 2, 3, 4, 5, 6, 7, 8]
  let bars = [4, 5, 6, 6, 6, 7, 8, 9]
  let yLineData = [2, 5]

  let scaler = d3PlotLib
    .Scaler()
    .xScale((xs: any) => {
      return d3.scaleBand().domain(xs).padding(0.1)
    })
    .yScale((ys: any) => {
      let merged = [].concat.apply([], ys)
      return d3.scaleLinear().domain([0, d3.extent(merged)[1] + 1])
    })

  let hist = d3PlotLib.BarPlot().xs(xs).alpha([0.8]).ys(bars).labels(['Profit'])

  // let plots = d3PlotLib.Plot()
  // .xs(xs)
  // .ys([baseline, target])
  // .labels(['Baseline', 'Target'])
  // .colours(['blue', 'green'])

    let yLines = d3PlotLib.AyLine()
    .ys(yLineData)

  let legend = d3PlotLib.Legend()

  let container = d3PlotLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(hist)
    .plot(yLines)
    .legend(legend)

  d3.select(ref).call(container)
  return container
}

export default function () {
  let ref = useRef<HTMLDivElement | null>(null)
  let plotObj: any = null

  useCreatePlot(async () => {
    const currRef = ref.current
    let obj = await createBarPlot(currRef)
    plotObj = obj
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="bar-plot">Bar Plot</h3>
        <div className="plot plot--area" ref={ref}></div>
        <div className="plot plot--description">
          <p>
            Bar plot is for rendering such n such. Good for which types of visual, bad for these
            others..etc.
          </p>
        </div>
      </div>
      <div className="plot plot--code">
        <code>how to paste in the code here?</code>
      </div>
    </div>
  )
}
