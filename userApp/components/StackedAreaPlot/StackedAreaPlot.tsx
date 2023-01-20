/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'

import CodeBlock from '../CodeBlock'
import np from '../NumpyClone'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

function createStackedArea(ref: any) {
  // matplotlib style
  const dte1 = new Date(2022, 8)
  const dte2 = new Date(2022, 9)
  const dte3 = new Date(2022, 10)
  const dte4 = new Date(2022, 11)
  const dte5 = new Date(2022, 12)

  const x = [dte1, dte2, dte3, dte4, dte5]

  const y1 = [1, 1, 2, 3, 5]
  const y2 = [0, 4, 2, 6, 8]
  const y3 = [1, 3, 5, 7, 9]
  const labels = ['Fibonacci ', 'Evens', 'Odds']

  const scaler = d3PlotLib
    .Scaler()
    .xScale((xs: Iterable<Date>) => d3.scaleTime().domain(d3.extent(xs)))
    .yScale(() => d3.scaleLinear().domain([0, 25]))

  const stackplot = d3PlotLib.StackedArea().xs(x).ys([y1, y2, y3]).labels(labels)

  const legend = d3PlotLib.Legend()

  const container = (d3PlotLib.Container() as any)
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
  const ref = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createStackedArea(currRef)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="stacked-area-plot">Stacked Area Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Stacked Area plot is for rendering such n such. Good for which types of visual, bad for
            these others..etc.
          </p>
        </div>
      </div>
      <div className="plot plot--code">
        <CodeBlock content={content} />
      </div>
    </div>
  )
}
