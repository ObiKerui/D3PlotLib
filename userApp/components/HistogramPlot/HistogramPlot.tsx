/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'
import CodeBlock from '../CodeBlock'
import np from '../NumpyClone'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

function createHistogram(ref: any) {
  // let logmass: number[] = []

  const logmass1: number[] = np.random_normal(0, 1, 10000)
  const logmass2: number[] = np.random_normal(8, 2, 10000)

  const ms = np.linspace(-5, 20, 100)
  const mean: number = np.mean(logmass1)
  const std = np.std(logmass1)
  const pdfNorm: number[] = np.pdf(ms, mean, std)

  // console.log('mean / std / pdf_norm ', mean, std, d3.extent(pdf_norm))

  const scaler = d3PlotLib
    .Scaler()
    .xScale(() => d3.scaleLinear().domain(d3.extent(ms)).nice())
    .yScale(() => d3.scaleLinear().domain(d3.extent(pdfNorm)).nice())

  const hist1 = d3PlotLib.Hist().xs(ms).ys(logmass1).bins(100).density(true).alpha(0.4)

  const hist2 = d3PlotLib.Hist().xs(ms).ys(logmass2).bins(100).density(true).alpha(0.5)

  const plot = d3PlotLib.Plot().xs(ms).ys(pdfNorm).curve(d3.curveCardinal)

  // create a vertical line

  // create a fill-between above the line but below the curve.
  const condition = (x: any) => x > 0.9 && x < 2

  const fillBetween = d3PlotLib
    .FillArea()
    .xs(ms)
    .ys(pdfNorm)
    .alpha(0.2)
    .where(condition)
    .colours(['blue'])
    .labels(['filled in'])

  const container = d3PlotLib
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
  const ref = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createHistogram(currRef)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="histogram-plot">Histogram Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Histogram plot is for rendering such n such. Good for which types of visual, bad for
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
