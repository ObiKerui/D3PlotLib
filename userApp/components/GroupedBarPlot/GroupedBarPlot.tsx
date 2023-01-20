/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3PlotLib from '../../../d3PlotLib/main'
import CodeBlock from '../CodeBlock'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

async function createGroupedBarPlot(ref: HTMLElement) {
  const csvdata = await d3.csv('assets/data_stacked.csv')

  // const labels = csvdata.columns
  // const subgroups = ['banana', 'poacee', 'sorgho']

  const groups = csvdata.map((d: any) => d.group)

  // const groupKeys = groups.keys()

  const scaler = d3PlotLib
    .Scaler()
    .xScale(() => d3.scaleBand().domain(groups).padding(0.1))
    .yScale(() => d3.scaleLinear().domain([0, 40]))

  const bars = d3PlotLib.GroupedBarPlot().alpha([0.4]).ys(csvdata).labels(['text'])

  const legend = d3PlotLib.Legend()

  const container = (d3PlotLib.Container() as any)
    .xAxisLabel('X Axis')
    .yAxisLabel('Y Axis')
    .scale(scaler)
    .plot(bars)
    .legend(legend)

  d3.select(ref).call(container)
  return container
}

export default function () {
  const ref = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createGroupedBarPlot(currRef)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="grouped-bar-plot">Grouped Bar Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Grouped Bar Plot is for rendering such n such. Good for which types of visual, bad for
            these others..etc.
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
