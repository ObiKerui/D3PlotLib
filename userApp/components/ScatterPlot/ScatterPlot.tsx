/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'

import useCreatePlot from '../UseCreatePlot'
import CodeBlock from '../CodeBlock'
import content from './create'

import '../plot.css'

const np = {
  linspace(from: number, stop: number, len: number) {
    const multiplier = (stop - from) / len
    const arr = d3.range(from, stop, multiplier)
    return arr
  },

  mean(arr: Iterable<d3.Numeric>) {
    return d3.mean(arr)
  },

  std(arr: Iterable<d3.Numeric>) {
    return d3.deviation(arr)
  },

  random_normal(mu: number, sigma: number, len: number) {
    const ftn = d3.randomNormal(mu, sigma)
    const arr = Array.from({ length: len }, () => ftn())
    return arr
  },
}

// const norm = {
//   pdf(xs: number[]): number[] {
//     const fnorm = (x: number) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp((-x * x) / 2)
//     const result = xs.map((elem: number) => fnorm(elem))
//     // var y = new Array()
//     // for (var i = 0 ; i < x.length ; i++) {
//     //     y[i] = fnorm(x[i])
//     // }
//     return result
//   },
// }

async function createScatterPlot(ref: HTMLDivElement) {
  const csvresult = await d3.csv('assets/iris.csv')

  const xs = np.linspace(0, 160, 160)

  const keys = Object.keys(csvresult[0])
  const obj: any = keys.reduce((accumulator, value) => ({ ...accumulator, [value]: [] }), {})

  csvresult.forEach((elem: { [x: string]: any }) => {
    keys.forEach((e) => {
      obj[e].push(+elem[e])
    })
    return elem
  })

  const ys = Object.values(obj)

  const scaler = d3PlotLib
    .Scaler()
    .xScale((_xs: Iterable<d3.Numeric>) => d3.scaleLinear().domain(d3.extent(_xs)))
    .yScale((_ys: Iterable<d3.Numeric>) => {
      const merged: Iterable<d3.Numeric> = [].concat([], ..._ys)
      return d3.scaleLinear().domain(d3.extent(merged))
    })

  const scatterPlot = d3PlotLib
    .ScatterPlot()
    .xs(xs)
    .ys(ys)
    .colours(['red', 'green', 'blue', 'black'])
    .labels(keys)

  const container = (d3PlotLib.Container() as any)
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(scatterPlot)
    .legend(d3PlotLib.Legend())

  d3.select(ref).call(container)

  return container
}

export default function () {
  const ref = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createScatterPlot(currRef)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="scatter-plot">Scatter Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Scatter plot is for rendering such n such. Good for which types of visual, bad for these
            others..etc.
          </p>
        </div>
      </div>
      <div className="plot plot--code">
        <CodeBlock content={content} />
      </div>
    </div>
  )
}
