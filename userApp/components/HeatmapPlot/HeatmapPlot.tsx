/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import * as d3 from 'd3'
import * as d3Collection from 'd3-collection'
import * as d3PlotLib from '../../../d3PlotLib/main'
import CodeBlock from '../CodeBlock'
import useCreatePlot from '../UseCreatePlot'
import content from './create'

async function createHeatmapPlot(ref: any) {
  const csvresult = await d3.csv('assets/heatmap.csv')

  type Element = {
    country?: string
    product?: string
    value?: any
  }

  const data = csvresult.map((item: any) => {
    const newItem: Element = {}
    newItem.country = item.x
    newItem.product = item.y
    newItem.value = item.value

    return newItem
  })

  const xElements = d3Collection.set(data.map((item: any) => item.product)).values()
  const yElements = d3Collection.set(data.map((item: any) => item.country)).values()

  const scaler = d3PlotLib
    .Scaler()
    .xScale(() => d3.scaleBand().domain(xElements).padding(0.1))
    .yScale(
      () => d3.scaleBand().domain(yElements).padding(0.1)
      // .bandwidth([0, y_elements.length * itemSize]);
    )

  const heatmap = d3PlotLib.Heatmap().ys(data)

  const container = d3PlotLib
    .Container()
    .xAxisText({ rotation: 65 })
    .yAxisText({ rotation: -40 })
    .scale(scaler)
    .plot(heatmap)

  d3.select(ref).call(container)

  return container
}

export default function () {
  const ref = useRef(null)

  useCreatePlot(async () => {
    const currRef = ref.current
    await createHeatmapPlot(currRef)
  })

  return (
    <div className="plot">
      <div className="plot plot--container">
        <h3 id="heatmap-plot">Heatmap Plot</h3>
        <div className="plot plot--area" ref={ref} />
        <div className="plot plot--description">
          <p>
            Heatmap plot is for rendering such n such. Good for which types of visual, bad for these
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
