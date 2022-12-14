import React, { useRef, useEffect, useLayoutEffect } from 'react'
import useCreatePlot from './UseCreatePlot'
import useResize from './UseResize'
declare const d3: any
declare const d3PlotLib: any
declare const _: any

async function createLinePlot(ref: HTMLDivElement) {
  let scaler = d3PlotLib
    .Scaler()
    .xScale((xs: any) => {
      return d3.scaleLinear().domain(d3.extent(xs))
    })
    .yScale((ys: any) => {
      let merged = [].concat.apply([], ys)
      return d3.scaleLinear().domain(d3.extent(merged))
    })

  let plot1 = d3PlotLib.Plot().tag('plot1').labels('Norm')

  let plot2 = d3PlotLib.Plot().tag('plot2').labels('SkewNorm')

  let container = d3PlotLib
    .Container()
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(plot1)
    .plot(plot2)
    .legend(d3PlotLib.Legend())

  d3.select(ref).call(container)

  return container
}

export default function () {
  let ref = useRef(null)
  let plotObj: any = null

  useCreatePlot(async () => {
    const currRef = ref.current
    let obj = await createLinePlot(currRef)
    plotObj = obj
  })

  useResize(() => {
    if(plotObj) {
      const currRef = ref.current
      plotObj(d3.select(currRef))
    }
  })

  function updatePlot() {
    if (plotObj) {
      const currRef = ref.current
      plotObj.plot('plot1').xs([1, 2, 3]).ys([2, 4, 5])

      plotObj(d3.select(currRef))
    }
  }

  // return (
  //   <>
  //     <h3>Dynamic Line Plot</h3>
  //     <button className="btn btn-primary" onClick={() => updatePlot()}>
  //       Update Me!
  //     </button>
  //     <div ref={ref}></div>
  //   </>
  // )

  return (
    <div className='plot'>
      <div className="plot plot--container">
        <h3 id="dynamic-line-plot">Dynamic Line Plot</h3>
        <div className="plot--controls">
          <button className="btn btn-primary" onClick={() => updatePlot()}>
            Update Me!
          </button>
        </div>
        <div className="plot plot--area" ref={ref}></div>
        <div className="plot plot--description">
          <p>Dynamic Line plot is for rendering such n such. Good for which types of visual, bad for these others..etc.</p>
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
