/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'

import CodeBlock from '../CodeBlock'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

async function createViolinPlot(ref: any) {
  const csvresult = await d3.csv('assets/iris.csv')

  let labels = Object.keys(csvresult[0])
  labels = labels.slice(0, -1)

  // create an empty array for each label
  const arrays: any = labels.reduce((accumulator, value) => ({ ...accumulator, [value]: [] }), {})

  csvresult.forEach((elem: any) => {
    labels.forEach((e: any) => {
      arrays[e as keyof any].push(+elem[e])
    })
    return elem
  })

  const ys = Object.values(arrays)

  const scaler = d3PlotLib
    .Scaler()
    .xScale(() => d3.scaleBand().domain(labels).paddingInner(0.1).paddingOuter(0.1))
    .yScale(() => d3.scaleLinear().domain([-10, 10]))

  const boxplot = d3PlotLib.ViolinPlot().ys(ys).labels(labels)

  const container = (d3PlotLib.Container() as any)
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(boxplot)

  d3.select(ref).call(container)

  return container
}

export default function () {
  const ref = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createViolinPlot(currRef)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="violin-plot">Violin Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Violin plot is for rendering such n such. Good for which types of visual, bad for these
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
