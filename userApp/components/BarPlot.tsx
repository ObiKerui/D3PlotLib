import React, { useRef, useLayoutEffect, useEffect } from 'react'
import useCreatePlot from './UseCreatePlot'
declare const d3: any
declare const d3PlotLib: any

async function createBarPlot(ref: HTMLDivElement) {
  let xs = [1, 2, 4]
  let ys1 = [4, 5, 6]
  let ys2 = [2, 3, 1]
  let ys3 = [5, 7, 7]

  let scaler = d3PlotLib
    .Scaler()
    .xScale((xs: any) => {
      return d3.scaleBand().domain(xs).padding(0.1)
    })
    .yScale((ys: any) => {
      let merged = [].concat.apply([], ys)
      return d3.scaleLinear().domain(d3.extent(merged))
    })

  let hist = d3PlotLib.BarPlot().xs(xs).alpha([0.4]).ys(ys1).labels(['text'])

  let plots = d3PlotLib.Plot().xs(xs).ys([ys1, ys2, ys3]).labels(['Norm', 'LogNorm', 'SkewNorm'])

  let legend = d3PlotLib.Legend()

  let container = d3PlotLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(hist)
    .plot(plots)
    .legend(legend)

  d3.select(ref).call(container)
  return container
}

export default function () {
  let ref = useRef(null)
  let plotObj: any = null

  useCreatePlot(async () => {
    const currRef = ref.current
    let obj = await createBarPlot(currRef)
    plotObj = obj
  })

  return (
    <div className='plot'>
      <div className="plot plot--container">
        <h3 id="bar-plot">Bar Plot</h3>
        <div className="plot plot--area" ref={ref}></div>
        <div className="plot plot--description">
          <p>Bar plot is for rendering such n such. Good for which types of visual, bad for these others..etc.</p>
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
