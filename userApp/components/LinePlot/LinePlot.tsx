/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'
import CodeBlock from '../CodeBlock'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

import '../plot.css'

function createLinePlot(ref: HTMLDivElement) {
  const xs = [1, 2, 4, 4.1, 5]
  const ys1 = [4, 5, 6, 6, 8]
  const ys2 = [2, 3, 1, 2, 3]
  const ys3 = [4, 5, 2, 1, 1]

  const makeXScale = (_xs: number[]) => d3.scaleLinear().domain(d3.extent(_xs))

  const makeYScale = (ys: []) => {
    const merged = [].concat([], ...ys)
    return d3.scaleLinear().domain(d3.extent(merged))
  }

  const scaler = d3PlotLib.Scaler().xScale(makeXScale).yScale(makeYScale)

  const plot1 = d3PlotLib.Plot().tag('plot1').xs(xs).ys(ys1).labels('Norm')

  const plot2 = d3PlotLib.Plot().xs(xs).ys(ys2).labels('LogNorm').styles('--').alpha(0.3)

  const plot3 = d3PlotLib.Plot().xs(xs).ys(ys3).labels('SkewNorm')

  const vLine = d3PlotLib.AxLine().xs([2.8]).labels('Cut Off').alpha(0.5).styles('--')

  // create a fill-between above the line but below the curve.
  const condition = (x: any) => x > 1.8 && x <= 4.6

  const fillBetween = d3PlotLib
    .FillArea()
    .xs(xs)
    .ys(ys1)
    .tag('fill')
    .alpha(0.2)
    .where(condition)
    .colours(['blue'])
    .labels(['filled in'])

  const legend = d3PlotLib.Legend().position('topleft')

  const container = (d3PlotLib.Container() as any)
    .showMargins(false)
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(plot1)
    .plot(plot2)
    .plot(plot3)
    .plot(vLine)
    .plot(fillBetween)
    .legend(legend)

  d3.select(ref).call(container)

  return container
}

export default function () {
  const ref = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createLinePlot(currRef)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="line-plot">Line Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Line plot is for rendering such n such. Good for which types of visual, bad for these
            others..etc.
          </p>
        </div>
      </div>
      <div className="plot plot--code">
        <code>
          <CodeBlock content={content} />
        </code>
      </div>
    </div>
  )
}
